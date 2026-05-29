# Plan — Temperance Design System Template (`DESIGN_TEMPLATE.md`)

> Working brief and research checklist. Update as work progresses. A fresh-context AI reading this document alone should understand the full scope, motivation, decisions, and remaining work.

---

## 1. Context

**Product:** Temperance is a personal AI agent for the everyday, non-technical person — a "second brain" that integrates seamlessly with the software people already use (calendar, email, messaging, files). Positioning is warm, personal, intelligent — explicitly NOT enterprise-cold or developer-coded.

**Brand identity already established** (for context only — this template stays brand-agnostic):
- Wordmark: "Temperance" set in DM Sans
- Brandmark: classical-engraving angel illustration inspired by the Temperance tarot card
- Primary color: deep forest green `#2D6A4F`
- Text color: warm near-black green `~#0F1A14`

**Why we are building this:** Google's published `DESIGN.md` spec ([google-labs-code/design.md](https://github.com/google-labs-code/design.md)) is a good structural foundation but is too permissive — it defines a container for tokens without enforcing the precision required for an AI agent to produce pixel-perfect, consistent output across an entire product. We want a stricter, more opinionated template that an AI can consume and produce design work indistinguishable from premium studio output.

**Goal of the template:** A reusable `DESIGN_TEMPLATE.md` that, when filled in with project-specific tokens, gives any AI agent enough rule-based context to produce consistent, premium-grade UI without drift between sessions or tools.

---

## 2. Scope

| Dimension | Decision |
| --- | --- |
| Platforms | **Web AND Mobile**, addressed separately within each section |
| Web focus | Marketing sites + product (SaaS) websites — the user's industry |
| Mobile focus | iOS (HIG) + Android (Material 3) + cross-platform conventions |
| Quality bar | Premium / top-tier studio level only |
| Brand specificity | **Brand-agnostic template.** Rules and structure only. No specific hex values, fonts, or copy in the template body. Tokens appear as named placeholders. |
| Deliverable now | `plan.md` + `research.md` (this phase). `DESIGN_TEMPLATE.md` follows after user confirmation. A Temperance-specific `DESIGN.md` instance follows after the template is approved. |

---

## 3. Format & Authoring Decisions

### 3.1 Structural format
Adopt Google's `DESIGN.md` skeleton (YAML frontmatter + Markdown body, section ordering) because:
- It aligns with the DTCG W3C Design Tokens spec (stable since October 2025), which has industry-wide adoption (Adobe, Figma, Material, Tokens Studio, Style Dictionary, etc.)
- Markdown reduces token consumption ~90% vs HTML — critical for AI context windows
- Each section being a self-contained thought matches the recommended pattern for LLM-friendly documentation
- It's already a recognized convention many AI coding tools will eventually understand by default

### 3.2 Extensions beyond Google's spec
Add the following because Google's spec is admittedly evolving and currently lacks them:
- **Motion** section with easing curves, duration tokens, reduced-motion behavior
- **States** system (default / hover / focus-visible / active / pressed / disabled / loading / selected / error)
- **Density & Responsive** specification (compact / comfortable / spacious, breakpoints, fluid scaling)
- **Iconography** section (size scale, stroke matching, optical alignment)
- **Imagery** section (aspect ratios, treatments, placeholders)
- **Accessibility** section (contrast standard, touch targets, focus visibility, reduced motion, min sizes)
- **AI Agent Contract** — explicit rules the AI must follow (e.g., "never invent new spacing values," "always reference tokens, never raw values")
- **Component specs at pixel-perfect level** — exact heights, paddings, gaps, radii, and state styling for every common atom and common molecule
- **Anti-patterns** — explicit "never do this" rules with reasons

### 3.3 Prose style — brand-agnostic
Every prose paragraph in the template must be **rule-based**, not **brand-based**. Each section follows this structure:

1. **Rule** — universal principle in one sentence
2. **Rationale** — why this rule exists (helps AI judge edge cases)
3. **How to apply** — explicit decision criteria
4. **Token slot** — YAML placeholder for project-specific values
5. **Examples** — illustrative patterns (also brand-agnostic — use placeholder names like `primary`, `surface-1`, etc.)

The **only** place brand-specific prose lives is the `Overview` section, which is intentionally project-filled when the template is instantiated. Everything else stays identical across projects.

### 3.4 Two-file approach
- **`DESIGN_TEMPLATE.md`** — the reusable universal rules + empty token slots + AI agent contract
- **`DESIGN.md`** (per project) — an instance of the template with filled tokens and project-specific Overview prose

### 3.5 Section ordering (final)
1. Overview (Brand & Style)
2. AI Agent Contract
3. Colors
4. Typography
5. Spacing & Layout
6. Shapes (Radius)
7. Elevation & Depth
8. Motion
9. States
10. Iconography
11. Imagery
12. Density & Responsive
13. Accessibility
14. Components
15. Web Patterns (marketing + product site conventions)
16. Mobile Patterns (iOS + Android conventions)
17. Do's and Don'ts (Anti-Patterns)

---

## 4. Reference Anchors

Premium products and studios whose conventions inform the research:

**Marketing / product sites (web):**
- Linear, Vercel, Stripe, Anthropic, Arc, Cursor, Raycast, Mercury, Notion

**Agency craft (web):**
- Pixel Point (pixelpoint.io) — Cluely, gitness, huly, and others
- Basic Agency, Locomotive, Active Theory, MetaLab, Tonik

**Mobile (app):**
- Apple HIG-aligned: Things, Linear Mobile, Arc Search
- Material 3 best-in-class: Google's own first-party apps

**Standards / specs:**
- DTCG W3C Design Tokens Format Module (2025.10)
- Apple Human Interface Guidelines (current)
- Material Design 3 (current)
- Radix UI, shadcn/ui, Tailwind CSS — for token convention references
- IBM Carbon, Atlassian Design System, Shopify Polaris — for documentation patterns
- APCA (Accessible Perceptual Contrast Algorithm) — modern contrast standard

---

## 5. Research Checklist

Each phase produces a corresponding section in `research.md`. Mark off as completed. Each phase must address: (a) the principle / standard, (b) the concrete values premium products use, (c) web vs mobile differences where relevant.

### Phase A — Format & Authoring (meta)
- [x] Investigate Google `DESIGN.md` format
- [x] Investigate DTCG W3C Design Tokens spec
- [x] Investigate LLM-friendly documentation patterns
- [x] Write up findings in research.md `§A` (Format & Authoring)
- [x] Define the AI Agent Contract principles (input to template `§AI Agent Contract`)

### Phase B — Reference Aesthetic (visual baseline)
- [x] Fetch & analyze Pixel Point case studies (Cluely, gitness, huly)
- [x] Fetch & analyze Linear, Vercel, Stripe, Notion landing/product
- [x] Identify recurring premium patterns
- [x] Write up findings in research.md `§B` (Reference Aesthetic)

### Phase C — Color
- [x] Color spaces (sRGB / Display-P3 / OKLCH / OKLab)
- [x] Perceptual color and why OKLCH matters
- [x] Contrast standards (APCA vs WCAG 2)
- [x] Premium palette structure (primary / secondary / tertiary / neutral / semantic)
- [x] Step systems (Tailwind 50–950, Radix 1–12, Material tonal)
- [x] Background / surface hierarchy
- [x] Border colors and alpha overlays
- [x] State color modifications (hover / pressed / disabled)
- [x] Dark mode strategy (perceptual mapping, not inversion)
- [x] Web vs mobile color considerations
- [x] Write up findings in research.md `§C` (Color)

### Phase D — Typography
- [x] Modular scale ratios (1.125, 1.200, 1.250, 1.333, 1.414, 1.500, 1.618)
- [x] Type roles (display / headline / title / body / label / caption / overline)
- [x] Weight pairing rules
- [x] Line height per size (tight for display, generous for body)
- [x] Letter spacing per size (negative for large, positive for caps/small)
- [x] Font feature settings (numerics, ligatures, alternates)
- [x] Variable font axes (optical sizing, grade)
- [x] Measure / max line length (45–75 chars)
- [x] Vertical rhythm and baseline grids
- [x] Web vs mobile type scaling (fluid, clamp)
- [x] iOS Dynamic Type and Android scale considerations
- [x] Write up findings in research.md `§D` (Typography)

### Phase E — Spacing
- [x] Base unit choice (4px vs 8px) and rationale
- [x] Scale type (linear, geometric, T-shirt, hybrid)
- [x] Inset / Stack / Inline pattern (Brad Frost)
- [x] Component-internal vs between-component spacing
- [x] Section padding for marketing pages vs in-app
- [x] Optical adjustments (when rules break)
- [x] Write up findings in research.md `§E` (Spacing)

### Phase F — Layout & Grid
- [x] Column grid systems (12, 8, custom)
- [x] Breakpoint conventions (mobile-first)
- [x] Container max widths
- [x] Asymmetric layouts in premium sites
- [x] White-space ratios and section rhythm
- [x] Mobile safe areas (iOS notch / Dynamic Island, Android system bars)
- [x] Write up findings in research.md `§F` (Layout & Grid)

### Phase G — Shapes (Radius)
- [x] Radius scale (none / sm / md / lg / xl / full)
- [x] Nested-radius rule (outer = inner + padding)
- [x] Continuous corners (Apple squircle) vs circular arc
- [x] Platform conventions (iOS 22pt continuous, Material 12dp/16dp)
- [x] Write up findings in research.md `§G` (Shapes)

### Phase H — Elevation & Depth
- [x] Shadow systems (Material elevation 0–5, custom layered)
- [x] Multi-layer shadows (close + ambient)
- [x] Colored / tinted shadows
- [x] Border vs shadow vs background-tone for separation
- [x] Z-index strategy
- [x] Web vs mobile elevation patterns (mobile uses flatter or more tactile)
- [x] Write up findings in research.md `§H` (Elevation & Depth)

### Phase I — Motion
- [x] Easing curves (standard, emphasized, decelerated, accelerated)
- [x] Duration tokens (instant / fast / base / slow / deliberate)
- [x] Spring physics (mobile)
- [x] Orchestration & stagger
- [x] Reduced-motion behavior
- [x] Scroll-triggered animation in premium marketing sites
- [x] Write up findings in research.md `§I` (Motion)

### Phase J — States
- [x] Full state list (default, hover, focus-visible, active, pressed, disabled, loading, selected, error, success)
- [x] Focus ring specs (width, offset, color, contrast)
- [x] Touch state patterns (Android ripple, iOS dim)
- [x] State transition timing
- [x] Write up findings in research.md `§J` (States)

### Phase K — Iconography
- [x] Standard sizes (12 / 14 / 16 / 20 / 24 / 32 px)
- [x] Stroke weight matching to text weight
- [x] Optical alignment with adjacent text
- [x] Filled vs outline conventions
- [x] Icon libraries premium products use (Lucide, Phosphor, custom)
- [x] Write up findings in research.md `§K` (Iconography)

### Phase L — Imagery
- [x] Standard aspect ratios (1:1, 4:3, 3:2, 16:9, 21:9, 4:5)
- [x] Image treatments (overlays, duotones, blur-up)
- [x] Placeholder strategies (skeleton, blurhash, LQIP)
- [x] Avatars and circular crops
- [x] Write up findings in research.md `§L` (Imagery)

### Phase M — Density & Responsive
- [x] Density modes (compact / comfortable / spacious)
- [x] Touch target minimums per platform (44pt iOS, 48dp Android, 24px web pointer / 44px web touch)
- [x] Fluid typography (clamp, viewport units)
- [x] Container queries vs media queries
- [x] Responsive component behavior
- [x] Write up findings in research.md `§M` (Density & Responsive)

### Phase N — Accessibility
- [x] Contrast minimums (APCA Lc 60+ for body, Lc 75+ for small)
- [x] WCAG 2 fallback (4.5:1 body, 3:1 large/UI)
- [x] Focus visibility requirements
- [x] Touch target minimums
- [x] Motion preferences
- [x] Minimum text sizes per platform
- [x] Color-only meaning prohibition
- [x] Write up findings in research.md `§N` (Accessibility)

### Phase O — Components (atoms)
For each: anatomy, sizing tokens, padding, state styling, variants.
- [x] Button (primary / secondary / tertiary / ghost / destructive / icon-only)
- [x] Input (text / textarea / select / number)
- [x] Checkbox / Radio / Switch / Slider
- [x] Badge / Chip / Tag / Pill
- [x] Avatar
- [x] Divider
- [x] Tooltip
- [x] Label
- [x] Write up findings in research.md `§O` (Components — Atoms)

### Phase P — Components (molecules)
- [x] Card
- [x] Modal / Dialog / Sheet (mobile)
- [x] Toast / Notification / Banner
- [x] Dropdown / Menu / Popover
- [x] Tabs
- [x] Accordion / Disclosure
- [x] Navigation (top nav, sidebar, tab bar mobile, bottom sheet mobile)
- [x] Table / Data list
- [x] Form group (label + input + helper + error)
- [x] Pagination
- [x] Breadcrumbs
- [x] Write up findings in research.md `§P` (Components — Molecules)

### Phase Q — Web Patterns (marketing + product sites)
- [x] Hero section conventions
- [x] Section vertical padding (premium uses 96–160px+ desktop, 64–96px mobile)
- [x] Scroll-driven storytelling
- [x] CTA hierarchy
- [x] Logo wall / social proof patterns
- [x] Feature grids
- [x] Footer conventions
- [x] Pixel Point-style craft (large type, generous whitespace, custom illustration, motion)
- [x] Write up findings in research.md `§Q` (Web Patterns)

### Phase R — Mobile Patterns
- [x] iOS HIG patterns (navigation bar, tab bar, sheets, swipe actions)
- [x] Material 3 patterns (top app bar, FAB, bottom nav, bottom sheets)
- [x] Safe areas and dynamic islands
- [x] Gesture conventions
- [x] Haptic feedback patterns
- [x] Platform-specific component sizing
- [x] Write up findings in research.md `§R` (Mobile Patterns)

### Phase S — Anti-Patterns
- [x] Common AI-generated UI failures (generic, low-contrast, inconsistent spacing)
- [x] Visual cliches to avoid (gradients on everything, neon glows, etc.)
- [x] Token-bypass patterns (raw values instead of references)
- [x] Mixing rounded and sharp corners
- [x] Over-elevation, over-animation, over-color
- [x] Write up findings in research.md `§S` (Anti-Patterns)

### Phase T — Synthesis check
- [x] Re-read entire research.md — all 19 sections (§A–§S, §Z, Sources) populated
- [x] Confirm every checklist item above has a corresponding research section
- [x] Confirm research.md is self-contained for fresh-context AI consumption
- [x] Note any gaps for follow-up — captured in research.md `§Z — Open Questions`
- [x] Mark research phase complete

**Initial research phase: COMPLETE.** Deep-pass research (below) follows before authoring `DESIGN_TEMPLATE.md`.

---

## 8. Deep-Pass Research (added after initial review)

Goal: close gaps identified in the initial pass and raise the floor from "B+" to "premium-tier reference." Each phase produces additions or new sections in `research.md`. Mark off as completed.

### Phase U1 — Premium reference deep mining
- [x] Mine 4+ additional Pixel Point case studies (Vantage, Unkey, Gitness, AgentQL, Slash) for specific design decisions called out
- [x] Inspect Vercel Geist UI published docs for concrete component specs
- [x] Inspect Linear's published interface guidelines / "Details Matter" references
- [x] Inspect Stripe Sail / Stripe Press design patterns
- [x] Inspect Shopify Polaris and Atlassian Design System for documentation patterns to model
- [x] Inspect Rauno Freiberg's "Devouring Details" and Karri Saarinen craft writing for practitioner principles
- [x] Write findings into `research.md` `§Y — Measured Reference Data` (new section)

### Phase U2 — Foundation extensions
- [x] Color palette generation math — how to derive a 12-step OKLCH scale from a single brand hex (extends `§C`)
- [x] Motion choreography depth — orchestration, scene composition, stagger curves, FLIP technique, shared-element transitions (extends `§I`)
- [x] Modern image loading — AVIF / WebP / srcset / sizes / fetchpriority / preload / lazy / CLS prevention (extends `§L`)
- [x] Preference media queries — `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast`, `prefers-color-scheme`, `forced-colors`, `inverted-colors` (extends `§N`)

### Phase U3 — Data Visualization (new `§T`)
- [x] Chart color palette — categorical, sequential, diverging
- [x] Axes, gridlines, ticks specifications
- [x] Tooltips and hover states
- [x] Legend conventions
- [x] Sparklines and inline data
- [x] Bar / line / area / pie / scatter / heatmap conventions
- [x] Empty / loading / error states for charts
- [x] Accessibility (alt-text, color-only meaning prohibition for viz)

### Phase U4 — Internationalization & RTL (new `§U`)
- [x] RTL mirror flipping rules (what flips, what doesn't)
- [x] Logical CSS properties (`margin-inline-start`, `padding-block`, etc.)
- [x] Tall-script line-height adjustments (Arabic, Devanagari, Thai)
- [x] CJK considerations (no italics, no underline, vertical text)
- [x] Locale-aware date / number / currency formatting tokens
- [x] Font subsetting per locale
- [x] Dynamic text length growth (German ~30% longer than English)
- [x] Bidirectional text handling

### Phase U5 — Code & Technical Surfaces (new `§V`)
- [x] Inline code styling
- [x] Code block container spec (padding, radius, background, language tag)
- [x] Syntax highlighting theme conventions (Dracula / GitHub / Nord / custom)
- [x] Line numbers / line highlighting / diff views
- [x] Copy button affordance
- [x] Terminal / command-line aesthetic
- [x] Keyboard shortcut typography (`<kbd>` styling)
- [x] API reference patterns (method signatures, parameters, response shapes)

### Phase U6 — Product Flow Patterns (new `§W`)
- [x] Authentication flows (sign-up, sign-in, OAuth, magic link, MFA, password reset)
- [x] Settings architecture (sections, density, save model, inline vs explicit)
- [x] Search & command palette (⌘K patterns, results structure, recent / suggested / contextual)
- [x] Notifications taxonomy (toast, banner, inbox, badge, push, in-app)
- [x] Onboarding depth (empty-state-driven, progressive, contextual, milestone, completion meter)
- [x] Empty states (initial, filtered, error)
- [x] Confirmation patterns (destructive action confirm, success confirm, undo)
- [x] Pagination patterns (numbered, infinite scroll, "Load more")

### Phase U7 — Microcopy & UX Writing (new `§X`)
- [x] Voice principles (active, concise, human, specific)
- [x] Button label conventions (verb-first, length caps, sentence case)
- [x] Error message structure (what + why + how to fix)
- [x] Empty state copy
- [x] Form labels and helper text
- [x] Confirmation copy
- [x] Date / time / quantity formatting rules
- [x] Avoidance list (banned filler words and corporate-speak)

### Phase U8 — Final synthesis
- [x] Re-read entire `research.md` including all deep-pass additions
- [x] Update `§Z — Open Questions` with any new ambiguities surfaced (now 15 items)
- [x] Update `Sources` with deep-pass citations (8 new subsections, 40+ new sources)
- [x] Confirm template-ready
- [x] Mark research complete; await user confirmation before authoring `DESIGN_TEMPLATE.md`

**Deep-pass status: COMPLETE.** Research doc now spans `§A–§Y` (23 content sections) + `§Z` (15 open questions) + Sources.

---

## 9. Third-Pass (Production-site mining)

Quick targeted pass to reinforce the research by inspecting actual production sites directly (rather than case-study pages or third-party summaries).

### Phase U9 — Production-site mining + reinforcement
- [x] Inspect pixelpoint.io's own production site (not just case-study pages)
- [x] Inspect cluely.com directly
- [x] Inspect vantage.sh, slash.com, gitness (redirected to harness.io/open-source) directly
- [x] Inspect stripe.com home, stripe.com/pricing, stripe.com/sessions, stripe.press directly
- [x] Inspect linear.app/method and vercel.com/home directly
- [x] Synthesize signature moves observed across sites into `§Y.9–Y.12`
- [x] Extract premium copy patterns vs hype patterns into `§Y.12` (reinforces `§X`)

**Third-pass status: COMPLETE.** Added Y.9 (Pixel Point's own design language), Y.10 (Stripe across four properties), Y.11 (cross-reference signature moves matrix), Y.12 (premium copy positioning structure). Research doc now ready for `DESIGN_TEMPLATE.md` authoring.

---

## 6. Deliverables

| File | Purpose | When |
| --- | --- | --- |
| `plan.md` | This document — scope, decisions, checklist | Now (this turn) |
| `research.md` | Brand-agnostic premium-standard research populated phase by phase | Now (this turn) — built incrementally |
| `DESIGN_TEMPLATE.md` | The actual reusable template, brand-agnostic | After user confirms research is sufficient |
| `DESIGN.md` (Temperance) | Project instance applying template to Temperance brand | After template is approved |

---

## 7. Process rules (self-instructions)

- Update `research.md` continuously as each phase completes — never batch at the end
- Re-read `plan.md` between phases to confirm nothing is missed
- Mark checklist items in this file as `[x]` immediately on completion of the corresponding research write-up
- Cite sources inline within research sections; consolidate at the bottom of `research.md`
- Keep research prose dense and concrete — values, not vibes
- Maintain brand-agnostic language throughout — never reference Temperance, forest green, DM Sans, or the angel mark inside research findings
- Note any open questions or judgment calls in a `§Z — Open Questions` section in research.md as they arise
