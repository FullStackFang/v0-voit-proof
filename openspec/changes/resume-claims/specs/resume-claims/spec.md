## ADDED Requirements

### Requirement: The résumé is found in the host form
In embed mode the element SHALL take the résumé from the file input named by its `resume` attribute (a CSS selector within the host form), or else from the host form's first `input[type=file]`.

#### Scenario: Default input
- **WHEN** the host form has one file input and the element has no `resume` attribute
- **THEN** the element reads the file chosen in that input

#### Scenario: No résumé yet
- **WHEN** the applicant clicks the box before choosing a file
- **THEN** the window says only "Attach your résumé first." and no session is started

### Requirement: The résumé is read in the browser and never sent
The element SHALL read the résumé's text in the applicant's browser (plain text, or PDF with text) and SHALL never send the file or its text to any server. Only skill ids SHALL leave the browser.

#### Scenario: Nothing of the résumé is sent
- **WHEN** an applicant with an attached résumé confirms claims and starts
- **THEN** the start request contains skill ids only, and no request contains the file or any of its text

#### Scenario: Unreadable résumé
- **WHEN** the attached file is a scanned PDF with no text, or another format
- **THEN** no skill is pre-ticked and the applicant can still tick claims by hand

### Requirement: Claims are matched to the role's skills
A role skill SHALL count as on the résumé when its name or one of its aliases appears in the résumé text as a whole word, ignoring case. Nothing outside the role's skill list SHALL be offered.

#### Scenario: Alias match
- **WHEN** the role skill SQL has the alias "PostgreSQL" and the résumé says "tuned PostgreSQL queries"
- **THEN** SQL is on the résumé

#### Scenario: Part of a word does not match
- **WHEN** the role skill is "Go" and the résumé says "good at algorithms"
- **THEN** Go is not on the résumé

### Requirement: The applicant confirms the claims
The first screen of the embed window SHALL list every role skill, ticked when on the résumé, each marked "on your résumé" or "not on your résumé", with the consent line below. The applicant SHALL be able to untick any skill and tick any skill. Starting SHALL need at least one ticked skill.

#### Scenario: Demo résumé
- **WHEN** Ada Moreno's demo résumé is attached for the education platform engineer role
- **THEN** SQL, TypeScript and Linux are ticked and on the résumé, and Python is unticked and not on the résumé

#### Scenario: Nothing ticked
- **WHEN** the applicant unticks every skill
- **THEN** Start is disabled

#### Scenario: Claims sent with the session
- **WHEN** the applicant starts with SQL and TypeScript ticked, SQL, TypeScript and Linux on the résumé
- **THEN** the start request carries `onResume` SQL, TypeScript, Linux and `confirmed` SQL, TypeScript

### Requirement: A demo résumé ships with the demo
The demo SHALL include a fictional résumé, Ada Moreno, as a PDF with text, claiming SQL, TypeScript and Linux and not Python, and `/apply` SHALL link to it.

#### Scenario: Demo résumé reads as written
- **WHEN** the demo PDF's text is extracted and matched against the first pack's skills
- **THEN** SQL, TypeScript and Linux match and Python does not
