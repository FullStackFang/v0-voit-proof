import type { JWK } from "jose";
import { z } from "zod";
import { toPublic, type Bank, type Item, type PublicItem } from "./bank";
import { drawSet, type Random } from "./draw";
import { signResult } from "./result";
import { profile, scoreItem, type Profile } from "./scoring";
import type { Signals, Store } from "./store";

// The two session endpoints as plain functions: the route files pass real dependencies,
// tests pass the in-memory store and a fixed clock. The server owns the order and the clock.

export type Deps = { bank: Bank; store: Store; key: () => JWK; now: () => Date; random?: Random };
export type Reply<T> = { status: number; body: T | { error: string } };

type Served = { sessionId: string; role: string; employer: string; position: number; total: number; item: PublicItem };
type Feedback = { right?: boolean; reason: string };
type Answered = ({ done: false; item: PublicItem; position: number; total: number } | { done: true; profile: Profile; token: string }) & {
  feedback?: Feedback;
};

const startSchema = z.object({ pack: z.string().min(1), mode: z.enum(["embed", "practice"]).default("embed") });
const signalsSchema = z
  .object({
    timeAwaySeconds: z.number().min(0).default(0),
    pasteAttempts: z.number().int().min(0).default(0),
    bulkInputs: z.number().int().min(0).default(0),
  })
  .default({ timeAwaySeconds: 0, pasteAttempts: 0, bulkInputs: 0 });
/** "What decided it?" in the candidate's words: at most 80 characters, counted as the candidate sees them. */
const whySchema = z.string().trim().min(1).refine((s) => [...s].length <= 80);
const answerSchema = z.object({ itemId: z.string().min(1), answer: z.unknown(), why: whySchema.optional(), signals: signalsSchema });

export async function startSession(deps: Deps, input: unknown): Promise<Reply<Served>> {
  const parsed = startSchema.safeParse(input);
  if (!parsed.success) return { status: 400, body: { error: "pack is required; mode is embed or practice" } };
  const { pack, mode } = parsed.data;
  const itemIds = drawSet(deps.bank, pack, mode, deps.random);
  if (!itemIds) return { status: 404, body: { error: `Unknown pack ${pack}` } };

  const at = deps.now();
  const session = await deps.store.createSession({ pack, mode, itemIds, at });
  await deps.store.served(itemIds[0], at);
  const { name: role, employer } = deps.bank.packs.get(pack)!;
  return { status: 201, body: { sessionId: session.id, role, employer, position: 1, total: itemIds.length, item: toPublic(deps.bank.items.get(itemIds[0])!) } };
}

export async function submitAnswer(deps: Deps, sessionId: string, input: unknown): Promise<Reply<Answered>> {
  const parsed = answerSchema.safeParse(input);
  if (!parsed.success) return { status: 400, body: { error: "itemId and answer are required" } };
  const { itemId, answer, why, signals } = parsed.data;

  const session = await deps.store.getSession(sessionId);
  if (!session) return { status: 404, body: { error: "No such session" } };
  if (session.finishedAt) return { status: 409, body: { error: "This session is finished" } };
  if (session.itemIds[session.currentIndex] !== itemId) return { status: 409, body: { error: "That is not the current item" } };

  const item = deps.bank.items.get(itemId)!;
  if (!validAnswer(item, answer)) return { status: 400, body: { error: "That answer does not fit the item" } };
  if (item.format !== "write" && why === undefined) return { status: 400, body: { error: "Say what decided it" } };

  const at = deps.now();
  const last = session.currentIndex === session.itemIds.length - 1;
  const score = scoreItem(item, answer);
  const stored = await deps.store.recordAnswer(
    { sessionId, itemId, position: session.currentIndex, answer, servedAt: session.servedAt, answeredAt: at, score, signals, why: item.format === "write" ? null : why! },
    { servedAt: at, finishedAt: last ? at : null },
  );
  // lost a race with another answer to the same item: the first answer stands
  if (!stored) return { status: 409, body: { error: "That item is already answered" } };

  const feedback = session.mode === "practice" ? feedbackFor(item, score) : undefined;
  if (!last) {
    const nextId = session.itemIds[session.currentIndex + 1];
    await deps.store.served(nextId, at);
    const position = session.currentIndex + 2;
    return { status: 200, body: { done: false, item: toPublic(deps.bank.items.get(nextId)!), position, total: session.itemIds.length, ...(feedback && { feedback }) } };
  }

  const rows = await deps.store.answers(sessionId);
  const written = rows.find((r) => deps.bank.items.get(r.itemId)?.format === "write");
  const result = {
    sessionId,
    pack: session.pack,
    mode: session.mode,
    items: session.itemIds,
    profile: profile(rows.flatMap((r) => (r.score === null ? [] : [{ area: deps.bank.items.get(r.itemId)!.area, score: r.score }]))),
    reasoning: rows.flatMap((r) => (r.why === null ? [] : [r.why])),
    written: written ? (written.answer as string) : null,
    totalSeconds: Math.round((at.getTime() - session.startedAt.getTime()) / 1000),
    flags: rows.reduce<Signals>(
      (f, r) => ({
        timeAwaySeconds: f.timeAwaySeconds + r.signals.timeAwaySeconds,
        pasteAttempts: f.pasteAttempts + r.signals.pasteAttempts,
        bulkInputs: f.bulkInputs + r.signals.bulkInputs,
      }),
      { timeAwaySeconds: 0, pasteAttempts: 0, bulkInputs: 0 },
    ),
  };
  const token = await signResult(result, deps.key());
  return { status: 200, body: { done: true, profile: result.profile, token, ...(feedback && { feedback }) } };
}

/** Practice only: right or not and the reason after a gold item; the insight after a write item that has one; nothing for open items. */
function feedbackFor(item: Item, score: number | null): Feedback | undefined {
  if (item.kind === "gold" && item.reason) return { right: score === 1, reason: item.reason };
  if (item.format === "write" && item.reason) return { reason: item.reason };
  return undefined;
}

function validAnswer(item: Item, answer: unknown): boolean {
  if (item.format === "write") return typeof answer === "string" && answer.trim().length > 0 && [...answer].length <= 280;
  if (item.format === "decide") return Number.isInteger(answer) && (answer as number) >= 0 && (answer as number) < item.options.length;
  const n = item.options.length;
  return Array.isArray(answer) && answer.length === n && answer.every((v) => Number.isInteger(v)) && new Set(answer).size === n && answer.every((v) => v >= 0 && v < n);
}
