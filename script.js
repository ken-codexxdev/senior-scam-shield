(function () {
  "use strict";

  // ---------- Quiz ----------
  var quizCards = document.querySelectorAll(".quiz-card");

  quizCards.forEach(function (card) {
    var buttons = card.querySelectorAll(".quiz-btn");
    var feedback = card.querySelector(".feedback");
    var explanation = card.querySelector(".explanation");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var chosen = btn.getAttribute("data-answer");
        var isScam = chosen === "scam";
        // Every sample in this educational set is a scam.
        var correct = isScam;

        // Reset visual states
        buttons.forEach(function (b) {
          b.classList.remove("correct", "incorrect");
        });

        btn.classList.add(correct ? "correct" : "incorrect");
        feedback.classList.remove("correct-text", "incorrect-text");
        feedback.classList.add(correct ? "correct-text" : "incorrect-text");

        if (correct) {
          feedback.textContent = "Correct. This is a scam.";
        } else {
          feedback.textContent = "Not quite. This is a scam.";
        }

        explanation.hidden = false;

        // Keep focus on the button but make the feedback discoverable.
        btn.setAttribute("aria-describedby", feedback.id || "");
      });
    });
  });

  // Give each feedback paragraph a stable id for aria-describedby (optional enhancement)
  document.querySelectorAll(".feedback").forEach(function (el, i) {
    if (!el.id) {
      el.id = "feedback-" + (i + 1);
    }
  });

  // Re-run the aria-describedby wiring now that IDs exist.
  quizCards.forEach(function (card) {
    var feedback = card.querySelector(".feedback");
    card.querySelectorAll(".quiz-btn").forEach(function (btn) {
      btn.setAttribute("aria-describedby", feedback.id);
    });
  });

  // ---------- Checklist persistence ----------
  var CHECKLIST_KEY = "scamShieldChecklist";
  var checkboxes = document.querySelectorAll('.checklist-group input[type="checkbox"]');
  var progressNote = document.getElementById("checklist-progress");

  function loadChecklist() {
    var saved;
    try {
      saved = JSON.parse(localStorage.getItem(CHECKLIST_KEY) || "[]");
    } catch (e) {
      saved = [];
    }
    if (!Array.isArray(saved)) saved = [];
    checkboxes.forEach(function (cb) {
      cb.checked = saved.indexOf(cb.id) !== -1;
    });
    updateProgress();
  }

  function saveChecklist() {
    var checkedIds = [];
    checkboxes.forEach(function (cb) {
      if (cb.checked) checkedIds.push(cb.id);
    });
    try {
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checkedIds));
    } catch (e) {
      // localStorage may be unavailable; checklist still works for the session.
    }
    updateProgress();
  }

  function updateProgress() {
    var total = checkboxes.length;
    var done = 0;
    checkboxes.forEach(function (cb) {
      if (cb.checked) done += 1;
    });
    if (progressNote) {
      progressNote.textContent = done + " of " + total + " safety checks completed.";
    }
  }

  checkboxes.forEach(function (cb) {
    cb.addEventListener("change", saveChecklist);
  });

  loadChecklist();
})();