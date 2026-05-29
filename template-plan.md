# Plan — Authoring `DESIGN_TEMPLATE.md`

> Plan for how the brand-agnostic design template will be structured, what's pre-filled, what's a project-specific slot, and how a fresh AI consumes it. Update as we discuss.

---

## 1. The problem this template solves

`DESIGN_TEMPLATE.md` is the **reusable foundation** for any premium design system. When applied to a project (Temperance or future projects), it produces a `DESIGN.md` file that gives any AI agent the precision required to produce pixel-perfect, consistent, premium UI without drift between sessions or tools.

The template is informed by `research.md` (3,824 lines covering 23 design dimensions + measured production-site references).

---

## 1b. Platform split — web and mobile as parallel templates

Per the scope decision in `plan.md`, web and mobile are addressed **separately, not unified**. The template ships as **two parallel files** plus a shared brand-identity layer that lives in the YAML frontmatter of both:

| File | Audience | What it covers |
| --- | --- | --- |
| **`DESIGN_TEMPLATE_WEB.md`** | Marketing sites + product (SaaS) websites | All web component specs (px-based), layout grid + breakpoints, web motion APIs (FLIP, View Transitions), marketing-site composition, web product flows (⌘K palette, sidebar nav, etc.), code surfaces, modern image loading, hover & focus-visible states |
| **`DESIGN_TEMPLATE_MOBILE.md`** | iOS + Android apps | iOS HIG patterns (tab bar, sheet, nav bar), Material 3 patterns (FAB, bottom sheet, nav rail), gestures, haptics, safe areas, Dynamic Type / sp scaling, native component specs (pt / dp / sp), touch state patterns (ripple / dim), platform-conventional onboarding & permissions |

**Shared inputs (live in BOTH files' YAML frontmatter identically):**
- Brand identity: brand name, product description, audience, voice descriptor
- Color foundation: primary, neutral, secondary, saturation profile, warmth profile, mode declaration (the color tokens themselves transcend platform)
- Type families: display, body, mono — though mobile maps these onto platform text styles (iOS Dynamic Type, Android Material 3 scale)
- Voice and microcopy principles
- Accessibility minimums (touch targets adapt per platform; principles are shared)
- Anti-patterns (most are universal; some are platform-specific)
- AI Agent Contract (most rules are universal)

**Why two files instead of one shared base + two extensions:**
- An AI building a web page consumes only `DESIGN.md` (the web instance). It doesn't need mobile rules cluttering its context.
- An AI building a mobile screen consumes only `DESIGN_MOBILE.md`. Same reasoning.
- Trade-off: when brand identity changes (e.g., update primary color), both files must be updated. Acceptable cost for simpler AI consumption.

**Per-project instantiation:**
- A project building only web copies `DESIGN_TEMPLATE_WEB.md` → `DESIGN.md`
- A project building only mobile copies `DESIGN_TEMPLATE_MOBILE.md` → `DESIGN_MOBILE.md`
- A project building both keeps both files in sync (shared frontmatter values must match)

In every table below, each row is tagged with **W** (web template), **M** (mobile template), or **B** (both — appears identically in both files' frontmatter).

---

## 2. Three tiers of content in the template

Every section in the template contains content from one of three tiers. **The tier determines whether the content is pre-filled, a default, or a slot to fill in per project.**

| Tier | What it is | How it appears in the template |
| --- | --- | --- |
| **Tier 1 — Universal rules** | Apply to every project regardless of brand. Never change. (e.g., "use APCA for contrast", "spacing is multiples of base", "buttons have 3 sizes", "states are explicit tokens not opacity") | **Pre-filled prose.** Identical across every project that uses the template. |
| **Tier 2 — Structural defaults** | A few valid options exist, but one is the recommended premium default. Projects may override but should justify it. (e.g., 4 px base unit, Radix 12-step palette, DM Sans / Inter / Geist defaults, 8 type roles, 6 radius steps) | **Pre-filled with the default.** Projects can edit if they choose. |
| **Tier 3 — Brand-specific values** | Inherently unique per project. Cannot be defaulted. (e.g., the primary brand color, the chosen font family, the brand voice description, the product overview prose) | **Slot syntax `<placeholder>` or empty YAML value.** Clearly marked for fill-in. |

---

## 3. What gets pre-filled vs slotted, section by section

Platform tags: **B** = both web + mobile (shared frontmatter), **W** = web template only, **M** = mobile template only.

| Section | Platform | Tier 1 (rules) | Tier 2 (defaults) | Tier 3 (slots) |
| --- | --- | --- | --- | --- |
| **Overview** | B | Section structure | — | Brand name, product line, audience, voice, primary mode, density |
| **AI Agent Contract** | B | All rules | — | — |
| **Colors** | B | Scale structure, role assignments, contrast rules, dark-mode strategy, alpha rules | OKLCH authoring; 12-step Radix semantics; 3-tone surface hierarchy; APCA Lc thresholds | Brand primary `oklch()`, brand neutral hue, optional secondary; **Saturation profile**; **Warmth profile** |
| **Typography (families + voice)** | B | Scale ratio rule, line-height inverse-to-size rule, letter-spacing rule, weight cap | 8 role names, weights 400/500/600 | Type families (display, body, mono); **Heading weight default** (`600`/`700`); **Scale-ratio profile** |
| **Typography (sizing in px)** | W | px-based scale, clamp() fluid sizing | All 8 roles' px sizes / line-height / tracking | — |
| **Typography (sizing platform)** | M | iOS Dynamic Type / Android sp mapping | Mapping of 8 roles → iOS text styles + Android Material 3 sp scale | — |
| **Spacing & Layout (web)** | W | Base-unit multiplication rule, inset/stack/inline pattern, breakpoint hierarchy | 4 px base, 18-step scale, 6 breakpoints, 12-col grid | **Section padding profile**; **Container width default** |
| **Spacing & Layout (mobile)** | M | Same base-unit rule, safe-area rule, density-mode rule | pt/dp scale (4-base), Compose/SwiftUI grid utilities | — |
| **Shapes (Radius)** | B | Nested-radius math, no-mixing rule, continuous corners on mobile | 6-step radius scale (px equivalents on web; same pt values on mobile) | **Radius profile** |
| **Elevation & Depth (web)** | W | Layered-shadow requirement, tinted shadows, separation strategy | 6 elevation levels with `box-shadow` specs, z-index scale | **Elevation profile** |
| **Elevation & Depth (mobile)** | M | Tonal differentiation over shadows (especially iOS) | iOS: material thinness; Android: M3 elevation 0-5 | **Elevation profile** (same names; flatter mappings on mobile) |
| **Motion (web)** | W | Easing rules, duration scale, reduced-motion required | 5 durations, 4 easings, FLIP, View Transitions API guidance | **Motion profile** |
| **Motion (mobile)** | M | Spring physics for gestures, reduced-motion required | iOS spring presets, Compose spring API mappings, iOS transitions | **Motion profile** (same names; different API mappings) |
| **States (web)** | W | Full state list, focus-visible required | Focus-ring spec, disabled-token spec, transition timings | — |
| **States (mobile)** | M | Touch state patterns, no hover state | iOS dim (~80% brightness on press), Android ripple (12–24% alpha) | — |
| **Iconography** | B | Stroke-to-text-weight pairing, optical alignment, no-mixing rule | 6 icon sizes | Icon family (Lucide / Phosphor / custom); **Icon fill style**; mobile may use SF Symbols (iOS) / Material Symbols (Android) as platform alternatives |
| **Imagery (web loading)** | W | Modern image-loading rules | AVIF→WebP→JPG fallback, fetchpriority hierarchy, srcset/sizes | — |
| **Imagery (general)** | B | Aspect ratio tokens, placeholder strategy | 6 aspect ratios, treatment vocabulary | Photography / illustration style descriptor |
| **Density & Responsive** | B | Touch-target minimums (44 mobile / 24 pointer / 44 touch web) | 3 density modes | — |
| **Accessibility** | B | All WCAG / APCA rules, preference media queries (web specific), platform a11y APIs (mobile specific) | Required APCA thresholds, focus visibility, contrast minimums | — |
| **Components (web atoms + molecules)** | W | Component anatomy patterns, state coverage, sizing tier rule | All px specs for ~25 components | **Input style**; **Tabs style**; **Avatar shape**; **Modal backdrop** |
| **Components (mobile atoms + molecules)** | M | Native-component-first rule, platform-conventional behavior | iOS HIG component specs (in pt); Material 3 component specs (in dp/sp) | **Avatar shape**; bottom-sheet detents |
| **Web Patterns** | W | Canonical landing composition, hero rules, scroll-triggered framework | Section padding scale, bento grid spec, CTA hierarchy, footer convention | **Hero variant default**; **Footer style**; **Logo wall** opt-in |
| **Mobile Patterns** | M | Platform-native default rule, safe areas, gesture conventions, haptics | iOS HIG full pattern set; Material 3 full pattern set | **Mobile nav style** (`tab-bar`/`navigation-bar`/`nav-rail`/`hybrid`); **Platform adherence** (`ios-strict`/`material-strict`/`cross-platform-hybrid`); **Haptic intensity** (`subtle`/`default`/`expressive`); **Bottom-sheet detents** (`medium-large`/`small-medium-large`/`custom`) |
| **Data Visualization** | B | Three-palette rule, axes / tooltips / legends rules, chart-type conventions | Sequential / diverging palette construction; chart-type specs | Categorical palette colors; **Chart minimalism profile**; **Chart library** (web: recharts/visx/tremor; mobile: Swift Charts / Compose charts) |
| **Internationalization & RTL** | B | Logical-properties requirement (web), bidi handling, locale formatting | Per-script line-height multipliers, font subsetting strategy | Target locale list; **RTL support** (`enabled`/`disabled`) |
| **Code & Technical Surfaces** | W (primarily) | All code-block, kbd, terminal rules | Mono font defaults, syntax highlighting theme defaults | Specific mono font; syntax theme; **Code block surface** (`match-page`/`always-dark`) |
| **Product Flow Patterns (web)** | W | Auth / settings / search / notification / onboarding patterns | All specs | **Onboarding pattern**; **Save model**; **Settings IA**; **Command palette (⌘K)** (`enabled`/`disabled`); **Toast position** (`top-right`/`top-center`/`bottom-right`/`bottom-center`); **Product nav style** (`top-bar`/`sidebar`/`hybrid`/`none`) |
| **Product Flow Patterns (mobile)** | M | Native auth / permissions / onboarding patterns; pre-prompt rule | Native sheets for settings; iOS / Android permission flows | **Onboarding pattern** (mobile-suited subset); permissions pre-prompt copy; push notification opt-in pattern |
| **Microcopy & UX Writing** | B | Voice principles, error structure, banned-word list, length budgets | Verb-first labels, sentence-case default | Voice descriptor; capitalization choice; **Time format**; **Number abbreviation** |
| **Do's and Don'ts** | B | All anti-patterns (most universal; some platform-tagged) | — | — |

**Net result (across both templates combined):** ~75% pre-filled (Tiers 1 + 2). ~25% per-project decisions (Tier 3), broken down as:

| Type | Count (web) | Count (mobile) | Shared (B) |
| --- | --- | --- | --- |
| Profiles | 9 | 8 (no section-padding) | 8 of 9 shared |
| Pick-one slots | ~18 | ~12 | many overlap |
| Free-form slots | ~7 | ~7 | all shared (brand identity) |
| Optional slots | 1 | 1 | shared |

**Web template only:** Section padding profile, container width, hero variant, footer style, ⌘K palette, product nav style, code block surface, modal backdrop, input style, tabs style.

**Mobile template only:** Mobile nav style, platform adherence, haptic intensity, bottom-sheet detents.

**Both (shared frontmatter):** Brand colors, type families, voice, icon family, illustration style, radius profile, density profile, motion profile, elevation profile, saturation/warmth profiles, chart minimalism, RTL support, onboarding pattern, save model, time / number formats, heading weight, avatar shape, icon fill style, toast position.

**Total decisions to fully configure a project:**
- Web only: ~32 decisions
- Mobile only: ~26 decisions
- Both platforms: ~40 unique decisions (most are shared)

Accepting all defaults yields a complete premium-grade design system out of the box on either platform; project tuning is opt-in, not required.

---

## 4. Slot syntax convention

Slots are obvious, greppable, and clearly not real values:

**In YAML frontmatter:**
```yaml
colors:
  primary:
    base: "<oklch(L C H) — your single brand color at step 9>"   # SLOT
    9:    "<derived>"                                              # auto-generated from base
```

**In Markdown prose:**
```markdown
## Overview

**Brand:** <Brand Name>
**Product:** <one-line description of what the product does>
**Audience:** <primary persona — who uses this every day>
```

**Grep convention:** every slot uses angle-bracket syntax `<...>`. A pre-instantiation lint runs `grep "<[^>]*>" DESIGN.md` and reports any remaining slots — guarantees nothing is left blank.

---

## 4b. Profile-based selections (between Tier 2 and Tier 3)

Several dimensions are best modeled as **scale-locked but profile-selectable**: the underlying scale is universal and pre-filled, but the project chooses which profile (preset combination) it uses as its default.

This is more flexible than a single default and less burdensome than filling in atomic values. The project just picks one name. **All defaults below are brand-agnostic — the broad premium middle.**

| Dimension | Platform | Profiles offered | What changes per profile | Default |
| --- | --- | --- | --- | --- |
| **Radius profile** | B | `sharp` / `default` / `soft` / `pill` | Which radius step is used for each component class (button / card / modal / input) | `default` |
| **Type scale ratio** | B | `compact` (1.125) / `balanced` (1.200) / `spacious` (1.250) / `dramatic` (1.333) / `editorial` (1.414) | The multiplier between sizes in the modular scale | `balanced` |
| **Density** | B | `compact` / `comfortable` / `spacious` | Between-component spacing multiplier | `comfortable` |
| **Motion personality** | B | `subtle` / `default` / `expressive` | Stagger amounts, spring stiffness, duration biases (mapped to platform APIs) | `default` |
| **Elevation depth** | B | `flat` (border-only separation) / `default` (subtle shadows) / `dimensional` (richer layered shadows) | Which separation strategy components use; mobile maps `default` flatter than web (per §H.6) | `default` |
| **Color saturation** | B | `muted` / `default` / `vivid` | Chroma multiplier applied to all non-neutral palettes | `default` |
| **Brand warmth** | B | `cool` / `neutral` / `warm` | Hue tint applied to the neutral palette | `neutral` |
| **Section padding** | W | `compact` (~96 px) / `default` / `generous` (128–160 px) | Vertical padding scale for marketing-style sections | `default` |
| **Chart minimalism** | B | `tufte` (omit axes, minimal gridlines) / `default` / `carbon` (full axes, gridlines, legends always visible) | Chart density / decoration level | `default` |

**Profile count:** 9 dimensions are profile-selectable. The other ~14 customizable items are "pick-one slots" (single discrete choice from a preset list — see §4c below).

**Example — radius profile spec:**

```yaml
radius:
  scale:                  # Universal, pre-filled
    none: 0px
    sm:   4px
    md:   8px
    lg:   12px
    xl:   16px
    2xl:  24px
    full: 9999px

  profile: "default"      # ← project chooses: sharp | default | soft | pill

  # Resolved per-component (auto-derived from profile choice):
  # sharp   → button: sm, card: md, modal: lg, input: sm
  # default → button: md, card: lg, modal: xl, input: md
  # soft    → button: lg, card: xl, modal: 2xl, input: md
  # pill    → button: full, card: xl, modal: 2xl, input: md
```

The project just writes `profile: "soft"` and every component's radius assignment shifts accordingly. The actual scale values never change.

This makes "I want softer corners across my whole brand" a one-line change instead of editing every component spec.

---

## 4c. Pick-one slots (single discrete choice from preset options)

A **pick-one slot** is a single decision where the project chooses one named option from a preset list. Unlike profiles (which bundle multiple values), pick-one slots set a single value. Unlike free-form slots (which take any value, like a hex color), pick-one slots are constrained to the listed enum.

The defaults below are brand-agnostic.

| Slot | Platform | Options | Default | Where it applies |
| --- | --- | --- | --- | --- |
| **Input style** | W | `outlined` / `filled` / `underlined` | `outlined` | All text inputs, textareas, selects |
| **Tabs style** | W | `underline` / `filled` | `underline` | All `Tabs` components (§P.5) |
| **Icon fill style** | B | `outline` / `filled` | `outline` | All iconography (§K) |
| **Avatar shape** | B | `circle` / `squircle` / `rounded-square` | `circle` | All `Avatar` components |
| **Modal backdrop** | W | `scrim` / `blur` | `blur` | Modal + dialog (§P.2) |
| **Code block surface** | W | `match-page` / `always-dark` | `always-dark` | All code blocks (§V.3) |
| **Onboarding pattern** | B | `empty-state-driven` / `progressive` / `coach-marks` / `step-by-step-modal` / `milestone-checklist` | `empty-state-driven` | First-run UX (§W.5) |
| **Save model** | B | `auto-save` / `explicit-save` | `auto-save` | Settings and edit contexts (§W.2) |
| **Settings IA** | B | `sidebar` / `tabs` / `single-page` | `sidebar` (web), `single-page` (mobile) | Settings architecture (§W.2) |
| **Container width default** | W | `md` (1024) / `lg` (1280) / `xl` (1440) | `lg` | Content container max-width (§F.2) |
| **Heading weight default** | B | `600` / `700` | `600` | All `display-*` and `heading-*` roles |
| **Time format default** | B | `relative-only` / `absolute-only` / `hybrid` | `hybrid` | All time renderings (§X.8) |
| **Number abbreviation** | B | `short` / `long` / `contextual` | `contextual` | Numeric display (§X.8) |
| **Product nav style** | W | `top-bar` / `sidebar` / `hybrid` / `none` | `sidebar` | In-product web navigation (§P.7–P.8) |
| **Hero variant default** | W | `centered` / `split-asymmetric` / `background-led` | `split-asymmetric` | Marketing hero (§Q.2) |
| **Toast / notification position** | B | `top-right` / `top-center` / `bottom-right` / `bottom-center` | `top-right` (web), `top-center` (mobile) | Toast component (§P.3) |
| **Footer style** | W | `multi-column` / `minimal` | `multi-column` | Footer (§Q.10) |
| **Command palette (⌘K)** | W | `enabled` / `disabled` | `enabled` | Global ⌘K command palette (§W.3) |
| **RTL support** | B | `enabled` / `disabled` | `disabled` (opt-in) | Internationalization (§U) |
| **Chart library** | B | web: `recharts` / `visx` / `tremor` / `echarts` / `custom` · mobile: `swift-charts` / `compose-charts` / `custom` | `recharts` (web), platform-native (mobile) | Implementation library |
| **Illustration style** | B | `vector` / `3D` / `abstract` / `mixed` / `none` | `vector` | Hero / feature illustration (§L.6) |
| **Mobile nav style** | M | `tab-bar` (iOS) / `navigation-bar` (Material 3) / `nav-rail` (tablet) / `hybrid` | platform-native (auto) | Mobile primary navigation (§P.9) |
| **Platform adherence** | M | `ios-strict` (full HIG) / `material-strict` (full M3) / `cross-platform-hybrid` (shared component look, native nav) | `cross-platform-hybrid` | How strictly each platform's conventions are followed (§R.1) |
| **Haptic intensity** | M | `subtle` / `default` / `expressive` | `default` | Haptic feedback usage (§R.6) |
| **Bottom-sheet detents** | M | `medium-large` / `small-medium-large` / `custom` | `medium-large` | iOS sheet presentation detents (§P.2 mobile) |

---

## 4d. Optional free-form slot

| Slot | Type | Why it's optional |
| --- | --- | --- |
| **Secondary brand color** | OKLCH value | Most premium products have exactly one accent. A secondary is allowed but discouraged — only fill if the brand genuinely uses two accents (rare). |

---

## 5. Token derivation rules

For values that can be **algorithmically derived from a smaller set of inputs**, the template specifies the derivation rather than asking the user to fill everything in.

| Filled in | Derived |
| --- | --- |
| One brand color at step 9 (in OKLCH) | All 12 steps of the primary scale via §C.15 algorithm |
| One neutral hue | All 12 steps of the neutral scale |
| Type families (display, body, mono) | All 8 type roles' sizes / weights / leading from the scale |
| Brand color step 12 | Shadow tint (used at low alpha in elevation tokens) |
| Light-mode palette | Dark-mode palette (via the perceptual mapping in §C.10, not inversion) |

This minimizes the per-project fill-in burden. A new project only needs to provide ~5 inputs to have a complete token system generated.

---

## 6. File structure decision

**Two parallel template files, one per platform.** Per §1b:

| File | Purpose |
| --- | --- |
| `DESIGN_TEMPLATE_WEB.md` | Web template — copy to `DESIGN.md` per project |
| `DESIGN_TEMPLATE_MOBILE.md` | Mobile template — copy to `DESIGN_MOBILE.md` per project |

Shared brand-identity slots (color, type families, voice, etc.) live in both files' YAML frontmatter identically. The project keeps them in sync when both platforms are built.

A project using only web copies the web file and ignores the mobile file. Likewise mobile-only projects.

If multi-project central tracking becomes important later, evolve toward a `DESIGN_BASE.md` shared layer + platform extensions. Not needed for v1.

---

## 7. AI agent consumption model

An AI agent given a project's `DESIGN.md` reads:

1. **YAML frontmatter** — extracts all tokens. Uses them via `{group.name}` references in generated code (CSS variables, Tailwind config, design tokens JSON).
2. **Markdown body** — reads each section's rules and applies them as judgment criteria when generating UI or making design decisions.
3. **AI Agent Contract section (§A.6)** — treats these as hard constraints; never violates.
4. **Anti-patterns section** — uses as negative examples; never generates these.
5. **Open Questions section** — surfaces ambiguities to the human, doesn't paper over them.

The AI never invents values not present in the tokens, never re-derives colors, never uses raw px when a token exists, never produces a component variant outside the declared set.

---

## 8. The "Acknowledge → Restore → Prove → Act" voice baked in

Per `research.md §Y.12`, premium products use a four-part positioning structure. The template's Overview section will scaffold this so brand-specific voice descriptions follow the same arc.

---

## 9. Versioning

- Template versioned via semver: `template_version: "1.0.0"` in YAML frontmatter
- Per-project `DESIGN.md` declares which template version it was authored against
- Breaking changes to the template bump major version; teams can stay on prior version without immediate migration

---

## 10. Output structure

**Two files** with mostly-shared frontmatter but platform-specific bodies.

### `DESIGN_TEMPLATE_WEB.md` skeleton:

```markdown
---
# YAML frontmatter
template_version: "1.0.0"
name: "<Project Name>"
description: "<One-line product description>"

colors:
  primary:
    base: "<oklch(L C H) brand color>"
    # 12 derived steps:
    1: "<derived>"
    # ...
  neutral: { ... }
  success: { ... }
  warning: { ... }
  danger: { ... }
  semantic:
    surface.canvas: "{colors.neutral.1}"
    text.primary: "{colors.neutral.12}"
    # ... full role-token map (Tier 1 — pre-filled)

typography:
  display:
    family: "<your display font>"
  body:
    family: "<your body font>"
  mono:
    family: "<your mono font, or 'Geist Mono' default>"
  # All 8 roles' sizes/weights/leading/tracking — Tier 1 pre-filled

spacing:
  # 4px base, 18-step scale — Tier 1 pre-filled
  base: 4px
  scale: { 0: 0px, 0.5: 2px, 1: 4px, ... }

rounded:
  # 6-step scale — Tier 1 pre-filled
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 24px
  full: 9999px

elevation:
  # 6 levels — Tier 1 pre-filled with layered shadow strings
  0: "none"
  1: "..."
  # ...

motion:
  duration: { instant: 100ms, fast: 150ms, base: 200ms, slow: 300ms, deliberate: 500ms }
  easing:
    standard: "cubic-bezier(0.2, 0, 0, 1)"
    # ...

components:
  button-primary: { ... }
  # ... all ~25 components pre-filled

z-index:
  base: 0
  dropdown: 1000
  # ...
---

# Body — Markdown

## Overview
[Slot for project-specific brand description]

## AI Agent Contract
[Pre-filled universal rules]

## Colors
[Pre-filled rules + rationale + token reference]

## Typography
[Pre-filled rules + rationale + token reference]

[...all sections from research.md §C–§S, §T–§X, condensed and rule-focused...]

## Do's and Don'ts
[Pre-filled anti-patterns]
```

---

### `DESIGN_TEMPLATE_MOBILE.md` skeleton (shares frontmatter, differs in body):

```markdown
---
# YAML frontmatter — IDENTICAL to WEB for shared fields (B-tagged), differs only for M-tagged additions
template_version: "1.0.0"
platform: "mobile"
name: "<Project Name>"   # same as web
# ... all B-tagged shared values copied verbatim from the web template's frontmatter
# Plus mobile-only additions:
mobile:
  nav_style: "<tab-bar | navigation-bar | nav-rail | hybrid>"
  platform_adherence: "cross-platform-hybrid"
  haptic_intensity: "default"
  bottom_sheet_detents: "medium-large"
---

# Body — Markdown (mobile-specific)
## Overview                  ## (same shared section)
## AI Agent Contract         ## (same shared section)
## Colors                    ## (same shared section)
## Typography (platform mapping)  ## iOS Dynamic Type + Android sp mapping table
## Spacing & Layout (mobile) ## safe areas, size classes, no breakpoints
## Shapes                    ## same scale; continuous corners emphasized
## Elevation & Depth         ## flatter mappings, M3 elevation 0-5
## Motion                    ## spring physics on gestures, iOS/Compose API mapping
## States                    ## touch states; no hover; ripple/dim mapping
## Iconography               ## SF Symbols (iOS) / Material Symbols (Android) as platform alternatives
## Imagery                   ## (shared)
## Density & Responsive      ## platform-conventional density
## Accessibility             ## VoiceOver, TalkBack, Dynamic Type behavior
## Components (mobile)       ## iOS HIG + Material 3 component specs
## Mobile Patterns           ## tab bar, sheet, nav bar, FAB, bottom sheet, swipe actions
## Data Visualization        ## Swift Charts / Compose charts mapping
## Internationalization      ## (shared)
## Product Flow Patterns (mobile)  ## native auth, permissions pre-prompt, push opt-in
## Microcopy & UX Writing    ## (shared)
## Do's and Don'ts           ## (shared with mobile-specific additions)
```

---

## 11. Length expectation

- Both templates will be substantially shorter than `research.md`. Research is the explanatory backing; the templates are operational rulesets.
- `DESIGN_TEMPLATE_WEB.md` estimate: **~1,400–1,800 lines** (~500 YAML + ~900–1,300 body)
- `DESIGN_TEMPLATE_MOBILE.md` estimate: **~1,000–1,400 lines** (~400 YAML + ~600–1,000 body — mobile body is leaner because many sections are shared and platform-native components reduce per-component spec depth)

---

## 12. Settled template-level decisions (confirmed)

1. **Token naming:** Radix 12-step semantics (`primary.9`) ✅
2. **Spacing naming:** numeric multiplier (`space.4` = 16 px) ✅
3. **Primary mode declaration:** light default ✅
4. **Default font families:** free-tier fallbacks named (Inter / Geist Sans / Geist Mono / JetBrains Mono); projects override in `Overview` ✅
5. **Voice case:** sentence case default ✅
6. **File naming:** `DESIGN_TEMPLATE.md` → `DESIGN.md` per-project ✅
7. **All 9 profile defaults** confirmed (see §4b table) ✅
8. **All ~14 pick-one slot defaults** confirmed (see §4c table) ✅

---

## 13. Authoring sequence

1. Confirm Section 12 decisions (or accept all defaults) — done
2. Author `DESIGN_TEMPLATE_WEB.md` first (primary platform per user's industry):
   a. YAML frontmatter with all Tier 1/Tier 2 values pre-filled, Tier 3 slots marked
   b. Each Markdown section in canonical order, rule-based prose
   c. AI Agent Contract section with explicit constraint rules
   d. Do's and Don'ts
   e. "How to use this template" header
3. Author `DESIGN_TEMPLATE_MOBILE.md`:
   a. Copy shared YAML frontmatter fields verbatim from web template
   b. Add mobile-only frontmatter additions
   c. Replace platform-specific sections (typography sizing, components, layout, motion, states, product flows) with mobile equivalents (iOS HIG + Material 3)
   d. Keep shared sections (Overview structure, AI Agent Contract, Color rules, Iconography rules, Imagery rules, Accessibility, i18n, Microcopy, Do's-Don'ts) identical or near-identical
4. Final review of both against `research.md` and `plan.md` for coverage
5. Hand off for user review before producing Temperance-specific `DESIGN.md` + `DESIGN_MOBILE.md` instances