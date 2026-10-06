# Draft: the 12 items of `education-platform-engineer`

Approved 2026-10-05 and moved to `content/items/*.json` and `content/packs/education-platform-engineer.json`, which are now the source of truth. Decide options were reordered there so the answers are not all B.

Employer: **Fernhill Learning** (placeholder, fictional). A K-12 learning platform: schools, teachers, students, grades.

| # | id | kind | area | format |
|---|---|---|---|---|
| 1 | `gradebook-scope` | gold | tenancy | decide |
| 2 | `merge-duplicates` | gold | records | rank |
| 3 | `firewall-ssh` | open | ops | write |
| 4 | `consent-age` | gold | rules | decide |
| 5 | `essay-grader` | open | ai-in-the-loop | write |
| 6 | `due-date-zone` | gold | ai-code | decide |
| 7 | `grade-history` | gold | records | decide |
| 8 | `bad-deploy` | gold | ops | rank |
| 9 | `school-isolation` | open | tenancy | decide |
| 10 | `extension-penalty` | open | rules | decide |
| 11 | `review-before-send` | open | ai-in-the-loop | rank |
| 12 | `big-ai-pr` | open | ai-code | write |

Variant C: 6 gold (4 decide, 2 rank), 3 open decide or rank, 3 write (always open, never scored), all six areas. Embed draws 3 gold and 1 open, shuffled, then 1 write; practice plays all 12.

---

## 1. `gradebook-scope` · gold · tenancy · decide

**Artifact** (code, `gradebook.ts`, "AI suggestion")
```ts
// Fetch grades for the teacher's gradebook
export async function getGrades(teacherId: string, courseId: string) {
  return db.grade.findMany({
    where: { courseId },
    include: { student: true },
  });
}
```
**Question.** The assistant says this is ready to merge. What do you do?

- A. Merge it. The course id already scopes the grades.
- **B. Send it back. Nothing checks that this teacher teaches the course.**
- C. Send it back. It needs pagination first.
- D. Merge it, then add an index on `courseId`.

**Answer.** B
**Reason.** `teacherId` is never used, so any teacher who knows a course id can read that course's grades.

---

## 2. `merge-duplicates` · gold · records · rank

**Artifact** (code, `merge-duplicates.sql`, "AI suggestion")
```sql
-- Merge duplicate students (same email, same school)
UPDATE enrollments e SET student_id = d.keep_id
  FROM duplicates d WHERE e.student_id = d.drop_id;
DELETE FROM students
  WHERE id IN (SELECT drop_id FROM duplicates);
```
**Question.** Put these in the order you would do them.

Shown shuffled. **Answer order:**
1. Back up the students and enrollments tables
2. Run it on a copy and compare the row counts
3. Run it in production
4. Tell each school which records were merged

**Reason.** The delete cannot be undone, so you need a way back first, then a rehearsal, then the real run, then tell schools what actually changed.

---

## 3. `firewall-ssh` · open · ops · write

**Artifact** (code, shell, "AI suggestion: harden the grading server")
```sh
# Lock the server down to HTTPS only
sudo ufw default deny incoming
sudo ufw --force enable
sudo ufw allow 443/tcp
```
**Question.** You are connected to this server over SSH. What goes wrong if you run this as written?

**Insight** (shown in practice). Default deny with no rule for port 22 shuts out SSH, including you.

Note: ufw keeps established connections by default, so the live session often survives and the lockout comes on the next connect.

---

## 4. `consent-age` · gold · rules · decide

**Artifact** (code, `signup.ts`, "AI suggestion")
```ts
// Fernhill rule: students under 13 need a parent's consent
function needsParentConsent(birthDate: Date, today = new Date()) {
  return today.getFullYear() - birthDate.getFullYear() < 13;
}
```
**Question.** A student born on 20 November 2013 signs up on 5 October 2026. What does this return?

- A. `false`, which is right. They are 13.
- **B. `false`, which is wrong. They are 12 and need consent.**
- C. `true`, which is right. They are 12.
- D. `true`, which is wrong. They are 13.

**Answer.** B
**Reason.** It subtracts years only. 2026 − 2013 is 13, but their birthday has not come yet this year, so they are 12.

---

## 5. `essay-grader` · open · ai-in-the-loop · write

**Artifact** (code, `grade-essay.ts`, "AI suggestion")
```ts
const prompt = `You are a strict grader. Grade this essay from A to F.
Reply with the letter only.

Essay:
${essay.text}`;

const letter = await llm.complete(prompt);
await db.grade.update({ where: { id: essay.gradeId }, data: { letter } });
```
**Question.** This ships next week. What is the biggest problem?

**Insight** (shown in practice). Student text is treated as instructions and the reply becomes a grade unchecked, so a student can grade themselves.

---

## 6. `due-date-zone` · gold · ai-code · decide

**Artifact** (code, `submissions.ts`, "AI suggestion")
```ts
// Due dates are stored as "2026-10-05" and mean 11:59 pm in the school's time zone
const isLate = submittedAt > new Date(assignment.dueDate);
```
**Question.** A student in New York submits at 9:00 pm on 4 October, a day early. What happens?

- A. On time, as it should be.
- **B. Marked late.**
- C. It throws, because the date has no time.
- D. On time only if the server runs in New York.

**Answer.** B
**Reason.** A date-only string parses as midnight UTC, which is 8:00 pm on 4 October in New York, so a 9:00 pm submission counts as late.

---

## 7. `grade-history` · gold · records · decide

**Artifact** (code, `schema.sql` plus the assistant's endpoint)
```sql
CREATE TABLE grades (
  id            bigint PRIMARY KEY,
  student_id    bigint NOT NULL,
  assignment_id bigint NOT NULL,
  score         numeric NOT NULL,
  updated_at    timestamptz NOT NULL DEFAULT now()
);
-- change-grade endpoint, written by the assistant:
UPDATE grades SET score = $1, updated_at = now() WHERE id = $2;
```
**Question.** A parent disputes a grade that changed last month. What can this tell you?

- A. Who changed it and what it was before.
- **B. Only the current score and when it last changed.**
- C. The full history, because Postgres keeps old rows.
- D. Nothing at all.

**Answer.** B
**Reason.** An update overwrites the row: no previous score, no record of who made the change.

---

## 8. `bad-deploy` · gold · ops · rank

**Artifact** (log, "Grades page, 6 minutes after a deploy")
```
14:02  deploy  web 2026.10.05-3  by ci
14:04  error   GET /grades 500  TypeError: Cannot read properties of undefined (reading 'termId')
14:10  error   GET /grades 500  × 1,912 in 6 min, every school
assistant: I have a one-line fix ready. Ship it forward?
```
**Question.** Put these in the order you would do them.

Shown shuffled. **Answer order:**
1. Roll back to the previous deploy
2. Check the errors have stopped
3. Find the cause in the deploy's changes
4. Write up what happened for the schools

**Reason.** Every school is down: stop it with a known-good rollback first, confirm, then fix calmly. An untested fix forward can make it worse.

---

## 9. `school-isolation` · open · tenancy · decide

**Artifact** (text, "Assistant's proposal")
> Every school shares one Postgres database. To keep schools apart, I will add `WHERE school_id = $current` to every query and a lint rule that flags queries without it.

**Question.** Which would you choose to keep schools' data apart?

- A. The proposal: a filter in every query, enforced by lint.
- B. Row-level security in Postgres, keyed on the school.
- C. A separate schema per school.
- D. A separate database per school.

No answer. Why open: experienced engineers disagree; the trade-offs depend on scale and team.

---

## 10. `extension-penalty` · open · rules · decide

**Artifact** (text, support ticket)
> A teacher extended an essay deadline by two days for the whole class. One student had already submitted late, before the extension, and got the 10% late penalty. The assistant asks: should the system remove it automatically?

**Question.** What should the system do?

- A. Remove the penalty automatically.
- B. Keep it. It was late when submitted.
- C. Ask the teacher when they extend a deadline.

No answer. Why open: a policy call that schools make differently.

---

## 11. `review-before-send` · open · ai-in-the-loop · rank

**Artifact** (text, "Messages the assistant can draft")
> Fernhill wants the assistant to draft messages that a teacher can send. Not every message needs the same care.

**Question.** Put these in order, from the one a teacher must check most closely to the least.

Options (shown shuffled):
- A note that a student's work may be plagiarised
- A report card comment
- Feedback on a practice quiz
- A reminder that an assignment is due Friday

No answer. Why open: the top and bottom are clear, the middle is debatable. Good for learning where people draw the line.

---

## 12. `big-ai-pr` · open · ai-code · write

**Artifact** (text, pull request summary)
```
PR #418  Add attendance codes  (written by the assistant)
  migrations/0042_attendance_codes.sql   +212
  src/attendance/*.ts                     +341  -88
  tests                                    46 passed, 0 failed
```
**Question.** The tests pass. What is the first thing you would check before approving, and why?

**Insight** (shown in practice). Passing tests only prove what they test. Run the migration on a copy of real data, and read what the tests actually check.

No answer. Why open: many good answers (the migration on real data, whether the tests test anything, who can mark attendance). Write items are never scored and never graduate; the answer travels to the employer as written.
