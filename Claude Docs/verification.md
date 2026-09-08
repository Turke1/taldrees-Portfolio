# Verification Log

## v3 — light editorial + dark finale (2026-08-18, current)

Rebuilt `index.html`, `assets/css/main.css`, `assets/js/main.js` from scratch.
Content restored from the CV-faithful fact set; the invented operational data that
had accumulated in the dark "planning board" versions was removed entirely.

### Environment note
No Python or Node on this machine, so no local HTTP server was available. The site
is fully static, so verification ran against a single-file inlined copy over
`file://`. The Browser pane was not displayed, so **screenshots timed out** and the
page never composited frames — layout was verified via computed styles and bounding
boxes instead, the same fallback used in the v2 log. Visual sign-off by a human is
still outstanding.

| # | Criterion | Result |
|---|---|---|
| 1 | Arabic-first RTL | ✅ `lang="ar" dir="rtl"`; contact cards lay out right→left (x = 824, 457, 90) |
| 2 | Palette discipline | ✅ 13 hex values, all from the token table — warm neutrals, greens, bronze. No purple, no blue, no gradients |
| 3 | Content integrity | ✅ 9 record rows, 5 career chapters, 8 skills, 12 partners, 3 contact links, 1 `h1`. Grep for old fabrications (`GrandMA3`, `L-Acoustics`, `fixture`, `حافلة`, `1200`) → 0 hits |
| 4 | No horizontal overflow | ✅ At 375px and 1280px: `scrollWidth === innerWidth`, and zero elements measure wider than the viewport |
| 5 | Responsive collapse | ✅ 1280: hero 2-col (632/388), stats ×4, record ×4, chapters ×3, skills ×3, creds ×3, partners ×4. 375: hero 1-col, stats 2×2, record 2-col, chapters 2-col, all lists 1-col, nav wraps to a scrollable strip |
| 6 | Fonts | ✅ `document.fonts.check` true for Reem Kufi, IBM Plex Sans Arabic, IBM Plex Mono |
| 7 | Anchors | ✅ Every `href="#…"` resolves to an existing element; 6 section ids |
| 8 | Contrast (WCAG AA, ≥4.5) | ✅ after fix — see below |

### Contrast audit
Measured with computed colors against each section's actual background:

| Element | Before | After |
|---|---|---|
| `.kicker` on white | **3.82 FAIL** | 5.30 PASS |
| `.kicker` on paper | **3.82 FAIL** | 5.00 PASS |
| `.plate-foot` on white | **3.82 FAIL** | 5.30 PASS |
| `.footer-en` on green band | **3.94 FAIL** | 5.85 PASS |
| body copy on paper | 8.86 | 8.86 PASS |
| `.record-role` on white | 9.40 | 9.40 PASS |
| `.chapter-years` on sand | 4.66 | 4.66 PASS |
| `.contact-lede` on green | 7.13 | 7.13 PASS |

**Fix:** split the single `--bronze` token into three — `--bronze` (decorative
strokes/dots only), `--bronze-text: #8A6520` (text on paper/white), `--bronze-lt:
#C99A3B` (text on the dark green band). See the warning in `plan.md`.

### Bug found & fixed during verification
**Reveal animation could blank the entire page.** `.reveal` starts at `opacity: 0`
and only becomes visible when IntersectionObserver adds `.in-view`. In this
environment the observer never fired — all 51 elements stayed invisible with the
hero sitting fully inside the viewport, i.e. a completely blank site.

Here the cause was environmental (a non-compositing pane doesn't run IO callbacks),
but the failure mode is real: any context where the observer stays silent renders
the page empty. `main.js` now layers three fallbacks — a `load`-time sweep of
anything already in view, a passive `scroll` sweep, and a 2.5s catch that reveals
everything if *nothing* has revealed. Re-tested: 51/51 elements reach `.in-view`.

### v3.1 — hero identity object swapped (same day)

Client asked for the hero card to read as an event-management/OPS object. The
colophon plate was replaced with an **accreditation pass** («بطاقة الاعتماد»):
lanyard slot, green header with «قطاع الفعاليات» + `OPS` tag, crest, name/role,
hairline rows, «مجالات العمل» chips, barcode strip.

| Check | Result |
|---|---|
| All badge parts render | ✅ slot, sector, `OPS`, crest, name, role, 2 rows, 4 chips, strip |
| No stale `.plate` selectors | ✅ grep across html/css/js → only `grid-template` matches |
| Contrast, all badge text | ✅ lowest is `OPS` on green at **4.86**; name 18.71, role 12.48, labels 5.53, chips 9.40, strip 5.00 |
| 1280px | ✅ badge 384×541, no page overflow |
| 375px | ✅ badge 335px wide in a 375px viewport, zero overflowing children, chips wrap to 2 rows, header doesn't wrap, strip text 298px inside a 334px strip |

**Content integrity note:** the chips are «مجالات العمل» (fields of work), not access
zones, and the barcode carries no serial. Nothing on the badge asserts a credential
that isn't in the CV — see the framing warning in `plan.md`.

### Still to check with a human / real browser
- Visual sign-off on the light→dark transition and the Sadu band
- Crest rotation and hover states at 60fps
- iOS Safari `backdrop-filter` on the sticky nav

---

## v2 — Saudi Modern (2026-07-15, superseded)

Client rejected v1's dark theme; chose «Saudi Modern فاتح وفخم». All-light
brand-book treatment with a rotating microtext seal. Verified at the time on a local
server (port 8123): RTL, palette, responsiveness, reduced-motion all passed.

**Bug found then:** RTL + SVG `textPath` in Chromium — the seal's Latin ring text
inherited `direction: rtl` and every glyph collapsed onto the path start (bbox
10×14px instead of 193×193px). Fixed with `.seal-text { direction: ltr }`.
No longer applicable: v3 dropped `textPath` for a plain geometric crest.

---

## v1 — Show Night (superseded)

Dark stage-night theme (gold spotlights, accreditation-pass cards, cue sheet).
Verified at the time; rejected by client on review — kept here only as a record that
the rebuild was intentional.
