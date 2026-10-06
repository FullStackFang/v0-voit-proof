## Context

The voitProof window serves one call at a time; each answer is posted with its signals and stored in `proof.answers`. Scoring is deterministic and the pool orders by gold score, with flags shown but never reordering.

## Goals / Non-Goals

**Goals:** the candidate's reasoning per call, in their words; something a recruiter can read in the pool; still about three minutes; scoring unchanged.

**Non-Goals:** scoring or ranking by reasoning; AI reading of own words; the Spot step, skill choice and résumé claims (deferred).

## Decisions

**Free text only.** The founder chose the candidate's own words over picking from authored reasons (2026-10-06): the point is the person's reasoning, and a multiple choice would put words in their mouth. An earlier version of this change had three tagged reasons and counted "named the cause"; it was dropped before shipping. Nothing reads or grades the words automatically; the employer reads them.

**The Why is part of the same answer.** The player shows the call, then the Why in the same window; one request carries both: `{ itemId, answer, why, signals }`, where `why` is the candidate's words (1 to 80 characters). A decide or rank answer without a Why is rejected. Stored in a new nullable `why jsonb` column on `proof.answers`, so labels and scoring keep reading `answer` unchanged.

**Shown, not scored.** The signed result carries `reasoning: string[]`, one Why per decide or rank call in the order served. The gold score and the pool order do not change; the pool shows the words beside the score, as flags are shown.

**The embed loses its write item.** 4 calls × 2 taps keeps it near three minutes; own words on the Why replace the note. `written` in the result stays (null in embed) for practice and old tokens.

## Risks / Trade-offs

- [Some will type filler] → That is itself a signal a recruiter can read; it never changes the order.
- [Migration on the shared database] → One additive nullable column; old rows keep null.
