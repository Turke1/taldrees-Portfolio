(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Scroll reveals ── */
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ── Animated counter ── */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;

    var current = 0;
    var duration = 1500;
    var step = Math.max(1, Math.floor(target / 60));
    var startTime = null;

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = timestamp - startTime;
      var increment = Math.min(current + step, target);
      current = increment;

      if (target <= 100) {
        el.textContent = current;
      } else {
        el.textContent = current >= 100 ? (current / 10).toFixed(target === 2030 ? 0 : 1) : current;
      }

      if (current < target && progress < duration) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }

  var countEls = document.querySelectorAll("[data-count]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var countIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            countIo.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    countEls.forEach(function (el) { countIo.observe(el); });
  } else {
    countEls.forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  }

  /* ── Timeline progress bar ── */
  var timelineBar = document.querySelector(".timeline-progress");
  if (timelineBar && "IntersectionObserver" in window && !reduceMotion) {
    var timelineObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var timeline = entry.target.closest(".timeline");
            if (timeline) {
              var cards = timeline.querySelectorAll(".project-card");
              if (cards.length > 0) {
                var lastCard = cards[cards.length - 1];
                var totalHeight = lastCard.offsetTop + lastCard.offsetHeight;
                timelineBar.style.height = totalHeight + "px";
              }
            }
            timelineObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    timelineObs.observe(timelineBar);
  }

  /* ── Project expand/collapse ── */
  var expandBtns = document.querySelectorAll(".project-expand");
  expandBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-target");
      var detail = document.getElementById(targetId);
      if (!detail) return;

      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !expanded);
      detail.hidden = expanded;
      btn.querySelector("span").textContent = expanded ? "عرض التفاصيل" : "إخفاء التفاصيل";
    });
  });

  /* ── Footer year ── */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
