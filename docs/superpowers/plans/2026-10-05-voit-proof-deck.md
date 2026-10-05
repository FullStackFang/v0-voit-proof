# Voit Proof Deck Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the `v0-voit-proof` repo with its context files and build the thirteen-slide deck with a live appendix, in The Gate language.

**Architecture:** A static site with no build step: `deck/deck.html` holds the tokens, the thirteen slides and the embed diagram; `deck/appendix.js` holds the only logic (the bugged function, the three tests, the feedback table, the tallies) and is written so Node can import it for tests while the page uses it as a plain script. Context files (`PRODUCT.md`, `DESIGN.md`) are derived from the approved specimen `mockups/language.html`.

**Tech Stack:** HTML, CSS (OKLCH tokens), vanilla JavaScript, Google Fonts. Node 20+ only for running the appendix tests from the terminal (`node --test`). No package.json, no dependencies.

**Spec:** `docs/superpowers/specs/2026-10-05-voit-proof-deck-design.md` (sections 4 to 6 are the design; `deck/SPINE.md` is the copy; `mockups/language.html` is the visual truth).

## Global Constraints

- No framework, no `package.json`, no dependencies. Fonts from Google Fonts only, with real fallback stacks.
- Tokens exactly as in `mockups/language.html`: two grounds (`cream`, `charcoal`), five roles (`proof`, `you`, `team`, `flag`, `noise`), each with strong and tint; `--fail` only inside the editor output.
- No pure `#000` or `#fff`, no gradients, no shadows, no nested tiles, no side-stripe borders, no em dashes in copy (also not `--` in prose).
- Type: Bricolage Grotesque (display), Hanken Grotesk (body), IBM Plex Mono (labels, data), Pixelify Sans (slide counter only).
- Exactly one coral stroke per figure. Red only for a failing test line.
- Copy follows `deck/SPINE.md` verbatim where it gives words; headlines end with a full stop. Drafted figures and lists carry a visible "Draft" tag.
- Motion: one 400ms ground cross-fade, the embed strokes draw once on scroll. `prefers-reduced-motion` shows final states only.
- Nothing outward-facing: no GitHub remote, no Vercel, no public artifact. Commits are local. The founder opens the deck themselves; do not launch browsers.
- Commit messages end with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Review Focus

1. **Editor text with a syntax error** (unbalanced brace): "Run tests" must show one message line, never throw to the console or leave stale results. Pinned in Task 6.
2. **A fix that passes by hard-coding** (returning the expected literal for the failing case): the third test uses a different input than the visible failing output, so a literal fails. Pinned in Task 6.
3. **Keyboard navigation at the ends** (ArrowDown on slide 13, ArrowUp on slide 1): no wrap, no error. Pinned in Task 2.
4. **Reduced motion on**: the embed strokes must be fully drawn on load with no observer dependency. Pinned in Task 4.
5. **Narrow viewport (400px)**: no horizontal scroll; two-column slides stack. Pinned in Task 7's check script (CSS grid rules present) and the founder's visual review.

---

### Task 1: Repository scaffold and context files

**Files:**
- Create: `.gitignore`, `README.md`, `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md`
- Existing: `deck/SPINE.md`, `mockups/language.html`, `docs/superpowers/specs/...`, `docs/superpowers/plans/...`

**Interfaces:**
- Produces: `DESIGN.md` token names used by every later task (`--ground`, `--ground-2`, `--ink`, `--ink-2`, `--line`, `--proof`, `--proof-tint`, `--you`, `--you-tint`, `--team`, `--team-tint`, `--flag`, `--flag-tint`, `--noise`, `--noise-tint`, `--fail`).

- [ ] **Step 1: Initialise git and ignore files**

```bash
cd ../v0-voit-proof
git init -b master
printf '%s\n' '.DS_Store' 'Thumbs.db' 'node_modules/' '.playwright-mcp/' > .gitignore
```

- [ ] **Step 2: Write `README.md`**

```markdown
# Voit Proof

A small piece of real work inside every job application, so the pool sorts itself by proof.

Voit is the thesis (a reverse Turing test: the form is the examiner). Voit Lab is the classroom (an arena where agents try to pass as people). Voit Proof is the product.

## What is here

- `deck/deck.html` is the pitch deck. Open it in a browser. Arrow keys move between slides; the last slide is a live challenge you can solve.
- `deck/SPINE.md` is the narrative the deck follows, one beat per slide. If they disagree, the spine wins.
- `mockups/language.html` is the design language, The Gate. `DESIGN.md` records it; `PRODUCT.md` records who it is for.
- `docs/superpowers/` holds the spec and plan this was built from.

## Tests

The appendix's challenge has three tests that also run from the terminal:

    node --test deck/

Nothing to install.
```

- [ ] **Step 3: Write `CLAUDE.md`**

```markdown
# CLAUDE.md

Read `deck/SPINE.md`, then `DESIGN.md`, then `mockups/language.html` before touching anything.

## Working agreements

- Mockups before building. Design changes are reviewed as static HTML the founder opens themselves. Nothing is built until approved.
- Less is more. Quiet surfaces, few elements, one thing moving at a time.
- Protect the machine. No automated or visible browsers, no background agents in parallel, ask before heavy processes.
- Ask before anything outward-facing: GitHub, Vercel, public links.
- No em dashes in copy. Headlines end with a full stop. Counted things are mono.

## Family

`../v0-voit` (research sim), `../v0-voit-lab` (workshop arena, its own language The Ruled Line), this repo (the product, The Gate). Shared: the stroke-bundle wordmark grammar, Hanken Grotesk, IBM Plex Mono, the voice.

## Commands

    node --test deck/        # the appendix challenge's tests
    node scripts/check.js    # copy and token rules (after Task 7)
```

- [ ] **Step 4: Write `PRODUCT.md`** (impeccable's format)

```markdown
# Product

## Register

brand

## Users

- **Recruiters** at mid-size software companies hiring remote developers (Priya). Buried in identical applications, some of them organised fraud. Wants a trustworthy shortlist without rejecting anyone automatically.
- **Engineering managers** who curate the challenges and read the flagged cases. Want signal, not another tool to run.
- **Candidates** (Marcus). Good at the work, invisible on paper, never hears back. Wants to be judged on work, get feedback, and keep a record that grows.
- **Investors and advisors** reading the deck without a presenter.

## Product Purpose

Applying became free, so applications stopped meaning anything. Voit Proof puts a small piece of real work back into every application: a recruiter pastes one line, the candidate fixes one real bug in about ten minutes, the work is scored and compared with strong developers, and the recruiter's pool reorders itself with the strongest real applicants at the top and nobody removed. Candidates get standing, feedback and a verified record.

Success for the deck: a careful reader follows it alone; it looks like one company with Voit Lab; the appendix lets them fix the bug and feel what a candidate feels.

## Brand Personality

Warm, exact, confident, a little playful. A product people are glad to meet, not a test they are made to sit. Evidence is precise (mono, numbers, timings); prose is friendly and short.

## Anti-references

- Clay's 3D contraptions and stock illustration. Our figure is the gate.
- Handshake AI's candy neon palette (cyan, lime, magenta on near-black) and photo-led cards.
- Assessment-platform clichés: leaderboards, badges, timers in red, "You failed".
- Generic SaaS: identical card grids, gradient heroes, glassmorphism, stat tiles everywhere.
- The Ruled Line (Voit Lab's paper-and-rules language). Shared family, different product.

## Design Principles

1. Colour says who. Blue is proof, coral is the candidate, teal is the employer, yellow flags, lilac is noise.
2. Tiles, not cards. One rounded tinted container, flat, never nested.
3. The gate is the figure. Every diagram is strokes passing gates; exactly one is coral.
4. Two grounds, one voice. Cream for reading, charcoal for statements.
5. Counted things are mono. One pixel detail: the slide counter.
```

- [ ] **Step 5: Write `DESIGN.md`** (Stitch front matter plus prose; values copied from `mockups/language.html`)

```markdown
---
name: Voit Proof
description: The Gate. Warm grounds, five colour roles, rounded tiles, and one figure, strokes passing gates.
grounds:
  cream:
    ground: "oklch(0.975 0.012 85)"
    ground-2: "oklch(0.945 0.022 80)"
    ink: "oklch(0.23 0.015 60)"
    ink-2: "oklch(0.47 0.015 60)"
    line: "oklch(0.88 0.016 80)"
    proof: "oklch(0.50 0.21 265)"
    proof-tint: "oklch(0.92 0.045 265)"
    you: "oklch(0.66 0.19 35)"
    you-tint: "oklch(0.935 0.055 40)"
    team: "oklch(0.58 0.12 180)"
    team-tint: "oklch(0.925 0.05 180)"
    flag: "oklch(0.82 0.16 92)"
    flag-tint: "oklch(0.96 0.08 95)"
    noise: "oklch(0.70 0.07 300)"
    noise-tint: "oklch(0.94 0.03 300)"
    fail: "oklch(0.56 0.19 28)"
  charcoal:
    ground: "oklch(0.215 0.015 60)"
    ground-2: "oklch(0.27 0.018 60)"
    ink: "oklch(0.965 0.012 85)"
    ink-2: "oklch(0.72 0.015 70)"
    line: "oklch(0.34 0.018 60)"
    proof: "oklch(0.72 0.15 265)"
    proof-tint: "oklch(0.32 0.06 265)"
    you: "oklch(0.76 0.16 38)"
    you-tint: "oklch(0.34 0.06 38)"
    team: "oklch(0.74 0.11 180)"
    team-tint: "oklch(0.31 0.05 180)"
    flag: "oklch(0.86 0.15 92)"
    flag-tint: "oklch(0.36 0.06 92)"
    noise: "oklch(0.72 0.07 300)"
    noise-tint: "oklch(0.31 0.03 300)"
    fail: "oklch(0.70 0.18 28)"
typography:
  display: { fontFamily: "Bricolage Grotesque, Hanken Grotesk, system-ui, sans-serif", fontSize: "92px", fontWeight: 600, lineHeight: 0.96, letterSpacing: "-0.035em" }
  headline: { fontFamily: "Bricolage Grotesque, Hanken Grotesk, system-ui, sans-serif", fontSize: "54px", fontWeight: 600, lineHeight: 1.02, letterSpacing: "-0.03em" }
  title: { fontFamily: "Bricolage Grotesque, Hanken Grotesk, system-ui, sans-serif", fontSize: "24px", fontWeight: 600, lineHeight: 1.15, letterSpacing: "-0.02em" }
  body: { fontFamily: "Hanken Grotesk, system-ui, sans-serif", fontSize: "17px", fontWeight: 400, lineHeight: 1.55 }
  label: { fontFamily: "IBM Plex Mono, ui-monospace, monospace", fontSize: "12px", fontWeight: 500, lineHeight: 1.4, letterSpacing: "0.08em", textTransform: uppercase }
  data: { fontFamily: "IBM Plex Mono, ui-monospace, monospace", fontSize: "14px", fontWeight: 400, lineHeight: 1.55 }
  counter: { fontFamily: "Pixelify Sans, IBM Plex Mono, monospace", fontSize: "15px", fontWeight: 400, letterSpacing: "0.05em" }
rounded: { chip: "10px", tile-s: "16px", tile: "24px", pill: "999px" }
spacing: { base: "8px", section: "104px", section-phone: "64px" }
components:
  button-primary: { backgroundColor: "{ink}", textColor: "{ground}", rounded: "{rounded.pill}", height: "52px" }
  button-soft: { backgroundColor: "{proof-tint}", textColor: "{proof}", rounded: "{rounded.pill}", height: "52px" }
  button-you: { backgroundColor: "{you}", textColor: "oklch(0.99 0.01 40)", rounded: "{rounded.pill}", height: "52px" }
  tile: { backgroundColor: "{ground-2}", rounded: "{rounded.tile}", padding: "28px" }
  chip: { backgroundColor: "{ground-2}", border: "1px {line}", rounded: "{rounded.chip}" }
  seal: { backgroundColor: "{proof}", rounded: "18px", size: "64px" }
---

# Design System: Voit Proof

Source of truth: `mockups/language.html` (approved 2026-10-05). This file records it.

## 1. Overview

**Creative North Star: "The Gate"**

Every application passes through a gate: a small piece of real work. Voit Proof draws that gate everywhere, in colour. Blue is proof, coral is the person, teal is the team. Warm cream, rounded tiles, big friendly type: a product people are glad to meet, not a test they are made to sit.

References the founder likes: Clay (warm neutrals, a named palette as tints, rounded tiles, pill buttons) and Handshake AI (alternating light and dark sections, mono labels, numbered steps, one pixel detail). Neither is copied. Rejected: Clay's 3D contraptions, Handshake's neon palette and photos, Voit Lab's paper-and-rules.

### Principles
1. **Colour says who.** Blue is proof, coral is the candidate, teal is the employer. The same five roles on every surface.
2. **Tiles, not cards.** One rounded, tinted container, flat, never nested. It holds a figure, a number or a screen.
3. **The gate is the figure.** Every diagram is strokes passing gates. The one in coral is the person you're looking at.
4. **Two grounds, one voice.** Cream for reading, charcoal for statements. Sections alternate; roles keep their names on both.
5. **Counted things are mono.** Numbers, code, timings, labels. Prose is friendly; evidence is exact. One pixel detail: the counter.

## 2. The mark

VOIT PROOF cut from one bundle of nine horizontal strokes (cap 72, strokes 4 thick on an 8.5 period, stems 18). VOIT in ink, PROOF in blue. The coral middle stroke stops at the 3-unit rule after VOIT and runs through every letter of PROOF and out the right side: the one that got through. Letter geometry: `#voit`, `#proof`, `#bundle` in `mockups/language.html`. The small mark is the **seal**: four strokes (the third coral) on a rounded blue plate; minimum 16px.

## 3. Colour

Two grounds. **Cream** for reading (explanation slides, the candidate's screen, docs); tiles one step deeper in oat. **Charcoal** for statements (title, strategy, the big number); warm, never black. Roles keep their names on both grounds.

Five roles, each a strong value and a tint: **Proof** (blue: the product, the seal, the primary action), **You** (coral: the candidate in focus), **Team** (teal: the employer, the shortlist), **Flag** (yellow: a claim that did not match the work, drawn as a ring), **Noise** (lilac: the pile of identical applications).

**The role rule.** A colour means its role everywhere. A button is blue because it is the product's action.
**The one-coral rule.** On any figure exactly one stroke is coral.
**No neon, no black.** Chroma stays below 0.21. Neutrals are warm. Pure black and white are prohibited. Red is only a failing test's output inside an editor.

## 4. Typography

Bricolage Grotesque 600 speaks (display, headline, title). Hanken Grotesk 400 explains (body, buttons). IBM Plex Mono counts (labels in caps at 12px with +8% tracking; data at 14px, tabular). Pixelify Sans is the slide counter and nothing else. Sentence case; headlines end with a full stop; numerals for numbers; body at most 60ch.

## 5. Shape

**Tiles** at 24px radius (16px for small tiles, 10px for chips, pills for buttons). Flat, tinted, never nested, no border except chips (1px line), no shadow. **Buttons** are pills: ink for the one action on a screen, blue tint for the quiet second, coral only for an action that belongs to the candidate; the arrow nudges 4px on hover. **Forms** on the employer's page are drawn in a system font with 8px radii, so our tile inside them reads as ours.

## 6. The gate

A gate is a test (a 2px vertical line in ink-2). A stroke is an attempt (5px, round caps). Colour says whose. Six drawings: **Pass** (coral through every gate, ending in a dot), **Not yet** (stops at a gate with a 4px bar), **Flag** (yellow ring, radius 12, on a crossing), **Noise** (identical lilac strokes, one coral), **Compared** (faint ink bundle at 35% behind the coral), **Ranked pool** (longest first; coral, then teal, then lilac; nobody removed). Every state reads in greyscale: shape first, colour second.

## 7. Motion

The ground cross-fades in 400ms between sections. Embed strokes draw once, left to right, one step at a time, when scrolled into view. Hover: a button's arrow moves 4px. Nothing else moves. Reduced motion: final states only.

## 8. Voice

Warm, exact, short. "Fix one real bug. About ten minutes." "Pass, with a flag." "Nobody removed." Never "You failed", never "Oops", never an exclamation mark.

## 9. Do and don't

Do: give every colour a role; draw the gate; alternate grounds; mono for counted things at 13px or larger; one ink pill per screen; full stops on headlines.
Don't: neon, gradients, gradient text, glass; nested tiles, shadows, side-stripe borders; 3D contraptions or stock illustration; photos of candidates; red outside the editor; em dashes.
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Scaffold Voit Proof: spine, spec, plan, The Gate specimen and context files

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Deck shell, tokens, navigation and counter

**Files:**
- Create: `deck/deck.html`
- Create: `deck/deck.js`
- Test: `deck/deck.test.js` (Node, tests the pure navigation helper)

**Interfaces:**
- Produces: `deck.html` with `<main class="deck">` containing thirteen `<section class="slide" data-ground="cream|charcoal" id="s01".."s13">`, each with `<header class="slide-head">` (label + counter) and `<div class="slide-body">`. Tokens and shared classes `.label .display .headline .title .body .data .counter .tile .btn .chip .tag .fig` as in the specimen. `deck.js` exports `nextIndex(current, key, count)` for tests and wires keys and the counter in the browser.

- [ ] **Step 1: Write the failing test for the navigation helper**

```js
// deck/deck.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { nextIndex } from './deck.js';

test('arrow keys move one slide and do not wrap', () => {
  assert.equal(nextIndex(0, 'ArrowDown', 13), 1);
  assert.equal(nextIndex(0, 'ArrowRight', 13), 1);
  assert.equal(nextIndex(12, 'ArrowDown', 13), 12);
  assert.equal(nextIndex(0, 'ArrowUp', 13), 0);
  assert.equal(nextIndex(5, 'ArrowLeft', 13), 4);
});

test('page keys and home/end', () => {
  assert.equal(nextIndex(3, 'PageDown', 13), 4);
  assert.equal(nextIndex(3, 'PageUp', 13), 2);
  assert.equal(nextIndex(3, 'Home', 13), 0);
  assert.equal(nextIndex(3, 'End', 13), 12);
});

test('other keys return the current index', () => {
  assert.equal(nextIndex(3, 'a', 13), 3);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --test deck/`
Expected: FAIL, cannot find module `./deck.js`.

- [ ] **Step 3: Write `deck/deck.js`**

```js
// Voit Proof deck: keyboard navigation and the slide counter. ES module; Node imports it for tests.
export function nextIndex(current, key, count) {
  const last = count - 1;
  switch (key) {
    case 'ArrowDown': case 'ArrowRight': case 'PageDown': case ' ': return Math.min(last, current + 1);
    case 'ArrowUp': case 'ArrowLeft': case 'PageUp': return Math.max(0, current - 1);
    case 'Home': return 0;
    case 'End': return last;
    default: return current;
  }
}

if (typeof document !== 'undefined') {
  const slides = [...document.querySelectorAll('.slide')];
  const counter = document.getElementById('counter');
  const pad = (n) => String(n).padStart(2, '0');
  let current = 0;

  const show = (i) => {
    current = i;
    counter.textContent = `${pad(i + 1)} / ${pad(slides.length)}`;
    document.body.dataset.ground = slides[i].dataset.ground;
  };

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) show(slides.indexOf(e.target));
  }, { threshold: 0.6 });
  slides.forEach((s) => io.observe(s));

  document.addEventListener('keydown', (e) => {
    if (e.target.closest('textarea, input, button')) return;
    const i = nextIndex(current, e.key, slides.length);
    if (i !== current) { e.preventDefault(); slides[i].scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  show(0);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test deck/`
Expected: 3 passing.

- [ ] **Step 5: Write `deck/deck.html` shell** (tokens copied from the specimen; thirteen empty slides with heads; later tasks fill the bodies)

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Voit Proof</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Hanken+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Pixelify+Sans&display=swap" rel="stylesheet">
<style>
/* Voit Proof deck. Language: The Gate (mockups/language.html, DESIGN.md). */
:root {
  --display: "Bricolage Grotesque", "Hanken Grotesk", system-ui, sans-serif;
  --sans: "Hanken Grotesk", system-ui, sans-serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
  --pixel: "Pixelify Sans", var(--mono);
  --r-s: 10px; --r-m: 16px; --r-l: 24px;
}
[data-ground="cream"] {
  --ground: oklch(0.975 0.012 85); --ground-2: oklch(0.945 0.022 80);
  --ink: oklch(0.23 0.015 60); --ink-2: oklch(0.47 0.015 60); --line: oklch(0.88 0.016 80);
  --proof: oklch(0.50 0.21 265); --proof-tint: oklch(0.92 0.045 265);
  --you: oklch(0.66 0.19 35); --you-tint: oklch(0.935 0.055 40);
  --team: oklch(0.58 0.12 180); --team-tint: oklch(0.925 0.05 180);
  --flag: oklch(0.82 0.16 92); --flag-tint: oklch(0.96 0.08 95);
  --noise: oklch(0.70 0.07 300); --noise-tint: oklch(0.94 0.03 300);
  --fail: oklch(0.56 0.19 28);
}
[data-ground="charcoal"] {
  --ground: oklch(0.215 0.015 60); --ground-2: oklch(0.27 0.018 60);
  --ink: oklch(0.965 0.012 85); --ink-2: oklch(0.72 0.015 70); --line: oklch(0.34 0.018 60);
  --proof: oklch(0.72 0.15 265); --proof-tint: oklch(0.32 0.06 265);
  --you: oklch(0.76 0.16 38); --you-tint: oklch(0.34 0.06 38);
  --team: oklch(0.74 0.11 180); --team-tint: oklch(0.31 0.05 180);
  --flag: oklch(0.86 0.15 92); --flag-tint: oklch(0.36 0.06 92);
  --noise: oklch(0.72 0.07 300); --noise-tint: oklch(0.31 0.03 300);
  --fail: oklch(0.70 0.18 28);
}
* { box-sizing: border-box; }
html { scroll-snap-type: y mandatory; }
html, body { margin: 0; height: 100%; }
body { font: 17px/1.55 var(--sans); -webkit-font-smoothing: antialiased; background: var(--ground); color: var(--ink); transition: background .4s ease; }
@media (prefers-reduced-motion: reduce) { body { transition: none; } html { scroll-behavior: auto; } }
.slide { min-height: 100vh; scroll-snap-align: start; padding: 40px 24px 72px; display: grid; grid-template-rows: auto 1fr; gap: 24px; background: var(--ground); color: var(--ink); }
.slide-head { display: flex; justify-content: space-between; align-items: center; max-width: 1160px; width: 100%; margin: 0 auto; }
.slide-body { max-width: 1160px; width: 100%; margin: 0 auto; display: grid; align-content: center; gap: 36px; }
.mark-sm { display: flex; align-items: center; gap: 10px; font: 600 16px var(--display); letter-spacing: -.01em; }
#counter { position: fixed; right: 24px; bottom: 20px; z-index: 2; mix-blend-mode: normal; }
.label { font: 500 12px/1.4 var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-2); }
.display { font: 600 clamp(44px, 7vw, 92px)/0.96 var(--display); letter-spacing: -.035em; margin: 0; text-wrap: balance; }
.headline { font: 600 clamp(32px, 4.4vw, 54px)/1.02 var(--display); letter-spacing: -.03em; margin: 0; text-wrap: balance; }
.title { font: 600 24px/1.15 var(--display); letter-spacing: -.02em; margin: 0; }
.body { max-width: 60ch; color: var(--ink-2); margin: 0; }
.data { font: 400 14px/1.55 var(--mono); font-variant-numeric: tabular-nums; }
.counter { font: 400 15px var(--pixel); letter-spacing: .05em; color: var(--ink-2); }
.tile { border-radius: var(--r-l); padding: 28px; background: var(--ground-2); min-width: 0; }
.tile.proof { background: var(--proof-tint); } .tile.you { background: var(--you-tint); } .tile.team { background: var(--team-tint); } .tile.flag { background: var(--flag-tint); } .tile.noise { background: var(--noise-tint); }
.tile .label { color: var(--ink); opacity: .7; } .tile p { margin: 10px 0 0; color: var(--ink); font-size: 15px; max-width: 36ch; }
.btn { display: inline-flex; align-items: center; gap: 12px; height: 52px; padding: 0 22px 0 24px; border: 0; border-radius: 999px; background: var(--ink); color: var(--ground); font: 600 16px var(--sans); cursor: pointer; }
.btn svg { width: 20px; height: 12px; transition: transform .25s cubic-bezier(.2,.8,.2,1); } .btn:hover svg { transform: translateX(4px); }
.btn.soft { background: var(--proof-tint); color: var(--proof); } .btn.you { background: var(--you); color: oklch(0.99 0.01 40); }
.chip { display: inline-flex; align-items: center; font: 400 14px var(--mono); padding: 8px 12px; border-radius: var(--r-s); background: var(--ground-2); color: var(--ink); border: 1px solid var(--line); }
.tag { display: inline-block; font: 500 11px/1 var(--mono); letter-spacing: .08em; text-transform: uppercase; padding: 6px 9px; border-radius: 999px; vertical-align: middle; }
.tag.draft { background: var(--flag); color: oklch(0.3 0.06 92); } .tag.flag { background: var(--flag); color: oklch(0.3 0.06 92); } .tag.sim { background: var(--noise-tint); color: var(--noise); }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; } .three { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; } .four { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.rows { display: grid; gap: 0; } .rows > div { display: grid; grid-template-columns: 44px 1fr; gap: 16px; padding: 14px 0; border-top: 1px solid var(--line); } .rows > div:last-child { border-bottom: 1px solid var(--line); }
.rows .n { font: 500 13px/1.7 var(--mono); color: var(--ink-2); } .rows b { font: 600 18px/1.2 var(--display); letter-spacing: -.015em; display: block; } .rows span { color: var(--ink-2); font-size: 15px; }
svg.fig { width: 100%; height: auto; display: block; overflow: visible; }
.s-ink { stroke: var(--ink); } .s-line { stroke: var(--ink-2); } .s-proof { stroke: var(--proof); } .s-you { stroke: var(--you); } .s-team { stroke: var(--team); } .s-flag { stroke: var(--flag); } .s-noise { stroke: var(--noise); }
.f-ink { fill: var(--ink); } .f-proof { fill: var(--proof); } .f-you { fill: var(--you); } .f-team { fill: var(--team); } .f-noise { fill: var(--noise); } .f-ground { fill: var(--ground); } .f-tint { fill: var(--proof-tint); }
.cap { font: 500 11px var(--mono); fill: var(--ink-2); letter-spacing: .08em; text-transform: uppercase; }
:focus-visible { outline: 2px solid var(--proof); outline-offset: 3px; }
@media (max-width: 760px) { .slide { padding: 24px 16px 64px; } .two, .three, .four { grid-template-columns: 1fr; } }
</style>
</head>
<body data-ground="charcoal">
<span id="counter" class="counter" aria-live="polite">01 / 13</span>
<main class="deck">
  <!-- slides s01..s13 are filled by Tasks 3 to 6; each follows this shape -->
  <section class="slide" data-ground="charcoal" id="s01"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">01 · Title</span></header><div class="slide-body"></div></section>
  <section class="slide" data-ground="cream" id="s02"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">02 · Thesis</span></header><div class="slide-body"></div></section>
  <section class="slide" data-ground="cream" id="s03"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">03 · The employer</span></header><div class="slide-body"></div></section>
  <section class="slide" data-ground="charcoal" id="s04"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">04 · The candidate</span></header><div class="slide-body"></div></section>
  <section class="slide" data-ground="cream" id="s05"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">05 · How it's adopted</span></header><div class="slide-body"></div></section>
  <section class="slide" data-ground="cream" id="s06"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">06 · The candidate's experience</span></header><div class="slide-body"></div></section>
  <section class="slide" data-ground="charcoal" id="s07"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">07 · Employer value</span></header><div class="slide-body"></div></section>
  <section class="slide" data-ground="cream" id="s08"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">08 · Candidate value</span></header><div class="slide-body"></div></section>
  <section class="slide" data-ground="cream" id="s09"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">09 · Employer business model</span></header><div class="slide-body"></div></section>
  <section class="slide" data-ground="charcoal" id="s10"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">10 · Candidate business model</span></header><div class="slide-body"></div></section>
  <section class="slide" data-ground="charcoal" id="s11"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">11 · Strategy</span></header><div class="slide-body"></div></section>
  <section class="slide" data-ground="cream" id="s12"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">12 · Top 10 assumptions</span></header><div class="slide-body"></div></section>
  <section class="slide" data-ground="cream" id="s13"><header class="slide-head"><span class="mark-sm">Voit Proof</span><span class="label">Appendix · What a candidate sees</span></header><div class="slide-body"></div></section>
</main>
<script type="module" src="deck.js"></script>
</body>
</html>
```

Ground order follows the specimen's alternation more than the spec's band table: charcoal for 1, 4, 7, 10, 11 (statements) and cream for the rest. The appendix is cream so the editor reads well.

- [ ] **Step 6: Commit**

```bash
git add deck/deck.html deck/deck.js deck/deck.test.js
git commit -m "Deck shell: tokens, thirteen slides, keyboard navigation, counter

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Slides 1 to 4 (title, thesis, Priya, Marcus)

**Files:**
- Modify: `deck/deck.html` (the four `.slide-body` divs for `#s01`..`#s04`, plus the SVG `<defs>` for the wordmark placed right after `<main>` opens)

**Interfaces:**
- Consumes: shared classes from Task 2.
- Produces: `#voit`, `#proof`, `#bundle` SVG defs available to later slides.

- [ ] **Step 1: Add the wordmark defs** (first child of `<main>`, copied from the specimen)

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <clipPath id="voit"><polygon points="0,0 18,0 32,50 46,0 64,0 41,72 23,72"/><path transform="translate(76 0)" clip-rule="evenodd" d="M10 0H50L60 10V62L50 72H10L0 62V10ZM18 16V56H42V16Z"/><rect x="148" y="0" width="18" height="72"/><polygon transform="translate(178 0)" points="0,0 60,0 60,16 39,16 39,72 21,72 21,16 0,16"/></clipPath>
  <clipPath id="proof"><path transform="translate(292 0)" clip-rule="evenodd" d="M0 0H44L56 12V34L44 46H18V72H0ZM18 16V30H38V16Z"/><path transform="translate(362 0)" clip-rule="evenodd" d="M0 0H44L56 12V32L47 42L64 72H44L30 46H18V72H0ZM18 16V30H38V16Z"/><path transform="translate(440 0)" clip-rule="evenodd" d="M10 0H50L60 10V62L50 72H10L0 62V10ZM18 16V56H42V16Z"/><path transform="translate(514 0)" clip-rule="evenodd" d="M10 0H50L60 10V62L50 72H10L0 62V10ZM18 16V56H42V16Z"/><polygon transform="translate(588 0)" points="0,0 60,0 60,16 18,16 18,30 52,30 52,46 18,46 18,72 0,72"/></clipPath>
  <g id="bundle"><rect y="0" width="700" height="4"/><rect y="8.5" width="700" height="4"/><rect y="17" width="700" height="4"/><rect y="25.5" width="700" height="4"/><rect y="42.5" width="700" height="4"/><rect y="51" width="700" height="4"/><rect y="59.5" width="700" height="4"/><rect y="68" width="700" height="4"/></g>
</defs></svg>
```

- [ ] **Step 2: Slide 1 body**

```html
<svg class="fig" style="max-width:820px" viewBox="-2 -2 652 76" role="img" aria-label="Voit Proof">
  <g clip-path="url(#voit)" style="fill:var(--ink)"><use href="#bundle"/><rect y="34" width="700" height="4" style="fill:var(--you)"/></g>
  <rect x="262" y="-2" width="3" height="76" style="fill:var(--ink)"/><rect x="238" y="34" width="24" height="4" style="fill:var(--you)"/>
  <g clip-path="url(#proof)" style="fill:var(--proof)"><use href="#bundle"/><rect y="34" width="700" height="4" style="fill:var(--you)"/></g>
  <rect x="648" y="34" width="14" height="4" style="fill:var(--you)"/>
</svg>
<h1 class="headline" style="max-width:14ch">Turn signal into substance.</h1>
<p class="body">Applying became free, so applications stopped meaning anything. Voit puts a small piece of real work back into every application.</p>
```

- [ ] **Step 3: Slide 2 body**

```html
<div class="two">
  <div class="tile team"><span class="label">Employers</span><h2 class="title" style="margin-top:36px">The strongest real applicants rise to the top.</h2></div>
  <div class="tile you"><span class="label">Candidates</span><h2 class="title" style="margin-top:36px">Stand out on demonstrated skill.</h2></div>
</div>
<p class="headline" style="max-width:20ch">Reinvent how people apply, with every application backed by a verified record of real work.</p>
```

- [ ] **Step 4: Slide 3 body** (Priya; the noise figure with amber rings)

```html
<h2 class="headline" style="max-width:18ch">Priya can't tell who's real or who's skilled.</h2>
<div class="two">
  <div class="rows">
    <div><span class="n">01</span><div><b>Buried.</b><span>Mid-size software companies hiring remote developers get hundreds of identical applications per role.</span></div></div>
    <div><span class="n">02</span><div><b>Some of it is fraud.</b><span>Organised, résumé-perfect, and indistinguishable on paper.</span></div></div>
    <div><span class="n">03</span><div><b>Urgent and specific.</b><span>The role stays open, the team stays short, and the good people are in the pile somewhere.</span></div></div>
  </div>
  <div class="tile noise">
    <span class="label">The pile · 212 applied</span>
    <svg class="fig" viewBox="0 0 400 180" style="margin-top:18px" role="img" aria-label="Identical applications, a few flagged">
      <g class="s-noise" stroke-width="5" stroke-linecap="round">
        <line x1="10" y1="16" x2="300" y2="16"/><line x1="10" y1="40" x2="300" y2="40"/><line x1="10" y1="64" x2="300" y2="64"/><line x1="10" y1="88" x2="300" y2="88"/><line x1="10" y1="112" x2="300" y2="112"/><line x1="10" y1="136" x2="300" y2="136"/><line x1="10" y1="160" x2="300" y2="160"/>
      </g>
      <g class="s-flag" fill="none" stroke-width="4"><circle cx="120" cy="40" r="12"/><circle cx="220" cy="112" r="12"/></g>
      <text class="cap" x="320" y="44">Fraud</text><text class="cap" x="320" y="116">Fraud</text>
    </svg>
  </div>
</div>
```

- [ ] **Step 5: Slide 4 body** (Marcus; one coral stroke lost in the pile)

```html
<h2 class="headline" style="max-width:18ch">Marcus is good at the work. His application looks like everyone else's.</h2>
<div class="two">
  <div class="tile">
    <span class="label">The same pile</span>
    <svg class="fig" viewBox="0 0 400 180" style="margin-top:18px" role="img" aria-label="One coral stroke among identical lilac strokes, none reaching a gate">
      <line class="s-line" x1="360" y1="4" x2="360" y2="176" stroke-width="2"/>
      <g class="s-noise" stroke-width="5" stroke-linecap="round"><line x1="10" y1="16" x2="300" y2="16"/><line x1="10" y1="40" x2="300" y2="40"/><line x1="10" y1="64" x2="300" y2="64"/><line x1="10" y1="112" x2="300" y2="112"/><line x1="10" y1="136" x2="300" y2="136"/><line x1="10" y1="160" x2="300" y2="160"/></g>
      <line class="s-you" x1="10" y1="88" x2="300" y2="88" stroke-width="5" stroke-linecap="round"/>
      <text class="cap" x="372" y="92">Gate</text>
    </svg>
  </div>
  <div class="rows">
    <div><span class="n">01</span><div><b>Invisible on paper.</b><span>Same degree line, same bullet points, same keywords as the fraud beside him.</span></div></div>
    <div><span class="n">02</span><div><b>Never hears back.</b><span>Nothing in the pile ever reaches a gate, so nothing distinguishes him.</span></div></div>
    <div><span class="n">03</span><div><b>The same broken system.</b><span>What buries Priya also hurts honest candidates.</span></div></div>
  </div>
</div>
```

- [ ] **Step 6: Commit**

```bash
git add deck/deck.html
git commit -m "Slides 1 to 4: title, thesis, Priya, Marcus

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Slides 5 to 8 (embed diagram, candidate experience, two value slides)

**Files:**
- Modify: `deck/deck.html` (bodies of `#s05`..`#s08`, plus CSS for the drawing animation)
- Modify: `deck/deck.js` (scroll-triggered draw, reduced-motion guard)

**Interfaces:**
- Consumes: shared classes; `#bundle` not needed here.
- Produces: `.draw` class on `<line>`s inside `#embed` and the `data-step` attribute that staggers them.

- [ ] **Step 1: Add drawing CSS** (in the `<style>` block)

```css
#embed .draw { stroke-dasharray: 400; stroke-dashoffset: 400; }
#embed.drawn .draw { stroke-dashoffset: 0; transition: stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1); }
#embed.drawn .draw[data-step="2"] { transition-delay: .9s; } #embed.drawn .draw[data-step="3"] { transition-delay: 1.8s; } #embed.drawn .draw[data-step="4"] { transition-delay: 2.7s; }
@media (prefers-reduced-motion: reduce) { #embed .draw { stroke-dashoffset: 0 !important; transition: none !important; } }
```

- [ ] **Step 2: Slide 5 body** (the embed diagram from the specimen's Fig. 4 with `.draw` on the strokes, then the buying roles)

```html
<div class="tile proof" id="embed">
  <span class="label">How it's adopted</span>
  <svg class="fig" viewBox="0 0 1040 200" style="margin-top:18px" role="img" aria-label="One line, candidate applies, scored on the work, ranked pool">
    <rect x="0" y="20" width="200" height="130" rx="14" class="f-ground"/><g class="s-line" stroke-width="2" opacity=".5"><line x1="20" y1="48" x2="120" y2="48"/><line x1="20" y1="72" x2="160" y2="72"/></g>
    <rect x="20" y="92" width="160" height="34" rx="8" class="f-tint"/><text x="30" y="114" style="font:500 11px var(--mono);fill:var(--proof)">&lt;voit-challenge/&gt;</text>
    <text class="cap" x="0" y="178">01 · One line, any form</text>
    <g class="s-line" stroke-width="2" stroke-linecap="round"><line x1="222" y1="85" x2="250" y2="85"/><polyline points="244,79 250,85 244,91" fill="none"/></g>
    <rect x="272" y="20" width="200" height="130" rx="14" class="f-ground"/><g class="s-line" stroke-width="2"><line x1="360" y1="40" x2="360" y2="130"/><line x1="400" y1="40" x2="400" y2="130"/><line x1="440" y1="40" x2="440" y2="130"/></g>
    <line class="s-you draw" data-step="2" x1="290" y1="85" x2="397" y2="85" stroke-width="5" stroke-linecap="round"/><line class="s-you draw" data-step="2" x1="397" y1="73" x2="397" y2="97" stroke-width="4" stroke-linecap="round"/>
    <text class="cap" x="272" y="178">02 · Candidate applies</text>
    <g class="s-line" stroke-width="2" stroke-linecap="round"><line x1="494" y1="85" x2="522" y2="85"/><polyline points="516,79 522,85 516,91" fill="none"/></g>
    <rect x="544" y="20" width="200" height="130" rx="14" class="f-ground"/><g class="s-line" stroke-width="2"><line x1="632" y1="40" x2="632" y2="130"/><line x1="672" y1="40" x2="672" y2="130"/><line x1="712" y1="40" x2="712" y2="130"/></g>
    <g class="s-ink" stroke-width="3" stroke-linecap="round" opacity=".35"><line x1="562" y1="66" x2="728" y2="66"/><line x1="562" y1="104" x2="722" y2="104"/></g>
    <line class="s-you draw" data-step="3" x1="562" y1="85" x2="730" y2="85" stroke-width="5" stroke-linecap="round"/><circle class="f-you" cx="730" cy="85" r="6"/>
    <text class="cap" x="544" y="178">03 · Scored on the work</text>
    <g class="s-line" stroke-width="2" stroke-linecap="round"><line x1="766" y1="85" x2="794" y2="85"/><polyline points="788,79 794,85 788,91" fill="none"/></g>
    <rect x="816" y="20" width="224" height="130" rx="14" class="f-ground"/>
    <g stroke-width="5" stroke-linecap="round"><line class="s-you draw" data-step="4" x1="836" y1="48" x2="1016" y2="48"/><line class="s-team draw" data-step="4" x1="836" y1="68" x2="986" y2="68"/><line class="s-team draw" data-step="4" x1="836" y1="88" x2="950" y2="88"/><line class="s-noise draw" data-step="4" x1="836" y1="108" x2="900" y2="108"/><line class="s-noise draw" data-step="4" x1="836" y1="128" x2="880" y2="128"/></g>
    <text class="cap" x="816" y="178">04 · Ranked pool, nobody removed</text>
  </svg>
</div>
<div class="two">
  <div class="rows"><div><span class="n">01</span><div><b>A recruiter pastes one line.</b><span><code class="chip">&lt;voit-challenge role="full-stack"&gt;&lt;/voit-challenge&gt;</code></span></div></div></div>
  <div class="rows"><div><span class="n">02</span><div><b>The engineering manager curates the challenges.</b><span>Pick from the calibrated library, or generate from the team's own code.</span></div></div></div>
</div>
```

Note: the step-1 arrow has no stroke to draw, so steps start at 2; the coral dot on step 3 is static (a dot, not a stroke).

- [ ] **Step 3: Add the scroll trigger to `deck.js`** (inside the `if (typeof document ...)` block, after `show(0)`)

```js
  const embed = document.getElementById('embed');
  if (embed) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) embed.classList.add('drawn');
    else new IntersectionObserver((es, obs) => {
      if (es.some((e) => e.isIntersecting)) { embed.classList.add('drawn'); obs.disconnect(); }
    }, { threshold: 0.5 }).observe(embed);
  }
```

- [ ] **Step 4: Slide 6 body**

```html
<h2 class="headline" style="max-width:20ch">Worth his time, not just a hurdle.</h2>
<div class="two">
  <div class="rows">
    <div><span class="n">01</span><div><b>Applies as a guest.</b><span>No account, no download. The challenge is inside the form he was already filling in.</span></div></div>
    <div><span class="n">02</span><div><b>Fixes one real bug.</b><span>About ten minutes. Tests run in his browser.</span></div></div>
    <div><span class="n">03</span><div><b>Sees where he stands.</b><span>Pass or not yet, and how his approach compares with strong developers.</span></div></div>
    <div><span class="n">04</span><div><b>Registers to keep it.</b><span>Track every challenge, get diagnostics, practise.</span></div></div>
  </div>
  <div class="tile">
    <span class="label">On the employer's page</span>
    <div style="margin-top:18px;border-radius:16px;background:var(--ground);border:1px solid var(--line);padding:18px;font-family:system-ui,sans-serif">
      <div style="font-size:12px;color:var(--ink-2)">Full name</div><div style="height:36px;border-radius:8px;border:1px solid var(--line);margin-top:8px"></div>
      <div style="font-size:12px;color:var(--ink-2);margin-top:10px">Résumé</div><div style="height:36px;border-radius:8px;border:1px dashed var(--line);margin-top:8px"></div>
      <div style="margin-top:14px;border-radius:12px;background:var(--proof-tint);padding:14px 16px;display:flex;justify-content:space-between;align-items:center;gap:12px;font-family:var(--sans)"><div><b style="font:600 15px var(--display);display:block">Fix one real bug</b><span style="font-size:13px;color:var(--ink-2)">About 10 minutes · runs in your browser</span></div><span class="btn soft" style="height:40px;padding:0 16px;font-size:14px">Start</span></div>
    </div>
  </div>
</div>
```

- [ ] **Step 5: Slide 7 body** (employer value, ranked pool)

```html
<h2 class="headline" style="max-width:18ch">From noise to a trustworthy shortlist.</h2>
<div class="two">
  <div class="three" style="grid-template-columns:1fr">
    <div class="tile team"><span class="label">Reordered</span><p>A pool sorted by real skill, not by who applied first or wrote the best keywords.</p></div>
    <div class="tile flag"><span class="label">Checked</span><p>Résumé claims read against the work. A mismatch is flagged for a person to read.</p></div>
    <div class="tile"><span class="label">Nobody rejected automatically</span><p>Every applicant stays in the pool. The order changes; the people don't disappear.</p></div>
  </div>
  <div class="tile">
    <span class="label">Ranked pool · Remote full-stack · 212 applied</span>
    <div style="display:grid;gap:10px;margin-top:18px">
      <div style="display:grid;grid-template-columns:28px 1fr auto;gap:12px;align-items:center"><span class="data">01</span><div style="height:12px;border-radius:999px;background:var(--you);width:96%"></div><span class="data">3/3 · 9:40</span></div>
      <div style="display:grid;grid-template-columns:28px 1fr auto;gap:12px;align-items:center"><span class="data">02</span><div style="height:12px;border-radius:999px;background:var(--team);width:88%"></div><span class="data">3/3 · 12:05</span></div>
      <div style="display:grid;grid-template-columns:28px 1fr auto;gap:12px;align-items:center"><span class="data">03</span><div style="height:12px;border-radius:999px;background:var(--team);width:74%"></div><span class="data">3/3 · 18:30</span></div>
      <div style="display:grid;grid-template-columns:28px 1fr auto;gap:12px;align-items:center"><span class="data">04</span><div style="height:12px;border-radius:999px;background:var(--noise);width:52%"></div><span class="data">2/3</span></div>
      <div style="display:grid;grid-template-columns:28px 1fr auto;gap:12px;align-items:center"><span class="data">05</span><div style="height:12px;border-radius:999px;background:var(--noise);width:40%"></div><span class="data">2/3 <span class="tag flag">flag</span></span></div>
      <div style="display:grid;grid-template-columns:28px 1fr auto;gap:12px;align-items:center"><span class="data">…</span><div style="height:12px;border-radius:999px;background:var(--noise);width:18%"></div><span class="data">207 more, none removed</span></div>
    </div>
  </div>
</div>
```

- [ ] **Step 6: Slide 8 body** (candidate value, the seal on a record)

```html
<h2 class="headline" style="max-width:20ch">Substance flows back to the person who did the work.</h2>
<div class="two">
  <div class="three" style="grid-template-columns:1fr">
    <div class="tile you"><span class="label">Judged on work</span><p>Not on the résumé, not on the school, not on who replied first.</p></div>
    <div class="tile proof"><span class="label">Feedback that makes him better</span><p>Two sentences on the approach, every time, whether he passed or not yet.</p></div>
    <div class="tile"><span class="label">A record that grows</span><p>Every verified attempt, carried from one application to the next.</p></div>
  </div>
  <div class="tile">
    <span class="label">Marcus's record</span>
    <div style="display:flex;gap:18px;align-items:center;margin:18px 0"><span style="display:inline-grid;place-items:center;width:64px;height:64px;border-radius:18px;background:var(--proof);color:oklch(0.98 0.01 265)"><svg width="32" height="32" viewBox="0 0 24 24"><g fill="currentColor"><rect x="4" y="5" width="16" height="2.2"/><rect x="4" y="9.5" width="16" height="2.2"/><rect x="4" y="16.5" width="16" height="2.2"/><rect x="4" y="13" width="10" height="2.2" style="fill:var(--you)"/></g></svg></span><div><b style="font:600 18px var(--display)">Verified by Voit</b><div class="data" style="color:var(--ink-2)">proof · 3f9a2c · 5 Oct 2026</div></div></div>
    <div class="rows">
      <div><span class="n">3/3</span><div><b>Merge overlapping ranges</b><span>Northbeam Software · full-stack · 9:40</span></div></div>
      <div><span class="n">2/3</span><div><b>Debounce a search box</b><span>Practice · front-end · 14:12</span></div></div>
    </div>
  </div>
</div>
```

- [ ] **Step 7: Run the Node tests (unchanged) and commit**

Run: `node --test deck/`
Expected: 3 passing.

```bash
git add deck/deck.html deck/deck.js
git commit -m "Slides 5 to 8: embed diagram with scroll draw, candidate experience, value slides

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Slides 9 to 12 (business models, strategy, assumptions)

**Files:**
- Modify: `deck/deck.html` (bodies of `#s09`..`#s12`)

- [ ] **Step 1: Slide 9 body** (draft figures tagged)

```html
<h2 class="headline" style="max-width:14ch">It pays. <span class="tag draft">Draft figures</span></h2>
<div class="two">
  <div class="tile"><span class="label">Free</span><h3 class="title" style="margin-top:28px">The embed spreads.</h3><div class="rows" style="margin-top:18px"><div><span class="n">·</span><span>The one-line embed, any form</span></div><div><span class="n">·</span><span>The calibrated challenge library</span></div><div><span class="n">·</span><span>The ranked pool, nobody removed</span></div><div><span class="n">·</span><span>Unlimited roles</span></div></div></div>
  <div class="tile team"><span class="label">Team · $400 per hiring team per month</span><h3 class="title" style="margin-top:28px">Custom challenges from your own code.</h3><div class="rows" style="margin-top:18px"><div><span class="n">·</span><span>Challenges generated from the team's repository</span></div><div><span class="n">·</span><span>Résumé-claim checks</span></div><div><span class="n">·</span><span>ATS sync</span></div></div></div>
</div>
<div class="three">
  <div class="tile"><span class="label">Cost per attempt</span><p class="data" style="font-size:28px;margin-top:14px">&lt; $0.10</p><p>About 10 minutes of sandbox at $0.03 plus $0.04 of diagnostics.</p></div>
  <div class="tile"><span class="label">At 500 attempts per role per month</span><p class="data" style="font-size:28px;margin-top:14px">$35</p><p>of cost against $400 of Team revenue.</p></div>
  <div class="tile"><span class="label">Gross margin on Team</span><p class="data" style="font-size:28px;margin-top:14px">~90%</p><p>Free usage is the acquisition cost, and it is small.</p></div>
</div>
```

- [ ] **Step 2: Slide 10 body**

```html
<h2 class="display" style="max-width:12ch">Free for candidates.</h2>
<div class="two">
  <p class="body" style="font-size:20px">Their attempts calibrate the challenges and build the network. The free side builds the asset.</p>
  <div class="tile">
    <span class="label">Attempts feed the library</span>
    <svg class="fig" viewBox="0 0 400 160" style="margin-top:18px" role="img" aria-label="Many strokes converging on one gate, which becomes sharper">
      <g class="s-noise" stroke-width="4" stroke-linecap="round" opacity=".7"><line x1="10" y1="20" x2="230" y2="60"/><line x1="10" y1="50" x2="230" y2="70"/><line x1="10" y1="110" x2="230" y2="90"/><line x1="10" y1="140" x2="230" y2="100"/></g>
      <line class="s-you" x1="10" y1="80" x2="230" y2="80" stroke-width="5" stroke-linecap="round"/>
      <line class="s-proof" x1="260" y1="20" x2="260" y2="140" stroke-width="6" stroke-linecap="round"/>
      <text class="cap" x="280" y="84">Calibrated gate</text>
    </svg>
  </div>
</div>
```

- [ ] **Step 3: Slide 11 body**

```html
<h2 class="headline" style="max-width:18ch">We become the standard step inside applications.</h2>
<div class="three">
  <div class="tile proof"><span class="label">We own</span><p style="font:600 20px var(--display)">The calibrated library</p><p>Thousands of challenges with known difficulty, built from millions of attempts.</p></div>
  <div class="tile proof"><span class="label">We own</span><p style="font:600 20px var(--display)">The attempt data</p><p>How strong developers actually work, as a baseline no single employer can see.</p></div>
  <div class="tile proof"><span class="label">We own</span><p style="font:600 20px var(--display)">Candidates' records</p><p>Portable proof that grows with the person and travels between employers.</p></div>
</div>
<p class="data" style="color:var(--ink-2)">Architectural strategy. AI is used narrowly: generating challenges from a repository and writing two sentences of feedback. Scoring is tests and comparison, not a model's opinion.</p>
```

- [ ] **Step 4: Slide 12 body** (draft list tagged)

```html
<h2 class="headline" style="max-width:20ch">What has to be true. <span class="tag draft">Draft list</span></h2>
<p class="body">Tested through conversations, pain first.</p>
<div class="two">
  <div class="rows">
    <div><span class="n">01</span><span>Recruiters at mid-size software companies name the flood of identical applications as their top hiring pain, not a nuisance.</span></div>
    <div><span class="n">02</span><span>Applicant fraud is common enough that "real" is worth paying for.</span></div>
    <div><span class="n">03</span><span>Candidates will do ten minutes of real work before anyone has replied to them.</span></div>
    <div><span class="n">04</span><span>One pasted line is enough to start; no ATS integration is needed for the first customers.</span></div>
    <div><span class="n">05</span><span>A ten-minute bug fix predicts on-the-job performance better than a résumé screen.</span></div>
  </div>
  <div class="rows">
    <div><span class="n">06</span><span>Engineering managers will curate challenges, or accept library ones without curating.</span></div>
    <div><span class="n">07</span><span>Ranking on tests passed and process compared is fair and defensible: bias, accessibility, legal.</span></div>
    <div><span class="n">08</span><span>Candidates want the record enough to register and keep it.</span></div>
    <div><span class="n">09</span><span>Attempt data calibrates challenges faster than answers leak.</span></div>
    <div><span class="n">10</span><span>The challenge still separates skill when candidates use AI tools, under a stated rule.</span></div>
  </div>
</div>
```

- [ ] **Step 5: Commit**

```bash
git add deck/deck.html
git commit -m "Slides 9 to 12: business models, strategy, assumptions

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: The live appendix

**Files:**
- Create: `deck/appendix.js`
- Create: `deck/appendix.test.js`
- Modify: `deck/deck.html` (body of `#s13`, editor CSS, script tag)

**Interfaces:**
- Produces (from `appendix.js`): `STARTER` (string, the bugged source), `TESTS` (array of `{ name, input, expected }`), `runTests(source) -> { ok: boolean, results: [{ name, pass, expected, received }], error?: string }`, `feedbackFor(source) -> string`, `createTally() -> { edit(), run(), elapsed() -> seconds, snapshot() -> { edits, runs, seconds } }`.

- [ ] **Step 1: Write the failing tests**

```js
// deck/appendix.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { STARTER, TESTS, runTests, feedbackFor, createTally } from './appendix.js';

test('starter fails exactly one test, the unsorted one', () => {
  const r = runTests(STARTER);
  assert.equal(r.ok, false);
  assert.deepEqual(r.results.map((x) => x.pass), [true, true, false]);
  assert.equal(r.results[2].name, 'merges when input is unsorted');
});

test('adding a sort makes all three pass', () => {
  const fixed = STARTER.replace('const sorted = ranges;', 'const sorted = [...ranges].sort((a, b) => a[0] - b[0]);');
  const r = runTests(fixed);
  assert.equal(r.ok, true);
});

test('a hard-coded literal does not pass: the third test input differs from the shown failure', () => {
  const cheat = 'function mergeRanges(ranges){ return [[1,6],[8,10]]; }';
  const r = runTests(cheat);
  assert.equal(r.ok, false);
});

test('a syntax error returns an error message, not a throw', () => {
  const r = runTests('function mergeRanges(ranges) { return ranges; ');
  assert.equal(r.ok, false);
  assert.match(r.error, /Unexpected|SyntaxError|end of input/i);
  assert.deepEqual(r.results, []);
});

test('feedback is keyed to the fix used', () => {
  assert.match(feedbackFor(STARTER.replace('const sorted = ranges;', 'const sorted = [...ranges].sort((a, b) => a[0] - b[0]);')), /copy/i);
  assert.match(feedbackFor(STARTER.replace('const sorted = ranges;', 'ranges.sort((a, b) => a[0] - b[0]); const sorted = ranges;')), /in place/i);
  assert.match(feedbackFor('function mergeRanges(r){ return r; }'), /different route/i);
});

test('tally counts edits and runs', () => {
  const t = createTally(() => 1000);
  t.edit(); t.edit(); t.run();
  const s = t.snapshot(() => 11000);
  assert.deepEqual(s, { edits: 2, runs: 1, seconds: 10 });
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `node --test deck/`
Expected: FAIL, cannot find module `./appendix.js` (the 3 deck tests still pass).

- [ ] **Step 3: Write `deck/appendix.js`**

```js
// Voit Proof appendix: one real bug, three tests, two sentences of feedback, three counters.
// ES module. Node imports it for tests; deck.html loads it as a module and calls mount().

export const STARTER = `// Merge overlapping [start, end] ranges.
// mergeRanges([[1,3],[2,6],[8,10]]) -> [[1,6],[8,10]]
function mergeRanges(ranges) {
  if (ranges.length === 0) return [];
  const sorted = ranges;
  const out = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    const last = out[out.length - 1];
    if (start <= last[1]) last[1] = Math.max(last[1], end);
    else out.push([start, end]);
  }
  return out;
}`;

export const TESTS = [
  { name: 'merges overlapping ranges', input: [[1, 3], [2, 6], [8, 10]], expected: [[1, 6], [8, 10]] },
  { name: 'leaves separate ranges alone', input: [[1, 2], [4, 5]], expected: [[1, 2], [4, 5]] },
  { name: 'merges when input is unsorted', input: [[5, 7], [1, 3], [2, 4], [6, 9]], expected: [[1, 4], [5, 9]] },
];

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function runTests(source) {
  let fn;
  try {
    fn = new Function(`${source}\nreturn mergeRanges;`)();
    if (typeof fn !== 'function') throw new Error('mergeRanges is not a function');
  } catch (e) {
    return { ok: false, results: [], error: `${e.name}: ${e.message}` };
  }
  const results = TESTS.map((t) => {
    try {
      const received = fn(t.input.map((r) => r.slice()));
      return { name: t.name, pass: same(received, t.expected), expected: t.expected, received };
    } catch (e) {
      return { name: t.name, pass: false, expected: t.expected, received: `${e.name}: ${e.message}` };
    }
  });
  return { ok: results.every((r) => r.pass), results };
}

export function feedbackFor(source) {
  const sortsCopy = /\[\s*\.\.\.\s*ranges\s*\]\s*\.sort|ranges\.slice\(\)\s*\.sort|Array\.from\(ranges\)\s*\.sort/.test(source);
  const sortsInPlace = /ranges\.sort\(/.test(source);
  if (sortsCopy) return 'You sorted a copy before merging, so the caller\'s array is untouched. That is the fix most strong developers reach for, and it keeps the function pure.';
  if (sortsInPlace) return 'You sorted the input in place. It passes, and it mutates the caller\'s array; a copy would cost one allocation and keep the function pure.';
  return 'You took a different route from most attempts. If it passes, it counts; the comparison below shows how far your approach sits from the common one.';
}

export function createTally(now = () => Date.now()) {
  const started = now();
  let edits = 0, runs = 0;
  return {
    edit() { edits++; },
    run() { runs++; },
    elapsed(at = now) { return Math.round((at() - started) / 1000); },
    snapshot(at = now) { return { edits, runs, seconds: Math.round((at() - started) / 1000) }; },
  };
}

export function mount(root) {
  const editor = root.querySelector('#editor');
  const gutter = root.querySelector('#gutter');
  const out = root.querySelector('#out');
  const runBtn = root.querySelector('#run');
  const standing = root.querySelector('#standing');
  const feedback = root.querySelector('#feedback');
  const tally = createTally();

  editor.value = STARTER;
  const lines = () => { gutter.textContent = editor.value.split('\n').map((_, i) => i + 1).join('\n'); };
  lines();
  editor.addEventListener('input', () => { tally.edit(); lines(); });
  editor.addEventListener('scroll', () => { gutter.scrollTop = editor.scrollTop; });
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') { e.preventDefault(); const s = editor.selectionStart; editor.setRangeText('  ', s, editor.selectionEnd, 'end'); }
  });

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  runBtn.addEventListener('click', () => {
    tally.run();
    const r = runTests(editor.value);
    out.replaceChildren();
    if (r.error) {
      const li = document.createElement('div'); li.className = 'out-line fail'; li.textContent = r.error; out.append(li);
    } else for (const t of r.results) {
      const li = document.createElement('div'); li.className = `out-line ${t.pass ? 'pass' : 'fail'}`;
      li.textContent = t.pass ? `pass  ${t.name}` : `fail  ${t.name}\n      expected ${JSON.stringify(t.expected)}\n      received ${JSON.stringify(t.received)}`;
      out.append(li);
    }
    const s = tally.snapshot();
    const passed = r.results.filter((x) => x.pass).length;
    standing.querySelector('.num').textContent = passed;
    standing.querySelector('.sub').textContent = `${fmt(s.seconds)} elapsed · ${s.runs} ${s.runs === 1 ? 'run' : 'runs'} · ${s.edits} ${s.edits === 1 ? 'edit' : 'edits'}`;
    standing.dataset.state = r.ok ? 'pass' : 'notyet';
    standing.querySelector('.gate-stroke').setAttribute('x2', r.ok ? 270 : 166);
    feedback.textContent = r.ok ? feedbackFor(editor.value) : 'Not yet. Read the failing test: the input is not in order. What does the merge assume about it?';
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test deck/`
Expected: 9 passing (3 deck, 6 appendix).

- [ ] **Step 5: Add editor CSS** (in the deck's `<style>`)

```css
.appendix { display: grid; grid-template-columns: 1.2fr 1fr; gap: 14px; align-items: start; }
@media (max-width: 960px) { .appendix { grid-template-columns: 1fr; } }
.emp { border-radius: var(--r-l); background: var(--ground-2); padding: 22px; font-family: system-ui, sans-serif; min-width: 0; }
.emp .emp-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; margin-bottom: 14px; } .emp .emp-head b { font-weight: 600; } .emp .emp-head span { font-size: 13px; color: var(--ink-2); }
.emp .field { height: 36px; border-radius: 8px; border: 1px solid var(--line); background: var(--ground); margin: 6px 0 12px; }
.emp .lbl { font-size: 12px; color: var(--ink-2); }
.challenge { border-radius: var(--r-m); background: var(--proof-tint); padding: 16px; font-family: var(--sans); color: var(--ink); }
.challenge .ch-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 12px; }
.ed { display: grid; grid-template-columns: 34px 1fr; border-radius: var(--r-s); background: var(--ground); border: 1px solid var(--line); overflow: hidden; }
#gutter, #editor { font: 400 13px/1.6 var(--mono); padding: 12px 0 12px 10px; margin: 0; }
#gutter { color: var(--ink-2); text-align: right; padding-right: 6px; user-select: none; overflow: hidden; white-space: pre; }
#editor { border: 0; outline: 0; background: transparent; color: var(--ink); resize: vertical; min-height: 300px; white-space: pre; overflow: auto; tab-size: 2; padding-right: 12px; }
#editor:focus-visible { outline: none; } .ed:focus-within { outline: 2px solid var(--proof); outline-offset: 2px; }
#out { margin-top: 12px; display: grid; gap: 6px; font: 400 13px/1.5 var(--mono); white-space: pre-wrap; min-height: 24px; }
.out-line.pass { color: var(--ink); } .out-line.pass::before { content: '✓ '; color: var(--team); } .out-line.fail { color: var(--fail); }
#standing .num { font: 600 88px/0.9 var(--display); letter-spacing: -.04em; } #standing .num small { font: 400 22px var(--mono); color: var(--ink-2); margin-left: 6px; }
#standing .sub { font: 400 14px var(--mono); color: var(--ink-2); margin-top: 12px; }
#standing[data-state="pass"] .gate-dot { opacity: 1; } .gate-dot { opacity: 0; }
.reviews { display: grid; gap: 10px; margin-top: 14px; font: 400 13.5px/1.5 var(--mono); color: var(--ink-2); } .reviews div::before { content: '“ '; }
```

- [ ] **Step 6: Slide 13 body**

```html
<div class="appendix">
  <div class="emp">
    <div class="emp-head"><b>Northbeam Software</b><span>Remote full-stack developer · Application</span></div>
    <div class="lbl">Full name</div><div class="field"></div>
    <div class="lbl">Résumé</div><div class="field" style="border-style:dashed"></div>
    <div class="challenge" id="challenge">
      <div class="ch-head"><div><b style="font:600 17px var(--display);display:block">Fix one real bug</b><span class="label" style="text-transform:none;letter-spacing:0">mergeRanges · about 10 minutes · runs in your browser</span></div><button class="btn" id="run" type="button">Run tests <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="1" y1="6" x2="18" y2="6"/><polyline points="13,1 18,6 13,11"/></svg></button></div>
      <div class="ed"><pre id="gutter" aria-hidden="true"></pre><textarea id="editor" spellcheck="false" aria-label="Code editor"></textarea></div>
      <div id="out" aria-live="polite"></div>
    </div>
  </div>
  <div style="display:grid;gap:14px">
    <div class="tile proof" id="standing" data-state="">
      <span class="label">Standing</span>
      <div style="display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:end;margin-top:14px">
        <div class="num">–<small>/ 3</small></div>
        <svg viewBox="0 0 300 80" style="width:100%;height:80px"><g class="s-line" stroke-width="2"><line x1="100" y1="8" x2="100" y2="72"/><line x1="170" y1="8" x2="170" y2="72"/><line x1="240" y1="8" x2="240" y2="72"/></g><g class="s-ink" stroke-width="3" stroke-linecap="round" opacity=".3"><line x1="10" y1="26" x2="262" y2="26"/><line x1="10" y1="54" x2="256" y2="54"/></g><line class="s-you gate-stroke" x1="10" y1="40" x2="10" y2="40" stroke-width="6" stroke-linecap="round"/><circle class="f-you gate-dot" cx="270" cy="40" r="7" style="transition:opacity .3s"/></svg>
      </div>
      <div class="sub">Run the tests to see where you stand.</div>
    </div>
    <div class="tile"><span class="label">Feedback</span><p id="feedback" style="max-width:none">Two sentences on your approach appear here after a run.</p></div>
    <div class="tile"><span class="label">Pooled reviewer reactions <span class="tag sim">Simulated</span></span>
      <div class="reviews"><div>Sorted a copy, kept it pure. Would merge.</div><div>Read the failing test before touching the loop. Good instinct.</div><div>Nine minutes. Faster than our median.</div></div>
    </div>
  </div>
</div>
```

Then, in the `<script type="module">` at the end of the body, replace `src="deck.js"` with an inline module:

```html
<script type="module">
  import './deck.js';
  import { mount } from './appendix.js';
  mount(document.getElementById('s13'));
</script>
```

- [ ] **Step 7: Run the tests and commit**

Run: `node --test deck/`
Expected: 9 passing.

```bash
git add deck/appendix.js deck/appendix.test.js deck/deck.html
git commit -m "Appendix: live challenge with editor, in-page tests, standing and feedback

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Rule check script, handoff and memory

**Files:**
- Create: `scripts/check.js`
- Modify: `../v0-voit-lab/mockups/HANDOFF.md` (append a short section pointing at this repo)

- [ ] **Step 1: Write the check script** (copy and token rules from Global Constraints)

```js
// scripts/check.js: the deck's copy and token rules. Run: node scripts/check.js
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../deck/deck.html', import.meta.url), 'utf8');
const problems = [];
const text = html.replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '');
if (/—/.test(text)) problems.push('em dash in copy');
if (/#000\b|#fff\b|#ffffff\b|#000000\b/i.test(html)) problems.push('pure black or white');
if (/gradient\(/.test(html)) problems.push('gradient');
if (/box-shadow/.test(html)) problems.push('shadow');
const slides = (html.match(/class="slide"/g) || []).length;
if (slides !== 13) problems.push(`expected 13 slides, found ${slides}`);
if (!/prefers-reduced-motion/.test(html)) problems.push('no reduced-motion rule');
if (!/Draft figures/.test(html) || !/Draft list/.test(html)) problems.push('draft tags missing');
if (problems.length) { console.error('check failed:\n  ' + problems.join('\n  ')); process.exit(1); }
console.log(`check passed: 13 slides, no em dashes, no pure black/white, no gradients or shadows`);
```

- [ ] **Step 2: Run it**

Run: `node scripts/check.js`
Expected: `check passed: ...`. If it fails, fix the deck, not the script.

- [ ] **Step 3: Append to Lab's handoff**

Add to the end of `../v0-voit-lab/mockups/HANDOFF.md`:

```markdown
## Session 6 (2026-10-05): Voit Proof split out

- The hiring product (a real-work challenge embedded in job applications) is its own repo, `../v0-voit-proof`, named Voit Proof. Start from its `deck/SPINE.md`, `DESIGN.md` and `mockups/language.html`.
- Its language is **The Gate** (warm cream and charcoal, five colour roles, rounded tiles, pill buttons, Bricolage Grotesque), approved 2026-10-05. The Ruled Line stays Lab's. Shared: the stroke-bundle wordmark grammar, Hanken Grotesk, Plex Mono, the voice.
- The founder's references for Proof: Clay (warmth, tiles) and Handshake AI (rhythm, mono and pixel details); Handshake's candy palette and the paper-and-rules look were rejected for Proof.
```

- [ ] **Step 4: Commit in both repos**

```bash
git add scripts/check.js
git commit -m "Add deck rule check

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Lab's HANDOFF.md change stays uncommitted alongside Lab's other uncommitted work (nothing in Lab is committed yet, by the founder's choice).

- [ ] **Step 5: Tell the founder what to open**

`deck/deck.html` in a browser. Arrow keys move slides. On the last slide, add one line to `mergeRanges` and press Run tests. Report the two Draft tags and the three open decisions from the spec.
