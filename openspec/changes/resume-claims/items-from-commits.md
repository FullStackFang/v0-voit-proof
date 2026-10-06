# Draft: five gold items mined from real fixes

First try at the question guide in `design.md`. Each item starts from a real bug fix in the founder's own history (`emanuel-resource-calendar-app`), keeps the shape of the mistake, and is rewritten for the fictional employer: Fernhill Learning's room booking (schools book halls, labs and gyms for events; staff approve). No code, names or data are copied; the source commit is noted for the founder only and is not part of the item.

Rough pass 2026-10-06 (Claude Opus 5.5, Claude Sonnet 5.5, Codex; 2 tries each): items 1 to 4 solved 100% by every model; item 5 at 50% (Opus 0 of 2, Sonnet 2 of 2, Codex 1 of 2), which more likely means its order is debatable than that it is hard. Lesson: in a multiple-choice item the right option spells out the insight, so a model only has to recognise it, not find it. A trap hidden in the artifact does not survive that.

| # | id | skill | format | pattern | from commit |
|---|---|---|---|---|---|
| 1 | `blank-week-retry` | TypeScript | decide | state over time | `0743490` retry race wiped loaded events |
| 2 | `negative-published` | SQL | decide | constraint across two pieces | `2afd3b9` count went negative, fixed by clamping |
| 3 | `midnight-default` | TypeScript | decide | best practice wrong here | `59e05bd` null vs missing start time |
| 4 | `edit-request-once` | TypeScript | decide | constraint across two pieces | `79b3fed` Request edit worked only once |
| 5 | `approve-own-booking` | TypeScript | rank | consequences and order | `3098af2` fix hid the buttons, not the endpoint |

---

## 1. `blank-week-retry` · gold · TypeScript · decide

**Pattern.** State over time: the bug only shows across the sequence of loads.

**Artifact** (code and log, `timetable.ts`, "AI suggestion")
```ts
// Load the visible week. A navigation during a load sets pendingReload.
async function loadWeek(range: Range) {
  loading = true;
  const result = await sync.delta(range);
  if (result.events.length === 0) {
    setEvents([]);
    showEmptyState(range);
  } else {
    setEvents(merge(events, result.events));
  }
  loading = false;
  if (pendingReload) {
    pendingReload = false;
    loadWeek(currentRange);
  }
}
```
```
sync.delta(range): events created, changed or deleted in range since the last delta call.

09:14:02.110  loadWeek(6–12 Oct)   delta → 41 events   rendered 41
09:14:02.180  user taps "This week" (6–12 Oct) while loading → pendingReload
09:14:02.390  loadWeek(6–12 Oct)   delta → 0 events    rendered 0, empty state
```
**Question.** Teachers say the week sometimes goes blank a moment after it loads. What is wrong?

- A. The two loads race, and the first load's 41 events land after the second load's empty result.
- B. After a delta sync, 0 events means nothing changed since the last call, but the code treats it as an empty week and wipes what is shown.
- C. `pendingReload` is reset after the reload starts, so the reload runs twice.
- D. `merge` drops events when the new range is the same week as the old one.

**Answer.** B
**Reason.** A delta of 0 says "no changes", not "no events"; the catch-up reload is a no-op that the empty branch turns into a blank week.

---

## 2. `negative-published` · gold · SQL · decide

**Pattern.** Constraint across two pieces: the schema says the columns can be null; the fixes that look right break on it.

**Artifact** (code, `booking-counts.sql`, "AI suggestion")
```sql
-- bookings.edit_request   text NULL  -- 'pending' | 'approved' | 'rejected'; NULL if never requested
-- bookings.cancel_request text NULL  -- same values; NULL if never requested

SELECT count(*) FILTER (WHERE status = 'published')                               AS published_total,
       count(*) FILTER (WHERE status = 'published' AND edit_request = 'pending')   AS awaiting_edit,
       count(*) FILTER (WHERE status = 'published' AND cancel_request = 'pending') AS awaiting_cancel
  FROM bookings WHERE school_id = $1;

-- dashboard: plain published = published_total - awaiting_edit - awaiting_cancel
```
**Question.** One school's dashboard showed "Published: -1" this morning. Which fix is right?

- A. Clamp it: `GREATEST(0, published_total - awaiting_edit - awaiting_cancel)`.
- B. Count it directly: `count(*) FILTER (WHERE status = 'published' AND edit_request <> 'pending' AND cancel_request <> 'pending')`.
- C. Count it directly: `count(*) FILTER (WHERE status = 'published' AND edit_request IS DISTINCT FROM 'pending' AND cancel_request IS DISTINCT FROM 'pending')`.
- D. Stop a booking from having an edit and a cancellation pending at once.

**Answer.** C
**Reason.** A booking with both requests pending is subtracted twice; clamping hides the error but the count stays too low, and `<> 'pending'` drops every booking whose requests are NULL, which is most of them.

---

## 3. `midnight-default` · gold · TypeScript · decide

**Pattern.** Best practice wrong here: the textbook fix (`??`, or "falsy means empty") breaks on what this data means.

**Artifact** (code, `booking-form.ts`, "AI suggestion")
```ts
// Fill the edit form from a saved booking.
// booking.startsAt always has a time; the API writes 00:00 when none was given.
// booking.details.startTime: "14:30" if the person typed a time,
//   null if they left it blank, missing on bookings saved before March 2025.
let start = timeOf(booking.startsAt);
if (booking.details.startTime) start = booking.details.startTime;
form.startTime = start;
```
**Question.** People who left the start time blank see 00:00 in the form when they reopen their booking. Which change fixes it without breaking anything else?

- A. `form.startTime = booking.details.startTime ?? timeOf(booking.startsAt)`
- B. `form.startTime = booking.details.startTime || ''`
- C. Use the typed time if there is one, show blank when it is `null`, and fall back to `startsAt` only when the field is missing.
- D. Show any 00:00 in the form as blank.

**Answer.** C
**Reason.** `??` treats null like missing and keeps the 00:00; `|| ''` blanks the older bookings that only have `startsAt`; and a booking can really start at midnight, so null, missing and a typed time each need their own case.

---

## 4. `edit-request-once` · gold · TypeScript · decide

**Pattern.** Constraint across two pieces: the button's rule is fine alone; the approval handler makes it wrong.

**Artifact** (code, `booking-actions.ts`, "AI suggestion")
```ts
// Requester view: show "Request edit" on a published booking unless one is already open.
const canRequestEdit =
  isRequester && booking.status === "published" && !booking.editRequest?.status;

// Approver: apply an edit request. editRequest is kept: the History tab reads it.
async function approveEdit(id: string, now: Date) {
  const b = await bookings.get(id);
  await bookings.update(id, {
    ...b.editRequest.changes,
    editRequest: { ...b.editRequest, status: "approved", decidedAt: now },
  });
}
```
**Question.** "My first edit request was approved, and now the Request edit button is gone for good." What is the right fix?

- A. Clear `editRequest` when an edit is approved or rejected.
- B. Show the button unless `booking.editRequest?.status === "pending"`.
- C. Reset `booking.status` to "published" after applying the changes.
- D. Check `isRequester` against the booking's original requester, not the current owner.

**Answer.** B
**Reason.** Decided requests keep their status, so "any status" blocks forever; clearing the request (A) also works but wipes what the History tab reads.

---

## 5. `approve-own-booking` · gold · TypeScript · rank

**Pattern.** Consequences and order: the PR looks like the fix; what matters is what is still open and who was affected.

**Artifact** (code, PR "Requesters can no longer approve their own bookings", "AI suggestion")
```tsx
// BookingModal.tsx: approve and reject only for approvers
- onApprove={handleApprove}
- onReject={handleReject}
+ onApprove={canApprove ? handleApprove : null}
+ onReject={canApprove ? handleReject : null}
```
```ts
// server: unchanged by the PR
app.post("/api/bookings/:id/approve", requireSignIn, approveBooking);
app.post("/api/bookings/:id/reject",  requireSignIn, rejectBooking);
```
**Question.** The bug has been live for two months. Put these in the order you would do them.

1. Add an approver check to the approve and reject endpoints and ship it
2. Find bookings approved or rejected by their own requester
3. Tell the schools whose bookings were affected
4. Merge the PR that hides the buttons

(Options are shuffled when served.)

**Answer.** 1, 2, 3, 4
**Reason.** Hiding buttons closes nothing while the endpoints accept any signed-in user; close the hole first, then find what it let through, then tell the people affected, and the button change last, since it is cosmetic.
