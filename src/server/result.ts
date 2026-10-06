import { exportJWK, generateKeyPair, importJWK, jwtVerify, SignJWT, type JWK } from "jose";
import type { Profile } from "./scoring";

// The signed result: a compact JWS (EdDSA over Ed25519). The private key lives only on the
// server (VOIT_SIGNING_KEY); the public half is served at /.well-known/voit-key, so anyone
// can verify a result online or offline. The payload carries the written answer in the
// candidate's own words, and never any option choice or answer to a decide, rank or open item.

export const ALG = "EdDSA";

export type ResultPayload = {
  sessionId: string;
  pack: string;
  mode: "embed" | "practice";
  /** Ids of the items served, in order, so a later slice can stack results and avoid repeats. */
  items: string[];
  profile: Profile;
  /** The write item's text as the candidate typed it; null if none was served. */
  written: string | null;
  totalSeconds: number;
  flags: { timeAwaySeconds: number; pasteAttempts: number; bulkInputs: number };
};
export type Verified = { genuine: true; payload: ResultPayload & { iat: number } } | { genuine: false };

export async function signResult(payload: ResultPayload, privateJwk: JWK): Promise<string> {
  const key = await importJWK(privateJwk, ALG);
  // copy named fields only, so nothing else a caller holds can reach the token
  const { sessionId, pack, mode, items, profile, written, totalSeconds, flags } = payload;
  return new SignJWT({ sessionId, pack, mode, items, profile, written, totalSeconds, flags })
    .setProtectedHeader({ alg: ALG, kid: privateJwk.kid })
    .setIssuedAt()
    .sign(key);
}

export async function verifyResult(token: string, publicJwk: JWK): Promise<Verified> {
  try {
    const key = await importJWK(publicJwk, ALG);
    const { payload } = await jwtVerify(token.trim(), key, { algorithms: [ALG] });
    return { genuine: true, payload: payload as unknown as ResultPayload & { iat: number } };
  } catch {
    return { genuine: false };
  }
}

/** The public half of a private Ed25519 JWK. */
export function toPublicJwk({ kty, crv, x, kid }: JWK): JWK {
  return { kty, crv, x, kid, alg: ALG, use: "sig" };
}

/** The server's private signing key, from VOIT_SIGNING_KEY (a JWK as one line of JSON). */
export function signingKey(): JWK {
  const raw = process.env.VOIT_SIGNING_KEY;
  if (!raw) throw new Error("VOIT_SIGNING_KEY is not set; run `npm run keygen`");
  return JSON.parse(raw) as JWK;
}

export async function newSigningKey(kid = new Date().toISOString().slice(0, 10)): Promise<JWK> {
  const { privateKey } = await generateKeyPair(ALG, { crv: "Ed25519", extractable: true });
  return { ...(await exportJWK(privateKey)), kid };
}
