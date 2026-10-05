# Slice 1: Judge the AI

Status: draft for founder review, 2026-10-05.

## The idea in one paragraph

A candidate judges AI output: is this fix right, which of these matters most, what did the AI miss. Each judgment is a small item, about a minute. Some items have a known answer (gold) and are scored; some are questions AI is genuinely unsure about (open) and are not scored, but the answers, weighted by how well the person did on gold, become trusted labels. Like reCAPTCHA: one word it knows, one it is learning. The candidate cannot tell which is which. Employers get a competency profile from gold items; we get a growing bank of human judgment no single employer could build.

## What was decided in brainstorming

- Test judgment, not typing. Simple: decide, rank, and free form only where needed.
- Items are curated per firm and role, in small nuggets, about 8 per set, about 10 minutes.
- Gold items only when applying as a guest (the embed). Gold and open items mixed in practice, which becomes the signed-in route in slice 2.
- Free-form "catch" questions: routine-sounding scenarios where the obvious answer is wrong because of one detail (the carwash pattern: you are going to wash the car, so the car has to come).
- Integrity is recorded and flagged, never used to reject.
- Content for the demo is a fictional employer. No real company name or branding.

## Formats

Three, on purpose. A new question is new content, not new code.

| Format | Candidate does | Scored by |
|---|---|---|
| **Decide** | Picks one of 2 to 4 options. Covers "did the AI's fix work: yes or no" and "which fix would you merge: A or B". | Exact match. |
| **Rank** | Drags 3 to 5 things into order. | Exact order 1, one adjacent swap 0.5, otherwise 0. |
| **Write** | Types up to 280 characters. Paste is blocked. | AI grader against the item's rubric: caught, partly caught or missed, with the phrase that earned it. |

Every item shows an artifact (code, a log, an AI's comment or explanation, a short scenario) and asks one question.

## Items

Items live in the repo as JSON, one file per item, reviewed like code. The repo stays private: a leaked item is a dead item.

```json
{
  "id": "edu-007",
  "format": "decide | rank | write",
  "kind": "gold | open",
  "area": "records | tenancy | rules | ai-in-the-loop | ai-code | ops",
  "artifact": { "type": "code | text | log", "language": "js", "body": "..." },
  "question": "Did the AI's fix solve the ticket?",
  "options": ["Yes", "No"],
  "answer": 1,
  "reason": "It hides the double count; the duplicate rows are still written.",
  "rubric": { "insight": "...", "wrongTurns": ["..."] },
  "firstSeen": null
}
```

- `options` for decide and rank; `answer` is an index (decide) or an order (rank); `rubric` for write. `answer`, `reason` and `rubric` exist only on gold items and are never sent to the browser.
- A **pack** is a list of item ids for a role: `packs/education-platform-engineer.json`.
- Every item records when it was first served and how many times, so exposed items can be retired.

## The first pack: education-platform engineer at Fernhill Learning (fictional)

Eight gold, four open. Areas chosen by what a weak hire would cost on a learning platform: learner records stay correct, tenants stay isolated, pedagogy becomes exact rules, AI in the loop is judged, AI-written code is reviewed, and operational traps are noticed.

Gold:
1. **Decide, records + ai-code.** Ticket: progress shows 110% when a lesson is finished in two tabs. The AI's fix clamps progress to 100. Did it solve the ticket? No: the duplicate completions are still written.
2. **Decide, records.** Two fixes for the same bug: A checks for an existing row then inserts; B adds a unique key and inserts-or-ignores. Which would you merge? B: A still races.
3. **Rank, tenancy + ai-code.** Four AI review comments on a "list learners" handler: missing `org_id` filter, an N+1 query, a missing index, a variable name. Rank by how much they matter. The tenant leak first.
4. **Decide, ai-code.** An AI-written test that passes. Does it test anything? No: it mocks the function it is testing.
5. **Decide, rules.** "Mastery is three correct answers in a row; using a hint resets the streak." Which of four attempt histories is mastered?
6. **Decide, ai-in-the-loop.** The AI grader disagrees with teachers on 12% of essays, and grades now count toward a certificate. Next move: lower the temperature, switch to a larger model, send disagreements and a random sample to human review, or drop essays. Human review.
7. **Write, ops.** "You are SSH'd into the only server. Add a firewall rule that blocks all incoming traffic except port 443." Insight: the session uses port 22; the rule locks you out.
8. **Write, records.** "Average class completion is 82%. Students who never started have no progress row." Insight: the average excludes the learners most at risk.

Open (no answer; written by us for the demo, sourced from model uncertainty in slice 2):
9. **Decide.** Two AI explanations of why a test is flaky. Which is true?
10. **Rank.** Three AI-generated quiz questions. Rank by how fair they are to a learner.
11. **Decide.** A security scanner flags a learner-upload route. Real or false alarm?
12. **Write.** What would you check before trusting this AI's summary of a learner's essay?

Item drafts are written in full during implementation and reviewed by the founder before they are used.

## How a session runs

One item at a time, served by the server, so the candidate never holds the whole set and the server owns the clock.

1. The page loads `<voit-challenge pack="education-platform-engineer">`. (`role` and other attributes come later; the component reads its attributes in one place.)
2. The component calls `POST /api/sessions` with the pack and mode (`embed` or `practice`). The server picks the set (embed: 8 gold; practice: 8 gold and 4 open, shuffled), creates a session and returns the first item, answers stripped.
3. The candidate answers. The component calls `POST /api/sessions/:id/answers` with the answer and the browser's signals. The server records serve and answer times, scores gold (grading write items with the AI grader), stores everything, and returns the next item.
4. Feedback: in practice, the one-line reason appears after each gold item. In the embed, nothing is revealed until the end, and then only the profile, never answers.
5. After the last item the server returns a **signed result**. The component shows the profile and, in the embed, writes the token into a hidden form field `voit-result` so it is submitted with the application.
6. Anyone can check a token at `/verify`, or offline against the published public key.

## Scoring and labels

- **Profile.** Per area: gold items right out of gold items seen. No single number.
- **Gold accuracy** for the session = gold score / gold items.
- **Open labels.** An open answer counts only if its session's gold accuracy is at least 0.75, and is weighted by that accuracy. A decide or rank item is ready to **graduate** to gold when it has at least 10 counted answers and at least 80% weighted agreement. Graduation is a pull request that adds the answer to the item's JSON: a person approves every new gold item.
- **Open write items** graduate only by expert review, never by vote.

## The AI grader (write items only)

- Claude, called from the server. The exact model is chosen at planning time.
- Input: the item's question, rubric and the candidate's answer, the answer passed strictly as quoted data. Output: structured JSON `{ "grade": "caught | partly | missed", "evidence": "<phrase from the answer>" }`. Anything else is a grader error, retried once, then logged and shown as "not graded" rather than guessed.
- Partly counts 0.5.
- This is the only place AI scores anything.

## Integrity signals

Recorded per item, shown as a yellow flag in the result, never used to reject:
- time from serve to answer (server clock);
- time away from the tab (`visibilitychange`);
- paste attempts in write items (paste is blocked);
- text arriving faster than typing (more than 15 characters in one input event).

The signed result carries the flags as counts, not judgments.

## The signed result

A compact JWS signed with an Ed25519 key held by the server. Payload: session id, pack, mode, per-area profile, total time, flag counts, issued-at. No answers. The public key is served at `/.well-known/voit-key`.

## Stack

- **Next.js on Vercel** (workspace default), TypeScript. Everything local until the founder says otherwise.
- **The component** is a framework-free custom element in its own small bundle, served as `/embed.js`, so it drops into any HTML form. It renders in a shadow root in The Gate's language.
- **Postgres via Supabase** (already used in the workspace) for sessions and answers. **Founder to confirm.**
- Tables: `sessions` (id, pack, mode, started_at, finished_at, result_token) and `answers` (session_id, item_id, answer, served_at, answered_at, signals, score, grade). Labels are a query over `answers`, not a table.
- Pages: a demo application form that embeds the component, `/practice`, `/verify`.

## Design

Built in The Gate (`DESIGN.md`, `mockups/language.html`). Before any code, a static mockup in `mockups/` for founder approval, showing: a decide item, a rank item, a write item, the end profile, and the embed sitting inside a plain application form.

## Testing

- Unit: scoring for each format, rank distance, gold accuracy, label weighting and graduation threshold, token signing and verifying.
- Grader: tested against recorded responses; one live check run by hand.
- Routes: session lifecycle, answers never leaving the server, embed vs practice sets.
- Component: in a DOM test environment (no real or automated browser).

## Not in this slice

Accounts and sign-in; the employer's ranked pool and dashboard; the script that runs models against items and keeps those they fail; custom packs from an employer's code; item authoring tools; deployment, a GitHub remote, any public link.

## Open for the founder

1. Supabase for storage: yes or no.
2. The fictional employer's name (Fernhill Learning is a placeholder).
