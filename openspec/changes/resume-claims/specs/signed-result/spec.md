## MODIFIED Requirements

### Requirement: Results are signed
On finish the system SHALL issue a compact JWS signed with an Ed25519 key held only by the server. The payload SHALL contain the session id, pack, mode, the ids of the items served, the per-skill profile, the claims (for each role skill: on the résumé as reported by the browser, and confirmed), the write answer's text, total time, flag counts and issued-at time. It SHALL contain no option choices, no answers to decide, rank or open items, and nothing from the résumé but skill ids.

#### Scenario: Token issued
- **WHEN** a session finishes
- **THEN** the response contains a JWS whose payload has those fields, including the served item ids, the claims and the written answer, and no option choices

### Requirement: Anyone can verify a result
The system SHALL provide a `/verify` page where a pasted token is checked and its payload shown, including each claim beside how it scored.

#### Scenario: Genuine token
- **WHEN** a token issued by the server is pasted into `/verify`
- **THEN** the page shows it as genuine with its claims and how each scored, mode, flags and written answer

#### Scenario: Tampered token
- **WHEN** a token's payload is altered and pasted into `/verify`
- **THEN** the page shows it as not genuine and shows no profile or claims

#### Scenario: Slice 1 token
- **WHEN** a genuine token without claims is pasted
- **THEN** the page shows it as genuine with its profile as issued
