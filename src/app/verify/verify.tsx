"use client";

import { decodeProtectedHeader } from "jose";
import { useCallback, useEffect, useState } from "react";
import { duration, roleName } from "@/embed/format";
import { verifyResult, type Verified } from "@/server/result";
import { Arrow, ProfileRows, Seal } from "../ui";

// Checks one token in the browser against /.well-known/voit-key. Not genuine shows nothing from the token.

export function Verify({ initial }: { initial: string }) {
  const [token, setToken] = useState(initial);
  const [result, setResult] = useState<(Verified & { kid?: string }) | null>(null);

  const check = useCallback(async (t: string) => {
    const key = await fetch("/.well-known/voit-key").then((r) => r.json());
    const verified = await verifyResult(t, key);
    setResult(verified.genuine ? { ...verified, kid: decodeProtectedHeader(t.trim()).kid } : verified);
  }, []);

  useEffect(() => {
    if (initial) void check(initial);
  }, [initial, check]);

  return (
    <>
      <div className="pool">
        <div className="vc-top">
          <span className="vc-brand">
            <Seal />
            Verify a result
          </span>
          <span className="label">Checked in your browser</span>
        </div>
        <textarea
          className="pool-in"
          style={{ minHeight: 96 }}
          aria-label="Result token"
          placeholder="eyJhbGciOiJFZERTQSIs…"
          spellCheck={false}
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            setResult(null);
          }}
        />
        <div className="vc-foot" style={{ marginTop: 14 }}>
          <span className="vc-hint">One token</span>
          <button className="btn" disabled={!token.trim()} onClick={() => void check(token)}>
            Check it <Arrow />
          </button>
        </div>
        {result?.genuine && <Genuine payload={result.payload} kid={result.kid} />}
      </div>
      {result && !result.genuine && (
        <div className="pool verdict-no">
          <b>Not genuine.</b> <span className="m">The signature does not match this content. Nothing from this token is shown.</span>
        </div>
      )}
    </>
  );
}

function Genuine({ payload: p, kid }: { payload: Extract<Verified, { genuine: true }>["payload"]; kid?: string }) {
  const signed = new Date(p.iat * 1000).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const f = p.flags;
  return (
    <div className="verdict-ok">
      <div className="vc-signed" style={{ marginTop: 0 }}>
        <Seal big />
        <div>
          <b>Genuine.</b>
          <span className="m">
            Signed by Voit · {signed}
            {kid && ` · key ${kid}`}
          </span>
        </div>
      </div>
      <div className="facts">
        <span>Role</span>
        <b>{roleName(p.pack)}</b>
        <span>Mode</span>
        <b>{p.mode === "embed" ? "Application" : "Practice"}</b>
        <span>Time</span>
        <b className="m">{duration(p.totalSeconds)}</b>
        <span>Flags</span>
        <b className="m">
          {duration(f.timeAwaySeconds)} away · {f.pasteAttempts} pastes · {f.bulkInputs} bulk inputs
        </b>
      </div>
      <div style={{ marginTop: 14 }}>
        <ProfileRows profile={p.profile} />
      </div>
      {p.reasoning && p.reasoning.length > 0 && (
        <div className="vc-words">
          <span className="label">What decided each call, as typed</span>
          <ol className="why">
            {p.reasoning.map((w, j) => (
              <li key={j}>&ldquo;{w}&rdquo;</li>
            ))}
          </ol>
        </div>
      )}
      {p.written !== null && (
        <div className="vc-words">
          <span className="label">Written answer, as typed</span>
          {p.written}
        </div>
      )}
    </div>
  );
}
