import { describe, expect, test } from "vitest";
import { buildBank, toPublic } from "./bank";

const artifact = { kind: "code", label: "x.ts", body: "x" };
const decide = (over: object = {}) => ({
  id: "d1", kind: "gold", area: "records", format: "decide", artifact,
  question: "Which?", options: ["a", "b", "c"], answer: 1, reason: "Because.", ...over,
});
const rank = (over: object = {}) => ({
  id: "r1", kind: "gold", area: "ops", format: "rank", artifact,
  question: "Order?", options: ["a", "b", "c"], answer: [2, 0, 1], reason: "Because.", ...over,
});
const write = (over: object = {}) => ({
  id: "w1", kind: "open", area: "rules", format: "write", artifact, question: "What?", reason: "The insight.", ...over,
});
const open = { id: "o1", kind: "open", area: "tenancy", format: "decide", artifact, question: "Which?", options: ["a", "b"] };

// the smallest pack an embed set can be drawn from: 3 gold, 1 open decide or rank, 1 write
const minimal = [decide({ id: "g1" }), decide({ id: "g2" }), rank({ id: "g3" }), open, write()];
const pack = (items: string[]) => ({ id: "p", name: "P", items });

describe("items", () => {
  test("valid items load", () => {
    const bank = buildBank([decide(), rank(), write(), write({ id: "w2", reason: undefined }), open], []);
    expect([...bank.items.keys()]).toEqual(["d1", "r1", "w1", "w2", "o1"]);
  });

  test.each([
    ["unknown format", decide({ format: "pick" })],
    ["decide with 5 options", decide({ options: ["a", "b", "c", "d", "e"] })],
    ["decide with 1 option", decide({ options: ["a"], answer: 0 })],
    ["rank with 2 options", rank({ options: ["a", "b"], answer: [0, 1] })],
    ["rank with 6 options", rank({ options: ["a", "b", "c", "d", "e", "f"], answer: [0, 1, 2, 3, 4, 5] })],
    ["unknown area", decide({ area: "billing" })],
    ["gold decide without answer", decide({ answer: undefined })],
    ["gold without reason", decide({ reason: undefined })],
    ["decide answer out of range", decide({ answer: 3 })],
    ["rank answer not an order", rank({ answer: [0, 0, 1] })],
    ["gold write item", write({ kind: "gold" })],
    ["write item with an answer", write({ answer: "x" })],
    ["write item with a rubric", write({ rubric: { insight: "i" } })],
    ["open with answer", { ...open, answer: 0 }],
    ["open decide with reason", { ...open, reason: "r" }],
    ["empty question", write({ question: "" })],
    ["retired that is not a flag", decide({ retired: "yes" })],
  ])("rejects %s, naming the item", (_name, item) => {
    expect(() => buildBank([item], [])).toThrow(/d1|r1|w1|o1/);
  });

  test("an item without an id is named by its position", () => {
    expect(() => buildBank([{ format: "decide" }], [])).toThrow(/item #1/);
  });

  test("duplicate ids are rejected", () => {
    expect(() => buildBank([decide(), decide()], [])).toThrow(/d1/);
  });

  test("a retired item still loads", () => {
    expect(buildBank([decide({ retired: true })], []).items.get("d1")?.retired).toBe(true);
  });
});

describe("packs", () => {
  test("a pack lists items that exist", () => {
    const bank = buildBank(minimal, [pack(["g1", "g2", "g3", "o1", "w1"])]);
    expect(bank.packs.get("p")?.items).toEqual(["g1", "g2", "g3", "o1", "w1"]);
  });

  test("a pack with a missing item names the pack and the id", () => {
    expect(() => buildBank(minimal, [pack(["g1", "g2", "g3", "o1", "w1", "nope"])])).toThrow(/p.*nope/);
  });

  test.each([
    ["fewer than 3 gold", ["g1", "g2", "o1", "w1"]],
    ["no open decide or rank", ["g1", "g2", "g3", "w1"]],
    ["no write item", ["g1", "g2", "g3", "o1"]],
  ])("a pack with %s is too small, naming the pack", (_name, ids) => {
    expect(() => buildBank(minimal, [pack(ids)])).toThrow(/Pack p is too small/);
  });

  test("retired items do not count toward the minimum", () => {
    const items = [...minimal.slice(0, 2), rank({ id: "g3", retired: true }), open, write()];
    expect(() => buildBank(items, [pack(["g1", "g2", "g3", "o1", "w1"])])).toThrow(/too small/);
  });

  test("a pack still loads with a retired gold item if enough gold remain", () => {
    const items = [...minimal, decide({ id: "g4", retired: true })];
    expect(() => buildBank(items, [pack(["g1", "g2", "g3", "g4", "o1", "w1"])])).not.toThrow();
  });
});

describe("toPublic", () => {
  test.each([decide(), rank(), write(), open, decide({ id: "d2", retired: false })])("strips answer, reason, kind and retired from $id", (raw) => {
    const item = buildBank([raw], []).items.get(raw.id)!;
    const pub = toPublic(item) as Record<string, unknown>;
    for (const key of ["answer", "reason", "rubric", "kind", "retired"]) expect(pub).not.toHaveProperty(key);
    expect(pub).toMatchObject({ id: raw.id, format: raw.format, question: raw.question });
  });
});
