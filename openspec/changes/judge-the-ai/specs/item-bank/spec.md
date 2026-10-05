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
A gold item SHALL carry its answer (an option index for decide, an order for rank, a rubric of one insight and wrong turns for write) and a one-line reason. An open item SHALL carry no answer, reason or rubric.

#### Scenario: Gold item without answer is rejected
- **WHEN** an item marked `gold` has no answer (or, for write, no rubric)
- **THEN** loading the bank fails with an error naming the item id

#### Scenario: Open item with answer is rejected
- **WHEN** an item marked `open` has an answer, reason or rubric
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
A pack SHALL be a named list of item ids. Every id in a pack SHALL exist in the bank.

#### Scenario: Pack with missing item is rejected
- **WHEN** a pack lists an id with no item file
- **THEN** loading fails with an error naming the pack and the id

### Requirement: Exposure is tracked
The system SHALL record, per item, when it was first served and how many times it has been served.

#### Scenario: First serve sets first-seen
- **WHEN** an item is served for the first time
- **THEN** its first-seen time is set and its serve count is 1

### Requirement: The first pack
The bank SHALL ship one pack, `education-platform-engineer`, for a fictional employer, with 8 gold and 4 open items, covering every area at least once, including at least two write items among the gold. No real company name or branding SHALL appear in any item.

#### Scenario: First pack is complete
- **WHEN** the bank loads
- **THEN** pack `education-platform-engineer` has 8 gold and 4 open items, covers all six areas, and has at least two gold write items
