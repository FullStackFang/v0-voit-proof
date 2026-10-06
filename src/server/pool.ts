import type { JWK } from "jose";
import { verifyResult, type ResultPayload } from "./result";

// The ranked pool behind /pool. It runs in the recruiter's browser and stores nothing.
// Genuine tokens are ordered by total gold score; ties stay one tier in paste order.
// Every pasted line appears: what does not verify is listed as unverified, never dropped.
// Flags travel with an applicant and never change the order.

export type Applicant = { label: string; earned: number; of: number; payload: ResultPayload & { iat: number } };
export type Tier = { earned: number; applicants: Applicant[] };
export type Unverified = { label: string; why: "not genuine" | "not a token" };
export type Pool = { pasted: number; tiers: Tier[]; unverified: Unverified[] };

const JWS = /^[\w-]+\.[\w-]+\.[\w-]+$/;

export async function orderPool(text: string, publicJwk: JWK): Promise<Pool> {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const genuine: Applicant[] = [];
  const unverified: Unverified[] = [];

  for (const [n, line] of lines.entries()) {
    // an optional label, then the token as the last field
    const [, before, last] = line.match(/^(.*?)\s*(\S+)$/)!;
    if (!JWS.test(last)) {
      unverified.push({ label: line, why: "not a token" });
      continue;
    }
    const label = before || `Line ${n + 1}`;
    const result = await verifyResult(last, publicJwk);
    if (!result.genuine) {
      unverified.push({ label, why: "not genuine" });
      continue;
    }
    const areas = Object.values(result.payload.profile);
    const earned = areas.reduce((s, a) => s + (a?.earned ?? 0), 0);
    const of = areas.reduce((s, a) => s + (a?.of ?? 0), 0);
    genuine.push({ label, earned, of, payload: result.payload });
  }

  // a stable sort keeps paste order within a tie
  const tiers: Tier[] = [];
  for (const a of genuine.sort((x, y) => y.earned - x.earned)) {
    const last = tiers.at(-1);
    if (last?.earned === a.earned) last.applicants.push(a);
    else tiers.push({ earned: a.earned, applicants: [a] });
  }
  return { pasted: lines.length, tiers, unverified };
}
