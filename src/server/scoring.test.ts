import { describe, expect, test, vi } from "vitest";
import { loadBank } from "./bank";
import { goldAccuracy, profile, scoreDecide, scoreItem, scoreRank } from "./scoring";

const bank = loadBank();
const item = (id: string) => bank.items.get(id)!;

describe("scoreItem", () => {
  test("is deterministic: same answer, same score, no network call", () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("no network in scoring"));
    try {
      for (const [id, answer] of [["consent-age", 3], ["consent-age", 0], ["merge-duplicates", [2, 3, 0, 1]], ["merge-duplicates", [3, 2, 0, 1]]] as const) {
        expect(scoreItem(item(id), answer)).toBe(scoreItem(item(id), answer));
      }
      expect(fetch).not.toHaveBeenCalled();
    } finally {
      fetch.mockRestore();
    }
  });

  test("scores gold decide and rank items from the stored answer", () => {
    expect(scoreItem(item("consent-age"), 3)).toBe(1);
    expect(scoreItem(item("consent-age"), 0)).toBe(0);
    expect(scoreItem(item("merge-duplicates"), [2, 3, 0, 1])).toBe(1);
    expect(scoreItem(item("merge-duplicates"), [3, 2, 0, 1])).toBe(0.5);
  });

  test("open decide and rank items are not scored", () => {
    expect(scoreItem(item("school-isolation"), 1)).toBeNull();
    expect(scoreItem(item("review-before-send"), [0, 1, 2, 3])).toBeNull();
  });

  test("write items are never scored", () => {
    expect(scoreItem(item("firewall-ssh"), "You lose SSH on port 22.")).toBeNull();
  });
});

describe("decide", () => {
  test("right option scores 1", () => expect(scoreDecide(2, 2)).toBe(1));
  test("wrong option scores 0", () => expect(scoreDecide(2, 1)).toBe(0));
});

describe("rank", () => {
  const answer = [0, 1, 2, 3]; // A B C D
  test("exact order scores 1", () => expect(scoreRank(answer, [0, 1, 2, 3])).toBe(1));
  test("one adjacent swap scores 0.5 (A C B D)", () => expect(scoreRank(answer, [0, 2, 1, 3])).toBe(0.5));
  test("two swaps score 0 (B A D C)", () => expect(scoreRank(answer, [1, 0, 3, 2])).toBe(0));
  test("a non-adjacent swap scores 0 (C B A D)", () => expect(scoreRank(answer, [2, 1, 0, 3])).toBe(0));
});

describe("profile", () => {
  test("sums per area with the number graded, no overall score", () => {
    const p = profile([
      { area: "records", score: 1 },
      { area: "records", score: 0.5 },
      { area: "ops", score: 0 },
    ]);
    expect(p).toEqual({ records: { earned: 1.5, of: 2 }, ops: { earned: 0, of: 1 } });
  });
  test("areas not seen are absent", () => expect(profile([])).toEqual({}));
});

describe("gold accuracy", () => {
  test("total gold score over gold items graded", () => expect(goldAccuracy([1, 0.5, 1, 0])).toBe(0.625));
  test("null when nothing was graded", () => expect(goldAccuracy([])).toBeNull());
});
