"use client";

import { useState } from "react";
import { duration, flagWords } from "@/embed/format";
import { orderPool, type Pool } from "@/server/pool";
import { Arrow, Seal } from "../ui";

// Everything happens in the recruiter's browser: tokens are verified with the public key and never sent anywhere.

export function RankedPool() {
  const [text, setText] = useState("");
  const [pool, setPool] = useState<Pool | null>(null);
  const pasted = text.split(/\r?\n/).filter((l) => l.trim()).length;

  async function order() {
    const key = await fetch("/.well-known/voit-key").then((r) => r.json());
    setPool(await orderPool(text, key));
  }

  return (
    <div className="pool">
      <div className="vc-top">
        <span className="vc-brand">
          <Seal />
          Ranked pool
        </span>
        <span className="label">Checked in your browser</span>
      </div>
      <textarea
        className="pool-in"
        aria-label="Results, one per line"
        placeholder={"Applicant 02   eyJhbGciOiJFZERTQSIs…\nApplicant 05   eyJhbGciOiJFZERTQSIs…"}
        spellCheck={false}
        wrap="off"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setPool(null);
        }}
      />
      <div className="vc-foot" style={{ marginTop: 14 }}>
        <span className="vc-hint">{pasted} pasted</span>
        <button className="btn" disabled={pasted === 0} onClick={() => void order()}>
          Order the pool <Arrow />
        </button>
      </div>
      {pool && <Ordered pool={pool} />}
    </div>
  );
}

function Ordered({ pool }: { pool: Pool }) {
  const ordered = pool.tiers.reduce((n, t) => n + t.applicants.length, 0);
  return (
    <>
      {pool.tiers.map((tier) => {
        const n = tier.applicants.length;
        return (
          <div className="tier" key={tier.earned}>
            <div className="tier-h">
              <b>
                {tier.earned} of {tier.applicants[0].of}
              </b>
              <span>{n === 1 ? "1 applicant" : `${n} applicants, tied, in paste order`}</span>
            </div>
            {tier.applicants.map((a, i) => (
              <div className="applicant" key={i}>
                <span>{a.label}</span>
                <div className="bar" style={{ width: `${a.of ? (a.earned / a.of) * 100 : 0}%` }} />
                <span className="meta">
                  {duration(a.payload.totalSeconds)}
                  {flagWords(a.payload.flags).map((w) => (
                    <span className="tag flag" key={w}>
                      {w}
                    </span>
                  ))}
                </span>
                {a.payload.reasoning && a.payload.reasoning.length > 0 && (
                  <ol className="words why">
                    {a.payload.reasoning.map((w, j) => (
                      <li key={j}>&ldquo;{w}&rdquo;</li>
                    ))}
                  </ol>
                )}
                {a.payload.written !== null && <span className="words">&ldquo;{a.payload.written}&rdquo;</span>}
              </div>
            ))}
          </div>
        );
      })}
      {pool.unverified.length > 0 && (
        <div className="tier">
          <div className="tier-h">
            <b>Unverified</b>
            <span>
              {pool.unverified.length} {pool.unverified.length === 1 ? "line" : "lines"}, kept, not ordered
            </span>
          </div>
          {pool.unverified.map((u, i) => (
            <div className="applicant" key={i}>
              <span>{u.label}</span>
              <span />
              <span className="meta">
                {u.why === "not genuine" ? "signature does not match" : "not a token"}
                <span className="tag noise">{u.why === "not genuine" ? "not genuine" : "unverified"}</span>
              </span>
            </div>
          ))}
        </div>
      )}
      <p className="pool-foot">
        {pool.pasted} pasted · {ordered} ordered · {pool.unverified.length} unverified · nobody removed · nothing stored
      </p>
    </>
  );
}
