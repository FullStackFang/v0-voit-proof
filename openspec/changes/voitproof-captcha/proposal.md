## Why

The slice 1 player sits in the application form as a big tile with a headline, and reads as a test the candidate is made to sit. The founder wants something quick and captcha-like that collects useful data now, to be used later (2026-10-06). The data side already exists: every session stores each answer, server timings, integrity signals and the served items. This change only replaces how the player looks and behaves in the form.

Approved: the rendering in `mockups/widget.html` (mockup 06) and the name **voitProof**; variant A, the checkbox gate, in `mockups/captcha.html` (mockup 04).

## What Changes

- **BREAKING** In embed mode the player renders as a captcha: a 304 × 78 box with a checkbox, the seal and the `voitProof` wordmark, and Privacy · Terms. No headline, no start screen.
- Clicking the box starts the session and opens the challenge window beside the box: a blue band with the task, the work, one button. The current calls run in it unchanged (4 calls, then 1 note). On finish the window closes and the box ticks.
- The host form cannot be submitted until the box is ticked.
- Practice shows the same window inline on the page.
- Nothing changes on the server, in storage, scoring or the signed result.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `challenge-embed`: renders as a captcha box plus a challenge window; gates the host form's submit; practice renders the window inline.

The base spec is `judge-the-ai`'s, archived into `openspec/specs/` before this change is applied.

## Impact

- `src/embed/player.ts`, `src/embed/styles.ts` and the player's DOM tests. `/practice` page copy. No server, database or content change.
