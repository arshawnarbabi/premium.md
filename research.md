# Research — Premium Design System Standards (Brand-Agnostic)

> **Purpose.** This document compiles brand-agnostic premium-standard design conventions across color, typography, spacing, motion, components, web patterns, and mobile patterns. It is the source material for `DESIGN_TEMPLATE.md` — a reusable, AI-consumable design system template.
>
> **Audience.** A fresh-context AI agent or human reading this document alone should understand (a) what each design dimension is, (b) the rule premium products follow, (c) the concrete values or ranges used at top-tier studios, and (d) how the rule differs for web vs mobile where relevant.
>
> **Out of scope.** Brand-specific decisions (specific colors, fonts, product copy) are not included here. They belong in a project's `DESIGN.md` instance.
>
> **Status:** Active. Populated phase by phase per `plan.md`. See `§Z` for open questions.

---

## Table of Contents

- §A — Format & Authoring (meta: how to write the template)
- §B — Reference Aesthetic (premium visual baseline)
- §C — Color
- §D — Typography
- §E — Spacing
- §F — Layout & Grid
- §G — Shapes (Radius)
- §H — Elevation & Depth
- §I — Motion
- §J — States
- §K — Iconography
- §L — Imagery
- §M — Density & Responsive
- §N — Accessibility
- §O — Components (Atoms)
- §P — Components (Molecules)
- §Q — Web Patterns (marketing + product sites)
- §R — Mobile Patterns
- §S — Anti-Patterns
- §T — Data Visualization
- §U — Internationalization & RTL
- §V — Code & Technical Surfaces
- §W — Product Flow Patterns
- §X — Microcopy & UX Writing
- §Y — Measured Reference Data
- §Z — Open Questions
- Sources

---

## §A — Format & Authoring

### A.1 The container format

The current consensus pattern for a design-system document optimized for both humans and AI agents is **YAML frontmatter + Markdown body**:

- **YAML frontmatter** holds machine-readable design tokens (colors, type, spacing, radius, components). Parseable by any tokens tool.
- **Markdown body** holds the human-readable rules, rationale, and how-to-apply guidance.

This is the structure used by Google's published `DESIGN.md` spec (google-labs-code/design.md). It maps cleanly onto the **DTCG (Design Tokens Community Group) W3C format**, which reached stable status in October 2025 and is supported by Adobe, Figma, Material, Microsoft, Salesforce, Shopify, Tokens Studio, Style Dictionary, Penpot, Framer, Sketch, Knapsack, Supernova, and others. Adopting this container makes the template portable into any of those tools.

### A.2 Why Markdown, not HTML, JSON, or PDF

- HTML→Markdown conversion typically **reduces token consumption by 90%+** when fed to LLMs. Critical because design system specs are large and AI context windows are finite.
- Markdown is human-editable in any text editor — designers and PMs can correct it without tooling.
- YAML embedded in Markdown frontmatter is parseable by any standard YAML library; the same file remains human-readable.
- Pure JSON loses prose; pure prose loses machine values. The hybrid is the established pattern (`llms.txt`, Google `DESIGN.md`, `AGENTS.md`, `CLAUDE.md`).

### A.3 LLM-friendly authoring rules

Documentation written for AI consumption (per industry guidance from 2025–2026 on `llms.txt` and AI-agent specs) follows these rules:

1. **Each section is a complete, self-contained thought.** An AI may retrieve any single heading independently — it must make sense without the rest of the document.
2. **Lead with the rule, not the rationale.** First sentence of each section is the directive. Reasoning follows.
3. **Use explicit type definitions.** Numbers have units (`16px`, not `16`). Colors have format (`#RRGGBB` or `oklch(L C H)`). Tokens have paths (`{colors.primary.50}`).
4. **No "etc." or "and so on."** Enumerate completely. Ambiguity becomes drift.
5. **State what NOT to do as explicitly as what to do.** Anti-patterns prevent the AI from "filling gaps creatively."
6. **Prefer tables over prose for parallel data.** Easier for AI to extract values reliably.
7. **Avoid hedging language.** Do not write "usually," "often," "consider." Write "use," "do not use," "must," "may."
8. **Cross-reference with explicit token paths**, not natural-language references. `{spacing.4}` not "the medium spacing value."

### A.4 The prose-stays-brand-agnostic rule

In a reusable template, every prose paragraph is **rule-based**, never **brand-based**. Each section follows this five-part structure:

| Part | Purpose | Example (illustrative only) |
| --- | --- | --- |
| **Rule** | The directive | "All spacing values are multiples of the base unit." |
| **Rationale** | Why this rule exists | "A single base unit enforces vertical and horizontal rhythm and eliminates arbitrary gaps." |
| **How to apply** | Decision criteria for the AI | "When choosing spacing between two elements, select the smallest scale step that visually separates them." |
| **Token slot** | YAML placeholder | `spacing: { base: <px>, xs: <px>, … }` |
| **Examples** | Concrete patterns using placeholder names | "Card internal padding: `{spacing.lg}`. Gap between stacked cards: `{spacing.xl}`." |

The **only** section that holds brand-specific prose is the `Overview` (brand & style) section. That section is intentionally a fill-in slot when the template is instantiated for a project. Every other prose paragraph stays identical across projects that adopt the template.

### A.5 Section ordering convention

Google's spec defines a section order; it has become a de-facto convention worth following because tools that learn to parse `DESIGN.md` will look for these headings. Recommended canonical order (extended with the additions this template introduces):

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
15. Web Patterns
16. Mobile Patterns
17. Do's and Don'ts (Anti-Patterns)

### A.6 The AI Agent Contract — what it is and why it exists

An "AI Agent Contract" section sits near the top of the template (right after Overview) and defines **hard rules the AI must follow when consuming the document**. It exists because Google's spec leaves too much to the AI's judgment. Top studios that publish design systems for AI consumption add a contract layer with rules such as:

- "Never invent a color, spacing, font size, or radius value that is not present in the token tables."
- "When a needed token does not exist, choose the nearest existing token, do not interpolate."
- "All references use the `{group.token}` syntax. Never write raw hex / px / font names in component code."
- "When light and dark modes are both defined, never assume one is the inverse of the other — apply the explicit dark-mode tokens."
- "Touch targets in mobile and touch-web contexts are ≥ 44pt iOS / 48dp Android / 44px web. Never reduce below this."
- "When a design decision is not covered by the document, prefer the most conservative interpretation (less motion, more spacing, less color saturation)."
- "Never combine two opposing system choices in the same view (e.g., sharp + rounded radii; serif + display sans headlines together; flat + heavily elevated surfaces)."

The contract is the **single most important addition** over a vanilla `DESIGN.md`. Without it, AI agents drift; with it, drift is bounded.

### A.7 Token reference syntax

Use `{group.subgroup.token}` curly-brace path references (DTCG-compatible). Examples:
- `{colors.primary.50}`
- `{spacing.md}`
- `{typography.body.md}`
- `{components.button-primary.backgroundColor}`

Component tokens may reference composite values (e.g., a button's `typography: {typography.label-md}`). All other token groups must reference primitive values.

### A.8 Versioning

The YAML frontmatter must include a `version` field. When the template structure changes, bump version. Consumers (AI tools) can refuse to parse incompatible versions.

---

## §B — Reference Aesthetic

Cross-analysis of premium product/marketing sites (Linear, Vercel, Stripe, Notion, Anthropic, Mercury, Huly, Neon, Unkey) and agency-grade case studies (Pixel Point — Cluely, Huly, Neon, Unkey, Gitness, Harness, Slash, Vantage, Vectara, AgentQL, RevenueCat). The recurring patterns below define what "premium" looks like in 2026 and form the visual baseline this template enforces.

### B.1 Recurring premium patterns

| Dimension | Pattern observed across all references |
| --- | --- |
| **Type stack** | Modern geometric / humanist sans (Inter, system stack, custom display). Serifs only used as deliberate counter-accent in narrative sections. No more than two type families per site. |
| **Type sizing** | Display headlines 48–96 px desktop, 32–48 px mobile. Body 14–18 px. Display weights 500–700. Body 400–500. |
| **Line height** | Display: tight (1.0–1.15). Body: generous (1.5–1.65). Inverse correlation with type size is universal. |
| **Color foundation** | Either light-dominant (white / off-white surface) or dark-dominant (near-black surface). 1 accent color, used sparingly, typically reserved for primary CTA only. Neutrals carry 80–95% of the surface. |
| **Section padding (web)** | 80–160 px vertical desktop. 48–96 px mobile. "Generous" universally — never cramped. |
| **Internal padding (cards, panels)** | 24–48 px. Premium products lean toward the higher end. |
| **Gap rhythm** | 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 px scale — geometric. |
| **Layout grammar** | Centered hero, then alternating left-text / right-image (and reverse) for narrative sections, then a bento grid for product showcase, then a final CTA band, then a multi-column footer. This sequence is near-universal. |
| **Bento grids** | Asymmetric, mixed cell sizes (2x1, 1x1, 1x2 combinations). Used to communicate "many things in one product" without overwhelming. |
| **Motion** | Restrained and purposeful. Scroll-triggered reveals, gentle parallax, hover-state lifts, looping micro-animations on hero illustrations. No gratuitous easing demos. |
| **Imagery** | Custom illustration > stock photography > screenshots. SVG + Rive / Lottie for interactive illustration. Bento cards often use real product UI as the imagery. |
| **Components — buttons** | 4–8 px radius typical; some go higher (12 px) for warmer brands. Solid primary, ghost / outline secondary, occasional underline-only tertiary. Padding 12–16 px H × 10–14 px V. |
| **Components — cards** | 8–16 px radius. Subtle border OR subtle shadow, rarely both. Inner padding 24–48 px. |
| **Components — inputs** | 1 px border, 6–10 px radius, accent-colored focus ring 2–3 px offset. Heights 36–44 px. |
| **Logo wall / social proof** | Monochrome (filled with current surface contrast) — never original brand colors. |
| **Footer** | Multi-column link grid, larger than feels necessary, with a strong final brand mark. |

### B.2 The "Pixel Point look" — explicit notes

The user identified Pixel Point as a top reference. Their distinctive moves observed across Cluely, Huly, Neon, Unkey, Gitness:

1. **Scroll-triggered animation is the primary storytelling tool.** Not decoration. Animations explain how products work — e.g., on Cluely, motion is what makes the "invisible AI" comprehensible.
2. **Contrast as the core aesthetic pillar.** High contrast between display and body type, between accent and neutral, between light and dark surface. They avoid mid-tones.
3. **Lightweight, responsive layouts that unfold across devices.** No fixed-canvas thinking — layouts compose differently on mobile, not just shrunk.
4. **Custom illustration and Rive animation** rather than stock or iconography alone.
5. **Strategic visual system across multi-page templates** — landing, enterprise, pricing, manifesto pages all share an aesthetic vocabulary without feeling repetitive.
6. **Performance is design.** They explicitly cite performance as a premium signal — heavy animation paired with fast load.
7. **Restraint per page.** Each page does one thing visually. Decorative density is low; informational density is high.

### B.3 What "premium" rejects

Documented patterns the references universally avoid:
- Stock photography of people in headsets
- Gradient backgrounds on every section
- Glow / neon halo effects on every element
- More than one accent color competing for attention
- Pure black (`#000`) text on pure white (`#FFF`) — universally softened
- Default browser font stacks without consideration
- Buttons with shadows AND borders AND gradients simultaneously
- 100% opacity dividers in heavy black
- Section padding that "fits the content" — premium pads beyond content
- Carousel as primary navigation
- Animation on every element on every scroll

### B.4 Translating reference aesthetic into template rules

These observations translate to template-enforceable rules that appear later in the appropriate sections:
- Color §C: define neutral + accent split; cap accents per surface
- Type §D: enforce two-family maximum; line-height inverse-to-size rule
- Spacing §E: geometric scale; minimum 80 px desktop section padding
- Motion §I: purposeful-only rule; max one continuous animation per viewport
- Components §O–P: standardize padding and radius ranges per component class
- Web Patterns §Q: encode hero → alternating narrative → bento → CTA → footer as the default page composition

---

## §C — Color

### C.1 Color space — use OKLCH as the canonical authoring space

**Rule:** Author and store all color tokens in **OKLCH**. Emit sRGB hex / Display-P3 as derived outputs for legacy consumers.

OKLCH (L = lightness 0–1, C = chroma 0–~0.4, H = hue 0–360) is perceptually uniform — a color at L=0.7 looks equally bright regardless of hue. HSL and sRGB are not: HSL blue at 50% lightness looks much darker than HSL yellow at 50% lightness. This breaks any palette scale built from HSL because steps appear unevenly spaced. OKLCH solves this.

**Browser support (early 2026):** Chrome 111+, Edge 111+, Safari 15.4+, Firefox 113+ → covers ~95%+ of users. Safe for production.

**Authoring rule:** Lock L for any group of colors that should appear the same brightness (e.g., a tag row, a feature-icon row). Vary only H. They will look balanced.

**P3 wide-gamut:** Display-P3 gives ~25% more saturated colors than sRGB on modern displays (all current iPhones, MacBooks, iPads, recent Pixel devices). Premium products increasingly author in OKLCH that includes P3 chromas and degrade gracefully on sRGB displays.

```yaml
# Example OKLCH token format (illustrative only)
colors:
  primary:
    50:  "oklch(0.97 0.02 145)"
    500: "oklch(0.55 0.18 145)"
    950: "oklch(0.18 0.03 145)"
```

### C.2 Contrast — WCAG 2.2 as baseline, APCA as perceptual sanity check

**Rule:** Body text and interactive elements must clear WCAG 2.2 AA (4.5:1 normal text, 3:1 large/UI). Additionally, sanity-check against **APCA** and reject any pairing that scores below Lc 60 for body text or Lc 75 for fine print, even if WCAG passes.

WCAG 2.x treats all color pairs as equivalent if they hit the same ratio — it ignores font weight, font size, and how the eye actually perceives the combination. APCA (the algorithm proposed for WCAG 3 but currently not adopted) is dramatically better at predicting real-world legibility because it accounts for size, weight, and polarity (dark-on-light vs light-on-dark behave differently).

**Current best practice (2026):** Use WCAG 2.2 for legal compliance. Use APCA as a stricter perceptual check. Where they conflict, fix the color, not the standard.

**APCA targets premium products use:**
- Body text: **Lc 75+** (preferred), Lc 60 absolute minimum
- Large display: Lc 60+
- UI text on buttons / chips: Lc 75+
- Subtle / disabled text: Lc 45+ minimum (never less)
- Non-text UI elements (borders, icons): Lc 30+

### C.3 Palette structure — five role groups

**Rule:** Every project's color system contains exactly these five palette groups. No additional brand colors are introduced ad hoc.

| Group | Purpose | Step count |
| --- | --- | --- |
| **`primary`** | Brand accent — used for the single most important action per screen and for brand surfaces | 12 steps |
| **`neutral`** | The 80–95% of the surface — backgrounds, text, borders, dividers | 12 steps |
| **`success`** | Positive feedback, confirmation, valid states | 12 steps |
| **`warning`** | Caution, pending, attention-required states | 12 steps |
| **`danger`** | Error, destructive action, invalid input | 12 steps |

A secondary brand color is optional but capped at one additional 12-step palette. A "tertiary" brand color is an anti-pattern at this tier — premium products use one accent.

### C.4 The 12-step scale (Radix model) — what each step is for

**Rule:** Adopt the 12-step semantic scale used by Radix Colors. Each step has a single defined purpose. Never use a step outside its purpose.

| Step | Use |
| --- | --- |
| **1** | App background |
| **2** | Subtle background (alternate surface) |
| **3** | UI element background (cards, panels) |
| **4** | Hovered UI element background |
| **5** | Active / pressed UI element background |
| **6** | Subtle borders / separators (non-interactive) |
| **7** | UI element border / interactive borders |
| **8** | Hovered UI element border / focus rings |
| **9** | Solid backgrounds (primary CTA fill) |
| **10** | Hovered solid backgrounds |
| **11** | Low-contrast accessible text |
| **12** | High-contrast accessible text |

Steps 11 and 12 are guaranteed to clear APCA Lc 60 and Lc 90 respectively against Step 2 of the same palette. Step 9 is the highest-chroma step (purest hue). Step 10 is the hover state of Step 9.

The alternative scale convention is Tailwind's 50–950 (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) — 11 steps. This is more familiar to many engineers but lacks the explicit semantic role assignment of the Radix 12-step. **Recommendation: use Radix 12-step semantics with token names**, optionally aliased to Tailwind's 50–950 for tooling compatibility.

### C.5 Alpha variants — one per scale step

**Rule:** Every solid color step has a paired alpha-channel variant that is **visually identical** when laid over the page background. Use alpha variants whenever a color must overlay non-uniform content (over an image, over a gradient, over a colored panel).

Radix Colors publishes alpha-paired scales — premium products either adopt them directly or generate equivalent pairs.

### C.6 Surface hierarchy — three-to-four levels

**Rule:** Define exactly three or four surface levels, each one step lighter than the previous in light mode (or one step darker, depending on the design's depth convention).

| Token | Light-mode role | Dark-mode role |
| --- | --- | --- |
| `surface.canvas` | Page background (Step 1) | Page background (deepest) |
| `surface.subtle` | Section / alt-stripe background (Step 2) | One step raised |
| `surface.raised` | Cards, panels (Step 3) | Two steps raised |
| `surface.overlay` | Modals, popovers (white in light, +1 in dark) | Three steps raised |

Never invent a fifth surface level. Visual depth beyond four levels is indistinguishable.

### C.7 Borders — three weights

**Rule:** Use exactly three border tokens:
- `border.subtle` — Step 6 — for non-interactive separation (dividers, card outlines on subtle surfaces)
- `border.default` — Step 7 — for interactive component borders (inputs, buttons, cards on canvas)
- `border.strong` — Step 8 — for hovered or focused interactive elements

Borders below 1px or above 2px are not in the system. If you need depth beyond what 1–2px borders provide, use elevation tokens instead.

### C.8 Semantic colors — palette + role tokens

**Rule:** Each semantic color (success / warning / danger) gets a full 12-step palette **and** named role tokens for the most common use cases:

```yaml
# Illustrative
colors:
  success: { 1: …, 2: …, …, 12: … }
  semantic:
    success-bg:      "{colors.success.3}"
    success-border:  "{colors.success.7}"
    success-solid:   "{colors.success.9}"
    success-text:    "{colors.success.11}"
```

The AI must reference the role token (`success-text`), not the step (`success.11`), inside component definitions. This indirection allows brand evolution without rewriting components.

### C.9 State color modifications — never derive on the fly

**Rule:** Hover / pressed / focus / disabled states are explicit token slots, not calculated at runtime. Premium systems hard-code each state.

| State | Convention |
| --- | --- |
| Default | Step 9 (for solid CTAs) or Step 3 (for subtle) |
| Hover | Step 10 (or +1 step) |
| Pressed / Active | Step 11 (or +2 steps) or hover with reduced lightness |
| Focus (ring) | Step 8 of primary, with 2 px ring + 2 px offset |
| Disabled | Step 4 background, Step 8 text (low contrast, intentional) |

Never use CSS `opacity` to derive a "disabled" look — opacity stacks unpredictably over varying backgrounds.

### C.10 Dark mode — perceptually-mapped, not inverted

**Rule:** Dark mode is a separately authored palette, not an automatic inversion of light mode.

Inversion fails for three reasons:
1. **Chroma must drop in dark mode.** Bright saturated colors that look intentional on white look radioactive on near-black. Reduce C by ~20–40% for accent colors in dark mode.
2. **Lightness must compress.** Pure black backgrounds cause halation around white text. Use a near-black like OKLCH L≈0.18, not L=0. White text drops to L≈0.95, not L=1.
3. **Surface direction inverts.** In light mode, raised surfaces get *brighter*. In dark mode, raised surfaces also get *brighter* (i.e., the same direction, not inverted). Modals/overlays in dark mode are not "darker than the page" — they are lighter.

Token-pair pattern:

```yaml
# Illustrative — every semantic role has light + dark explicit values
colors:
  text.primary:
    light: "{colors.neutral.12}"
    dark:  "{colors.neutral.12}"   # but the neutral.12 differs between modes
```

Use the same token names; the underlying palette differs per mode.

### C.11 Mode switching — handle three explicit modes

**Rule:** Define `light`, `dark`, and `system` (follow OS preference). Never assume only two. Provide CSS via `prefers-color-scheme` media query or `[data-theme]` attribute selectors.

### C.12 Color-coded meaning is never the only signal

**Rule:** Information conveyed by color must always be paired with a non-color signal (icon, label, pattern, shape). Color-only meaning fails for ~8% of male users (color vision deficiency) and in monochrome contexts.

### C.13 Mobile-specific color considerations

- **iOS:** Apple's system colors (`UIColor.label`, `UIColor.systemBlue`, etc.) auto-adapt to light/dark/elevated contexts. Premium iOS apps use these as the foundation and layer a single brand accent over them.
- **Android:** Material 3 dynamic color allows the system to extract palettes from the user's wallpaper. Branded apps opt out via static color schemes. The five "key colors" (primary, secondary, tertiary, neutral, neutral-variant) each generate a 13-tone palette (0 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 / 90 / 95 / 99 / 100). Tokens then reference tones, e.g., `primary-40` for light-mode primary.
- **Both:** Mobile platforms have a higher contrast bar in outdoor / bright-light conditions. Treat APCA Lc 75 as the floor for mobile body text, not Lc 60.

### C.14 Light-mode vs dark-mode default — pick one

**Rule:** Declare which mode is the **primary** authoring mode. The other is the secondary. This determines which palette is authored first and which is derived. Premium products do not "design both at once" — one is canonical and the other is mapped from it (carefully, not by inversion).

### C.15 Generating a 12-step scale from a single brand color (OKLCH algorithm)

**Rule:** Given a brand color expressed in OKLCH `(L_brand, C_brand, H_brand)`, the 12-step palette is derived by holding **hue constant**, **stepping lightness on a fixed curve**, and **modulating chroma** so saturation tracks how the eye perceives it (chroma peaks in mid-lightness, drops near extremes).

**Step-by-step algorithm:**

1. Convert the brand color to OKLCH. Capture `H_brand` (this never changes across the scale).
2. Define the **lightness curve** — 12 target L values, spaced so that L1 is the lightest tint (highest L) and L12 is the darkest shade (lowest L). A premium curve is *not* linear — it compresses around the brand color's "true" position to preserve recognition. Recommended L sequence (for a light-mode scale):

| Step | Target L | Role |
| --- | --- | --- |
| 1 | 0.99 | App background |
| 2 | 0.97 | Subtle background |
| 3 | 0.95 | Component background |
| 4 | 0.92 | Hover background |
| 5 | 0.88 | Active background |
| 6 | 0.83 | Subtle border |
| 7 | 0.75 | Interactive border |
| 8 | 0.66 | Strong border / focus |
| 9 | `L_brand` (clamped to 0.55–0.65 range) | Solid background (the brand color itself) |
| 10 | `L_brand` − 0.06 | Hover solid |
| 11 | 0.38 | Low-contrast text (APCA Lc 60 vs step 2) |
| 12 | 0.22 | High-contrast text (APCA Lc 90 vs step 2) |

3. Define the **chroma curve** — peak around the brand step (9), taper toward both ends so tints (1–4) and shades (11–12) don't look unnatural. Recommended chroma multipliers (apply to `C_brand`):

| Step | Chroma factor |
| --- | --- |
| 1, 2 | 0.10× |
| 3 | 0.18× |
| 4 | 0.30× |
| 5 | 0.45× |
| 6 | 0.60× |
| 7 | 0.75× |
| 8 | 0.90× |
| 9 | 1.00× (the brand color) |
| 10 | 0.95× |
| 11 | 0.55× |
| 12 | 0.30× |

4. For **dark mode**, re-derive a parallel scale: invert the L sequence (step 1 darkest, step 12 lightest), reduce overall chroma by 20–40%, and re-check APCA targets against the new step 2.

5. After generation, **verify APCA**: step 11 vs step 2 must clear Lc 60; step 12 vs step 2 must clear Lc 90. If a step fails, drop its L by 0.02 increments until it passes.

**For neutrals:** the same algorithm applies, but `C_brand` is ~0.01–0.03 (a very low chroma — give the neutrals a slight tint toward the brand hue rather than pure grayscale). Pure-grayscale neutrals (`C = 0`) feel sterile against a warm brand.

**Tools that implement this:** Radix Colors generator, Tailwind 4's `oklch()` palette utility, Anna Filou's CSS-only generator, the Observable OKLCH palette notebook, Leonardo (Adobe). Manual implementation is straightforward — a 30-line CSS custom-property generator.

---

## §D — Typography

### D.1 Type families — one or two, never three

**Rule:** Use at most two type families per project. Single-family is the strongest default. A second family is justified only if it serves a clear, separate role (e.g., monospace for code, serif for long-form editorial counterpoint).

Common premium patterns:
- **One sans for everything** (Inter, Söhne, Geist, Aeonik, Suisse, GT America, system stack). The most common pattern in 2026.
- **Sans + Mono.** Sans for narrative + UI; mono for code and tabular metadata.
- **Sans + Serif.** Sans for UI + display; serif for editorial body or pull quotes. Used in narrative-heavy products.

### D.2 Variable fonts — default to variable

**Rule:** Prefer a variable font over multiple static weights. A single variable font file (~80–150 KB woff2) replaces 4–6 static weights (~600 KB–1 MB). Reduces requests, eliminates CLS from late-loading weights, and unlocks intermediate weights for animation.

Required variable axes premium products use:
- `wght` (weight) — 100–900
- `opsz` (optical size) — adjusts letterforms to size; tighter apertures and finer strokes at large sizes, opener apertures and thicker strokes at small sizes. The most important axis for craft. When `opsz` is present, **bind it to the actual rendered size**.
- `wdth` (width) — optional, useful for compressing display headlines

### D.3 Modular scale — fixed ratio across all sizes

**Rule:** All type sizes are derived from a base size × a fixed ratio. Premium ratios:

| Ratio | Name | When to use |
| --- | --- | --- |
| 1.125 | Major Second | Compact UI, data-dense dashboards |
| 1.200 | Minor Third | Balanced default for most product UI |
| 1.250 | Major Third | Spacious / editorial-feeling product UI |
| 1.333 | Perfect Fourth | Marketing sites, dramatic hierarchy |
| 1.414 | Augmented Fourth | Strong editorial / display-led marketing |
| 1.500 | Perfect Fifth | Maximum drama; reserve for hero-led sites |

**Recommended defaults:**
- Product UI: **1.200** or **1.250**
- Marketing site: **1.333** or **1.414** (pair with a dual-scale: tighter ratio on mobile, wider on desktop)

**Dual-ratio fluid typography:** Modern premium sites apply a *tighter* ratio at the mobile end of the scale and a *wider* ratio at the desktop end — so the scale visually "opens up" on larger screens. Interpolate with CSS `clamp(min, vw-based, max)`.

### D.4 Type roles — eight semantic slots

**Rule:** Define exactly these eight type roles. Every text element in the product maps to one of them. No ad-hoc sizes.

| Role | Purpose | Typical size (web) | Weight | Line-height | Letter-spacing |
| --- | --- | --- | --- | --- | --- |
| `display-2xl` | Hero headlines, landing-page anchor | 64–96 px | 600–700 | 1.0–1.05 | -0.03 to -0.04em |
| `display-xl` | Page-level headlines | 48–64 px | 600–700 | 1.05–1.1 | -0.025em |
| `display-lg` | Section headlines | 36–48 px | 600 | 1.1 | -0.02em |
| `heading-md` | Major section headings, modal titles | 24–32 px | 600 | 1.15–1.2 | -0.015em |
| `heading-sm` | Card titles, subsection headings | 18–20 px | 600 | 1.25 | -0.01em |
| `body-lg` | Lead paragraph, marketing body | 18–20 px | 400 | 1.5–1.6 | 0 |
| `body-md` | Default product body, paragraph | 14–16 px | 400 | 1.5 | 0 |
| `body-sm` | Helper text, captions, dense UI | 12–13 px | 400–500 | 1.4 | +0.005em |
| `label-sm` | Form labels, button text, chips | 13–14 px | 500 | 1.0–1.2 | 0 to +0.01em |
| `overline` | Eyebrow text, category labels | 11–12 px | 600 | 1.0 | +0.08 to +0.1em, UPPERCASE |

Mobile sizes scale down by 75–85% of the desktop equivalents (display roles compress more; body roles barely change).

### D.5 Line-height rule — inverse-to-size

**Rule:** Line-height decreases as font-size increases. Hard-coded relationship:

| Font-size range | Line-height (unitless multiplier) |
| --- | --- |
| Display (≥ 36 px) | 1.0–1.1 |
| Heading (20–32 px) | 1.15–1.25 |
| Body (14–18 px) | 1.5–1.6 |
| Small (≤ 13 px) | 1.4 |

Use unitless multipliers (e.g., `1.5`), never fixed pixels. Pixel line-heights break when font size changes.

### D.6 Letter-spacing rule — inverse-to-size, with sign flip at the boundary

**Rule:** Large type → negative tracking. Small type → positive tracking. Body text → zero.

| Font-size range | Letter-spacing |
| --- | --- |
| ≥ 48 px | -0.03 to -0.04em |
| 32–48 px | -0.02 to -0.025em |
| 20–32 px | -0.01 to -0.015em |
| 14–20 px | 0 (default) |
| 11–13 px | +0.005 to +0.02em |
| All caps (any size) | +0.05 to +0.1em |

Reason: type designers optically space metal type for medium body sizes; at extremes the optical spacing breaks down and needs compensation.

### D.7 Weight system — use sparingly

**Rule:** A single screen uses at most three weights. The full system defines four available weights:

| Weight | Use |
| --- | --- |
| 400 (Regular) | Body text |
| 500 (Medium) | UI labels, buttons, emphasized inline body |
| 600 (SemiBold) | Headlines, display |
| 700 (Bold) | Use sparingly — reserve for highest-emphasis display only, or skip entirely if 600 carries the load |

`300` (Light) and below are not in the system — Light weights look fragile next to bold UI components and fail at small sizes.

### D.8 Measure — line length cap

**Rule:** Body text line length is bounded between **45 and 75 characters**. Optimum **~66 characters**. Enforce with `max-width: 65ch` on text containers. Lines longer than 75 characters reduce reading speed measurably; shorter than 45 increases eye saccade frequency.

### D.9 Font feature settings — explicit per role

**Rule:** Define explicit `font-feature-settings` per type role. Premium products use:

| Role | Recommended features |
| --- | --- |
| Body | `"ss01"` (stylistic set if it improves the typeface), `"kern"`, `"liga"` |
| Numeric / tabular data | `"tnum"` (tabular numerals) — guarantees aligned columns |
| Pricing / hero numbers | `"lnum"` (lining), `"tnum"` (tabular) |
| Display | `"ss02"`, `"calt"` (contextual alternates) — engages designer-intended display variants |

Tabular numerals (`tnum`) are mandatory for any table, dashboard, or comparison view containing numbers.

### D.10 Vertical rhythm — soft, not strict

**Rule:** Align type baselines to the spacing scale's base unit *for components and sections*, not for every line of body text. Strict baseline-grid alignment (every line snaps) is brittle on the web. Use the spacing scale to align between **blocks** (headings to body, body to body); allow line-height to drive *within* blocks.

### D.11 Fluid typography — clamp at the boundaries

**Rule:** All type roles use `clamp(min, fluid, max)` rather than fixed `font-size` + breakpoint overrides. Eliminates layout jumps at breakpoints.

```css
/* Illustrative — not Temperance-specific */
--font-display-2xl: clamp(2.5rem, 1.5rem + 4vw, 6rem);
--font-body-md:     clamp(0.875rem, 0.83rem + 0.2vw, 1rem);
```

Use `rem` for the min/max so user font-size preferences (browser zoom, OS text scaling) still work.

### D.12 Mobile — iOS Dynamic Type

**Rule:** iOS apps reference Apple's text styles (Title1, Title2, Title3, Headline, Body, Callout, Subhead, Footnote, Caption1, Caption2). The OS scales them according to user preference (range: xSmall to AX5, total ~310% on iOS 17, up to 400% in newer versions). Custom fonts use `UIFontMetrics` to scale alongside.

Mapping convention:
| Token | iOS style |
| --- | --- |
| `display-xl` | Largest Title |
| `display-lg` | Title1 |
| `heading-md` | Title2 / Title3 |
| `heading-sm` | Headline |
| `body-md` | Body |
| `body-sm` | Subhead / Footnote |
| `label-sm` | Caption1 |
| `overline` | Caption2 (UPPERCASE) |

Never set fixed pixel sizes in iOS for any text role — always reference a system text style or `UIFontMetrics`-scaled custom font.

### D.13 Mobile — Android sp

**Rule:** Android text sizes use `sp` (scale-independent pixels), which respect the user's system text size setting (Android 14+: 85% to 200%, with non-linear scaling above 100%).

Material 3 type scale (sp values):
- Display Large 57 / Medium 45 / Small 36
- Headline Large 32 / Medium 28 / Small 24
- Title Large 22 / Medium 16 / Small 14
- Body Large 16 / Medium 14 / Small 12
- Label Large 14 / Medium 12 / Small 11

Map the eight semantic roles in §D.4 to the Material scale; never hard-code `dp` for text.

### D.14 What never to do in typography

- Use Light or Thin weights in product UI
- Use more than three weights on a single screen
- Use more than two type families
- Set line-height in `px` instead of unitless
- Allow body text longer than 75 characters per line
- Use ALL CAPS without positive letter-spacing
- Use justified body text on the web (creates rivers)
- Use Web Safe fonts (Arial, Helvetica, Times) — they signal generic
- Stack `font-family` with mismatched x-heights without a metric override

---

## §E — Spacing

### E.1 Base unit — 4 px

**Rule:** Adopt **4 px** as the atomic spacing unit. Every spacing value in the system is a multiple of 4. This includes padding, margin, gap, position offsets, and component sizes.

Why 4 over 8: 4 gives the granularity required for compact UI (12 px, 20 px, 28 px values that 8-px-only systems miss) without breaking the rhythm. Premium dense UIs (Linear, Notion, Vercel) use 4-base systems. Marketing-only sites can use 8-base because they don't need 12/20/28-tier values.

### E.2 Spacing scale — geometric with linear early steps

**Rule:** Use a hybrid scale: linear at the small end (where granularity matters), geometric at the large end (where dramatic jumps are needed). Specifically:

| Token | Value | Use |
| --- | --- | --- |
| `space.0` | 0 | Zero spacing |
| `space.0.5` | 2 px | Hairline gaps (icon-text optical) |
| `space.1` | 4 px | Atomic — internal element gaps |
| `space.1.5` | 6 px | Optical adjustments |
| `space.2` | 8 px | Compact gaps |
| `space.3` | 12 px | Inline gaps, button label-icon gap |
| `space.4` | 16 px | Default component gap |
| `space.5` | 20 px | Comfortable component gap |
| `space.6` | 24 px | Internal card padding (compact) |
| `space.8` | 32 px | Internal card padding (default) |
| `space.10` | 40 px | Between major UI groups |
| `space.12` | 48 px | Internal card padding (spacious) |
| `space.16` | 64 px | Between sections (compact mobile) |
| `space.20` | 80 px | Between sections (mobile) / between major blocks |
| `space.24` | 96 px | Between sections (desktop minimum) |
| `space.32` | 128 px | Between sections (desktop generous) |
| `space.40` | 160 px | Hero-to-content gap |
| `space.48` | 192 px | Maximum section gap |

(All step numbers represent the multiple of 4 px — e.g., `space.6` = 6 × 4 = 24 px. This convention matches Tailwind.)

### E.3 The inset / stack / inline pattern

**Rule:** Spacing tokens are applied in one of three patterns. Choose the right pattern; do not mix.

| Pattern | Use | Token kind |
| --- | --- | --- |
| **Inset** | Padding inside a container | Single value (`space.4`) or asymmetric (`space.3` top/bottom, `space.4` left/right) |
| **Stack** | Vertical gap between sibling elements | `gap` on a vertical flex/grid container |
| **Inline** | Horizontal gap between sibling elements | `gap` on a horizontal flex/grid container |

Never mix margin and padding to achieve spacing — use `gap` on the parent and reserve padding for inset.

### E.4 Spacing role conventions

| Role | Token range |
| --- | --- |
| Text-to-icon inline gap | `space.2` (8 px) for body, `space.3` (12 px) for headings |
| Form-label to input gap | `space.2` (8 px) |
| Input to helper text gap | `space.1.5` (6 px) |
| Within a card | `space.6`–`space.12` (24–48 px) |
| Between cards in a list | `space.4` (16 px) compact, `space.6` (24 px) default |
| Section vertical padding (mobile) | `space.16`–`space.20` (64–80 px) |
| Section vertical padding (desktop) | `space.24`–`space.32` (96–128 px) |
| Hero vertical padding (desktop) | `space.32`–`space.48` (128–192 px) |

### E.5 Optical adjustments — declared, not magical

**Rule:** When optical adjustment is required (e.g., an icon needs to sit 1 px higher than its baseline to look centered), declare it as a documented optical override on the specific component, not a system-wide spacing exception. Do not invent in-between values.

---

## §F — Layout & Grid

### F.1 Breakpoints — five steps, mobile-first

**Rule:** Use these five breakpoints, authored mobile-first (default styles target mobile; `min-width` queries layer larger styles on top).

| Token | Min width | Targets |
| --- | --- | --- |
| `xs` | 0 px | Mobile portrait (default — no query needed) |
| `sm` | 640 px | Mobile landscape, small tablets portrait |
| `md` | 768 px | Tablets portrait |
| `lg` | 1024 px | Tablets landscape, small laptops |
| `xl` | 1280 px | Desktop |
| `2xl` | 1536 px | Large desktop |

(Tailwind-equivalent values — broad cross-tool compatibility.)

### F.2 Container widths — capped, centered

**Rule:** Content lives inside containers with explicit max-widths. Premium product sites use:

| Token | Max width | Use |
| --- | --- | --- |
| `container.prose` | 65 ch (~720 px) | Long-form text (article body) |
| `container.sm` | 768 px | Constrained content (single-column forms, FAQs) |
| `container.md` | 1024 px | Standard product content |
| `container.lg` | 1280 px | Default for most marketing landing sections |
| `container.xl` | 1440 px | Wider feature sections, dashboards |
| `container.full` | none | Full-bleed (hero with edge-to-edge imagery) |

Center containers (`margin-inline: auto`) and apply horizontal padding via tokens (`px = space.6` on mobile, `space.8`–`space.12` on desktop) so content does not touch viewport edges.

### F.3 Container queries — prefer over media queries for components

**Rule:** Component-level responsive behavior uses **container queries** (`@container`). Page-level responsive behavior uses **media queries** (`@media`). Container queries are universally supported in evergreen browsers as of 2026.

Reason: a component dropped into a sidebar should respond to the sidebar's width, not the viewport's. Media queries break component reusability.

### F.4 Grid — 12 columns desktop, 4 columns mobile

**Rule:** Use a 12-column grid at `lg+` (divisible by 2, 3, 4, 6 → maximum flexibility). At `sm`–`md` reduce to 8 columns. At `xs` reduce to 4 columns. Gutter scales with breakpoint:

| Breakpoint | Columns | Gutter |
| --- | --- | --- |
| `xs` | 4 | `space.4` (16 px) |
| `sm`–`md` | 8 | `space.5` (20 px) |
| `lg`+ | 12 | `space.6` (24 px) |
| `xl`+ | 12 | `space.8` (32 px) |

### F.5 Composition grammar — the canonical page

**Rule:** Marketing / product landing pages follow this section order unless explicitly justified:

1. **Hero** — full-bleed background, centered or left-aligned content, primary + secondary CTA
2. **Social proof** — monochrome logo wall
3. **Narrative sections** — 2–4 alternating left-text/right-media (and reverse)
4. **Bento grid** — feature showcase with mixed cell sizes
5. **Use-case / persona** — tabbed or stacked content
6. **Testimonial / quote** — single quote or carousel
7. **Pricing** (if product) — comparison table or card row
8. **FAQ** — accordion
9. **Final CTA band** — high-contrast call to action
10. **Footer** — multi-column links + brand mark

Deviation is permitted; the order is the default.

### F.6 Asymmetric layouts within sections

**Rule:** Within a section, prefer asymmetric content distribution over perfect 50/50 splits. Common ratios:

- 5/7 or 7/5 of 12 columns (60/40 visual)
- 4/8 or 8/4 of 12 columns (33/67 visual)
- 3/9 or 9/3 of 12 columns (25/75 visual)

50/50 is the weakest composition because both sides compete for dominance. Premium products consistently use asymmetric splits to create visual hierarchy.

### F.7 Mobile safe areas

**Rule:** All full-bleed elements respect platform safe areas:
- iOS: `env(safe-area-inset-top/bottom/left/right)` for status bar, home indicator, dynamic island, notch.
- Android: System bars (status bar top, nav bar bottom). Use insets API.

Web mobile: respect `env(safe-area-inset-*)` for PWAs and add `viewport-fit=cover` in the viewport meta when full-bleed.

### F.8 Whitespace ratio rule

**Rule:** Whitespace surrounding a content block should be **at least 30–40% of the block's height** for premium feel. Marketing heroes commonly exceed 50%. Compact in-app surfaces drop to ~20% but never below.

---

## §G — Shapes (Radius)

### G.1 Radius scale — six steps

**Rule:** Use exactly these six radius tokens. Pick one and apply consistently per component class — never mix radii within a single composition.

| Token | Value | Use |
| --- | --- | --- |
| `radius.none` | 0 px | Hard-edge elements, data tables, photo crops |
| `radius.sm` | 4 px | Inputs, small chips, code blocks |
| `radius.md` | 8 px | Buttons, badges, small cards |
| `radius.lg` | 12 px | Cards, panels |
| `radius.xl` | 16 px | Large cards, modals (default) |
| `radius.2xl` | 24 px | Hero cards, large modals |
| `radius.full` | 9999 px | Avatars, pill buttons, circular icon containers |

Recent premium products (Linear, Mercury, Vercel) lean to `radius.lg`–`radius.xl` on cards (12–16 px). Hard-edge / `radius.sm` is the "engineered" aesthetic (Stripe, Carbon).

### G.2 Nested radius — the inner = outer − padding rule

**Rule:** When an element nests inside another rounded container, the inner radius equals the outer radius minus the gap between them.

```
inner_radius = outer_radius − padding
```

Example: a card with `radius.xl` (16 px) and `space.4` (16 px) internal padding — the immediate child element's radius is `16 − 16 = 0`. A card with `radius.xl` (16 px) and `space.6` (24 px) padding — inner radius can be `16 − 24 = -8`, so clamp to 0; the inner element must be square-cornered.

This formula keeps concentric curvature visually parallel. Violating it makes nested rounded elements look broken.

### G.3 Continuous corners (squircles) for mobile and hero contexts

**Rule:** On iOS and in any hero-scale rounded surface, prefer **continuous (squircle) corners** over circular-arc corners.

Apple's app icon corner radius is approximately 22.37% of the icon width using a superellipse (n=2). The difference between a circular-arc rounded rectangle and a squircle is subtle but perceptible at large sizes — the squircle eliminates the visible "kink" where the straight edge meets the curve.

Implementation:
- iOS native: use `RoundedRectangle(cornerRadius:, style: .continuous)` in SwiftUI.
- Web: CSS `corner-shape: squircle` is shipping (2026); fallback to `border-radius` with a slightly larger value (~15% larger) to approximate.
- Below ~12 px radius, the difference is invisible — circular-arc is fine.

### G.4 Mixing radii — forbidden

**Rule:** A single composition uses one radius family. Never combine sharp (`radius.none`/`sm`) with soft (`radius.xl`/`2xl`/`full`) in the same view. The aesthetic dissonance reads as a design mistake.

---

## §H — Elevation & Depth

### H.1 Elevation scale — six levels, including 0

**Rule:** Define exactly six elevation levels (0 through 5). Each is a complete shadow specification, not a `box-shadow` value invented per use.

| Token | Use | Layered shadow specification |
| --- | --- | --- |
| `elevation.0` | Flat (page background, full-bleed sections) | none |
| `elevation.1` | Resting cards on canvas | Two-layer: tight key + soft ambient. e.g., `0 1px 2px rgba(neutral,0.06), 0 1px 3px rgba(neutral,0.08)` |
| `elevation.2` | Raised cards, dropdown menus, popovers | `0 2px 4px rgba(neutral,0.06), 0 4px 8px rgba(neutral,0.08)` |
| `elevation.3` | Tooltips, navigation menus | `0 4px 8px rgba(neutral,0.06), 0 8px 16px rgba(neutral,0.10)` |
| `elevation.4` | Modals, sheets | `0 8px 16px rgba(neutral,0.08), 0 16px 32px rgba(neutral,0.12)` |
| `elevation.5` | Overlays, fullscreen takeovers | `0 16px 32px rgba(neutral,0.10), 0 32px 64px rgba(neutral,0.16)` |

### H.2 Layered shadows — never single

**Rule:** Every non-zero elevation token combines **at least two shadows**: one tight "key" shadow that defines the edge, and one soft "ambient" shadow that defines distance. Single shadows look flat and synthetic.

### H.3 Tinted shadows — match the canvas

**Rule:** Shadow color is not pure black. It is the **darkest neutral** of the current palette with reduced opacity. In dark mode, shadows shift to a slightly cooler / deeper tint, often with lower opacity (because dark surfaces show light shadows poorly).

| Mode | Shadow base color | Opacity range |
| --- | --- | --- |
| Light | `neutral.12` (warmest near-black) | 6–16% per layer |
| Dark | `neutral.1` slight cool shift | 20–40% per layer (heavier to be visible) or omit shadows entirely and use border + surface contrast |

Pure `rgba(0,0,0,…)` shadows look muddy and disconnected from the brand. Always tint.

### H.4 Borders vs shadows vs surface — choose one separation strategy

**Rule:** For any given separation, use exactly one of: a border, a shadow, or a surface-tone change. Never combine all three on a single element.

| Strategy | Use case |
| --- | --- |
| **Border only** (`border.subtle`) | Flat / engineered aesthetic (Linear, Vercel). Best for dense UI. |
| **Shadow only** (`elevation.1`+) | Warm / dimensional aesthetic. Best for marketing and consumer products. |
| **Surface-tone only** (`surface.raised`) | Maximum minimalism. Common in dark-mode-first products. |

Premium dark-mode UIs frequently use **surface-tone + border** (a slightly lighter background + a 1 px subtle border) and **omit shadows entirely** because shadows do not render well on near-black.

### H.5 Z-index — six layers only

**Rule:** Define six z-index tokens. Never use raw numbers in component code.

| Token | Value | Use |
| --- | --- | --- |
| `z.base` | 0 | Default flow content |
| `z.dropdown` | 1000 | Dropdown menus, autocompletes |
| `z.sticky` | 1100 | Sticky navigation, headers |
| `z.fixed` | 1200 | Floating action buttons |
| `z.overlay` | 1300 | Modal backdrops |
| `z.modal` | 1400 | Modal content |
| `z.popover` | 1500 | Popovers (above modals when needed) |
| `z.tooltip` | 1600 | Tooltips (always topmost) |

### H.6 Mobile elevation — flatter than web

**Rule:** Mobile UI uses elevation more sparingly than web. iOS especially is materially flatter — most surfaces are flat with separation handled by subtle borders or grouped backgrounds. Reserve elevation for floating elements (cards in scrollable lists, modals, sheets, FABs on Android).

Android Material 3 still uses elevation actively (FABs, navigation, raised cards) but the 2025+ "Expressive" guidance reduces shadow intensity and increases tonal differentiation as the primary depth cue.

---

## §I — Motion

### I.1 Duration scale — five tokens

**Rule:** Define exactly five duration tokens, geometric progression. Every animation in the system uses one of these.

| Token | Value | Use |
| --- | --- | --- |
| `duration.instant` | 100 ms | Hover state color shifts, tooltip reveal |
| `duration.fast` | 150 ms | Most micro-interactions (button press, focus ring) |
| `duration.base` | 200 ms | Default — dropdowns, popovers, small reveals |
| `duration.slow` | 300 ms | Modals, sheets, large surface transitions |
| `duration.deliberate` | 500 ms | Hero entrance, page transitions, narrative reveals |

**Distance-relative rule:** Larger displacement takes longer. A full-screen modal opens at `duration.slow`; a 32-px dropdown opens at `duration.base`. Never animate large surfaces with `instant` or `fast`.

### I.2 Easing curves — four named curves

**Rule:** Define four easing tokens. Use each only in its declared role.

| Token | cubic-bezier | Use |
| --- | --- | --- |
| `ease.standard` | `cubic-bezier(0.2, 0, 0, 1)` | Most transitions (default) — Material's "standard" curve |
| `ease.emphasized` | `cubic-bezier(0.2, 0, 0, 1.0)` with longer duration | Hero / important reveals — slower start, decisive arrival |
| `ease.decelerate` (entry) | `cubic-bezier(0, 0, 0, 1)` | Elements entering the viewport — fast in, soft landing |
| `ease.accelerate` (exit) | `cubic-bezier(0.3, 0, 1, 1)` | Elements leaving the viewport — soft start, fast departure |

**Usage distribution (the 60/30/10 rule):** ~60% of animations use `ease.standard`/`ease.decelerate`. ~30% use `ease.accelerate` for exits. ~10% use `ease.emphasized` for hero moments.

**Never use `linear`** for UI transitions except for indeterminate loaders or rotation animations.

### I.3 Spring physics — for gesture-driven motion

**Rule:** For interactions tied to user gestures (drag-to-dismiss, pull-to-refresh, sheet snapping, swipe actions, drag-and-drop), use **spring physics** rather than bezier easing. Springs respond to velocity and feel "connected" to the gesture.

Define three spring presets:

| Token | Stiffness | Damping | Use |
| --- | --- | --- | --- |
| `spring.gentle` | 170 | 26 | Modals, sheets, gentle settles |
| `spring.snappy` | 300 | 30 | Toggles, switches, quick reveals |
| `spring.bouncy` | 400 | 22 | Playful flourishes (use sparingly) |

(Values shown match Framer Motion / iOS spring conventions; equivalent translations exist for React Native Reanimated, SwiftUI `interactiveSpring`, Compose `Spring.StiffnessHigh`, etc.)

### I.4 Reduced motion — required first-class behavior

**Rule:** Honor `prefers-reduced-motion: reduce`. When set:
- Disable: parallax, scroll-driven scale/rotation, auto-playing carousels, decorative loops, hero entrance animations.
- Replace fade+slide with fade-only (keep opacity transitions; remove transform).
- Keep: focus indicators, state color transitions, essential disclosure animations.

This is mandatory, not optional. Premium systems treat reduced-motion as a parallel set of animation tokens, not a "disabled" flag.

### I.5 Animation orchestration — stagger and delay

**Rule:** When animating multiple elements (e.g., a list reveal), stagger entries by **30–80 ms** per item. Beyond 80 ms feels slow; below 30 ms reads as simultaneous.

Choreography rules:
- Out before in: exit existing element fully before new element enters. No crossfades for unrelated content.
- Smallest moves first: a card lifts (`fast`) before its label fades in (`instant`).
- Single focal point per moment: never animate two unrelated regions in the same beat.

### I.6 Scroll-triggered animation — purposeful only

**Rule:** Scroll-triggered animation is permitted only when it serves explanation or narrative pacing. Decorative scroll animation is prohibited. Reference: Pixel Point's Cluely work — animation explains how an "invisible" product works; it is not a "scroll effect."

Constraints:
- Trigger once per element (do not re-animate on scroll-back).
- Use Intersection Observer or CSS `animation-timeline: view()` (supported in Chromium 2026; fall back to JS).
- Duration: `duration.slow` or `duration.deliberate`.
- Easing: `ease.decelerate`.
- Threshold: trigger when ~25% of element is in viewport.

### I.7 Hover and pressed transitions

**Rule:** All hoverable elements transition their state changes (color, scale, shadow) with `duration.fast` + `ease.standard`. Never snap instantly; never linger past `duration.base`.

### I.8 Continuous (looping) animation budget

**Rule:** No more than **one continuous looping animation per viewport at a time**. Background pulses, animated illustrations, and shimmer effects compete for attention; cap at one.

### I.9 Motion choreography — multi-element orchestration

When animating more than one element, the AI must choreograph timing rather than triggering all motion simultaneously. The following patterns codify premium motion choreography.

**Stagger curves** — for sequential reveals of N items, the per-item delay should follow one of three curves:

| Curve | Per-item delay | Use |
| --- | --- | --- |
| **Linear** | constant `30–80 ms` per item | Default lists, navigation reveals (≤ 8 items) |
| **Ease-out** | larger delay early, tighter later | Long lists where first items are most important |
| **From-anchor** | items closer to an anchor point fire first | Cards expanding from a button, dropdown radiating from trigger |

Total stagger duration should not exceed `duration.deliberate × 1.5` (~750 ms) — beyond that, the reveal feels slow.

**Choreography rules:**

1. **Smallest moves first, largest moves last.** A card lifts (subtle) before its content fades in (medium) before its icon scales (largest).
2. **One focal point per beat.** Never animate two unrelated regions in the same time window. The eye can only attend to one thing.
3. **Out before in.** When swapping content, the outgoing element completes its exit before the incoming element starts entering. Cross-fades are reserved only for *related* content swaps (same image at higher resolution; same component in different state).
4. **Hold to absorb.** When two adjacent animations would chain immediately, insert a `50–100 ms` hold to let the eye register the first before the second begins.
5. **Don't choreograph what doesn't need choreography.** Hover states, focus rings, and small toggles should fire instantly without coordination — choreography is for *narrative* motion.

### I.10 The FLIP technique — for layout-change animations

**Rule:** When an element changes position, size, or layout (rearranging a list, expanding a card to fill the screen, moving from grid to modal), use the **FLIP** technique:

- **F**irst: measure the element's starting position/size
- **L**ast: apply the final state immediately (snap to end)
- **I**nvert: apply a `transform` to make it visually appear at the starting position
- **P**lay: animate the `transform` to zero, releasing the element to its real final position

This avoids animating expensive properties (`width`, `height`, `top`, `left`) and lets the GPU handle the motion via `transform`. Performance jump: layout-thrash animations gain ~85% smoother frame rates with FLIP.

**Libraries that implement FLIP automatically:** Framer Motion's `layout` prop, GSAP's Flip plugin, Motion One's auto-animate.

### I.11 Shared-element transitions

**Rule:** When the same conceptual element appears in two views (a card in a list → an expanded detail view), animate it as a **shared element** rather than dismounting and remounting.

- React/Framer Motion: `layoutId` on both source and destination elements
- Native CSS: `View Transitions API` (`document.startViewTransition()`) with `view-transition-name` matching pairs
- iOS: `matchedGeometryEffect`
- Android Compose: shared element transitions via `SharedTransitionLayout`

The element "morphs" between views, preserving the user's spatial model. Especially powerful for image-led products where the same image appears in a grid and an enlarged view.

### I.12 View Transitions API — modern web standard

**Rule:** For full-page navigation or significant layout changes on the web, prefer the native **View Transitions API** over JS-driven animation libraries.

- Browser support: Chrome 111+, Edge 111+, Safari 18+ (with prefix earlier), Firefox in progress as of 2026
- Syntax: `document.startViewTransition(() => updateDOM())`
- Pair with `view-transition-name` CSS to identify shared elements across the transition
- Falls back gracefully when unsupported (no transition, just instant update)

Use for: route changes in SPAs, modal opens, sheet expansions, layout reshuffles. Avoid for: simple hover/focus state changes (CSS transitions are already optimal).

### I.13 Property animation budget — what to animate

**Rule:** Animate **only `transform` and `opacity`** on the main render path. These are GPU-composited and do not trigger layout or paint.

| Property | Cost | Use? |
| --- | --- | --- |
| `transform` | GPU-only | ✓ Always |
| `opacity` | GPU-only | ✓ Always |
| `filter` (blur, brightness) | Paint | Sparingly — performance impact at large sizes |
| `background-color` | Paint | Acceptable for color-state transitions |
| `width` / `height` | Layout + paint | Avoid — use `transform: scale` |
| `top` / `left` / `right` / `bottom` | Layout + paint | Avoid — use `transform: translate` |
| `margin` / `padding` | Layout + paint | Avoid — use FLIP if necessary |

When animating `width` or `height` is unavoidable (e.g., accordion expansion), use `max-height` with a generous ceiling, or use FLIP, or scope the animation to small regions where the layout cost is acceptable.

### I.14 Choreographing reduced-motion variants

**Rule:** Each choreographed sequence must have a reduced-motion equivalent:

| Full motion | Reduced motion |
| --- | --- |
| Stagger reveal | Single fade-in (no movement, no per-item delay) |
| Hero entrance with scale | Hero appears instantly |
| Modal scale + fade | Modal fade only |
| Shared element transition | Instant swap |
| Parallax | None (static) |
| Auto-rotating carousel | Static; user must advance |

Reduced motion is not "no animation" — it is "no *vestibular* animation" (transform, scale, parallax). Opacity transitions are usually preserved.

---

## §J — States

### J.1 Canonical state set — ten states

**Rule:** Every interactive component defines, at minimum, these states. States with no visual difference from default may inherit, but must be acknowledged in the spec.

| State | Trigger |
| --- | --- |
| `default` | Resting state |
| `hover` | Pointer over element (pointer-precision devices only) |
| `focus` | Programmatic focus (not necessarily visible) |
| `focus-visible` | Keyboard-induced focus (always visible ring) |
| `active` / `pressed` | During click / tap |
| `disabled` | Not interactive |
| `loading` | Performing async work |
| `selected` | Persistently chosen (in a multi-select / nav / tab) |
| `error` / `invalid` | Failed validation, error condition |
| `success` / `valid` | Confirmed positive validation (for inputs only) |

### J.2 Focus ring — explicit, visible, consistent

**Rule:** Define a single focus-ring style applied across every focusable element via `:focus-visible`.

| Property | Value |
| --- | --- |
| Ring color | `primary.8` (interactive border step) — high contrast against any surface |
| Ring width | 2 px |
| Ring offset | 2 px (so the ring sits *outside* the element, not on its edge) |
| Border-radius | matches the element's own radius + offset |
| Transition | `duration.fast` `ease.standard` |

Never remove the focus ring on `:focus`. Only suppress it on pointer-induced focus via `:focus:not(:focus-visible)` if necessary, never globally.

### J.3 Touch states (mobile)

**Rule:** Mobile interactions use a brief darkening / lightening of the element instead of a hover state (mobile has no hover). Specifically:

- **iOS:** Dim the element to ~80% brightness during press. Release reverts over `duration.fast`. SwiftUI `pressEvents` modifier.
- **Android (Material):** Apply a ripple effect originating at the touch point. Ripple color is the current text color at 12–24% opacity. Use `MaterialRipple` / `rippleColor`.
- **Touch-web:** Suppress hover styles on `(hover: none)` media query. Apply a brief active-state on `:active` (e.g., 4% darkening), then release.

### J.4 Disabled state — never use opacity alone

**Rule:** Disabled state uses explicit token values, not opacity multiplication:

| Property | Disabled value |
| --- | --- |
| Background | `neutral.3` (subtle background) |
| Text / icon | `neutral.8` (interactive border step, low contrast) |
| Border | `neutral.6` (subtle border) |
| Cursor | `not-allowed` |
| Pointer-events | unchanged (so tooltips / aria still respond) |

`opacity: 0.5` stacked over arbitrary surfaces produces unpredictable contrast and often fails APCA.

### J.5 Loading state — three patterns

**Rule:** Use exactly one of these three loading patterns per context:

| Pattern | When |
| --- | --- |
| **Spinner inside button** | Action-triggered, action < 3 s — preserves layout, communicates pending |
| **Skeleton screen** | Initial content load — preserves layout, indicates structure |
| **Progress bar** | Determinate operation (upload, download) |

Never use a global "page spinner" as the primary loading pattern. Skeletons preserve layout and feel faster.

### J.6 State transition timing matrix

| From → To | Duration | Easing |
| --- | --- | --- |
| default → hover | `fast` | `standard` |
| hover → default | `fast` | `standard` |
| any → pressed | `instant` | `standard` |
| pressed → release | `fast` | `decelerate` |
| any → focus-visible | `fast` | `standard` |
| any → disabled | `base` | `standard` |
| default → loading | `fast` | `standard` |
| valid → error | `base` | `standard` (shake/pulse forbidden unless reduced-motion-safe) |

---

## §K — Iconography

### K.1 Icon size scale — six steps, all multiples of 4

**Rule:** Define exactly these six icon sizes. Match each to a text role.

| Token | Size | Pairs with text role |
| --- | --- | --- |
| `icon.xs` | 12 px | `overline`, `body-sm` inline |
| `icon.sm` | 16 px | `body-md` inline (default) |
| `icon.md` | 20 px | `body-lg`, `label-sm` (buttons) |
| `icon.lg` | 24 px | `heading-sm` (default standalone icon) |
| `icon.xl` | 32 px | `heading-md`, feature-card icons |
| `icon.2xl` | 48 px | Hero / feature illustration |

### K.2 Stroke weight — paired to text weight

**Rule:** Outline icon stroke weight pairs with the weight of adjacent text:

| Text weight | Icon stroke |
| --- | --- |
| 400–500 | 1.5 px |
| 600 | 1.75 px |
| 700 | 2 px |

When the icon size is 24 px or smaller, use 1.5 px regardless. Below 16 px, prefer filled icons over outline (outline strokes become indistinct).

### K.3 Optical alignment — adjust against the cap height

**Rule:** Center icons optically against the text **cap height**, not the line-box. Most icons appear sunk if aligned to line-box because cap height is shorter than the em-box. Apply a `vertical-align` or flexbox `align-items` shift of approximately 1–2 px upward when pairing with text.

Icons containing a single dominant element (an arrow, a play triangle) often need additional asymmetric optical adjustment to look centered. Bake this into the SVG export, not the layout.

### K.4 Filled vs outline — single convention

**Rule:** Each project picks **either** outline-default or filled-default. Mixing within the same UI surface is forbidden. Common pattern: outline for inactive nav items, filled for the active nav item (a single, declared exception).

### K.5 Icon families to consider

Premium products in 2026 use:
- **Lucide** — open-source, 1.5-px stroke, paired with most modern systems
- **Phosphor** — supports six weights (thin/light/regular/bold/fill/duotone)
- **Heroicons** — Tailwind's official, only outline + solid
- **Tabler** — large catalog, 1.5-px stroke
- **Custom** — when brand differentiation matters, a small custom set (~30 icons) used alongside a base library

Never mix icon families on the same surface — even similar styles read as inconsistent.

### K.6 Decorative vs functional icons — ARIA

**Rule:** Functional icons (sole label for a button) require `aria-label`. Decorative icons (paired with visible text) require `aria-hidden="true"`. Default to `aria-hidden` unless the icon is the only label.

---

## §L — Imagery

### L.1 Aspect ratio tokens

**Rule:** Standardize image aspect ratios via tokens. Premium products use a small set:

| Token | Ratio | Use |
| --- | --- | --- |
| `aspect.square` | 1:1 | Avatars, thumbnails, social posts |
| `aspect.portrait` | 4:5 | Profile photos, magazine portraits |
| `aspect.landscape` | 3:2 | Product hero photography, gallery |
| `aspect.video` | 16:9 | Video, screen recordings, dashboards |
| `aspect.wide` | 21:9 | Cinematic hero |
| `aspect.classic` | 4:3 | Legacy / vintage feel |

CSS: `aspect-ratio: 16/9` reserves layout space and prevents CLS.

### L.2 Image treatments — define the available set

**Rule:** Define an explicit set of image treatments. Use only these:

- **Plain** — no treatment, full color
- **Duotone overlay** — single-hue duotone for stylized backgrounds
- **Darken overlay** — dark gradient overlay for text-on-image legibility (ensure APCA passes against the image's lightest pixel)
- **Edge-fade** — soft fade to the surface color at one or more edges (used for media inside cards)

No: blurs as a treatment (use placeholders only), heavy filters, drop shadows on photo elements.

### L.3 Placeholder strategy — three patterns

**Rule:** Every image declares a placeholder. Use one of:

| Pattern | When |
| --- | --- |
| **Skeleton** | Above-the-fold images that will load | Solid `surface.subtle` rectangle in the image's aspect ratio |
| **BlurHash / LQIP** | Below-the-fold images, especially feeds | Encoded blurred preview swapped on load |
| **SVG silhouette** | Avatars / profile photos pre-load | Initials or generic person silhouette |

### L.4 Avatars — circular, with safe-area fallback

**Rule:** Avatars are circular (`radius.full`). Sizes match the icon scale (16 / 20 / 24 / 32 / 48 / 64 / 96 px). Fallback when image is missing: tinted background derived from a hash of the user's name + the user's initials in `label-sm`, `weight 600`, centered.

### L.5 Photography style — declared once

**Rule:** The project commits to a photography style (e.g., "neutral lifestyle, soft natural light, warm color grade, real people not models, no stock-photo headsets"). This declaration lives in the brand-context section, not in the rule set. Adherence is verified by reference, not by tokens.

### L.6 Illustration style — preference over stock

**Rule:** Premium products prefer custom illustration over stock photography for hero and feature imagery. Allowed styles:
- Vector illustration (Rive / Lottie for animation)
- 3D rendering (Spline, Blender exports)
- Abstract / geometric / data visualization
- AI-generated art **only when curated and stylistically consistent** with the brand

Stock photography is permitted in long-tail use cases (blog headers, testimonial portraits) but never in primary marketing surfaces of premium-tier products.

### L.7 Modern image loading — format, priority, lazy

**Rule:** Every raster image follows this loading stack:

**Format priority:** Serve **AVIF first**, **WebP fallback**, **JPEG safety net** via `<picture>` source selection. AVIF saves ~50% vs JPEG and 20–30% vs WebP at equivalent visual quality.

```html
<picture>
  <source type="image/avif" srcset="hero.avif" />
  <source type="image/webp" srcset="hero.webp" />
  <img src="hero.jpg" alt="…" />
</picture>
```

**Responsive sizes:** Always declare both `srcset` and `sizes`:

```html
<img
  srcset="hero-640.avif 640w, hero-1024.avif 1024w, hero-1920.avif 1920w"
  sizes="(min-width: 1280px) 1280px, 100vw"
  alt="…" />
```

**Loading priority hierarchy:**
- `fetchpriority="high"` — **exactly one image per page** (the LCP image, typically hero)
- `fetchpriority="low"` — below-the-fold decorative images
- Default — everything else

Misuse: marking many images `high` defeats the purpose. Google Flights cut LCP from 2.6 s → 1.9 s with one correct high-priority annotation.

**Lazy vs eager:**
- First 3–6 images in viewport: `loading="eager"`
- Below-the-fold: `loading="lazy"`
- **Never lazy-load the LCP image** — defeats Largest Contentful Paint
- Carousels: first slide eager, rest lazy

**CLS prevention (mandatory):** every image declares explicit `width` and `height` attributes OR uses `aspect-ratio` CSS. Layout-shift is a premium-tier failure.

**Preload pattern** for the hero:

```html
<link rel="preload" as="image" href="hero.avif"
      imagesrcset="hero-640.avif 640w, hero-1024.avif 1024w, hero-1920.avif 1920w"
      imagesizes="(min-width: 1280px) 1280px, 100vw"
      fetchpriority="high" />
```

**CDN considerations:** when serving format-negotiated images via `Accept` header, the CDN must include `Vary: Accept` in the response header — otherwise an AVIF can be cached and served to unsupporting clients.

### L.8 Dark-mode image swap

**Rule:** When a single image looks wrong in both modes (e.g., a screenshot with light UI), supply a separate dark-mode variant via `<picture>` with `prefers-color-scheme`:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="screenshot-dark.avif" />
  <img src="screenshot-light.avif" alt="…" />
</picture>
```

This is the only correct way — never use `filter: invert()` on raster images (destroys color fidelity, distorts skin tones in photographs).

---

## §M — Density & Responsive

### M.1 Density modes — three explicit tokens

**Rule:** Define three density modes per product. A surface declares its mode; components inherit.

| Mode | Use | Multiplier on spacing |
| --- | --- | --- |
| `density.compact` | Data-dense surfaces (tables, dashboards) | × 0.75 |
| `density.comfortable` | Default (most product UI) | × 1.0 |
| `density.spacious` | Marketing, onboarding, content-led surfaces | × 1.25 |

Density does not change *component* sizes (button heights stay constant for touch-target compliance). It only changes *between-component spacing*.

### M.2 Touch targets — minimums per platform

**Rule:** Interactive elements meet the following minimum touch / pointer target sizes:

| Context | Minimum | Recommended |
| --- | --- | --- |
| **Mobile (iOS / Android)** | 44 × 44 pt iOS / 48 × 48 dp Android | 48 / 56 |
| **Touch web (PWAs)** | 44 × 44 px | 48 px |
| **Pointer web (mouse/trackpad)** | WCAG 2.5.8 AA: 24 × 24 px | 36–44 px |
| **Inline links in body text** | (Exempted from 24 px under WCAG 2.5.8) | Increase line-height to 1.6+ for tappability |

Spacing between adjacent targets: minimum 8 px. Premium standard: 12 px.

### M.3 Responsive — container queries first, media queries second

**Rule:** Components respond to their container width (`@container`). Pages respond to viewport (`@media`). Mix only when explicitly required.

### M.4 Fluid scaling — clamp() across the system

**Rule:** Fluid (clamp-based) values apply to: type sizes, section padding, container widths. Discrete (token-based) values apply to: component sizing, internal padding, radii, border widths.

### M.5 Adaptive layout patterns

| Breakpoint | Composition default |
| --- | --- |
| `xs` | Single column, full-width, generous vertical spacing |
| `sm`–`md` | Two-column grids reduce to single; navigation collapses to hamburger or bottom-sheet |
| `lg`+ | Multi-column grids appear; sidebar navigation becomes feasible |

---

## §N — Accessibility

### N.1 Contrast — WCAG 2.2 baseline, APCA preferred

**Rule:** Body text and meaningful UI elements meet **WCAG 2.2 AA** (4.5:1 normal, 3:1 large/UI). Additionally test against **APCA**; reject pairings below **Lc 60** for body or **Lc 75** for small/fine print.

### N.2 Focus visibility — required, consistent

**Rule:** Every focusable element shows a visible focus indicator on keyboard focus. Indicator must:
- Have minimum 3:1 contrast against the element's background AND the surrounding area
- Be at least 2 px thick OR equivalent perimeter area (WCAG 2.4.11)
- Match the `:focus-visible` style defined in §J.2

### N.3 Touch target — meet WCAG 2.5.8 minimum, prefer enhanced

**Rule:** As detailed in §M.2. Never below 24 × 24 px on pointer devices; never below 44 × 44 on touch.

### N.4 Reduced motion — honored everywhere

**Rule:** As detailed in §I.4. `prefers-reduced-motion: reduce` disables decorative motion and replaces transform+fade with fade-only.

### N.5 Color is never the sole signal

**Rule:** Status, validation, and meaning communicated by color must also be communicated by a non-color cue (icon, label, pattern, shape, position). Tested by viewing the screen in grayscale.

### N.6 Minimum text sizes per platform

| Platform | Minimum body |
| --- | --- |
| Web (desktop) | 14 px |
| Web (mobile) | 16 px (prevents iOS auto-zoom on input focus) |
| iOS | 11 pt Caption2 (minimum allowable); 17 pt Body (recommended default) |
| Android | 12 sp (minimum); 14 sp (recommended default) |

Form inputs on mobile web must use ≥ 16 px font-size or iOS Safari auto-zooms on focus — a real bug that breaks UX.

### N.7 Heading hierarchy is semantic, not visual

**Rule:** Use HTML heading elements (`h1`–`h6`) in semantic order. Visual sizing comes from type-role tokens applied via class. A `display-2xl` styled element can be an `<h1>` or an `<h2>` depending on document structure; the visual size and the semantic level are independent decisions.

### N.8 Forms — labels are required and visible

**Rule:** Every form input has a visible `<label>`. Placeholder text is not a substitute (disappears on input, fails contrast on default).

### N.9 ARIA — only when native semantics fail

**Rule:** Prefer native HTML elements (`<button>`, `<a>`, `<input>`, `<dialog>`) over `<div role="…">`. Use ARIA only when no native equivalent exists. The first rule of ARIA is "don't use ARIA."

### N.10 Mobile platform a11y APIs

- **iOS:** Support VoiceOver via `accessibilityLabel`, `accessibilityTraits`, `accessibilityHint`. Honor `UIAccessibility.isReduceMotionEnabled`, `prefersCrossFadeTransitions`, `isBoldTextEnabled`.
- **Android:** Support TalkBack via `contentDescription`, `Role`. Honor `Settings.Global.ANIMATOR_DURATION_SCALE`.

### N.11 The full preference media-query stack

**Rule:** Honor all six accessibility preference media queries — not just `prefers-reduced-motion`:

| Media query | Trigger | Behavior |
| --- | --- | --- |
| `prefers-color-scheme: dark` | User OS dark mode | Switch to dark palette |
| `prefers-reduced-motion: reduce` | Motion sensitivity / vestibular | Strip transform animations; keep opacity. See §I.14 |
| `prefers-reduced-transparency: reduce` | Translucency causing legibility issues | Replace `backdrop-filter: blur()` and translucent surfaces with solid backgrounds; replace `opacity < 1` overlays with solid color equivalents |
| `prefers-contrast: more` | User needs higher contrast | Increase border weights to 2 px; switch text from step 11 to step 12; deepen disabled state colors |
| `prefers-contrast: less` | User finds default too harsh | Soften shadows; reduce text contrast slightly |
| `forced-colors: active` | Windows High Contrast Mode (and equivalents) | The browser overrides colors with system palette. **Author for it: use `system-color` keywords like `Canvas`, `ButtonText`, `LinkText`, `Highlight`. Never `display: none` content that would be invisible in forced colors — supply a forced-color alternative.** |

**Forced-colors specifics:**
- Background images, gradients, and box-shadows are stripped — supply solid borders or text-based alternatives
- `forced-color-adjust: none` opts an element out of forced-color override (use sparingly — only for brand marks where forced color destroys recognition)
- Test in Windows + Edge with High Contrast Mode on, or use Chrome DevTools' "Emulate CSS Media" → `forced-colors: active`

**Default rule:** every theme must specify behavior for at least `prefers-color-scheme`, `prefers-reduced-motion`, and `forced-colors`. The others are optional but premium.

### N.12 Skip links and landmarks

**Rule:** Every page provides:
- A **skip-to-main-content** link as the first focusable element, visually hidden until focused
- Proper landmark roles via semantic HTML: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` — at least one `<main>` per page
- Heading hierarchy starting from `<h1>` (one per page) without skipping levels

### N.13 Live regions for dynamic updates

**Rule:** When content updates without user action (toast notifications, validation feedback, search results updating, chat messages arriving), announce via ARIA live regions:

- `aria-live="polite"` — most updates (toasts, success messages)
- `aria-live="assertive"` — only critical interruptions (errors that block progress)
- `role="status"` for non-critical, `role="alert"` for critical
- Use sparingly — over-announced UIs are exhausting for screen-reader users

### N.14 Brand names and translation

**Rule:** Wrap brand names with `<span translate="no">` to prevent auto-translation. "Temperance" should not become "Templanza" in a translated page.

---

## §O — Components (Atoms)

For each component: **Anatomy** (named parts), **Sizes** (three sizes minimum), **Variants** (style options), **Padding** (in tokens), **Radius**, **Typography**, **State styling**.

All values below are premium-standard ranges observed across Linear, Vercel, Stripe, Mercury, Notion, shadcn/ui, Radix Themes. They are template defaults — projects may override but must justify deviation.

### O.1 Button

**Anatomy:** `container > [leading-icon?] + label + [trailing-icon?]`

**Sizes:**

| Size | Height | Padding (H × V) | Type role | Icon size | Icon-only width |
| --- | --- | --- | --- | --- | --- |
| `sm` | 32 px | 12 × 6 px | `label-sm` (13 px / 500) | `icon.sm` (16) | 32 px |
| `md` (default) | 40 px | 16 × 10 px | `label-sm` (14 px / 500) | `icon.md` (20) | 40 px |
| `lg` | 48 px | 20 × 12 px | `body-md` (15 px / 500) | `icon.md` (20) | 48 px |
| `xl` | 56 px | 24 × 16 px | `body-lg` (16 px / 600) | `icon.lg` (24) | 56 px |

**Radius:** `radius.md` (8 px) for `sm`/`md`. `radius.lg` (12 px) for `lg`/`xl`. `radius.full` for pill variant.

**Icon-to-label gap:** `space.2` (8 px) for `sm`/`md`; `space.3` (12 px) for `lg`/`xl`.

**Variants:**

| Variant | Background | Border | Text | When |
| --- | --- | --- | --- | --- |
| `primary` | `primary.9` | none | white (or `primary.contrast`) | Single primary action per screen |
| `secondary` | `neutral.3` | `neutral.7` 1 px | `neutral.12` | Secondary actions, paired with primary |
| `outline` | transparent | `neutral.7` 1 px | `neutral.12` | Standalone secondary |
| `ghost` | transparent | none | `neutral.12` | Toolbar buttons, low-emphasis actions |
| `link` | transparent | none | `primary.11` | Inline text actions, navigation away |
| `destructive` | `danger.9` | none | white | Delete / destructive only |

**States** (apply to all variants):

| State | Modification |
| --- | --- |
| `hover` | Background → step + 1 (e.g., `primary.9` → `primary.10`); transitions in `duration.fast` `ease.standard` |
| `pressed` | Background → step + 2; instant; on release, return at `fast` |
| `focus-visible` | 2 px ring of `primary.8` with 2 px offset (see §J.2) |
| `disabled` | Background `neutral.3`, text `neutral.8`, no hover/press, cursor `not-allowed` |
| `loading` | Replace label with spinner, preserve width (no layout shift), keep `aria-busy="true"` |

**Never:** Apply shadow + border + gradient simultaneously. Use opacity to disable. Stack four button variants visible in the same view (cap at three).

---

### O.2 Input (text / email / password / number / search)

**Anatomy:** `[label] + container[(leading-addon?) + (leading-icon?) + input-element + (clear-button?) + (trailing-icon?) + (trailing-addon?)] + [helper-text | error-text]`

**Sizes:**

| Size | Height | Padding (H × V) | Type role |
| --- | --- | --- | --- |
| `sm` | 32 px | 10 × 6 px | `body-sm` (13 px) |
| `md` (default) | 40 px | 12 × 10 px | `body-md` (14–16 px) |
| `lg` | 48 px | 16 × 12 px | `body-md` (16 px) |

**Radius:** `radius.md` (8 px). `radius.sm` (4 px) for engineered/dense aesthetics.

**Border:** 1 px, `border.default` (`neutral.7`).

**Background:** `surface.canvas` (light) or `surface.subtle` (raised input style).

**Label-to-input gap:** `space.2` (8 px).
**Input-to-helper gap:** `space.1.5` (6 px).
**Helper / error text:** `body-sm` (12–13 px), `neutral.11` (helper) / `danger.11` (error).

**States:**

| State | Modification |
| --- | --- |
| `default` | As above |
| `hover` | Border → `border.strong` (`neutral.8`) |
| `focus-visible` | Border → `primary.8` 1 px + ring 2 px `primary.8/40%` offset 0 |
| `disabled` | Background `neutral.2`, text `neutral.8`, border `neutral.6` |
| `error` | Border `danger.8`, focus ring `danger.8/40%`, error text below |
| `success` | Border `success.8` (use sparingly — usually omit) |
| `read-only` | Background `surface.subtle`, no hover state |

**Mobile rule:** `font-size` ≥ 16 px on mobile web to prevent iOS auto-zoom on focus.

---

### O.3 Textarea

Same spec as Input with these differences:
- `min-height`: 80 px (~3 lines), expandable
- Padding: 12 px on all sides
- Resize: vertical only via system handle, or auto-grow

---

### O.4 Select / Combobox

Same anatomy as Input + trailing chevron icon. Same sizes/padding/radius. Dropdown menu uses Popover specs (§P.4).

---

### O.5 Checkbox

**Anatomy:** `box + (checkmark | indeterminate-dash) + [label]`

**Sizes:**

| Size | Box | Stroke | Label |
| --- | --- | --- | --- |
| `sm` | 16 × 16 px | 1.5 px | `body-sm` |
| `md` (default) | 20 × 20 px | 1.5 px | `body-md` |

**Radius:** `radius.sm` (4 px). Never circular (that's radio).

**Box-to-label gap:** `space.2` (8 px).

**States:**

| State | Modification |
| --- | --- |
| `default` (unchecked) | Border `neutral.7` 1.5 px, background `surface.canvas` |
| `hover` | Border `neutral.8` |
| `checked` | Background `primary.9`, border `primary.9`, checkmark in white at 70–80% box size |
| `indeterminate` | Background `primary.9`, dash icon centered |
| `focus-visible` | 2 px ring `primary.8` offset 2 px |
| `disabled` | Background `neutral.3`, border `neutral.6`, checkmark `neutral.8` |
| `error` | Border `danger.8` |

---

### O.6 Radio

**Anatomy:** `outer-circle + inner-dot + [label]`

**Sizes:** Same as checkbox (`sm` 16 px, `md` 20 px).

**Radius:** `radius.full` (always circular).

**States:** Same as checkbox semantics. Checked state: outer circle becomes `primary.9` background, inner dot in white at 40% of outer diameter.

Radios are always in groups of 2+. A single radio is a checkbox.

---

### O.7 Switch / Toggle

**Anatomy:** `track + thumb`

**Sizes:**

| Size | Track | Thumb |
| --- | --- | --- |
| `sm` | 32 × 18 px | 14 × 14 px |
| `md` (default) | 44 × 24 px | 20 × 20 px |

**Radius:** `radius.full` for both track and thumb.

**States:**

| State | Track | Thumb position |
| --- | --- | --- |
| `off` | `neutral.6` | Left |
| `on` | `primary.9` | Right |
| `hover-off` | `neutral.7` | Left |
| `hover-on` | `primary.10` | Right |
| `disabled` | `neutral.4` | static |
| `focus-visible` | 2 px ring `primary.8` offset 2 px |

**Transition:** Thumb position + track color transition `duration.fast` `ease.standard`. Optional `spring.snappy` on mobile for tactile feel.

---

### O.8 Slider

**Anatomy:** `track + filled-track + thumb + [tick marks?] + [value label?]`

**Sizes:**

| Size | Track height | Thumb |
| --- | --- | --- |
| `sm` | 4 px | 16 × 16 px circle |
| `md` (default) | 6 px | 20 × 20 px circle |

**Track radius:** `radius.full`. **Thumb radius:** `radius.full`.

**Track color:** `neutral.5`. **Filled track:** `primary.9`. **Thumb:** white with 1 px `neutral.7` border and `elevation.1`.

**Focus-visible:** thumb gets ring as in §J.2. Keyboard step: arrow = 1 unit; shift-arrow = 10 units.

---

### O.9 Badge / Chip / Tag

**Anatomy:** `container[(leading-icon? | dot?) + label + (close-button?)]`

**Sizes:**

| Size | Height | Padding H | Type | Icon |
| --- | --- | --- | --- | --- |
| `sm` | 20 px | 8 px | `body-sm` (11–12 px / 500) | `icon.xs` (12) |
| `md` (default) | 24 px | 10 px | `body-sm` (12–13 px / 500) | `icon.sm` (16) |
| `lg` | 28 px | 12 px | `label-sm` (13 px / 500) | `icon.sm` (16) |

**Radius:** `radius.sm` (4 px) for tag/badge; `radius.full` for pill chip.

**Variants (semantic):**
- `neutral`: background `neutral.3`, text `neutral.11`
- `primary`: background `primary.3`, text `primary.11`
- `success`: background `success.3`, text `success.11`
- `warning`: background `warning.3`, text `warning.11`
- `danger`: background `danger.3`, text `danger.11`

**Solid variant** (for high-emphasis badges): background `<role>.9`, text white.

---

### O.10 Avatar

**Anatomy:** `image | initials | icon`

**Sizes:** 16 / 20 / 24 / 32 / 40 / 48 / 56 / 64 / 80 / 96 px.

**Radius:** `radius.full` (default circular) or `radius.lg` (squircle profile).

**Fallback (no image):**
- Background: deterministic from name hash (rotate through a palette of subtle tints)
- Text: initials (1–2 chars), centered, `label-sm` weight 600, color `neutral.12`

**Stacked avatars** (avatar groups): overlap by 30–40% of width; reverse z-index (first is topmost). Ring with `surface.canvas` 2 px to separate.

---

### O.11 Divider

Two variants:
- **Hairline** — 1 px `border.subtle` (`neutral.6`)
- **Strong** — 1 px `border.default` (`neutral.7`) used to separate distinct regions

Use sparingly; whitespace + grouping is preferred over dividers.

---

### O.12 Tooltip

**Anatomy:** `container[label + (optional arrow)]`

**Spec:**
- Background: `neutral.12` (high-contrast), text: `surface.canvas` (white)
- Padding: 6 × 10 px
- Radius: `radius.md` (8 px)
- Type: `body-sm` (12–13 px)
- Max width: 240 px
- Shadow: `elevation.2`
- Show delay: 500 ms; hide delay: 100 ms
- Position: above target by default; flip to below if no space (Radix Popper / Floating UI conventions)

Mobile: tooltips are inappropriate. Replace with inline help text or a tap-to-reveal info icon.

---

### O.13 Label & Helper Text

**Label:** `label-sm` (13–14 px, weight 500), `neutral.12`, paired with form input. Always visible; never placeholder-as-label.
**Helper:** `body-sm` (12–13 px, weight 400), `neutral.11`.
**Error:** `body-sm`, `danger.11`, paired with leading 14-px error icon.

---

### O.14 Skeleton

**Spec:**
- Background: `neutral.3` solid OR linear-gradient shimmer (`neutral.3 → neutral.4 → neutral.3`) animating 1.5 s linear
- Radius: matches the element being loaded
- Aspect ratio: matches the element

Use for content-load placeholders. Honor `prefers-reduced-motion` — replace shimmer with static `neutral.3`.

---

## §P — Components (Molecules)

### P.1 Card

**Anatomy:** `container[(media?) + (header[title + subtitle?]) + body + (footer[actions?])]`

**Spec:**
- Padding: `space.6`–`space.8` (24–32 px), uniform
- Radius: `radius.lg`–`radius.xl` (12–16 px). Match content density: dense → 12, marketing → 16.
- Border: `border.subtle` 1 px OR no border + `elevation.1` (choose one per §H.4)
- Background: `surface.raised` (`neutral.3` or white)
- Internal gap (between title / body / footer): `space.4` (16 px)
- Media at top: extends to card edges (negate the padding via `margin: -padding`)
- Title: `heading-sm` (18–20 px / 600)
- Subtitle: `body-sm` (13 px / 400, `neutral.11`)
- Footer actions: right-aligned, gap `space.3` (12 px)

**Interactive card** (entire card is a link/button):
- `hover`: border → `border.default`, OR elevation → `elevation.2`
- `focus-visible`: ring per §J.2
- Cursor: `pointer`

### P.2 Modal / Dialog (desktop) & Sheet (mobile)

**Desktop modal:**
- Backdrop: `neutral.12 / 50%` solid scrim (or `backdrop-filter: blur(8px)` for premium feel)
- Container: white (`surface.overlay`), `radius.xl` (16 px), `elevation.4`, max-width `560 px` (small) / `720 px` (medium) / `960 px` (large)
- Padding: 24 px (header), 24 px (body), 24 px (footer); footer is `border.subtle` 1 px on top
- Header: `heading-md` (24 px) title + close icon-button (top-right, 24 px)
- Footer: right-aligned actions; primary on right, secondary on left of primary
- Entrance: backdrop fades in (`duration.base`, `standard`); container scales from 0.96 to 1.0 + fades in (`duration.slow`, `decelerate`)
- Exit: container scales down to 0.98 + fades out (`duration.fast`, `accelerate`); backdrop fades out simultaneously
- Focus trap inside modal required; restore focus on close
- Escape key closes; click on backdrop closes (unless declared modal)

**Mobile sheet (bottom sheet):**
- Container: `surface.overlay`, `radius.xl` top corners only (`16 px 16 px 0 0`)
- Drag handle: 4 × 32 px pill, `neutral.6`, centered, 8 px from top
- Entrance: slide up from bottom + spring (`spring.gentle`); backdrop fades in
- Exit: slide down + spring; backdrop fades out
- Snap points: typically `50%` and `90%` of viewport height
- Honor swipe-down to dismiss

### P.3 Toast / Notification

**Spec:**
- Container: `surface.overlay`, `radius.md` (8 px), padding 12 × 16 px
- Border: `border.subtle` OR `elevation.3` (choose one)
- Width: 360–440 px (desktop); full-width − 16 px (mobile)
- Type: `body-md` (14 px), `neutral.12`
- Leading icon: 20 px, semantic color (success/danger/info)
- Trailing close icon: 16 px
- Position: top-right (desktop) or top-center (mobile) by default
- Stacking: vertical, newest on top, gap `space.2` (8 px), older toasts dim slightly
- Duration: 4–6 s for info/success, 8–10 s for warnings, manual-dismiss only for errors
- Entrance: slide in from edge + fade; exit: fade only
- Pause on hover

### P.4 Dropdown / Menu / Popover

**Spec:**
- Container: `surface.overlay`, `radius.lg` (12 px), `elevation.2`
- Border: 1 px `border.subtle` (esp. on dark mode)
- Padding: 4 px (outer)
- Item height: 32 px (compact) / 36 px (default) / 40 px (comfortable)
- Item padding: 8 × 12 px
- Item type: `body-sm` (14 px), `neutral.12`
- Item hover: background `neutral.3`
- Item active: background `neutral.4`
- Selected indicator: leading checkmark or right-aligned dot
- Separator: 1 px `border.subtle`, 4 px vertical margin
- Section label: `overline` (11 px UPPERCASE), `neutral.11`, 4 × 12 px padding
- Min width: trigger width OR 160 px (whichever larger)
- Max height: ~60 vh, then scrollable
- Position: below trigger by default; flip to above when no space
- Entrance: fade + scale from 0.96 to 1.0 (`duration.fast`, `decelerate`)
- Outside-click closes

### P.5 Tabs

**Anatomy:** `tab-list[tab+] + tab-panel`

**Spec:**
- Tab height: 40 px
- Tab padding: 12 × 16 px
- Tab type: `body-md` (14 px / 500)
- Default: `neutral.11` text, transparent background
- Hover: `neutral.12` text
- Selected: `neutral.12` text + 2 px `primary.9` indicator bar at bottom (underline tab style) OR `surface.raised` background (filled-tab style)
- Indicator transition: position + width transition `duration.base` `ease.standard`
- Focus-visible: ring per §J.2
- Disabled: `neutral.8`, no hover
- Tab-list border: 1 px `border.subtle` at bottom (underline style only)

Two visual variants: **underline** (default, premium) or **filled** (`surface.subtle` for unselected, `surface.raised` for selected — pill or rectangular).

### P.6 Accordion / Disclosure

**Spec:**
- Item container: `border.subtle` top + bottom 1 px (collapse adjacent borders)
- Trigger padding: 16 × 0 px (vertical)
- Trigger type: `body-md` (15–16 px / 500)
- Trigger chevron: `icon.md` (20 px), trailing right, rotates 180° on open
- Content padding: 0 × 0 16 px (extra 16 px bottom for breathing room)
- Content type: `body-md` (14–15 px / 400)
- Expand/collapse: height auto + opacity, `duration.base` `ease.standard`
- Single-open vs multi-open: per-instance decision

### P.7 Navigation (top bar)

**Spec:**
- Height: 64 px (desktop) / 56 px (mobile)
- Background: `surface.canvas` (transparent + scroll-detect blur on marketing sites)
- Padding: 0 × `space.6` (desktop) / 0 × `space.4` (mobile)
- Logo: left-aligned, `space.4` from edge
- Nav links: center or left, type `label-sm` (14 px / 500), `neutral.11` → `neutral.12` on hover
- Active link: `neutral.12` + 2 px underline OR dot indicator
- CTAs: right-aligned, gap `space.3` (12 px)
- Sticky: with `backdrop-filter: blur(12px)` and `surface.canvas / 80%` background once scrolled
- Mobile: collapses to hamburger trigger → opens sheet or full-screen menu

### P.8 Navigation (sidebar)

**Spec:**
- Width: 240 px (default) / 64 px (collapsed icon-rail) / 280 px (expanded)
- Background: `surface.subtle`
- Border: 1 px `border.subtle` right
- Padding: `space.4` (16 px)
- Section gap: `space.6` (24 px)
- Item: 36 px height, 8 × 12 px padding, `radius.md`, `body-sm` (14 px / 500)
- Item default: transparent
- Item hover: `neutral.3`
- Item active: `primary.3` background, `primary.11` text, optional leading 3 × 16 px primary bar
- Icon: leading `icon.md` (20 px), `space.3` gap to label
- Collapsible: animate width `duration.base` `ease.standard`; labels fade out before width changes

### P.9 Bottom navigation / Tab bar (mobile)

**Spec (iOS-style tab bar):**
- Height: 49 pt + safe-area-inset-bottom
- Background: `surface.canvas / 80%` + `backdrop-filter: blur(20px)`
- Border: 1 px `border.subtle` top (hairline)
- Tab item: full equal width, vertical stack [icon 24 + label `body-sm` 10–11 pt]
- Active: `primary.9`; inactive: `neutral.8`
- 4–5 tabs maximum

**Spec (Android Material 3 navigation bar):**
- Height: 80 dp
- Background: `surface.canvas`
- Item: vertical stack [icon 24 dp + indicator pill (when selected) + label `body-sm` 12 sp]
- Selected indicator: 32 dp height pill of `primary.3` behind the icon
- 3–5 destinations

### P.10 Table / Data list

**Spec:**
- Header row: 40 px height, `surface.subtle` background, `body-sm` (12–13 px / 600 / `neutral.11`), 12 px horizontal padding
- Body row: 48 px height (default) / 40 px (compact) / 56 px (comfortable)
- Row border: 1 px `border.subtle` bottom
- Cell padding: 12 × 16 px (vertical × horizontal)
- Cell type: `body-sm` (13–14 px / 400)
- Tabular numerals required for numeric columns (`font-feature-settings: "tnum"`)
- Hover: row background `neutral.2`
- Selected: row background `primary.3`, optional leading 3-px primary bar
- Sticky header on scroll
- Column resize: keyboard-accessible drag handles
- Empty state: centered illustration + message + CTA

### P.11 Form group

**Anatomy:** `[label] + control + [helper-text | error-text]`

**Spec:**
- Vertical stack, gap: 6 px (label → control), 6 px (control → helper)
- Required marker: red asterisk (`danger.11`) after label text, 4 px left margin
- Optional marker: "(optional)" suffix in `neutral.11`, `body-sm`
- Error state: control → error variant; error text replaces helper
- ARIA: `aria-describedby` → helper/error ID; `aria-invalid="true"` when error

### P.12 Pagination

**Spec:**
- Container: horizontal flex, `space.2` gap (8 px between items)
- Item: 36 × 36 px (default) — square or `radius.md`
- Item type: `body-sm` (13–14 px / 500)
- Default: `neutral.11` on transparent
- Hover: `surface.subtle` background
- Active: `primary.9` background, white text
- Prev/Next: icon-only buttons with chevron icons
- Ellipsis: non-interactive, `neutral.11`

### P.13 Breadcrumbs

**Spec:**
- Type: `body-sm` (13 px / 400)
- Item color: `neutral.11`
- Current (last) item: `neutral.12` (no link)
- Separator: `/` or `›` icon, `neutral.8`, 8 px horizontal margin
- Hover: `neutral.12` + underline
- Truncation: collapse middle items with `…` when path is long

### P.14 Banner / Alert

**Spec:**
- Padding: 12 × 16 px
- Radius: `radius.md` (8 px)
- Variants: info / success / warning / danger / neutral
- Background: `<role>.2`–`<role>.3` (subtle), text `<role>.11`, leading icon `<role>.9`, 1 px `<role>.6` border
- Optional title + body stack
- Optional trailing dismiss icon (16 px close)
- Anatomy: `[leading-icon] + content[title? + body] + [actions?] + [dismiss?]`

### P.15 Empty state

**Spec:**
- Container: centered, max-width 480 px
- Illustration: top, `aspect.square` 96–160 px
- Title: `heading-sm` (20 px / 600), `space.4` gap below illustration
- Body: `body-md` (14–16 px / 400), `neutral.11`, `space.2` gap below title
- Action: `primary` `md` button, `space.6` gap below body
- Vertical padding inside container: `space.16`+

---

## §Q — Web Patterns

Conventions specific to marketing sites + product (SaaS / web app) sites. These are the patterns observed across Linear, Vercel, Stripe, Notion, Anthropic, Mercury, Huly, Neon, Unkey, and the Pixel Point case studies.

### Q.1 Canonical landing page composition

**Rule:** Marketing landing pages follow this section sequence by default (deviation must be justified):

1. **Top navigation** — fixed, transparent-to-blurred-on-scroll, 64 px height
2. **Hero** — 1 viewport tall on desktop (`min-height: 88vh`), generous internal padding
3. **Social proof** — monochrome logo wall, 80–120 px tall section
4. **Narrative section 1** — left-image, right-text (or reverse), 96–128 px vertical padding
5. **Narrative section 2** — alternates direction from section 1
6. **Bento grid** — feature showcase, 96–128 px vertical padding
7. **Use-case / persona tabs** — segmented or tabbed exploration
8. **Testimonial(s)** — single quote (premium) or limited carousel
9. **Pricing** — only if commerce-focused
10. **FAQ** — accordion, 96 px vertical padding
11. **Final CTA band** — high-contrast surface, 96–128 px vertical padding
12. **Footer** — multi-column, 96 px top padding, 32 px bottom

Section ordering can vary, but the **hero → social proof → narrative → showcase → CTA → footer** spine is universal.

### Q.2 Hero — premium specifications

**Anatomy:** `nav + content[(eyebrow?) + headline + subhead + cta-cluster + (trust-marker?)] + (media)`

**Spec:**
- Vertical padding: 128–192 px on desktop (`space.32`–`space.48`); 64–96 px on mobile
- Headline: `display-2xl` (64–96 px desktop, 32–48 px mobile), 600–700 weight, tracking -0.03em
- Headline length: ≤ 44 characters (visual rhythm, screen fit, scannability)
- Subhead: `body-lg` (18–20 px), `neutral.11`, max-width 480–560 px
- Eyebrow (optional): `overline` (11 px UPPERCASE, +0.08em tracking), `primary.11`
- CTA cluster: primary + secondary, gap `space.4` (16 px), wrap on mobile
- Layout variants:
  - **Centered**: nav-style, hero text centered, optional media below (Vercel pattern)
  - **Split asymmetric**: 6/6 or 7/5 of 12 cols, text left, media right (Linear pattern)
  - **Background-led**: full-bleed media or animation, content overlaid (Pixel Point / Cluely pattern)
- Background: solid surface, subtle gradient (`linear-gradient` of `surface.canvas` → `surface.subtle`), or full-bleed asset
- Above-the-fold imperative: headline, subhead, primary CTA, and a glance of the product/value all visible without scroll on a `1440 × 900` viewport

### Q.3 Section vertical padding scale

**Rule:** Marketing sections use this padding scale based on density and tier:

| Section role | Mobile | Desktop |
| --- | --- | --- |
| Hero | 64–96 px | 128–192 px |
| Major narrative | 64–80 px | 96–128 px |
| Logo wall | 48 px | 64–80 px |
| Bento / feature | 64–80 px | 96–128 px |
| Testimonial | 48–64 px | 80–96 px |
| FAQ | 48 px | 80–96 px |
| Final CTA band | 80–96 px | 128–160 px |
| Footer | 64 px (top) | 96 px (top) |

Vercel's signature aggressive whitespace pushes the upper bound (sections at 128 px+ vertical desktop padding). Premium consumer brands trend toward the higher end; dense developer tools (Linear, Stripe) trend toward the lower end of these ranges.

### Q.4 Bento grids

**Anatomy:** Asymmetric grid of cards showcasing 4–9 product features simultaneously.

**Spec:**
- Grid: `grid-template-columns: repeat(12, 1fr)` desktop, `grid-template-columns: 1fr` mobile
- Gap: `space.4`–`space.6` (16–24 px)
- Cell sizing: mixed (e.g., 6 + 6, 4 + 4 + 4, 8 + 4, 6 + 3 + 3, 4 + 8 spanning two rows)
- Cell radius: `radius.xl` (16 px) or `radius.2xl` (24 px)
- Cell padding: `space.6`–`space.8` (24–32 px)
- Cell anatomy: title (`heading-sm` 18–20 px / 600) + description (`body-md` 14–16 px / `neutral.11`) + media (product UI excerpt, illustration, or animation)
- Stacking rule on mobile: bento collapses to single-column stack; preserve order of importance

Bento grids are not a default — they suit products with 4+ co-equal features. Single-feature products use narrative sections instead.

### Q.5 Logo wall (social proof)

**Spec:**
- Monochrome rendering — all logos in `neutral.11` (light mode) or `neutral.8` (dark mode), never original brand colors
- 5–7 logos visible at once; rotate to display more
- Heights aligned by **optical balance**, not pixel height (designers tweak per logo)
- Background: `surface.canvas` (no separation) or `surface.subtle` (subtle distinction)
- Padding: 48–80 px vertical, generous horizontal gaps
- Optional motion: slow marquee scroll (`duration.deliberate` × N, linear easing) — pauses on hover

### Q.6 Scroll-triggered animation — purposeful framework

**Rule:** Scroll-triggered animation serves only when it explains a product concept that static imagery cannot. Decorative scroll effects are forbidden. Refer to Pixel Point's Cluely framing: motion is how "invisible AI" becomes comprehensible.

**Allowed scroll patterns:**
- **Pin and scrub** — section pins; internal content (text, images, illustration) advances as user scrolls within the pinned area. Used to walk through a multi-step workflow.
- **Stagger reveal** — list items or grid cells fade + rise from 8 px below as they enter viewport. Single trigger per element.
- **Parallax depth** — slight (max 30 px) offset of foreground vs background. Disabled on reduced-motion.
- **Sticky highlight** — element pins as user scrolls past it; useful for code snippets next to descriptive text.

**Forbidden scroll patterns:**
- Re-triggering animation on scroll-back
- Full-screen takeover animations between every section
- Continuous parallax > 50 px range
- Long pin durations (> 3 viewport heights) — feels like the page is broken

### Q.7 CTA hierarchy

**Rule:** Each landing page has:
- **One primary CTA** (the conversion goal — usually "Start free" or "Get started")
- **One secondary CTA** (low-commitment alternative — "Watch demo," "Talk to sales")
- **Optional tertiary** inline link CTAs in narrative sections (each driving to a relevant deep page)

Primary CTA uses the brand's `primary` color. Secondary uses `outline` or `ghost`. The primary CTA appears in the hero, in mid-page narrative section, and in the final CTA band — three appearances minimum on a long landing page.

### Q.8 Feature grid pattern

**Spec:**
- Layout: 3-up on desktop (`grid-template-columns: repeat(3, 1fr)`), 2-up on tablet, 1-up on mobile
- Gap: `space.6`–`space.8` (24–32 px)
- Each item: top-aligned icon (`icon.xl` 32 px) or illustration (96 × 96 px) + title (`heading-sm`) + body (`body-md` / `neutral.11`)
- Items left-aligned; never centered text inside feature cards
- Optional: 1-px `border.subtle` separators or `radius.lg` cards

### Q.9 Pricing tables

**Spec:**
- 3-tier comparison default (Free / Pro / Enterprise) — premium standard
- Each tier in a card: padding `space.8` (32 px), radius `radius.xl` (16 px), border `border.subtle`
- Featured tier: elevated by `elevation.2` + 1.5–2 px `primary` border + "Most popular" badge top-right
- Price: `display-lg` (36–48 px), tabular numerals
- Period: `body-sm` (`neutral.11`)
- Feature list: vertical stack, leading checkmark icon, `body-md`
- CTA: full-width within the card, `lg` size

### Q.10 Footer

**Spec:**
- Multi-column link grid: 4–6 columns desktop, 2 columns mobile
- Top padding: 96 px; bottom padding: 32 px
- Background: `surface.subtle` or `surface.canvas` with 1 px `border.subtle` top
- Brand mark + tagline column: leftmost, larger
- Link group columns: title `label-sm` UPPERCASE +0.06em, links `body-sm` `neutral.11` → `neutral.12` on hover
- Bottom bar: copyright, language switcher, social icons; `body-sm` `neutral.11`
- Newsletter signup (when present): single-line input + button, occupies a column

### Q.11 In-product (web app) layout patterns

**Spec for SaaS application shells:**
- **Three-pane layout**: left nav (240 px) + central content + optional right context panel (320 px)
- **Top bar**: 56–64 px, contains breadcrumbs / current-view title + global actions
- **Content area**: padded `space.6`–`space.8` (24–32 px); max-width `container.xl` or full-fluid
- **Command palette**: `cmd+k` / `ctrl+k` triggers a centered overlay modal, search-first, keyboard-driven
- Density: in-product UI uses `density.compact` or `density.comfortable`, not `density.spacious`

### Q.12 Dashboards / data-density patterns

**Spec:**
- Card grid for KPIs: 3–4 across on desktop, 1 across mobile, each card `radius.lg`, 24 px padding
- Tabular numerals required everywhere
- Charts: respect color tokens (semantic colors for trend direction, neutrals for axes/grid)
- Empty states for every chart and table
- Filters: top of the data region, horizontal flex of `Select` + `DatePicker` + `Reset` button

### Q.13 Anchor scroll behavior

**Rule:** Anchor links scroll smoothly with `scroll-behavior: smooth` AND offset for the fixed nav (`scroll-margin-top: 80px`). Otherwise headings get hidden under the sticky nav.

---

## §R — Mobile Patterns

### R.1 Platform-first vs cross-platform

**Rule:** Mobile UI defaults to **platform-native conventions** on iOS and Android. Cross-platform reuse is acceptable for content, but interaction patterns (navigation, sheets, swipe actions, haptics) should follow the host platform's conventions.

Brand differentiation lives in: color, typography (within Dynamic Type / sp constraints), brand illustration, motion personality. Brand differentiation does NOT live in: navigation patterns, system gestures, sheet behaviors.

### R.2 iOS — navigation patterns

**Tab bar** (primary navigation, 3–5 tabs):
- Use for top-level destinations only (never for actions like "Compose" or "Add")
- iOS 18+: tab bar can compact on scroll (active tab visible only) and expand on scroll-up
- iOS 26+: liquid-glass effect, collapsible search tab, accessory views

**Navigation bar** (hierarchy within a tab):
- 44 pt default height + safe-area-inset-top
- Large title (34 pt SemiBold) for top-level screen; compresses to standard nav bar title (17 pt SemiBold) on scroll
- Leading: back chevron or hamburger; trailing: 1–2 actions max

**Sheets** (modal content):
- Use `sheet()` modifier in SwiftUI / `present()` in UIKit
- Detents: `.medium` (half sheet, ~50%), `.large` (full above status bar), or custom fractions
- Grabber handle visible by default
- Background: respects light/dark mode; uses material (frosted)
- Dismiss: swipe down or tap outside (for non-required sheets)

**Modals (full-screen)**:
- Use for tasks that must complete (sign-up, onboarding step, payment)
- Slide up from bottom with `spring.gentle`
- Top-left: "Cancel"; top-right: "Save"/"Done" — standard iOS verbs

### R.3 Android — navigation patterns

**Material 3 navigation bar** (bottom, 3–5 destinations):
- 80 dp height
- Active item shows a pill indicator behind its icon
- Use for top-level destinations, not actions

**Top app bar**:
- Small (64 dp) for default; Medium (112 dp) for emphasis; Large (152 dp) for hero screens
- Center-aligned title for single-screen apps; left-aligned title for navigation hierarchies
- Trailing: action icons (max 2 visible + overflow menu)

**Bottom sheets**:
- Modal: pulls up from bottom over scrim, dismissable
- Standard: persists alongside content, integrated into the layout
- Drag handle at top
- Snap heights: `peek` (subset visible) and `expanded` (most of screen)

**FAB and FAB Menu** (Material 3 Expressive):
- Single primary action on a screen
- FAB Menu: replaces stacked secondary FABs — opens a small menu panel for related actions
- ToggleFloatingActionButton: explicit expanded/collapsed state

**Floating toolbars** (Material 3 Expressive):
- Floats above content for contextual actions
- Pair with FAB for primary + secondary action symmetry
- Replaces deprecated bottom app bar

### R.4 Safe areas

**Rule:** All full-bleed content respects platform safe areas:

| Edge | iOS | Android |
| --- | --- | --- |
| Top | Status bar / Dynamic Island | Status bar |
| Bottom | Home indicator | Navigation bar (gesture or 3-button) |
| Left/Right | Notch landscape, sides of round corners | Edge-to-edge content area |

iOS: use `safeAreaInset()` modifiers or `safe-area-inset-*` CSS env vars for PWAs.
Android: respect `WindowInsets` via the AndroidX Compose `WindowInsets.systemBars` or React Native's `useSafeAreaInsets()`.

### R.5 Gestures — standard conventions

**Rule:** Honor platform gesture conventions. Do not override system gestures.

| Gesture | iOS | Android |
| --- | --- | --- |
| Back | Swipe from left edge | Swipe from left/right edge (gesture nav) OR system back button |
| Dismiss sheet | Swipe down | Swipe down |
| Pull to refresh | Native PTR animation | Native PTR animation |
| Reveal swipe actions | Swipe left/right on list row | Swipe left/right on list row |
| Long-press | Context menu / preview | Selection / context menu |

Custom gestures must not conflict with system gestures (avoid left-edge swipes that compete with back-swipe).

### R.6 Haptic feedback — purposeful

**Rule:** Haptics are used to confirm important actions and changes of state. They are NOT used for every tap or scroll.

**iOS — UIImpactFeedbackGenerator levels:**
- `.light` — small UI state change (toggle, segmented control)
- `.medium` — primary action confirmation (button tap completing flow)
- `.heavy` — significant event (snap into place, drag complete)
- `.soft` / `.rigid` — subtle interactions
- `UINotificationFeedbackGenerator`: `.success`, `.warning`, `.error` for outcome confirmations
- `UISelectionFeedbackGenerator`: continuous selection changes (picker scroll)

**Android — HapticFeedbackConstants:**
- `CONTEXT_CLICK`, `LONG_PRESS`, `VIRTUAL_KEY`, `CONFIRM`, `REJECT`, `GESTURE_END`

Use haptics only on:
- Toggle / switch state change
- Primary button completing a task
- Drag operations (start, snap, end)
- Errors and successes (paired with visual feedback)

Honor `UIAccessibility.isReduceMotionEnabled` (iOS) / system haptic settings (Android) — when reduced, fall back to subtle or none.

### R.7 Lists — platform conventions

**iOS:**
- Standard `List` style: grouped sections on `surface.subtle` background
- Plain style: edge-to-edge rows, hairline separators
- Row height: 44 pt minimum (touch target)
- Disclosure indicator (chevron) on tappable rows that navigate
- Swipe-to-reveal trailing actions (Delete, Archive, etc.)
- Pull to refresh available natively

**Android (Material):**
- List items: 56 dp single-line, 72 dp two-line, 88 dp three-line
- Leading: icon, avatar, or thumbnail (40 dp)
- Trailing: icon or text metadata
- Selectable lists: use `ListItem` with `Checkbox` or `Switch`

### R.8 Forms on mobile

**Rule:**
- Inputs: 44–56 pt height (touch target)
- Font-size ≥ 16 px to prevent zoom on focus (iOS Safari WebView)
- Keyboard type matches input type (`numeric`, `email-address`, `url`, `tel`)
- `autocapitalize` and `autocomplete` declared per field semantic
- Submit button: primary, full-width, fixed at bottom (above safe area) on long forms
- Single-column always — never side-by-side fields on mobile

### R.9 Notifications — platform delivery

**Rule:** Use the platform's notification system (iOS UserNotifications, Android NotificationManager). In-app: use Toast (§P.3) or Banner (§P.14).

### R.10 Onboarding — three patterns

| Pattern | Use |
| --- | --- |
| **Empty state with guided actions** | Power users — surface real product surface, not slideshow |
| **Step-by-step modal** | First-time users completing required setup (sign-up, permissions, profile) |
| **Coach marks / spotlight tour** | Optional, dismissible. Use sparingly — adds friction for repeat users |

Avoid: 5+ swipeable intro screens before product use. Users skip them.

### R.11 Permissions — request in context

**Rule:** Permission requests appear at the moment they are needed (camera permission when user taps Camera button), with a brief explanation **before** the system dialog. Never request all permissions on app launch.

### R.12 Adaptive layouts — phone, tablet, foldable

**Rule:** Use platform adaptive APIs. iPadOS: `NavigationSplitView` for two- or three-pane layouts on iPad. Android Material: `WindowSizeClass` (Compact / Medium / Expanded) drives navigation transformations (bottom nav → navigation rail → navigation drawer).

Foldables: respect fold-aware insets; allow content to span or stay on a single screen as appropriate.

---

## §S — Anti-Patterns

The list below describes patterns the template explicitly forbids. They are common AI-generated UI failures, common amateur design patterns, and common token-bypass behaviors. Each entry includes the **rule** (what is forbidden), the **failure mode** (why it fails), and the **correct alternative**.

### S.1 Token-bypass anti-patterns

| Anti-pattern | Failure mode | Correct alternative |
| --- | --- | --- |
| Hard-coded hex values inline (`color: #2D6A4F`) | Theme switching breaks; brand updates require global find-replace | Reference token: `color: var(--colors-primary-9)` |
| Hard-coded pixel values for spacing (`padding: 17px`) | Breaks spacing rhythm; values drift over time | Use scale token: `padding: var(--space-4)` |
| Custom shadow strings inline | Visual depth diverges from system; layered shadows missing | Use `var(--elevation-2)` |
| Hard-coded font-size in `px` instead of token | Loses fluid responsive behavior, fights user OS settings | Use `var(--font-body-md)` |
| Invented in-between values (`gap: 14px` when 12 and 16 exist) | Visual rhythm fragments | Round to nearest token step |

### S.2 Visual cliches to avoid

| Cliche | Why it fails |
| --- | --- |
| Gradient on every section background | Visual fatigue; nothing emphasized when everything is | Reserve gradient for hero or one section per page |
| Neon glow on every interactive element | Eye strain; "generated" look | Use focus rings + elevation, not glow |
| Drop shadow on every text element | Reduces legibility; signals amateur | Text shadow only for legibility over busy backgrounds (rare) |
| Glassmorphism (heavy blur + transparency) on everything | Fragile; performance cost; legibility issues | Use sparingly — nav bars and modals only |
| Animated gradient text | Distracts from content; rarely tests well | Static color (or careful single-state gradient on a single hero word) |
| 3D rotating cards on hover | Gimmicky; breaks scan flow | Subtle scale (1.0 → 1.02) or elevation lift |
| Carousels as primary content navigation | Hides content; low engagement after first slide | Show all content; let user scroll |
| Multiple competing primary CTAs | User decision paralysis | One primary per screen; secondaries are visually subordinate |
| Centered body text (longer than 1 line) | Hard to scan; eye returns to inconsistent starts | Left-align body; center only for short headlines |
| Pure black `#000000` text on pure white `#FFFFFF` | Harsh contrast; eye strain | Soften both ends — near-black on warm off-white |
| Random emoji in product UI | Inconsistent across platforms; unprofessional in most contexts | Use the icon system; emoji only for user-generated content |
| Comic Sans / Papyrus / web-default font stacks | Signal genericness | Premium products use a deliberate, custom or designer-grade typeface |
| Spinning loaders for >2 seconds with no progress | User can't gauge wait | Use skeletons or progress bars |
| Auto-playing video with sound | Universally hostile | Muted, looping, low-motion videos only; never autoplay with sound |

### S.3 Composition anti-patterns

| Anti-pattern | Failure mode | Correct alternative |
| --- | --- | --- |
| Mixed sharp + rounded corner radii in one composition | Reads as design mistake | Pick one radius family per project |
| Section padding that fits the content (no breathing room) | Cramped, "templated" feel | Pad beyond content — premium pads at 96–128 px desktop |
| 50/50 column splits everywhere | Visual stalemate; no hierarchy | Use asymmetric splits (5/7, 4/8, 3/9) |
| Single-shadow box-shadows | Flat, synthetic depth | Layered shadows: tight key + soft ambient |
| Borders + shadows + heavy backgrounds simultaneously | Visual noise, redundant separation | Choose one separation strategy per element |
| Identical card heights forced (`min-height` matching) when content differs | Empty space inside one card is wasted | Let cards size to content; align tops in row |
| Logo wall in original brand colors | Visual chaos, brand competition | Monochrome at neutral.11 |
| Centered nav with too many items (>5) | Cramped; pushes brand off-center | Cap at 5; collapse to hamburger on mobile early |

### S.4 Typography anti-patterns

| Anti-pattern | Failure mode | Correct alternative |
| --- | --- | --- |
| Light or Thin weights in body | Fragile on screen; fails APCA | Use 400 Regular minimum |
| More than three weights per screen | Hierarchical confusion | Cap at three (typically 400, 500, 600) |
| Three or more font families | Visual cacophony | Cap at two |
| Justified body text on web | Creates uneven word spacing (rivers) | Left-align always |
| Body text wider than 75 characters per line | Reading speed drops | `max-width: 65ch` on prose |
| Same line-height across all sizes | Display looks airy, body looks cramped | Inverse-to-size rule (§D.5) |
| Zero or negative letter-spacing on body | Tight body crowds glyphs | 0 default; positive on small caps |
| ALL CAPS without positive letter-spacing | Glyphs touch; illegible | Apply +0.05 to +0.1em tracking on caps |
| Placeholder text as the only label | Disappears on input; fails contrast; fails screen readers | Always use a visible label |

### S.5 Color anti-patterns

| Anti-pattern | Failure mode | Correct alternative |
| --- | --- | --- |
| Color-only meaning (status indicated only by red/green) | Fails 8% of users (CVD); fails grayscale | Pair color with icon, label, or pattern |
| Auto-inverted dark mode | Fluorescent accents; halated text | Author dark mode as a separate palette |
| `opacity: 0.5` to disable | Unpredictable over varied backgrounds | Use explicit disabled tokens |
| Using >2 brand colors as accents | Brand dilution | Single primary accent; semantic colors are not "brand colors" |
| Saturated 9-step in dark mode without reducing chroma | Eye-burning saturation | Reduce C by 20–40% for dark-mode accents |
| Pure black shadows on light surfaces | Muddy; disconnected | Tint shadows with the darkest neutral of the palette |

### S.6 Motion anti-patterns

| Anti-pattern | Failure mode | Correct alternative |
| --- | --- | --- |
| Animating every element on every scroll | Distracting; reduces information density | Animate only what serves explanation |
| Re-triggering scroll animations on scroll-back | Feels broken | Trigger once per element |
| Linear easing on UI transitions | Robotic, lifeless | Use `ease.standard` or `ease.decelerate` |
| Long durations (>500 ms) on micro-interactions | Sluggish; user perceives jank | Cap micro-interactions at 200 ms |
| Parallax that travels >50 px | Disorienting; nausea-inducing | Subtle parallax under 30 px or none |
| No `prefers-reduced-motion` handling | Violates WCAG; harms vestibular users | First-class reduced-motion variants |
| Spring animations on data transitions | Imprecise for charts/numbers | Bezier curves for data; springs for gestures |
| Continuous looping animations stacked (more than one in viewport) | Attention competition | Cap at one looping animation per viewport |

### S.7 Component anti-patterns

| Anti-pattern | Failure mode | Correct alternative |
| --- | --- | --- |
| Button heights drifting (40 / 42 / 44 / 46 px in same UI) | No rhythm | Three explicit sizes only |
| Invented button variants beyond the system | Brand dilution | Use defined variants only |
| Inputs with no visible focus ring | Keyboard users lost | Mandatory `:focus-visible` ring |
| Inputs without label | A11y failure | Visible label always (visually-hidden acceptable only for repetitive search fields with adjacent context) |
| Tooltips on mobile (hover) | No hover on touch; never triggers | Replace with inline help or tap-to-reveal info icons |
| Modal with no close affordance | Trap users | Always provide close (X), Esc, and outside-click dismissal (or all of: X + Cancel button for required modals) |
| Toast with no auto-dismiss AND no manual dismiss | Permanent UI clutter | Either auto-dismiss (timed) or always show dismiss |
| Tab counts > 7 | User scans every tab | Cap at 5–7; group / reorganize beyond that |
| Sortable columns without indicator | Discoverability failure | Show sort affordance + active state |
| Date pickers in dropdowns under 320 px | Hard to tap precisely | Full date picker component, mobile-native picker on touch |

### S.8 Layout anti-patterns

| Anti-pattern | Failure mode | Correct alternative |
| --- | --- | --- |
| Fixed pixel layouts | Break on user zoom and OS text scaling | Use `rem` / `em` and fluid `clamp()` |
| Hard-coded breakpoint values in components | Fights container reuse | Container queries for components, media queries for pages |
| Content touching viewport edges | Cramped, mobile-broken | Container padding `≥ space.4` on mobile, `≥ space.6` on desktop |
| Hidden overflow on body / scroll-jank | Inconsistent scroll behavior | Use `overflow-anchor` and CSS containment, never `overflow: hidden` on body |
| z-index inflation (`z-index: 9999`) | Stacking chaos | Use the z-index token scale |

### S.9 Accessibility anti-patterns

| Anti-pattern | Failure mode | Correct alternative |
| --- | --- | --- |
| `<div onClick>` instead of `<button>` | No keyboard access; no a11y semantics | Native `<button>` |
| Custom interactive widgets without ARIA | Screen reader failure | Implement WAI-ARIA Authoring Practices patterns |
| Focus traps not restoring focus on close | Keyboard lost | Always restore focus to trigger |
| Invisible focus indicator | Keyboard users lost | Visible ring meeting WCAG 2.4.11 |
| Skip-to-content link missing | Long nav blocks every page | Skip link as first focusable element |
| Color contrast below WCAG 2.2 AA | Legal failure + real users excluded | APCA ≥ Lc 60 / WCAG ≥ 4.5:1 minimum |
| Animations with no `prefers-reduced-motion` | Vestibular harm | Provide reduced variants |

### S.10 AI-specific anti-patterns

These are failures common to AI-generated UI specifically. The AI agent contract (§A.6) should reference this list.

| AI failure mode | Mitigation |
| --- | --- |
| Inventing new color steps not in the scale | Reject; round to nearest existing step |
| Producing different button heights in the same composition | Reference one button-size token consistently |
| Mixing radius scales (8 + 12 + 16 in one card) | Single radius per composition; nested radius math (§G.2) |
| Generating verbose copy on UI elements | Cap label length per role (button labels ≤ 24 chars, etc.) |
| Adding decorative animation to "make it feel alive" | Animation must serve explanation, not decoration |
| Stacking multiple primary CTAs | One primary per screen — enforce by review |
| Choosing fonts not in the project token set | Use only declared font families |
| Generating images / icons inconsistent with the icon system | Use only the declared icon family; never mix |
| Approximating colors ("similar to but not exactly the brand color") | Always reference the token, never re-derive |
| Producing fully-padded layouts with no breathing room | Apply section padding tokens, never collapse to content height |

---

## §T — Data Visualization

Charts, sparklines, dashboards, and any quantitative visual representation. Sources: IBM Carbon Data Viz, GitLab Pajamas, Astro UXDS, GitHub Primer, Wikimedia Codex, Microsoft Office Add-ins guidelines.

### T.1 The viz color palette — three distinct types

**Rule:** A design system defines three separate palettes for data visualization. They are NOT the same as the brand palette.

| Palette type | Use | Composition |
| --- | --- | --- |
| **Categorical** | Independent categories with no order (products, regions, segments) | 6–8 visually distinct hues, balanced lightness, OKLCH-spaced for perceptual evenness |
| **Sequential** | Ordered quantitative values (low → high) | Single hue, 7–9 lightness steps from light to dark |
| **Diverging** | Values with a meaningful zero / midpoint (above/below average, gain/loss, sentiment) | Two contrasting hues meeting at a neutral midpoint (commonly blue ↔ orange or blue ↔ red) |

**Token shape:**

```yaml
viz:
  categorical: ["…", "…", …]      # 8 entries
  sequential: ["…", "…", …]       # 9 entries (light → dark)
  diverging:  ["…", "…", "…", …]  # 11 entries (negative-extreme → neutral → positive-extreme)
```

### T.2 Categorical palette — construction rules

**Rule:** Each color in the categorical palette must:
- Differ from neighbors in **hue by ≥ 30°** in OKLCH
- Share roughly equal **lightness (L ≈ 0.55–0.70)** so no color visually dominates
- Be **distinct in grayscale** (test by converting to monochrome — adjacent colors must remain distinguishable)
- Pass APCA contrast against the chart background (Lc 60+ at the bar/line element level)

**Hard caps:** never exceed 8 categorical colors in one chart. Beyond 8, switch to grouping, faceting, or a "Top N + Other" pattern.

**Order rule:** the first color is the primary/most-important category. Subsequent colors descend in importance. Premium products explicitly assign meaning to ordering rather than treating it as arbitrary.

### T.3 Sequential palette — construction rules

**Rule:** Sequential palettes hold hue and chroma roughly constant; step lightness. Premium sequential palettes use OKLCH stepping (same algorithm as §C.15) for perceptual evenness.

- 7–9 steps; 9 is the practical maximum (the eye cannot reliably distinguish more)
- Lowest step never reaches white (`L ≈ 0.95` floor) — pure white loses against the chart background
- Highest step never reaches black (`L ≈ 0.20` ceiling) — pure black flattens distinction at the top

### T.4 Diverging palette — construction rules

**Rule:** Diverging palettes have an odd step count (5, 7, 9, 11). Midpoint is a near-neutral light color (NOT pure white or gray — typically a very desaturated warm beige in light mode, a very low-chroma cool gray in dark mode).

- Two end hues should be ~180° apart in OKLCH (true complements)
- Both halves should be visually equal "weight" — equal chroma and equal lightness step counts
- Never use red ↔ green alone (CVD failure) — pair with secondary cues (icon, label)
- Common combinations: blue ↔ orange (most universal), blue ↔ red (with a neutral midpoint), teal ↔ magenta

### T.5 Axes and gridlines

| Element | Spec |
| --- | --- |
| Axis line | 1 px `border.subtle` (`neutral.6`) — or omit entirely (Tufte minimalism) |
| Axis tick marks | Omit by default; if needed, 4 px length, `neutral.6` |
| Axis label text | `body-sm` (12 px / 400), `neutral.11` |
| Axis title | `label-sm` (13 px / 600), `neutral.12`, set perpendicular to the axis (rotate Y-axis title 90°) |
| Gridlines (horizontal) | 1 px dashed or solid, `border.subtle` (`neutral.6` at 50% alpha) |
| Gridlines (vertical) | Omit by default — vertical gridlines clutter line charts |
| Zero baseline | Slightly stronger than other gridlines (`border.default` `neutral.7`) when the chart includes negative values |
| Minimum tick count | 4–6 ticks per axis — too many crowds, too few removes orientation |
| Tick spacing | Use "nice" numbers (multiples of 1, 2, 5, 10) — never `2.3`, `7.6` |

### T.6 Tooltips and hover states

**Rule:** Charts must show precise values on hover. Tooltip spec extends §O.12:

- Container: `neutral.12` background, white text (same as system tooltip)
- Width: auto, max 280 px
- Content: leading semantic dot (the category color from the categorical palette) + category label + value
- **Tabular numerals required** for all values
- Snap-to-data: tooltip follows the nearest data point, not the literal pointer position
- Crosshair guideline: 1 px dashed `border.default` vertical line at the x-position
- Show delay: 0 ms (charts should respond immediately, unlike standard tooltips)
- Hide delay: 200 ms

### T.7 Legends

| Aspect | Spec |
| --- | --- |
| Placement | **Top-left above plot** by default. Top-right if no space above. Right side only if many entries. Never bottom (reader scans top-down). |
| Orientation | Horizontal inline by default; vertical only when ≥ 6 entries |
| Item anatomy | Color swatch (12 × 12 px square or 12-px circle) + label `body-sm` (13 px / 500) |
| Item gap | 16 px between items |
| Color swatch | Match the chart element shape (square for bars, circle for lines, line segment for line charts) |
| Cap | If > 6 items, use a "more" affordance or move to a separate legend panel |
| Interaction | Hover dims non-hovered series to 30% opacity; click toggles series visibility |

### T.8 Chart-type-specific conventions

**Bar chart:**
- Bar gap: ~50% of bar width
- Bar padding: 8–16 px at chart edges
- Hover: brighten the bar by stepping one chroma step; never apply elevation or shadow to bars
- Horizontal bars: when labels are long; flip axes
- Stacked bars: only when total is meaningful; otherwise grouped

**Line chart:**
- Line stroke: 2 px default, 2.5 px for emphasis
- Data points: visible at hover only (clutter otherwise), 6 px radius circles
- Missing data: visible gap, never connect across missing values
- Multi-line: max 5 lines per chart; beyond that, use small multiples

**Area chart:**
- Fill at 15–25% opacity of the line color
- Stack only when total is meaningful

**Pie / donut:**
- Donut preferred over pie (the center provides space for totals)
- Max 5 slices; everything beyond is "Other"
- Sort slices by value descending, "Other" last
- Labels: inside slice if width allows, outside with connector line otherwise
- **Avoid pie charts entirely when bar charts work** — they are harder to compare

**Scatter / bubble:**
- Point size: 4–8 px default; bubble scales encode a third variable
- Opacity at 60–80% when overplotting is possible
- Show trend / regression line as an option, not default

**Heatmap:**
- Use sequential or diverging palette per the data semantics
- Cell border 1 px in the surface background color
- Labels on hover only — embedded labels clutter

**Sparkline (inline data viz, in tables / cards):**
- Height 16–32 px
- Single stroke, 1.5 px
- No axes, no gridlines, no labels
- Endpoint dot at the most recent value
- Color: `neutral.11` for default; semantic (success/danger) when trend direction has meaning

### T.9 Numeric labels on charts

**Rule:** Direct labeling beats legends when feasible. Place value labels on bars / line endpoints when the chart has ≤ 5 series.

- Use `body-sm` (12 px / 500), `neutral.12`
- Tabular numerals
- Round to the precision that matters (`$1.2M` not `$1,234,567`)
- Truncate / abbreviate large numbers consistently (`1.2K`, `3.4M`, `5.6B`)

### T.10 Empty, loading, and error states for charts

**Rule:** Every chart component declares four states:

| State | Behavior |
| --- | --- |
| **Loaded with data** | Default chart render |
| **Loading** | Skeleton in the chart's aspect ratio, optionally with placeholder axis lines |
| **Empty (no data)** | Centered message in the chart area: icon + title + body + optional CTA. Same anatomy as §P.15 empty state |
| **Error** | Centered error icon + brief error message + retry action |

Never show an empty chart axis-frame with no content — communicates broken UI.

### T.11 Accessibility for data visualization

**Rule:** Every chart has:
- A `<title>` and `<desc>` (or `aria-labelledby` + `aria-describedby`) summarizing the chart's intent
- An associated data table (visually hidden or in a "view as table" toggle) for screen readers
- Color is not the sole encoding — use shape, pattern, or label
- Tooltips and legends are keyboard-accessible (arrow keys move between data points)
- Color contrast: chart elements clear APCA Lc 30 against background (lower than text because shapes can be larger)
- Don't rely on hue alone to distinguish series — vary lightness or pattern as well

### T.12 Animation in charts

**Rule:** Use motion sparingly in data viz. Permitted:
- Enter animation on initial load: bars grow from baseline, lines draw left-to-right (`duration.deliberate`, `ease.decelerate`)
- Transitions between filter changes: morph data points to new positions (FLIP, §I.10)
- Hover state: instant color shift, no animation

Forbidden:
- Bars or points wobbling / pulsing for emphasis
- Auto-rotating views or animations on dashboards
- Animation when displaying actively-updating live data (introduces lag perception)

---

## §U — Internationalization & RTL

Internationalization (i18n) decisions made at the design-system level prevent painful rewrites later. The rules below cover RTL mirroring, tall-script support, CJK considerations, locale-aware formatting, and dynamic text-length handling.

### U.1 Use CSS logical properties everywhere

**Rule:** Every spacing, sizing, and positioning property uses **logical** values, not physical. Physical properties (`margin-left`, `padding-right`, `top`) require manual RTL overrides; logical properties (`margin-inline-start`, `padding-block-end`, `inset-block-start`) flip automatically with `direction: rtl`.

| Physical (forbidden in new code) | Logical (required) |
| --- | --- |
| `margin-left` | `margin-inline-start` |
| `margin-right` | `margin-inline-end` |
| `padding-top` | `padding-block-start` |
| `padding-bottom` | `padding-block-end` |
| `left: 0` | `inset-inline-start: 0` |
| `text-align: left` | `text-align: start` |
| `border-left` | `border-inline-start` |
| `width` | `inline-size` |
| `height` | `block-size` |

Browser support is universal as of 2026. The only exception is when you need a property *not* to flip — e.g., the close button on a modal should stay top-right in both LTR and RTL by convention. In that case, use the physical property explicitly with a comment explaining why.

### U.2 What mirrors and what doesn't in RTL

**Rule:** Apply the mirror flip to **layout direction** but not to all visual elements. The following rules govern what flips:

| Element | Mirror in RTL? | Reason |
| --- | --- | --- |
| Page layout (sidebar, columns, nav order) | ✓ Yes | Reading direction reverses |
| Text alignment | ✓ Yes (via `text-align: start`) | Text starts on the new "leading" edge |
| Directional icons (back arrow, forward arrow, chevrons in nav, breadcrumb separators) | ✓ Yes | These encode reading direction |
| Forward/back media controls (play, fast-forward, rewind) | ✗ No | Universally LTR by convention (clocks, video timelines, music players) |
| Numerals (1, 2, 3 — even Arabic numerals) | ✗ No | Numbers read LTR even inside RTL text |
| Logos, brand marks, photographs | ✗ No | Brand identity is preserved |
| Code blocks | ✗ No | Code is LTR universally |
| Charts (left = past, right = future on timelines) | ✗ No (usually) | Chart conventions are global; explicit per-chart decision |
| Universal-meaning icons (home, search, settings, user) | ✗ No | Non-directional |
| Checkboxes / radio buttons (the input itself) | ✗ No | Input controls don't have direction |
| Avatar in a list item | ✓ Yes | Leading slot of a row flips |
| Slider direction (low → high) | ✓ Yes | High value follows reading direction's end |

Implement icon flipping via a single CSS class:

```css
[dir="rtl"] .icon-mirror { transform: scaleX(-1); }
```

Apply `.icon-mirror` to icons that should flip. Default: icons don't flip unless explicitly classed.

### U.3 Tall-script line-height — increase for Arabic, Devanagari, Thai, Vietnamese

**Rule:** Scripts with diacritics or large glyphs above and below the baseline require **20–30% more line-height** than Latin to prevent clipping.

| Script family | Baseline line-height (vs. Latin) |
| --- | --- |
| Latin / Cyrillic / Greek | 1.0× (default per §D.5) |
| Arabic | 1.25–1.35× |
| Hebrew | 1.15–1.25× |
| Devanagari (Hindi, Marathi) | 1.30–1.40× |
| Thai | 1.30–1.40× |
| Vietnamese | 1.15–1.25× (heavy diacritics) |
| CJK (Chinese, Japanese, Korean) | 1.5–1.7× (dense glyphs need air) |

Token approach: define per-script multipliers and apply automatically via `:lang(ar) { line-height: 1.6; }` or per-component locale-aware tokens.

### U.4 CJK considerations

**Rule:** Chinese, Japanese, and Korean require typographic exceptions:

- **No italic.** Italic doesn't exist in CJK typography; emphasis is shown with different weight or 、 (Japanese emphasis dots) — never an oblique transform.
- **No underline for emphasis.** Use bold weight or color.
- **Word-break:** `word-break: break-word` is required because there are no spaces between words in Chinese.
- **Vertical text:** premium CJK products may offer vertical-writing mode (`writing-mode: vertical-rl`). Layout becomes column-based.
- **Mixed Latin in CJK:** when Latin words appear in CJK text, add a half-width space around them (some fonts do this automatically with `font-feature-settings: "halt"`).
- **Punctuation:** CJK uses full-width punctuation (、 not `,`; 「」 not `""`). Don't substitute Latin punctuation.

### U.5 Locale-aware formatting tokens

**Rule:** Numbers, dates, times, and currencies must format per the user's locale via the `Intl` APIs (web) or platform APIs (mobile). Never hardcode formats.

| Data type | API |
| --- | --- |
| Numbers | `new Intl.NumberFormat(locale).format(value)` |
| Currency | `new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(value)` |
| Dates | `new Intl.DateTimeFormat(locale, options).format(date)` |
| Relative time | `new Intl.RelativeTimeFormat(locale).format(value, unit)` |
| Lists | `new Intl.ListFormat(locale).format(['A', 'B', 'C'])` — "A, B, and C" / "A, B et C" |
| Plurals | `new Intl.PluralRules(locale).select(count)` — "1 item" / "2 items" / Russian "1 item / 2 items / 5 items" |

**Token shape:** the design system declares format tokens for the *intent* (`format.currency.short`, `format.date.full`, `format.relative-time`) — not raw format strings. The implementation resolves them via `Intl`.

### U.6 Dynamic text-length growth

**Rule:** UI text expands by **20–40% on average** when translated, with German often **+30–40%**, French **+15–30%**, and other Romance languages similar. CJK can shrink to **50–70%** of Latin width but takes more vertical space.

**Design implications:**
- Buttons and labels must accept dynamic widths — never set `max-width` that would clip a translated label
- Form labels should be allowed to wrap to two lines without breaking layout
- Navigation items should not be sized to fit only English text
- Truncate with ellipsis as a last resort (tooltip or `title` attribute reveals full text)

**Test pattern:** "pseudo-localize" English strings with `[!! Ŝámplé Téxt - 1.34x !!]` wrapping during development to surface overflow before real translation.

### U.7 Font subsetting per locale

**Rule:** Use `unicode-range` in `@font-face` declarations to ship only the glyph subsets each locale needs:

```css
@font-face {
  font-family: "Inter";
  src: url("inter-latin.woff2") format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153; /* Latin-1 */
}
@font-face {
  font-family: "Inter";
  src: url("inter-cyrillic.woff2") format("woff2");
  unicode-range: U+0400-04FF; /* Cyrillic */
}
```

The browser downloads only the subset relevant to the rendered glyphs. Reduces font payload by 60–90% in single-locale sessions.

For premium global products: use Google's **Noto** family (Noto Sans, Noto Serif, Noto Sans CJK) for non-Latin scripts when no brand-specific font supports them — Noto's coverage spans every living language.

### U.8 Bidirectional text handling

**Rule:** When a string mixes LTR and RTL content (e.g., an Arabic name in an English sentence, or vice versa), use Unicode bidi controls or HTML `<bdi>` to prevent rendering glitches:

```html
<p>The user <bdi>محمد</bdi> liked your post.</p>
```

`<bdi>` isolates the embedded directional text from the parent direction algorithm.

### U.9 Brand names and translation

**Rule (also stated in §N.14):** Wrap brand names with `<span translate="no">` to prevent auto-translation. Brand mark text in logos is rendered as image / SVG (not text) to prevent any translation issue.

### U.10 Right-to-left specific component quirks

- **Forms:** form layout flips, but checkbox/radio sits on the leading edge (right in RTL)
- **Modals:** close button stays top-end (top-right in LTR → top-left in RTL via logical properties)
- **Tooltips:** position relative to trigger; arrow direction adjusts
- **Dropdowns:** menus open from the trigger's start edge in either direction
- **Tables:** column order reverses; numbers stay LTR within cells
- **Progress bars:** fill direction reverses (start = leading edge)
- **Loading spinners:** rotation direction stays consistent (clockwise) — spinners are universal
- **Animations:** entrance from leading edge means entrance from right in RTL

### U.11 Testing matrix

**Rule:** Every UI must be tested at:
- LTR English baseline
- RTL Arabic (full bidi + tall-script line-height)
- CJK Japanese (no-italic, word-break, vertical metrics)
- Long German strings (pseudo-localized growth)
- Dynamic Type / sp at maximum scale

If a screen breaks at any of these, it is not premium-grade.

---

## §V — Code & Technical Surfaces

Any product targeting developers, technical users, or any audience encountering code (CLI commands, snippets, configuration) needs explicit code-rendering rules. Premium technical products (Linear, Vercel, Stripe, Anthropic, Cursor) treat code as a first-class typographic medium.

### V.1 Monospace font selection

**Rule:** Use a single monospace family across all code contexts. Premium choices in 2026:

| Font | Notes |
| --- | --- |
| **JetBrains Mono** | Open ligatures, excellent at small sizes, six weights, free |
| **Fira Code** | The original premium open-source mono; ligatures, broad acceptance |
| **GitHub Mono** (Mona Sans Mono / Hubot Sans Mono) | GitHub's house mono; OSS |
| **Geist Mono** (Vercel) | Paired with Geist sans; OSS |
| **Berkeley Mono** | Premium paid font; iconic in dev brands (Cursor, Linear ship near-Berkeley aesthetics) |
| **IBM Plex Mono** | Free, paired with Plex sans; corporate-modern |
| **SF Mono** (Apple system) | iOS / macOS native; not licensed for general web use |
| **Cascadia Code** | Microsoft; ligatures; OSS |

Avoid: Courier (signals dated), monospace stack fallbacks (inconsistent metrics across OSes).

### V.2 Inline code

**Anatomy:** `<code>` element inline within text.

**Spec:**
- Font: monospace family at **0.875em–0.9em** of surrounding text size (mono x-heights run larger than sans; downsize slightly to match optical weight)
- Background: `surface.subtle` (`neutral.3`) or `primary.3` for highlighting
- Padding: 2 × 6 px (vertical × horizontal)
- Radius: `radius.sm` (4 px)
- Border: optional 1 px `border.subtle`
- Color: `neutral.12` (or `primary.11` for emphasized inline code)
- Letter-spacing: 0
- Word-break: `break-word` to prevent overflow in narrow containers

Never apply inline code styling to UI elements that look code-like but aren't (button labels, menu items).

### V.3 Code blocks

**Anatomy:** `container[header(language? + filename? + copy-button) + body(line-numbers? + highlighted-code)]`

**Spec:**

| Element | Value |
| --- | --- |
| Container background | `surface.subtle` (light mode) / `surface.canvas` near-black with slight tint (dark mode — code blocks frequently use a dark theme even in light-mode UI) |
| Container radius | `radius.lg` (12 px) |
| Container border | 1 px `border.subtle` |
| Container padding | `space.4`–`space.6` (16–24 px) |
| Font | monospace, **13–14 px** |
| Line-height | **1.5–1.6** (more generous than UI body — code is scanned line-by-line) |
| Tab size | `tab-size: 2` (modern convention; 4 acceptable for older language conventions) |
| Header height | 36–40 px, `border.subtle` 1 px bottom |
| Header language tag | `body-sm` UPPERCASE or lowercase per convention, `neutral.11` |
| Filename | `body-sm`, `neutral.12`, monospace |
| Copy button | 32 × 32 px icon button, top-right, `ghost` variant, replaces icon with checkmark + "Copied" on success for 1.5 s |
| Line numbers | `body-sm` monospace, `neutral.8`, right-aligned, 12 px right-gap to code, non-selectable (`user-select: none`) |
| Horizontal scroll | `overflow-x: auto` with subtle gradient fade on right edge when content overflows |

**Wrap vs scroll:** code blocks horizontally scroll by default. Soft-wrap is opt-in via a toggle in the header (premium products like Linear let users choose).

### V.4 Syntax highlighting

**Rule:** Adopt a **single syntax-highlighting theme** per project for light mode and a matched theme for dark mode. Premium choices:

| Light themes | Dark themes |
| --- | --- |
| GitHub Light | GitHub Dark, Dracula |
| Solarized Light | Tokyo Night, One Dark |
| Catppuccin Latte | Catppuccin Mocha |
| Vercel light theme (Geist) | Vercel dark theme (Geist) |

**Custom themes** are an option for premium brands — but every custom theme must adhere to the brand's accent color rule (one primary accent for keywords or strings; never all rainbow).

**Token roles in syntax highlighting:**
- `keyword` (`if`, `return`, `import`) — accent color or strong neutral
- `string` — semantic success-leaning hue
- `number` — distinct from string
- `comment` — `neutral.10` (low contrast intentionally — comments are reference)
- `function` — accent variant
- `variable` — default `neutral.12`
- `type` — distinct from variable
- `punctuation` — `neutral.11`

Implementation: Shiki (modern, uses VS Code grammars), Prism, or highlight.js.

### V.5 Line highlighting and diff views

**Rule:** When showing changes:
- **Added lines:** background `success.3`, optional leading `+` in `success.11`
- **Removed lines:** background `danger.3`, optional leading `−` in `danger.11`
- **Modified lines:** background `warning.3` (rare; usually represented as removed + added pair)
- **Focused / annotated line:** subtle `primary.3` background, left border 2 px `primary.9`

Inline diff (word-level) uses a stronger background within the line on the changed characters.

### V.6 Keyboard shortcuts — `<kbd>` styling

**Anatomy:** `<kbd>` element wrapping individual keys.

**Spec:**

| Property | Value |
| --- | --- |
| Font | monospace (or sans if monospace clashes), **0.85em–0.9em** of surrounding text |
| Padding | 2 × 6 px |
| Background | `surface.canvas` (`neutral.1`) |
| Border | 1 px `border.default` |
| Border-bottom | 2 px `border.default` (creates physical-key illusion) |
| Radius | `radius.sm` (4 px) |
| Color | `neutral.12` |
| Min-width | 18 px (single character keys stay roughly square) |

Multi-key combinations:

```html
<kbd>⌘</kbd> <kbd>K</kbd>
```

Use the actual platform symbols: ⌘ ⌃ ⌥ ⇧ on macOS; `Ctrl` `Alt` `Shift` on Windows/Linux. Detect platform via `navigator.platform` and render the appropriate symbol.

Connect modifier sequences with a non-breaking space, never a `+` (per Vercel guidelines and Apple HIG). Example: `⌘&nbsp;K`, not `Cmd + K`.

### V.7 Terminal / command-line aesthetic

**Spec for terminal-style surfaces:**

- Container background: very dark (`oklch(0.18 0.005 240)` — slight cool tint) in any mode; terminals are universally dark
- Padding: `space.4`–`space.6` (16–24 px)
- Radius: `radius.lg` (12 px)
- Font: monospace, 13–14 px, line-height 1.6
- Text color: `oklch(0.92 0 0)` (off-white, never pure white)
- Prompt prefix: distinct color (often `success.9` for `$` / `>`), then default text
- Cursor: blinking block at end of input; CSS `@keyframes blink` 1 s infinite
- Selection: `primary.9` background, white text
- "Window chrome" decoration: optional three pseudo-buttons (red, yellow, green) at top-left for macOS-window aesthetic — purely decorative

### V.8 API reference patterns

For documentation of API endpoints:

| Element | Spec |
| --- | --- |
| HTTP method | Pill badge: `GET` (success-tinted), `POST` (primary-tinted), `PUT`/`PATCH` (warning-tinted), `DELETE` (danger-tinted). Monospace, `body-sm`, UPPERCASE, `radius.sm` |
| Path | Monospace inline code, larger than body (`body-md` mono) |
| Parameter table | Columns: Name (mono) / Type (mono) / Required (badge) / Description (sans) |
| Response shape | Code block with syntax highlighting |
| Try-it-now panel | Inline form mirroring parameters, with live response below |

### V.9 Method signatures inline

For inline function or method references in docs:

```
authenticate(user: User, options?: AuthOptions): Promise<Session>
```

- Method name in `primary.11` or `neutral.12` bold
- Parameter types in `neutral.11`, mono
- Optional parameter marker (`?`) preserved
- Return type after `:` in `neutral.11`

### V.10 Mobile and code

**Rule:** Code blocks on mobile:
- Always horizontal-scroll, never wrap (preserves indentation)
- Larger tap area for the copy button (44 × 44 px)
- Pinch-zoom enabled within the code block container
- Line numbers can collapse to save horizontal space on small screens

### V.11 Code block do-not list

- Do not use proportional fonts for code
- Do not apply text-shadow or letter-spacing to code
- Do not use `font-weight: bold` on entire code blocks (syntax highlighting handles emphasis)
- Do not place code blocks inside narrow columns without horizontal scroll
- Do not omit a copy button — copy is the #1 user action on a code block

---

## §W — Product Flow Patterns

Premium product UX includes the flows that aren't single components: authentication, settings, search, notifications, onboarding, confirmation, and empty states. Each has accumulated conventions worth codifying.

### W.1 Authentication flows

**Sign-up:** the lightest possible form. Premium standard:
- Single screen with: email + password (or social auth row + email link)
- No "confirm password" field (use single password + show/hide toggle); password rules visible inline as the user types
- Social auth row above email if offered; visually distinct buttons, vendor-branded (Google, Apple, GitHub)
- Magic-link / passwordless preferred over password for consumer products
- Honor `autocomplete="email"`, `autocomplete="new-password"`
- After submit: brief loading state on the button (~500 ms minimum visible to prevent flicker), then navigate
- Error handling: errors render below the relevant field, never as global alerts

**Sign-in:** even lighter. Email + password (or just email for magic-link). "Forgot password" link beneath. "Don't have an account? Sign up" link at the bottom.

**OAuth handoff:** maintain visual continuity. The redirect destination should preserve the user's intent context ("Continuing to [app]…").

**MFA:**
- 6-digit code input rendered as 6 individual character boxes (not a single field)
- Auto-advance focus on input
- Auto-submit on the 6th digit
- Paste detection — pasting "123456" fills all 6 boxes

**Email verification:** in-line message + resend button (cool-down timer 30–60 s on resend to prevent abuse)

**Password reset:** two-step flow: request screen (email) → success screen ("Check your email") → redirect from email → new password screen → success/sign-in screen.

### W.2 Settings architecture

**Rule:** Settings have three valid information architectures. Pick one and apply consistently:

| Pattern | Layout |
| --- | --- |
| **Sidebar nav** | Left sidebar of categories, right panel of settings for the active category. Standard for desktop-first products (Linear, Slack, Notion) |
| **Tabs / top nav** | Tabs across the top (Profile / Account / Notifications / Billing). Best for ≤ 6 categories |
| **Single scrolling page with section headings** | All settings on one page, separated by sticky section headings. Best for mobile and lightweight products |

**Save model:**
- **Auto-save preferred** for individual settings (toggle, select). Settings reflect changes immediately; brief inline confirmation (`Saved` text fading after 1.5 s) provides feedback
- **Explicit save** for sensitive groups (billing, security): primary button at the bottom, sticky on scroll, disabled when no changes are pending
- **Discard-on-leave warning** required for explicit-save patterns: confirm modal if user navigates away with unsaved changes

**Setting-item anatomy:**

```
[label]
[helper text — optional, body-sm neutral.11]
[control — switch / input / select]
```

- Items stacked vertically with `space.6` (24 px) gap between
- Section headings: `heading-sm`, `space.10` (40 px) top margin
- Subsection: `label-sm`, `space.6` top margin
- Dangerous actions (delete account, transfer ownership): in a "Danger zone" section at the bottom with red `border.default` accent and explicit confirmation modal

### W.3 Search and command palette

**Inline search input** (in nav, in tables): standard `Input` (§O.2) with leading search icon and optional trailing keyboard shortcut hint (`⌘&nbsp;K`).

**Command palette** (cmd+K / ctrl+K):
- Trigger: keyboard shortcut universal + clickable inline search hint in nav
- Container: centered overlay modal, max-width 560 px, fixed top distance 15% of viewport height (premium: vertically slightly above center, not centered)
- Header: search input with leading icon, no border, `body-md` placeholder, autofocus on open
- Results list: max-height ~400 px scrollable
- Result items: 36–40 px tall, leading icon + label + optional trailing metadata (keyboard shortcut, section name)
- Sections: `overline` (UPPERCASE) labels like "Recent", "Suggested", "Pages", "Actions"
- Empty state: "No results for 'query'" with optional suggestions
- Keyboard navigation: arrows move selection, Enter activates, Esc closes
- Search behavior: fuzzy match (`fzf`-style), debounced 50–100 ms
- Open animation: backdrop fades in `fast`; container fades + scales from 0.96 to 1.0 with `spring.snappy`

Premium examples: Linear, Vercel, Raycast, Arc all use near-identical command palette UX.

### W.4 Notification taxonomy

Five distinct notification channels — each with a clear role:

| Channel | Use | Component |
| --- | --- | --- |
| **Toast** | Transient confirmation of a user action ("Saved", "Copied") | §P.3 |
| **Banner** | Persistent contextual message scoped to a page or section (system status, account warning) | §P.14 |
| **Inbox** | Async notifications the user can review later (mentions, comments, system alerts) | Dedicated page or panel |
| **Badge** | Numeric indicator on an icon or nav item (unread count) | Small circle, `danger.9` background, white text, `body-sm` (10 px), `radius.full` |
| **Push** | Out-of-app notification (browser, mobile OS) | Platform-native |

**Mapping rule:** an action confirmation ("Saved") → toast. A status alert ("Storage almost full") → banner. An asynchronous event ("Alice commented") → inbox + badge + optional push. Never use a modal for an asynchronous notification.

**Inbox panel:**
- Slide-out from the right edge (desktop) or full-screen (mobile)
- Notification items: leading avatar/icon + content (title + body + timestamp) + optional inline actions
- Unread state: subtle `primary.3` background or leading dot
- "Mark all as read" affordance
- Filters: All / Unread / Mentions

### W.5 Onboarding patterns

Five valid onboarding approaches:

| Pattern | Use |
| --- | --- |
| **Empty-state-driven** | Show the real product with empty states that guide the first action. Power-users preferred. Default for premium products. |
| **Progressive disclosure** | Surface advanced features as the user encounters relevant tasks. No upfront tour. |
| **Contextual coach marks** | Spotlight individual UI elements with brief explanations as triggered (e.g., first time user clicks a complex feature). Dismissible. Never appear on first launch all at once. |
| **Step-by-step modal** | For required setup (account creation, billing, profile, permissions). Show a progress indicator. Cap at ≤ 4 steps. |
| **Milestone / checklist** | Persistent panel with onboarding tasks (e.g., "Create your first project", "Invite a teammate", "Connect calendar") — % complete visible, dismissible after completion |

**Forbidden onboarding pattern:** 5+ swipeable intro slides on first launch. Users skip these uniformly.

### W.6 Empty states (full spec, extends §P.15)

Three empty-state variants:

| Variant | When | Composition |
| --- | --- | --- |
| **Initial empty** | User has not yet created any data | Encouraging illustration + title + body + primary CTA (create the first item) |
| **Filtered empty** | User has filtered to a result set with zero matches | Smaller layout (no illustration) + "No results for [filter]" + reset filter action |
| **Error empty** | Data failed to load | Error icon + "Couldn't load [resource]" + retry action + optional support link |

### W.7 Confirmation patterns

**Destructive action confirmation:**
- Modal (§P.2) with: title ("Delete project?"), body explaining consequences ("This will permanently delete 47 tasks and cannot be undone."), Cancel button (`secondary`) + Confirm button (`destructive`)
- For *catastrophic* actions (delete account, transfer ownership): require typing a confirmation string (the project name, the word "DELETE")
- The destructive button is on the *right* (primary placement) — counterintuitive but matches macOS convention and reduces accidental Cancel
- Never use `window.confirm()`; always use the styled modal

**Undo confirmation:**
- Preferred over destructive confirmation for any reversible action (archive, hide, remove from list)
- Show a toast with "Action — Undo" button for 5–10 seconds
- Especially powerful when paired with optimistic UI (action applies immediately, undo reverses)

**Success confirmation:**
- Toast for low-stakes actions (save, copy)
- Inline checkmark for in-context actions (toggle, switch)
- Brief celebration animation only for milestone completion (first task complete, onboarding done) — never for routine saves

### W.8 Pagination patterns

Three valid pagination approaches:

| Pattern | Use |
| --- | --- |
| **Numbered pagination** | Bounded, ordered, scannable lists where users may want to jump (search results, archives) |
| **Infinite scroll** | Feed-like consumption (social posts, image galleries) — anti-pattern for footer-bearing pages |
| **"Load more" button** | Hybrid — preserves footer access, gives user control, no surprise content jumps. **Default recommendation for most lists.** |

Never combine: numbered pagination + infinite scroll on the same view.

### W.9 Loading patterns (extends §J.5)

Beyond spinner / skeleton / progress bar:

- **Optimistic UI** — apply user action immediately to the UI, send the request in the background, reconcile on response. Default for premium consumer products (Linear, Notion). Pair with undo toast for safety.
- **Suspense / streaming** — render parts of the page as they become ready (React Suspense, Next.js Streaming SSR). Avoid showing the entire page as a global loader.
- **Stale-while-revalidate** — show cached content immediately while re-fetching; replace if changed. Pattern from SWR, React Query.

### W.10 Error states and recovery

**Page-level errors (404, 500):**
- Centered: large numeric / illustration (96–160 px) + heading + body explanation + primary action (Home, Retry, Contact support)
- Avoid jokes — premium errors are calm and helpful
- Provide a way back; never dead-end

**Inline errors (form validation, async failure):**
- Adjacent to the source (per §O.2 input spec)
- Specific: "Email already in use" beats "Invalid email"
- Recoverable: tell the user how to fix it
- Never block input — show errors as feedback, not a wall

**Critical errors (data loss, sync failure):**
- Banner at the top of the affected area
- Persistent until acknowledged or fixed
- Provide retry + escalation path

### W.11 Permission requests (mobile, browser)

**Rule (extends §R.11):** Pre-prompt before the system dialog.

1. Show a custom in-app explanation of why the permission is needed
2. User taps "Allow" on your custom prompt
3. THEN trigger the system permission dialog

This pattern roughly doubles permission grant rates and prevents accidental permanent denials that lock the feature.

---

## §X — Microcopy & UX Writing

Per §Y.7, Shopify Polaris treats content as a first-class category alongside tokens and components. Premium products' voice is consistent enough to be identifiable from a single sentence (Stripe sounds like Stripe; Linear sounds like Linear). The rules below codify that consistency.

### X.1 Voice principles — four invariants

| Principle | Application |
| --- | --- |
| **Active voice** | "Install the CLI" not "The CLI will be installed". Subject does the action. |
| **Concise** | Cut every word that doesn't earn its space. Especially: "in order to" → "to", "at this time" → "now", "make sure to" → "verify". |
| **Human** | Write how a thoughtful person would explain it to a colleague. No corporate-speak. |
| **Specific** | "Saved" beats "Success". "12 new comments" beats "You have notifications". |

### X.2 Capitalization

**Rule:** Pick one of two systems and apply consistently:

| System | Use | Example |
| --- | --- | --- |
| **Title Case (Chicago)** | Premium / editorial / Vercel-style | "Get Started With Temperance" |
| **Sentence case** | Modern / approachable / Stripe & Notion-style | "Get started with Temperance" |

Sentence case is the default modern recommendation — easier to read, more conversational, more international-friendly. Title case reads as more formal / premium-editorial.

Apply chosen system to: page headlines, section headings, button labels, navigation items, table column headers, menu items.

UPPERCASE is reserved for: `overline` eyebrows, badges/chips when explicitly designed, status indicators ("LIVE", "BETA"). Never use for body text. Add tracking (+0.05–0.1em) when used.

### X.3 Button label conventions

**Rule:**
- **Verb-first.** "Save changes", "Create project", "Send invite" — not "OK", "Submit", "Done"
- **Cap length at 24 characters** (3–4 words). Longer → use a different component (link, menu).
- **Specific over generic.** "Save API Key" beats "Save". "Delete project" beats "Delete".
- **Match the action to its outcome.** "Get started" implies action is starting; "Start" implies starting now. Choose based on whether the next screen begins the work or sets up to begin.
- **Destructive verbs are explicit.** "Delete" not "Remove". "Cancel subscription" not "Cancel" (cancel is the secondary verb in a confirmation dialog).
- **No periods** at end of button labels. Buttons are not sentences.

**Common button label library:**

| Intent | Use | Avoid |
| --- | --- | --- |
| Confirm action | "Save", "Save changes" | "OK", "Done" |
| Cancel action | "Cancel" | "No", "Dismiss" |
| Destructive | "Delete", "Remove access" | "OK" |
| Forward in flow | "Continue" (when continuing existing flow) / "Next" (when stepping) | "Submit" |
| Primary CTA marketing | "Get started", "Try it free", "Start your trial" | "Click here", "Submit" |
| Sign-in / Sign-up | "Sign in", "Sign up", "Create account" | "Login", "Register" |
| Submit form | "Submit application", "Send message" | Just "Submit" |

### X.4 Error message structure

**Rule:** Every error message follows the three-part structure:

```
[What happened] · [Why it happened (optional)] · [How to fix it]
```

Examples:
- ✓ "Couldn't save your changes. The connection timed out. Try again, or check your network." (all three)
- ✗ "Error occurred." (none)
- ✗ "Internal Server Error (500)." (technical, no recovery)

**Tone rules:**
- **Frame as forward motion.** "Something went wrong — try again or contact support" beats "Your deployment failed."
- **Take responsibility** when it's the system's fault. "We couldn't load your projects" beats "Failed to load projects."
- **Be specific** about what failed. "Couldn't connect to GitHub" beats "An error occurred."
- **Avoid blame.** Never imply the user did something wrong unless they actually did (and then say so kindly).

### X.5 Empty-state copy

**Three-part structure:**

```
[Title — what's missing or what's possible]
[Body — context or value of taking action]
[CTA — the next step]
```

Examples:
- ✓ "No projects yet" / "Create your first project to start organizing your work" / Button: "Create project"
- ✗ "Nothing here" / (no body) / Button: "+"

### X.6 Form labels and helper text

**Labels:** verb or noun describing the field. "Email address" not "Your email". Capitalization matches §X.2 system. Always visible (never placeholder-only).

**Helper text:** brief context, examples, or constraints. "We'll never share your email." / "8+ characters, mix of letters and numbers."

**Placeholder:** example of valid input, ending with `…`. "name@example.com" / "+1 (555) 000-0000…"

**Required marker:** asterisk after the label, not the word "required". Or: mark *optional* fields with "(optional)" — sometimes cleaner if most fields are required.

### X.7 Confirmation copy

**Destructive confirmation modal:**
- Title: question form. "Delete project?" / "Remove team member?"
- Body: state consequences explicitly. "This will permanently delete 47 tasks. You can't undo this."
- Buttons: action verb on the destructive button ("Delete project"), generic on cancel ("Cancel")

**Success confirmation toast:**
- Past-tense verb + object. "Project deleted." / "Invite sent."
- No exclamation marks (premium tone is calm, not enthusiastic)
- Pair with undo link when reversible

### X.8 Date / time / quantity formatting rules

**Rule:** Per §U.5 use `Intl` APIs. Beyond formatting:

- **Numerals for counts.** "8 deployments" not "eight deployments" (per Vercel guidelines).
- **Relative time for recency**, absolute time for distant past. "2 minutes ago" / "3 hours ago" / "Yesterday" / "Mar 15" / "Mar 15, 2024".
- **Currency consistency.** Display all currencies with 0 decimals (`$1,234`) OR all with 2 decimals (`$1,234.00`). Never mix.
- **Time zones.** Show times in the user's local timezone by default; offer to display in event's original timezone for scheduling contexts.
- **Date formats follow locale** — never hardcode `MM/DD/YYYY` (US ambiguous internationally).

### X.9 Inclusive language

**Rule:**
- Use **gender-neutral language**: "they", "team", "people", "users" — not "guys", "manpower"
- **Avoid ableist language**: "outdated" not "broken"; "ignore" not "blind to"; "complex" not "crazy"
- **Avoid violent metaphors** in onboarding/help: "remove" not "kill"; "stop" not "abort" (technical contexts excepted)
- **Use plain words.** "Use" not "utilize". "Help" not "assist". "Show" not "exhibit".

### X.10 Avoidance list — banned filler words and patterns

Words and patterns that signal AI-generated or template marketing copy:

| Avoid | Use |
| --- | --- |
| "Seamless" | "Easy", "smooth", or describe the actual benefit |
| "Leverage" (verb) | "Use" |
| "Robust" | Describe specifically what's robust |
| "Powerful" | Describe what it does |
| "Cutting-edge" | Describe what's new |
| "Revolutionary" | Describe the change |
| "Game-changing" | Just describe the impact |
| "World-class" | Cut entirely |
| "Best-in-class" | Cut entirely |
| "Synergy" | Cut entirely |
| "Unlock", "Empower" | Verb describing the actual action |
| Emoji in product copy (not user-generated) | None |
| "Click here" | Specific action verb |
| "Please" before every action | Drop — it's implicit |

### X.11 Microcopy length budgets

| Element | Word cap |
| --- | --- |
| Button label | 1–4 words (≤ 24 chars) |
| Toast | 1 short sentence (≤ 60 chars) |
| Tooltip | 1 short sentence (≤ 100 chars) |
| Helper text | 1 sentence (≤ 80 chars) |
| Error message | 1–2 sentences |
| Section heading | 1–6 words |
| Page headline (product UI) | 1–8 words |
| Page headline (marketing hero) | ≤ 44 chars (per §Q.2) |
| Empty state title | ≤ 6 words |
| Empty state body | 1 sentence |

Premium copy fits these budgets. Long copy = unedited copy.

### X.12 Numbers, brand names, and product references

- **Brand names always capitalized as the brand spells itself.** "GitHub" not "Github"; "iPhone" not "Iphone"; "macOS" not "MacOS".
- Wrap in `<span translate="no">` (per §N.14 / §U.9) so machine translation doesn't mangle them.
- **Pluralize correctly.** "2 GBs" wrong; "2 GB" correct (units don't pluralize). "Two users" / "1 user".

---

## §Y — Measured Reference Data

This section captures concrete principles and values extracted directly from premium published design systems and practitioner content, anchoring the more general guidance in §B–§S.

### Y.1 Vercel "Web Interface Guidelines" — concrete published rules

Vercel publishes a working set of guidelines at vercel.com/design/guidelines that any AI agent producing premium UI should adopt. Verbatim or near-verbatim rules:

**Typography craft:**
- Use **typographic curly quotes** (`"`/`"`), never straight quotes
- Use the **ellipsis character** (`…`), never three periods (`...`)
- Apply `font-variant-numeric: tabular-nums` for any column of numbers
- Connect units with **non-breaking spaces**: `10&nbsp;MB`, `⌘&nbsp;+&nbsp;K`
- Headings and buttons use **Chicago title case**
- Avoid widows and orphans — clean the rag

**Color craft:**
- **Prefer APCA over WCAG 2** for perceptual contrast
- Interactive states (hover/active/focus) require **increased contrast** versus rest
- Set `<meta name="theme-color">` to match the page background
- Declare `color-scheme: dark` on `<html>` for native scrollbar contrast in dark mode
- Never communicate status by color alone

**Spacing & alignment craft:**
- "Adjust ±1px when perception beats geometry" — **optical alignment** trumps strict grid math when they conflict
- Every element aligns to grid, baseline, or **optical center**
- Use `env(safe-area-inset-*)` for notched devices

**Interaction craft:**
- Hit targets: **≥24 px visual minimum**, expand to ≥24 px clickable; **44 px on mobile**
- Mobile input `font-size ≥ 16 px` to prevent iOS auto-zoom, or set `viewport maximum-scale=1`
- Focus rings via `:focus-visible`, never `:focus`
- Loading buttons keep the original label visible while showing a spinner
- Destructive actions either confirm OR provide an undo window
- `touch-action: manipulation` on tappable elements (prevents double-tap zoom)

**Motion craft:**
- Animate `transform` and `opacity` only — never `width`, `height`, `top`, `left` (forces layout)
- Never use `transition: all` — explicitly list transitioned properties
- SVG transforms use `<g>` wrappers with `transform-box: fill-box; transform-origin: center`
- Animations must be interruptible (user input cancels)
- Spinners/skeletons: **150–300 ms show-delay**, **300–500 ms minimum visible duration** (prevents flicker)

**Form craft:**
- Every control has a `<label>` or accessible label
- **Enter submits** when a text input is the sole/last control in a form
- **Textarea: ⌘/⌃+Enter submits**; Enter creates newline
- Validation: allow any input; show errors, don't block keystrokes
- Errors appear **adjacent to the field**; **focus the first error** on submit
- Set `autocomplete` and meaningful `name` for autofill
- Placeholders end with **ellipsis** and show example format (`+1 (123) 456-7890…`)

**Performance craft (as design constraints):**
- POST/PATCH/DELETE complete in **< 500 ms** (above this, design loading state)
- Always set explicit image dimensions (prevents CLS)
- Virtualize long lists OR use `content-visibility: auto`
- Use `unicode-range` to ship only necessary font code points

**Copy craft (per Vercel):**
- **Active voice always.** "Install the CLI" not "The CLI will be installed."
- Prefer **`&` over "and"**
- Frame errors as forward motion: "Something went wrong — try again or contact support" beats "Your deployment failed."
- Error copy must **explain how to fix**, not just what failed
- **Numerals for counts**: "8 deployments" not "eight deployments"
- Currency: either all 0-decimal or all 2-decimal, never mixed
- **Specific labels over generic**: "Save API Key" beats "Continue"
- Wrap brand names with `translate="no"` to protect from auto-translation

### Y.2 Karri Saarinen (Linear) — the 10 rules of craft

Source: Figma blog summary of Karri's Config talk. These are organizational / philosophical principles, but they translate into template rules at the structural level.

1. **Leadership commits to quality as the top priority** — craft is the unifying constraint, not a phase
2. **Small high-caliber teams** — fewer competing opinions; standards over output
3. **Eliminate handoffs** — design and engineering share responsibility for the result; no "throw it over the wall"
4. **Resist specialized product teams** — rotate responsibility; prevent quality silos
5. **Specs are the floor, not the ceiling** — meeting spec is the start of craft, not the end
6. **Distinguish quality from perfection** — never ship below the quality bar, but accept that some refinement happens in beta
7. **Opinionated > flexible** — products with a point of view win over general-purpose alternatives
8. **Reduce scope to raise quality** — when quality feels impossible, do less, better
9. **Principles over rigid processes** — hire thoughtful people, give them connection to users, push responsibility down
10. **Question data-driven decisions** — Linear largely avoids A/B testing in favor of intuition; "develop and trust your intuition"

**Template translation:** these rules support the AI Agent Contract's spirit — "produce design work as if it has a single opinionated author with a strong point of view, not as if assembled by committee from competing patterns."

### Y.3 Rauno Freiberg — interaction-design principles ("Devouring Details" + craft essays)

Source: rauno.me/craft and devouringdetails.com. Rauno is Vercel's Staff Design Engineer; his writing is the most-cited contemporary reference for premium interaction craft.

**Eight craft pillars from Devouring Details:**
1. **Inferring intent** — design infers what the user means before they finish saying it (autocomplete that anticipates, gestures that scale with momentum)
2. **Interaction metaphors** — reuse physical-world metaphors (page-turn, pinch, scroll) so learning compounds
3. **Ergonomic interactions** — minimize finger / hand travel; design for thumb zones on mobile
4. **Simulating physics** — momentum-based scrolling, mass and friction in transitions, never artificially-timed-feeling motion
5. **Motion choreography** — orchestrate multi-element timing; never animate everything simultaneously
6. **Responsive interfaces** — UI responds to *velocity* and *pressure*, not just position
7. **Contained gestures** — gestures should be scoped to their target; never override system gestures
8. **Drawing inspiration** — premium craft references the analog and historical, not just the contemporary digital

**Concrete interaction principles from the essays:**

- **Two-gesture system trains layered UI** (tap = enter, swipe = navigate). Build interaction systems on a small consistent vocabulary
- Gestures must be **interruptible** at any point — never lock the user into a committed motion
- **Trigger timing varies by action weight:**
  - Lightweight (preview, peek): trigger *during* gesture
  - Destructive (close, delete): trigger only on *gesture completion*
  - Navigation: trigger when element reaches its final position
- **Immediate response, deferred animation:** scale delta or position shift applies *instantly*; the easing animation only runs after a threshold
- **Magic corners (Fitts's Law):** corners and edges of the screen have infinite target area — put high-frequency actions there
- **Touch affordances:** show a magnifying loupe or enlarged preview where the finger obscures the target
- **Slider/drag extends beyond visual bounds** — moving slightly outside the slider track shouldn't cancel the gesture
- **Skip animation for high-frequency or low-novelty actions** — a command palette opened 100 times a day should not animate; a once-per-session modal can
- **Fidgetability** — premium products invest in satisfying tactile feedback unrelated to the primary function (toggle resistance, scroll snap detents)
- **Spatial consistency** — apps launching from a position should animate from that position; users build spatial models
- **Implicit input feels magical** — Maps showing navigation without unlocking, Wallet brightening for passes — the system anticipates without an explicit gesture

**Template translation:** these principles feed §I (Motion) — particularly the choreography rules — and §J (States) — particularly the responsive-vs-decisive distinction.

### Y.4 Atlassian token system — concrete naming and scale

Source: atlassian.design/foundations/spacing

**Spacing system:**
- **8 px base** named `space.100` (100% of base)
- Naming uses **percentage multipliers** of the base unit
- Full scale (0 to 80 px):

| Token | Multiplier | px |
| --- | --- | --- |
| `space.0` | 0× | 0 |
| `space.025` | 0.25× | 2 |
| `space.050` | 0.5× | 4 |
| `space.075` | 0.75× | 6 |
| `space.100` | 1× | 8 |
| `space.150` | 1.5× | 12 |
| `space.200` | 2× | 16 |
| `space.250` | 2.5× | 20 |
| `space.300` | 3× | 24 |
| `space.400` | 4× | 32 |
| `space.500` | 5× | 40 |
| `space.600` | 6× | 48 |
| `space.800` | 8× | 64 |
| `space.1000` | 10× | 80 |

- Negative tokens range from `space.negative.025` to `space.negative.400`

**Color tokens** use a dotted semantic path: `color.text.accent.red`, `color.background.accent.*`, `color.border.warning`, etc. — role-based, not raw scale-based.

**Elevation tokens** are intent-based: `elevation.surface.hovered`, `elevation.surface.overlay`.

**Comparison to the Radix 12-step model recommended in §C:** Atlassian's tokens are more semantic-role-named (good for clarity), but lack the explicit per-step purpose that Radix provides. **Template recommendation: combine — use Radix-style per-step purposes internally, expose Atlassian-style semantic role names for component code.**

### Y.5 Pixel Point cross-case-study synthesis

Six case studies inspected (Cluely, Huly, Vantage, Gitness, AgentQL, Slash). Recurring patterns specific to Pixel Point's work:

| Project | Distinctive move |
| --- | --- |
| **Cluely** | Scroll-triggered animation as primary explanatory mechanism. "Minimal friction, maximum clarity." |
| **Huly** | Smooth animations that "highlight every product feature." Performance-first despite resource-intensive pages. |
| **Vantage** | Custom illustration grounded in real product UI. Strategic logo preservation during refresh. Modular component library enabling many feature/integration pages. |
| **Gitness** | Rive-driven animation, 7-week delivery, no design revisions, performance as a design output. |
| **AgentQL** | Cross-disciplinary single offering (brand + motion + illustration + web + dev). Developer-resonant aesthetic without losing polish. |
| **Slash** | "Hard identity — more Porsche than pastel SaaS." Strong typography + minimal layouts as the entire visual thesis. Vertical-first architecture, clear CTAs. |

**Universal Pixel Point patterns:**
- **Rive** for animation (not just CSS / Lottie) — enables interactive, performance-friendly motion
- **Next.js + Tailwind + Sanity CMS** stack as the implementation foundation
- **Custom illustration > stock photography**, always
- **Strong typography is the load-bearing element** — not color, not layout tricks
- **Performance is part of the brand** — heavy animation paired with fast load
- **Modular component library** ships alongside the visual identity — enabling many pages to share a vocabulary
- **No-revision delivery** is the measure of craft alignment — implies tight discovery / mood-board upfront

**Template translation:**
- §I (Motion): elevate Rive / Lottie as the recommended animation tooling for interactive illustration
- §B (Reference Aesthetic): "strong typography is load-bearing" reinforces the type-section rules in §D
- §L (Imagery): reinforce "custom illustration is the premium default"
- §Q (Web Patterns): a `modular component library` is itself a deliverable, not just a side effect

### Y.6 Common premium tech stack — context for the AI agent

The published / observed implementation stack across Pixel Point, Vercel, Linear, Stripe, Mercury, Anthropic:

| Concern | Stack |
| --- | --- |
| Framework | Next.js (App Router) or Astro |
| Hosting | Vercel |
| Styling | Tailwind CSS v4 (with CSS variables driven from token files) |
| UI primitives | shadcn/ui (built on Radix Primitives) |
| Animation | Framer Motion (React) or Rive / Lottie (illustrative) |
| CMS | Sanity, Contentlayer, or MDX-in-repo |
| Type | Custom or Inter / Geist / Söhne / GT America |
| Icons | Lucide |
| Forms | React Hook Form + Zod |
| Charts | Recharts or Visx |

This is context for the AI agent: when producing code, default to this stack unless the project's `DESIGN.md` declares otherwise.

### Y.7 Shopify Polaris — content + tokens are co-equal

Source: polaris-react.shopify.com

Polaris treats **content patterns and voice** as a first-class category alongside tokens, components, and patterns. Their content section covers grammar, capitalization, tone, error messages — at the same depth as their component spec.

**Template translation:** Microcopy and voice are not optional — see §X.

### Y.8 Linear "Details Matter" — published craft posture

Linear shipped a short documentary in January 2026 explicitly framing every interface decision as a *craft* decision. The explicit thesis: **details are the product**. Tokens, components, and pages are scaffolding; the felt quality of a click, a focus ring, an empty state — that *is* the product.

**Template translation:** the AI Agent Contract (§A.6) must include "details are the product" as a core value, not a finishing touch. The micro-interactions and edge-case copy should be authored with the same care as the primary flow.

### Y.9 Third-pass: Pixel Point's own production site

Inspecting pixelpoint.io directly (vs only the case study pages) reveals what they practice on themselves:

- **Dark-first canvas.** Deep navy / charcoal background, stark white text. The agency's own site is darker than most of the work they ship for clients — signaling "we are the builder, not the brand."
- **Sectioned problem-solution narrative.** Sections are framed as "It doesn't have to be like that" — content is *argued*, not just listed.
- **Asymmetric offsets are universal.** Illustrations and text never align predictably; the grid is flexible, not strict. Compositions break across columns intentionally.
- **Numbered process disclosure.** A six-step methodology breakdown sits prominently — process transparency builds credibility.
- **Case study cards include social-proof metrics** (e.g., "Huly: 25,411 GitHub stars") inline with the project card.
- **Generous vertical padding** between sections (80–120 px) — confidence pacing.
- **Restraint and confidence as the dominant aesthetic move.** Every element earns its space. No decorative flourishes, no gratuitous gradients, no overpacked feature lists.

**Template translation:**
- "Dark-first" is a valid premium move for builder/developer-facing surfaces. For consumer products like Temperance, light-first remains the default.
- Numbered process disclosure (visible methodology) is worth including as an optional Web Pattern (§Q.13).
- The "argued narrative" voice — framing content as problem/solution rather than feature list — is worth codifying in §X (Microcopy).

### Y.10 Third-pass: Stripe's signature design moves

Inspection across stripe.com, stripe.press, stripe.com/sessions, and stripe.com/pricing reveals Stripe-specific patterns worth borrowing or being inspired by:

**Typography stack:**
- **Stripe Sans** (custom typeface) for display + headlines
- **Inter or system stack** for body text
- The custom display face is *the* signal — bespoke type is the single strongest premium move in 2026 typography

**Color signature:**
- Brand: **purple/indigo `#635BFF`** (the famous Stripe purple)
- The **animated purple-to-blue gradient wave** in the hero is itself a brand asset — a specific, recurring, ownable visual moment
- High-contrast neutrals (pure white / near-black) everywhere else

**Compositional vocabulary:**
- **Hero-first architecture** with massive value-prop headline above fold
- **Bento grid** for the "Flexible solutions" section — Stripe popularized this pattern in 2022; it is now industry standard
- **Asymmetric balance** — right-aligned imagery + left-aligned copy with deliberate negative space
- **Concrete trust numbers** stated specifically and verifiably: "135+ currencies," "$1.9T in payments volume," "50% of Fortune 100 use Stripe" — this is Stripe's defining content move
- **Customer logos as social proof** with named brands (Hertz, URBN, Instacart)

**Pricing page specifically:**
- Card-based pricing (not table-grid) — each tier is a contained card
- **High contrast around price values** — bold black, larger weight
- "Standard" vs "Custom" two-tier framing rather than 3-tier — accessibility paired with premium upgrade path
- Educational content interleaved (links to guides, docs) — positions Stripe as thought leader, not just transaction processor
- Subtle tab interactions for switching plans without page reload

**Stripe Press signature (entirely different aesthetic):**
- **Serif typography** for body + headlines (counter-positioning vs the sans on stripe.com)
- Off-white / light-gray neutral backgrounds
- **Modular book presentations** stack consistently: title → author → description → purchase → bio → praise — exactly like a book jacket
- **Whitespace-driven**, each book reads like a curated artifact
- **Left-aligned** text (traditional book layout)
- **Pull-quote treatment** elevates endorsements like a literary review
- **"Living cover" interactive depth** — covers respond on hover without screaming "digital"
- **Downloadable zines** as PDF companions — extends publication metaphor into a tangible artifact

**Template translations:**
- A custom display typeface is the single highest-leverage premium investment when budget allows
- An ownable signature gradient or visual moment (like Stripe's wave) is a brand asset, not just a decoration
- Concrete trust numbers >> abstract claims — codified as a Microcopy rule (§X)
- Serif counter-positioning is a valid move when the project has a "publication / library / archive" surface
- Bento grids for product feature showcase are established premium pattern (already in §Q.4)

### Y.11 Cross-reference signature moves from production-site mining

Across Pixel Point, Cluely, Vantage, Slash, Vercel, Stripe, Linear, Mercury, and Anthropic — these patterns repeat enough to be considered canonical premium moves:

| Move | Where observed | Template section it informs |
| --- | --- | --- |
| **Custom display typeface as signature** | Stripe Sans, Geist, Inter for body | §D — type families |
| **One ownable signature gradient or visual moment** | Stripe wave, Vercel globe pulse, Cluely's hide/show paradox | §Q — hero pattern |
| **Concrete quantification as trust signal** | Stripe's "$1.9T payments", Slash's "$35bn+ spent", Cluely's "300 ms response, 95% accuracy", Vantage's KPI metrics | §X — microcopy |
| **Real photography of real people, not stock** | Cluely's actual participant faces, Slash's customer testimonials | §L.5 — photography style |
| **Code samples rendered as native UI** | Vercel, Linear, Stripe API docs | §V — code surfaces |
| **Cool desaturated palette for fintech / credibility** | Slash (navy + soft gray), Mercury (teal-on-near-white), Stripe (purple anchor on neutral) | §C — palette structure |
| **Asymmetric offset compositions** | Pixel Point's own site, Linear, Stripe, Vercel | §F.6 — asymmetric layouts |
| **Numbered process / methodology disclosure** | Pixel Point's own site, Linear's "Method" page | §Q — new pattern: methodology page |
| **Argued narrative ("Here's what's wrong; here's what we built")** | Pixel Point's own site, Slash ("higher standard"), Linear's "lost art of true quality" framing | §X — voice |
| **Compliance / legal footnotes de-emphasized typographically** | Slash, Stripe, Mercury (visible but `body-sm` neutral.10) | §X — copy hierarchy |
| **Density and whitespace coexisting** | Slash, Stripe, Linear — no choice between info density and breathing room | §E — spacing philosophy |
| **Sectioned single-page design with smooth jumps** vs. multi-page nav | Pixel Point, Cluely, Stripe Press individual book pages | §Q — composition |
| **Dark-mode-first or dark-default surfaces for builder products** | Pixel Point's own site, Vercel default, Linear default | §C — mode declaration |
| **Bento grid for multi-feature products** | Stripe, Vercel, Cluely | §Q.4 (already documented) |
| **Numbered "we built X" credibility callouts** ("Huly: 25,411 GitHub stars" on a card) | Pixel Point case study cards | §Q — social proof |

### Y.12 Premium copy patterns vs hype patterns (third-pass evidence)

Observation across Slash ("a higher standard"), Linear ("lost art of true quality"), Stripe ("financial infrastructure"), Pixel Point ("It doesn't have to be like that"), and Vercel ("the AI cloud"):

**Premium copy patterns (use):**
- **"Standard," "discipline," "craft," "method"** — frames the product as adherent to known excellence
- **"Lost art," "first principles," "from scratch"** — frames as recovering something valuable, not inventing
- **"Built for…", "Made for…"** — frames as opinionated and targeted, not universal
- **"Every detail," "Every pixel," "Every transaction"** — frames quality as exhaustive, not partial
- **Concrete metrics in copy** — "$1.9T processed," "300 ms response," "10,000+ businesses"
- **Industry-specific functional names** — "Multi Entity," "Capital," "Connect" — feature names as nouns, not adjectives

**Hype copy patterns (avoid — already in §X.10 but reinforced):**
- "Revolutionary," "game-changing," "best-in-class," "next-generation"
- "Unleash," "unlock," "empower," "supercharge"
- "Cutting-edge," "world-class," "industry-leading"
- "Seamless," "robust," "powerful" (without specifics)
- "Reimagined," "redefined," "transformed"

**The Pixel Point / Linear positioning structure that recurs:**

```
[Acknowledge a status quo problem]  →  "Software has lost its craft."
[Frame the alternative as restored value]  →  "We're recovering quality."
[Specific concrete proof]  →  "Used by 10,000+ engineering teams to ship faster."
[Concrete CTA]  →  "Try Linear free."
```

vs. the SaaS template structure that signals genericness:

```
[Abstract benefit]  →  "Unlock your team's potential."
[Vague feature list]  →  "Powerful tools to streamline workflows."
[No specifics]  →  no metrics, no proof
[Generic CTA]  →  "Get started" / "Learn more"
```

**Template translation:** §X gets a positioning-structure rule — premium marketing copy follows the four-part "acknowledge → restore → prove → act" arc, not the four-part SaaS "abstract → vague → unproven → generic" arc.

---

## §Z — Open Questions

These are decisions deferred to the `DESIGN_TEMPLATE.md` authoring step or to a per-project `DESIGN.md` instance. They are not gaps in research; they are intentional fill-in slots.

1. **Token naming convention** — should tokens use Tailwind-style numeric scales (`50–950`) or Radix semantic scales (`1–12`)? The template should support both, but pick one canonical naming for component references. **Tentative default: Radix 12-step semantics; Tailwind numeric aliasing optional via token generator output.**
2. **Spacing token naming** — should tokens be named by multiplier (`space.4` = 16 px) or by T-shirt size (`space.md` = 16 px)? Multiplier is more explicit; T-shirt is more semantic. **Tentative default: multiplier (Tailwind convention).**
3. **Primary mode** — should the template require declaration of light-or-dark as the canonical mode, or default to light? **Tentative default: light-mode canonical; dark required if the project supports it.**
4. **Component depth** — the template includes pixel-perfect specs for ~25 components. Some teams will want more (charts, calendars, kanban). Out-of-scope-for-template; extensible per project.
5. **Brand voice / copywriting tokens** — pure visual systems do not cover voice. Optional sub-section under Overview? **Tentative: include lightweight voice notes in Overview only; full voice guide is separate.**
6. **Asset pipeline** — does the template specify how SVGs are exported, image compression budgets, font-loading strategy? Out-of-scope-for-template-v1; document as separate engineering spec.
7. **Internationalization** — RTL support, character width variability (CJK), font subset loading per locale. Should the template note minimums? **Tentative: include an RTL flip rule in §F and a CJK font-loading note in §D; deeper treatment is a future iteration.**
8. **Versioning of the template itself** — semver? date-based? **Tentative: semver on the template (`v1.0.0`); per-project `DESIGN.md` references template version it was authored against.**
9. **OKLCH token format** — store color tokens as full `oklch(L C H)` strings (one value per token, browser interprets) or as discrete L/C/H component values (allows runtime computation but more complex)? **Tentative: full `oklch()` strings for emitted tokens, but the generation script in the template should expose component values for new-palette generation.**
10. **Syntax highlighting theme** — should the template prescribe a specific theme (e.g., Vercel Geist's dark theme as default), or leave the choice to each project? **Tentative: name the canonical light + dark themes the project will use in the `Overview` section; do not prescribe at template level.**
11. **Charting library** — Recharts, Visx, Tremor, ECharts, custom? Template-level rec or project decision? **Tentative: name in the `Overview` per project; the chart-spec rules in `§T` apply regardless of library.**
12. **Voice — title vs sentence case** — premium products split roughly 50/50. Brand-level decision. **Tentative: declare in `Overview`; apply consistently through every UI surface.**
13. **Mono font licensing tier** — premium paid fonts (Berkeley Mono, etc.) cost money. Should the template default to a free recommendation? **Tentative: yes — Geist Mono / JetBrains Mono / IBM Plex Mono are the free defaults; paid fonts are an upgrade path noted in the brand profile.**
14. **Notification infrastructure** — the template specifies notification *display* but not delivery. Real-time updates, push delivery, queueing are engineering concerns. **Tentative: out of scope; the template defines the visual + interaction layer only.**
15. **Per-tenant theming** — for multi-tenant SaaS products, how do tenant-customized themes layer on top of the system? **Tentative: define a `theme-overrides` token group per project that the template merges over base tokens; specifics belong in `DESIGN.md` of the relevant project.**

---

## Sources

### DESIGN.md format & AI documentation
- [Google `DESIGN.md` spec (google-labs-code/design.md)](https://github.com/google-labs-code/design.md)
- [DTCG W3C Design Tokens — Specification reaches stable, Oct 2025](https://www.w3.org/community/design-tokens/2025/10/28/design-tokens-specification-reaches-first-stable-version/)
- [Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/drafts/format/)
- [Your Design System Documentation Should Be Written for Both AI Agents and Humans](https://www.designsystemscollective.com/your-design-system-documentation-should-be-written-for-both-ai-agents-and-humans-3519fb712c52)
- [How to write LLM-friendly documentation — Fern](https://buildwithfern.com/post/how-to-write-llm-friendly-documentation)
- [How to Write a Good Spec for AI Agents — Addy Osmani](https://addyosmani.com/blog/good-spec/)
- [API Docs for AI Agents: llms.txt Guide](https://buildwithfern.com/post/optimizing-api-docs-ai-agents-llms-txt-guide)
- [Documenting Your Design System: Best Practices — Magic Patterns](https://www.magicpatterns.com/blog/design-system-documentation)

### Reference aesthetic
- [Pixel Point — Case Studies index](https://pixelpoint.io/case-studies)
- [Pixel Point — Cluely case study](https://pixelpoint.io/case-studies/cluely/)
- [Pixel Point — Huly case study](https://pixelpoint.io/case-studies/huly/)
- [Pixel Point homepage](https://pixelpoint.io)
- [Linear](https://linear.app)
- [Vercel](https://vercel.com)
- [Stripe](https://stripe.com)
- [Notion](https://www.notion.com/)
- [Anthropic](https://www.anthropic.com)
- [Mercury](https://mercury.com)
- [Huly](https://huly.io)
- [Neon](https://neon.com)
- [Unkey](https://www.unkey.com)
- [How Stripe, Linear, and Vercel Ship Premium UI — Mantlr](https://mantlr.com/blog/stripe-linear-vercel-premium-ui)
- [Vercel Web Interface Guidelines](https://vercel.com/design/guidelines)

### Color
- [OKLCH Color in Design — ColorArchive](https://colorarchive.org/guides/oklch-perceptual-color-design-guide/)
- [How to Use OKLCH in CSS (2026 Guide) — HexPickr](https://hexpickr.com/learn/oklch-css-guide)
- [Color Formats in 2026: HEX, RGB, HSL, and Why OKLCH Matters](https://www.devtoolnow.com/guides/color-formats-hex-rgb-hsl-oklch)
- [Automatic and Accessible Dynamic Themes With OKLCH](https://gitnation.com/contents/automatic-and-accessible-dynamic-themes-with-oklch-color-space)
- [The 2026 Engineering Guide to Color & Contrast: WCAG 2.2 and APCA — Humbl Design](https://humbldesign.io/blog-posts/color-accessibility-guide-wcag)
- [WCAG 2.x vs. APCA — weableColor](https://weable.pro/products/weable-color/blog/wcag-vs-apca-comparison)
- [APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html)
- [Radix Colors — Understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
- [Radix Colors — Composing a palette](https://www.radix-ui.com/colors/docs/palette-composition/composing-a-palette)
- [Radix Colors — Aliasing](https://www.radix-ui.com/colors/docs/overview/aliasing)
- [Material Design 3 — Color system](https://m3.material.io/styles/color/system/how-the-system-works)
- [Material Design 3 — Color roles](https://m3.material.io/styles/color/roles)

### Typography
- [Fluid Type Scale Calculator](https://www.fluid-type-scale.com/)
- [Typescale for Modern CSS — Fluid Type without Media Queries](https://clampgenerator.com/blog/fluid-typescale-modern-css-without-media-queries/)
- [Accessible Typography Guide WCAG 2.2 — accessibility.build](https://www.accessibility.build/guides/accessible-typography-wcag)
- [Typography in Design Systems — Nathan Curtis / EightShapes](https://medium.com/eightshapes-llc/typography-in-design-systems-6ed771432f1e)
- [Mastering typography in design systems with semantic tokens — UX Collective](https://uxdesign.cc/mastering-typography-in-design-systems-with-semantic-tokens-and-responsive-scaling-6ccd598d9f21)
- [Typography System Design — Figr](https://figr.design/blog/typography-system-design)
- [Responsive Typography 2026 — Inkbot Design](https://inkbotdesign.com/responsive-typography/)
- [App Typography Guide: iOS vs Android — GenDesigns](https://gendesigns.ai/blog/app-typography-guide-ios-android)
- [iOS Design Handbook — Typography and Dynamic Type](https://designcode.io/ios-design-handbook-typography-and-dynamic-type/)
- [Apple Developer — Scaling fonts automatically](https://developer.apple.com/documentation/uikit/scaling-fonts-automatically)

### Spacing, layout, shapes, elevation
- [Spacing — Pajamas Design System / GitLab](https://design.gitlab.com/product-foundations/spacing/)
- [Atlassian — Spacing overview](https://atlassian.design/foundations/spacing)
- [HPE T-shirt sizing](https://design-system.hpe.design/foundation/tshirt-sizing)
- [Spacing systems & scales in UI design — Designary](https://blog.designary.com/p/spacing-systems-and-scales-ui-design)
- [USWDS Layout grid](https://designsystem.digital.gov/utilities/layout-grid/)
- [Responsive Design Breakpoints 2026 — RapidDocTools](https://www.rapiddoctools.com/blog/modern-responsive-breakpoints-2026-guide)
- [UI Grids — UXPin 2026](https://www.uxpin.com/studio/blog/ui-grids-how-to-guide/)
- [Bootstrap 5 — Breakpoints](https://getbootstrap.com/docs/5.0/layout/breakpoints/)
- [Border Radius Rules — 92learns](https://blog.92learns.com/border-radius-rules/)
- [How Apple Uses Squircles in iOS Design — Squircle.js](https://squircle.js.org/blog/squircles-in-apple-design)
- [BetterCorners — Nested Border Radius math](https://bettercorners.io/)
- [CSS corner-shape — Smashing Magazine](https://www.smashingmagazine.com/2026/03/beyond-border-radius-css-corner-shape-property-ui/)
- [Fluent 2 — Elevation](https://fluent2.microsoft.design/elevation)
- [Atlassian — Elevation](https://atlassian.design/foundations/elevation)
- [Designing Beautiful Shadows in CSS — Josh W. Comeau](https://www.joshwcomeau.com/css/designing-shadows/)
- [Dell Design System — Elevation](https://www.delldesignsystem.com/foundations/elevation)

### Motion
- [Material Design 3 — Easing and duration tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- [Material Design 3 — Motion physics system](https://m3.material.io/styles/motion/overview/specs)
- [Carbon Design System — Motion](https://carbondesignsystem.com/elements/motion/overview/)
- [Design Tokens for Motion — Ruixen](https://www.ruixen.com/blog/motion-design-tokens)
- [Easing curves are a design language — baraa.app](https://www.baraa.app/blog/easing-curves-are-a-design-language)

### States and components
- [Material Design 3 — States](https://m3.material.io/foundations/interaction/states/applying-states)
- [Button States Explained 2026 — UXPin](https://www.uxpin.com/studio/blog/button-states/)
- [Button States: Communicate Interaction — NN/G](https://www.nngroup.com/articles/button-states-communicate-interaction/)
- [shadcn/ui — Input](https://ui.shadcn.com/docs/components/radix/input)
- [shadcn/ui — Field](https://ui.shadcn.com/docs/components/radix/field)
- [Radix Primitives](https://www.radix-ui.com/primitives)
- [Radix Themes — Color](https://www.radix-ui.com/themes/docs/theme/color)

### Iconography & touch
- [A complete guide to iconography — designsystems.com](https://www.designsystems.com/iconography-guide/)
- [Optical weight in icons — Dutchicon](https://dutchicon.com/optical-weight-icons/)
- [Atlassian — Iconography](https://atlassian.design/foundations/iconography)
- [Formulas for optical adjustments — Bjango](https://bjango.com/articles/opticaladjustments/)
- [WCAG 2.5.8 Target Size Minimum — TestParty](https://testparty.ai/blog/wcag-target-size-guide)
- [Accessible tap targets — web.dev](https://web.dev/articles/accessible-tap-targets)
- [Mobile Accessibility Target Sizes Cheatsheet — Smashing Magazine](https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/)

### Mobile platforms
- [iOS Tab Bar — A Complete UX and Design Guide 2026](https://uiuxdesigning.com/ios-tab-bar/)
- [iOS 26 Design Guidelines — LearnUI](https://www.learnui.design/blog/ios-design-guidelines-templates.html)
- [Apple Developer — TabView](https://developer.apple.com/documentation/SwiftUI/Enhancing-your-app-content-with-tab-navigation)
- [Material Design 3 — Bottom sheets](https://m3.material.io/components/bottom-sheets/overview)
- [Material 3 Expressive Design Part 2 — ProAndroidDev](https://proandroiddev.com/material-3-expressive-design-a-new-era-part-2-6a93483c98b0)
- [Discovering Material 3 Expressive — FAB Menu](https://medium.com/@renaud.mathieu/discovering-material-3-expressive-fab-menu-ecfae766a946)
- [Dark Mode Android Material 3 — Guide to Color Tokens 2026](https://designdroid.in/adark-mode-android-material-3-2026/)

### Web patterns
- [SaaS Hero Section Design — Best Practices — Alf Design Group](https://www.alfdesigngroup.com/post/saas-hero-section-best-practices)
- [Hero Section Design 2026 — Memorable](https://memorable.design/hero-section-examples/)
- [Top Hero Section Examples 2026 — Perfect Afternoon](https://www.perfectafternoon.com/2025/hero-section-design/)
- [Website Dimensions & Typography 2026 — Sami Haraketi](https://www.samiharaketi.com/post/website-dimensions-typography-in-2026-a-practical-guide-for-web-designers)

### Deep-pass: practitioner craft references
- [Karri Saarinen's 10 Rules for Crafting Products — Figma Blog](https://www.figma.com/blog/karri-saarinens-10-rules-for-crafting-products-that-stand-out/)
- [Inside Linear — First Round podcast with Karri Saarinen](https://review.firstround.com/podcast/inside-linear-why-craft-and-focus-still-win-in-product-building/)
- [Rauno Freiberg — craft index](https://rauno.me/craft)
- [Rauno Freiberg — Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design)
- [Devouring Details — Rauno Freiberg interactive course](https://devouringdetails.com)
- [Vercel Web Interface Guidelines (full)](https://vercel.com/design/guidelines)
- [Vercel Geist Design System](https://vercel.com/geist/principles)

### Deep-pass: Pixel Point case studies (additional)
- [Pixel Point — Vantage](https://pixelpoint.io/case-studies/vantage/)
- [Pixel Point — Gitness](https://pixelpoint.io/case-studies/gitness/)
- [Pixel Point — AgentQL](https://pixelpoint.io/case-studies/agentql/)
- [Pixel Point — Slash](https://pixelpoint.io/case-studies/slash/)

### Deep-pass: token systems comparison
- [Atlassian Design — Spacing tokens (full scale)](https://atlassian.design/foundations/spacing)
- [Shopify Polaris React](https://polaris-react.shopify.com/)
- [shadcn/ui — Button](https://ui.shadcn.com/docs/components/button)

### Deep-pass: color palette generation (OKLCH math)
- [Anna Filou — Generating color scales in CSS with OKLCH](https://annafilou.com/en/css-color-scales)
- [Sequential Color Palette Generation using OKLCH — Observable](https://observablehq.com/@clhenrick/sequential-color-palette-generation-using-oklch)
- [OKLCH Color — The Modern Perceptually Uniform Color Space](https://colors.jarhalab.com/wiki/oklch-color)
- [From HSL to OKLCH and BetterLCH for design systems](https://medium.com/@solo_cube/from-hsl-to-oklch-and-betterlch-predictable-chroma-and-precise-contrast-for-design-systems-fc5235306145)

### Deep-pass: motion choreography (FLIP, shared elements, View Transitions)
- [Motion React — Layout Animations (FLIP & shared element)](https://motion.dev/docs/react-layout-animations)
- [Animating Layouts with the FLIP Technique — CSS-Tricks](https://css-tricks.com/animating-layouts-with-the-flip-technique/)
- [A Deep Dive into the View Transition API](https://medium.com/@arifdewi.uae/a-deep-dive-into-the-view-transition-api-seamless-app-animations-with-native-browser-magic-e08f8e7ab80b)
- [Web Animation Techniques: CSS Transitions, GSAP, FLIP 2026](https://johal.in/web-animation-techniques-css-transitions-gsap-and-flip-pattern-optimization-2026/)

### Deep-pass: modern image loading
- [Adaptive Image Loading: AVIF, Lazy & Responsive 2026 — XICTRON](https://www.xictron.com/en/blog/adaptive-image-loading-avif-lazy-shops-2026/)
- [Preload responsive images — web.dev](https://web.dev/articles/preload-responsive-images)
- [Image Optimization in 2025: WebP/AVIF, srcset, Preload](https://aibudwp.com/image-optimization-in-2025-webp-avif-srcset-and-preload/)
- [Lazy Loading Best Practices For LCP Images 2026](https://webgaro.com/blog/lazy-loading-best-practices-for-lcp-images/)
- [Fix Largest Contentful Paint by optimizing image loading — MDN Blog](https://developer.mozilla.org/en-US/blog/fix-image-lcp/)

### Deep-pass: preference media queries
- [prefers-contrast CSS media feature — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)
- [prefers-reduced-transparency — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency)
- [forced-colors CSS media feature — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors)
- [CSS media features to improve accessibility](https://a11y-blog.dev/en/articles/css-media-features-for-a11y/)
- [Creating contrast themes with prefers-contrast — LogRocket](https://blog.logrocket.com/creating-contrast-themes-css-prefers-contrast-javascript/)

### Deep-pass: data visualization
- [Data Visualization Color Palettes — CleanChart](https://www.cleanchart.app/blog/data-visualization-color-palettes)
- [How to Choose the Best Colors for Data Visualization — Julius AI](https://julius.ai/articles/best-colors-for-data-visualization)
- [Data Viz Color Palette Generator — Learn UI Design](https://www.learnui.design/tools/data-color-picker.html)
- [GitLab Pajamas — Data Visualization Color](https://design.gitlab.com/data-visualization/color/)
- [Carbon Design System — Data Visualization Palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)
- [Astro UXDS — Data Visualization patterns](https://www.astrouxds.com/patterns/data-visualization/)
- [Microsoft Office Add-ins — Data Visualization guidelines](https://learn.microsoft.com/en-us/office/dev/add-ins/design/data-visualization-guidelines)
- [GitHub Primer — Data Visualization](https://primer.style/product/ui-patterns/data-visualization/)

### Deep-pass: internationalization & RTL
- [RTL Guidelines — Firefox Source Docs](https://firefox-source-docs.mozilla.org/code-quality/coding-style/rtl_guidelines.html)
- [Mastering RTL & LTR Layouts with CSS Logical Properties](https://medium.com/@dimuthupinsara/mastering-rtl-ltr-layouts-with-css-logical-properties-4bc0fccd2014)
- [Right to Left Styling 101](https://rtlstyling.com/posts/rtl-styling/)
- [RTL Accessibility Considerations](https://accessibility-test.org/blog/support/rtl-right-to-left-website-accessibility-considerations/)
- [Stop Fighting RTL Layouts — Use CSS Logical Properties](https://pixicstudio.medium.com/css-logical-properties-rtl-layouts-236edec711fa)
- [International Typography Trends 2026 — Desinance](https://desinance.com/design/product-design/typography-trends-2026/)
