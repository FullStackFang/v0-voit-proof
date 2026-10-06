import type { Area, Item } from "./bank";

// Pure scoring rules from the scoring spec. No I/O and no AI: every score comes from comparing
// the answer with the item's stored answer.

export type Score = 0 | 0.5 | 1;
export type Profile = Partial<Record<Area, { earned: number; of: number }>>;

/** The score for an answer, or null when the item is not scored (open decide or rank, and every write item). */
export function scoreItem(item: Item, answer: unknown): Score | null {
  if (item.format === "write" || item.kind !== "gold" || item.answer === undefined) return null;
  return item.format === "decide" ? scoreDecide(item.answer, answer as number) : scoreRank(item.answer, answer as number[]);
}

export function scoreDecide(answer: number, choice: number): Score {
  return answer === choice ? 1 : 0;
}

/** 1 for the exact order, 0.5 for exactly one swap of adjacent options, otherwise 0. */
export function scoreRank(answer: number[], order: number[]): Score {
  const diffs = answer.flatMap((v, i) => (v === order[i] ? [] : [i]));
  if (diffs.length === 0) return 1;
  const [i, j] = diffs;
  return diffs.length === 2 && j === i + 1 && answer[i] === order[j] && answer[j] === order[i] ? 0.5 : 0;
}

/** Per area seen: the sum of gold scores and how many gold items were graded. */
export function profile(graded: { area: Area; score: number }[]): Profile {
  const out: Profile = {};
  for (const { area, score } of graded) {
    const a = (out[area] ??= { earned: 0, of: 0 });
    a.earned += score;
    a.of += 1;
  }
  return out;
}

export function goldAccuracy(scores: number[]): number | null {
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
}
