# Turki Al-Dress — Portfolio Site Plan

> **v2 — current.** v1 («ليلة العرض» dark stage-night theme) was rejected by the client;
> rebuilt from scratch 2026-07-15 in the direction they chose: **Saudi Modern — light & premium**.

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

## Hard constraints (from brief)
- Arabic-first (lang="ar", dir="rtl"; Latin brand names inline with `bdi`)
- Static only — Netlify, zero build step
- **No purple, no dark-blue gradients**
- User-selected direction: **Saudi Modern فاتح وفخم** (light, premium, editorial)

## Design system v2 — «دليل الأعمال» (The Monograph)
Brand-book / annual-report aesthetic (Diriyah / Royal Commission publication feel):
paper backgrounds, hairline rules, geometric Kufi display type, deep Saudi green,
desert bronze details, generous whitespace.

### Palette
| Token | Hex | Use |
|---|---|---|
| paper | `#FAF7F1` | main background |
| white | `#FFFFFF` | alternating sections |
| sand | `#F0E9DA` | career section tint |
| ink | `#1D1A14` | text |
| green | `#0F4A34` | primary — headings accents, buttons, contact band |
| bronze | `#A9812E` | hairline details, Sadu band, seal star |

### Type
- Display: **Reem Kufi** 400–700 (geometric Kufi — Saudi-modern identity)
- Body: **Almarai** 300–800

### Signature elements
1. **Rotating official seal** in hero — Latin microtext ring (SVG textPath) around a
   Najdi 8-point star + Arabic name. NOTE: `.seal-text { direction: ltr }` is load-bearing —
   inherited RTL collapses Latin textPath glyphs in Chromium.
2. **Sadu triangle band** (bronze SVG pattern) opening the deep-green contact section.

### Structure
1. Nav (paper, hairline) — سجل الفعاليات / المسيرة / القدرات / الاعتمادات + تواصل CTA
2. Hero — editorial 2-col: name + statement + lede + CTAs | rotating seal; ruled stats row
3. سجل الفعاليات — ruled index rows (01–09), hover green tint (on white)
4. المسيرة — chapters with year column; current MUFEED role highlighted card (on sand)
5. القدرات — brand-book grid, 2px ink top-rules (on paper)
6. الاعتمادات — 3 columns, green outline chips (on white)
7. جهات وشراكات — 12-cell hairline name grid (on paper)
8. تواصل — deep green closing band + Sadu band, 3 contact cards + location
9. Footer — paper, hairline

### Motion
Scroll reveals (IntersectionObserver), 50s seal rotation, pulse on «الحالي» dot.
All disabled under `prefers-reduced-motion`.

## Files
- `index.html`, `assets/css/main.css`, `assets/js/main.js`, `netlify.toml`
- `Claude Docs/` — this plan + verification.md

## Success criteria → verification
1. Arabic-first RTL → inspect rendered page
2. No purple/dark-blue gradients → grep hex values
3. Static, zero console errors → local server check
4. Facts match CV only (PMI items = «دورات واعتمادات»)
5. Responsive 375→1440, focus visible, reduced-motion → browser checks
6. Guidelines compliance (theme-color, scroll-margin, tabular-nums, touch-action…)
