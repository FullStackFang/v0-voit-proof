## MODIFIED Requirements

### Requirement: Attributes are read in one place
The element SHALL read `pack` (required), `mode` (`embed` by default, or `practice`) and `resume` (optional, a CSS selector for the résumé file input in the host form) from its attributes in a single function, so further attributes can be added there.

#### Scenario: Missing pack
- **WHEN** the element has no `pack` attribute
- **THEN** it renders a short message that it is not configured and makes no request

#### Scenario: Résumé input named
- **WHEN** the element has `resume="#cv"`
- **THEN** it reads the résumé from the input matching `#cv` in its host form

## ADDED Requirements

### Requirement: Each call names its claim
In embed mode the window's band SHALL show the skill a call tests before its question.

#### Scenario: Call names its claim
- **WHEN** an SQL item is shown
- **THEN** the window's band shows "SQL" before the question
