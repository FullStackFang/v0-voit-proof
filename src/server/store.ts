import postgres from "postgres";
import type { Item } from "./bank";
import type { Mode } from "./draw";
import type { OpenAnswer } from "./labels";
import { goldAccuracy } from "./scoring";

// All storage goes through this interface. `pgStore` is the Supabase Postgres implementation
// (shared Lab project, `proof` schema); `memoryStore` is its twin for tests. Moving hosts changes this file.

export type Session = {
  id: string;
  pack: string;
  mode: Mode;
  itemIds: string[];
  currentIndex: number;
  /** When the current item was served, by the server clock. */
  servedAt: Date;
  startedAt: Date;
  finishedAt: Date | null;
};
export type Signals = { timeAwaySeconds: number; pasteAttempts: number; bulkInputs: number };
export type AnswerRow = {
  sessionId: string;
  itemId: string;
  position: number;
  answer: unknown;
  servedAt: Date;
  answeredAt: Date;
  score: number | null;
  signals: Signals;
  /** "What decided it?" in the candidate's words; null for write items. */
  why: string | null;
};

export interface Store {
  createSession(s: { pack: string; mode: Mode; itemIds: string[]; at: Date }): Promise<Session>;
  getSession(id: string): Promise<Session | null>;
  /**
   * Stores the answer and moves the session on, atomically, only if the answer is for the
   * session's current position and the session is not finished. Returns false otherwise.
   */
  recordAnswer(row: AnswerRow, next: { servedAt: Date; finishedAt: Date | null }): Promise<boolean>;
  answers(sessionId: string): Promise<AnswerRow[]>;
  /** Counts one serve; sets first-seen on the first. */
  served(itemId: string, at: Date): Promise<void>;
  /** Every open decide or rank answer with its session's gold accuracy, for the label report. */
  openAnswers(items: Map<string, Item>): Promise<OpenAnswer[]>;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function memoryStore(): Store & { exposure: Map<string, { firstServedAt: Date; serveCount: number }> } {
  const sessions = new Map<string, Session>();
  const rows: AnswerRow[] = [];
  const exposure = new Map<string, { firstServedAt: Date; serveCount: number }>();
  return {
    exposure,
    async createSession({ pack, mode, itemIds, at }) {
      const s: Session = { id: crypto.randomUUID(), pack, mode, itemIds, currentIndex: 0, servedAt: at, startedAt: at, finishedAt: null };
      sessions.set(s.id, s);
      return { ...s };
    },
    async getSession(id) {
      const s = sessions.get(id);
      return s ? { ...s } : null;
    },
    async recordAnswer(row, next) {
      const s = sessions.get(row.sessionId);
      if (!s || s.finishedAt || s.currentIndex !== row.position) return false;
      rows.push(row);
      Object.assign(s, { currentIndex: s.currentIndex + 1, servedAt: next.servedAt, finishedAt: next.finishedAt });
      return true;
    },
    async answers(sessionId) {
      return rows.filter((r) => r.sessionId === sessionId).sort((a, b) => a.position - b.position);
    },
    async served(itemId, at) {
      const e = exposure.get(itemId);
      exposure.set(itemId, e ? { ...e, serveCount: e.serveCount + 1 } : { firstServedAt: at, serveCount: 1 });
    },
    async openAnswers(items) {
      return openAnswersFrom(rows.filter((r) => sessions.get(r.sessionId)?.finishedAt), items);
    },
  };
}

export function pgStore(url = process.env.DATABASE_URL): Store {
  if (!url) throw new Error("DATABASE_URL is not set");
  // transaction pooler: no prepared statements
  const sql = postgres(url, { prepare: false });
  const toSession = (r: Record<string, unknown>): Session => ({
    id: r.id as string,
    pack: r.pack as string,
    mode: r.mode as Mode,
    itemIds: r.item_ids as string[],
    currentIndex: r.current_index as number,
    servedAt: r.served_at as Date,
    startedAt: r.started_at as Date,
    finishedAt: (r.finished_at as Date | null) ?? null,
  });
  const toRow = (r: Record<string, unknown>): AnswerRow => ({
    sessionId: r.session_id as string,
    itemId: r.item_id as string,
    position: r.position as number,
    answer: r.answer,
    servedAt: r.served_at as Date,
    answeredAt: r.answered_at as Date,
    score: r.score === null ? null : Number(r.score),
    signals: r.signals as Signals,
    why: (r.why as string | null) ?? null,
  });

  return {
    async createSession({ pack, mode, itemIds, at }) {
      const [r] = await sql`
        insert into proof.sessions (pack, mode, item_ids, served_at, started_at)
        values (${pack}, ${mode}, ${itemIds}, ${at}, ${at}) returning *`;
      return toSession(r);
    },
    async getSession(id) {
      if (!UUID.test(id)) return null;
      const [r] = await sql`select * from proof.sessions where id = ${id}`;
      return r ? toSession(r) : null;
    },
    async recordAnswer(row, next) {
      return sql.begin(async (tx) => {
        const moved = await tx`
          update proof.sessions
             set current_index = current_index + 1, served_at = ${next.servedAt}, finished_at = ${next.finishedAt}
           where id = ${row.sessionId} and current_index = ${row.position} and finished_at is null
          returning id`;
        if (moved.length === 0) return false;
        await tx`
          insert into proof.answers (session_id, item_id, position, answer, served_at, answered_at, score, signals, why)
          values (${row.sessionId}, ${row.itemId}, ${row.position}, ${tx.json(row.answer as never)},
                  ${row.servedAt}, ${row.answeredAt}, ${row.score}, ${tx.json(row.signals)},
                  ${row.why === null ? null : tx.json(row.why as never)})`;
        return true;
      });
    },
    async answers(sessionId) {
      const rs = await sql`select * from proof.answers where session_id = ${sessionId} order by position`;
      return rs.map(toRow);
    },
    async served(itemId, at) {
      await sql`
        insert into proof.item_exposure (item_id, first_served_at, serve_count) values (${itemId}, ${at}, 1)
        on conflict (item_id) do update set serve_count = proof.item_exposure.serve_count + 1`;
    },
    async openAnswers(items) {
      // answers of finished sessions only; accuracy is computed from the same rows in memory
      const rs = await sql`
        select a.* from proof.answers a join proof.sessions s on s.id = a.session_id
         where s.finished_at is not null`;
      return openAnswersFrom(rs.map(toRow), items);
    },
  };
}

/** Open decide and rank answers, each with its session's gold accuracy (null if no gold was scored). */
function openAnswersFrom(rows: AnswerRow[], items: Map<string, Item>): OpenAnswer[] {
  const gold = new Map<string, number[]>();
  for (const r of rows) if (r.score !== null) gold.set(r.sessionId, [...(gold.get(r.sessionId) ?? []), r.score]);
  return rows.flatMap((r) => {
    const item = items.get(r.itemId);
    if (!item || item.kind !== "open" || item.format === "write") return [];
    return [{ itemId: r.itemId, format: item.format, answer: r.answer, accuracy: goldAccuracy(gold.get(r.sessionId) ?? []) }];
  });
}
