import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import type { JWK } from "jose";
import { loadBank, type Item } from "./bank";
import { newSigningKey, toPublicJwk, verifyResult } from "./result";
import { startSession, submitAnswer, type Deps } from "./sessions";
import { memoryStore } from "./store";

const bank = loadBank();
const PACK = "education-platform-engineer";
let key: JWK;
let store: ReturnType<typeof memoryStore>;
let clock: number;
let deps: Deps;

beforeAll(async () => {
  key = await newSigningKey("test");
});
beforeEach(() => {
  store = memoryStore();
  clock = Date.parse("2026-10-05T12:00:00Z");
  deps = { bank, store, key: () => key, now: () => new Date(clock) };
});

const item = (id: string) => bank.items.get(id)!;
const tick = (seconds: number) => (clock += seconds * 1000);

/** A right answer for gold items, a plausible one for the rest. */
function answerFor(i: Item): unknown {
  if (i.format === "write") return "Port 22 is never allowed, so SSH is refused.";
  if (i.kind === "gold") return i.answer;
  return i.format === "decide" ? 0 : i.options.map((_, n) => n);
}

async function start(mode: "embed" | "practice" = "embed") {
  const r = await startSession(deps, { pack: PACK, mode });
  if (r.status !== 201 || "error" in r.body) throw new Error(JSON.stringify(r.body));
  return r.body;
}

async function answer(sessionId: string, itemId: string, value: unknown = answerFor(item(itemId)), signals?: object) {
  return submitAnswer(deps, sessionId, { itemId, answer: value, signals });
}

describe("POST /api/sessions", () => {
  test("embed: returns the session and the first of 5 items, stripped", async () => {
    const s = await start("embed");
    expect(s.total).toBe(5);
    expect(s.position).toBe(1);
    expect(s.item).not.toHaveProperty("answer");
    expect(s.item).not.toHaveProperty("kind");
    expect(s.item).not.toHaveProperty("reason");
    const session = (await store.getSession(s.sessionId))!;
    expect(session.itemIds[0]).toBe(s.item.id);
    expect(item(session.itemIds[4]).format).toBe("write");
  });

  test("practice: every item in the pack", async () => {
    const s = await start("practice");
    expect(s.total).toBe(12);
  });

  test("mode defaults to embed", async () => {
    const r = await startSession(deps, { pack: PACK });
    expect(r.status).toBe(201);
    expect("total" in r.body && r.body.total).toBe(5);
  });

  test("unknown pack is not found and creates no session", async () => {
    const r = await startSession(deps, { pack: "nope" });
    expect(r.status).toBe(404);
    expect(store.exposure.size).toBe(0);
  });

  test("a bad body is rejected", async () => {
    expect((await startSession(deps, { mode: "embed" })).status).toBe(400);
    expect((await startSession(deps, { pack: PACK, mode: "exam" })).status).toBe(400);
  });

  test("exposure: first serve sets first-seen and count 1; later serves count up", async () => {
    const a = await start();
    expect(store.exposure.get(a.item.id)).toEqual({ firstServedAt: new Date(clock), serveCount: 1 });
    tick(60);
    await answer(a.sessionId, a.item.id);
    const second = (await store.getSession(a.sessionId))!.itemIds[1];
    expect(store.exposure.get(second)?.serveCount).toBeGreaterThanOrEqual(1);
    const firstSeen = store.exposure.get(a.item.id)!.firstServedAt;
    for (let n = 0; n < 5; n++) await start();
    expect(store.exposure.get(a.item.id)!.firstServedAt).toEqual(firstSeen);
  });
});

describe("POST /api/sessions/:id/answers", () => {
  test("an answer is stored and the next item returned", async () => {
    const s = await start();
    const r = await answer(s.sessionId, s.item.id);
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ done: false, position: 2, total: 5 });
    expect(await store.answers(s.sessionId)).toHaveLength(1);
  });

  test("answering out of turn is rejected and nothing is stored", async () => {
    const s = await start();
    const later = (await store.getSession(s.sessionId))!.itemIds[2];
    const r = await answer(s.sessionId, later);
    expect(r.status).toBe(409);
    expect(await store.answers(s.sessionId)).toHaveLength(0);
  });

  test("answering twice is rejected and the first answer stands", async () => {
    const s = await start();
    const first = item(s.item.id);
    await answer(s.sessionId, first.id);
    const again = await answer(s.sessionId, first.id, first.format === "write" ? "changed" : 0);
    expect(again.status).toBe(409);
    const rows = await store.answers(s.sessionId);
    expect(rows).toHaveLength(1);
    expect(rows[0].answer).toEqual(answerFor(first));
  });

  test("two answers racing for the same item: one is stored", async () => {
    const s = await start();
    const [a, b] = await Promise.all([answer(s.sessionId, s.item.id), answer(s.sessionId, s.item.id)]);
    expect([a.status, b.status].sort()).toEqual([200, 409]);
    expect(await store.answers(s.sessionId)).toHaveLength(1);
  });

  test("an answer that does not fit the item is rejected", async () => {
    const s = await start("practice");
    const i = item(s.item.id);
    const bad = i.format === "write" ? "x".repeat(281) : i.format === "decide" ? 9 : [0, 0, 0, 0];
    expect((await answer(s.sessionId, i.id, bad)).status).toBe(400);
  });

  test("unknown session is not found", async () => {
    expect((await submitAnswer(deps, "00000000-0000-4000-8000-000000000000", { itemId: "x", answer: 0 })).status).toBe(404);
  });

  test("timing comes from the server clock, whatever the browser says", async () => {
    const s = await start();
    tick(42);
    await submitAnswer(deps, s.sessionId, { itemId: s.item.id, answer: answerFor(item(s.item.id)), answeredAt: "1999-01-01", servedAt: "1999-01-01" });
    const [row] = await store.answers(s.sessionId);
    expect(row.servedAt).toEqual(new Date(Date.parse("2026-10-05T12:00:00Z")));
    expect(row.answeredAt.getTime() - row.servedAt.getTime()).toBe(42_000);
  });

  test("integrity signals are stored and never change the score", async () => {
    const s = await start();
    const clean = await answer(s.sessionId, s.item.id, undefined, { timeAwaySeconds: 20, pasteAttempts: 2, bulkInputs: 1 });
    expect(clean.status).toBe(200);
    const [row] = await store.answers(s.sessionId);
    expect(row.signals).toEqual({ timeAwaySeconds: 20, pasteAttempts: 2, bulkInputs: 1 });
    const i = item(s.item.id);
    expect(row.score).toBe(i.kind === "gold" ? 1 : null);
  });
});

describe("feedback", () => {
  test("embed reveals nothing for any item", async () => {
    const s = await start("embed");
    const ids = (await store.getSession(s.sessionId))!.itemIds;
    for (const id of ids) {
      const r = await answer(s.sessionId, id);
      expect(r.body).not.toHaveProperty("feedback");
    }
  });

  test("practice: right and reason after gold; insight with no verdict after write; nothing after open", async () => {
    const s = await start("practice");
    const ids = (await store.getSession(s.sessionId))!.itemIds;
    for (const id of ids) {
      const i = item(id);
      const r = await answer(s.sessionId, id);
      const fb = (r.body as { feedback?: object }).feedback;
      if (i.kind === "gold") expect(fb).toEqual({ right: true, reason: i.reason });
      else if (i.format === "write" && i.reason) expect(fb).toEqual({ reason: i.reason });
      else expect(fb).toBeUndefined();
    }
  });

  test("practice: a wrong gold answer says so", async () => {
    const s = await start("practice");
    const ids = (await store.getSession(s.sessionId))!.itemIds;
    for (const id of ids) {
      const i = item(id);
      if (i.kind === "gold" && i.format === "decide") {
        const wrong = (i.answer! + 1) % i.options.length;
        const r = await answer(s.sessionId, id, wrong);
        expect((r.body as { feedback?: object }).feedback).toEqual({ right: false, reason: i.reason });
        return;
      }
      await answer(s.sessionId, id);
    }
  });
});

describe("finishing", () => {
  test("the last answer finishes the session with the profile and a signed token", async () => {
    const s = await start("embed");
    const ids = (await store.getSession(s.sessionId))!.itemIds;
    let last;
    for (const [n, id] of ids.entries()) {
      tick(30);
      last = await answer(s.sessionId, id, undefined, n === 4 ? { pasteAttempts: 1 } : { timeAwaySeconds: 5 });
    }
    expect(last!.body).toMatchObject({ done: true });
    const body = last!.body as { profile: object; token: string };
    expect((await store.getSession(s.sessionId))!.finishedAt).not.toBeNull();

    const gold = ids.map(item).filter((i) => i.kind === "gold");
    const totalOf = Object.values(body.profile as Record<string, { earned: number; of: number }>).reduce((a, p) => a + p.of, 0);
    expect(totalOf).toBe(gold.length);

    const v = await verifyResult(body.token, toPublicJwk(key));
    expect(v.genuine).toBe(true);
    if (v.genuine) {
      expect(v.payload).toMatchObject({
        sessionId: s.sessionId,
        pack: PACK,
        mode: "embed",
        items: ids,
        profile: body.profile,
        written: "Port 22 is never allowed, so SSH is refused.",
        totalSeconds: 150,
        flags: { timeAwaySeconds: 20, pasteAttempts: 1, bulkInputs: 0 },
      });
    }
  });

  test("an answer after finish is rejected", async () => {
    const s = await start("embed");
    const ids = (await store.getSession(s.sessionId))!.itemIds;
    for (const id of ids) await answer(s.sessionId, id);
    expect((await answer(s.sessionId, ids[4])).status).toBe(409);
  });
});

describe("label feed", () => {
  test("open answers come with their session's gold accuracy, from finished sessions only", async () => {
    // one finished session with every gold right, one with every gold wrong, one left unfinished
    const play = async (goldRight: boolean, finish: boolean) => {
      const s = await start("embed");
      const ids = (await store.getSession(s.sessionId))!.itemIds;
      for (const id of finish ? ids : ids.slice(0, 2)) {
        const i = item(id);
        let value = answerFor(i);
        if (i.kind === "gold" && !goldRight && i.format === "decide") value = (i.answer! + 1) % i.options.length;
        if (i.kind === "gold" && !goldRight && i.format === "rank") value = [...i.answer!].reverse();
        await answer(s.sessionId, id, value);
      }
    };
    await play(true, true);
    await play(false, true);
    await play(true, false);

    const open = await store.openAnswers(bank.items);
    expect(open.map((a) => a.accuracy).sort()).toEqual([0, 1]);
    expect(open.every((a) => item(a.itemId).kind === "open" && a.format !== "write")).toBe(true);
  });
});
