# Handoff: Voit Proof

Read this first in every session. "Continue" means do the top item under Next steps, nothing else.

## What this is

Voit Proof is the product: a small piece of real work embedded in every job application, so the pool sorts itself by proof. A recruiter pastes one line (`<voit-challenge role="full-stack">`), the candidate fixes one real bug in about ten minutes as a guest, the work is scored (tests pass or not, and how they worked compared with strong developers), and the recruiter's pool reorders with the strongest real applicants at the top and nobody removed. Candidates get standing, feedback and a verified record. Free for candidates; employer teams pay for custom challenges from their own code.

Family: `../v0-voit` (research sim), `../v0-voit-lab` (workshop arena). This repo shares the wordmark grammar, Hanken Grotesk, Plex Mono and the voice with Lab, and nothing else. Lab's language is The Ruled Line; ours is The Gate.

## Working agreements with the founder

- **Build the product, never decks.** `docs/SPINE.md` is narrative context, not a deliverable. A deck was built from it by mistake on 2026-10-05 and the founder was angry. Do not repeat.
- **Mockups before building.** Design changes are reviewed as static HTML the founder opens themselves.
- **Less is more.** Quiet surfaces, few elements, one thing moving at a time.
- **Protect the machine.** No automated or visible browsers, one subagent at a time at most, ask before heavy processes.
- **Ask before anything outward-facing:** GitHub remote, Vercel, public artifact links. Nothing is pushed or deployed yet.
- Before building, name the product slice in one sentence and get a yes. Do not offer menus of artifacts.

## State (2026-10-06)

- Remote: https://github.com/FullStackFang/v0-voit-proof (branch `master`). Repo privacy not yet confirmed; `content/` holds every answer. Today's build is **not committed**.
- `PRODUCT.md`, `DESIGN.md`, `mockups/language.html`: the design language **The Gate**. `mockups/judge-the-ai.html`: the approved demo-flow mockup, 9 screens (form, decide, practice feedback, rank, write, end view, `/pool`, `/verify`, `/practice`), approved 2026-10-06. Build the pages from it.
- `deck/` is **untracked and ignored**. Do not commit it or continue it unless asked.
- Slice 1 (Variant C: deterministic scoring, no AI grader, write items unscored and carried as written) is being built from `openspec/changes/judge-the-ai/` (`/opsx:apply judge-the-ai`); `tasks.md` is the progress record. Server side is done and tested: item bank with `retired`, set drawing, scoring, label feed and report, signed results, `/.well-known/voit-key`, `POST /api/sessions` and `/api/sessions/:id/answers` (with CORS for the embed), and a solvability script that is out of MVP scope (unused tooling; a first run found models solve 86% of gold items). `npm test` runs everything; no test touches the network or the database.
- Storage: the shared `v0-voit-lab` Supabase project (`soihacnbczjlugocwzou`), own `proof` schema. Migration **applied** 2026-10-05; `pgStore` checked by hand with one full embed session (test rows removed). Local `.env` (gitignored) holds `DATABASE_URL`, copied from `../v0-voit-lab/.env.local` (`TEST_DATABASE_URL`, session pooler), and `VOIT_SIGNING_KEY`. The Supabase MCP in this environment is signed in to a different account and cannot see this project; use the connection string. On Vercel later, switch to the transaction pooler (port 6543).

## Next steps

1. **Build the demo** (`/opsx:apply judge-the-ai`, remaining tasks in `tasks.md`): 5.4 `/verify`, 5.5 `/pool`, then group 6 (the `<voit-challenge>` player in `src/embed/`, built to `public/embed.js`, shadow DOM, styled from the mockup; demo application form page; `/practice`). Server pieces to reuse: `src/server/sessions.ts` (`startSession`, `submitAnswer`), `result.ts` (`verifyResult`, `toPublicJwk`), `/.well-known/voit-key`, `deps.ts` (CORS for the embed). Goal: the founder clicks through the whole flow with `npm run dev` on the real database.
2. Founder: confirm the GitHub repo is private, then commit and push (everything since the mockup commit is uncommitted).
3. Decide the untracked `deck/` folder's fate.

Founder's direction, learned the hard way on 2026-10-05: simple, game-like nuggets of judgment, not multi-step interviews or long flows.
