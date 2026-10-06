import { loadBank, type Bank } from "./bank";
import { signingKey } from "./result";
import type { Deps } from "./sessions";
import { pgStore, type Store } from "./store";

// Real dependencies for the route handlers, created once per server process.
let bank: Bank | undefined;
let store: Store | undefined;

export function serverDeps(): Deps {
  bank ??= loadBank();
  store ??= pgStore();
  return { bank, store, key: signingKey, now: () => new Date() };
}

// The embed calls these routes from employers' pages, so any origin may call them. No cookies are used.
export const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

export function preflight() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function readJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    return null;
  }
}
