## Context

The player (`src/embed/player.ts`) is one custom element in a shadow root that renders views as HTML strings: intro, item, practice feedback, end. It already talks to `POST /api/sessions` and `/answers`, records signals, and writes `voit-result` into the host form. Only its shell changes.

## Goals / Non-Goals

**Goals:** look and behave like the captcha people know; keep every piece of data the server already collects; small.

**Non-Goals:** résumé claims, skills and new content (change `resume-claims`); making questions hard for AI (the founder is less concerned about models for now; the solvability script stays as optional tooling); showing the candidate their profile in the form.

## Decisions

**Box and window live in the same shadow root.** The box is 304 × 78. The window is `position: fixed` in the shadow root, centred over the page on a dimmed veil (founder, 2026-10-06: centred, not anchored beside the box as mockup 06 drew it). No shadow, per The Gate. Alternative: an iframe like reCAPTCHA. Rejected: the shadow root already isolates styles.

**The window reuses the item views.** The band holds the artifact label and the question; under it the artifact and the answer controls; the footer holds the counter and one button (`Next`, and `Done` on the last item). Practice feedback renders in the same window. The consent line stays above the first item.

**Clicking the box starts the session.** No request happens on page load. Closing the window (×, Escape, or a click on the veil) keeps the session and the current item in memory; clicking the box reopens the window at the same item. A reload of the host page loses the session, as today.

**The element gates the host form.** While not ticked, it disables the form's submit buttons (those it finds: `button` without a type or of type submit, `input[type=submit]`) and cancels the form's `submit` event. On finish it writes `voit-result`, ticks the box, closes the window and re-enables exactly the buttons it disabled; it does the same if removed from the page.

**On finish the candidate sees the tick and nothing else.** The profile and written answer stay in the signed result for the employer and in `/verify`. Alternative: a "see your calls" link. Deferred: not needed for collecting data.

## Risks / Trade-offs

- [Disabling the host's button can clash with the host's own scripts] → Only the buttons the element disabled are restored, and only by the element.
- [A candidate closes the page mid-way and loses progress] → Same as today; sessions are short.
- [A fixed window inside a host with transforms on an ancestor is positioned against that ancestor] → The demo form has none; noted for real employers' pages.
