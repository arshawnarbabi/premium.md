---
# ─────────────────────────────────────────────────────────────
# PROJECT_TEMPLATE.md — Entry-point orchestration for AI agents
# Version: 1.0.0
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

template_version: "1.0.0"
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

priority_order:
  # When multiple files speak to the same decision, this is the precedence.
  # First listed wins. SPEC + INFORMATION are content/brand truth; DESIGN is
  # visual truth; PROJECT defines the project envelope.
  - SPEC.md / SPEC_MOBILE.md       # what to build (page content + layout instances)
  - INFORMATION.md                  # who it's for + how to talk about it
  - DESIGN.md / DESIGN_MOBILE.md   # how it looks
  - PROJECT.md                      # project-wide constraints (this file)

# ═══════════════════════════════════════════════════════════════
# TECH STACK
# ═══════════════════════════════════════════════════════════════

tech:
  web:
    framework: "Next.js"                 # App Router by default
    framework_version: "<15.x | latest>"
    language: "TypeScript"
    styling: "Tailwind CSS"
    styling_version: "<v4>"
    ui_primitives: "<shadcn/ui (dashboards) | none (marketing sites) | custom>"
    component_library_note: "shadcn/ui is for product / dashboard contexts only; marketing sites use custom components built against DESIGN.md tokens"
    animation: "Framer Motion"
    forms: "React Hook Form + Zod"
    icons: "<Lucide | Phosphor | Hugeicons (Pro for premium) | other — declare per project>"
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

1. Copy this file to your project as `PROJECT.md`. (If your AI tool prefers `AGENTS.md` or `CLAUDE.md`, rename accordingly — the content is the same.)
2. Fill every `<slot>` value. Verify with `grep -n "<[^>]*>" PROJECT.md`.
3. For each `source_files.*.exists` field, mark `true` only for files actually present. The AI will skip referencing files marked `false`.
4. Reference `PROJECT.md` (or have your tool auto-discover it) in every AI prompt for this project.

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

`template_version: 1.0.0`. Per-project `PROJECT.md` instances should preserve this field.

# Source

Part of the `premium-website-templates` family. Companion files: `INFORMATION.md` (brand / business / audience), `DESIGN.md` / `DESIGN_MOBILE.md` (visual systems), `SPEC.md` / `SPEC_MOBILE.md` (content + layout).
