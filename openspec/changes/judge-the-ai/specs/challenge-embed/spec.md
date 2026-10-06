## ADDED Requirements

### Requirement: One line in any form
The system SHALL serve a framework-free script at `/embed.js` defining the custom element `<voit-challenge>`. A page SHALL need only the script tag and the element.

#### Scenario: Pasted into a plain form
- **WHEN** a plain HTML form includes the script and `<voit-challenge pack="education-platform-engineer"></voit-challenge>`
- **THEN** the challenge renders inline in the form with no other setup

### Requirement: Attributes are read in one place
The element SHALL read `pack` (required) and `mode` (`embed` by default, or `practice`) from its attributes in a single function, so further attributes can be added there.

#### Scenario: Missing pack
- **WHEN** the element has no `pack` attribute
- **THEN** it renders a short message that it is not configured and makes no request

### Requirement: Rendering is isolated
The element SHALL render in a shadow root in The Gate's design language, so the host page's styles do not change it and its styles do not leak out.

#### Scenario: Hostile host styles
- **WHEN** the host page sets global styles on `button` and `div`
- **THEN** the challenge's appearance is unchanged

### Requirement: The three formats are playable
The element SHALL show the consent line before the first item, then render decide items as options to pick, rank items as a list to reorder (by drag and by keyboard), and write items as a text box limited to 280 characters with paste blocked.

#### Scenario: Rank by keyboard
- **WHEN** the candidate focuses a rank option and presses the move-up key
- **THEN** the option moves up one place

#### Scenario: Write limit
- **WHEN** the candidate types the 281st character
- **THEN** it is not inserted

### Requirement: The result is attached to the form
In embed mode, on finish, the element SHALL write the result token into a hidden input named `voit-result` inside the host form, and show the candidate their profile.

#### Scenario: Form submitted after finishing
- **WHEN** the candidate finishes and submits the host form
- **THEN** the submitted data includes `voit-result` with the token

#### Scenario: Form submitted before finishing
- **WHEN** the candidate submits the host form before finishing
- **THEN** `voit-result` is absent, and the form submits normally
