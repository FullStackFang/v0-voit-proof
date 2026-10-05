## ADDED Requirements

### Requirement: Results are signed
On finish the system SHALL issue a compact JWS signed with an Ed25519 key held only by the server. The payload SHALL contain the session id, pack, mode, profile, total time, flag counts and issued-at time, and SHALL contain no answers.

#### Scenario: Token issued
- **WHEN** a session finishes
- **THEN** the response contains a JWS whose payload has those fields and no answer text or option choices

### Requirement: The public key is published
The system SHALL serve the public key at `/.well-known/voit-key`.

#### Scenario: Key fetched
- **WHEN** anyone requests `/.well-known/voit-key`
- **THEN** the response is the Ed25519 public key as a JWK

### Requirement: Anyone can verify a result
The system SHALL provide a `/verify` page where a pasted token is checked and its payload shown.

#### Scenario: Genuine token
- **WHEN** a token issued by the server is pasted into `/verify`
- **THEN** the page shows it as genuine with its profile, mode and flags

#### Scenario: Tampered token
- **WHEN** a token's payload is altered and pasted into `/verify`
- **THEN** the page shows it as not genuine and shows no profile
