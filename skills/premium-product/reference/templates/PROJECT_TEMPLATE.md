---
# ─────────────────────────────────────────────────────────────
# PROJECT_TEMPLATE.md — Entry-point orchestration for AI agents
# Version: 1.21.0
#
# This is the FIRST file any AI agent should consult when working on this
# project. It declares which sibling files exist, in what priority they
# should be consulted, what tech this project uses, and what high-level
# constraints apply.
#
# HOW TO USE:
# 1. Copy this file to your project as `PROJECT.md` (or `AGENTS.md` /
#    `CLAUDE.md` depending on your AI tool's convention).
# 2. Fill every `<slot>`. Greppable: `grep -n "<[^>]*>" PROJECT.md`.
# 3. Reference this file in every AI prompt that touches the project.
# ─────────────────────────────────────────────────────────────

# ─── STATUS MARKERS — every value's state stays trackable (authoritative spec: §Status protocol, below) ───
# An inline comment on a value marks its state; unmarked + filled = "given" (your own input).
#   <slot>/<TBD> = unfilled · # draft = AI-inferred, needs your approval · # default = out-of-box default,
#   not consciously chosen · # approved = you signed off · # locked = approved + logged in DECISIONS.md.
# Rule: the AI NEVER writes an inferred value without `# draft`, nor accepts a default without `# default`
# — so an unmarked filled value is, by construction, yours. Nothing fabricated slips through unverified.

template_version: "1.21.0"
file_role: "project"          # information | design | spec | project

# ═══════════════════════════════════════════════════════════════
# PROJECT ORIENTATION
# ═══════════════════════════════════════════════════════════════

project:
  name: "<Project Name>"
  one_liner: "<one-sentence description — what is this and what is being built>"
  type: "<marketing-site | product-saas | mobile-app | hybrid-web-plus-mobile>"
  stage: "<idea | pre-launch | beta | launched | scaling | mature>"
  primary_goal_this_quarter: "<what success looks like in the next 3 months>"

# ═══════════════════════════════════════════════════════════════
# SOURCE-OF-TRUTH FILES (consult in this priority order)
# ═══════════════════════════════════════════════════════════════

source_files:
  # `exists: true` means the project has this file; the AI should consult it.
  # `exists: false` means the project doesn't use this file; AI should not reference it.
  project_md:
    file: "PROJECT.md"
    purpose: "Orchestration entry point (this file). What to read and in what priority."
    exists: true
  information_md:
    file: "INFORMATION.md"
    purpose: "Brand identity, audience, business context. The 'why' and 'who'."
    exists: true
    priority_for: ["voice", "audience", "positioning", "business decisions", "compliance"]
  content_md:
    file: "CONTENT.md"
    purpose: "Reusable content records (testimonials, stats, features, FAQs, team, case studies, pricing) referenced by pages via {content.*}. Single source of content truth."
    exists: "<true | false>"
    priority_for: ["testimonials", "stats / metrics", "features", "FAQs", "team", "case studies", "pricing tiers"]
  design_md:
    file: "DESIGN.md"
    purpose: "Visual design system for web. The 'how it looks' on web."
    exists: "<true | false>"
    priority_for: ["colors", "typography", "spacing", "components", "layout", "motion"]
  design_mobile_md:
    file: "DESIGN_MOBILE.md"
    purpose: "Visual design system for mobile. iOS HIG + Material 3."
    exists: "<true | false>"
    priority_for: ["mobile components", "native conventions", "gestures", "haptics"]
  spec_md:
    file: "SPEC.md"
    purpose: "Site map, per-page content, layout sequence, forms, copy for web."
    exists: "<true | false>"
    priority_for: ["page content", "section sequences", "forms", "transactional email"]
  spec_mobile_md:
    file: "SPEC_MOBILE.md"
    purpose: "App map, per-screen content, states, onboarding, push, settings."
    exists: "<true | false>"
    priority_for: ["screen content", "auth flow", "permissions", "push notifications", "app store metadata"]
  seo_md:
    file: "SEO.md"
    purpose: "Discoverability — SEO + AEO + GEO: JSON-LD structured data, answer-first patterns, citability, freshness, llms.txt. The discoverability layer over INFORMATION.seo + SPEC."
    exists: "<true | false>"
    priority_for: ["structured data / JSON-LD", "AEO answer-first", "GEO citability", "social cards", "llms.txt"]
  qa_md:
    file: "QA.md"
    purpose: "Premium acceptance gate — the AI runs it against its own build before declaring done."
    exists: "<true | false>"
    priority_for: ["accessibility", "performance (Core Web Vitals)", "token fidelity", "responsive", "launch QA"]
  decisions_md:
    file: "DECISIONS.md"
    purpose: "Append-only log of locked decisions + rationale. Read before proposing changes so settled choices aren't relitigated."
    exists: "<true | false>"
    priority_for: ["locked decisions", "rationale history", "what we're deliberately NOT doing"]

priority_order:
  # When multiple files speak to the same decision, this is the precedence.
  # First listed wins. SPEC + INFORMATION are content/brand truth; DESIGN is
  # visual truth; PROJECT defines the project envelope.
  - CONTENT.md                      # the content facts (testimonials/stats/FAQs/…) — single source; SPEC references it
  - SPEC.md / SPEC_MOBILE.md       # what to build (page content + layout instances)
  - INFORMATION.md                  # who it's for + how to talk about it
  - DESIGN.md / DESIGN_MOBILE.md   # how it looks
  - SEO.md                          # discoverability layer derived from INFORMATION + SPEC (never overrides them)
  - PROJECT.md                      # project-wide constraints (this file)
  - QA.md                           # validation gate — references the above; never an authority on a decision
  - DECISIONS.md                    # rationale/history of locked choices — read before reopening any of them; not an override

# ═══════════════════════════════════════════════════════════════
# TECH STACK
# ═══════════════════════════════════════════════════════════════

tech:
  web:
    # Which web surfaces this project has. Drives WHICH DESIGN.md option groups apply:
    #   marketing = landing/marketing site (hero, landing composition, top-nav, footer, bento, logo wall)
    #   product   = a web app behind login (app shell, product nav, command palette, settings, tables, code)
    #   both      = a marketing site AND a web app (apply each surface's patterns to its own pages)
    surfaces: "<marketing | product | both>"   # see DESIGN.md §Web surface scope
    framework: "Next.js"                 # App Router by default
    framework_version: "<15.x | latest>"
    language: "TypeScript"
    styling: "Tailwind CSS"
    styling_version: "<v4>"
    ui_primitives: "<shadcn/ui (dashboards) | none (marketing sites) | custom>"
    component_library_note: "shadcn/ui is for product / dashboard contexts only; marketing sites use custom components built against DESIGN.md tokens"
    animation: "Framer Motion"
    forms: "React Hook Form + Zod"
    icons: "<Lucide | Phosphor | Heroicons | Tabler | HugeIcons (free Stroke-Rounded + Pro) | custom — declare per project; keep in sync with DESIGN.md icons.library>"
    cms: "<Sanity | Contentlayer | MDX-in-repo | n/a>"
    auth: "<NextAuth / Auth.js | Clerk | Supabase Auth | custom | n/a>"
    db: "<Postgres on Neon | Supabase | PlanetScale | n/a>"
    file_storage: "<Cloudflare R2 | Vercel Blob | S3 | n/a>"
    email: "<Resend | Postmark | SendGrid>"
    analytics: "<PostHog | Plausible | Mixpanel | GA4 | n/a>"
    monitoring: "<Sentry | Datadog | n/a>"
    deployment: "Vercel"
    package_manager: "<pnpm | npm | yarn | bun>"
    node_version: "<22.x | latest LTS>"

  mobile:
    # Fill only if mobile is in scope
    in_scope: "<true | false>"
    approach: "<native-swift-ios | native-compose-android | react-native-expo | flutter | n/a>"
    ios_target_min: "<iOS 16.0>"
    android_target_min: "<API 26 (Android 8.0)>"
    state_management: "<SwiftUI Observable | Compose ViewModel | Redux/Zustand for RN>"
    networking: "<URLSession | Retrofit | fetch (RN) | TanStack Query>"
    analytics: "<PostHog | Mixpanel | Amplitude | Firebase | n/a>"
    crash_reporting: "<Sentry | Crashlytics | n/a>"
    push: "<APNs (iOS) + FCM (Android) | OneSignal | n/a>"

  shared:
    typescript_strict: true
    eslint: true
    prettier: true
    husky: "<true — pre-commit hooks | false>"
    ci: "<GitHub Actions | GitLab CI | n/a>"

# ═══════════════════════════════════════════════════════════════
# REPOSITORY STRUCTURE
# ═══════════════════════════════════════════════════════════════

repository:
  structure_type: "<monorepo | single-app | multi-repo>"
  primary_repo_url: "<URL>"

  conventions:
    # Where common things live
    app_root: "<src/app | app | src/pages>"
    components: "<src/components | components>"
    design_tokens: "<src/styles/tokens.ts | tailwind.config.ts | css-variables-in-globals.css>"
    content: "<content/ | src/content | n/a>"
    public_assets: "public/"
    types: "<src/types | colocate>"

  branching:
    default_branch: "main"
    pr_required: true
    naming_pattern: "<feature/<short-name> | fix/<short-name> | etc.>"

  commit_style: "<conventional commits | freeform>"

# ═══════════════════════════════════════════════════════════════
# AI AGENT GROUND RULES (project-level constraints)
# ═══════════════════════════════════════════════════════════════

agent_constraints:
  # High-level rules the AI must honor for any code generation, design, or copy
  # in this project. Sub-files (DESIGN.md, SPEC.md) define narrower rules.

  must:
    - "Read this PROJECT.md first. Then consult source_files in declared priority order."
    - "Reference design tokens via {group.path} syntax — never inline raw values."
    - "Match the tech stack declared above. Don't introduce a different framework or library without explicit request."
    - "Use TypeScript strict mode. No `any` types without explanation."
    - "Honor INFORMATION.md compliance requirements (GDPR / CCPA / HIPAA / etc.)."
    - "Treat SPEC.md copy as final — don't rephrase declared copy to 'improve' it."
    - "When a needed value isn't in the source files, ask — don't fabricate."
    - "Build as a loop, not a single pass: read the docs → plan → generate against the EXPORTED tokens (tools/brand-kit `npm run export`) → self-QA against QA.md → fix → repeat. Use exported tokens / CSS variables, never hardcoded #hex or raw oklch() in components."
    - "Build process (research §X4): (a) recognize the build MODE — docs-first→build, explore-build→design-off-it→document→rebuild, or hybrid — and state which one you're in; in the explore mode, capture the resulting decisions back into the docs (DESIGN/DECISIONS/SPEC) before the production build. (b) When the human supplies REFERENCE images/sketches/sites, translate their STRUCTURE into THIS project's tokens + voice — never copy a brand's colors/fonts/copy; log reference-driven choices in DECISIONS.md. (c) VIEW THE RUNNING APP: when your tool can drive a browser (e.g. Claude in Chrome — `claude --chrome` / open `localhost:3000`), open the dev server and iterate visually — compare the real render to the design/reference and fix until it looks right; code compiling is NOT 'looks right.' The browser loop is how you satisfy QA.md's responsive/themes/fidelity checks."
    - "If QA.md exists, the build is NOT done until every gate in it is ✅. Run it against your own output; fix failures and re-check before declaring complete."
    - "If DECISIONS.md exists, read it before proposing OR making any change it covers. A request that touches a LOCKED decision is NOT itself authorization to reopen it — even phrased as a direct instruction ('switch to borders', 'make it green'). Before modifying any file you MUST surface the locked entry, quote its rationale, and get explicit human confirmation to supersede it; only then implement and append a new superseding entry. Never implement a locked-decision change in the same turn as the request. When a new non-trivial decision is locked this session, append an entry."
    - "Reusable content (testimonials, stats, FAQs, features, team, pricing) lives in CONTENT.md when present — reference it via {content.*}, never paste inline or invent it. In CODE, components import records from a content module (lib/content.ts); never hardcode a content string as a const or default prop value (no 'standalone demo' carve-out) — same discipline as exported tokens vs hardcoded #hex."
    - "When turning these docs into a real codebase, emit an AGENTS.md at the repo root (the open standard read by 20+ coding agents): build/test/lint commands, code conventions from `tech`, the QA.md gate, and a pointer back to these design docs as the source of truth."

  must_not:
    - "Don't introduce new dependencies without surfacing the choice."
    - "Don't generate placeholder lorem ipsum that could ship to production."
    - "Don't bypass the design system to ship faster (e.g., inline styles, ad-hoc colors)."
    - "Don't violate the non-features list in INFORMATION.md."
    - "Don't generate fake customer names, testimonials, or metrics."
    - "Don't ship code that fails the AI Agent Contracts in DESIGN.md / SPEC.md / INFORMATION.md."

  default_assumptions:
    accessibility: "WCAG 2.2 AA minimum; APCA preferred (per DESIGN.md)"
    i18n: "default locale is {information.seo.default_locale}; RTL support per DESIGN.md mode declaration"
    performance: "LCP ≤ 2.5s; INP ≤ 200ms (per DESIGN.md performance budgets)"
    privacy: "honor `prefers-color-scheme`, `prefers-reduced-motion`, and other preference media queries"

# ═══════════════════════════════════════════════════════════════
# WORKFLOW NOTES
# ═══════════════════════════════════════════════════════════════

workflow:
  build_process: "<npm run dev | pnpm dev | etc.>"
  test_command: "<npm test | pnpm test | n/a>"
  type_check: "<npm run typecheck | tsc --noEmit>"
  lint: "<npm run lint | eslint .>"
  format: "<npm run format | prettier --write .>"
  build: "<npm run build | pnpm build>"

  ai_collaboration_pattern:
    # How the human + AI typically work together on this project
    design_system_workflow:
      - "Fill INFORMATION.md + DESIGN.md (brand identity + visual tokens)"
      - "Generate the color palette with the bundled generator: tools/brand-kit → `npm run gen -- --base \"oklch(L C H)\"` (do NOT hand-roll the OKLCH math)"
      - "FINAL STEP: review in the brand-kit viewer — `tools/brand-kit` → `npm run dev` — and iterate before building product code"
    new_page_workflow:
      - "Add page entry to SPEC.md (sitemap + page block with sections)"
      - "Hand SPEC.md + DESIGN.md + INFORMATION.md to AI"
      - "AI generates Next.js page component using DESIGN tokens + SPEC content"
      - "Human reviews + commits"
    new_component_workflow:
      - "Define component spec in DESIGN.md if it's a new type"
      - "AI generates component using existing DESIGN tokens"
      - "Human reviews + commits"
    copy_change_workflow:
      - "Update copy in SPEC.md (the source of truth)"
      - "AI propagates change to component if needed"

# ═══════════════════════════════════════════════════════════════
# CROSS-REFERENCES (explicit file relationships)
# ═══════════════════════════════════════════════════════════════

cross_references:
  voice_canonical: "INFORMATION.md → brand.voice_principles"
  audience_canonical: "INFORMATION.md → audience.primary_persona"
  visual_tokens_canonical: "DESIGN.md → YAML frontmatter (colors, typography, spacing, etc.)"
  page_content_canonical: "SPEC.md → pages.*"
  screen_content_canonical: "SPEC_MOBILE.md → screens.*"
  legal_canonical: "INFORMATION.md → legal"
  social_canonical: "INFORMATION.md → social"
  seo_defaults_canonical: "INFORMATION.md → seo (per-page overrides in SPEC.md)"

# ═══════════════════════════════════════════════════════════════
# DEPLOYMENT
# ═══════════════════════════════════════════════════════════════

deployment:
  production:
    platform: "<Vercel | Netlify | Cloudflare | etc.>"
    url: "<https://example.com>"
    deploy_trigger: "<auto on main merge | manual>"
  staging:
    url: "<https://staging.example.com or preview deploy convention>"
  environment_variables:
    location: "<.env.local + Vercel dashboard | doppler | etc.>"
    secrets_never_in_source: true
  preview_deploys: "<enabled on PRs | disabled>"

---

# How to use this template

`PROJECT.md` is the **entry-point file** any AI tool should read first when working on this project. It orients the AI to what kind of project this is, which sibling files exist, in what priority to consult them, and what high-level constraints apply.

**Instantiation steps:**

1. Copy this file to your project as `PROJECT.md`. (If your AI tool prefers `AGENTS.md` or `CLAUDE.md`, rename accordingly — the content is the same. `AGENTS.md` is an open standard, stewarded under the Linux Foundation and read by 20+ coding agents — Codex, Cursor, Copilot, Gemini CLI, Zed, and others.)
2. Fill every `<slot>` value. Verify with `grep -n "<[^>]*>" PROJECT.md`.
3. For each `source_files.*.exists` field, mark `true` only for files actually present. The AI will skip referencing files marked `false`.
4. Reference `PROJECT.md` (or have your tool auto-discover it) in every AI prompt for this project.
5. **When you turn these docs into a real codebase, emit an `AGENTS.md` at the repo root** — the entry point for the coding agent that will maintain the code. It carries the build / test / lint commands, code conventions (from `tech` above), the QA gate (`QA.md`), and a pointer back to these design docs as the source of truth. This is the docs→code handoff: the design docs describe *what* to build; the repo's `AGENTS.md` tells an agent *how to run and maintain* what was built.

---

# AI Agent Contract

When working on this project, an AI agent **must** follow these rules:

1. **Read PROJECT.md first.** Don't start work without consulting this file. It tells you which other files matter.
2. **Honor the `priority_order`.** When two source files speak to the same decision, the file listed earlier wins.
3. **Match the declared tech stack.** Don't introduce a different framework, language, or major library without explicit human request.
4. **Honor each source file's AI Agent Contract.** Each of `DESIGN.md`, `SPEC.md`, `INFORMATION.md` has its own contract; this file's contract is in addition.
5. **Ask when context is missing.** If a needed slot is `<unfilled>` or a sibling file is missing, surface the gap — don't fabricate.
6. **Respect `agent_constraints.must_not`.** These are project-level red lines.
7. **Use the declared workflow patterns** (`workflow.ai_collaboration_pattern`) as the default way to approach common tasks.
8. **Never bypass the design system for expediency.** If a design system token doesn't exist for what you need, surface that — don't inline a one-off value.
9. **Honor the Interactive Population Protocol.** When the user invokes any of the trigger phrases listed in `§Interactive Population Protocol`, produce the structured intake form exactly as specified there — same shape every time. Don't improvise the format. Don't ask one question at a time when the user wants the full list. After receiving answers, fill templates progressively in the declared file order (PROJECT → INFORMATION → CONTENT → DESIGN web/mobile → SPEC web/mobile → SEO), derive computed values in the declared order (profiles → palettes → APCA verification → propagation → voice samples with approval gate), and run all five final verification checks (multi-pattern slot fill including stub detection, cross-template consistency, YAML validity, propagation integrity, completeness summary). Before producing PART 1, run the slot state audit (§"Behavioral protocol" Step 3) so PART 1 lists every actually-unfilled item — not just placeholder-syntax ones. Use semantic reasoning per §"What counts as 'filled' vs 'unfilled'" alongside the mechanical patterns; surface suspected stubs with confirmation framing rather than silently treating them as filled. **Also surface AI-drafted values (any slot carrying a `# DRAFT` / `confirm/refine` marker) as PART 0 "Drafts awaiting your approval" — so "what do I have to fill out or approve" returns both the empty slots AND the unapproved drafts; never treat a `# DRAFT` value as approved.** The Protocol section defines authoritative behavior — when in doubt, return there rather than improvise. **Honor the §Status protocol:** mark AI-inferred values `# draft` and accepted out-of-box defaults `# default` at fill time, emit the state ledger on every audit, and never let an unmarked value imply an approval it didn't get.

---

# Status protocol

Every value in every template instance is in exactly one **state**, and the state is always knowable — so a fresh model can tell, for any value, whether it is verified or still needs the human. This is what keeps inferences and defaults from silently passing as approved truth.

## The six states

| State | Marker | Meaning |
|---|---|---|
| **unfilled** | `<slot>` / `<TBD>` / empty | no value yet → intake PART 1 |
| **draft** | `# draft` (also `# DRAFT — confirm` / `confirm/refine` / `# proposed`) | AI-**inferred** value the human hasn't signed off → intake PART 0 |
| **default** | `# default` | template **out-of-box** value the user never consciously chose → intake PART 2 review |
| **given** | *(no marker on a filled value)* | the human's own input (or a trivially factual value) |
| **approved** | `# approved` | the human confirmed a draft, or reviewed an unconfirmed default |
| **locked** | `# locked` | approved AND recorded in DECISIONS.md (strongest; reopening requires the DECISIONS protocol) |

## The two invariants (what makes it trustworthy)

1. **Producer rule.** The AI MUST never write an **inferred** value without a `# draft` marker, nor accept a template **default** without a `# default` marker. Because of this, an **unmarked filled value is, by construction, human-given** — so "no marker" is unambiguous, not "forgotten."
2. **Audit completeness.** Every intake / verification run emits a **state ledger** (Behavioral protocol Step 11, Check E): each must-fill slot mapped to exactly one state, with unmarked filled values double-checked by semantic stub-reasoning. If a value can't be classified, it is surfaced — never assumed.

## Lifecycle

`unfilled → (draft | default) → approved → locked`. On human sign-off, the AI swaps `# draft` / `# default` → `# approved` (or removes the marker if the value is now genuinely the user's). When a decision is logged to DECISIONS.md, → `# locked`. State only moves toward more-verified; to move a locked value back, the DECISIONS reopen protocol applies.

## Why draft AND default are separate states

A `# draft` is **unverified content** — it could be wrong or fabricated, so it must be approved before it seeds DESIGN/SPEC. A `# default` is **verified-safe but unchosen** — fine to ship, but the user should be able to see what they're implicitly accepting. Collapsing them loses information; keeping them separate lets intake route drafts to PART 0 (approve before building) and defaults to PART 2 (skim, confirm the consequential ones) without forcing line-by-line sign-off on safe defaults.

---

# Interactive Population Protocol

## When to use this protocol

> **AI behavior rule — read carefully.**
> When the user asks ANY trigger phrase (listed below), STOP, do NOT summarize what's in the templates, do NOT give a status report listing what's missing, do NOT improvise your own question list. Produce the structured intake form EXACTLY as specified in the "Output format" section. Same shape every time. No paraphrasing. No restructuring.
>
> **Partial-fill state:** If the user has already filled some `<slot>` values across the templates, read the files first, then EXCLUDE filled items from PART 1 — only list remaining unfilled items. Still produce the same PART 1 / PART 2 / PART 3 structure.
>
> **No brand context provided:** Still produce the intake. Leave `?` markers as-is. The user will provide context in their reply.
>
> **Scope:** if the user mentions a specific template ("DESIGN.md") or platform ("mobile"), scope to that. Otherwise scope to all templates with `source_files.*.exists: true`.
>
> **Anti-patterns — DO NOT produce any of these instead of the intake form, even if the user's phrasing sounds like a status query:**
> - ❌ A narrative "TIER 1 / TIER 2 / TIER 3" or "CRITICAL / IMPORTANT / NICE-TO-HAVE" prioritization
> - ❌ Time estimates ("4-6 hours", "this week / next week / week 3-4")
> - ❌ Project-management roadmaps ("First, fill X. Then, lock Y. After launch, do Z.")
> - ❌ Bulleted summaries of what each template contains
> - ❌ "Quick wins" lists or "minimum viable" subsets
> - ❌ Closing with "What should we tackle first?" instead of "When you reply, I'll..."
>
> Status-sounding triggers ("what else needs to be done?", "what's missing?", "what's left?") are intake triggers, not project-management questions. The deterministic intake form IS the answer — list the remaining `?` markers as PART 1 questions, list applicable defaults as PART 2, list the fill workflow as PART 3.

## Trigger phrases

The AI invokes this protocol when the user says any of (case-insensitive, paraphrases accepted):

- "Help me populate this" / "Help me fill this in" / "Help me complete this"
- "What do I need to tell you (to populate this / to fill this in / for X)?"
- "What do you need to know (to populate this / to fill this in / for X)?"
- "Walk me through this" / "Walk me through filling this in"
- "Run the intake" / "Start the intake" / "Begin the intake"
- "Give me the questions" / "What are the questions?"
- "How do I fill this in?"
- "What's missing in this file?" / "What's missing here?" / "What's left?" / "What else needs to be done?"
- Any close variation indicating the user wants to know what to populate

When ambiguous (e.g., user says "what does this template do?"), the AI explains and offers: *"Want me to walk you through filling it in? Say 'run the intake' and I'll give you the structured question list."*

The AI does NOT silently railroad into intake mode — it either gets an explicit trigger phrase, or it asks before starting.

## What counts as "filled" vs "unfilled"

Before producing the intake form AND before running final verification, the AI MUST classify each slot as filled or unfilled. **Use both mechanical pattern checks AND semantic reasoning** — be smart, not just literal. The whole point of these templates is that they get filled *properly*; missing a stub here defeats the system.

### Definitively UNFILLED — mechanical patterns

A slot is unfilled if ANY of the following are true:

| Pattern | Example | Notes |
|---|---|---|
| Placeholder syntax still present | `name: "<brand name>"` | The default unfilled state |
| Empty / null / blank value | `name: ""`, `name: null`, `name:` (nothing after the colon) | Common copy-paste artifact |
| Question mark left over | `name: "?"` | From the intake form template |
| Deferred marker | `<TBD>`, `TBD`, `TODO`, `FIXME` (case-insensitive, with or without `<…>`) | Plain-text deferrals also count |
| List below declared cardinality | `founders: [{name: "Jane"}]` when intake said "founders (2 founders, both required)" | Cardinality mismatch |
| Sub-field missing in a list item | `founders: [{name: "Jane"}]` but each founder requires name + role + bio | Parent looks filled, child isn't |

### Likely UNFILLED — semantic reasoning required

Use judgment for these. For each value, read it and ask: *"is this real content for THIS specific brand, or did someone leave a copy-pasted example?"*

- **Known stub strings** — common template examples that often survive: `"Acme"`, `"Acme Labs"`, `"Acme, Inc."`, `"John Doe"`, `"Jane Smith"`, `"example.com"`, `"hello@example.com"`, `"Your Company"`, `"Lorem ipsum"`, `"Your brand here"`, `"My SaaS"`, `"Product Name"`, `"My App"`.
- **Generic placeholder language** — values that sound like instructions, not content: `"Insert your tagline here"`, `"Add a description"`, `"Your value proposition"`, `"Describe your product"`.
- **Contextually inconsistent with established values** — e.g., the brand name throughout the file is "Glow" but this slot says `"My SaaS Product"`. Clearly a stub that survived.
- **One-word fillers in slots needing real content** — single generic words like `"product"`, `"app"`, `"thing"`, `"company"`, `"users"` in slots that need a real description or persona.
- **Suspiciously round / placeholder-like numbers** — `"$1,000,000 users"`, `"100% better"` — values that look like fillers rather than real metrics.

### Definitively FILLED — no further check needed

- Value is specific to this brand and contextually coherent with other filled values
- For lists: meets declared cardinality AND each item has all required sub-fields populated
- For descriptions: at least one full sentence with brand-specific details (not generic)
- For computed/derived values: matches the declared algorithm output (e.g., palette step 9 = brand primary color)

### Value states — populated-but-unverified (drafts and unconfirmed defaults)

Two states sit between "unfilled" and "approved", and BOTH must round-trip back to the human (see §Status protocol for the full six-state model + ledger):

- **`# draft`** — the AI filled a high-stakes slot by **inference** (brand voice, tagline, mission/vision, positioning, persona, competitors, story) rather than from the user's own words. Real and brand-specific, but unsigned-off → intake **PART 0**.
- **`# default`** — the AI accepted a template **out-of-box default** (a PART 2 dial: radius, density, motion, hero variant, onboarding pattern, command palette, etc.) the user never consciously chose. Safe to ship, but invisible without the marker → intake **PART 2 review**.

Treat any slot carrying either marker as **populated-but-unverified**:

- **Mark on fill (producer side):** whenever YOU populate a high-stakes slot by **inference** (not from the user's own words), add a `# DRAFT — confirm` comment at fill time. That marker is what makes the value round-trip into the next intake's PART 0 instead of silently passing as approved.
- **Detect mechanically:** scan slot values for inline `# draft` / `DRAFT — confirm` / `confirm/refine` / `# proposed` (→ PART 0) and `# default` (→ PART 2 review) markers. Together with semantic stub-reasoning on UNMARKED filled values, this guarantees nothing AI-touched escapes review.
- **Surface them as a distinct group** in the intake — the **"Drafts awaiting your approval"** block (see Output format), separate from the unfilled `?` items — so *"what do I have to fill out **or approve**"* returns BOTH.
- **High-stakes drafts first.** Brand **voice / positioning / persona / tagline** propagate into DESIGN.md and SPEC.md — get these approved **before** writing page copy, or the copy is built on unapproved foundations.
- **On approval** ("confirmed" / "approve all" / an edit), **remove the `# DRAFT` marker** so the slot becomes Definitively FILLED. Never silently treat a `# DRAFT` value as approved.

### Intentional skips

If the user explicitly said "skip [section]" / "skip 14" / "n/a" — or the value is `<SKIPPED>` / `<N/A>` / `"n/a"` — treat as resolved. Do NOT include in the unfilled list. Track separately and surface in the final report ("3 items intentionally skipped by user: 14, 27, 38").

### When in doubt — confirm, don't assume

If a slot's content looks plausibly real but you can't tell whether it's a stub, **include it in PART 1 with a confirmation framing** instead of silently treating it as filled:

> *5. **Legal entity name** — currently shows "Acme Labs, Inc.". Is that your real entity? Say "confirmed" or correct it.*

Better to ask one extra question than miss a stub that ships to production.

## Output format

When triggered, the AI produces a **single response** containing exactly this structure (same shape every time, scoped to whichever templates the project uses):

### Header

```
# Intake — <Project Name or "Premium Product Templates">

This is everything you need to **fill out or approve** to fully populate <scope: e.g., "your design template" / "your full project (PROJECT + INFORMATION + DESIGN + SPEC)">. PART 0 is drafts I already wrote that need your sign-off; PART 1 is what only you can answer; PART 2 is defaults to accept or override. Each item has a short plain-English hint after the em dash.

**How to answer:**
- **All at once** — reply with answers numbered, freeform, or both. I'll figure it out.
- **One at a time** — say "let's go one at a time" and I'll walk you through each question, waiting for your answer before moving on.
- For **PART 0** (drafts I pre-filled), say "approve all" to accept, or correct any by number.
- For PART 2, either accept the defaults ("looks good, accept all") or list overrides ("override saturation to vivid, switch radius to soft").
- Say "skip [section]" for anything that doesn't apply.

I'll fill the templates as your answers come in and surface gaps at the end.
```

### PART 0 — Approve or revise (AI-drafted items)

**Include this block ONLY when the files contain `# DRAFT`-marked values** (the AI pre-filled high-stakes slots by inference — per §"What counts as 'filled' vs 'unfilled'" → Awaiting approval). These are populated but unapproved, so they're NOT in PART 1. **List the high-stakes ones first** (brand voice / positioning / tagline / persona) — they propagate into DESIGN + SPEC, so they must be approved before page copy. Show each draft's current value so the human can accept or rewrite it.

```
# PART 0 — Drafts awaiting your approval
I drafted these for you (inferred from your brand + thesis). Approve as-is or rewrite — brand voice/positioning seed your design system and page copy, so lock these first.

1. **Tagline** — currently: "An AI assistant for a measured life". Approve, or give me your line?
2. **Mission** — currently: "<current value>". Approve / edit?
3. **Brand voice (4 sample lines)** — currently: <list>. Approve / rewrite?
4. **Primary persona** — currently: "Maya — busy non-technical person". Approve / refine?
…one line per DRAFT-marked slot…

Say "approve all" to accept every draft as-is, or correct any by number.
```

### PART 1 — Must Fill (no defaults possible)

Numbered list, grouped by source template. Each question gets a short plain-English hint after the em dash:

```
## PART 1 — Must Fill (no defaults possible)

### Scope (PROJECT.md) — answer this first; determines which other questions apply
0. **Project type** — what you're building: marketing-site *(landing + content)* / product-saas *(app behind login)* / mobile-app *(iOS/Android)* / hybrid-web-plus-mobile *(both)*: ?

### Brand identity (INFORMATION.md)
1. **Brand name** — what people call your product. E.g., "Linear", "Stripe": ?
2. **One-line product description** — one sentence: what it does, for whom: ?
3. **Primary audience persona** — your main user. Name + one-sentence portrait: ?
4. **Secondary personas** *(optional)* — 1-2 other important users. Name + one-line portrait each, or "none": ?
5. **Anti-persona** — at least one: who this is explicitly NOT for + why. Sharpens positioning: ?
6. **Voice descriptor** — how the brand "sounds". 1-2 sentences on tone, energy, formality, what to avoid. E.g., "Warm and expert. Direct, never salesy.": ?
7. **Mission** — the *why*. What change you're creating in the world: ?
8. **Brand story** — origin in 2-3 sentences. Why now, why you: ?
9. **Brand archetype** — pick one of Carl Jung's 12: Sage *(wisdom)* / Hero *(triumph)* / Creator *(innovation)* / Caregiver *(nurture)* / Innocent *(simplicity)* / Explorer *(freedom)* / Rebel *(disruption)* / Magician *(transformation)* / Ruler *(control)* / Lover *(connection)* / Jester *(joy)* / Everyman *(belonging)*: ?
10. **Stage** — current company stage: idea / pre-launch / beta / launched / scaling / mature: ?
11. **Founder(s)** — for each: full name, role, 1-2 sentence bio: ?
12. **Non-features** — at least 2 things you explicitly will NOT build. Sharpens scope discipline: ?
13. **Business model type** — how money comes in: freemium / subscription / one-time / usage-based / marketplace / not-yet-decided. Tier details can come later: ?
14. **Target geography** — where users are: US-only / EU-only / global / specific list. Drives compliance + locale defaults: ?

### Visual foundation (DESIGN.md / DESIGN_MOBILE.md — only if project includes web or mobile)
15. **Brand primary color** — main brand color. Hex (`#2D6A4F`), OKLCH, or descriptive ("warm forest green"). I'll generate the full 12-step palette + dark mode: ?
16. **Display font family** — for headings + hero copy. Default: "Geist Sans" or "Inter": ?
17. **Body font family** — for paragraph copy. Often same as display: ?
18. **Mono font family** — for code blocks. Default: "Geist Mono" / "JetBrains Mono". Skip if no code surfaces: ?
19. **Icon family** — UI icon set: Lucide *(free, default)* / Phosphor *(free)* / HugeIcons *(Pro license)* / custom: ?

### Site structure (SPEC.md — only if web or hybrid)
20. **Sitemap** — list of pages. E.g., home, pricing, about, blog, contact, plus product pages. Mark which appear in **top nav**, and note each page's **type** *(home / article / product / pricing / FAQ / how-to / about / local)* — this drives the JSON-LD structured data in SEO.md: ?

### App structure (SPEC_MOBILE.md — only if mobile or hybrid)
21. **Tab bar destinations** *(3-5 top-level)* + **screen list organized by tab**: ?

### Tech stack confirmation (PROJECT.md) — defaults shown; override only if different
22. **Web framework** — Next.js (App Router) ← override or accept
23. **Mobile approach** — SwiftUI *(iOS-only)* / Jetpack Compose *(Android-only)* / React Native (Expo) *(cross-platform)*. Pick one or "n/a": ?
24. **Deployment** — where the site/app is hosted: Vercel ← override or accept
25. **Primary domain URL** — your main public URL. E.g., `example.com`: ?

### Operations + Legal (INFORMATION.md)
26. **Support channel** — how users get help: email address / Intercom / community Discord / etc.: ?
27. **Legal entity type + jurisdiction** — e.g., "LLC, Delaware". Or "not-yet-incorporated": ?
28. **Compliance requirements** — auto-derived from target geography above. Confirm: GDPR *(EU)* / CCPA *(California)* / HIPAA *(US healthcare)* / SOC2 *(B2B enterprise)* / none: ?

### Content fundamentals (SPEC.md / SPEC_MOBILE.md)
29. **5-10 voice samples** — real sentences written in your brand's voice. The AI uses these to mimic tone everywhere. Say **"draft them"** for AI to propose drafts from your voice descriptor + archetype: ?
30. **Reusable content** *(CONTENT.md)* — the records pages will share: 3-5 **proof points** (metrics / logos / testimonials, real only), plus any **FAQs**, **features**, **team bios**, **case studies**, or **pricing tiers** you have. These become single-sourced records pages reference via `{content.*}`. Real + approved only, or "none yet" if pre-launch: ?
```

### PART 2 — Customizable Defaults (accept or override)

Each as `label — what it controls: default ← (option a / option b *(hint)* / option c *(hint)*)`:

```
## PART 2 — Customizable Defaults (accept or override)

All defaults are premium-grade and I'll apply them unless you override. Skim and tell me which (if any) to change.

### Profiles (preset bundles — each shifts multiple coordinated values)
- **Radius** — corner roundness everywhere: **default** ← sharp *(engineered)* / default *(balanced)* / soft *(friendly)* / pill *(fully rounded)*
- **Type scale** — size jump between text sizes: **balanced (1.200)** ← compact *(subtle hierarchy)* / balanced / spacious / dramatic / editorial *(magazine-large)*
- **Density** — breathing room around components: **comfortable** ← compact *(packed)* / comfortable / spacious *(airy)*
- **Motion** — how animated things feel: **default** ← subtle *(barely there)* / default *(polished)* / expressive *(playful, bouncy)*
- **Elevation** — shadow depth between layers: **default** ← flat *(no shadows)* / default *(subtle)* / dimensional *(pronounced)*
- **Saturation** — color vividness: **default** ← muted *(desaturated)* / default / vivid *(punchy)*
- **Warmth** — gray temperature: **neutral** ← cool *(blue-leaning)* / neutral / warm *(brown-leaning)*
- **Section padding** *(web only)* — vertical space between page sections: **default** ← compact / default / generous
- **Chart minimalism** — how much "ink" charts use: **default** ← tufte *(minimal)* / default / carbon *(info-dense)*

### Pick-one slots — Web (DESIGN.md + SPEC.md)
- **Input style** — form fields: **outlined** ← outlined *(border)* / filled *(subtle bg)* / underlined *(line only)*
- **Tabs** — active tab indicator: **underline** ← underline / filled *(pill bg)*
- **Icon fill** — icon style: **outline** ← outline *(strokes)* / filled *(solid)*
- **Avatar shape** — **circle** ← circle / squircle *(Apple-style)* / rounded-square
- **Modal backdrop** — what's behind popups: **blur** ← scrim *(dim overlay)* / blur
- **Code block surface** — **always-dark** ← match-page *(follows theme)* / always-dark
- **Onboarding pattern** — how new users learn the product: **empty-state-driven** ← empty-state-driven *(helpful placeholders)* / progressive *(features revealed as needed)* / coach-marks *(pointer arrows)* / step-by-step-modal *(walkthrough)* / milestone-checklist *(gamified)*
- **Save model** — **auto-save** ← auto-save *(while typing)* / explicit-save *(Save button)*
- **Settings IA** — settings layout: **sidebar** ← sidebar *(vertical nav)* / tabs *(horizontal)* / single-page *(scroll)*
- **Container width** — max page width: **lg (1280px)** ← md *(1024)* / lg *(1280)* / xl *(1440)*
- **Heading weight** — **600** ← 600 *(semibold)* / 700 *(bold)*
- **Time format** — **hybrid** ← relative *("2h ago")* / absolute *("Mar 5")* / hybrid *(relative ≤7d, absolute after)*
- **Number abbreviation** — **contextual** ← short *(1.2K)* / long *(1,200)* / contextual
- **Product nav style** — app navigation: **sidebar** ← top-bar / sidebar *(vertical left)* / hybrid / none
- **Hero variant** — homepage hero layout: **split-asymmetric** ← centered / split-asymmetric *(text left, image right)* / background-led *(full-bleed)*
- **Toast position** — **top-right** ← top-right / top-center / bottom-right / bottom-center
- **Footer style** — **multi-column** ← multi-column *(link directory)* / minimal
- **`llms.txt`** *(SEO.md — discoverability)* — markdown index of key pages for AI crawlers: **disabled** ← enabled *(low-cost forward-proofing)* / disabled *(no provider officially consumes it yet)*
- **Command palette (⌘K)** — Linear/Raycast-style launcher: **enabled** ← enabled / disabled
- **RTL support** — right-to-left languages: **disabled** ← enabled / disabled
- **Chart library** — **recharts** ← recharts *(simple)* / visx *(low-level)* / tremor *(dashboards)* / echarts *(feature-rich)* / custom
- **Illustration style** — custom artwork: **vector** ← vector *(flat illustrations)* / 3D / abstract / mixed / none

### Pick-one slots — Mobile (DESIGN_MOBILE.md + SPEC_MOBILE.md)
- **Mobile nav style** — primary nav: **tab-bar** ← tab-bar *(iOS bottom tabs)* / navigation-bar *(Material bottom tabs)* / nav-rail *(side rail, tablets)* / hybrid
- **Platform adherence** — how strictly to follow each OS's HIG: **cross-platform-hybrid** ← ios-strict / material-strict / cross-platform-hybrid *(balanced, recommended when shipping both; if you ship only one platform, prefer that platform's strict mode)*
- **Haptic intensity** — vibration feedback: **default** ← subtle *(wellness)* / default / expressive *(gaming)*
- **Bottom sheet detents** — sheet stop positions: **medium-large** ← medium-large / small-medium-large *(extra peek)* / custom

### Color mode + accessibility (DESIGN.md)
- **Primary mode** — does the app default to: **light** ← light / dark / system *(follows OS)*
- **Capitalization** — button + label casing: **sentence case** *("Get started")* ← sentence case / title case *("Get Started")*
```

### PART 3 — What happens next

```
## PART 3 — When you reply

I'll:
1. Apply your answers to the relevant templates (in order: PROJECT → INFORMATION → CONTENT → DESIGN → SPEC → SEO)
2. Generate derived values (12-step color palette from your primary color with APCA verification, dark-mode counterpart, semantic palette dark variants, shadow tint)
3. Propagate **every** shared value across templates per `§Cross-template consistency rules` — including the full color palette, type families, **icons**, dataviz, and photography → `DESIGN_MOBILE.md` (and `icons` → `PROJECT.tech.web.icons`); voice → DESIGN voice slot + SPEC voice samples; persona name → SPEC pages. For a hybrid project, `DESIGN_MOBILE.md` is filled in this pass too — not left for later.
4. If you asked me to draft voice samples, I'll show you 8-10 drafted from your voice descriptor + archetype for your approval BEFORE committing to SPEC.md (voice mimicry is high-stakes)
5. Run the five final verification checks: multi-pattern slot fill (`<placeholder>` syntax + plain-text TBD/TODO + empty YAML + known stub strings like "Acme" / "example.com" + cardinality + semantic reasoning), cross-template consistency, YAML validity, propagation integrity, and completeness summary
6. Report what was filled, what's still open, **what drafts are awaiting your approval (the `# DRAFT`-marked values)**, what's a suspected stub needing your confirmation, and what's intentionally marked `<TBD>` or `<SKIPPED>` for follow-up
7. Offer next steps (draft page copy, scaffold code, etc.) — your choice
```

## Behavioral protocol — the 12 steps the AI follows

### Step 1: Verify template files present
Before producing intake, read PROJECT.md (if present) to learn which sibling files exist via `source_files.*.exists`. If PROJECT.md isn't present, scan the directory for the recognized template filenames (`DESIGN.md`, `DESIGN_MOBILE.md`, `SPEC.md`, `SPEC_MOBILE.md`, `INFORMATION.md`).

### Step 2: Determine scope
If the user's trigger was about a specific template ("what do you need for DESIGN.md?"), scope to that template only. If general ("what do you need?"), scope to all present templates.

### Step 3: Audit slot state BEFORE producing intake

This step is what guarantees PART 1 lists every actually-unfilled item, not just placeholder-looking ones. Skipping this step is the single biggest way the protocol can fail the user.

For every scoped template file:

1. **Read the file in full** (not a partial read — the whole file).
2. **Walk every must-fill item** in that template's canonical intake. For each one, locate its corresponding YAML slot path and classify it using the rules in §"What counts as 'filled' vs 'unfilled'".
3. **Build five buckets** (this IS the state ledger):
   - **Unfilled** — fails one of the mechanical checks. Goes into PART 1.
   - **Suspected stub** — passes the mechanical checks but fails the semantic reasoning checks (looks like a leftover example, contextually inconsistent, generic placeholder language). Goes into PART 1 with confirmation framing.
   - **Draft (awaiting approval)** — populated with a real value carrying an inline `# draft` / `confirm/refine` / `# proposed` marker (AI-inferred, unsigned). Goes into **PART 0** (approve or revise), NOT PART 1.
   - **Unconfirmed default** — populated with a template out-of-box value carrying a `# default` marker, never consciously chosen. Goes into the **PART 2 review** note (skimmable; user confirms the consequential ones if they want — not forced).
   - **Definitively filled** — `# approved`, `# locked`, or unmarked-and-user-given; passes all checks. Excluded from PART 0 and PART 1.
4. **Cardinality pass**: for any list slot with a declared minimum ("3-5 trust metrics", "at least 2 non-features", "2 founders"), count items and mark unfilled if the list is short OR if any item is missing required sub-fields.
5. **Cross-template propagation pass**: if a slot is filled in its source template (e.g., `INFORMATION.project.name`), check that its propagation targets match (e.g., `PROJECT.project.name`). If they don't match, fix automatically and note in the final report — don't re-ask the user.
6. **Intentional-skip pass**: items the user explicitly skipped on a prior pass (marked `<SKIPPED>`, `<N/A>`, `"n/a"`) stay excluded.

**Output of this step is the single source of truth for PART 1.** Never improvise the PART 1 list from memory or assumption — always derive from this audit.

Surface a brief one-line summary at the top of the intake form when there are pre-filled items: *"Already filled: 18 of 47 items. 3 suspected stubs need confirmation. 26 remaining."*

### Step 4: Produce intake — deterministic format
Output follows the structure in the "Output format" section above. Same headers, same ordering, same labels every time. Skip sections that don't apply to the scoped templates. Include only items flagged unfilled or suspected-stub by Step 3.

### Step 5: Wait for user response
Don't proceed until the user replies. If they go silent, don't fabricate answers.

### Step 6: Parse user response flexibly
Users will answer in many shapes:
- Numbered ("1. Acme. 2. We're a billing platform. ...")
- Free-form prose ("So Acme is a billing platform for ...")
- Markdown / bulleted lists
- "Skip 3 and 7"
- "Accept all defaults"
- "Override radius to soft, saturation to vivid, everything else default"

Parse all of these and map to the right slots. If a response is ambiguous, ask one targeted follow-up — don't guess.

**Natural-language overrides** — map fuzzy user preferences to the right enum value:
- "softer corners" / "rounder" / "warmer feel" → radius profile `soft`
- "sharper" / "more engineered" / "Stripe-like" → radius profile `sharp`
- "more space" / "more breathing room" / "spacious" → density `spacious` or section_padding `generous`
- "tighter" / "denser" / "compact" → density `compact`
- "more saturated" / "punchier color" / "vivid" → saturation `vivid`
- "muted" / "subtler" / "institutional" → saturation `muted`
- "more polished motion" / "expressive" → motion `expressive`
- "calmer" / "less animation" → motion `subtle`
- "flatter" / "minimal depth" → elevation `flat`
- "more dimensional" / "richer shadows" → elevation `dimensional`

When in doubt, confirm before applying: "I'm reading 'softer corners' as radius profile `soft` — confirm or correct?"

**Partial answers + deferral:**
If the user gives partial answers and says "let me come back later" / "I'll do the rest tomorrow":
1. Apply what was given
2. Summarize remaining open items (with their PART 1 / PART 2 numbers)
3. Confirm they can resume by saying "continue the intake" or "resume the intake"
4. Don't pressure them to finish

**Intake mode persists across ad-hoc questions:**
If during intake the user asks a side question ("wait, what does 'profile' mean again?"), answer it briefly and then return to intake — don't drop the form. Re-show the remaining open items if it's been a while since the form was displayed.

### Step 7: Fill templates progressively, in the right order
As you parse answers, edit the relevant template files directly. **Fill order matters** because later files reference earlier ones:

1. **PROJECT.md** first (project type + tech stack + file existence flags — sets scope for everything else)
2. **INFORMATION.md** next (brand identity is foundational; DESIGN voice slot, SPEC voice samples, SPEC primary_persona all reference INFORMATION values)
3. **DESIGN.md** + **DESIGN_MOBILE.md** in parallel (visual decisions; share brand identity values from INFORMATION)
4. **SPEC.md** + **SPEC_MOBILE.md** last (content + layout; reference DESIGN vocabulary and INFORMATION audience)

Show the user a compact summary of what you filled per file after each batch.

### Step 8: Derive automatically (in this order)
For values that can be computed from user inputs, derive without asking. **Order matters** — later derivations depend on earlier ones.

1. **Resolve all profile selections first** (saturation, warmth, radius, type-scale, etc.). User-provided overrides win; defaults apply otherwise.
2. **Generate 12-step color palettes** via the OKLCH algorithm in DESIGN §C.15:
   - Apply the saturation profile's chroma multiplier (muted ×0.7, default ×1.0, vivid ×1.3)
   - Apply warmth profile to neutral hue (cool ≈ 240, neutral ≈ 60, warm ≈ 40)
   - Generate primary, neutral, success, warning, danger palettes
   - **APCA verification step:** for each palette, check step 11 vs step 2 clears Lc 60; step 12 vs step 2 clears Lc 90. If either fails, lower the step's L by 0.02 increments until it passes. Surface to user only if a palette fails after 5 retries.
3. **Generate dark-mode counterparts** for all 5 palettes per §C.10 perceptual mapping rules (not inversion):
   - Lower lightness floor and raise ceiling
   - Reduce chroma 20-40% for accents
   - Verify APCA targets against dark step 2
4. **Set derived neutral-dependent tokens**:
   - Shadow tint = `neutral.12`
   - Surface roles map to neutral steps per §C.6
   - Border roles map per §C.7
5. **Propagate brand identity to all templates** (per Cross-template consistency table below).
6. **Apply HTML mapping defaults** in DESIGN typography appropriate to the project type.
7. **Generate voice samples (with approval gate)**:
   - Draft 8-10 voice samples for SPEC.md `voice_samples` inspired by INFORMATION.md `brand.voice_principles` + archetype
   - Present them to the user for review BEFORE committing
   - Voice mimicry is high-stakes; treat this as the most important approval gate in the intake
8. **Generate placeholder paths** for OG image, favicon, logo (mark with `<TBD: replace with actual asset>` so user remembers).

### Step 9: Propagate shared values
See "Cross-template consistency" table below.

### Step 10: Surface ambiguities and gaps
If the user couldn't answer something ("I don't have a brand color yet"), offer three options:
- I can generate one based on your brand archetype and voice
- We can mark it `<TBD: brand primary color>` and circle back
- We can skip if you don't need visual decisions yet

Never silently fabricate brand decisions.

### Step 11: Final verification — multi-pattern audit

After all edits, perform five checks and report results. **The grep patterns are a deterministic safety net** — the AI also uses semantic reasoning per §"What counts as 'filled' vs 'unfilled'". Combine both.

**Check A — slot fill (5 sub-patterns):**

Run each pattern across all scoped template files. The union of hits is the unfilled set.

| Sub-check | Pattern / method | Catches |
|---|---|---|
| A.1 | `grep -n "<[^>]*>" *.md` | Unfilled `<placeholder>` syntax |
| A.2 | `grep -niE "\bTBD\b\|\bTODO\b\|\bFIXME\b" *.md` | Plain-text deferrals (case-insensitive) |
| A.3 | `grep -nE ': *""\s*$\|: *\?\s*$\|: *null\s*$' *.md` | Empty / null / `?` YAML values |
| A.4 | Stub scan: `grep -niE "Acme\|example\.com\|John Doe\|Jane Smith\|Lorem ipsum\|Your Brand\|Your Company\|Product Name" *.md` | Common surviving template stubs |
| A.5 | Cardinality + semantic scan: walk each list slot with a declared minimum count and verify; for descriptive slots, apply the semantic reasoning checks from §"What counts as 'filled' vs 'unfilled'" | Lists below threshold; suspected stubs that don't trip A.1–A.4 |

Report combined results:
- ✅ X slots filled
- ⚠️ Y slots remaining (per sub-check that flagged each; cite the failure mode: *placeholder / empty / deferred / stub / under-cardinality / semantic-stub-suspected*)
- 📝 Z slots intentionally marked `<TBD: ...>` or `<SKIPPED>` by the user — not failures, but called out so the user can revisit
- 🤔 W slots flagged as suspected stubs needing confirmation (passed A.1–A.4 but failed semantic reasoning — surface each with its current value)

**Check B — cross-template consistency:**
Verify each propagation rule from the table below. Report ✅ rules verified + ⚠️ any inconsistencies. Auto-fix drift; don't re-ask the user.

**Check C — YAML validity (when AI has shell access):**
Run `yaml.safe_load` on each frontmatter. Surface and offer to fix any errors.

**Check D — propagation integrity:**
Walk the propagation table (below). For each row, the source value must match all targets exactly. Surface any drift, even if it would otherwise pass Check A.

**Check E — completeness summary + state ledger:**
Emit the **state ledger** — every must-fill slot classified into exactly ONE of the six states (`unfilled / draft / default / approved / locked / given`); if any value can't be classified, surface it rather than guessing. Then per-file counts: `total / given+approved+locked / unfilled / draft / unconfirmed-default / suspected-stub / user-deferred / skipped`. **If anything sits in `unfilled`, `draft`, or `suspected-stub`, the templates are NOT verified — do NOT declare done.** An `unconfirmed-default` is shippable but must be shown, not hidden. This ledger is the guarantee that every value's state is known — nothing fabricated is left behind unverified.

### Step 12: Offer next steps
After completion, proactively offer (don't wait for user to ask):
- "Want me to draft v1 copy for any specific page (home / pricing / about)?"
- "Want me to draft auth flow copy, transactional emails, or system messages?"
- "Want me to scaffold the actual code structure (Next.js app router pages, component skeletons matching DESIGN tokens)?"
- "Want a final read-through of the filled templates?"

Frame these as menu options. Wait for the user to choose.

## Cross-template consistency rules

| Field | Lives in | Propagates to |
| --- | --- | --- |
| Brand name | `INFORMATION.project.name` | DESIGN.md Overview, DESIGN_MOBILE.md Overview + `brand.name`, SPEC voice samples context, PROJECT.md `project.name` |
| Brand description / audience / voice | `INFORMATION.*` | DESIGN.md + DESIGN_MOBILE.md `brand.{description,audience,voice}` and the Overview prose (brief restatements) |
| Voice descriptor | `INFORMATION.brand.voice_principles` | DESIGN.md voice slot (brief restatement), SPEC voice_samples generation seed |
| Primary persona name | `INFORMATION.audience.primary_persona.name` | SPEC.md `pages.*.primary_persona` slots |
| **Full color system** | DESIGN.md `colors.*` — every generated step of all 5 palettes (`{primary,neutral,success,warning,danger}.{1..12}` **and** `.dark.{1..12}`, the bases/hue), plus the role + semantic tokens (`surface`/`border`/`text`/`semantic`) and `shadow_tint` | DESIGN_MOBILE.md `colors.*` — **identical values** (copy the whole `colors:` block over; mobile additionally keeps its native-only keys `ios_system.*` and `material_*`). Not just the base color — the entire generated palette must match. |
| **Icons** | DESIGN.md `icons.family` + `icons.library` | DESIGN_MOBILE.md `icons.library` + `icons.cross_platform_default`, **and** PROJECT.md `tech.web.icons` — all three must name the **same family** |
| Type families | DESIGN.md `typography.families.*` | DESIGN_MOBILE.md `typography.families.*` (note: mobile also maps to platform text styles) |
| Dataviz palettes | DESIGN.md `dataviz.palettes.*` (categorical / sequential / diverging) | DESIGN_MOBILE.md `dataviz.palettes.*` identical |
| Photography style | DESIGN.md `images.photography_style` | DESIGN_MOBILE.md `images.photography_style` identical |
| Shared profiles | DESIGN.md `profiles.*` | DESIGN_MOBILE.md identical values for all profiles except `section_padding` (web-only) |
| SEO defaults | INFORMATION.md `seo.*` | Already token-referenced from SPEC.md `global.meta_defaults` via `{information.seo.*}` |
| Tech stack | PROJECT.md `tech.*` | Implicit — AI generates code matching this stack |
| Legal URLs | INFORMATION.md `legal.privacy_url`, `legal.terms_url` | SPEC.md footer columns, app store metadata |
| Social handles | INFORMATION.md `social.*` | SPEC.md footer brand_column, app store URLs |
| Project type | PROJECT.md `project.type` | Determines which templates are scoped in intake; informs HTML mapping defaults in DESIGN |
| Entity (brand/people/social) | INFORMATION.md `project.name`, `people.*`, `social.*` | SEO.md `structured_data.organization` (name/logo/**sameAs**) + Person schema for founders (E-E-A-T) — keep identical for GEO entity consistency |
| Page list + copy | SPEC.md `sitemap` + `pages.*` | SEO.md `page_type_schema` (which schema per page) + answer-first page copy; SEO `social_cards` pull SPEC page title/description |
| Content records (testimonials/stats/FAQs/team/pricing) | CONTENT.md `testimonials.*`, `stats.*`, `faqs.*`, … | SPEC pages reference via `{content.*}` (single-sourced — no inline duplication); SEO.md uses `stats`/`testimonials` for GEO, `faqs` for FAQPage, `team_members` for Person schema; voice-checked vs INFORMATION |

When the AI fills any field on the left, it also fills the propagation targets without asking the user again.

**These rules are continuous, not one-time — they apply on every UPDATE, not just the first fill.** Whenever the user later *changes* a shared value, immediately re-propagate it to every target in its row so the documents never drift out of sync — and re-run any derivation the change implies. Examples:
- **"Switch the icons to Phosphor"** → update `DESIGN.icons.family` + `DESIGN.icons.library` **and** `DESIGN_MOBILE.icons.library`/`cross_platform_default` **and** `PROJECT.tech.web.icons`. Never leave one document on the old family.
- **"Make the brand color a bit darker"** → regenerate the **entire** 12-step palette (light + dark) in DESIGN.md via the generator, then copy the whole `colors:` block into DESIGN_MOBILE.md. Don't hand-edit a single step.
- **"Change the body font"** → update `typography.families.*` in both DESIGN.md and DESIGN_MOBILE.md.

After any such change, say which sibling documents you updated. If you update one document and its siblings would now be stale, that is a bug — fix all of them in the same pass.

## Edge cases

### Only one template present (e.g., only DESIGN.md)
Intake scopes down to that template's slots only. Sections referencing INFORMATION.md or SPEC.md are omitted. Brand voice slot becomes free-form (filled directly in DESIGN.md) rather than referencing INFORMATION.md.

### PROJECT.md not present
Protocol still works — AI discovers other templates by scanning the directory. Remind the user that adding PROJECT.md provides better orchestration if they want it.

### User has already partially filled some slots
Read existing values first, EXCLUDE filled slots from the intake form, only ask about remaining gaps. Critical: don't re-ask about already-decided things.

### User wants to redo a slot they already filled
Accept overrides. If user says "change brand color to X", apply the change and re-derive all dependent values (12-step palette, shadow tint, dark mode counterpart, etc.).

### User wants intake for one section only
E.g., "Just walk me through the SPEC.md voice samples." Scope to that section only — produce only the relevant PART 1 questions, skip everything else.

### User pushes back on a default
Offer the options menu with brief descriptions ("sharp = engineered feel; default = balanced; soft = warmer; pill = playful"). Let the user pick.

### Multilingual / RTL projects
If user indicates RTL or multilingual ("we ship in Arabic"), the AI automatically:
- Sets `mode.rtl_support: enabled` in DESIGN.md
- Asks for target locales
- Flags i18n/RTL sections of DESIGN.md and INFORMATION.md as relevant

### User changes project type mid-intake
Update `project.type`, scope the intake to include newly-relevant templates, ask the new mobile-specific (or web-specific) questions.

### User wants to defer content (SPEC.md is the time-intensive part)
Common case — user wants brand + design configured but isn't ready to write copy. Offer: "I'll fill INFORMATION + DESIGN now and leave SPEC content slots empty. You can run the intake again later just on SPEC, or fill manually."

### Templates aren't in `PROJECT.md`'s `source_files`
If PROJECT.md says `design_md.exists: false` but DESIGN.md is actually present, prefer the actual file presence over the flag. Note the discrepancy to the user.

### Templates are on an older version
If template files are on version 1.0.x or 1.1.x and missing this Protocol section, the AI can still run a basic intake using common sense, but recommend the user update to 1.2.0+ for the full structured protocol.

---

# How to fill this template well

## Project orientation

`type` is consequential. It determines which source files apply:
- **marketing-site** → DESIGN.md + SPEC.md + INFORMATION.md (no mobile)
- **product-saas** → DESIGN.md + SPEC.md + INFORMATION.md (web app with auth, settings, etc.)
- **mobile-app** → DESIGN_MOBILE.md + SPEC_MOBILE.md + INFORMATION.md
- **hybrid-web-plus-mobile** → all six files

## Source files

For each file, mark `exists: true` or `false` honestly. This isn't aspirational — only mark `true` for files actually in the repo. The AI uses this to know what to consult and what to ignore.

## Tech stack

This section is consulted whenever the AI writes code. Being accurate here prevents the AI from introducing libraries you don't use or assuming a different framework.

If you're solo and don't have strong opinions on every line, leave the comfortable defaults (Next.js + Tailwind + Vercel) and customize only what matters for the project.

## Agent constraints

This is the project-wide "rules of the road." Sub-files have their own narrower rules. Add project-specific musts and must-nots here. Common additions:

- "All API routes must validate input with Zod schemas."
- "Don't add tracking pixels without explicit human approval."
- "Component files use the .tsx extension; pure logic uses .ts."

## Workflow

The `ai_collaboration_pattern` block documents how humans and AI typically work together on this project. This helps the AI propose appropriate next steps rather than freelancing.

---

# Anti-patterns — never do this in PROJECT.md

- **Don't restate content from sub-files here.** This is an index, not a content file. Voice belongs in INFORMATION.md; component specs in DESIGN.md; page content in SPEC.md.
- **Don't put secrets here.** Environment variables and API keys never ship in source files.
- **Don't lie about file existence.** Mark `exists: false` if a file genuinely isn't in the repo — the AI uses this to avoid hallucinating references.
- **Don't make this file long.** Target ≤ 200 lines. If you find yourself writing essays here, the content belongs in a sub-file.
- **Don't omit tech stack.** Without it, the AI assumes generic defaults that may not match your project.

---

# Versioning

`template_version: 1.21.0`. Per-project `PROJECT.md` instances should preserve this field.

# Source

Part of the `premium-product-templates` family. Companion files: `INFORMATION.md` (brand / business / audience), `DESIGN.md` / `DESIGN_MOBILE.md` (visual systems), `SPEC.md` / `SPEC_MOBILE.md` (content + layout).
