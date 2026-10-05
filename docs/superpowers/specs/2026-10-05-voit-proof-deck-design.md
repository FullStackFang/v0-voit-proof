# Voit Proof: repo, design language and the first deck

Date: 2026-10-05. Status: draft for the founder's review.

## 1. What this is

Voit Proof is the third member of the Voit family. Voit is the thesis (a reverse Turing test: the form is the examiner). Voit Lab is the classroom (an arena where agents try to pass as people). Voit Proof is the product: a small piece of real work embedded in every job application, so the pool sorts itself by proof.

This spec covers the first build only: the repository, the design language adapted for Proof, and a thirteen-slide deck with a live appendix. It does not cover the product itself (the embed, the sandbox, the ranking service). Those get their own specs once the deck has been used in conversations.

## 2. Outcome and success

The founder uses the deck in employer and investor conversations. Success is a deck that a careful reader can follow without a presenter, that looks like one company with Voit Lab, and whose appendix lets someone fix the bug themselves and feel what a candidate feels.

Constraints carried from Voit Lab's working agreements:

- Mockups before building. The deck is reviewed as a static HTML file before anything else exists.
- Quiet surfaces. Few elements, one thing moving at a time.
- Nothing outward-facing without asking: no GitHub repo, no Vercel project, no public artifact until the founder says so.
- No automated or visible browsers on the founder's machine without asking. The founder opens mockups themselves.

## 3. The repository

Path: `../v0-voit-proof`, a sibling of `v0-voit-lab`. Git-initialised locally. No Next.js scaffold, no `package.json`, no dependencies: the deck is one HTML file plus one script.

```
v0-voit-proof/
  README.md            what it is, the family, how to open the deck
  CLAUDE.md            working agreements (the four above) and where to start
  PRODUCT.md           impeccable context: register, users, purpose, personality, anti-references
  DESIGN.md            the design language, Proof edition (section 4)
  deck/
    SPINE.md           the narrative spine, the founder's text, source of truth
    deck.html          the deck (section 5)
    appendix.js        the live appendix's editor, tests and tallies (section 6)
  docs/superpowers/specs/   this file
  .gitignore
```

`PRODUCT.md` and `DESIGN.md` follow impeccable's expected formats so its commands read them (section 7).

## 4. The design language: The Gate

Approved by the founder on 2026-10-05 from the specimen `mockups/language.html`, which is the visual source of truth; `DESIGN.md` records it in writing. Voit Lab's Ruled Line is not used for Proof. What carries over from Lab is the stroke-bundle wordmark grammar, Hanken Grotesk for body, IBM Plex Mono for counted things, and the voice.

The founder's references are Clay (warm cream and oat grounds, a named fruit palette as tints and accents, rounded tiles, pill buttons, big friendly type) and Handshake AI (alternating light and dark sections, mono labels, numbered steps, one pixel detail). Both are styles the founder likes; neither is copied. Clay's 3D contraptions and Handshake's candy neons and photos are explicitly rejected.

### 4.1 Grounds
Two grounds, alternating section by section. **Cream** (warm off-white, tiles one step deeper in oat) for reading: explanation slides, the candidate's screen, docs. **Charcoal** (warm dark, never black) for statements: title, strategy, the big number. Role colours keep their names on both grounds; strong values brighten and tints deepen on charcoal.

### 4.2 Five colour roles
Every colour is a role. **Proof** (blue): the product, the seal, the primary action. **You** (coral): the candidate in focus. **Team** (teal): the employer and the shortlist. **Flag** (yellow): a claim that did not match the work, drawn as a ring. **Noise** (lilac): the pile of identical applications. Each has a strong value and a tint. Rules: the role rule (a colour means its role everywhere), the one-coral rule (exactly one stroke on any figure is coral), no neon (chroma below 0.21), no pure black or white, and red only for a failing test's output inside an editor.

### 4.3 Shape
**Tiles**: one rounded (24px), tinted, flat container, never nested, no shadow. It holds a figure, a number or a screen. Smaller tiles at 16px, chips at 10px. **Buttons** are pills: ink for the one action on a screen, blue tint for the quiet second, coral only for an action that belongs to the candidate. **The seal**: the four-stroke glyph on a rounded blue plate, marking a verified attempt.

### 4.4 Type
Bricolage Grotesque 600 for display, headline and title. Hanken Grotesk 400 for body and buttons. IBM Plex Mono for labels (12px caps, +8%) and data (14px tabular). Pixelify Sans for the slide counter and nothing else. Newsreader is not used.

### 4.5 The gate (the figure)
A gate is a test. A stroke is an attempt. Colour says whose. The six drawings: **Pass** (the coral stroke passes every gate, ending in a dot), **Not yet** (it stops at a gate with a bar; calm, no red), **Flag** (a yellow ring on a crossing), **Noise** (identical lilac strokes, one of them coral), **Compared** (a faint ink bundle of strong developers behind the coral stroke), **Ranked pool** (strokes ordered longest first, coral then teal then lilac, nobody removed). The embed diagram is built from these.

### 4.6 The mark
VOIT PROOF cut from the nine-stroke bundle: VOIT in ink, PROOF in blue, with the coral middle stroke stopping at the rule after VOIT and running through PROOF and out the right side. P, R and F are drawn on Lab's letter grammar (cap 72, stems 18).

### 4.7 The two zones
The employer's application page is drawn as a plain system-font form (a parody employer, never a real company); the embedded challenge inside it is a blue-tint tile in our type. The appendix shows both on one screen.

### 4.8 Photos
None. People are strokes.

## 5. The deck

One file, `deck/deck.html`, no build step. Fonts from Google Fonts (Hanken Grotesk, IBM Plex Mono, Pixelify Sans, Source Sans 3). Works offline except for fonts, which fall back to system faces.

### 5.1 Structure

Thirteen full-height sections, scroll-snapped, with arrow-key and page-key navigation and a pixel slide counter fixed bottom right. Each section carries a `data-ground` (cream or charcoal). A 400ms ground cross-fade is the only transition. Reduced motion: no cross-fade, no drawing animations, final states only.

### 5.2 Slides and bands

| # | Beat | Band | What is on it |
|---|------|------|---------------|
| 1 | Title | Ultramarine | The VOIT PROOF wordmark, "Turn signal into substance." |
| 2 | Thesis and ambition | Paper | Two promises side by side under a 2px section head; the ambition line as a display headline. |
| 3 | Priya and the fire | Bone | Headline, the problem in three ruled rows, a figure: a bundle of identical strokes, a few marked with the amber ring (fraud). |
| 4 | Marcus and the frustration | Bone | Headline, a figure: one accent stroke lost in the same bundle, stopping short of any rule. |
| 5 | How it's adopted | Paper | The embed diagram (5.3) in a plate, then two buying roles as a ruled list. |
| 6 | The candidate's experience | Paper | A numbered ruled list (guest, fix, standing, register) beside a small plate showing the challenge inline on an application page. |
| 7 | Employer value | Bone | Three ruled rows (reordered pool, claims checked, nobody auto-rejected) and the ranked-pool figure. |
| 8 | Candidate value | Bone | Three ruled rows (judged on work, feedback, a record) and the seal on a record figure. |
| 9 | Employer business model | Pine | Free versus Team as two columns under one section head; the figures in mono; draft figures labelled as draft. |
| 10 | Candidate business model | Pine | "Free for candidates" as the headline; a figure of attempts feeding the calibrated library. |
| 11 | Strategy: architectural | Ultramarine | The standard step inside applications; three things no single employer can build; "AI is used narrowly" as a margin note. |
| 12 | Top 10 assumptions | Paper | A ruled numbered list, 01 to 10, with how each is tested. |
| 13 | Appendix | Night | The live candidate screen (section 6). |

### 5.3 The embed diagram

Inline SVG in the shape grammar, four steps left to right in one plate, each with a mono label and one line of body:

1. **One line, any form.** A code chip, mono, 2px corners, with `<voit-challenge role="full-stack"></voit-challenge>`, sitting inside a tiny ruled sketch of an application form.
2. **Candidate applies.** The challenge appears inline: a small plate within the form sketch, "Fix one real bug, about 10 minutes."
3. **Scored on the work.** Three rules (tests). An accent stroke crosses two and stops at the third, then on the next frame crosses all three. Beside it, the ink bundle of strong developers for comparison.
4. **Ranked pool.** The applicant-tracking view: strokes ordered longest first, the accent one near the top, every stroke still present.

Arrows between steps are drawn rules with a chevron, as in the button arrow. On scroll into view the strokes draw once, left to right, one step at a time (principle 5). With reduced motion the final frame is shown.

### 5.4 Draft content to replace

Marked in the deck with a mono "Draft figures" or "Draft list" label until the founder replaces them.

**Slide 9, business model.** Free: the embed, the calibrated library, the ranked pool, unlimited roles. Team: $400 per hiring team per month: challenges generated from the team's own repository, résumé-claim checks, ATS sync. Cost per attempt: about 10 minutes of sandbox at roughly $0.03, plus about $0.04 of diagnostics, so under $0.10. At 500 attempts per role per month, about $35 of cost against $400 of revenue.

**Slide 12, the ten assumptions.** Each is tested in conversations, pain first.

1. Recruiters at mid-size software companies name the flood of identical applications as their top hiring pain, not a nuisance.
2. Applicant fraud is common enough that "real" is worth paying for.
3. Candidates will do ten minutes of real work before anyone has replied to them.
4. One pasted line is enough to start; no ATS integration is needed for the first customers.
5. A ten-minute bug fix predicts on-the-job performance better than a résumé screen.
6. Engineering managers will curate challenges, or accept library ones without curating.
7. Ranking on tests passed and process compared is fair and defensible (bias, accessibility, legal).
8. Candidates want the record enough to register and keep it.
9. Attempt data calibrates challenges faster than answers leak.
10. The challenge still separates skill when candidates use AI tools, under a stated rule.

## 6. The live appendix

The Night band. Left, the employer's application page in the sim zone: a parody employer ("Northbeam Software, Remote full-stack developer"), a short form, and the embedded challenge as a plate. Right, the candidate's standing.

### 6.1 The challenge

A JavaScript function with one real bug, in an editor built from a `textarea` with a line-number gutter, mono, no library. The function is `mergeRanges(ranges)`, which returns overlapping `[start, end]` pairs merged; the bug is that it assumes the input is already sorted. The fix is one line. Three tests run in the page on "Run tests": two pass, one fails until the sort is added. Output appears below the editor in mono, the failing line in vermilion, with the expected and received values.

Tests run via `new Function` on the editor's text inside a `try`, so a syntax error shows as a message, never a crash. Nothing leaves the page.

### 6.2 The standing

Three ruled panels:

- **Standing.** Before the first run: "Run the tests to see where you stand." After a pass: the pass figure (stroke crossing three rules in accent beside the ink bundle), and a mono line: edits, runs, elapsed time, tallied by the page.
- **Feedback.** After a pass, two sentences on the approach, keyed to which fix the candidate used (sort in place, sort a copy, or something else), chosen from a small table, not generated.
- **Pooled reviewer reactions.** Three short mono lines attributed to anonymous reviewers. Labelled "Simulated" in a mono tag, as are the comparison figures. The founder replaces them with real data later.

The page tallies keystrokes, runs and elapsed seconds itself. The Lab recorder is not ported in this build; the tallies are three counters in `appendix.js`.

## 7. Tooling: impeccable and Claude Design

**impeccable** reads `PRODUCT.md` and `DESIGN.md` from the repo root. The order of use:

1. `teach`, once the seeded files exist, to confirm the register (brand), the users and the anti-references in an interview, so later commands design for Proof rather than for Lab.
2. `shape deck` before the deck is built: a design brief with the colour strategy (Committed: the bands carry the surface), a scene sentence per slide group (a laptop in a meeting room for slides 1 to 12, the candidate's own screen for the appendix) and the named anchors (Handshake AI for rhythm and plates, Stanford HAI for the stroke letters, explicitly minus their colours).
3. Build, then `critique` and `audit`, then `polish`.
4. `overdrive` last, on one moment only. Two candidate directions to present at that point: the embed diagram drawing itself on scroll, or the appendix test run streaming its results. Overdrive iterates with browser screenshots, which needs the founder's permission each time or the founder opening the file themselves.

**Claude Design.** The account's existing "Voit Lab" design system artifact is the rejected Night Map and is not attached to anything here. A new **Voit Proof** design system artifact is created from the Proof `DESIGN.md` once the founder approves the language, and the deck is published as a private artifact page for review in the browser. The Design canvas is not used for the deck in this build: the appendix needs running script and the slides already live in one HTML file. `design-sync` can push a component library into the design system later, one component at a time, once there is a product to sync.

## 8. Out of scope

- The product: embed, sandbox, scoring, ranking, ATS integration, accounts.
- Real portraits, real employer names, real reviewer data.
- A Next.js app, a package.json, tests beyond the three in the appendix.
- GitHub, Vercel, or any public link.

## 9. Open decisions for the founder

- The Team price and cost figures in 5.4 are placeholders.
- The ten assumptions in 5.4 are a draft list.
- Whether Newsreader really leaves the system, or stays for one reassuring line per slide. The spec removes it, as the founder chose pixel and mono details over the serif note.
