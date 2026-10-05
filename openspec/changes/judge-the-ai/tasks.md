## 1. Mockup and content (founder approves before any code)

- [ ] 1.1 Static mockup `mockups/judge-the-ai.html` in The Gate: a decide item, a rank item, a write item, the end profile, and the embed inside a plain application form
- [ ] 1.2 Founder approves the mockup
- [ ] 1.3 Write the 12 items of `education-platform-engineer` in full (artifact, question, options, answer, reason, rubric) as a reviewable draft
- [ ] 1.4 Founder approves the items, the employer name and Supabase

## 2. Setup

- [ ] 2.1 Scaffold Next.js (App Router, TypeScript) at the repo root; add Vitest and happy-dom; `.env.example` for database URL, Anthropic key and signing key
- [ ] 2.2 Add esbuild script that builds `src/embed/` to `public/embed.js`
- [ ] 2.3 Local Supabase stack; migration for `sessions`, `answers`, `item_exposure`

## 3. Item bank

- [ ] 3.1 zod schemas for items and packs; loader that fails with the item or pack id on any invalid file (tests for every rejection scenario)
- [ ] 3.2 `toPublic(item)` strips answer, reason, rubric and kind (test)
- [ ] 3.3 Add the approved items and pack under `content/`; test that the pack has 8 gold, 4 open, all six areas, two gold write items

## 4. Scoring

- [ ] 4.1 Decide and rank scoring, profile, gold accuracy as pure functions with tests from the scoring spec
- [ ] 4.2 Write grader behind `grade(item, answer)` with the Anthropic SDK, answer as data, zod-validated output, retry once then `not graded`; tests on recorded responses including an injection attempt
- [ ] 4.3 Label query and graduation report (10 counted answers, 80% weight, accuracy at least 0.75, write items never ready) with tests

## 5. Sessions and results

- [ ] 5.1 Ed25519 signing and verifying with `jose`; `/.well-known/voit-key` (tests: genuine and tampered)
- [ ] 5.2 `POST /api/sessions`: embed and practice sets, unknown pack, exposure tracking (tests)
- [ ] 5.3 `POST /api/sessions/:id/answers`: current item only, answers final, server timing, mode-dependent feedback, signals stored, finish returns profile and token (tests)
- [ ] 5.4 `/verify` page

## 6. The embed

- [ ] 6.1 `<voit-challenge>` custom element: attributes read in one function, missing-pack message, shadow root styled from the approved mockup
- [ ] 6.2 Decide, rank (drag and keyboard) and write (280 limit, paste blocked) views (DOM tests)
- [ ] 6.3 Integrity signals: time away, paste attempts, bulk input (DOM tests)
- [ ] 6.4 On finish: profile view and hidden `voit-result` input in the host form (DOM test)
- [ ] 6.5 Demo application form page and `/practice` page with the consent line

## 7. Verify

- [ ] 7.1 All tests pass; one live grader check run by hand
- [ ] 7.2 Founder plays the pack locally in embed and practice modes and checks a token at `/verify`
