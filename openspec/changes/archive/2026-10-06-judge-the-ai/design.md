## Context

The repo has an approved design language (The Gate: `DESIGN.md`, `mockups/language.html`), the narrative (`docs/SPINE.md`), an approved player mockup and part of this slice built (see `tasks.md`). The founder works by reviewing static HTML mockups before anything is built, wants quiet surfaces and few elements, and must approve anything outward-facing. The machine is protected: no automated or visible browsers, ask before heavy processes.

The product direction came out of brainstorming on 2026-10-05: simple, game-like items of judgment about AI output, gold items scored and open items turned into labels, reCAPTCHA style. The same evening an investor-lens review of the pitch deck reconciled the deck and this spec into Variant C: B's content (judging AI output) in A's envelope (a short proof, deterministic scoring, captcha-like install). The deck is being updated to match separately.

## Goals / Non-Goals

**Goals:**
- A candidate finishes the embed in about three minutes, and can play the whole pack in practice.
- Every score is deterministic: no AI model grades a candidate.
- Gold answers never reach the browser; the server owns the order and the clock.
- An employer receives a signed per-area profile and the candidate's own written words with the application, can verify it, and can order a pool of them.
- Open answers accumulate into weighted labels and a graduation report.

**Non-Goals:**
- Accounts and sign-in, verified identity, and a record that stacks across applications. The token carries the served item ids so a later slice can build the stacked record and avoid repeats. That record SHALL show every proof a person has taken, so a weak result cannot be reset with a new email. Stacking needs a persistent identity (a free email account), not an ID check; verification stays a separate, optional tier.
- A cross-employer application-activity signal (legal exposure under FCRA and automated-hiring laws; not before counsel).
- A stored employer dashboard, site keys, server-to-server token exchange, webhooks or ATS integration. `/pool` is a stateless page for the pilot.
- Selling labels or any use of answers beyond calibrating challenges.
- Item authoring tools; custom packs from an employer's code.
- Deployment or any public link.
- A model-solvability gate (founder, 2026-10-05: not part of the MVP). A first run found current models solve 86% of the gold items, so a top score does not yet rule out relaying items to an AI. The script stays in `scripts/` as unused tooling; nothing in the product runs it or depends on its result.
## Decisions

**Next.js (App Router, TypeScript) at the repo root.** The workspace default, and it hosts the API routes, `/practice`, `/verify` and the demo form in one app. Alternative: a bare Node server plus static pages. Rejected: more code we own for routing, and Vercel is where it will live.

**The embed is a separate, framework-free bundle.** `src/embed/` builds with esbuild to `public/embed.js`: one custom element, shadow DOM, no React. It must drop into any employer's form without dragging a framework in. `/practice` and the demo form use the same element, so there is one player, not two. Alternative: a React component wrapped as a web component. Rejected: React in a third-party page is heavy and collides with host React versions.

**Items and packs are JSON files in the repo, validated by a schema at load.** `content/items/*.json`, `content/packs/*.json`, validated with zod; the server fails fast on a bad item. Content is reviewed like code and versioned with git; graduation is a pull request. Alternative: items in the database. Rejected for now: no authoring tool yet, and git review is the approval step we want.

**Postgres via Supabase for sessions, answers and exposure.** Three tables: `sessions`, `answers`, `item_exposure`. Labels and the graduation report are SQL queries over `answers`, not stored tables. For now it shares the `v0-voit-lab` Supabase project (`soihacnbczjlugocwzou`), founder's call on 2026-10-05: every Proof table lives in its own `proof` schema so nothing mixes with Lab's. The data access sits behind one module (`src/server/store.ts`), so moving to a dedicated project or another Postgres host changes one file and one schema dump.

**One item at a time.** `POST /api/sessions` creates the session (the shuffled set is stored server-side) and returns item 1. `POST /api/sessions/:id/answers` takes `{ itemId, answer, signals }`, rejects anything but the current item, stores, scores, and returns the next item or the finish payload. The candidate never holds the set; serve and answer times come from the server.

**Scoring is pure functions.** `src/server/scoring.ts`: decide (exact), rank (adjacent-swap distance), profile, gold accuracy, label weighting, graduation. No I/O, so every rule in the scoring spec is a unit test.

**No AI in scoring; write items are the candidate's own words.** The AI write grader built earlier is removed (Variant C). Reasons: the pitch promises deterministic scoring, an LLM grading candidates is hard to defend in an adverse-impact audit, and grading free text invites prompt injection. Write items become always-open: unscored, carried in the signed result for a reviewer to read, with their one-line insight shown in practice. Alternative: keep the grader for practice feedback only. Rejected: two scoring paths, and the insight line already gives practice its feedback.

**The embed set is drawn, not fixed.** 3 gold and 1 open decide or rank items, drawn at random from the pack's unretired items and shuffled, then 1 write item last. Drawing spreads exposure across the pack and, with served ids in the token, lets a later slice stack results across applications. 4 scored-looking items plus one short written answer keeps the embed at about three minutes.

**`/pool` is stateless.** The recruiter pastes tokens; the page verifies each with the public key and orders by total gold score. No storage, no accounts, no employer data on our side, which keeps the pilot simple and keeps us out of holding applicant records.

**Signed results with `jose` and Ed25519.** The private key is a local secret; the public JWK is served at `/.well-known/voit-key`. `/verify` checks with the same public key, so offline verification works identically. Alternative: HMAC. Rejected: employers could not verify without our secret.

**Tests with Vitest; DOM tests with happy-dom.** No real or automated browser, per the founder's rule. Route handlers are tested by calling them directly with an in-memory store behind the same interface as `store.ts`, so tests never touch the shared database; the Supabase store is checked by hand.

**Mockup first.** Before the player is built, a static mockup in `mockups/` shows a decide item, a rank item, a write item, the end profile, and the embed inside a plain application form, in The Gate. The founder approves it, and the player follows it.

## Risks / Trade-offs

- [Candidates relay items to an AI from another device; current models solve most of today's gold items] → Accepted for the MVP. Timing and time-away are recorded and flagged; harder judgment-call items come after the MVP.
- [3 gold items is a weak signal for one application] → Said plainly: the pool shows ties as ties, and the token carries served ids so results can stack across applications in a later slice. The written answer gives reviewers a second, human read.
- [Items leak once public] → The repo stays private; exposure counts make leaked items easy to retire.
- [Weighting from within-session gold accuracy is coarse with 3 gold items] → Only sessions at 2.5 of 3 or better count; the 10-answer minimum and 80% agreement are conservative, and a person approves every graduation.
- [Candidates answer open items carelessly because they are unscored] → They cannot tell gold from open.
- [Sharing Lab's Supabase project: anything holding Lab's service key can read candidate data, and there is no separate dev database] → Own `proof` schema, storage isolated in one module; move to a dedicated project before the first real employer.
- [Consent for using answers as labels, and for sharing the written answer] → Both modes show a plain consent line before the first item. Answers are used only to calibrate challenges; selling them is a non-goal.
- [Ranking applicants is an automated hiring tool under NYC Local Law 144 and Colorado's AI Act] → Nobody is removed, flags never reorder, and a bias audit and counsel come before the first real employer. To be confirmed by counsel.

## Open Questions

None open. Employer: Fernhill Learning (fictional), confirmed 2026-10-05.
