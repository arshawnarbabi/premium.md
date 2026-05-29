# premium-website-templates

> A six-file template system that turns any AI agent into a reliable premium-grade product builder. Brand identity slots into ~30 fields per project; the rest is pre-decided based on what premium design teams actually do.

The system is built from roughly 4,000 lines of cross-referenced research on what makes premium product design measurably different from generic SaaS-template output. Each template encodes universal rules + structural defaults + brand-specific slots — instantiated per project, then handed to AI tools (Claude, Cursor, etc.) as a single source of truth.

---

## The six templates

| File | Purpose | Lines |
| --- | --- | --- |
| **`PROJECT_TEMPLATE.md`** | Entry-point orchestration — tells the AI which other files matter and in what priority. Lightweight index. | ~300 |
| **`INFORMATION_TEMPLATE.md`** | Brand identity, audience, business context. The "why" and "who". Shared between web and mobile. | ~500 |
| **`DESIGN_TEMPLATE_WEB.md`** | Visual design system for web — colors, typography, spacing, components, motion, accessibility. | ~2,300 |
| **`DESIGN_TEMPLATE_MOBILE.md`** | Visual design system for mobile — iOS HIG + Material 3 specs. | ~1,800 |
| **`SPEC_TEMPLATE_WEB.md`** | Site map + per-page content/layout/copy + forms + notifications + transactional emails + SEO + legal + analytics. | ~950 |
| **`SPEC_TEMPLATE_MOBILE.md`** | App map + per-screen content/copy/states + onboarding + auth + permissions + push notifications + app store metadata + settings. | ~860 |

Plus three informational reference files:

| File | Purpose |
| --- | --- |
| `research.md` | The brand-agnostic premium-standard research (23 sections, ~4,000 lines) — the explanatory backing for everything in the templates |
| `project-templates-plan.md` | How the project templates were structured |
| `plan.md` + `template-plan.md` | Original research plan + design-template plan |

---

## How the system works

Each template follows the same pattern:

1. **YAML frontmatter** holds machine-readable design tokens, configuration, and content structures
2. **Markdown body** holds the rules an AI agent must follow when consuming the file
3. **Three tiers of content**:
   - **Universal rules** — hardcoded; same for every project (accessibility floor, anti-patterns, scale systems)
   - **Structural defaults** — pre-filled with the broad-premium-middle default; overridable per project
   - **Brand-specific slots** — empty `<placeholder>` syntax; fill per project
4. **AI Agent Contract** section — explicit hard rules the AI must follow
5. **Cross-references** — files reference each other by name; PROJECT.md is the orchestration entry point

---

## Quick start (per new project)

### For a web project

```bash
# 1. Copy the relevant templates to your project root
curl -O https://raw.githubusercontent.com/arshawnarbabi/premium-website-templates/main/PROJECT_TEMPLATE.md
curl -O https://raw.githubusercontent.com/arshawnarbabi/premium-website-templates/main/INFORMATION_TEMPLATE.md
curl -O https://raw.githubusercontent.com/arshawnarbabi/premium-website-templates/main/DESIGN_TEMPLATE_WEB.md
curl -O https://raw.githubusercontent.com/arshawnarbabi/premium-website-templates/main/SPEC_TEMPLATE_WEB.md

# Rename to per-project files
mv PROJECT_TEMPLATE.md PROJECT.md
mv INFORMATION_TEMPLATE.md INFORMATION.md
mv DESIGN_TEMPLATE_WEB.md DESIGN.md
mv SPEC_TEMPLATE_WEB.md SPEC.md

# 2. Fill the brand-identity slots in each file
#    Greppable: `grep -n "<[^>]*>" PROJECT.md INFORMATION.md DESIGN.md SPEC.md`
#    Once zero matches remain, instantiation is complete.

# 3. For DESIGN.md, run color derivation:
#    - Take your brand color (OKLCH)
#    - Generate the 12-step palette using the algorithm in §Colors → Generating the scale
#    - Fill the derived steps into the YAML

# 4. Hand all four files to your AI tool. PROJECT.md is the entry point.
```

### For a mobile project

Same pattern but with `DESIGN_TEMPLATE_MOBILE.md` → `DESIGN_MOBILE.md` and `SPEC_TEMPLATE_MOBILE.md` → `SPEC_MOBILE.md`.

### For a project that ships both web and mobile

Use all six files. The brand-identity slots in `INFORMATION.md` are shared — fill once. The visual / content templates split by platform.

---

## How to point AI at this system

In your AI prompt, reference the entry-point file. The AI will discover the others through `PROJECT.md`'s declarations.

```
Use the design and product templates in this project as your source of truth.
Start by reading PROJECT.md, then consult the files it declares in the
priority order it specifies. Reference tokens via {group.path} syntax;
never invent values not in the documents.

Now build me a [pricing page | onboarding flow | settings screen | …].
```

Tools that auto-discover files (Claude Code reads `CLAUDE.md`; Cursor reads `.cursorrules`; many tools read `AGENTS.md`) — you can rename `PROJECT.md` to match the convention. Content stays the same.

---

## What you actually decide per new project

**Required brand inputs (~10 fields — no defaults work):**
- Brand name, description, audience, voice
- Brand primary color (OKLCH)
- Brand neutral hue
- Display + body + mono font families
- Project type (marketing site / product SaaS / mobile app / hybrid)

**Profile selections (9 profiles — all have premium defaults):**
Radius, type scale ratio, density, motion personality, elevation depth, color saturation, brand warmth, section padding, chart minimalism.

**Pick-one slots (~22 web / ~14 mobile — all have defaults):**
Input style, tabs style, icon fill, avatar shape, modal backdrop, code surface, onboarding pattern, save model, settings IA, command palette, RTL support, chart library, illustration style, and others.

**SPEC content (per-project, no defaults):**
Site map / app map, page sections, copy, voice samples, forms, notifications, email templates, app store metadata.

**INFORMATION content (per-project, no defaults):**
Audience persona depth, market positioning, business model, brand story, social handles, legal jurisdiction.

**Total decisions to fully configure a project:** roughly 30 quick decisions + writing the actual content/copy. Most decisions take seconds; the content takes real time (as it should).

---

## Design system structure: the three tiers in practice

| Tier | What | How it appears |
| --- | --- | --- |
| **Universal** | Hardcoded; immutable per project | "Spacing values must be multiples of base"; "Use APCA for contrast"; "Touch targets ≥ 44 pt mobile" |
| **Structural default** | Pre-filled, sensible, overridable | "Type scale ratio: balanced (1.200)"; "Modal backdrop: blur"; "Onboarding: empty-state-driven" |
| **Brand-specific** | Empty `<slot>` per project | Brand colors, font families, audience, voice, page content |

---

## Where the rules come from

`research.md` documents the source for every rule. Key references:

- **Published premium design systems:** Radix Colors, Material 3, Apple HIG, IBM Carbon, Atlassian Design System, Shopify Polaris, Geist (Vercel)
- **Standards:** DTCG W3C Design Tokens Format Module (stable since Oct 2025), OKLCH color, APCA contrast, CSS logical properties, View Transitions API, container queries, modern image loading (AVIF/WebP/JPG fallback)
- **Practitioner content:** Karri Saarinen's 10 rules of craft, Rauno Freiberg's interaction principles ("Devouring Details"), Vercel's published "Web Interface Guidelines"
- **Production-site analysis:** Linear, Vercel, Stripe, Notion, Anthropic, Mercury, Huly, Neon, Unkey, and Pixel Point's case-study portfolio

The research file is informational — you don't need it to use the templates. It's the explanatory backing if anyone asks "why this rule?"

---

## Recommended tech stack defaults (override per project in `PROJECT.md`)

| Concern | Default |
| --- | --- |
| Framework (web) | React + Next.js (App Router) |
| Styling | Tailwind v4 |
| UI primitives | shadcn/ui (dashboards / product apps); custom for marketing |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| Icons | Lucide (free default) / Phosphor / **HugeIcons** (premium tier — 51K icons, 10 styles) — declare per project, don't lock |
| Deploy | Vercel |
| Mobile native | SwiftUI / Jetpack Compose, or React Native (Expo) for cross-platform |

---

## Versioning

All templates carry `template_version: "1.0.0"` in their YAML frontmatter. Per-project instances should preserve this field — when the template family evolves, projects can track which version they were authored against.

## License

[Choose a LICENSE file: MIT, CC BY 4.0, or proprietary depending on use case. Recommend MIT for design templates intended for reuse.]
