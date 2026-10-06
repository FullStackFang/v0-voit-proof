import { beforeAll, describe, expect, test } from "vitest";
import type { JWK } from "jose";
import { newSigningKey, signResult, toPublicJwk, verifyResult, type ResultPayload } from "./result";

const payload: ResultPayload = {
  sessionId: "5d1c0e8e-1111-4222-8333-944455556666",
  pack: "education-platform-engineer",
  mode: "embed",
  items: ["consent-age", "school-isolation", "merge-duplicates", "grade-history", "firewall-ssh"],
  profile: { records: { earned: 1.5, of: 2 }, ops: { earned: 1, of: 2 } },
  written: "Port 22 is never allowed, so SSH is refused and I am locked out.",
  totalSeconds: 185,
  flags: { timeAwaySeconds: 20, pasteAttempts: 1, bulkInputs: 0 },
};

let key: JWK;
beforeAll(async () => {
  key = await newSigningKey("test");
});

describe("signed result", () => {
  test("a genuine token verifies with the public key and shows its payload", async () => {
    const token = await signResult(payload, key);
    const result = await verifyResult(token, toPublicJwk(key));
    expect(result.genuine).toBe(true);
    if (result.genuine) {
      expect(result.payload).toMatchObject(payload);
      expect(typeof result.payload.iat).toBe("number");
    }
  });

  test("the payload holds served ids and the written answer, and nothing else a caller passes", async () => {
    const leaky = { ...payload, answers: { "consent-age": 3 }, choices: [3, 1] } as ResultPayload;
    const [, body] = (await signResult(leaky, key)).split(".");
    const claims = JSON.parse(Buffer.from(body, "base64url").toString());
    expect(Object.keys(claims).sort()).toEqual(["flags", "iat", "items", "mode", "pack", "profile", "sessionId", "totalSeconds", "written"]);
    expect(claims.items).toEqual(payload.items);
    expect(claims.written).toBe(payload.written);
  });

  test("a token with an altered payload is not genuine", async () => {
    const [header, , signature] = (await signResult(payload, key)).split(".");
    const forged = Buffer.from(JSON.stringify({ ...payload, profile: { records: { earned: 2, of: 2 } } })).toString("base64url");
    expect(await verifyResult(`${header}.${forged}.${signature}`, toPublicJwk(key))).toEqual({ genuine: false });
  });

  test("a token signed by another key is not genuine", async () => {
    const other = await newSigningKey("other");
    expect(await verifyResult(await signResult(payload, other), toPublicJwk(key))).toEqual({ genuine: false });
  });

  test("garbage is not genuine", async () => {
    expect(await verifyResult("not a token", toPublicJwk(key))).toEqual({ genuine: false });
  });

  test("the public key carries no private part", () => {
    const pub = toPublicJwk(key);
    expect(pub).not.toHaveProperty("d");
    expect(pub).toMatchObject({ kty: "OKP", crv: "Ed25519", alg: "EdDSA", kid: "test" });
  });
});

test("/.well-known/voit-key serves the public key as a JWK", async () => {
  const { GET } = await import("@/app/.well-known/voit-key/route");
  process.env.VOIT_SIGNING_KEY = JSON.stringify(key);
  try {
    const body = await GET().json();
    expect(body).toEqual(toPublicJwk(key));
    expect(body).not.toHaveProperty("d");
  } finally {
    delete process.env.VOIT_SIGNING_KEY;
  }
});
