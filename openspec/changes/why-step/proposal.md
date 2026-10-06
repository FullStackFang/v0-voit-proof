## Why

The founder's goal for the MVP (2026-10-06): quick, grabs reasoning, and the reasoning helps hiring firms filter through the noise. Today a call records only which option was picked. Two applicants with the same pick can have found the real problem or guessed; the employer cannot tell them apart.

## What Changes

- Every decide and rank call gets a second step: **"What decided it?"**, answered in the candidate's own words (80 characters, typed, paste off). Free text only (founder, 2026-10-06: "we want the person's reasoning", not a multiple choice).
- The embed set becomes 4 calls (3 gold, 1 open), each with its Why; the separate write item leaves the embed. Practice still plays every item.
- The signed result carries the reasoning: each call's Why, as typed.
- `/pool` and `/verify` show each applicant's reasoning beside their score. Order still comes from the gold score only.
- Shown as in `mockups/reasoning.html` frames 03 to 05, without the Spot step. Spot, skill choice and résumé claims stay deferred.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `challenge-session`: the embed set has 4 calls and no write item; every decide and rank answer carries a Why.
- `signed-result`: the payload adds the reasoning.
- `ranked-pool`: shows reasoning beside each applicant, without reordering.

## Impact

- No content change.
- `src/server/` bank, draw, sessions, scoring, result, pool; `src/embed/player.ts`; `/verify` and `/pool`.
- One additive migration on the shared database: `proof.answers.why jsonb` (founder's go before applying).
- Builds on `voitproof-captcha` (the centred window).
