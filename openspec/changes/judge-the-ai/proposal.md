## Why

Applying became free, so applications stopped meaning anything, and AI makes every written answer look the same. Voit Proof's first slice puts a small piece of real judgment into the application: the candidate judges AI output. Gold items (known answers) score the candidate; open items (questions AI is unsure about) turn trusted answers into labels, so every attempt also builds a bank of human judgment no single employer could build.

## What Changes

- A bank of judgment items in three formats: **decide** (pick one), **rank** (put in order), **write** (free form, up to 280 characters, paste blocked). Items are JSON in the repo; gold items carry an answer, open items do not.
- Packs: an ordered list of items for a role. First pack: education-platform engineer at a fictional employer, 8 gold and 4 open items.
- Sessions served one item at a time by the server, in two modes: **embed** (gold only, applying as a guest) and **practice** (gold and open mixed, indistinguishable).
- Scoring: exact match for decide, rank distance for rank, an AI grader against a rubric for write. A per-area competency profile, not one number.
- Labels: open answers weighted by the session's gold accuracy; decide and rank items become eligible to graduate to gold by weighted agreement, approved by a person.
- Integrity signals recorded and flagged, never used to reject.
- A signed result token, attached to the application form, verifiable at `/verify` or offline.
- `<voit-challenge pack="...">`: a framework-free web component that drops into any HTML form.
- New Next.js app with Postgres storage. Everything local; nothing deployed or pushed.

## Capabilities

### New Capabilities
- `item-bank`: item and pack format, the three formats, gold vs open, exposure tracking, the first pack.
- `challenge-session`: starting a session, serving one item at a time, embed vs practice sets, feedback rules, integrity signals.
- `scoring`: per-format scoring, the AI grader for write items, the competency profile, gold accuracy, open-item labels and graduation.
- `signed-result`: the result token, its payload, the public key and verification.
- `challenge-embed`: the `<voit-challenge>` custom element, its attributes, rendering and form integration.

### Modified Capabilities
<!-- none: no existing specs -->

## Impact

- New code: a Next.js (TypeScript) app at the repo root, an embed bundle served as `/embed.js`, API routes under `/api/sessions`, pages `/practice`, `/verify` and a demo application form.
- New dependencies: Next.js, a Postgres client (Supabase, pending founder confirmation), the Anthropic SDK (write-item grader), `jose` (token signing), a test runner with a DOM environment.
- New secrets (local `.env` only): database URL, Anthropic API key, Ed25519 signing key.
- This change is the source of truth for slice 1.
