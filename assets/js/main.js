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

    var duration = 1500;
    var startTime = null;

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current;
      if (progress < 1) {
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
            var el = entry.target;
            if (el.classList.contains("dash-value") || el.classList.contains("stat-num")) {
              animateCounter(el);
            }
            countIo.unobserve(el);
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

  /* ── Milestone horizontal scroll snap ── */
  var track = document.querySelector(".milestones-track");
  if (track) {
    var cards = track.querySelectorAll(".milestone");
    if (cards.length > 0 && "IntersectionObserver" in window && !reduceMotion) {
      var mileObs = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              mileObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      cards.forEach(function (c) { mileObs.observe(c); });
    }
  }

  /* ── Nav active section highlight ── */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");
  if (sections.length > 0 && navLinks.length > 0 && "IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            navLinks.forEach(function (link) {
              link.style.color = link.getAttribute("href") === "#" + id
                ? "var(--gold)"
                : "";
              link.style.background = link.getAttribute("href") === "#" + id
                ? "rgba(240, 165, 0, 0.08)"
                : "";
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ── Hero particles parallax ── */
  var particles = document.querySelectorAll(".particle");
  if (particles.length > 0 && !reduceMotion) {
    document.addEventListener("mousemove", function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 20;
      var y = (e.clientY / window.innerHeight - 0.5) * 20;
      particles.forEach(function (p, i) {
        var factor = (i + 1) * 0.3;
        p.style.transform = "translate(" + (x * factor) + "px, " + (y * factor) + "px)";
      });
    });
  }

  /* ── Footer year ── */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
