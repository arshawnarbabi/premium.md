---
# ─────────────────────────────────────────────────────────────
# CONTENT_TEMPLATE.md — Reusable content model (single source of content truth)
# Version: 1.21.0
# Scope: web + mobile. Typed, reusable content RECORDS the AI maintains ONCE and
#        pages REFERENCE — so a testimonial, stat, or FAQ lives in exactly one place.
# Companions: SPEC.md / SPEC_MOBILE.md (pages reference these records), INFORMATION.md
#            (brand voice the content is written in), SEO.md (GEO uses these stats/quotes).
#
# WHAT THIS FILE IS:
# Pages used to embed their own testimonials, metrics, and FAQ copy inline — so the same
# customer quote drifted across the homepage, a case-study page, and an ad. This file is
# the content layer of the system: every reusable fact (quotes, stats, features, FAQs,
# team, case studies, integrations, pricing) is a record with an `id`. Pages reference
# records with `{content.path}` — the SAME mechanism as design tokens (`{colors.primary.9}`).
# Edit the fact here once; every page that references it updates.
#
# HOW TO USE:
# 1. Copy this file to your project as `CONTENT.md`.
# 2. Fill only the record types you actually have (delete the rest). Real, approved data only.
# 3. In SPEC pages, reference records by path — never paste a quote/stat/FAQ inline again.
# ─────────────────────────────────────────────────────────────

# ─── STATUS MARKERS — every value's state stays trackable (authoritative spec: PROJECT.md → §Status protocol) ───
# An inline comment on a value marks its state; unmarked + filled = "given" (the user's own input).
#   <slot>/<TBD> = unfilled · # draft = AI-inferred, needs approval · # default = out-of-box default,
#   not consciously chosen · # approved = signed off · # locked = approved + logged in DECISIONS.md.
# Rule: the AI never writes an inferred value without `# draft`, nor accepts a default without `# default`
# — so an unmarked filled value is, by construction, the user's. Nothing fabricated slips through unverified.

template_version: "1.21.0"
file_role: "content"   # information | design | spec | project | content | seo | qa | decisions

# Each record is a list item with a stable `id` (kebab or snake). Pages reference fields:
#   {content.testimonials.maria.quote}   {content.stats.active_teams.value}   {content.faqs.refunds.answer}
# Reference a whole record's fields individually — refs resolve to strings, not objects.

# ── Customer proof: quotes pages can cite anywhere ──
testimonials:
  - id: "maria"                       # → {content.testimonials.maria.*}
    quote: "<actual customer quote — real + approved, never invented>"
    name: "<Maria López>"
    role: "<Head of Ops>"
    company: "<Acme>"
    photo: "<path/url or omit>"
    permission: "<true | source link>"  # written permission to use the quote + name

# ── Headline numbers (GEO citability + trust strip). Real, verifiable only. ──
stats:
  - id: "active_teams"                # → {content.stats.active_teams.*}
    value: "<10,000+>"
    label: "<active teams>"
    source: "<internal dashboard / audited report — for GEO inline citation>"
    as_of: "<YYYY-MM-DD>"             # freshness; feeds SEO.md last_reviewed

# ── Product features (referenced by feature grids / bento / comparison pages) ──
features:
  - id: "realtime_sync"              # → {content.features.realtime_sync.*}
    name: "<Realtime sync>"
    summary: "<one-sentence benefit, in brand voice>"
    icon: "<icon name from DESIGN icon family>"
    detail: "<optional longer description for a detail page>"

# ── FAQs (referenced by FAQ sections AND emitted as FAQPage schema per SEO.md) ──
faqs:
  - id: "refunds"                    # → {content.faqs.refunds.*}
    question: "<Do you offer refunds?>"
    answer: "<Concise, answer-first response — also feeds AEO + FAQPage JSON-LD.>"

# ── Team / authors (referenced by About + Person schema for E-E-A-T per SEO.md) ──
team_members:
  - id: "founder"                    # → {content.team_members.founder.*}
    name: "<Full Name>"
    role: "<Co-founder & CEO>"
    bio: "<short bio>"
    photo: "<path/url>"
    sameAs: "<profile URL — matches INFORMATION.social for entity consistency>"

# ── Case studies (referenced by case-study pages + nav cards) ──
case_studies:
  - id: "acme"                       # → {content.case_studies.acme.*}
    customer: "<Acme>"
    headline: "<outcome in one line>"
    metric: "<the proof number — should also exist in stats[] if cited elsewhere>"
    summary: "<2-3 sentence story, brand voice>"
    url: "<slug or external link>"

# ── Integrations / partners (logo walls, integration pages) ──
integrations:
  - id: "slack"                      # → {content.integrations.slack.*}
    name: "<Slack>"
    logo: "<path/url>"
    category: "<messaging>"

# ── Pricing tiers (referenced by pricing page + Product/Offer schema per SEO.md) ──
pricing_tiers:
  - id: "pro"                        # → {content.pricing_tiers.pro.*}
    name: "<Pro>"
    price: "<$29>"
    cadence: "<per seat / month>"
    summary: "<who it's for>"
    features: ["<{content.features.realtime_sync.name}>", "<…>"]   # reference feature records
    cta: "<Start free trial>"

# ── Customer logos + press (migrated from the old SPEC.proof_points) ──
notable_customers:
  - { id: "acme", name: "<Company>", logo: "<path/url>", permission: "<true | link>" }
press_mentions:
  - { id: "techcrunch", publication: "<Publication>", quote: "<short pull-quote>", url: "<URL>" }

---

# The content model

Reusable content **facts** — customer quotes, headline stats, features, FAQs, team bios, case studies, integrations, pricing — live here as typed **records**, each with a stable `id`. Pages reference them; they are never pasted inline. This is the content layer that keeps the same testimonial or metric identical everywhere it appears.

## How pages reference content
Same `{group.path}` mechanism as design tokens. In a SPEC page:

```yaml
sections:
  - type: "testimonial"
    quote: "{content.testimonials.maria.quote}"
    name:  "{content.testimonials.maria.name}"
  - type: "stat_strip"
    items: ["{content.stats.active_teams.value} {content.stats.active_teams.label}"]
```

Reference **fields**, not whole records (refs resolve to strings). Edit the record here once → every referencing page updates.

## Resolving content in code (the code layer)
The `{content.*}` convention has a **code-layer equivalent** — honor it the same way exported design tokens are honored. When you build actual components, content records resolve through a **content module**, never as inline string literals:

- Maintain a single content module (e.g. `lib/content.ts`) that mirrors `CONTENT.md` and exports typed records — the content analog of the exported design tokens.
- Components **import** from it; they never hardcode a quote, stat, FAQ, or feature string:

```tsx
// ✅ correct — {content.testimonials.jordan.quote} maps to a named import
import { TESTIMONIALS, STATS } from "@/lib/content";
const jordan = TESTIMONIALS.find((t) => t.id === "jordan")!;
// <blockquote>{jordan.quote}</blockquote>

// ❌ wrong — inlines content as a const / default prop literal (drifts from CONTENT.md)
const QUOTE = "…the actual quote text…";
```

**No carve-outs:** this includes component **default prop values** and "standalone demo" defaults — those still hardcode content and drift. If a component needs isolated demo data, put it in a separate story/fixture file, never in the production component. The rule mirrors token fidelity exactly: colors come from exported tokens (never `#hex`); content comes from the content module (never inline strings).

## One home for every fact (single-source rule)
A content fact lives in **exactly one** record. SPEC pages **reference** it; they don't restate it. This replaces the old `SPEC.proof_points.testimonial_library` / `trust_metrics` (now references into `CONTENT.md`). If a number appears in both a case study and a stat strip, it's **one** `stats[]` record referenced twice — not two copies that can drift.

## Voice + truth
- Content copy is written in the brand voice (`INFORMATION.md` voice principles + samples) — the same rules as page copy.
- **Real, approved data only.** Never invent quotes, names, metrics, or logos. Quotes/logos need `permission`. If a needed fact doesn't exist yet, leave the placeholder and flag it — don't fabricate.
- Records feed other layers: `stats[]`/`testimonials[]` are GEO citability signals (SEO.md), `faqs[]` emit FAQPage schema, `team_members[]` emit Person/E-E-A-T schema, `pricing_tiers[]` feed Product/Offer schema.

# AI Agent Contract (content)
1. **Maintain each fact once.** New testimonial/stat/FAQ → add a record here; pages reference it. Never paste content inline in a page when a record exists.
2. **Reference, don't duplicate.** SPEC pages use `{content.*}` refs. In **code**, components import records from a content module (`lib/content.ts`) — never hardcode a content string as a const or **default prop value** (including "standalone demo" defaults). If you find the same fact in two files, consolidate to one record and reference it.
3. **Never invent** quotes, names, numbers, logos, or press. Real + approved only; honor `permission`. Surface gaps, don't fill them.
4. **Keep entity-consistent** with INFORMATION (names, `sameAs`) — GEO/E-E-A-T depend on it.
5. **Stamp `as_of`/freshness** on stats so SEO.md freshness + quarterly review can act on them.

# Versioning
`template_version: 1.21.0`. Per-project `CONTENT.md` instances should preserve this field.

# Source
Content-modeling practice (typed, reusable content types referenced by pages — the headless-CMS pattern, applied as a markdown layer). Generalizes the existing `SPEC.proof_points` record pattern. See `docs/SYSTEM_RESEARCH.md` (F7). Voice lives in `INFORMATION.md`; pages that reference these records live in `SPEC.md` / `SPEC_MOBILE.md`; discoverability use in `SEO.md`.
