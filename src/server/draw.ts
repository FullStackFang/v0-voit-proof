import type { Bank, Item } from "./bank";

// Which items a session serves, in order. Retired items are never drawn.
// Embed: 3 gold and 1 open decide or rank, drawn at random and shuffled together, then 1 write item last.
// Practice: every unretired item in the pack, shuffled.

export type Mode = "embed" | "practice";
export type Random = () => number;

/** The item ids for a new session, or null when the pack does not exist. */
export function drawSet(bank: Bank, packId: string, mode: Mode, random: Random = Math.random): string[] | null {
  const pack = bank.packs.get(packId);
  if (!pack) return null;
  const live = pack.items.map((id) => bank.items.get(id)!).filter((i) => !i.retired);
  if (mode === "practice") return shuffle(live, random).map((i) => i.id);

  const of = (keep: (i: Item) => boolean, n: number) => shuffle(live.filter(keep), random).slice(0, n);
  const calls = [...of((i) => i.kind === "gold", 3), ...of((i) => i.kind === "open" && i.format !== "write", 1)];
  const write = of((i) => i.format === "write", 1);
  return [...shuffle(calls, random), ...write].map((i) => i.id);
}

/** Fisher-Yates on a copy. */
function shuffle<T>(list: T[], random: Random): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
