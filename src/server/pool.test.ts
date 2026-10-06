import { beforeAll, describe, expect, test } from "vitest";
import type { JWK } from "jose";
import { orderPool } from "./pool";
import { newSigningKey, signResult, toPublicJwk, type ResultPayload } from "./result";

let key: JWK;
let pub: JWK;
beforeAll(async () => {
  key = await newSigningKey("test");
  pub = toPublicJwk(key);
});

const noFlags = { timeAwaySeconds: 0, pasteAttempts: 0, bulkInputs: 0 };

/** A genuine embed token with this many gold points of 3. */
function token(earned: number, flags = noFlags, written: string | null = "words", reasoning?: ResultPayload["reasoning"]) {
  const payload: ResultPayload = {
    sessionId: crypto.randomUUID(),
    pack: "education-platform-engineer",
    mode: "embed",
    items: ["a", "b", "c", "d", "e"],
    profile: { records: { earned: Math.min(earned, 2), of: 2 }, ops: { earned: Math.max(earned - 2, 0), of: 1 } },
    reasoning,
    written,
    totalSeconds: 180,
    flags,
  };
  return signResult(payload, key);
}

const labels = (pool: Awaited<ReturnType<typeof orderPool>>) => pool.tiers.map((t) => t.applicants.map((a) => a.label));

describe("/pool ordering", () => {
  test("genuine tokens are ordered by total gold score, highest first, with profile, flags and written answer", async () => {
    const text = [`Ann ${await token(3)}`, `Bo ${await token(1.5)}`, `Cy ${await token(2.5, noFlags, "SSH is refused")}`].join("\n");
    const pool = await orderPool(text, pub);
    expect(pool.tiers.map((t) => t.earned)).toEqual([3, 2.5, 1.5]);
    expect(labels(pool)).toEqual([["Ann"], ["Cy"], ["Bo"]]);
    const cy = pool.tiers[1].applicants[0];
    expect(cy.of).toBe(3);
    expect(cy.payload.written).toBe("SSH is refused");
    expect(cy.payload.flags).toEqual(noFlags);
    expect(pool.unverified).toEqual([]);
  });

  test("ties stay one tier, in paste order", async () => {
    const text = [`Dee ${await token(2)}`, `Al ${await token(3)}`, `Eve ${await token(2)}`, `Bea ${await token(2)}`].join("\n");
    const pool = await orderPool(text, pub);
    expect(labels(pool)).toEqual([["Al"], ["Dee", "Eve", "Bea"]]);
  });

  test("a tampered token is listed as unverified with its label, and every genuine token is still ordered", async () => {
    const [h, body, sig] = (await token(3)).split(".");
    const claims = JSON.parse(Buffer.from(body, "base64url").toString());
    claims.profile.ops.earned = 5;
    const forged = [h, Buffer.from(JSON.stringify(claims)).toString("base64url"), sig].join(".");
    const text = [`Applicant 02 ${await token(1)}`, `Applicant 04   ${forged}`, `Applicant 07 ${await token(2)}`].join("\n");
    const pool = await orderPool(text, pub);
    expect(labels(pool)).toEqual([["Applicant 07"], ["Applicant 02"]]);
    expect(pool.unverified).toEqual([{ label: "Applicant 04", why: "not genuine" }]);
  });

  test("lines that are not tokens are kept as unverified, never dropped; blank lines are ignored", async () => {
    const text = `\nApplicant 13\n\n  ${await token(2)}  \nsee attached\n`;
    const pool = await orderPool(text, pub);
    expect(pool.pasted).toBe(3);
    expect(labels(pool)).toEqual([["Line 2"]]);
    expect(pool.unverified).toEqual([
      { label: "Applicant 13", why: "not a token" },
      { label: "see attached", why: "not a token" },
    ]);
  });

  test("flags are shown beside an applicant and never move them", async () => {
    const text = [`Clean ${await token(2)}`, `Flagged ${await token(2.5, { ...noFlags, pasteAttempts: 2 })}`].join("\n");
    const pool = await orderPool(text, pub);
    expect(labels(pool)).toEqual([["Flagged"], ["Clean"]]);
    expect(pool.tiers[0].applicants[0].payload.flags.pasteAttempts).toBe(2);
  });

  test("reasoning is shown and never reorders: same score, different reasoning, one tier in paste order", async () => {
    const weak = await token(3, noFlags, null, ["looks fine", "merge it", "ok", "fine"]);
    const strong = await token(3, noFlags, null, ["teacherId is never used", "the delete cannot be undone", "date-only string is UTC midnight", "ask the teacher"]);
    const pool = await orderPool(`Weak ${weak}
Strong ${strong}`, pub);
    expect(labels(pool)).toEqual([["Weak", "Strong"]]);
    expect(pool.tiers[0].applicants[1].payload.reasoning![0]).toBe("teacherId is never used");
  });

  test("a token signed by another key is not genuine", async () => {
    const other = await newSigningKey("other");
    const [, body] = (await token(3)).split(".");
    const theirs = await signResult(JSON.parse(Buffer.from(body, "base64url").toString()), other);
    const pool = await orderPool(`Zed ${theirs}`, pub);
    expect(pool.tiers).toEqual([]);
    expect(pool.unverified).toEqual([{ label: "Zed", why: "not genuine" }]);
  });
});
