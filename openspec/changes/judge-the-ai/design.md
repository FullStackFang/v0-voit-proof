## Context

The repo has no product code: an approved design language (The Gate: `DESIGN.md`, `mockups/language.html`), the narrative (`docs/SPINE.md`) and this change. The founder works by reviewing static HTML mockups before anything is built, wants quiet surfaces and few elements, and must approve anything outward-facing (no remote, no deploy). The machine is protected: no automated or visible browsers, ask before heavy processes.

The product direction came out of brainstorming on 2026-10-05: simple, game-like items of judgment about AI output, gold items scored and open items turned into labels, reCAPTCHA style.

## Goals / Non-Goals

**Goals:**
- A candidate can play the first pack end to end, in the embed and in practice, in about 10 minutes.
- Gold answers never reach the browser; the server owns the order and the clock.
- An employer receives a signed per-area profile with the application, and can verify it.
- Open answers accumulate into weighted labels and a graduation report.

**Non-Goals:**
- Accounts and sign-in (practice is an unauthenticated page in this slice).
- The employer's ranked pool or dashboard.
- Running models against items to keep only those they fail.
- Item authoring tools; custom packs from an employer's code.
- Deployment, a GitHub remote, any public link.

## Decisions

**Next.js (App Router, TypeScript) at the repo root.** The workspace default, and it hosts the API routes, `/practice`, `/verify` and the demo form in one app. Alternative: a bare Node server plus static pages. Rejected: more code we own for routing, and Vercel is where it will live.

**The embed is a separate, framework-free bundle.** `src/embed/` builds with esbuild to `public/embed.js`: one custom element, shadow DOM, no React. It must drop into any employer's form without dragging a framework in. `/practice` and the demo form use the same element, so there is one player, not two. Alternative: a React component wrapped as a web component. Rejected: React in a third-party page is heavy and collides with host React versions.

**Items and packs are JSON files in the repo, validated by a schema at load.** `content/items/*.json`, `content/packs/*.json`, validated with zod; the server fails fast on a bad item. Content is reviewed like code and versioned with git; graduation is a pull request. Alternative: items in the database. Rejected for now: no authoring tool yet, and git review is the approval step we want.

**Postgres via Supabase for sessions, answers and exposure.** Three tables: `sessions`, `answers`, `item_exposure`. Labels and the graduation report are SQL queries over `answers`, not stored tables. Local development uses the Supabase CLI's local stack. Pending founder confirmation; the data access sits behind one module (`src/server/store.ts`) so a different Postgres host changes one file.

**One item at a time.** `POST /api/sessions` creates the session (the shuffled set is stored server-side) and returns item 1. `POST /api/sessions/:id/answers` takes `{ itemId, answer, signals }`, rejects anything but the current item, stores, scores, and returns the next item or the finish payload. The candidate never holds the set; serve and answer times come from the server.

**Scoring is pure functions.** `src/server/scoring.ts`: decide (exact), rank (adjacent-swap distance), profile, gold accuracy, label weighting, graduation. No I/O, so every rule in the scoring spec is a unit test.

**The write grader uses the Anthropic SDK with structured output.** The answer goes in its own delimited block marked as data; the system prompt holds the rubric and grading instructions; the response is validated with zod. Invalid twice means `not graded`. The model is picked at task time with the claude-api skill (a small, fast model is expected to be enough for rubric matching). The grader sits behind `grade(item, answer)` so tests use recorded responses.

**Signed results with `jose` and Ed25519.** The private key is a local secret; the public JWK is served at `/.well-known/voit-key`. `/verify` checks with the same public key, so offline verification works identically. Alternative: HMAC. Rejected: employers could not verify without our secret.

**Tests with Vitest; DOM tests with happy-dom.** No real or automated browser, per the founder's rule. Route handlers are tested by calling them directly against a local database.

**Mockup first.** Before the player is built, a static mockup in `mockups/` shows a decide item, a rank item, a write item, the end profile, and the embed inside a plain application form, in The Gate. The founder approves it, and the player follows it.

## Risks / Trade-offs

- [Candidates relay items to an agent from another device] → Timing and time-away are recorded and flagged; slice 2 selects gold items that current models fail. Not preventable, only made costly and visible.
- [Items leak once public] → The repo stays private; exposure counts make leaked items easy to retire.
- [The AI grader is wrong or manipulated] → The answer is passed only as data with a strict output schema; evidence phrases make every grade auditable; failures become `not graded`, never a guess.
- [Weighting from within-session gold accuracy is noisy with 8 gold items] → The 0.75 threshold and 10-answer minimum are conservative, and a person approves every graduation.
- [Candidates answer open items carelessly because they are unscored] → They cannot tell gold from open.
- [Supabase is not confirmed] → Storage is isolated in one module.
- [Consent for using answers as labels] → Practice shows a plain consent line before the first item; embed sessions carry no open items.

## Open Questions

1. Supabase for storage: yes or no (founder).
2. The fictional employer's name; "Fernhill Learning" is a placeholder (founder).
3. The grader model, chosen at implementation with current pricing.
