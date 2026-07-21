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

## Design notes (v2 — Saudi Modern)
- Palette: paper `#FAF7F1`, sand `#F0E9DA`, ink `#1D1A14`, deep green `#0F4A34`, bronze `#A9812E` — no purple, no blue, no dark gradients (per brief).
- Type: Reem Kufi (display) + Almarai (body).
- Concept: «دليل الأعمال» — a premium brand-book/monograph: hairline-ruled event index, career chapters, rotating official seal, Sadu-pattern band over the deep-green closing section.
- Accessibility: skip link, focus-visible outlines, `prefers-reduced-motion` honored, semantic headings, WCAG-checked contrast.
- Gotcha for future edits: `.seal-text` needs `direction: ltr` — inherited RTL collapses Latin SVG `textPath` glyphs in Chromium.
