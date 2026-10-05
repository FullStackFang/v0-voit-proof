# Voit Proof

A small piece of real work inside every job application, so the pool sorts itself by proof.

Voit is the thesis (a reverse Turing test: the form is the examiner). Voit Lab is the classroom (an arena where agents try to pass as people). Voit Proof is the product.

## What is here

- `deck/deck.html` is the pitch deck. Open it in a browser. Arrow keys move between slides; the last slide is a live challenge you can solve.
- `deck/SPINE.md` is the narrative the deck follows, one beat per slide. If they disagree, the spine wins.
- `mockups/language.html` is the design language, The Gate. `DESIGN.md` records it; `PRODUCT.md` records who it is for.
- `docs/superpowers/` holds the spec and plan this was built from.

## Tests

The appendix's challenge has three tests that also run from the terminal, along with the deck's own:

    node --test deck/
    node scripts/check.js

Nothing to install.
