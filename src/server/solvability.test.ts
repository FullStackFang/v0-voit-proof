import { describe, expect, test, vi } from "vitest";
import { loadBank, type Item } from "./bank";
import { parseReply, promptFor, runSolvability, type Ask } from "./solvability";

const bank = loadBank();
const PACK = "education-platform-engineer";
type GoldItem = Extract<Item, { format: "decide" | "rank" }>;
const gold = (id: string) => bank.items.get(id) as GoldItem;

describe("prompt", () => {
  test("is the public item: artifact, question, lettered options, no answer or reason", () => {
    const item = gold("consent-age");
    const prompt = promptFor(item);
    expect(prompt).toContain(item.artifact.body);
    expect(prompt).toContain(item.question);
    expect(prompt).toContain("D. false, which is wrong. They are 12 and need consent.");
    expect(prompt).not.toContain(item.reason!);
  });
});

describe("parser, on recorded replies", () => {
  const decide = gold("consent-age");
  const rank = gold("merge-duplicates");

  test.each([
    ["D", 3],
    ["**D**", 3],
    ["D.", 3],
    ["(b)", 1],
    ["The function subtracts years only, so the student reads as 13.\n\nD", 3],
    ["Answer: D", 3],
  ])("decide %j reads as %j", (reply, expected) => expect(parseReply(decide, reply)).toEqual(expected));

  test.each([
    ["C, D, A, B", [2, 3, 0, 1]],
    ["Order: C D A B", [2, 3, 0, 1]],
    ["Backups first.\nC, D, A, B", [2, 3, 0, 1]],
  ])("rank %j reads as %j", (reply, expected) => expect(parseReply(rank, reply)).toEqual(expected));

  test.each([
    [decide, "B or D, depending on the policy"],
    [decide, "E"],
    [decide, "I cannot tell from this."],
    [decide, "D, since a birthday later in the year makes them 12. A check by date is needed."],
    [rank, "C, D, A"],
    [rank, "C, C, A, B"],
  ])("unreadable reply %#", (item, reply) => expect(parseReply(item, reply)).toBeNull());
});

describe("report", () => {
  test("rates every gold item per model and across the pack, against the 30% target", async () => {
    // recorded behaviour: model-a gets consent-age right and answers no real option elsewhere; model-b is always unreadable
    const ask: Ask = async (model, prompt) => {
      if (model === "model-b") return "Hard to say.";
      return prompt.includes("needsConsent") ? "D" : "E";
    };
    const report = await runSolvability(bank, PACK, ["model-a", "model-b"], 5, ask);

    expect(report.items.map((i) => i.id).sort()).toEqual(
      ["bad-deploy", "consent-age", "due-date-zone", "grade-history", "gradebook-scope", "merge-duplicates"],
    );
    const consent = report.items.find((i) => i.id === "consent-age")!;
    expect(consent).toMatchObject({ tries: 10, right: 5, unreadable: 5, rate: 0.5 });
    expect(consent.byModel).toEqual({ "model-a": { tries: 5, right: 5 }, "model-b": { tries: 5, right: 0 } });
    expect(report.packRate).toBeCloseTo(5 / 60);
    expect(report.meetsTarget).toBe(true);
    expect(report.target).toBe(0.3);
  });

  test("a failing call counts as an unreadable try, not a crash", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const ask: Ask = async () => {
      throw new Error("overloaded");
    };
    const report = await runSolvability(bank, PACK, ["m"], 1, ask);
    expect(report.items.every((i) => i.unreadable === 1 && i.right === 0)).toBe(true);
    vi.restoreAllMocks();
  });

  test("makes no network call of its own", async () => {
    const fetch = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("no network"));
    await runSolvability(bank, PACK, ["m"], 1, async () => "A");
    expect(fetch).not.toHaveBeenCalled();
    fetch.mockRestore();
  });
});
