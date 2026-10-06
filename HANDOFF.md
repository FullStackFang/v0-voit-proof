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

- Demo built 2026-10-06 (tasks 5.4 to 7.1 done, 142 tests): the player `src/embed/player.ts` (built to `public/embed.js`), `/apply` (demo form; Submit sends it to `/verify` so you see what the employer gets), `/practice`, `/verify` and `/pool` (both check tokens in the browser; `/pool` logic is `src/server/pool.ts`), `/` links to all four. Styles, marks and formatting shared by player and pages live in `src/embed/` (`styles.ts`, `marks.ts`, `html.ts`, `format.ts`). Packs gained an `employer` field, returned with `role` when a session starts. Not yet clicked through in a real browser; local commit `b8b7786` is the safety point before this work.

- Direction changed 2026-10-06 after the founder saw the tile player: Voit renders like a captcha and checks the résumé's claims. Approved: `mockups/captcha.html` (04, variant A: checkbox gate), `mockups/claims.html` (05, claims flow), `mockups/widget.html` (06, captcha rendering), name **voitProof** (voit in ink, Proof in blue). Spec: OpenSpec change `resume-claims` (all artifacts written and valid, nothing built).

- MVP direction 2026-10-06: "something quick and captcha-esque that gives us useful data". Built: OpenSpec change `voitproof-captcha` (the player is now a 304 x 78 voitProof box; clicking it opens the challenge window beside it; the host form's Submit stays disabled until ticked; practice shows the window inline). Server, storage and scoring unchanged, so every session still records answers, timings and signals. `judge-the-ai` is archived into `openspec/specs/`. Résumé claims are a later change, `resume-claims` (spec only; the AI solvability check is recorded there as measurement, not a gate, after a rough pass on five items mined from the founder's commits solved 90%).

- Why step built 2026-10-06 (OpenSpec change `why-step`, 151 tests): the window is centred; each of the 4 calls is the pick, then "What decided it?" in the candidate's own words (free text, 80 characters, paste off; founder chose free text over multiple choice). The signed result carries each Why in order; `/pool` and `/verify` show them; order is still gold score only. The embed has no write item now. Dev server: **localhost:7001**. Founder's goal: quick, grabs reasoning, helps firms filter noise.

- Positioning 2026-10-06: voitProof sits **beside** the cover letter, not in place of it. Résumé says what you did, cover letter says why this job, voitProof shows you can do the work. So no prescreen and no fit line inside Proof; `resume-claims` is unchanged. `/apply` now has a Cover letter field (unnamed, so it is not sent to `/verify`) between Résumé and the voitProof box.
- Idea, not approved (2026-10-06): give candidates something back instead of being ghosted. Their own private page showing their results and whether the employer opened their Proof. Voit never holds the résumé, so "opened" can only mean the Proof. It needs a mockup first.

## Next steps

1. **Founder plays it** (migration `proof.answers.why` applied by the founder 2026-10-06, checked). The founder plays `/apply`, `/practice`, `/pool` (tasks 1.2, 4.2 of `why-step`, 3.2 of `voitproof-captcha`), then archive both changes.
2. Founder: confirm the GitHub repo is private, then commit and push.
3. Decide the untracked `deck/` folder's fate.

Founder's direction, learned the hard way on 2026-10-05: simple, game-like nuggets of judgment, not multi-step interviews or long flows.
