import type { Item } from "./bank";

// Open answers become labels: an answer counts only if its session's gold accuracy is at
// least 0.75 (2.5 of 3 gold in an embed session), weighted by that accuracy. The report lists items ready to graduate; a person
// promotes them by editing the item file. Nothing here changes an item.

export const MIN_ACCURACY = 0.75;
export const MIN_COUNTED = 10;
export const MIN_SHARE = 0.8;

export type OpenAnswer = { itemId: string; format: Item["format"]; answer: unknown; accuracy: number | null };
export type LabelRow = {
  itemId: string;
  format: Item["format"];
  counted: number;
  top: { answer: unknown; share: number } | null;
  ready: boolean;
};

/** One row per open decide or rank item answered. Write items are never listed. */
export function labelReport(answers: OpenAnswer[]): LabelRow[] {
  const byItem = new Map<string, OpenAnswer[]>();
  for (const a of answers) if (a.format !== "write") byItem.set(a.itemId, [...(byItem.get(a.itemId) ?? []), a]);

  return [...byItem.entries()].map(([itemId, list]) => {
    const format = list[0].format;
    const counted = list.filter((a) => a.accuracy !== null && a.accuracy >= MIN_ACCURACY);
    if (counted.length === 0) return { itemId, format, counted: counted.length, top: null, ready: false };

    const weights = new Map<string, number>();
    for (const a of counted) {
      const key = JSON.stringify(a.answer);
      weights.set(key, (weights.get(key) ?? 0) + a.accuracy!);
    }
    const total = [...weights.values()].reduce((x, y) => x + y, 0);
    const [key, weight] = [...weights.entries()].sort((x, y) => y[1] - x[1])[0];
    const share = weight / total;
    return {
      itemId,
      format,
      counted: counted.length,
      top: { answer: JSON.parse(key), share },
      ready: counted.length >= MIN_COUNTED && share >= MIN_SHARE,
    };
  });
}
