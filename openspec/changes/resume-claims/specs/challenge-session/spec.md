## MODIFIED Requirements

### Requirement: Starting a session
The system SHALL start a session for a pack, a mode (`embed` or `practice`) and, in embed mode, the claims (`onResume` and `confirmed`, each a list of the pack's skill ids), and return the session id and the first item. Retired items SHALL never be drawn. Claims SHALL be stored with the session.

#### Scenario: Embed session
- **WHEN** a session starts in `embed` mode for `education-platform-engineer` with SQL and TypeScript confirmed
- **THEN** the set holds at least one gold item for each of SQL and TypeScript, 3 gold items in all, and 1 open decide or rank item, all from SQL or TypeScript and shuffled together, followed by 1 write item from SQL or TypeScript, and nothing in any served item distinguishes gold from open

#### Scenario: Four claims
- **WHEN** an embed session starts with 4 skills confirmed
- **THEN** the set has 4 gold items, one per skill, 1 open item and 1 write item: 6 items

#### Scenario: Embed takes about three minutes
- **WHEN** the embed set is drawn for 1 to 3 confirmed skills
- **THEN** it has exactly 5 items: 4 decide or rank and 1 write

#### Scenario: Practice session
- **WHEN** a session starts in `practice` mode
- **THEN** the set is every unretired item in the pack, gold and open shuffled together, claims are not needed, and nothing in any served item distinguishes gold from open

#### Scenario: Unknown pack
- **WHEN** a session starts for a pack that does not exist
- **THEN** the request fails with a not-found error and no session is created

#### Scenario: Bad claims
- **WHEN** an embed session starts with no confirmed skill, or a skill id the pack does not list
- **THEN** the request fails and no session is created

### Requirement: Consent before the first item
The player SHALL show a plain consent line before the first item: anonymised answers help calibrate the challenges; in embed mode, how each claim scored and the written answer go to the employer; in practice, the written answers stay private. In embed mode it sits on the confirm screen.

#### Scenario: Consent shown
- **WHEN** a session is about to show its first item
- **THEN** the consent line has been shown on the confirm screen (embed) or is visible above the first item (practice)
