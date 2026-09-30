# تركي الدريس — ملف أعمال | Turki Al-Dress Portfolio

Arabic-first (RTL) static portfolio site for an event-operations manager in Riyadh, KSA.
Zero build step, zero dependencies — plain HTML/CSS/JS, ready for Netlify.

## Structure
```
index.html            — the whole site (single page, lang="ar" dir="rtl")
assets/css/main.css   — design system «ليلة العرض» (Show Night)
assets/js/main.js     — scroll reveals + ticker loop (no libraries)
netlify.toml          — publish config + security/cache headers
Claude Docs/          — design plan & documentation
```

## Deploy to Netlify
Any of these — no build settings needed (`publish = "."` is already in `netlify.toml`):

1. **Drag & drop:** zip nothing — just drag this whole folder onto https://app.netlify.com/drop
2. **CLI:** `npx netlify-cli deploy --prod --dir .`
3. **Git:** push the folder to a repo and connect it in Netlify; it will pick up `netlify.toml` automatically.

## Local preview
```
python -m http.server 8123
# → http://localhost:8123
```

## Design notes (v4 — navy & gold)
- Palette: page `#0B1A2E`, raised card `#12243C`, alternating band `#0E1E33`, text `#EEF3F9`, gold accent `#D4A64A`, gold fill `#C99A3B`, closing band `#050D18`. The lighter a surface, the more raised it is.
- Type: Reem Kufi (display) + IBM Plex Sans Arabic (body) + IBM Plex Mono (numerals & Latin micro-labels). English mode swaps the display face — see gotcha 3.
- Concept: a dark monograph. Turki's own on-site photograph sits behind the hero in greyscale under a navy scrim; an event accreditation pass hangs on a lanyard beside the copy; the career runs as a one-role-at-a-time reel; the page closes on the deepest navy with a Sadu band.
- Bilingual: a nav toggle swaps 108 elements between Arabic and English and flips `dir` — see gotcha 4.
- Accessibility: skip link, focus-visible outlines, `prefers-reduced-motion` honored, semantic headings, all text verified ≥4.5:1 (including pixel-sampled contrast behind the hero photo).

### Gotchas for future edits
1. **Gold is one family in three tones, and a gold fill carries DARK text.** `--bronze` (`#A47C2C`) is the deep tone for strokes; `--gold-fill` (`#C99A3B`) the mid tone for fills; `--gold` (`#D4A64A`) the light tone for text. `--on-gold` is the page navy, because white on gold fails. Anything you place on a gold fill must follow that flip or it turns gold-on-gold and vanishes — `.badge-type`, `.crest-chip` and `.current-dot` are already handled.
2. **`.reveal` starts invisible.** If IntersectionObserver never fires, every element stays at `opacity: 0` and the page renders blank — so `main.js` keeps three fallbacks (load sweep, capture-phase scroll sweep, 2.5s catch-all). The scroll listener is on `document` in capture phase on purpose: a window-level listener misses scrolling inside embedded viewers and leaves everything below the fold hidden.
3. **Reem Kufi has no Latin glyphs.** `html[lang="en"]` switches `--font-display` to IBM Plex Sans Arabic, whose Latin *is* IBM Plex Sans. Without that, English headings fall back silently to a system face.
4. **Arabic lives in the DOM, English in `data-en`.** The Arabic original is cached in memory rather than a second attribute, because it contains `<bdi>` wrappers that keep Latin names and digits from breaking the bidi run. Swapping `textContent` would destroy them.
5. **The career reel must not use `scrollIntoView` on load.** It opens on the current role; `block: "nearest"` would scroll the *page* down to the section and hijack where the visitor lands. It nudges the track's own `scrollLeft` by a measured delta instead.
6. **`mailto:`/`tel:` need an OS handler.** Without one the click silently does nothing, so each contact card carries a copy button as a guaranteed path.

### Slots waiting on assets
Official logos are trademarks and no licensed files exist in this repo, so both places that want one render a typographic stand-in with the real slot ready:
- `.chapter-mark` in the career reel → `<img class="chapter-logo" src="assets/img/<org>.svg" alt="">`
- `.org` cards in section 05 → `<img class="org-logo" src="assets/img/<org>.svg" alt="">`

Each career card also has an empty `<div class="chapter-media">`; drop `<img>`, `<video>` or `<iframe>` in and it becomes a grid. It stays collapsed while empty.

See `Claude Docs/plan.md` and `Claude Docs/verification.md` for the full rationale and audit.
