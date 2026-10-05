## ADDED Requirements

### Requirement: Starting a session
The system SHALL start a session for a pack and a mode (`embed` or `practice`) and return the session id and the first item.

#### Scenario: Embed session
- **WHEN** a session starts in `embed` mode for `education-platform-engineer`
- **THEN** the set is the pack's 8 gold items in shuffled order, and the first is returned

#### Scenario: Practice session
- **WHEN** a session starts in `practice` mode
- **THEN** the set is all 12 items, gold and open shuffled together, and nothing in any served item distinguishes gold from open

#### Scenario: Unknown pack
- **WHEN** a session starts for a pack that does not exist
- **THEN** the request fails with a not-found error and no session is created

### Requirement: One item at a time
The server SHALL serve the next item only after the current one is answered. Answers SHALL be final.

#### Scenario: Answer returns the next item
- **WHEN** the candidate answers the current item
- **THEN** the answer is stored and the next item is returned

#### Scenario: Answering out of turn
- **WHEN** an answer arrives for an item that is not the session's current item
- **THEN** the request is rejected and nothing is stored

#### Scenario: Answering twice
- **WHEN** a second answer arrives for an already answered item
- **THEN** the request is rejected and the first answer stands

### Requirement: The server owns the clock
The system SHALL record, per item, the server time it was served and the server time it was answered.

#### Scenario: Timing is recorded
- **WHEN** an item is answered
- **THEN** its served and answered times are stored from the server clock, regardless of any time the browser reports

### Requirement: Feedback depends on mode
In practice mode the system SHALL return the one-line reason after each gold item. In embed mode it SHALL return no per-item feedback, and at the end only the profile.

#### Scenario: Practice feedback
- **WHEN** a gold item is answered in practice mode
- **THEN** the response includes whether the answer was right and the item's reason

#### Scenario: Embed reveals nothing
- **WHEN** any item is answered in embed mode
- **THEN** the response includes no correctness and no reason

#### Scenario: Open items give no verdict
- **WHEN** an open item is answered in practice mode
- **THEN** the response includes no correctness and no reason

### Requirement: Integrity signals are recorded and flagged
The browser SHALL report, per item: time away from the tab, paste attempts (write items, where paste is blocked) and input events that add more than 15 characters at once. The system SHALL store them with the answer and SHALL never reject or alter a score because of them.

#### Scenario: Paste in a write item
- **WHEN** the candidate pastes into a write item
- **THEN** nothing is inserted, the attempt is counted, and the answer is still accepted and scored normally

#### Scenario: Time away
- **WHEN** the candidate leaves the tab for 20 seconds during an item
- **THEN** 20 seconds of time away is recorded for that item

### Requirement: Finishing a session
After the last item the system SHALL mark the session finished and return the signed result.

#### Scenario: Last answer finishes
- **WHEN** the last item is answered
- **THEN** the session is marked finished and the response contains the profile and the result token

#### Scenario: Answer after finish
- **WHEN** an answer arrives for a finished session
- **THEN** the request is rejected
