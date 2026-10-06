# scoring Specification

## Purpose
TBD - created by archiving change judge-the-ai. Update Purpose after archive.
## Requirements
### Requirement: Scoring is deterministic
Every score SHALL come from comparing the answer with the item's stored answer. No AI model SHALL take part in scoring.

#### Scenario: Same answer, same score
- **WHEN** the same answer to the same gold item is scored twice
- **THEN** both scores are equal, and no network call is made

### Requirement: Decide items score by exact match
A gold decide item SHALL score 1 when the chosen option is the answer, otherwise 0.

#### Scenario: Right option
- **WHEN** the candidate picks the answer's option
- **THEN** the item scores 1

### Requirement: Rank items score by distance
A gold rank item SHALL score 1 for the exact order, 0.5 when the order differs from the answer by exactly one swap of adjacent options, otherwise 0.

#### Scenario: One adjacent swap
- **WHEN** the answer is A B C D and the candidate submits A C B D
- **THEN** the item scores 0.5

#### Scenario: Further off
- **WHEN** the answer is A B C D and the candidate submits B A D C
- **THEN** the item scores 0

### Requirement: Write items are never scored
A write item's answer SHALL be stored and carried to the employer as the candidate's own words, and SHALL never contribute to the profile, gold accuracy or labels.

#### Scenario: Write item answered
- **WHEN** a write item is answered
- **THEN** the text is stored and the profile is unchanged

### Requirement: Open items are not scored
Open items SHALL never contribute to the profile or gold accuracy.

#### Scenario: Open item answered
- **WHEN** an open item is answered
- **THEN** the answer is stored and the profile is unchanged

### Requirement: The profile is per area
The profile SHALL list, per area seen, the sum of gold scores and the number of gold items. There SHALL be no single overall score shown to the candidate.

#### Scenario: Profile at the end
- **WHEN** a session finishes having seen 2 gold `records` items scoring 1 and 0.5
- **THEN** the profile shows `records: 1.5 of 2`

### Requirement: Gold accuracy weights labels
Gold accuracy SHALL be total gold score divided by gold items scored. An open answer SHALL count toward a label only if its session's gold accuracy is at least 0.75, and SHALL be weighted by that accuracy.

#### Scenario: Low-accuracy session ignored
- **WHEN** an embed session scores 2 of 3 on gold (accuracy 0.67) and answers an open item
- **THEN** that answer does not count toward the item's label

#### Scenario: High-accuracy session counts
- **WHEN** an embed session scores 2.5 of 3 on gold (accuracy 0.83) and answers an open item
- **THEN** that answer counts with weight 0.83

### Requirement: Graduation candidates
An open decide or rank item SHALL be reported as ready to graduate when it has at least 10 counted answers and one answer holds at least 80% of the weighted vote. Graduation itself SHALL be a person editing the item file; the system SHALL never promote an item on its own.

#### Scenario: Ready to graduate
- **WHEN** an open decide item has 12 counted answers and one option holds 85% of the weight
- **THEN** the label report lists it as ready with that option

#### Scenario: Write item never listed
- **WHEN** a write item has any number of answers
- **THEN** the label report does not list it

