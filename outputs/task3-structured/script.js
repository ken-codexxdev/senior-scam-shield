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
      });
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
      // Checkboxes without an id (items 3 and 5 in task3 version) cannot be
      // persisted — this is one of the accessibility issues identified in Task 4B.
      if (cb.id) {
        cb.checked = saved.indexOf(cb.id) !== -1;
      }
    });
    updateProgress();
  }

  function saveChecklist() {
    var checkedIds = [];
    checkboxes.forEach(function (cb) {
      if (cb.checked && cb.id) checkedIds.push(cb.id);
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