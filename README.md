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

## Design notes (v3 — light editorial base, dark green finale)
- Palette: paper `#FAF8F4`, sand `#F1EBE0`, ink `#14120E`, green `#0D3B2E`, deep green `#0A2C22` (contact band), bronze `#A47C2C` — no purple, no blue, no gradients (per brief).
- Type: Reem Kufi (display) + IBM Plex Sans Arabic (body) + IBM Plex Mono (numerals & Latin micro-labels).
- Concept: «دليل الأعمال» — a premium brand-book/monograph that reads light all the way down, then closes on a deep-green band: hairline-ruled event index, career chapters on a dotted rail, an event accreditation pass in the hero, Sadu-pattern band over the contact section.
- Accessibility: skip link, focus-visible outlines, `prefers-reduced-motion` honored, semantic headings, all text verified ≥4.5:1.

### Two gotchas for future edits
1. **Three bronze tokens, on purpose.** `--bronze` (`#A47C2C`) is only ~3.8:1 on white — decorative strokes and dots only. Text uses `--bronze-text` (`#8A6520`) on paper/white and `--bronze-lt` (`#C99A3B`) on the green band. Don't merge them back into one.
2. **`.reveal` starts invisible.** If IntersectionObserver never fires, every element stays at `opacity: 0` and the page renders blank — so `main.js` keeps three fallbacks (load sweep, scroll sweep, 2.5s catch-all). Keep them when touching reveal logic.

See `Claude Docs/plan.md` and `Claude Docs/verification.md` for the full rationale and audit.
