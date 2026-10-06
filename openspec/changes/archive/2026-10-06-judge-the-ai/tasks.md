## 1. Mockup and content (founder approves before any code)

- [x] 1.1 Static mockup `mockups/judge-the-ai.html` in The Gate: a decide item, a rank item, a write item, the end profile, and the embed inside a plain application form
- [x] 1.2 Founder approves the mockup
- [x] 1.3 Write the 12 items of `education-platform-engineer` in full (artifact, question, options, answer, reason, rubric) as a reviewable draft
- [x] 1.4 Founder approves the items and the employer name (Supabase decided: shared Lab project, `proof` schema)
- [x] 1.5 Variant C mockup update: the three-minute embed (consent line, 4 items then 1 write), the end view, and `/pool` with tiers and an unverified section
- [x] 1.6 Founder approves the updated mockup and the content changes in 3.4

## 2. Setup

- [x] 2.1 Scaffold Next.js (App Router, TypeScript) at the repo root; add Vitest and happy-dom; `.env.example` for database URL, Anthropic key and signing key
- [x] 2.2 Add esbuild script that builds `src/embed/` to `public/embed.js`
- [x] 2.3 Migration creating the `proof` schema with `sessions`, `answers`, `item_exposure` in the shared Supabase project (applied only after founder's go); in-memory store for tests

## 3. Item bank

- [x] 3.1 zod schemas for items and packs; loader that fails with the item or pack id on any invalid file (tests for every rejection scenario)
- [x] 3.2 `toPublic(item)` strips answer, reason, rubric and kind (test)
- [x] 3.3 Add the approved items and pack under `content/`; test that the pack has 8 gold, 4 open, all six areas, two gold write items
- [x] 3.4 Variant C rework: write items always open, no rubric, optional reason (`firewall-ssh`, `essay-grader` lose their rubric and become open; `big-ai-pr` may gain a reason); pack needs 3 gold, 1 open decide or rank, 1 write; first-pack test becomes 6 gold, 3 open decide or rank, 3 write, all six areas; update `items-draft.md` to match
- [x] 3.5 `retired` flag: loads, never drawn, pack still needs 3 unretired gold (tests)
- [x] 3.6 (Out of MVP scope since; kept as unused tooling) Solvability script `scripts/solvability.ts`: public view to each model, parse, score with the pure functions, write `content/solvability.json` with per-item and pack rates against the 30% target; parser tested on recorded replies, no network in tests

## 4. Scoring

- [x] 4.1 Decide and rank scoring, profile, gold accuracy as pure functions with tests from the scoring spec
- [x] 4.2 Write grader behind `grade(item, answer)` with the Anthropic SDK, answer as data, zod-validated output, retry once then `not graded`; tests on recorded responses including an injection attempt
- [x] 4.4 Variant C rework: remove the write grader (`src/server/grader.ts` and its test) and any write scoring; add the determinism test; profile and gold accuracy count only decide and rank gold
- [x] 4.3 Label query and graduation report (10 counted answers, 80% weight, accuracy at least 0.75, write items never listed) with tests; recheck the pure label report already built against the revised scoring spec

## 5. Sessions and results

- [x] 5.1 Ed25519 signing and verifying with `jose`; `/.well-known/voit-key` (tests: genuine and tampered)
- [x] 5.1a Variant C rework: payload adds served item ids and the written answer, still no option choices (tests)
- [x] 5.2 `POST /api/sessions`: embed set drawn as 3 gold + 1 open shuffled then 1 write, practice set, retired items excluded, unknown pack, exposure tracking (tests)
- [x] 5.3 `POST /api/sessions/:id/answers`: current item only, answers final, server timing, mode-dependent feedback (reason after gold and write items in practice), signals stored, finish returns profile and token (tests)
- [x] 5.4 `/verify` page
- [x] 5.5 `/pool` page: paste labelled tokens, verify each, order by gold score, ties as tiers in paste order, unverified listed below, flags shown never reorder, nothing stored (tests)

## 6. The embed

- [x] 6.1 `<voit-challenge>` custom element: attributes read in one function, missing-pack message, shadow root styled from the approved mockup
- [x] 6.2 Decide, rank (drag and keyboard) and write (280 limit, paste blocked) views (DOM tests)
- [x] 6.3 Integrity signals: time away, paste attempts, bulk input (DOM tests)
- [x] 6.4 On finish: profile view and hidden `voit-result` input in the host form (DOM test)
- [x] 6.5 Consent line before the first item in both modes; demo application form page and `/practice` page

## 7. Verify

- [x] 7.1 All tests pass
- [ ] 7.2 Founder plays the embed (about three minutes) and practice locally, checks a token at `/verify`, and orders a few tokens at `/pool`
