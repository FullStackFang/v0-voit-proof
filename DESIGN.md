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
