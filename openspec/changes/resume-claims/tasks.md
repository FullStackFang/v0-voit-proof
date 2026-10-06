## 1. Approvals and base (founder approves before any code)

- [x] 1.1 Mockups approved: flow `mockups/claims.html` (05), rendering `mockups/widget.html` (06), name voitProof, variant A over B (`mockups/captcha.html`)
- [ ] 1.2 `voitproof-captcha` applied and archived first: this change builds on its box and window
- [ ] 1.3 Item draft `openspec/changes/resume-claims/items-draft.md`, written to the question guide in design.md: for SQL, TypeScript, Linux and Python, 4 gold, 1 open decide or rank, 1 write each (24 items), each gold item naming the pattern it relies on; plus the pack's skills and aliases and Ada Moreno's résumé text
- [ ] 1.4 Founder approves the draft and the résumé text

## 2. Item bank by skill

- [ ] 2.1 Schema: items take `skill` instead of `area`; packs take `skills` (1 to 4, id, name, aliases); load fails naming pack and item for a skill not in the pack, and naming pack and skill when a skill lacks 3 gold, 1 open decide or rank, or 1 write (tests)
- [ ] 2.2 Content: the approved 24 items and the updated pack under `content/`; slice 1 items re-tagged or retired; first-pack test (4 skills, each 4 gold, 1 open, 1 write)
- [ ] 2.3 Scoring: profile per skill, claim outcome (passed, flagged, skipped) as pure functions (tests from the scoring spec)

## 3. Sessions and results with claims

- [ ] 3.1 Migration adding `proof.sessions.claims` (nullable jsonb); apply only after the founder's go; store keeps claims in both stores
- [ ] 3.2 Draw from confirmed claims: one gold per claim topped up to 3, 1 open, 1 write last, all from confirmed skills; 5 items for 1 to 3 claims, 6 for 4 (tests)
- [ ] 3.3 `POST /api/sessions` takes and validates claims in embed mode (no confirmed skill or unknown id rejected, no session created); start response adds the pack's skills (tests)
- [ ] 3.4 Signed payload adds `claims` and the per-skill profile; still no option choices (tests)

## 4. Reading the résumé

- [ ] 4.1 Skill matching: name or alias as a whole word, ignoring case (tests: alias, part of a word, case)
- [ ] 4.2 Text from the file in the browser: `File.text()` for plain text; PDF via `pdfjs-dist` built to `public/embed/` and loaded only for PDFs; failure gives empty text (tests with a stubbed extractor)
- [ ] 4.3 `scripts/demo-resume.ts` writes `public/demo/ada-moreno-cv.pdf` with `pdf-lib` (dev only); test that its extracted text matches SQL, TypeScript, Linux and not Python

## 5. The player

- [ ] 5.1 `resume` read in `readConfig` (DOM test)
- [ ] 5.2 Confirm screen as the window's first screen: role skills ticked when on the résumé, "on your résumé" or "not on your résumé", consent line, Start needs one tick; "Attach your résumé first." when no file (DOM tests)
- [ ] 5.3 The band names the claim each call tests (DOM test)

## 6. Pages

- [ ] 6.1 `/verify` and `/pool`: claims beside results (passed blue, flagged yellow ring, skipped grey); slice 1 tokens still show; pool order unchanged (tests for the pool)
- [ ] 6.2 `/apply`: the box above Submit, the résumé input, and a "Use the sample résumé" link to the demo PDF

## 7. Verify

- [ ] 7.1 All tests pass, typecheck clean, `npm run build` passes
- [ ] 7.2 Founder plays it locally: attach the sample résumé, tick the box, confirm, answer, submit to `/verify`, order a few tokens at `/pool`
