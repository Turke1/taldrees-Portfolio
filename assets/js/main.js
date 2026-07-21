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

  /* ── Animated counters for progress bars ── */
  var deptBars = document.querySelectorAll(".dept-bar span");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var barObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var w = el.style.width;
            el.style.width = "0%";
            setTimeout(function () { el.style.width = w; }, 100);
            barObs.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );
    deptBars.forEach(function (b) { barObs.observe(b); });
  }

  /* ── Stage LED slides ── */
  var stageBtns = document.querySelectorAll(".stage-btn");
  var slides = document.querySelectorAll(".led-slide");

  stageBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var num = btn.getAttribute("data-slide");
      stageBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      slides.forEach(function (s) { s.classList.remove("active"); });
      var target = document.getElementById("slide-" + num);
      if (target) target.classList.add("active");
    });
  });

  /* ── Active nav tracking ── */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");
  if (sections.length > 0 && navLinks.length > 0 && "IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (link) {
              var match = link.getAttribute("href") === "#" + id;
              link.style.color = match ? "var(--gold)" : "";
              link.style.background = match ? "var(--gold-soft)" : "";
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ── Footer year ── */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
