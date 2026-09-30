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

/* ═══════════════════════════════════════════════════════════════
   Language toggle — ar ⇄ en

   Every translatable element carries data-en with its English *innerHTML*.
   The Arabic original is cached in memory rather than in a second attribute:
   the Arabic markup contains <bdi> wrappers that keep Latin names and digits
   from breaking the bidi run, and swapping textContent would destroy them.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var btn = document.getElementById("langToggle");
  if (!btn) return;

  var nodes = document.querySelectorAll("[data-en]");
  if (!nodes.length) return;

  var arabic = new Map();
  nodes.forEach(function (el) { arabic.set(el, el.innerHTML); });

  var STORE_KEY = "taldrees-lang";

  var META = {
    ar: {
      title: "تركي الدريس — مدير عمليات وفعاليات | الرياض",
      desc: "تركي فهد الدريس — مدير عمليات ومشاريع في قطاع الفعاليات السعودي. خبرة في موسم الرياض ومهرجان البحر الأحمر السينمائي الدولي وشعلة دورة الألعاب السعودية وموسم عسير ونادي الصقور السعودي.",
      face: "EN",
      label: "Switch to English"
    },
    en: {
      title: "Turki Al-Dress — Operations & Events Manager | Riyadh",
      desc: "Turki Fahad Al-Dress — operations and project manager in the Saudi events sector. Riyadh Season HQ, Red Sea International Film Festival, Saudi Games Torch, Aseer Season and Saudi Falcon Club.",
      face: "ع",
      label: "التبديل إلى العربية"
    }
  };

  /* aria-labels live in attributes, not text nodes, so they need their own map */
  var ARIA = {
    ".brand": { ar: "تركي الدريس — أعلى الصفحة", en: "Turki Al-Dress — back to top" },
    ".nav-links": { ar: "التنقل الرئيسي", en: "Main navigation" },
    ".badge": { ar: "بطاقة تعريف — قطاع الفعاليات", en: "Identity card — events sector" },
    ".stats": { ar: "أرقام سريعة", en: "Key figures" }
  };

  function stampYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  function apply(lang) {
    var toEn = lang === "en";
    var root = document.documentElement;

    root.lang = toEn ? "en" : "ar";
    root.dir = toEn ? "ltr" : "rtl";

    nodes.forEach(function (el) {
      el.innerHTML = toEn ? el.getAttribute("data-en") : arabic.get(el);
    });

    Object.keys(ARIA).forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.setAttribute("aria-label", ARIA[sel][lang]);
    });

    /* copy buttons keep their label in an attribute, not a text node */
    document.querySelectorAll(".c-copy[data-en-label]").forEach(function (b) {
      if (!b.dataset.arLabel) b.dataset.arLabel = b.getAttribute("aria-label");
      b.setAttribute("aria-label", toEn ? b.getAttribute("data-en-label") : b.dataset.arLabel);
    });

    var meta = META[lang];
    document.title = meta.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", meta.desc);

    var face = btn.querySelector(".lang-toggle-face");
    if (face) face.textContent = meta.face;
    btn.setAttribute("aria-label", meta.label);

    /* the footer year sits inside swapped markup, so re-stamp it */
    stampYear();

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* private mode */ }
  }

  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* private mode */ }
  if (saved === "en") apply("en");

  btn.addEventListener("click", function () {
    apply(document.documentElement.lang === "en" ? "ar" : "en");
  });
})();

/* ═══════════════════════════════════════════════════════════════
   Career reel — one role at a time, arrows either side.

   The active slide is derived from scroll position rather than tracked in a
   variable, so a swipe, a keypress and an arrow click all converge on the
   same source of truth and cannot drift apart.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var reel = document.querySelector(".reel");
  if (!reel) return;

  var track = reel.querySelector(".reel-track");
  var slides = Array.prototype.slice.call(reel.querySelectorAll(".reel-slide"));
  var prev = reel.querySelector(".reel-prev");
  var next = reel.querySelector(".reel-next");
  var dotsBox = reel.querySelector(".reel-dots");
  var atLabel = reel.querySelector(".reel-at");
  if (!track || !slides.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var index = 0;

  /* build the dots from the slides themselves, so the two can never disagree */
  var dots = slides.map(function (slide, i) {
    var d = document.createElement("button");
    d.type = "button";
    d.className = "reel-dot";
    d.setAttribute("aria-label", String(i + 1));
    d.addEventListener("click", function () { goTo(i); });
    dotsBox.appendChild(d);
    return d;
  });

  function nearestIndex() {
    /* compare centres: works in both writing directions without caring
       whether scrollLeft counts up or down */
    var mid = track.scrollLeft + track.clientWidth / 2;
    var best = 0, bestDist = Infinity;
    slides.forEach(function (s, i) {
      var c = s.offsetLeft + s.offsetWidth / 2;
      var d = Math.abs(c - mid);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  function paint(i) {
    index = i;
    slides.forEach(function (s, n) { s.classList.toggle("is-active", n === i); });
    dots.forEach(function (d, n) {
      d.classList.toggle("is-on", n === i);
      d.setAttribute("aria-current", n === i ? "true" : "false");
    });
    if (atLabel) atLabel.textContent = String(i + 1);
    prev.disabled = i === 0;
    next.disabled = i === slides.length - 1;
  }

  function goTo(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides[i].scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
    paint(i);
  }

  prev.addEventListener("click", function () { goTo(index - 1); });
  next.addEventListener("click", function () { goTo(index + 1); });

  /* keep state honest when the user swipes or flicks the track */
  var settle = null;
  track.addEventListener("scroll", function () {
    clearTimeout(settle);
    settle = setTimeout(function () { paint(nearestIndex()); }, 90);
  }, { passive: true });

  reel.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    /* in RTL the left arrow key moves forward, not back */
    var rtl = document.documentElement.dir === "rtl";
    var forward = rtl ? e.key === "ArrowLeft" : e.key === "ArrowRight";
    e.preventDefault();
    goTo(index + (forward ? 1 : -1));
  });

  /* ── the disclosure on each card ── */
  reel.querySelectorAll(".chapter-open").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      panel.hidden = open;
    });
  });

  paint(0);

  /* Open on the current role — it is what a recruiter is looking for.

     Deliberately NOT scrollIntoView here: on load the career section is far
     below the fold, and `block: "nearest"` would happily scroll the *page*
     down to it, hijacking where the visitor lands. Nudging the container's
     own scrollLeft by a measured delta moves the reel and nothing else, and
     because the delta comes from live rects it is correct whether the
     document runs right-to-left or left-to-right. */
  var current = slides.findIndex(function (s) { return s.classList.contains("is-current"); });
  if (current > 0) {
    requestAnimationFrame(function () {
      var slide = slides[current];
      var delta = slide.getBoundingClientRect().left - track.getBoundingClientRect().left
                - (track.clientWidth - slide.offsetWidth) / 2;
      track.scrollLeft += delta;
      paint(current);
    });
  }
})();

/* ═══════════════════════════════════════════════════════════════
   Copy to clipboard — the fallback for mailto:/tel:

   Those schemes need an OS handler; without one the click silently does
   nothing. Rather than replace the links (they are correct, and work where a
   handler exists), every contact card gets a copy button beside them.
   ═══════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var buttons = document.querySelectorAll(".c-copy");
  if (!buttons.length) return;

  function legacyCopy(text) {
    /* navigator.clipboard needs a secure context; a page served over plain
       http:// on a LAN address does not get one. This still works there. */
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-1000px;left:0;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  buttons.forEach(function (btn) {
    var timer = null;

    btn.addEventListener("click", function (e) {
      /* the button sits inside the card; without this the card's own link
         would fire too and try to open a mail client behind the copy */
      e.preventDefault();
      e.stopPropagation();

      var text = btn.getAttribute("data-copy");
      if (!text) return;

      var settle = function (ok) {
        btn.classList.toggle("is-done", ok);
        btn.classList.toggle("is-failed", !ok);
        clearTimeout(timer);
        timer = setTimeout(function () {
          btn.classList.remove("is-done", "is-failed");
        }, 2000);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { settle(true); },
          function () { settle(legacyCopy(text)); }
        );
      } else {
        settle(legacyCopy(text));
      }
    });
  });
})();
