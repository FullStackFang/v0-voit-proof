## 1. Base

- [x] 1.1 Mockups approved: `mockups/widget.html` (06), name voitProof, variant A (`mockups/captcha.html`); founder asked for a quick captcha-like MVP that collects data (2026-10-06)
- [x] 1.2 Archive `judge-the-ai` so its specs become the base (its 7.2 play-through is replaced by this change's 3.2)

## 2. The player as a captcha

- [x] 2.1 Box: 304 × 78, checkbox, seal, voitProof wordmark, Privacy · Terms; waiting, working, ticked; no request until clicked (DOM tests)
- [x] 2.2 Window: fixed in the shadow root, anchored beside the box or centred, veil, blue band with label and question, one button; ×, Escape and veil close it and keep the place; the box reopens it (DOM tests)
- [x] 2.3 Calls, consent, signals and practice feedback inside the window (port the slice 1 DOM tests)
- [x] 2.4 Form gate: disable the host's submit buttons and cancel submit until ticked; on finish write `voit-result`, tick, close, re-enable exactly those; re-enable on removal (DOM tests)
- [x] 2.5 Practice: the window inline, no box, no gate (DOM test)

## 3. Verify

- [x] 3.1 All tests pass, typecheck clean, `npm run build` passes
- [ ] 3.2 Founder plays it: `/apply`, tick the box, finish, submit to `/verify`; `/practice`; a few tokens at `/pool`
