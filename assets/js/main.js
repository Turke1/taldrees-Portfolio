/* تركي الدريس — ملف أعمال
   No dependencies. Everything degrades gracefully without JS. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* ── Scroll reveals ──
     The observer is the nice path. Everything below it is insurance: a
     `.reveal` that never gets `.in-view` stays at opacity 0 forever, so a
     silent IntersectionObserver would blank the whole page. Never allow that. */
  var revealEls = document.querySelectorAll(".reveal");

  var revealAll = function () {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  };

  if (reduceMotion || !hasIO) {
    revealAll();
  } else {
    var revealObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          revealObs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) { revealObs.observe(el); });

    /* Sweep anything already in view that the observer hasn't reported. */
    var sweep = function () {
      var limit = window.innerHeight * 1.1;
      revealEls.forEach(function (el) {
        if (el.classList.contains("in-view")) return;
        if (el.getBoundingClientRect().top < limit) el.classList.add("in-view");
      });
    };

    window.addEventListener("load", function () { setTimeout(sweep, 200); });

    /* Capture phase, on document — not `window`, and not bubble phase. Scroll
       events from an inner scrolling container do not reach a window-level
       listener, and embedded viewers (preview panes, iframes, side panels)
       scroll exactly that way. With a window-only listener everything below
       the fold stays at opacity 0 forever, because the 2.5s catch-all won't
       fire either: the hero *did* reveal, so "nothing revealed" is false. */
    document.addEventListener("scroll", sweep, { passive: true, capture: true });
    window.addEventListener("resize", sweep, { passive: true });

    /* Last resort: if nothing at all has revealed, the observer is dead. */
    setTimeout(function () {
      if (!document.querySelector(".reveal.in-view")) revealAll();
    }, 2500);
  }

  /* ── Nav hairline once the page scrolls ── */
  var nav = document.querySelector(".nav");
  if (nav) {
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;height:1px;width:1px;";
    document.body.prepend(sentinel);

    if (hasIO) {
      new IntersectionObserver(
        function (entries) {
          nav.classList.toggle("is-stuck", !entries[0].isIntersecting);
        },
        { threshold: 0 }
      ).observe(sentinel);
    }
  }

  /* ── Active nav link ── */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");

  if (sections.length && navLinks.length && hasIO) {
    var setActive = function (id) {
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
      });
    };

    var navObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ── Footer year ── */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
