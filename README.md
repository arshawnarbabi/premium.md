# premium-design.md

> Two brand-agnostic design system templates — one for web, one for mobile — that turn any AI agent into a reliable premium-grade UI generator.

The templates encode roughly 3,800 lines of cross-referenced research on what makes premium product design measurably different from generic SaaS-template output. Brand identity slots into ~8 fields per project; everything else is pre-decided.

---

## What's in this repo

| File | Purpose | Lines |
| --- | --- | --- |
| **`DESIGN_TEMPLATE_WEB.md`** | The web template — marketing sites + product (SaaS) websites | ~2,200 |
| **`DESIGN_TEMPLATE_MOBILE.md`** | The mobile template — iOS HIG + Android Material 3 apps | ~1,650 |
| `research.md` | Brand-agnostic premium-standard research (23 sections, ~3,800 lines) — the explanatory backing for everything in the templates | informational |
| `template-plan.md` | How the templates are structured: 3-tier system (universal rules / profile presets / brand slots) | informational |
| `plan.md` | The original research plan and phased checklist | informational |

---

## What the templates handle

Each template is a complete operational ruleset across these dimensions:

- **Colors** — OKLCH authoring, 12-step Radix scale, APCA contrast, dark-mode strategy (perceptually mapped, not inverted), surface hierarchy
- **Typography** — 8 semantic type roles, modular scale ratios, line-height + tracking inverse rules, variable fonts, fluid clamp sizing
- **Spacing** — 4 px base, 18-step scale, inset/stack/inline pattern, container queries
- **Shapes (radius)** — 6-step scale, nested-radius math, continuous corners on iOS
- **Elevation & depth** — 6-level layered shadows (web) / materials + M3 elevation (mobile)
- **Motion** — 5 duration tokens, 4 easings, 3 spring presets, FLIP technique, View Transitions API, spring physics for gestures, reduced-motion variants
- **States** — 10 canonical states, focus-visible spec, touch states (iOS dim / Android ripple), disabled-without-opacity
- **Iconography** — 6 sizes, stroke-to-text-weight pairing, optical alignment
- **Imagery** — 6 aspect ratios, modern image loading (AVIF/WebP/JPG, srcset, fetchpriority, lazy), placeholder strategies
- **Density & responsive** — 3 density modes, touch-target minimums per platform, breakpoints / size classes
- **Accessibility** — WCAG 2.2 + APCA contrast targets, 6 preference media queries (including `forced-colors`), live regions, skip links
- **~25 components** (web) / **~22 components** (mobile) — pixel-perfect specs with state matrices for every common atom and molecule
- **Web patterns** — canonical landing page composition, hero variants, scroll-triggered animation framework, bento grids, command palette, code surfaces
- **Mobile patterns** — iOS HIG + Material 3 native conventions, gestures, haptics (with platform API mappings), safe areas, permissions pre-prompting
- **Data visualization** — three-palette system (categorical/sequential/diverging), chart-type conventions, viz accessibility
- **Internationalization & RTL** — CSS logical properties, mirror rules, tall-script line-height, CJK exceptions, locale formatting
- **Microcopy & UX writing** — voice principles, banned-word list, length budgets, premium positioning structure
- **AI Agent Contract** — 23 hard rules (web) / 16 hard rules (mobile) the AI must follow when consuming the document
- **Anti-patterns** — ~80 explicit "never do this" items consolidated into the Do's-and-Don'ts section

---

## Quick start

### Web project

```bash
# 1. Copy the web template into your project
curl -O https://raw.githubusercontent.com/arshawnarbabi/premium-design.md/main/DESIGN_TEMPLATE_WEB.md
mv DESIGN_TEMPLATE_WEB.md DESIGN.md

# 2. Fill the required slots (in your editor)
#    - brand.name, brand.description, brand.audience, brand.voice
#    - colors.primary.base (OKLCH)
#    - colors.neutral.hue
#    - typography.families.{display,body,mono}
#
# 3. Verify nothing is left blank:
grep -n "<[^>]*>" DESIGN.md
# Should return zero results

# 4. Generate the 12-step color palettes
#    (run a small derivation script or ask an AI agent to expand the colors
#     per the algorithm in §Colors → Generating the scale)

# 5. Hand DESIGN.md to any AI coding assistant — they will produce
#    consistent premium-grade UI from it
```

### Mobile project

```bash
curl -O https://raw.githubusercontent.com/arshawnarbabi/premium-design.md/main/DESIGN_TEMPLATE_MOBILE.md
mv DESIGN_TEMPLATE_MOBILE.md DESIGN_MOBILE.md
# Same fill-in steps as web.
```

### Both web AND mobile in one project

Use both files. Keep brand-identity slots (`brand`, `colors`, `typography.families`, `profiles`) **identical** between `DESIGN.md` and `DESIGN_MOBILE.md` so the brand reads the same cross-platform.

---

## How a fresh AI session uses this

Tell the AI exactly which file to consume. Example prompt:

```
Use the design system template at
https://github.com/arshawnarbabi/premium-design.md/blob/main/DESIGN_TEMPLATE_WEB.md
as your single source of truth. Reference tokens via {group.path} syntax;
never invent values not present in the document. Honor every rule in the
AI Agent Contract.

Build me a pricing page for [product description]...
```

The AI doesn't need the other template, the research, or the plan — just the one design template.

---

## What you actually decide per project

**Required brand inputs (~8 fields, no defaults work):**
1. Brand name
2. Product description
3. Audience
4. Voice descriptor
5. Brand primary color (OKLCH)
6. Brand neutral hue (0–360°)
7. Display font family
8. Body font family

**Profile selections (9 profiles — all have premium defaults):**
Radius / type scale / density / motion / elevation / saturation / warmth / section padding / chart minimalism

**Pick-one slots (~22 on web, ~14 on mobile — all have defaults):**
Input style, tabs style, icon fill, avatar shape, modal backdrop, code surface, onboarding pattern, save model, settings IA, mobile nav style, platform adherence, haptic intensity, and others.

**Total decisions per project:** ~32 for web only, ~26 for mobile only, ~40 unique for both.

**Accepting all defaults** gives you a complete premium-grade design system out of the box — only the 8 brand-identity inputs are truly required.

---

## Design system structure: three tiers

1. **Universal rules** — hardcoded; same for every project. (Accessibility floor, anti-patterns, spacing scale values, token reference syntax, AI Agent Contract.)
2. **Structural defaults** — pre-filled with the broad-premium-middle default; override only with intent. (Profiles, pick-one slots.)
3. **Brand-specific slots** — empty `<placeholder>` syntax; fill per project. (Brand identity, colors, fonts.)

This split makes the system reusable without being generic.

---

## Where the rules came from

`research.md` documents the source for every rule:

- Published premium design systems: Radix Colors, Material 3, Apple HIG, IBM Carbon, Atlassian Design System, Shopify Polaris, Geist (Vercel)
- DTCG W3C Design Tokens Format Module (stable since Oct 2025)
- Practitioner content: Karri Saarinen's 10 rules of craft, Rauno Freiberg's interaction principles ("Devouring Details")
- Vercel's published "Web Interface Guidelines"
- Production-site analysis across Linear, Vercel, Stripe, Notion, Anthropic, Mercury, Huly, Neon, Unkey, and Pixel Point's case-study portfolio
- Modern standards: OKLCH color, APCA contrast, CSS logical properties, View Transitions API, container queries, modern image loading

The research file is informational — you don't need it to use the templates. But it's the explanatory backing if anyone asks "why this rule?"

---

## Versioning

Both templates carry `template_version: "1.0.0"` in their frontmatter. Per-project `DESIGN.md` instances should preserve this field so you can track which template version they were authored against.

---

## License

[Choose and add a LICENSE file — MIT, CC BY 4.0, or proprietary depending on how you want this used.]
