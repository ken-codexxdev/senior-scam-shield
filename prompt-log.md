# Prompt Log — Senior Scam Shield

**Sector:** Digital Technology & AI  
**Project:** Scam Shield — a single-page educational guide for Filipino senior citizens on recognizing common local scam patterns.  
**Techniques exercised:** Zero-shot, structured anatomy, few-shot, role assignment, structured analysis and refinement.

---

## Task 1 — Sector Selection

**Sector:** Digital Technology & AI.  
**Local challenge:** Older Filipinos in Metro Manila face rising smishing, fake government-app downloads, and GCash/Maya impersonation. CICC recorded 282 senior scam victims in NCR and Region IV-A; seniors are targeted because of “low digital literacy” and difficulty updating scam knowledge[reference:6][reference:7]. A 2025 case involved a senior losing nearly ₱1 million to a fake SSS app link delivered by a caller[reference:8].  
**Target users:** Senior citizens (60+) and their adult children/caregivers.  
**Features:** (1) “Spot the Scam” interactive quiz with four locally patterned educational samples; (2) “Before You Click” persistent checklist; (3) “What To Do” reporting guide including CICC 1326.

---

## Task 2 — Zero-Shot

**Objective:** Establish a baseline output from a minimal prompt.  
**Exact Prompt:**  
> Create a simple webpage that helps senior citizens avoid online scams.

**Actual Copilot Output:** Saved as `outputs/task2-zero-shot.html`. The output was a static HTML page with an `<h1>`, a short `<p>`, and a `<ul>` of five generic tips (“do not give your password,” “be careful of emails from unknown senders,” etc.). No JavaScript, no forms, no semantic landmarks beyond `<h1>`/`<ul>`, default 16px body text.  
**What Worked:** Valid, complete HTML generated immediately. Tips were factually reasonable.  
**What Needs Improvement:** No Philippine context (no GCash, SSS, DSWD, or 1326); no interactivity; no semantic structure; font too small for seniors; no accessibility baseline. The AI assumed a generic international audience and omitted every project-specific requirement.  
**Next Action / Verification:** Rewrite the prompt with Role—Task—Context—Constraints—Expected Output—Acceptance Criteria and compare.

---

## Task 3 — Structured Prompt (Anatomy)

**Objective:** Improve relevance by supplying explicit prompt components.  
**Exact Prompt:**  
> Act as a frontend developer who specializes in inclusive design for older adults. Create a responsive single-page “Scam Shield” guide for Filipino senior citizens in Metro Manila. Context: CICC data shows 282 seniors in NCR and Region IV-A were scammed online; common patterns include fake GCash refund SMS, fake SSS app download links sent by callers, and fake DSWD ayuda messages. The page must include: (a) an interactive “Spot the Scam” section with 4 clearly labeled educational sample messages drawn from these patterns — each sample has “Scam” and “Legit” buttons with immediate feedback; (b) a “Before You Click” checklist of 6 rules using native `<input type="checkbox">`, with state saved in `localStorage`; (c) a “What To Do” section with 4 numbered steps including reporting to 1326. Constraints: semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`), one external CSS file, one external JS file, no frameworks, no backend, no external APIs, no live warnings. All sample messages must be visually marked as “Educational Example Only.” Body font size at least 18px; all interactive targets at least 44px tall. Acceptance criteria: keyboard-only navigation reaches every interactive element with visible focus; checklist persists after page reload; page remains readable at 320px viewport width; every sample message includes a plain-language explanation of the red flags.

**Actual Copilot Output:** Saved as `outputs/task3-structured/` (`index.html`, `style.css`, `script.js`). Generated a three-section page with semantic landmarks, four quiz `<article>` cards, a `<fieldset>` checklist with `<label>` elements, and a `localStorage`-backed persistence script.  
**What Worked:** Constraints were largely respected. Local relevance improved dramatically. The checklist persisted across reloads in testing. Font size and touch-target minimums were applied.  
**What Needs Improvement:** Two accessibility gaps remained — quiz feedback lacked `aria-live` semantics, and two checklist labels lacked explicit `for`/`id` pairing. These became targets for Tasks 4B and 5.  
**Next Action / Verification:** Run few-shot and role-assignment experiments on the same codebase.

---

## Task 4A — Few-Shot Prompting

**Objective:** Standardize quiz-sample content format.  
**Exact Prompt:**  
> I am building the “Spot the Scam” quiz for the Scam Shield page. Use this exact format for each sample:  
> **Example 1:** Pattern: Fake GCash refund SMS. Red Flags: (1) Unsolicited link, (2) “Expires bukas” urgency, (3) Sender is not the official GCash shortcode. Explanation: GCash and banks will never ask you to click a link to “claim” a refund. Open the GCash app directly if you want to check your account.  
> **Example 2:** Pattern: Fake SSS app download link. Red Flags: (1) Caller pressures you to install an app during the call, (2) Link does not go to Google Play or Apple App Store, (3) Caller asks you to stay on the line while installing. Explanation: Government agencies do not call and ask you to install apps through links. Download official apps only from the official store.  
> Generate two additional educational samples in the same format. One should model a fake DSWD ayuda SMS; the other should model a fake “failed delivery” parcel SMS. Render all four samples in the quiz using the same HTML card structure already in `index.html`.

**Actual Copilot Output:** Saved as `outputs/task4-few-shot-samples.md` and applied to `index.html`. Copilot produced a fake-DSWD sample and a fake-parcel sample, each with three red flags and a plain-language explanation matching the demonstrated format.  
**What Worked:** Content structure became consistent across all four samples. Every sample had the same depth of red flags and explanation.  
**What Needs Improvement:** Copilot did not independently verify local domain details; I inspected the generated red flags for plausibility and removed one fabricated agency URL suggestion. Few-shot improves consistency but does not guarantee factual accuracy.  
**Next Action / Verification:** Inspect all four rendered cards for structural uniformity; confirm that each includes a visible “Educational Example Only” label.

---

## Task 4B — Role Assignment

**Objective:** Surface accessibility concerns from a specialized perspective.  
**Exact Prompt:**  
> Act as a frontend accessibility reviewer with experience auditing interfaces for older adults and screen-reader users. Examine the Scam Shield page (`index.html`, `style.css`, `script.js`). Identify problems in four areas: (1) HTML semantics and landmark structure, (2) keyboard access and focus management, (3) form control labeling and grouping, and (4) visual clarity for low-vision seniors. Recommend targeted improvements that do not change the project scope or add frameworks. For each problem, state the location in the code and the smallest practical correction.

**Actual Copilot Response:** Saved as `outputs/task4-role-accessibility-review.md`. Copilot identified: (1) quiz feedback lacks `aria-live`/`role="status"`; (2) two checklist labels lack explicit `for`/`id`; (3) focus is not moved to or associated with feedback after quiz interaction; (4) quiz button states rely on red/green color alone; (5) footer disclaimer text is too small and low-contrast for low-vision users.  
**What Worked:** The role changed the kind of concern Copilot prioritized. Generic “review my code” prompts focused on whether features worked; the accessibility-reviewer role surfaced live-region semantics, label pairing, focus transfer, and non-color-dependent feedback.  
**What Needs Improvement:** Recommendations are plausible but not proof. Each must be verified against the actual code and tested with real assistive technology.  
**Next Action / Verification:** Select one high-impact issue and test it with a screen reader before and after correction (Task 5).

---

## Task 5 — Structured Analysis and Refinement

**Objective:** Diagnose a specific weakness, apply the smallest correction, and verify with a concrete test.  
**Exact Prompt:**  
> Review the current Scam Shield code against the original requirements. Focus on the “Spot the Scam” quiz. Check: (1) whether feedback is reliably announced after a user selects Scam or Legit, (2) whether the checklist checkbox-label association is programmatically sound, and (3) whether any interactive control becomes unreachable or ambiguous on a 320px-wide screen. Identify the two most important implementation issues based on the actual code. For each, recommend the smallest correction. Explain exactly how I can test whether the correction works — name the tool (browser, screen reader, keyboard shortcut) and the expected result.

**Actual Copilot Recommendations:** Saved as `outputs/task5-analysis.md`.  
**Issue 1 (selected for correction):** Quiz feedback not exposed to assistive technology. Location: `.feedback` elements. Correction: add `role="status" aria-live="polite"`.  
**Issue 2 (not applied in this milestone):** Two checklist labels lack explicit `for`/`id` pairing. Correction: add matching `id` and `for` attributes.  
**Correction applied:** Added `role="status" aria-live="polite"` to all four `.feedback` elements in `index.html`. No other logic was changed.  
**Verification:**  
- **Tool:** Chrome 131 + NVDA 2024.4 (Windows 11).  
- **Procedure:** Loaded page, Tab to first “Scam” button, pressed Enter.  
- **Before correction:** NVDA did not announce feedback; the visual feedback appeared but was silent to the screen reader.  
- **After correction:** NVDA announced the feedback text (“Correct/Not quite… This is a scam”) within ~0.8 seconds.  
- **Secondary check:** Mouse click still produced visual feedback; no regression.  
**What Worked:** Copilot correctly identified the missing live-region semantics as the highest-impact accessibility issue in the quiz. The recommendation was specific and testable.  
**What Needs Improvement:** The AI’s diagnosis alone did not prove the problem existed; only the before-and-after NVDA test confirmed both the problem and the fix. AI recommendations are hypotheses, not evidence.  
**Next Action / Verification:** Retain the correction in the final prototype. The label-pairing issue remains a candidate for future refinement.

---

## Task 6 — Final Comparison and Reflection

### Comparison Table

| Technique | Observation |
|---|---|
| **Zero-Shot** | Assumed a generic international audience; omitted every local constraint, all interactivity, semantic landmarks, and accessibility requirements. |
| **Structured Prompt** | Role, Task, Context, Constraints, Expected Output, and Acceptance Criteria forced local relevance, semantic structure, interactive features, and minimum size/focus requirements. |
| **Few-Shot** | Demonstrated sample format standardized all four quiz items. Without examples, sample depth varied unpredictably. |
| **Role Assignment** | Accessibility-reviewer role surfaced `aria-live`, explicit label pairing, focus transfer, and non-color-dependent feedback — issues invisible to the developer role. |
| **Structured Analysis** | Identified the missing live-region as a concrete issue. Before-and-after NVDA testing confirmed that the AI diagnosis was correct and the fix worked. Demonstrated that AI recommendations require independent verification. |

### Reflection

Structured prompting produced the most useful initial implementation because it converted vague intent into enforceable requirements. Few-shot prompting was most effective for content consistency; role assignment was most effective for surfacing non-obvious quality dimensions. The structured-analysis milestone reinforced the laboratory’s central lesson: **AI-generated recommendations are hypotheses, not evidence**. Copilot correctly diagnosed the live-region gap, but only the NVDA test before and after the correction established that the problem was real and the fix resolved it. For a senior-facing educational tool, an interface that visually “works” but silently fails for screen-reader users would exclude a meaningful portion of the target audience; verification is therefore part of the development, not an optional extra step.