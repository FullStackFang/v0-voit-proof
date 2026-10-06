import { describe, expect, test } from "vitest";
import { buildBank, loadBank } from "./bank";
import { drawSet, type Random } from "./draw";

/** Seeded random (mulberry32) so draws are repeatable. */
function seeded(seed: number): Random {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const bank = loadBank();
const PACK = "education-platform-engineer";
const item = (id: string) => bank.items.get(id)!;

describe("embed set", () => {
  test.each([1, 2, 3, 4, 5, 6, 7, 8])("is 3 gold and 1 open decide or rank, and no write item (seed %i)", (seed) => {
    const set = drawSet(bank, PACK, "embed", seeded(seed))!;
    expect(set).toHaveLength(4);
    expect(new Set(set).size).toBe(4);
    const calls = set.slice(0, 4).map(item);
    expect(calls.filter((i) => i.kind === "gold")).toHaveLength(3);
    expect(calls.filter((i) => i.kind === "open" && i.format !== "write")).toHaveLength(1);
    expect(set.map(item).some((i) => i.format === "write")).toBe(false);
  });

  test("draws vary across sessions", () => {
    const sets = new Set([1, 2, 3, 4, 5, 6, 7, 8].map((s) => drawSet(bank, PACK, "embed", seeded(s))!.join()));
    expect(sets.size).toBeGreaterThan(1);
  });

  test("the open item is not always in the same place", () => {
    const places = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => {
      const set = drawSet(bank, PACK, "embed", seeded(s))!;
      return set.findIndex((id) => item(id).kind === "open");
    }));
    expect(places.size).toBeGreaterThan(1);
  });
});

describe("practice set", () => {
  test("is every unretired item in the pack", () => {
    const set = drawSet(bank, PACK, "practice", seeded(1))!;
    expect([...set].sort()).toEqual([...bank.packs.get(PACK)!.items].sort());
  });
});

describe("retired items", () => {
  const artifact = { kind: "text", label: "l", body: "b" };
  const gold = (id: string, retired?: boolean) => ({ id, kind: "gold", area: "ops", format: "decide", artifact, question: "q", options: ["a", "b"], answer: 0, reason: "r", retired });
  const small = buildBank(
    [gold("g1"), gold("g2"), gold("g3"), gold("gone", true),
      { id: "o1", kind: "open", area: "ops", format: "decide", artifact, question: "q", options: ["a", "b"] },
      { id: "w1", kind: "open", area: "ops", format: "write", artifact, question: "q" }],
    [{ id: "p", name: "P", employer: "E", items: ["g1", "g2", "g3", "gone", "o1", "w1"] }],
  );

  test.each(["embed", "practice"] as const)("are never drawn in %s", (mode) => {
    for (let s = 1; s <= 20; s++) expect(drawSet(small, "p", mode, seeded(s))).not.toContain("gone");
  });
});

test("an unknown pack draws nothing", () => {
  expect(drawSet(bank, "nope", "embed")).toBeNull();
});
