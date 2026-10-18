# Task 5 — Structured Reasoning and Refinement

**Technique:** Structured analysis (technical diagnosis + targeted correction + verification procedure).

**Objective:** Identify a specific implementation weakness, apply the smallest correction, and verify with a concrete test.

---

## Exact Prompt Submitted

> Review the current Scam Shield code against the original requirements. Focus on the “Spot the Scam” quiz. Check: (1) whether feedback is reliably announced after a user selects Scam or Legit, (2) whether the checklist checkbox-label association is programmatically sound, and (3) whether any interactive control becomes unreachable or ambiguous on a 320px-wide screen. Identify the **two most important** implementation issues based on the actual code. For each, recommend the smallest correction. Explain exactly how I can test whether the correction works — name the tool (browser, screen reader, keyboard shortcut) and the expected result.

---

## Actual Copilot Recommendations

### Issue 1 (selected for correction) — Quiz feedback not exposed to assistive technology

**Location:** `index.html`, all four `<p class="feedback">` elements; `script.js`, inside the `handleQuizAnswer` function.

**Diagnosis:** The feedback `<p>` elements exist in HTML but have no `role="status"` and no `aria-live` attribute. When JavaScript updates their `textContent`, the change is not announced to screen readers. A screen-reader user can complete the quiz but never learns whether they answered correctly.

**Smallest correction:** Add `role="status" aria-live="polite"` to each of the four `.feedback` elements in `index.html`. Do not change the JavaScript logic — `textContent` updates are compatible with live regions as-is.

**How to test:**
1. Open `index.html` in Chrome.
2. Start NVDA (Windows) or VoiceOver (macOS).
3. Press `Tab` until focus reaches the first "Scam" button.
4. Press `Enter`.
5. **Expected result (after correction):** NVDA/VoiceOver announces the feedback text within approximately one second.
6. **Expected result (before correction):** Screen reader remains silent.

### Issue 2 (not applied in this milestone) — Checklist labels lack explicit `for`/`id` pairing

**Location:** `index.html`, checklist items 3 and 5.

**Diagnosis:** The `<input type="checkbox">` elements lack `id` attributes, and their sibling `<label>` elements lack `for` attributes. Although visually adjacent, the label text is not programmatically associated with the checkbox. Screen readers may announce the checkbox with no accessible name. Secondary effect: `script.js` cannot persist checkboxes without `id`, so items 3 and 5 silently fail to save across reloads.

**Smallest correction:** Add `id="check-3"` to the third checkbox and `for="check-3"` to its label; repeat with `check-5` for item 5.

**How to test:**
1. Open `index.html` in Chrome with a screen reader active.
2. Navigate to each checkbox using the virtual cursor (NVDA: `H` for form field, or `Tab` for focus).
3. **Expected result (after correction):** The screen reader announces the label text as the accessible name of the checkbox.
4. **Before correction:** The checkbox may be announced as "checkbox" with no name.

### Issue 3 (checked, no correction needed) — 320px-wide screen reachability

**Finding:** All interactive controls remain reachable at 320px. `.quiz-btn` switches to `flex-basis: 100%` under the `@media (max-width: 420px)` rule, and `.button-group` stacks vertically. No control becomes unreachable or ambiguous.

---

## Selected Correction Applied

I applied **Issue 1** because:
- It affects the **core learning interaction** (the quiz) for screen-reader users.
- It has a **smaller, lower-risk** implementation (two attributes × four elements).
- It has a **clearer verification path** — one screen-reader test before and after.

I did **not** apply Issue 2 in this milestone, because Issue 1 has a clearer verification path and greater impact on the primary quiz feature. Issue 2 remains a candidate for future refinement and is documented for that purpose.

**Change made:** Added `role="status" aria-live="polite"` to all four `<p class="feedback">` elements in `index.html`. No JavaScript changes. No CSS changes.

---

## Verification Performed

**Tool:** Chrome 131 + NVDA 2024.4 on Windows 11.

**Procedure:**
1. Loaded `index.html`.
2. Pressed `Tab` until focus reached the first "Scam" button.
3. Pressed `Enter`.
4. Listened for NVDA announcement.

**Before correction:**
- NVDA did not announce the feedback. The feedback text visually appeared below the button, but was silent to the screen reader.
- Confirmed problem: the core quiz interaction provides no feedback to screen-reader users.

**After correction:**
- NVDA announced: *"Incorrect — this is a scam. Fake GCash refund SMS. GCash will never ask you to click a link to claim a refund. Open the app directly."*
- Announcement occurred within approximately 0.8 seconds.
- Matches expected behavior.

**Secondary check:**
- Mouse click on a quiz button still produces visual feedback. No regression observed.
- The feedback text remains visible in the DOM and readable by sighted users.

---

## What Worked

- Copilot correctly identified the missing live-region semantics as the highest-impact accessibility issue in the quiz.
- The recommendation was specific and testable, with a named tool and a before/after procedure.
- The correction was the smallest possible change — two attributes per element, no logic changes.

## What Needs Improvement

- The AI's diagnosis alone did not prove the problem existed. Only the NVDA test before and after the correction confirmed both the problem and the fix. This is a key lesson: **AI recommendations are hypotheses, not evidence.**
- The second issue (label pairing) was also plausible but I did not apply it in this milestone because Issue 1 had a clearer verification path and greater impact. AI is good at surfacing candidate issues; prioritization remains a human decision.
- The secondary effect of Issue 2 (persistence failure for checkboxes without `id`) was not explicitly flagged by Copilot in this analysis prompt — it was raised earlier in Task 4B after I traced the interaction between `index.html` and `script.js`. This suggests structured-analysis prompts should explicitly ask the AI to check cross-file interactions.

## Next Action / Verification

- Retain the `role="status" aria-live="polite"` correction in the final prototype (root-level `index.html`).
- Issue 2 (label pairing + checkbox persistence) remains a future refinement. Its verification path is already documented above.
- Consider adding a check to `script.js` that warns in the console if a checkbox lacks an `id` — a defensive-programming safeguard against this class of bug in future iterations.