# Turki Al-Dress — Portfolio Site Plan

> **v3 — current** (2026-08-18). Light editorial base + dark green finale.
> v1 («ليلة العرض» dark stage-night) — rejected by client.
> v2 («دليل الأعمال» Saudi Modern, all-light) — the direction the client chose.
> Between v2 and v3 the repo drifted back to a dark "planning board / stage AVL"
> treatment full of invented operational data; v3 removes that and returns to the
> chosen direction, with a deep-green closing band as the one dark moment.

## Subject
**تركي فهد الدريس (Turki F. Al-Dress)** — Operations & Project Manager in the Saudi
event-management sector (Riyadh). Track record: Riyadh Season HQ (accreditation),
Red Sea International Film Festival, Saudi Games Torch, 24FINTECH, Final Fantasy,
World Defense Show, UNESCO, MOC Ramadan Season 2025, Aseer Season 2025, Saudi Falcon
Club 2025. PMI courses: PMP, PBA, ACP, SP, RMP, CAPM. MISK Foundation courses.
BA — Imam Muhammad bin Saud University.

## Audience & job
Event agencies, season organizers (government + private), recruiters.
**The page's single job:** prove he can run large-scale event operations → get a call/WhatsApp.

## Hard constraints
- Arabic-first (`lang="ar"`, `dir="rtl"`; Latin brand names inline with `bdi`)
- Static only — Netlify, zero build step, zero dependencies
- **No purple, no dark-blue gradients**
- Light & premium editorial base (client-selected direction)
- **Every fact on the page comes from the CV.** No invented crew counts, equipment
  specs, budgets, progress percentages, or fabricated telemetry. This is the rule
  that v2→v3 drift broke and v3 restores.

## Design system v3 — «دليل الأعمال»
Brand-book / annual-report aesthetic: paper backgrounds, hairline rules, geometric
Kufi display type, deep Saudi green, desert bronze details, generous whitespace —
closing on a deep-green band so the contact section reads as the finale.

### Palette
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FAF8F4` | main background |
| `--white` | `#FFFFFF` | alternating sections, accreditation pass, current-role card |
| `--sand` | `#F1EBE0` | career section tint |
| `--ink` | `#14120E` | headings, primary text |
| `--ink-muted` | `#4A463D` | body copy |
| `--ink-soft` | `#6E685B` | captions, Latin micro-labels |
| `--green` | `#0D3B2E` | primary — accents, buttons, years |
| `--green-mid` | `#145C43` | button hover |
| `--green-deep` | `#0A2C22` | contact band + footer (the dark finale) |
| `--bronze` | `#A47C2C` | **decorative only** — strokes, dots, rules |
| `--bronze-lt` | `#C99A3B` | bronze text on the dark green band |
| `--bronze-text` | `#8A6520` | bronze text on paper/white |

**Load-bearing:** `--bronze` at `#A47C2C` is only 3.8:1 on white and 3.9:1 on the
green band — it fails WCAG AA for small text. It must stay decorative. Text uses
`--bronze-text` on light surfaces and `--bronze-lt` on dark. Do not collapse these
three tokens back into one.

### Type
- Display: **Reem Kufi** 400–700 (geometric Kufi — Saudi-modern identity)
- Body: **IBM Plex Sans Arabic** 300–700
- Numerals / Latin micro-labels: **IBM Plex Mono** 400–500 (tabular figures)

### Signature elements
1. **Accreditation pass** («بطاقة الاعتماد») in the hero — the site's identity object.
   An event crew badge: lanyard slot, deep-green header carrying «قطاع الفعاليات» +
   an `OPS` tag, Najdi 8-point star crest rotating once per 64s, name and role,
   hairline rows (المقر / في الميدان منذ), a «مجالات العمل» chip row, and a
   dashed-off barcode strip. Chosen because accreditation is literally the job he
   held at Riyadh Season HQ, so the object and the subject match.

   **Framing matters here:** the chips are labeled «مجالات العمل» (fields of work),
   *not* access zones — they name domains evidenced in the CV (operations, site/
   backstage ops, C&C rooms, logistics). The strip is a decorative barcode with no
   serial number. Do not add a badge ID, access level, or issuing authority: that
   would turn a design device into a forged credential.

   Replaces v2's rotating microtext seal, and with it the RTL `textPath` bug — there
   is no `textPath` in v3, so `direction: ltr` is no longer needed anywhere.
2. **Sadu triangle band** (bronze SVG data-URI) opening the deep-green contact section.
3. **Hairline vertical rules** faintly striping the hero, masked out toward the fold.

### Structure
1. Nav — sticky, hairline appears on scroll, active-link underline; wraps to a
   scrollable strip ≤860px
2. Hero — editorial 2-col: name + statement + lede + CTAs | accreditation pass; ruled stats row
3. `01` سجل الفعاليات — 9 ruled index rows, hover green tint + bronze edge (on white)
4. `02` المسيرة — 5 chapters on a dotted rail, current MUFEED role as a raised card (on sand)
5. `03` القدرات — 8 cards with 2px ink top-rules (on paper)
6. `04` الاعتمادات — 3 columns of outline chips (on white)
7. `05` جهات وشراكات — 12-cell hairline name grid (on paper)
8. `06` تواصل — deep-green band + Sadu band, 3 contact cards, location, footer inside the band

### Motion
Scroll reveals (IntersectionObserver), 64s crest rotation, pulse on «الحالي» dot,
nav hairline on scroll. All disabled under `prefers-reduced-motion`.

**Load-bearing:** `.reveal` starts at `opacity: 0`, so a silent IntersectionObserver
would render the entire page blank. `main.js` therefore layers three fallbacks —
a `load` sweep, a passive `scroll` sweep, and a 2.5s "nothing revealed at all" catch
that reveals everything. Do not remove these when editing reveal logic.

## Files
- `index.html`, `assets/css/main.css`, `assets/js/main.js`, `netlify.toml`
- `Claude Docs/` — this plan + verification.md

## Success criteria → verification
1. Arabic-first RTL, no horizontal overflow 375→1280
2. No purple / dark-blue; palette limited to the token table above
3. Static, zero dependencies beyond Google Fonts; content survives JS failure
4. **Every fact traceable to the CV**
5. WCAG AA contrast on all text; focus visible; reduced-motion honored
6. Responsive: nav, stats, record rows, chapters, and all grids collapse cleanly
