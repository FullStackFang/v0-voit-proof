import { toPublic, type Bank, type Item, type PublicItem } from "./bank";
import { scoreItem } from "./scoring";

// How often current AI models solve each gold item when a candidate relays it word for word.
// Run by hand (scripts/solvability.ts); the model call is injected, so tests make no network call.
// The report is for a person to act on: nothing here retires an item.

export const TARGET = 0.3;

/** Asks one model one question and returns its raw reply. */
export type Ask = (model: string, prompt: string) => Promise<string>;

type GoldItem = Extract<Item, { format: "decide" | "rank" }>;

export type ItemReport = {
  id: string;
  format: "decide" | "rank";
  retired: boolean;
  tries: number;
  /** Tries that scored 1 (the exact answer). */
  right: number;
  /** Tries whose reply could not be read as an answer. */
  unreadable: number;
  rate: number;
  byModel: Record<string, { tries: number; right: number }>;
};
export type SolvabilityReport = {
  pack: string;
  models: string[];
  triesPerModel: number;
  target: number;
  items: ItemReport[];
  /** Share of all tries, across the pack's unretired gold items, that a model got right. */
  packRate: number;
  meetsTarget: boolean;
};

const LETTERS = "ABCDE";

/** The item exactly as a candidate sees it, pasted into a chat. */
export function promptFor(item: GoldItem): string {
  const pub = toPublic(item) as Extract<PublicItem, { format: "decide" | "rank" }>;
  const options = pub.options.map((o, i) => `${LETTERS[i]}. ${o}`).join("\n");
  const how =
    item.format === "decide"
      ? "Reply with only the letter of your answer."
      : `Reply with only the letters in your order, for example ${[...LETTERS.slice(0, pub.options.length)].reverse().join(", ")}.`;
  return `${pub.artifact.label}\n\n${pub.artifact.body}\n\n${pub.question}\n\n${options}\n\n${how}`;
}

/** Reads the chosen option (decide) or order (rank) from the last line of a reply; null if it cannot. */
export function parseReply(item: GoldItem, reply: string): number | number[] | null {
  const lines = reply.replace(/[*_`]/g, "").split("\n").map((l) => l.trim()).filter(Boolean);
  const last = lines.at(-1) ?? "";
  const n = item.options.length;
  // capitals only, so the word "a" is not read as option A; a bare lowercase letter like "(b)" also counts
  const solo = last.match(/^\(?([a-e])[).]?$/i);
  const letters = solo
    ? [LETTERS.indexOf(solo[1].toUpperCase())]
    : [...last.matchAll(/\b([A-E])\b/g)].map((m) => LETTERS.indexOf(m[1]));
  if (letters.some((i) => i >= n)) return null;
  if (item.format === "decide") return letters.length === 1 ? letters[0] : null;
  return letters.length === n && new Set(letters).size === n ? letters : null;
}

export async function runSolvability(
  bank: Bank,
  packId: string,
  models: string[],
  triesPerModel: number,
  ask: Ask,
): Promise<SolvabilityReport> {
  const pack = bank.packs.get(packId);
  if (!pack) throw new Error(`Unknown pack ${packId}`);
  const gold = pack.items.map((id) => bank.items.get(id)!).filter((i): i is GoldItem => i.kind === "gold" && i.format !== "write");

  const items: ItemReport[] = [];
  for (const item of gold) {
    const prompt = promptFor(item);
    const row: ItemReport = { id: item.id, format: item.format, retired: !!item.retired, tries: 0, right: 0, unreadable: 0, rate: 0, byModel: {} };
    for (const model of models) {
      const m = (row.byModel[model] = { tries: 0, right: 0 });
      for (let t = 0; t < triesPerModel; t++) {
        let answer: number | number[] | null = null;
        try {
          answer = parseReply(item, await ask(model, prompt));
        } catch (err) {
          console.error(`${model} failed on ${item.id}:`, err instanceof Error ? err.message : err);
        }
        m.tries++;
        row.tries++;
        if (answer === null) row.unreadable++;
        else if (scoreItem(item, answer) === 1) (m.right++, row.right++);
      }
    }
    row.rate = row.tries ? row.right / row.tries : 0;
    items.push(row);
  }

  const live = items.filter((i) => !i.retired);
  const tries = live.reduce((a, i) => a + i.tries, 0);
  const packRate = tries ? live.reduce((a, i) => a + i.right, 0) / tries : 0;
  return { pack: packId, models, triesPerModel, target: TARGET, items, packRate, meetsTarget: packRate < TARGET };
}
