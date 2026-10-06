## ADDED Requirements

### Requirement: A recruiter can order a pool from tokens
The system SHALL provide a `/pool` page where a recruiter pastes result tokens, one per line (copied from the `voit-result` field of submitted applications), with an optional applicant label before each token. The page SHALL verify every token and list the genuine ones ordered by total gold score, highest first. Nothing SHALL be stored; the list exists only on the page.

#### Scenario: Pool ordered
- **WHEN** three genuine tokens with gold scores 3, 1.5 and 2.5 of 3 are pasted
- **THEN** they are listed in the order 3, 2.5, 1.5, each with its profile, flags and written answer

#### Scenario: Ties stay ties
- **WHEN** two tokens have the same gold score
- **THEN** they are shown as one tier, in the order pasted, with no tie-break

### Requirement: Nobody is removed
Every pasted line SHALL appear in the result. Tokens that are not genuine, and lines that are not tokens, SHALL be listed below the ordered pool as unverified, never dropped. Flags SHALL be shown, never used to reorder.

#### Scenario: Tampered token in the pool
- **WHEN** one of the pasted tokens has been altered
- **THEN** it appears under unverified with its label, and every genuine token is still ordered

#### Scenario: Flagged applicant
- **WHEN** a genuine token carries 2 paste attempts
- **THEN** it is placed by its gold score, with the flag count shown beside it
