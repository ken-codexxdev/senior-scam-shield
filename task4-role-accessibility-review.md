# Task 4B — Role Assignment: Accessibility Review

**Technique:** Role assignment (specialized perspective: frontend accessibility reviewer).

**Objective:** Surface accessibility problems that a generic developer prompt would not prioritize, specifically for older adults and screen-reader users.

---

## Exact Prompt Submitted

> Act as a frontend accessibility reviewer with experience auditing interfaces for older adults and screen-reader users. Examine the Scam Shield page (`index.html`, `style.css`, `script.js`). Identify problems in four areas: (1) HTML semantics and landmark structure, (2) keyboard access and focus management, (3) form control labeling and grouping, and (4) visual clarity for low-vision seniors. Recommend targeted improvements that do not change the project scope or add frameworks. For each problem, state the location in the code and the smallest practical correction.

---

## Actual Copilot Response

### Area 1 — HTML semantics and landmark structure

**Finding:** Landmark structure is generally correct. `<header>`, `<main>`, three `<section aria-labelledby>`, and `<footer>` are present and correctly labelled.

**Minor note:** The quiz uses `<article class="quiz-card">` for each sample, which is semantically defensible but could be `<div>` if the content is not independently distributable. **Recommendation:** keep `<article>` — it does no harm and provides sectioning.

### Area 2 — Keyboard access and focus management

**Finding:** All buttons are native `<button>` elements and are keyboard-reachable with a visible focus ring (`:focus-visible` in `style.css`).

**Issue:** After a quiz button is clicked, focus remains on the button. The newly displayed feedback paragraph appears *below* the button, but nothing programmatically associates the button with the feedback. A screen-reader user has no indication that new content appeared.

**Correction:** Add `aria-describedby` on each `.quiz-btn` pointing to the feedback paragraph's `id`, and give each `.feedback` paragraph a stable `id`.

### Area 3 — Form control labeling and grouping

**Finding:** The checklist uses `<fieldset>` and `<legend>`, which is correct grouping.

**Issue:** Two checklist items (item 3 — OTP/PIN and item 5 — download sources) have `<input type="checkbox">` elements with **no `id`**, and their `<label>` elements have **no `for` attribute**. Because the label text is not programmatically associated with the checkbox, screen readers may announce the checkbox with no accessible name.

**Correction:** Add unique `id` values to each checkbox and matching `for` values to each label.

**Secondary issue:** The JS persistence code silently skips checkboxes without an `id`, so items 3 and 5 will not persist their state across reloads.

### Area 4 — Visual clarity for low-vision seniors

**Finding:** Base font size is 18px, interactive targets are ≥48px tall — both satisfy the original acceptance criteria.

**Issue:** The quiz button correct/incorrect states rely on red (`--danger: #922b21`) vs. green (`--success: #1e6b3a`) as the sole carrier of meaning. Users with red-green color blindness (a meaningful portion of older adults) cannot distinguish correct from incorrect by color alone.

**Correction:** The feedback paragraph text ("Correct. This is a scam." / "Not quite. This is a scam.") already conveys the answer in text — this is good. Ensure the text remains visible even if the button colors are removed in a high-contrast or grayscale view.

**Minor issue:** The footer disclaimer text is 0.95rem (~17px) with reduced contrast on `#2c3e50` background. **Recommendation:** increase to 1rem and confirm contrast meets WCAG AA for normal text (4.5:1).

### Area 5 — Live region semantics (highest priority)

**Finding:** The `.feedback` paragraphs have no `role="status"` and no `aria-live` attribute. When JavaScript updates their `textContent`, screen readers are not notified. This means the core learning interaction — receiving feedback on each quiz item — is **silent** to screen-reader users.

**Correction:** Add `role="status" aria-live="polite"` to each `.feedback` element in `index.html`.

---

## What Worked

- The accessibility-reviewer role changed the *kind* of concern Copilot prioritized. Earlier "review my code" prompts focused on whether features worked and whether CSS was organized. This role redirected attention to `aria-live`, label pairing, focus transfer, and non-color-dependent feedback — issues that directly affect the senior audience.
- The recommendations were concrete and referenced specific locations in the code.

## What Needs Improvement

- Copilot's recommendations are **plausible but not proof**. Each claim about what a screen reader will do must be tested with an actual screen reader (NVDA, VoiceOver, TalkBack) against the actual code.
- The review did not flag the JS persistence gap for checkboxes without `id` until I connected it to the HTML issue — a human reviewer would need to trace the interplay between `index.html` and `script.js`.

## Next Action / Verification

- Prioritize the live-region issue (Area 5) for Task 5 structured analysis, because it affects the core learning interaction and has a small, testable correction.
- Defer the label-pairing issue (Area 3) as a future refinement — it is also valid but has lower impact on the primary quiz feature.
- Verify the fix with NVDA before-and-after to establish that the AI's diagnosis was correct.