## REMOVED Requirements

### Requirement: Items belong to a competency area
**Reason**: Items are grouped by the skill a résumé claims, so the result can show each claim beside how it scored.
**Migration**: Replace each item's `area` with `skill`, an id from its pack's skill list; re-tag or retire the slice 1 items.

## ADDED Requirements

### Requirement: Items belong to a skill
Every item SHALL name one `skill`, and every pack listing the item SHALL list that skill.

#### Scenario: Skill not in the pack
- **WHEN** a pack lists an item whose skill is not in the pack's skill list
- **THEN** loading fails with an error naming the pack and the item id

## MODIFIED Requirements

### Requirement: Packs list items for a role
A pack SHALL be a named list of item ids, with the employer it is for and its role's skills (1 to 4, each with an id, a display name and optional aliases used to match résumés). Every id in a pack SHALL exist in the bank. For every skill, a pack SHALL hold at least 3 unretired gold items, at least 1 unretired open decide or rank item, and at least 1 unretired write item, so an embed set can be drawn for any single claim.

#### Scenario: Pack with missing item is rejected
- **WHEN** a pack lists an id with no item file
- **THEN** loading fails with an error naming the pack and the id

#### Scenario: Pack too small for an embed set
- **WHEN** any skill in a pack has fewer than 3 unretired gold items, no open decide or rank item, or no write item
- **THEN** loading fails with an error naming the pack and the skill

### Requirement: The first pack
The bank SHALL ship one pack, `education-platform-engineer`, for the fictional employer Fernhill Learning, with the skills SQL, TypeScript, Linux and Python, and for each skill at least 3 gold items (decide or rank), 4 where possible, 1 open decide or rank item and 1 write item.

#### Scenario: First pack is complete
- **WHEN** the bank loads
- **THEN** pack `education-platform-engineer` lists its skills, each with at least 3 gold items, 1 open decide or rank and 1 write item
