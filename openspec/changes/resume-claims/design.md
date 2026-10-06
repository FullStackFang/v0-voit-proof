## Context

Slice 1 (`judge-the-ai`) is built and tested: item bank, deterministic scoring, signed results, the session API, `/verify`, `/pool`, and a `<voit-challenge>` player that renders as a large tile inside the host form. The founder reviewed the direction on 2026-10-06 and approved three mockups: the claims flow (`mockups/claims.html`, mockup 05), the captcha rendering (`mockups/widget.html`, mockup 06) and the name `voitProof`. Mockup 04 (`mockups/captcha.html`) settled variant A, the checkbox gate, over submit-triggered.

Constraints carried over: no AI in scoring; gold answers never reach the browser; the server owns order and clock; no automated browsers in tests (happy-dom only); nothing deployed. Founder's direction: simple, game-like, short.

## Goals / Non-Goals

**Goals:**
- The widget is the familiar captcha object: same size, same parts, same click-to-open window.
- What it checks is what the applicant claims, taken from their own résumé, confirmed by them.
- The résumé never leaves the applicant's browser.
- The employer sees each claim beside how it scored, and a pool ordered exactly as before.

**Non-Goals:**
- Any AI reading of résumés. Matching is literal: skill names and aliases.
- `.docx`, images or scanned PDFs. PDF with text, and plain text, only. A résumé we cannot read still works: nothing is pre-ticked, and the applicant ticks claims by hand.
- Claims beyond the role's own skill list, and more than 4 skills per role.
- Proving that the applicant attached a résumé that matches the claims: the employer holds the résumé and can compare. Voit signs what was confirmed and how it scored.
- Changing how `/pool` orders.

## Decisions

**Skills replace areas.** Each item names one `skill` (an id from its pack's skill list); the six areas go. A pack lists its role's skills, each with a display name and aliases for matching (`{ "id": "sql", "name": "SQL", "aliases": ["PostgreSQL", "Postgres", "MySQL"] }`). The profile becomes per skill, which is exactly the per-claim result the mockups show. Alternative: keep areas and add skills alongside. Rejected: two groupings to author, and the area profile would no longer be shown anywhere.

**The résumé is read in the browser, matched literally.** The element finds the résumé in its host form: the input named by its `resume` attribute (a CSS selector), else the form's first `input[type=file]`. Text comes from `File.text()` for plain text and from `pdfjs-dist` for PDF. pdf.js is large, so it is a separate file under `/embed/` on our origin, loaded only when a PDF is attached. A skill is "on the résumé" when its name or an alias appears as a whole word, case-insensitive. Only skill ids leave the browser. Alternatives: send the file to our server for parsing (rejected: we would hold résumés, and the design promises we hold no applicant records); ask an AI to extract skills (rejected: non-deterministic, needs the file on a server, and adds legal exposure).

**The confirm screen shows "on your résumé", not the section it was found in.** Mockup 05 showed sections ("Experience, Skills"). Finding sections in free-form résumés is fragile, and the point is only whether the claim is there. The screen shows each role skill ticked when on the résumé, with "on your résumé" or "not on your résumé". The applicant can untick or add; at least one claim is needed to start.

**Draw from the confirmed claims.** One gold call per confirmed claim, topped up to 3 gold by drawing more from the confirmed skills in turn; then 1 open decide or rank call from a confirmed skill, shuffled in with the gold; then 1 write item from a confirmed skill, last. With 1 to 3 claims that is 5 items; with 4 claims, 6. The open-item calibration from slice 1 keeps working. Alternative: always exactly 4 calls. Rejected: with 4 claims one claim would go untested.

**Passed, flagged, skipped.** Per confirmed claim: earned of gold count. A claim "passed" when earned is at least half its gold count; otherwise it carries the yellow flag. A skill on the résumé that the applicant unticked is "skipped" (grey, never hidden). A skill added by hand that passes is shown like any other confirmed claim. None of this changes the pool order, which stays total gold score.

**Claims travel in the start request and the token.** `POST /api/sessions` takes `{ pack, mode, claims: { onResume: string[], confirmed: string[] } }`. The server validates ids against the pack, stores them on the session (`proof.sessions.claims`, one JSON column), draws from `confirmed`, and signs `claims: [{ skill, onResume, confirmed }]` into the result alongside the per-skill profile. `onResume` is the browser's report and is signed as such; the employer can check it against the résumé they received.

**The captcha box and window come from `voitproof-captcha`.** This change adds the confirm screen as the window's first screen and the skill in the band.

**The demo résumé is a real PDF built by a script.** `scripts/demo-resume.ts` writes `public/demo/ada-moreno-cv.pdf` with `pdf-lib` (dev only), so the matching runs through pdf.js exactly as a real résumé would. `/apply` links to it ("Use the sample résumé"), and downloading it lets the founder attach it like any file.

**How questions are written: around a known way models fail.** Slice 1's gold items were written around facts a good engineer knows, and the solvability run on 2026-10-05 found current models solve 86% of them (every decide item at 100%; the two rank items at 47% and 67%). An applicant who relays a question to a chatbot then scores like an expert, and the claim check means nothing. So every gold item is written around a failure mode a person in the job catches and current models miss, and is measured before it ships. The guide for authors:

- **The catch is in the work shown, never in the wording.** A careful person must be able to find it from the artifact alone. No trick phrasing, no trivia, no knowledge outside the role.
- **Patterns to try**, each a hypothesis until measured:
  - *A premise that is quietly wrong*: the question or the assistant's note asserts something the artifact contradicts.
  - *A constraint across two pieces*: the rule lives in one artifact (a schema, a ticket, a log) and the breach in another; neither alone shows it.
  - *Best practice that is wrong here*: the textbook fix is the wrong call given what the artifact says about this system.
  - *Consequences and order over spotting*: which step is irreversible, what to do first, who is affected; rank items held up best in slice 1.
  - *State over time*: a log or sequence where the bug only shows across several lines.
- **What does not work on its own**: a constraint stated plainly in a comment (`due-date-zone` states its time-zone rule and was solved 100%), and a well-known bug class presented as such (the SQL LEFT JOIN item in mockup 05 is a textbook case).
- **Write items are exempt**: they are never scored, and their value is the applicant's own words.

**The solvability check is measured, not a gate.** On 2026-10-06 the founder agreed a 30% gate, then, after a rough pass on five items mined from real fixes solved 90% (multiple choice lets a model recognise the answer instead of finding it), set it aside: the MVP is a quick captcha that collects data, and resistance to AI comes later with formats where the answer is not on screen. `npm run solvability` stays as tooling; its numbers are recorded beside items, and nothing blocks on them.

## Risks / Trade-offs

- [The `onResume` list is reported by the browser and could be forged] → It is labelled as reported, and the employer has the résumé. What matters for the pool, the gold score, is server-scored.
- [Applicants untick weak claims to avoid a flag] → Unticked claims still show, as "skipped", so dropping a claim is visible, not free.
- [One gold call per claim is a thin signal] → Shown as counts ("1 of 1"), never as a verdict; the flag only marks under half.
- [pdf.js weight and failures] → Loaded only for PDFs, from our origin. If text extraction fails, nothing is pre-ticked and the applicant ticks by hand.
- [Disabling the host's submit button can clash with the host's own scripts] → The element only toggles `disabled` on buttons it found and records which it changed; it restores exactly those.
- [Twenty-plus new items is real authoring work] → Draft, then founder approval, as in slice 1.
- [Items hard for models can drift into items hard or unfair for people] → The author rule (the catch is in the work shown) and the founder's review; open items' answer patterns from real applicants show later whether people find the catch.

## Migration Plan

1. Archive `judge-the-ai` so its specs become the base this change modifies.
2. Apply the migration adding `proof.sessions.claims` (nullable JSON) after the founder's go. Existing rows keep null; old tokens still verify, and `/verify` and `/pool` show them without claims.
3. Content: old items are re-tagged by skill or retired; nothing in past results depends on areas except the old tokens' profiles, which display as they are.

## Open Questions

None open. Skills for the first role (SQL, TypeScript, Linux, Python) come from mockup 05; the founder approves the item draft before content ships.
