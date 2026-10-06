## MODIFIED Requirements

### Requirement: Rendering is isolated
The element SHALL render in a shadow root in The Gate's design language, including its challenge window, so the host page's styles do not change it and its styles do not leak out.

#### Scenario: Hostile host styles
- **WHEN** the host page sets global styles on `button` and `div`
- **THEN** neither the box nor the window changes

### Requirement: The three formats are playable
Inside the challenge window the element SHALL show the consent line before the first item, then render decide items as options to pick (also by keys A to D), rank items as a list to reorder (by drag and by keyboard), and write items as a text box limited to 280 characters with paste blocked.

#### Scenario: Rank by keyboard
- **WHEN** the candidate focuses a rank option and presses the move-up key
- **THEN** the option moves up one place

#### Scenario: Write limit
- **WHEN** the candidate types the 281st character
- **THEN** it is not inserted

### Requirement: The result is attached to the form
In embed mode, on finish, the element SHALL write the result token into a hidden input named `voit-result` inside the host form, close the window and tick the box. The candidate SHALL see nothing else in the form.

#### Scenario: Form submitted after finishing
- **WHEN** the candidate finishes and submits the host form
- **THEN** the submitted data includes `voit-result` with the token

#### Scenario: Box ticks
- **WHEN** the last item is answered
- **THEN** the window closes and the box shows its ticked state

## ADDED Requirements

### Requirement: It renders like a captcha
In embed mode the element SHALL render as a 304 × 78 box with a checkbox on the left and, on the right, the seal, the `voitProof` wordmark and the words "Privacy · Terms" (links once those pages exist), and no other text. It SHALL show three states: waiting, working (while the window is open or a request is in flight) and ticked. It SHALL make no request until the box is clicked.

#### Scenario: Waiting box
- **WHEN** the element connects in embed mode with a pack
- **THEN** it shows the empty checkbox and the voitProof mark, and makes no request

### Requirement: The challenge opens in a centred window
Clicking the box SHALL start the session and open a challenge window centred over the page, on a dimmed veil. The window SHALL show a blue band with the task, the work, and one button. Closing it (×, Escape or a click on the veil) SHALL keep the session's place; clicking the box SHALL reopen it there without starting a new session.

#### Scenario: Close and reopen
- **WHEN** the candidate closes the window on item 3 and clicks the box again
- **THEN** the window reopens on item 3, and no new session is started

### Requirement: Submit waits for the box
Until the box is ticked, the element SHALL disable the host form's submit buttons and cancel the form's submit events. On finish, or if the element is removed, it SHALL re-enable exactly the buttons it disabled.

#### Scenario: Form submitted before finishing
- **WHEN** the candidate presses Enter in a host field before finishing
- **THEN** the form is not submitted, `voit-result` is absent, and the submit button stays disabled

#### Scenario: Unblocked after finishing
- **WHEN** the candidate finishes
- **THEN** the host's submit button is enabled and the form submits normally

### Requirement: Practice renders inline
In practice mode the element SHALL render the challenge window inline on the page, with no box and no form gate, serving every unretired item in the pack with the reasons, as before.

#### Scenario: Practice page
- **WHEN** `/practice` loads
- **THEN** the window is shown inline with item 1 and the consent line, and no box is rendered
