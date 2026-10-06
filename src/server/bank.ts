import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

export const AREAS = ["records", "tenancy", "rules", "ai-in-the-loop", "ai-code", "ops"] as const;

const text = z.string().min(1);
const common = {
  id: text,
  kind: z.enum(["gold", "open"]),
  area: z.enum(AREAS),
  artifact: z.strictObject({ kind: z.enum(["code", "text", "log"]), label: text, body: text }),
  question: text,
  reason: text.optional(),
  retired: z.boolean().optional(),
};

const itemSchema = z
  .discriminatedUnion("format", [
    z.strictObject({ ...common, format: z.literal("decide"), options: z.array(text).min(2).max(4), answer: z.number().int().optional() }),
    z.strictObject({ ...common, format: z.literal("rank"), options: z.array(text).min(3).max(5), answer: z.array(z.number().int()).optional() }),
    // write items are the candidate's own words: always open, never scored; the reason is the insight shown in practice
    z.strictObject({ ...common, format: z.literal("write") }),
  ])
  .superRefine((item, ctx) => {
    if (item.format === "write") {
      if (item.kind !== "open") ctx.addIssue({ code: "custom", message: "a write item is always open" });
      return;
    }
    if (item.kind === "open") {
      if (item.answer !== undefined) ctx.addIssue({ code: "custom", message: "an open item has no answer" });
      if (item.reason !== undefined) ctx.addIssue({ code: "custom", message: "an open decide or rank item has no reason" });
      return;
    }
    if (item.answer === undefined) ctx.addIssue({ code: "custom", message: "a gold item needs an answer" });
    if (item.reason === undefined) ctx.addIssue({ code: "custom", message: "a gold item needs a reason" });
    if (item.format === "decide" && item.answer !== undefined && !(item.answer >= 0 && item.answer < item.options.length))
      ctx.addIssue({ code: "custom", message: "answer is not an option index" });
    if (item.format === "rank" && item.answer !== undefined && !isOrderOf(item.answer, item.options.length))
      ctx.addIssue({ code: "custom", message: "answer is not an order of the options" });
  });

const packSchema = z.strictObject({ id: text, name: text, items: z.array(text).min(1) });

export type Item = z.infer<typeof itemSchema>;
export type Pack = z.infer<typeof packSchema>;
export type Area = (typeof AREAS)[number];
export type PublicItem = DistributiveOmit<Item, "answer" | "reason" | "kind" | "retired">;
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type Bank = { items: Map<string, Item>; packs: Map<string, Pack> };

/** Validates raw item and pack objects. Throws naming the item or pack on the first bad one. */
export function buildBank(rawItems: unknown[], rawPacks: unknown[]): Bank {
  const items = new Map<string, Item>();
  rawItems.forEach((raw, i) => {
    const name = idOf(raw) ?? `item #${i + 1}`;
    const parsed = itemSchema.safeParse(raw);
    if (!parsed.success) throw new Error(`Invalid item ${name}: ${describe(parsed.error)}`);
    if (items.has(parsed.data.id)) throw new Error(`Duplicate item ${name}`);
    items.set(parsed.data.id, parsed.data);
  });

  const packs = new Map<string, Pack>();
  rawPacks.forEach((raw, i) => {
    const name = idOf(raw) ?? `pack #${i + 1}`;
    const parsed = packSchema.safeParse(raw);
    if (!parsed.success) throw new Error(`Invalid pack ${name}: ${describe(parsed.error)}`);
    for (const id of parsed.data.items) if (!items.has(id)) throw new Error(`Pack ${name} lists missing item ${id}`);
    const live = parsed.data.items.map((id) => items.get(id)!).filter((i) => !i.retired);
    const gold = live.filter((i) => i.kind === "gold").length;
    const open = live.filter((i) => i.kind === "open" && i.format !== "write").length;
    const write = live.filter((i) => i.format === "write").length;
    if (gold < 3 || open < 1 || write < 1)
      throw new Error(`Pack ${name} is too small for an embed set: needs 3 gold, 1 open decide or rank and 1 write item that are not retired (has ${gold}, ${open}, ${write})`);
    packs.set(parsed.data.id, parsed.data);
  });

  return { items, packs };
}

/** Reads `items/*.json` and `packs/*.json` under a content directory. */
export function loadBank(dir = join(process.cwd(), "content")): Bank {
  const read = (sub: string) =>
    readdirSync(join(dir, sub))
      .filter((f) => f.endsWith(".json"))
      .sort()
      .map((f) => JSON.parse(readFileSync(join(dir, sub, f), "utf8")) as unknown);
  return buildBank(read("items"), read("packs"));
}

/** The only shape of an item that may reach a browser. */
export function toPublic(item: Item): PublicItem {
  const { kind: _kind, reason: _reason, retired: _retired, answer: _answer, ...pub } = item as Item & { answer?: unknown };
  return pub as PublicItem;
}

function isOrderOf(order: number[], n: number) {
  return order.length === n && [...order].sort((a, b) => a - b).every((v, i) => v === i);
}

function idOf(raw: unknown) {
  const id = (raw as { id?: unknown } | null)?.id;
  return typeof id === "string" && id ? id : undefined;
}

function describe(error: z.ZodError) {
  return error.issues.map((i) => (i.path.length ? `${i.path.join(".")}: ${i.message}` : i.message)).join("; ");
}
