## Why

Applying became free, so applications stopped meaning anything, and AI makes every written answer look the same. Voit Proof's first slice puts a small piece of real judgment into the application: the candidate judges AI output, in about three minutes. Gold items (known answers) score the candidate deterministically; open items (questions without a settled answer) turn trusted answers into calibration labels, so every attempt also builds a bank of human judgment no single employer could build.

Revised 2026-10-05 after the investor review of the pitch deck (Variant C): short per application, deterministic scoring, an honest written sample, and a minimal ranked pool so the pilot can measure whether challenge-ranked applicants earn more interviews.

## What Changes

- A bank of judgment items in three formats: **decide** (pick one), **rank** (put in order), **write** (free form, up to 280 characters, paste blocked). Items are JSON in the repo. Only decide and rank items can be gold; write items are always unscored.
- Packs: an ordered list of items for a role. First pack: education-platform engineer at Fernhill Learning (fictional), 6 gold, 3 open decide or rank, 3 write.
- Sessions served one item at a time by the server, in two modes: **embed** (about three minutes: 3 gold and 1 open, indistinguishable, then 1 write; applying as a guest) and **practice** (every item, with reasons after gold and write items). A consent line before the first item in both.
- Scoring: exact match for decide, rank distance for rank. No AI in scoring. A per-area competency profile, not one number.
- The written answer travels with the result, in the candidate's own words, for a reviewer to read. It is never scored.
- Labels: open answers weighted by the session's gold accuracy; open decide and rank items become eligible to graduate to gold by weighted agreement, approved by a person.
- Items can be marked retired by a person (for example after a leak). A model-solvability check is out of the MVP.
- Integrity signals recorded and flagged, never used to reject.
- A signed result token (served item ids, profile, written answer, flags), attached to the application form, verifiable at `/verify` or offline.
- `/pool`: a recruiter pastes tokens and gets the genuine ones ordered by gold score, with ties kept as ties and nobody removed.
- `<voit-challenge pack="...">`: a framework-free web component that drops into any HTML form.
- Next.js app with Postgres storage. Everything local; nothing deployed.

## Capabilities

### New Capabilities
- `item-bank`: item and pack format, the three formats, gold vs open, write items always open, retirement, exposure tracking, the first pack.
- `challenge-session`: starting a session, the three-minute embed set, practice set, consent, serving one item at a time, feedback rules, integrity signals.
- `scoring`: deterministic per-format scoring, the competency profile, gold accuracy, open-item labels and graduation.
- `signed-result`: the result token, its payload, the public key and verification.
- `challenge-embed`: the `<voit-challenge>` custom element, its attributes, rendering and form integration.
- `ranked-pool`: the `/pool` page that orders pasted tokens by gold score without removing anyone.

### Modified Capabilities
<!-- none: no existing specs -->

## Impact

- New code: a Next.js (TypeScript) app at the repo root, an embed bundle served as `/embed.js`, API routes under `/api/sessions`, pages `/practice`, `/verify`, `/pool` and a demo application form.
- Dependencies: Next.js, a Postgres client (Supabase, shared Lab project, own `proof` schema), `jose` (token signing), Vitest with happy-dom.
- Secrets (local `.env` only): database URL, Ed25519 signing key.
- Already built and now superseded: the AI write grader (`src/server/grader.ts`) is removed; the item schema, first-pack content and label report change as listed in `tasks.md`.
- This change is the source of truth for slice 1.
