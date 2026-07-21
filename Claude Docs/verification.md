# Verification Log

## v2 — Saudi Modern (2026-07-15, current)

Client rejected v1's dark theme; chose «Saudi Modern فاتح وفخم» via direction question.
Full rebuild verified on local server (port 8123):

| # | Criterion | Result |
|---|---|---|
| 1 | Arabic-first RTL | ✅ `lang="ar" dir="rtl"`, all copy Arabic, Latin brands in `bdi` |
| 2 | No purple / dark-blue gradients | ✅ Grep: 8 hex values — paper/white/sand/ink/greens/bronze only; no gradients at all in v2 |
| 3 | Static, zero console errors | ✅ Confirmed after rebuild |
| 4 | Facts from CV only | ✅ Same fact set as v1 (roles, dates, projects, PMI labeled «دورات واعتمادات») |
| 5 | Responsive + accessible | ✅ Programmatic checks at 375px & desktop: no horizontal overflow, nav collapses, stats 2×2, partners 2-col; skip link, focus-visible (green / bronze-on-green), reduced-motion kills seal spin + reveals + pulse |
| 6 | Content integrity | ✅ 9 record rows, 5 career chapters, 8 skills, 12 partners, 3 contact links; Reem Kufi + Almarai confirmed loaded via `document.fonts.check` |

### Bug found & fixed during verification
**RTL + SVG textPath (Chromium):** the seal's Latin ring text inherited `direction: rtl`
from the document and every glyph collapsed onto the path start (bbox 10×14px instead of
193×193px). Fix: `.seal-text { direction: ltr }`. Also tuned the ring: shortened the string
and set `letter-spacing: 0.44em` so the text (~534px) fills the 540px circumference evenly.

### Environment note
Mid-session the Browser pane's screenshot capture began timing out (JS execution, input,
navigation, and console reads all kept working — page confirmed healthy programmatically).
Layout was verified via computed-style/bbox checks instead of final screenshots.

---

## v1 — Show Night (superseded)
Dark stage-night theme (gold spotlights, accreditation-pass cards, cue sheet). Fully
verified at the time (see git-less history in this file's previous revision); rejected
by client on review — kept here only as a record that the rebuild was intentional.
