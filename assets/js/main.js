(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Riyadh live clock ── */
  var clockEl = document.getElementById("riyadhClock");
  if (clockEl) {
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Riyadh",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch (e) {
      fmt = null;
    }
    var tick = function () {
      clockEl.textContent = fmt ? fmt.format(new Date()) : new Date().toLocaleTimeString();
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ── Scroll progress (run of show) ── */
  var progressBar = document.getElementById("progressBar");
  if (progressBar) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var p = max > 0 ? window.scrollY / max : 0;
        progressBar.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ── Count-up numbers ── */
  var counters = document.querySelectorAll("[data-count]");
  var runCounter = function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) {
      el.textContent = target.toLocaleString("en-US");
      return;
    }
    var dur = 1400;
    var start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var t = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    var cObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            cObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { cObs.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ── Animated bars ── */
  var bars = document.querySelectorAll("[data-width]");
  var fillBar = function (el) {
    el.style.width = el.getAttribute("data-width") + "%";
  };
  if (!reduceMotion && "IntersectionObserver" in window) {
    var bObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fillBar(entry.target);
            bObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    bars.forEach(function (el) { bObs.observe(el); });
  } else {
    bars.forEach(fillBar);
  }

  /* ── Interactive checklist ── */
  var todoList = document.getElementById("todoList");
  var todoDoneEl = document.getElementById("todoDone");
  var todoBarEl = document.getElementById("todoBar");
  var STORE_KEY = "taldrees-todo-v1";

  var todos = todoList ? Array.prototype.slice.call(todoList.querySelectorAll(".todo")) : [];

  var syncTodo = function () {
    var done = todos.filter(function (t) { return t.getAttribute("aria-pressed") === "true"; }).length;
    if (todoDoneEl) todoDoneEl.textContent = done;
    if (todoBarEl) todoBarEl.style.width = Math.round((done / todos.length) * 100) + "%";
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify(todos.map(function (t) { return t.getAttribute("aria-pressed") === "true"; }))
      );
    } catch (e) { /* storage unavailable */ }
  };

  if (todos.length) {
    try {
      var saved = JSON.parse(localStorage.getItem(STORE_KEY));
      if (Array.isArray(saved) && saved.length === todos.length) {
        todos.forEach(function (t, i) {
          t.setAttribute("aria-pressed", saved[i] ? "true" : "false");
          t.setAttribute("data-done", saved[i] ? "true" : "false");
        });
      }
    } catch (e) { /* storage unavailable */ }

    todos.forEach(function (t) {
      t.addEventListener("click", function () {
        var on = t.getAttribute("aria-pressed") === "true";
        t.setAttribute("aria-pressed", on ? "false" : "true");
        t.setAttribute("data-done", on ? "false" : "true");
        syncTodo();
      });
    });
    syncTodo();
  }

  /* ── Cue sheet — project slider ── */
  var cueBtns = Array.prototype.slice.call(document.querySelectorAll(".cue"));
  var slides = Array.prototype.slice.call(document.querySelectorAll(".led-slide"));
  var prevBtn = document.getElementById("cuePrev");
  var nextBtn = document.getElementById("cueNext");
  var cueWrap = document.querySelector(".cue-sheet");
  var stageWrap = document.querySelector(".stage-wrap");
  var CUE_MS = 6000;
  var current = 0;
  var timer = null;

  var goCue = function (idx, user) {
    if (!cueBtns.length) return;
    current = (idx + cueBtns.length) % cueBtns.length;
    cueBtns.forEach(function (b, i) {
      b.classList.remove("is-on");
      b.setAttribute("aria-selected", i === current ? "true" : "false");
    });
    slides.forEach(function (s, i) { s.classList.toggle("is-on", i === current); });

    var active = cueBtns[current];
    active.style.setProperty("--cue-dur", CUE_MS + "ms");
    void active.offsetWidth; /* restart progress animation */
    active.classList.add("is-on");

    if (user) restartAuto();
  };

  var restartAuto = function () {
    stopAuto();
    if (reduceMotion) return;
    timer = setInterval(function () { goCue(current + 1); }, CUE_MS);
  };
  var stopAuto = function () {
    if (timer) { clearInterval(timer); timer = null; }
  };

  cueBtns.forEach(function (btn, i) {
    btn.addEventListener("click", function () { goCue(i, true); });
  });
  if (prevBtn) prevBtn.addEventListener("click", function () { goCue(current - 1, true); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goCue(current + 1, true); });

  if (cueBtns.length) {
    var cueContainer = document.querySelector(".cue-btns");
    if (cueContainer) {
      cueContainer.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { e.preventDefault(); goCue(current + 1, true); }
        if (e.key === "ArrowRight") { e.preventDefault(); goCue(current - 1, true); }
      });
    }
    if (stageWrap) {
      stageWrap.addEventListener("pointerenter", stopAuto);
      stageWrap.addEventListener("pointerleave", restartAuto);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopAuto(); else restartAuto();
    });
    goCue(0);
    restartAuto();
  }

  /* ── Stage spotlight ── */
  var stageBox = document.getElementById("stageBox");
  if (stageBox && !reduceMotion) {
    stageBox.addEventListener("pointermove", function (e) {
      var rect = stageBox.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      stageBox.style.setProperty("--mx", x + "%");
      stageBox.style.setProperty("--my", y + "%");
    });
    stageBox.addEventListener("pointerleave", function () {
      stageBox.style.setProperty("--mx", "50%");
      stageBox.style.setProperty("--my", "30%");
    });
  }

  /* ── Copy to clipboard + toast ── */
  var toast = document.getElementById("toast");
  var toastTimer = null;
  var showToast = function (msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2200);
  };

  document.querySelectorAll(".ch-copy").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var val = btn.getAttribute("data-copy") || "";
      var done = function () {
        btn.classList.add("copied");
        var original = btn.textContent;
        btn.textContent = "تم ✓";
        setTimeout(function () {
          btn.classList.remove("copied");
          btn.textContent = original;
        }, 1600);
        showToast("تم النسخ ✓");
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(done, function () { fallbackCopy(val); done(); });
      } else {
        fallbackCopy(val);
        done();
      }
    });
  });

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* ── Active nav tracking ── */
  var navLinks = document.querySelectorAll(".nav-links a");
  var sections = document.querySelectorAll("section[id]");
  if (navLinks.length && sections.length && "IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === "#" + entry.target.id
              );
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ── Footer year ── */
  var yearEl = document.getElementById("footYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
