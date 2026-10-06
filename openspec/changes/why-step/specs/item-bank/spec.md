## ADDED Requirements

### Requirement: Calls are tweet-sized
Every item SHALL fit the window at a glance, with no scrolling: the work shown at most 6 lines and 240 characters, every code or log line at most 60 characters (prose wraps), the question at most 100 characters and each option at most 64. The player SHALL wrap long lines rather than scroll sideways.

#### Scenario: Oversize item is rejected at load
- **WHEN** an item's work has 7 lines, a code line of 61 characters, or an option of 65 characters
- **THEN** loading the bank fails with an error naming the item id

#### Scenario: No sideways scrolling
- **WHEN** a line of the work is wider than the window
- **THEN** it wraps under its own line number and the window shows no horizontal scrollbar
