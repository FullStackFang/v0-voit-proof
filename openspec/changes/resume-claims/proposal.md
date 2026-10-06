## Why

Slice 1 tests general judgment in a big tile inside the form, and never touches what the applicant actually claims. The spine promises employers "résumé claims checked", and the design language already reserves yellow for "a claim that did not match the work". This slice makes Voit behave like the captcha everyone knows, and makes what it checks the résumé itself: the skills the applicant claims that the role needs.

Approved by the founder on 2026-10-06: the flow in `mockups/claims.html` (mockup 05), rendered as in `mockups/widget.html` (mockup 06), under the name **voitProof**.

## What Changes

- Builds on `voitproof-captcha` (the captcha box and window, the form gate).
- Claims come from the résumé the applicant attached in the same form. The résumé is read in the applicant's browser and matched against the role's skill list; it is never sent to Voit.
- The first screen in the window lists the role's skills, ticked where the résumé claims them. The applicant confirms, unticks or adds claims. A role skill not on the résumé can be added.
- The calls are drawn only from the confirmed claims: one or more gold calls per claim (at least 3 in all), 1 open call, then 1 note, all from confirmed skills.
- **BREAKING** Items and the profile are organised by **skill** (SQL, TypeScript, Linux, Python for the first role), replacing the six areas.
- The signed result carries each role skill's claim (on the résumé or not, confirmed or not) and how it scored. A claim that scored under half gets the yellow flag; a claim on the résumé that was not confirmed shows as "skipped". Flags never reorder.
- `/pool` and `/verify` show claims beside results. Pool order still comes from total gold score only.
- The demo ships a fictional résumé, Ada Moreno (SQL, TypeScript, Linux), as a PDF, with a link on `/apply` to use it.
- New content: about 6 items per skill for 4 skills, reviewed by the founder before it ships, as in slice 1.

## Capabilities

### New Capabilities
- `resume-claims`: reading the attached résumé in the browser, matching it to the role's skills, the confirm screen, and the claims sent with the session.

### Modified Capabilities
- `challenge-embed`: reads the `resume` attribute; the band names each call's claim.
- `challenge-session`: a session starts with the confirmed claims; the embed set is drawn from them.
- `item-bank`: items name a skill instead of an area; packs list their role's skills and need enough items per skill.
- `scoring`: the profile is per skill; the held-up rule for a claim.
- `signed-result`: the payload adds claims and how each scored.
- `ranked-pool`: shows claims and their flags beside each applicant; order unchanged.

These capabilities are defined in `openspec/changes/judge-the-ai/specs/`, which is archived into `openspec/specs/` before this change is applied.

## Impact

- `src/embed/` player rewritten around the box and the window; `src/server/` bank, draw, sessions, scoring and result change for skills and claims; `/pool`, `/verify`, `/apply`, `/practice` updated.
- New dependency: `pdfjs-dist`, served from our own origin and loaded only when a PDF résumé is attached.
- Content in `content/` reorganised by skill; first pack gains a skill list.
- One small migration on the shared database (founder's go first): `proof.sessions` gains a `claims` JSON column. The résumé itself is never stored.
- Nothing outward-facing; still local only.
