## ADDED Requirements

### Requirement: Items have one of three formats
Every item SHALL have exactly one format: `decide` (2 to 4 options, one answer), `rank` (3 to 5 options, one order) or `write` (free text, at most 280 characters). Every item SHALL show one artifact (code, text or log) and ask one question.

#### Scenario: Valid decide item loads
- **WHEN** an item file has format `decide`, 2 to 4 options and a question
- **THEN** the bank loads it

#### Scenario: Invalid item is rejected at load
- **WHEN** an item file has an unknown format, a decide item has 5 options, or a rank item has 2 options
- **THEN** loading the bank fails with an error naming the item id

### Requirement: Gold items carry an answer, open items do not
Only decide and rank items SHALL be gold. A gold item SHALL carry its answer (an option index for decide, an order for rank) and a one-line reason. An open decide or rank item SHALL carry no answer and no reason. Write items SHALL always be open, SHALL carry no answer or rubric, and MAY carry a one-line reason (the insight), shown only in practice after answering.

#### Scenario: Gold item without answer is rejected
- **WHEN** an item marked `gold` has no answer
- **THEN** loading the bank fails with an error naming the item id

#### Scenario: Gold write item is rejected
- **WHEN** a write item is marked `gold`
- **THEN** loading the bank fails with an error naming the item id

#### Scenario: Open item with answer is rejected
- **WHEN** an item marked `open` has an answer or rubric, or an open decide or rank item has a reason
- **THEN** loading the bank fails with an error naming the item id

### Requirement: Items belong to a competency area
Every item SHALL name one area from: `records`, `tenancy`, `rules`, `ai-in-the-loop`, `ai-code`, `ops`.

#### Scenario: Unknown area is rejected
- **WHEN** an item names an area not in the list
- **THEN** loading the bank fails with an error naming the item id

### Requirement: Answers never leave the server
The system SHALL strip `answer`, `reason`, `rubric` and `kind` from any item before sending it to a browser.

#### Scenario: Served item is stripped
- **WHEN** the server serves any item
- **THEN** the response contains no answer, reason, rubric or kind field

### Requirement: Packs list items for a role
A pack SHALL be a named list of item ids, with the employer it is for (named in the consent line). Every id in a pack SHALL exist in the bank. A pack SHALL hold at least 3 gold items, at least 1 open decide or rank item, and at least 1 write item, so an embed set can always be drawn.

#### Scenario: Pack with missing item is rejected
- **WHEN** a pack lists an id with no item file
- **THEN** loading fails with an error naming the pack and the id

#### Scenario: Pack too small for an embed set
- **WHEN** a pack has fewer than 3 gold items, no open decide or rank item, or no write item
- **THEN** loading fails with an error naming the pack

### Requirement: Exposure is tracked
The system SHALL record, per item, when it was first served and how many times it has been served.

#### Scenario: First serve sets first-seen
- **WHEN** an item is served for the first time
- **THEN** its first-seen time is set and its serve count is 1

### Requirement: Retired items are never served
An item MAY be marked `retired` by a person editing its file (for example after a leak). A retired item SHALL stay in the bank for past results but SHALL never be drawn into a new session.

#### Scenario: Retired gold item
- **WHEN** a gold item is marked `retired`
- **THEN** no new session includes it, and the pack still loads if enough gold items remain

### Requirement: The first pack
The bank SHALL ship one pack, `education-platform-engineer`, for a fictional employer, with 6 gold items (4 decide, 2 rank), 3 open decide or rank items and 3 write items, covering every area at least once. No real company name or branding SHALL appear in any item.

#### Scenario: First pack is complete
- **WHEN** the bank loads
- **THEN** pack `education-platform-engineer` has 6 gold, 3 open decide or rank and 3 write items, and covers all six areas
