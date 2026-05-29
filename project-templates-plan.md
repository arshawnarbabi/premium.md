# Plan — Project Workflow Templates (PROJECT / INFORMATION / SPEC)

> Plan for the second wave of templates that extend the design system into a complete per-project workflow. Captures decisions and structure. Reference this file as you author.

---

## 1. Context

The first wave of templates (`DESIGN_TEMPLATE_WEB.md` and `DESIGN_TEMPLATE_MOBILE.md`) covers the **visual design system** dimension. But a complete per-project AI workflow needs three more concerns:

| Concern | Question it answers | File |
| --- | --- | --- |
| Design | How does anything look and feel? | `DESIGN.md` |
| Content + layout | What is on each page/screen, in what order, with what copy? | `SPEC.md` / `SPEC_MOBILE.md` |
| Business / brand context | Why does this exist? Who is it for? What is the business doing? | `INFORMATION.md` |
| Orchestration | What files exist and in what priority? Project meta. | `PROJECT.md` |

This plan defines the second wave of templates that cover the three remaining concerns plus the orchestration entry point. **Net result: a 6-template per-project workflow.**

---

## 2. Decisions captured

| Decision | Choice |
| --- | --- |
| Repo strategy | Single repo, renamed to `premium-website-templates` (already done) |
| Tech stack default (web) | **React + Next.js (App Router)** + **Tailwind v4** + **shadcn/ui** (dashboards only — not marketing sites) + deploy to **Vercel** |
| Tech stack default (mobile) | **SwiftUI** (iOS) / **Jetpack Compose** (Android), or **React Native / Expo** for cross-platform |
| Common libraries | TypeScript, Framer Motion, Sanity / Contentlayer / MDX (per project), React Hook Form + Zod |
| Icon library | **Variable per project** — declared in PROJECT.md or DESIGN.md, never hardcoded in templates. Recommended options: Lucide (free default), Phosphor (free, 6 weights), **HugeIcons** (premium — 51K icons across 10 styles, free 5K + Pro tier) |
| Voice / brand context | Lives primarily in `INFORMATION.md`. DESIGN.md keeps a brief voice slot for standalone use but cross-references INFORMATION.md when present. |
| Analytics / event tracking | Include in SPEC.md (premium products track conversion events) |
| SEO / OG metadata | Defaults in INFORMATION.md, per-page overrides in SPEC.md |
| Transactional email copy | Include in SPEC.md as a sub-section |
| Anti-features ("what NOT to build") | Include in INFORMATION.md — premium thinking that helps AI not over-build |
| Social handles | Include in INFORMATION.md |
| Naming convention | `<NAME>_TEMPLATE.md` for templates → copied to `<NAME>.md` for project instances |

---

## 3. File-by-file plan

### 3.1 `PROJECT_TEMPLATE.md` — Entry-point orchestration

**Purpose:** the file AI reads first to know what files matter, in what priority, and what kind of project this is.

**Length target:** lightweight (~80–150 lines). This is an index, not a content file.

**Sections:**
1. **Project orientation** — name, one-line description, project type (marketing site / product / mobile app / hybrid), stage
2. **Source-of-truth ordering** — which files to consult and in what priority for each task type
3. **Tech stack declaration** — actual tech for this project (defaults: Next.js + Tailwind + Vercel)
4. **Repository structure** — where key code lives (optional)
5. **AI-agent ground rules** — top-level constraints (deploy target, framework, conventions)
6. **Cross-references** — explicit links to DESIGN.md, INFORMATION.md, SPEC.md

**Slots:**
- Project name, description, type, stage
- Tech stack (with sensible defaults pre-filled)
- File presence flags (which sibling files exist for this project)

### 3.2 `INFORMATION_TEMPLATE.md` — Business / brand / product context

**Purpose:** the complete brand + business + product context, platform-agnostic. Shared between web and mobile instances of a project.

**Length target:** moderate (~600–900 lines). Comprehensive but not bloated.

**Sections:**
1. **Project basics** — name, tagline, mission, vision, stage
2. **People** — founders, team, roles, advisors
3. **Audience** — primary persona (deep: pains/goals/frustrations/jobs-to-be-done), secondary personas, anti-personas
4. **Market** — industry, segment, competitors (direct + indirect + adjacent), positioning, differentiation
5. **Business model** — pricing tiers, revenue streams, key metrics (KPIs), unit economics overview
6. **Brand** — values, voice principles (the canonical brand voice — DESIGN.md references this), personality archetype, brand story / origin
7. **Product** — core capabilities, current features, roadmap (next 3 months + 12 months), explicit non-features ("we will NOT build…")
8. **Operations** — domain(s), hosting, email infra, customer support channels, integrations
9. **Legal / compliance** — entity type, jurisdiction, GDPR / CCPA / HIPAA / SOC2 if applicable, terms / privacy URL
10. **Social presence** — handles (X, LinkedIn, Instagram, YouTube, GitHub), URLs, posting frequency norms
11. **SEO / metadata defaults** — default page title pattern, default meta description, default OG image, default Twitter card
12. **External resources** — links to Figma, Notion, Drive, Slack, Linear, etc.
13. **Brand assets** — logo files (paths or URLs), wordmark, color hex (cross-reference DESIGN.md), font file URLs

**Slots:**
- Many — this is mostly free-form content. Template provides structure + prompting questions, project fills with answers.

### 3.3 `SPEC_TEMPLATE_WEB.md` — Site map + per-page content/layout/copy

**Purpose:** the complete content + layout specification for a web project. Uses DESIGN.md's vocabulary (section types, component names) to specify each page.

**Length target:** larger (~900–1400 lines). Page count and complexity drives size.

**Sections:**
1. **Site map** — all pages, hierarchy, routes (URL paths)
2. **Global elements** — top nav links, footer columns + links, default meta tags, global modals (cookie banner, etc.)
3. **Per-page template** — repeated pattern for each page:
   - Route + meta (title, description, OG)
   - Purpose (why this page exists)
   - Primary user / persona (which from INFORMATION.md)
   - Section sequence (using DESIGN.md vocabulary)
   - Per-section: content / copy / variant choices / media
   - CTA hierarchy
4. **Voice samples** — 5–10 actual sentences in the brand voice (so AI mimics, not invents)
5. **Vocabulary** — preferred terms, banned terms (project-specific additions to DESIGN.md's universal banned list)
6. **Numbers / proof points** — concrete metrics, customer logos, social proof to weave in
7. **Forms** — every form on the site: fields / validation rules / success copy / error copy / placeholder text
8. **System messages** — toast / banner copy library (success / warning / error / info)
9. **Transactional email copy** — welcome, password reset, billing receipts, etc.
10. **Legal pages outline** — privacy policy structure, terms structure, cookie policy (templated)
11. **404 / 500 / maintenance page copy**
12. **Analytics / event tracking** — conversion events to fire and where (e.g., "fire `signup_started` on email submit")
13. **A11y notes per page** — page-specific accessibility considerations beyond the universal DESIGN.md floor

**Slots:**
- Page list (variable per project)
- Section sequence per page
- Actual copy
- Voice samples

### 3.4 `SPEC_TEMPLATE_MOBILE.md` — App map + per-screen content/copy/states

**Purpose:** the complete content + screen-flow specification for a mobile app.

**Length target:** moderate (~700–1100 lines).

**Sections:**
1. **App map** — all screens, hierarchy, deep link URLs
2. **Global elements** — tab bar destinations, top-nav patterns per screen type
3. **Per-screen template** — repeated pattern:
   - Screen name / route / deep link
   - Purpose
   - Primary user / persona (from INFORMATION.md)
   - Layout sections (using DESIGN_MOBILE.md vocabulary)
   - Per-section: content / microcopy / states (loading / empty / error / success)
   - Primary actions
4. **Onboarding sequence** — screen-by-screen, conversion goal at each step
5. **Auth flow copy** — sign-up, sign-in, OAuth, MFA, password reset, account recovery
6. **Permission pre-prompts** — for each permission (camera, mic, notifications, location, contacts, photos): icon + body explanation + primary CTA
7. **Push notification copy** — opt-in pre-prompt + every type of push the app sends
8. **In-app notification copy** — toast / banner / inbox messages
9. **Settings architecture** — sections + items + copy for each toggle / picker
10. **App store metadata** — name, subtitle, description (short + long), keywords, what's-new template, screenshots ordering
11. **System dialogs** — copy for any custom-styled native dialogs (confirmation, destructive actions)
12. **Empty / error states per screen** — first-time, no-data, no-results, offline, error
13. **Analytics events** — track-points and naming conventions

**Slots:**
- Screen list (variable)
- Per-screen copy
- Permission explanations
- Push templates

---

## 4. Template authoring conventions (same as DESIGN templates)

- YAML frontmatter for structured data + Markdown body for rules
- `<slot>` syntax for project fill-ins (greppable: `grep -n "<[^>]*>"`)
- Three-tier content model:
  - **Tier 1** — Universal rules / structure (pre-filled, immutable)
  - **Tier 2** — Sensible defaults (pre-filled, overridable)
  - **Tier 3** — Brand-specific slots (empty `<placeholder>`)
- Token reference syntax: `{group.path}` — refs must resolve to defined YAML paths
- AI Agent Contract section in each template
- Versioning: `template_version: "1.0.0"`
- "How to use" header at top
- Cross-template references go through PROJECT.md, never hardcoded between concern files

---

## 5. Cross-template references

The four new templates plus the two existing design templates form a connected system. References flow like this:

```
PROJECT.md (entry point)
    ↓ declares which files apply
    ├── INFORMATION.md (brand / business / audience)
    │       ↑ referenced by SPEC and DESIGN for voice, audience, brand decisions
    ├── DESIGN.md (visual system)
    │       ↑ provides vocabulary (section types, components) consumed by SPEC
    └── SPEC.md or SPEC_MOBILE.md (content + layout)
            ↑ references DESIGN vocabulary; references INFORMATION audience/voice
```

No file references another file's *internals* directly. They reference each other by file name and the AI is expected to consult them. Loose coupling.

---

## 6. DESIGN.md template updates needed

While building the new templates, also update `DESIGN_TEMPLATE_WEB.md` and `DESIGN_TEMPLATE_MOBILE.md`:

- [ ] Add **HugeIcons** as a premium icon library option alongside Lucide / Phosphor / Heroicons (note it has free 5K + Pro 51K / 10 styles)
- [ ] Clarify that **shadcn/ui is for product / dashboard contexts, not marketing sites**
- [ ] Reaffirm React + Next.js + Vercel as the recommended default stack
- [ ] Cross-reference INFORMATION.md for the canonical voice descriptor (DESIGN's voice slot becomes "see INFORMATION.md when present")

---

## 7. Authoring sequence

1. ✅ Write this plan
2. Author `INFORMATION_TEMPLATE.md` first (other files reference its slots)
3. Author `SPEC_TEMPLATE_WEB.md`
4. Author `SPEC_TEMPLATE_MOBILE.md`
5. Author `PROJECT_TEMPLATE.md` last (orchestrates the others; needs them defined to reference)
6. Apply DESIGN updates (HugeIcons mention, voice cross-ref)
7. Iterative verification passes — YAML parse, ref resolution, cross-template alignment — until diminishing returns (probably 2-3 passes)
8. Update README to reflect 6-template scope
9. Push all to `premium-website-templates` repo

---

## 8. Verification checklist for each template

After authoring each, verify:
- [ ] YAML frontmatter parses cleanly
- [ ] All `<slot>` placeholders are intentional and clearly labeled
- [ ] All `{group.path}` token references resolve to defined YAML paths
- [ ] Section ordering is logical
- [ ] AI Agent Contract section is present
- [ ] "How to use" header explains instantiation
- [ ] No brand-name competitor leaks in prose
- [ ] Cross-template references go through file names, not internal paths

---

## 9. Open questions deferred to per-project instantiation

Same pattern as DESIGN templates — items the project must answer that no template default can guess:

- Specific audience / persona descriptions
- Specific competitive positioning
- Specific copy / content
- Specific event-tracking schema
- Specific legal jurisdiction requirements

These show as `<slot>` placeholders in the templates.

---

## 10. Deliverables

| File | Status | Notes |
| --- | --- | --- |
| `project-templates-plan.md` | ✅ This file | Reference during build |
| `INFORMATION_TEMPLATE.md` | Pending | Build #1 |
| `SPEC_TEMPLATE_WEB.md` | Pending | Build #2 |
| `SPEC_TEMPLATE_MOBILE.md` | Pending | Build #3 |
| `PROJECT_TEMPLATE.md` | Pending | Build #4 |
| `DESIGN_TEMPLATE_WEB.md` | Existing — patch needed | Add HugeIcons + voice cross-ref |
| `DESIGN_TEMPLATE_MOBILE.md` | Existing — patch needed | Same |
| `README.md` | Existing — rewrite needed | Reflect 6-template scope |
