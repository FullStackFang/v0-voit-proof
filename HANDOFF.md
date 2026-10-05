# Handoff: Voit Proof

Read this first in every session. "Continue" means do the top item under Next steps, nothing else.

## What this is

Voit Proof is the product: a small piece of real work embedded in every job application, so the pool sorts itself by proof. A recruiter pastes one line (`<voit-challenge role="full-stack">`), the candidate fixes one real bug in about ten minutes as a guest, the work is scored (tests pass or not, and how they worked compared with strong developers), and the recruiter's pool reorders with the strongest real applicants at the top and nobody removed. Candidates get standing, feedback and a verified record. Free for candidates; employer teams pay for custom challenges from their own code.

Family: `../v0-voit` (research sim), `../v0-voit-lab` (workshop arena). This repo shares the wordmark grammar, Hanken Grotesk, Plex Mono and the voice with Lab, and nothing else. Lab's language is The Ruled Line; ours is The Gate.

## Working agreements with the founder

- **Build the product, never decks.** `docs/SPINE.md` is narrative context, not a deliverable. A deck was built from it by mistake on 2026-10-05 and the founder was angry. Do not repeat.
- **Mockups before building.** Design changes are reviewed as static HTML the founder opens themselves.
- **Less is more.** Quiet surfaces, few elements, one thing moving at a time.
- **Protect the machine.** No automated or visible browsers, one subagent at a time at most, ask before heavy processes.
- **Ask before anything outward-facing:** GitHub remote, Vercel, public artifact links. Nothing is pushed or deployed yet.
- Before building, name the product slice in one sentence and get a yes. Do not offer menus of artifacts.

## State (2026-10-05)

- Repo initialised locally on `master`, four commits, no remote.
- `PRODUCT.md`, `DESIGN.md`, `mockups/language.html`: the approved design language **The Gate** (warm cream and charcoal grounds; five colour roles: proof blue, you coral, team teal, flag yellow, noise lilac; rounded tiles; pill buttons; Bricolage Grotesque, Hanken Grotesk, IBM Plex Mono, Pixelify Sans for one counter). Founder's references: Clay (warmth, tiles) and Handshake AI (section rhythm, mono and pixel details); Handshake's neon palette and Lab's paper-and-rules were rejected.
- `deck/` is **untracked**: a half-built deck (slides 1 to 4 of 13) restored from history so the founder could look at it. Its fate is undecided. Do not commit it or continue it unless asked.
- No product code exists yet. No `package.json`, no framework chosen.

## Next steps

1. **Confirm the first product slice with the founder, then spec it.** Proposed: `<voit-challenge>` as a real web component that renders inline in any HTML form, runs one bug-fix challenge in the browser (editor, tests, pass or not yet), and reports the result. Ranked pool, accounts and records come after. Use the brainstorming skill; write the spec to `docs/superpowers/specs/`.
2. Decide the stack with the founder before scaffolding (the workspace default is Next.js on Vercel; the embed itself should be framework-free).
3. Decide the untracked `deck/` folder's fate: finish, delete, or leave.
