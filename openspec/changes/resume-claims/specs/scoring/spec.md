## REMOVED Requirements

### Requirement: The profile is per area
**Reason**: Areas are replaced by skills; the profile is the per-claim result.
**Migration**: See "The profile is per skill". Old tokens keep their area profiles and display as they are.

## ADDED Requirements

### Requirement: The profile is per skill
The profile SHALL list, per skill seen, the sum of gold scores and the number of gold items. There SHALL be no single overall score shown to the candidate.

#### Scenario: Profile at the end
- **WHEN** a session finishes having seen 2 gold SQL items scoring 1 and 0.5
- **THEN** the profile shows `sql: 1.5 of 2`

### Requirement: How each claim scored
For each skill in the role, the result SHALL say one of: **passed** (confirmed, gold score at least half its gold items), **flagged** (confirmed, gold score under half), **skipped** (on the résumé, not confirmed) or nothing (neither on the résumé nor confirmed). None of these SHALL change the pool order.

#### Scenario: Passed
- **WHEN** SQL is confirmed and scores 1.5 of 2
- **THEN** SQL passed

#### Scenario: Flagged
- **WHEN** Linux is confirmed and scores 0 of 1
- **THEN** Linux is flagged

#### Scenario: Skipped
- **WHEN** TypeScript is on the résumé and the applicant unticked it
- **THEN** TypeScript is skipped, and is shown, not hidden
