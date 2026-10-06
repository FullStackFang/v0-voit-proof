import { describe, expect, test } from "vitest";
import { labelReport, type OpenAnswer } from "./labels";

const votes = (itemId: string, format: OpenAnswer["format"], list: [unknown, number | null][]): OpenAnswer[] =>
  list.map(([answer, accuracy]) => ({ itemId, format, answer, accuracy }));
const times = <T,>(n: number, v: T) => Array.from({ length: n }, () => v);

describe("label report", () => {
  test("a low-accuracy session does not count toward the label", () => {
    const [row] = labelReport(votes("o", "decide", [[1, 0.6], [2, 0.75], [2, null]]));
    expect(row).toMatchObject({ itemId: "o", counted: 1, top: { answer: 2, share: 1 }, ready: false });
  });

  test("12 counted answers with 85% of the weight on one option is ready", () => {
    // 10 votes for option 1 at weight 1, 2 for option 0 at weight 0.875: 10 / 11.75 = 85.1%
    const list = [...times(10, [1, 1] as [unknown, number]), ...times(2, [0, 0.875] as [unknown, number])];
    const [row] = labelReport(votes("o", "decide", list));
    expect(row.counted).toBe(12);
    expect(row.top?.answer).toBe(1);
    expect(row.top?.share).toBeCloseTo(0.851, 3);
    expect(row.ready).toBe(true);
  });

  test("fewer than 10 counted answers is not ready, however unanimous", () => {
    const [row] = labelReport(votes("o", "decide", times(9, [1, 1])));
    expect(row.ready).toBe(false);
  });

  test("under 80% of the weight is not ready", () => {
    const [row] = labelReport(votes("o", "decide", [...times(7, [1, 1]), ...times(3, [0, 1])] as [unknown, number][]));
    expect(row.top?.share).toBeCloseTo(0.7);
    expect(row.ready).toBe(false);
  });

  test("rank orders vote as whole orders", () => {
    const [row] = labelReport(votes("r", "rank", times(10, [[1, 0, 2], 0.9])));
    expect(row).toMatchObject({ top: { answer: [1, 0, 2], share: 1 }, ready: true });
  });

  test("a write item is never listed", () => {
    expect(labelReport(votes("w", "write", times(50, ["same words", 1])))).toEqual([]);
  });

  test("embed sessions: 2 of 3 gold does not count, 2.5 of 3 counts with weight 0.83", () => {
    const [row] = labelReport(votes("o", "decide", [[0, 2 / 3], [1, 2.5 / 3]]));
    expect(row.counted).toBe(1);
    expect(row.top).toEqual({ answer: 1, share: 1 });
  });
});
