## MODIFIED Requirements

### Requirement: Starting a session
The system SHALL start a session for a pack and a mode (`embed` or `practice`) and return the session id and the first item. Retired items SHALL never be drawn.

#### Scenario: Embed session
- **WHEN** a session starts in `embed` mode for `education-platform-engineer`
- **THEN** the set is 3 gold items and 1 open decide or rank item drawn at random from the pack and shuffled together, and nothing in any served item distinguishes gold from open

#### Scenario: Embed takes about three minutes
- **WHEN** the embed set is drawn
- **THEN** it has exactly 4 items, all decide or rank, and no write item

#### Scenario: Practice session
- **WHEN** a session starts in `practice` mode
- **THEN** the set is every unretired item in the pack, gold and open shuffled together, and nothing in any served item distinguishes gold from open

#### Scenario: Unknown pack
- **WHEN** a session starts for a pack that does not exist
- **THEN** the request fails with a not-found error and no session is created

## ADDED Requirements

### Requirement: Every call asks why
After the candidate picks or orders, the player SHALL ask "What decided it?" with one box for the candidate's own words: at most 80 characters, typed, paste blocked. The answer to a decide or rank item SHALL carry the Why. The server SHALL reject a decide or rank answer without a Why, and SHALL store the Why with the answer. The Why SHALL never be scored.

#### Scenario: Why with the answer
- **WHEN** the candidate picks option B and types "teacherId is never used"
- **THEN** one request carries the answer and that text, and both are stored

#### Scenario: Missing why
- **WHEN** a decide answer arrives without a Why, with only spaces, or with more than 80 characters
- **THEN** the request is rejected and nothing is stored
