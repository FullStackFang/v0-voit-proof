## MODIFIED Requirements

### Requirement: A recruiter can order a pool from tokens
The system SHALL provide a `/pool` page where a recruiter pastes result tokens, one per line (copied from the `voit-result` field of submitted applications), with an optional applicant label before each token. The page SHALL verify every token and list the genuine ones ordered by total gold score, highest first. Nothing SHALL be stored; the list exists only on the page.

#### Scenario: Pool ordered
- **WHEN** three genuine tokens with gold scores 3, 1.5 and 2.5 of 3 are pasted
- **THEN** they are listed in the order 3, 2.5, 1.5, each with its claims, flags and written answer

#### Scenario: Ties stay ties
- **WHEN** two tokens have the same gold score
- **THEN** they are shown as one tier, in the order pasted, with no tie-break

## ADDED Requirements

### Requirement: Claims are shown beside each applicant
Each genuine applicant SHALL show every claim with its gold score: passed in blue, flagged with the yellow ring, skipped in grey. Claims SHALL never change the order.

#### Scenario: Flagged claim does not move an applicant
- **WHEN** two genuine tokens score 3 of 4 and 2 of 3, and the first has a flagged claim
- **THEN** the first is still listed first, with its flagged claim shown
