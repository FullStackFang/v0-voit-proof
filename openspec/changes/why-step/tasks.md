## 1. Content

- [x] 1.1 Founder's go on the slice: a Why after each call, reasoning shown in the pool (2026-10-06)
- [x] 1.2 Free text only, no authored reasons (founder, 2026-10-06); the reasons and tags drafted earlier are removed from `content/`

## 2. Server

- [x] 2.1 Remove the reasons and tags from the item schema and content (tests)
- [x] 2.2 Embed draw: 3 gold + 1 open, no write (tests)
- [x] 2.3 Answers take `why` (own words, 1 to 80 characters), required for decide and rank; stored with the answer (tests)
- [x] 2.4 `reasoning`: each call's Why in served order, into the signed payload (tests)
- [x] 2.5 Migration `proof.answers.why jsonb`; both stores keep it; apply after the founder's go

## 3. Player and pages

- [x] 3.1 The Why screen after each decide and rank call: one box, own words (80, paste blocked), one request with the answer (DOM tests)
- [x] 3.2 `/pool` and `/verify` show the reasoning; old tokens without it (tests for the pool)

## 4. Verify

- [x] 4.1 All tests pass, typecheck clean, build passes
- [x] 4.1a Tweet-sized calls: limits enforced at load, six items trimmed (founder, 2026-10-06), lines wrap instead of scrolling
- [ ] 4.2 Founder plays it and reads a few results in `/pool`
