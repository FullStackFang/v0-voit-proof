## MODIFIED Requirements

### Requirement: Results are signed
On finish the system SHALL issue a compact JWS signed with an Ed25519 key held only by the server. The payload SHALL contain the session id, pack, mode, the ids of the items served, the profile, the reasoning (each call's Why, in the candidate's words, in the order served), the write answer's text, total time, flag counts and issued-at time. It SHALL contain no option choices and no answers to decide, rank or open items.

#### Scenario: Token issued
- **WHEN** a session finishes
- **THEN** the response contains a JWS whose payload has those fields, including the served item ids, the reasoning and the written answer, and no option choices
