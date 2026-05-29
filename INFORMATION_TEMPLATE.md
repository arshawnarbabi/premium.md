---
# ─────────────────────────────────────────────────────────────
# INFORMATION_TEMPLATE.md — Project / brand / business context
# Version: 1.0.0
# Scope: shared between web and mobile (the business is the same)
# Companions: DESIGN_TEMPLATE_*.md (visual system) + SPEC_TEMPLATE_*.md (content)
#
# HOW TO USE:
# 1. Copy this file to your project as `INFORMATION.md`.
# 2. Fill every `<slot>` value. Greppable: `grep -n "<[^>]*>" INFORMATION.md`
#    should return zero results once instantiation is complete.
# 3. Whenever a field doesn't apply, write `n/a` rather than leaving the slot.
# 4. This file is the canonical source for brand voice, audience, business
#    context. DESIGN.md and SPEC.md reference this file rather than restating.
# ─────────────────────────────────────────────────────────────

template_version: "1.2.1"
file_role: "information"   # information | design | spec | project

# ═══════════════════════════════════════════════════════════════
# PROJECT BASICS
# ═══════════════════════════════════════════════════════════════

project:
  name: "<Project / Brand Name>"
  legal_name: "<Legal entity name if different from brand name, else same>"
  tagline: "<5-9 word memorable tagline>"
  one_liner: "<one full sentence describing what this is and what it does>"
  elevator_pitch: "<2-3 sentence pitch — problem + solution + who it's for>"
  mission: "<the why — what change in the world this is trying to create>"
  vision: "<long-term north star — where this is going in 5-10 years>"
  stage: "<idea | pre-launch | beta | launched | scaling | mature>"
  founded: "<YYYY-MM>"
  hq_location: "<City, Country — or 'remote-first'>"

# ═══════════════════════════════════════════════════════════════
# PEOPLE
# ═══════════════════════════════════════════════════════════════

people:
  founders:
    - name: "<Full Name>"
      role: "<Co-founder, CEO | Co-founder, CTO | etc.>"
      bio: "<2-3 sentence bio>"
      linkedin: "<URL or n/a>"
      twitter: "<@handle or n/a>"
  team:
    - name: "<Full Name>"
      role: "<role>"
      bio: "<1-2 sentence bio>"
  advisors:
    - name: "<Full Name>"
      role: "<advisor role / focus area>"

# ═══════════════════════════════════════════════════════════════
# AUDIENCE (the most important section — fill thoroughly)
# ═══════════════════════════════════════════════════════════════

audience:
  primary_persona:
    name: "<Persona name — e.g., 'Solo founder Sarah'>"
    one_line: "<one-sentence portrait>"
    demographics:
      age_range: "<25-34>"
      role: "<job title or life role>"
      income_range: "<$X-$Y>"
      location: "<urban US/EU | global | etc.>"
      tech_savviness: "<low | medium | high | power user>"
    psychographics:
      values: "<what they care about — 3-5 short phrases>"
      aspirations: "<who they want to become>"
      fears: "<what keeps them up at night relevant to this product>"
    jobs_to_be_done:
      - "<concrete job: 'when I X, I want to Y, so I can Z'>"
      - "<another>"
    pains:
      - "<specific pain this product addresses>"
      - "<another>"
    current_alternatives: "<what they use today instead — even if it's spreadsheets / nothing>"
    triggers: "<the event or moment that makes them seek this kind of product>"
    success_definition: "<what does success look like in their words?>"
    where_they_hang_out:
      online: "<Reddit r/X | Twitter | LinkedIn | specific Discord servers>"
      offline: "<conferences | meetups | n/a>"
    voice_they_respond_to: "<casual / professional / technical / inspirational — match this in copy>"

  secondary_personas:
    - name: "<Secondary persona — e.g., 'Series A founder considering scaling'>"
      one_line: "<one-sentence portrait>"
      relationship_to_primary: "<adjacent / power-user evolution / decision-maker influencer>"

  anti_personas:
    # Who this product is explicitly NOT for. Equally important for AI not to
    # over-broaden positioning.
    - name: "<Anti-persona — e.g., 'Enterprise procurement'>"
      why_not: "<reason this product isn't for them — too expensive / too simple / wrong workflow>"

# ═══════════════════════════════════════════════════════════════
# MARKET
# ═══════════════════════════════════════════════════════════════

market:
  industry: "<primary industry — e.g., 'B2B SaaS / Developer Tools'>"
  segment: "<sub-segment — e.g., 'Code quality and CI/CD tooling'>"
  market_size:
    tam: "<total addressable market — e.g., '$50B' or n/a>"
    sam: "<serviceable addressable market — n/a if not measured>"
    som: "<serviceable obtainable market — n/a if not measured>"
  competitors:
    direct:
      - name: "<Competitor name>"
        url: "<URL>"
        differentiator: "<how we differ — one sentence>"
    indirect:
      - name: "<Competitor name>"
        url: "<URL>"
        differentiator: "<how we differ>"
    adjacent:
      - name: "<Adjacent product>"
        differentiator: "<how this is solving similar pain differently>"
  positioning:
    statement: "<For [audience] who [pain], [product] is the [category] that [unique benefit] unlike [alternatives] because [reason to believe].>"
    category: "<the category we're claiming or creating>"
    differentiation_axis: "<the single most important axis on which we differ — speed | depth | price | UX | philosophy>"

# ═══════════════════════════════════════════════════════════════
# BUSINESS MODEL
# ═══════════════════════════════════════════════════════════════

business_model:
  type: "<SaaS | marketplace | transactional | freemium | open-source + commercial | usage-based>"
  pricing_tiers:
    - name: "<tier name — e.g., 'Free'>"
      price: "<$0 / month>"
      target: "<who this tier is for>"
      key_features: "<comma-separated list>"
    - name: "<Pro>"
      price: "<$X / month>"
      target: "<who>"
      key_features: "<features>"
    - name: "<Enterprise>"
      price: "<custom>"
      target: "<who>"
      key_features: "<features>"
  revenue_streams:
    - "<primary stream — e.g., 'Pro / Enterprise subscriptions'>"
    - "<secondary — e.g., 'Usage overage'>"
  key_metrics:
    - "<MRR>"
    - "<ARR>"
    - "<Active users / DAU / WAU / MAU>"
    - "<Conversion rate sign-up → paid>"
    - "<Churn rate>"
    - "<NPS>"
  unit_economics_summary: "<1-2 sentence summary if known — CAC, LTV, payback period, gross margin>"

# ═══════════════════════════════════════════════════════════════
# BRAND (canonical brand voice — DESIGN.md and SPEC.md reference this)
# ═══════════════════════════════════════════════════════════════

brand:
  values:
    - "<value 1 — e.g., 'Craft over speed'>"
    - "<value 2>"
    - "<value 3>"
    # 3-5 max — more is noise
  personality:
    archetype: "<one of: Sage | Hero | Creator | Caregiver | Innocent | Explorer | Rebel | Magician | Ruler | Lover | Jester | Everyman>"
    tone_descriptors:
      - "<adjective 1 — e.g., 'warm'>"
      - "<adjective 2 — e.g., 'confident'>"
      - "<adjective 3 — e.g., 'plain-spoken'>"
      # 3-5 — match the brand
    formality_level: "<casual | semi-formal | formal>"
    energy_level: "<calm | balanced | energetic>"
    serious_to_playful_axis: "<0-10 — 0 = very serious, 10 = very playful>"

  voice_principles:
    # The 4 universal voice invariants from DESIGN.md, with project-specific application
    active_voice_example: "<concrete example sentence in this brand's voice>"
    concise_example: "<concrete example>"
    human_example: "<concrete example>"
    specific_example: "<concrete example>"

  vocabulary:
    preferred_terms:
      - "<use this: 'X' (not 'Y')>"
      - "<use this: 'A' (not 'B')>"
    banned_terms_project_specific:
      # Beyond DESIGN.md's universal banned list, project-specific avoidances
      - "<term to never use in this brand's copy>"

  story:
    origin: "<2-3 sentence founder origin story>"
    why_now: "<why is this the right time for this product?>"
    why_us: "<what unique insight or capability makes us the right team?>"

# ═══════════════════════════════════════════════════════════════
# PRODUCT
# ═══════════════════════════════════════════════════════════════

product:
  core_capabilities:
    # The 3-7 things this product fundamentally does
    - capability: "<short verb-phrase — e.g., 'Track product analytics'>"
      description: "<1-2 sentence elaboration>"
    - capability: "<another>"
      description: "<elaboration>"
  current_features:
    # Everything shipping today, grouped by capability if helpful
    - "<feature 1>"
    - "<feature 2>"
  roadmap:
    next_3_months:
      - "<feature or initiative shipping soon>"
    next_12_months:
      - "<larger initiative>"
  non_features:
    # CRITICAL — what we explicitly DO NOT build. Prevents AI from over-broadening
    # the product surface and prevents scope drift.
    - "<we don't do X because Y>"
    - "<we don't do Z because reason>"

# ═══════════════════════════════════════════════════════════════
# OPERATIONS
# ═══════════════════════════════════════════════════════════════

operations:
  domains:
    primary: "<example.com>"
    docs: "<docs.example.com or n/a>"
    blog: "<example.com/blog or blog.example.com>"
    status: "<status.example.com or n/a>"
  hosting:
    web: "<Vercel | Netlify | Cloudflare | AWS | other>"
    db: "<Postgres on Neon | Supabase | PlanetScale | etc.>"
    file_storage: "<Cloudflare R2 | S3 | Vercel Blob>"
  email:
    transactional: "<Resend | Postmark | SendGrid>"
    marketing: "<Loops | Resend Audiences | Customer.io | n/a>"
    from_address_default: "<hello@example.com>"
  support:
    primary_channel: "<email | Intercom | Slack | community Discord>"
    response_sla: "<24h business hours | best-effort | n/a>"
    docs_url: "<docs URL>"
  integrations:
    # Other services this product talks to
    - "<service name + purpose>"

# ═══════════════════════════════════════════════════════════════
# LEGAL / COMPLIANCE
# ═══════════════════════════════════════════════════════════════

legal:
  entity_type: "<LLC | C-Corp | sole proprietorship | other>"
  jurisdiction: "<Delaware, USA | UK Ltd | other>"
  privacy_url: "<example.com/privacy>"
  terms_url: "<example.com/terms>"
  cookie_policy_url: "<example.com/cookies or n/a if no cookies>"
  compliance_requirements:
    - "<GDPR | CCPA | HIPAA | SOC2 | none>"
  data_collection_summary: "<one paragraph — what user data is collected and why>"
  data_retention_policy: "<summary or n/a>"

# ═══════════════════════════════════════════════════════════════
# SOCIAL PRESENCE
# ═══════════════════════════════════════════════════════════════

social:
  twitter:
    handle: "<@handle or n/a>"
    url: "<https://twitter.com/handle>"
  linkedin:
    company_url: "<URL>"
  instagram:
    handle: "<@handle or n/a>"
    url: "<URL or n/a>"
  youtube:
    channel_url: "<URL or n/a>"
  github:
    org_url: "<URL or n/a>"
    public_repos: "<list if relevant — open-source projects>"
  product_hunt:
    url: "<URL or n/a>"
  posting_norms:
    frequency: "<daily | weekly | sporadic | none>"
    voice_match: "same as `brand.voice_principles`"

# ═══════════════════════════════════════════════════════════════
# SEO / METADATA DEFAULTS (per-page overrides live in SPEC.md)
# ═══════════════════════════════════════════════════════════════

seo:
  default_page_title_pattern: "<%page% — %brand_name%>"     # e.g., "Pricing — Acme"
  homepage_title: "<%brand_name% — %tagline%>"
  default_meta_description: "<150-160 char default description — used when page-specific one isn't provided>"
  default_og_image: "<URL or path — recommended 1200×630 px>"
  default_twitter_card_type: "<summary_large_image | summary>"
  default_locale: "<en_US>"
  alternate_locales:
    - "<en_GB | es_ES | ...>"
  canonical_domain: "<example.com — for canonical URL generation>"
  robots_default: "<index, follow>"
  sitemap_url: "<example.com/sitemap.xml>"

# ═══════════════════════════════════════════════════════════════
# EXTERNAL RESOURCES (links to where things live)
# ═══════════════════════════════════════════════════════════════

resources:
  figma: "<URL>"
  notion_workspace: "<URL or n/a>"
  google_drive: "<URL or n/a>"
  slack_workspace: "<URL or n/a>"
  linear_workspace: "<URL or n/a>"
  github_repo: "<URL>"
  staging_environment: "<URL or n/a>"
  analytics_dashboard: "<URL — PostHog / Plausible / Mixpanel etc.>"
  monitoring_dashboard: "<URL — Sentry / Datadog / etc.>"
  brand_guidelines_doc: "<URL or 'see DESIGN.md'>"

# ═══════════════════════════════════════════════════════════════
# BRAND ASSETS
# ═══════════════════════════════════════════════════════════════

assets:
  logo:
    primary: "<path/url — the main logo>"
    wordmark: "<path/url — text-only version>"
    icon_only: "<path/url — the mark without text>"
    light_mode_variant: "<path/url>"
    dark_mode_variant: "<path/url>"
    minimum_size_px: 24
    clear_space_rule: "<minimum padding around logo = X% of logo height>"
  favicon:
    ico: "<path>"
    svg: "<path>"
    apple_touch: "<path 180×180>"
  social_share_default: "<path to default OG image 1200×630>"
  brand_colors_reference: "see DESIGN.md → colors.primary, colors.neutral"
  brand_fonts_reference: "see DESIGN.md → typography.families"

---

# How to use this template

`INFORMATION.md` is the **canonical source of brand, business, audience, and product context** for any project. It is platform-agnostic — the same `INFORMATION.md` serves both web and mobile work.

**Instantiation steps:**

1. Copy this file to your project as `INFORMATION.md`.
2. Fill every `<slot>`. Verify with `grep -n "<[^>]*>" INFORMATION.md` — zero matches means complete.
3. For sections that genuinely don't apply (no advisors yet, no Android app planned, etc.), write `n/a` rather than leaving the slot. This signals "intentionally empty" to the AI and prevents it from inventing.
4. Treat the **Audience** section as the most important. Premium products are built on deep audience understanding. Spend disproportionate time here.
5. Hand `INFORMATION.md` alongside `DESIGN.md` and `SPEC.md` to any AI tool building your product.

## Guided fill-in mode (v1.2+) — deterministic intake protocol

> **AI behavior rule — read carefully.**
> When the user asks ANY of the following (or close variations), STOP, do NOT summarize, do NOT give a status report, do NOT improvise your own question list. OUTPUT THE BLOCK BELOW VERBATIM with `?` markers left as-is for the user to fill:
>
> - *"help me populate this"* / *"help me fill this in"*
> - *"what do you need to know?"* / *"what do I need to tell you?"*
> - *"run the intake"* / *"give me the questions"*
> - *"walk me through this"* / *"how do I fill this in?"*
> - *"what's missing in this file?"* / *"what's left to fill in?"* / *"what else needs to be done?"*
> - any close variation indicating the user wants to know what to populate
>
> If `PROJECT.md` is present, use its full Interactive Population Protocol instead. The block below is the single-template fallback scoped to `INFORMATION.md` alone.
>
> **Partial-fill state:** If the user has already filled some `<slot>` values, read the file first, then EXCLUDE filled items from PART 1 — only list remaining unfilled items.
>
> **No brand context provided:** Still produce the intake exactly as below — leave `?` markers. The user will provide context in their reply.

### OUTPUT THIS BLOCK VERBATIM when triggered (do not paraphrase, do not summarize, do not rewrite)

```
# Intake — INFORMATION.md

This is everything you need to decide to fully populate your brand / business / audience context file.

Reply with answers numbered, freeform, or both — I'll figure it out. Say "skip [section]" for anything that doesn't apply. I'll fill the template as your answers come in and run final verification at the end.

## PART 1 — Must Fill (no defaults possible)

### Project basics
1. **Brand name** + legal entity name (if different): ?
2. **Tagline** (5-9 word memorable line): ?
3. **One-line description** (what it is, what it does): ?
4. **Elevator pitch** (2-3 sentences — problem + solution + who it's for): ?
5. **Mission** (the why — what change you're creating): ?
6. **Vision** (long-term north star): ?
7. **Stage** (idea / pre-launch / beta / launched / scaling / mature): ?
8. **Founded** date (YYYY-MM) + HQ location (or "remote-first"): ?

### People
9. **Founders** — for each: full name, role, 1-2 sentence bio, LinkedIn + Twitter: ?
10. **Team members** (optional — name, role, 1-2 sentence bio): ?
11. **Advisors** (optional — name + focus area): ?

### Audience (the most important section)
12. **Primary persona** — name + one-line portrait + demographics + psychographics + jobs-to-be-done + pains + current alternatives + triggers + success definition + where they hang out + voice they respond to: ?
13. **Secondary personas** (optional, 1-2): ?
14. **Anti-personas** — at least one: who this is explicitly NOT for + why not: ?

### Market
15. **Industry + segment**: ?
16. **Direct + indirect + adjacent competitors** (with URLs + how you differ): ?
17. **Positioning statement** (For [audience] who [pain], [product] is the [category] that [unique benefit] unlike [alternatives] because [reason]): ?
18. **Differentiation axis** (speed / depth / price / UX / philosophy / etc.): ?

### Business model
19. **Type** (SaaS / marketplace / freemium / etc.): ?
20. **Pricing tiers** (name, price, target, key features for each): ?
21. **Revenue streams** + **key metrics tracked**: ?

### Brand
22. **Values** (3-5 max): ?
23. **Brand archetype** (Sage / Hero / Creator / Caregiver / Innocent / Explorer / Rebel / Magician / Ruler / Lover / Jester / Everyman): ?
24. **Tone descriptors** (3-5 adjectives) + formality + energy + serious-to-playful axis (0-10): ?
25. **Voice principles** — concrete example sentences for active voice, conciseness, humanity, specificity: ?
26. **Vocabulary** — preferred terms + project-specific banned terms beyond DESIGN.md universal list: ?
27. **Brand story** (origin, why now, why us): ?

### Product
28. **Core capabilities** (3-7 things the product does): ?
29. **Current features** (everything shipping today): ?
30. **Roadmap** (next 3 months + 12 months): ?
31. **Non-features** — at least 2 things you explicitly will NOT build: ?

### Operations
32. **Domain(s)** — primary, docs, blog, status: ?
33. **Hosting** (web framework + db + storage): ?
34. **Email infrastructure** (transactional + marketing): ?
35. **Support channel** + response SLA: ?
36. **Integrations** with other services: ?

### Legal
37. **Entity type + jurisdiction**: ?
38. **Privacy + terms + cookie policy URLs** (or "TBD"): ?
39. **Compliance requirements** (GDPR / CCPA / HIPAA / SOC2 / none): ?

### Social presence
40. **Handles + URLs** for Twitter, LinkedIn, Instagram, YouTube, GitHub, Product Hunt: ?
41. **Posting norms** (frequency + voice match): ?

### SEO defaults
42. **Default page title pattern** (e.g., "{page} — {brand}"): ?
43. **Default meta description** (150-160 chars): ?
44. **Default OG image path** (1200×630): ?
45. **Canonical domain + sitemap URL**: ?

### External resources + brand assets
46. **Resource URLs** (Figma / Notion / Drive / Slack / Linear / staging / analytics / monitoring): ?
47. **Logo + favicon + social-share image paths**: ?

## PART 2 — Customizable Defaults
INFORMATION.md has no defaults to customize — every slot is project-specific. Skip directly to answers.

## PART 3 — When you reply

I'll:
1. Apply your answers to INFORMATION.md
2. If you said "draft them" for voice principles, draft 4 example sentences from your archetype + tone descriptors and surface for approval
3. Run grep verification: `grep -n "<[^>]*>" INFORMATION.md` — zero matches confirms complete
4. Surface any remaining `<TBD>` placeholders for follow-up
5. Offer next steps (populate companion DESIGN.md / SPEC.md, generate sitemap from product description, etc.)
```

The AI MUST produce this output in full (or, if filling a partially-populated INFORMATION.md, EXCLUDE already-filled items from PART 1 and only ask about gaps). Never improvise the format.

---

# AI Agent Contract

When generating content, code, or design that touches voice, audience, business positioning, or brand expression, an AI agent **must** follow these rules:

1. **`INFORMATION.md` is canonical for brand voice.** When the project's voice descriptor is needed, read it here — not from `DESIGN.md`'s Overview slot (which is a fallback for projects without an `INFORMATION.md`).
2. **The primary persona drives copy decisions.** When writing marketing or product copy, mentally test against the primary persona's vocabulary, fears, and jobs-to-be-done.
3. **Anti-personas are real constraints.** If a feature, copy, or design decision would serve an anti-persona at the expense of the primary, it's wrong. Cite the anti-persona when explaining why.
4. **The non-features list is binding.** Never propose product features that are explicitly in `product.non_features`. If a user request implies a non-feature, surface the conflict rather than building it.
5. **Concrete proof points beat abstract claims.** Use `business_model.key_metrics`, customer quotes, and `market.competitors` as raw material for trust signals. Never invent numbers.
6. **Honor the brand archetype.** Voice / copy / illustration choices should consistently express the chosen archetype. Mixing archetypes reads as confused.
7. **Cross-reference `DESIGN.md` for visual decisions.** This file describes *what* the brand is; `DESIGN.md` describes *how it looks*. Don't restate visual decisions here.
8. **Cross-reference `SPEC.md` for specific page/screen content.** This file holds defaults (default OG image, default page title pattern); per-page specifics live in `SPEC.md`.
9. **Compliance requirements are non-negotiable.** Features that touch user data must respect declared compliance frameworks (GDPR, CCPA, HIPAA, etc.). Surface conflicts rather than silently violate.
10. **When information is missing, ask — don't invent.** If a slot is `<unfilled>` or essential context is absent, surface the gap to the user rather than fabricating brand identity, audience details, or business metrics.

---

# Filling in this template — guidance by section

The YAML frontmatter is the source of truth. This Markdown body explains *how to fill it well* and what good vs lazy answers look like.

## Project basics

Be precise. A vague `one_liner` cascades into vague copy everywhere downstream. Spend time crafting one sentence that a stranger could read and understand exactly what the product is and who it's for.

**Lazy:** "Acme is a powerful, all-in-one platform that empowers teams."
**Better:** "Acme is a billing system for B2B SaaS companies that handle complex enterprise contracts."

The `mission` answers *why does this exist*, not *what does it do*. These are different questions. A clear mission survives strategy pivots.

The `stage` matters because copy in pre-launch differs from copy in mature stage. Pre-launch emphasizes vision; mature emphasizes credibility.

## People

Real names, real bios. Premium products earn trust by being made by real, accountable people. Fictionalized teams read as scammy.

When the team is solo or two-person, say so. Premium products don't need to fake size — small teams are often a positioning advantage ("hand-crafted by 3 engineers in Brooklyn").

## Audience (the most important section)

Fill this in detail. AI generates dramatically better copy when audience is concrete. Two specific tactics:

- **Name the persona.** "Sarah, a solo SaaS founder" beats "small business owner." A name anchors the imagination.
- **Use the persona's actual words.** Listen to user calls, scrape Reddit threads, read your support tickets — and capture the literal phrases your users use. These become your copy.

The `jobs_to_be_done` framing is critical. The Christensen formulation: "When I [context], I want to [goal], so I can [outcome]." Don't skip the outcome — that's the emotional payoff the copy must promise.

`anti_personas` matter as much as primary. Defining who the product isn't for prevents:
- Feature creep toward serving everyone
- Copy that dilutes positioning
- AI generating "designed for everyone" marketing language (which speaks to no one)

## Market

`positioning.statement` should follow the classic positioning formula (Geoffrey Moore). Premium products commit to a specific position rather than hedging. "For developers who want fewer abstractions, Acme is the deployment platform that gives you raw Linux access, unlike Vercel or Heroku which abstract everything, because some workloads need control."

`competitors.adjacent` is often the most useful entry — products in different categories that solve similar pain. Knowing them prevents accidental category collision.

## Business model

Be honest about pricing. If you don't know yet, write `<undecided>` not a fake number. AI references prices when writing pricing-page copy — fake numbers cascade.

`key_metrics` doesn't need values; the metrics themselves are what matter. Knowing the product cares about MRR vs DAU vs NPS shapes the analytics events SPEC.md will define.

## Brand

The `archetype` (drawing from Jungian / Margaret Mark's *The Hero and the Outlaw*) is shorthand for personality. Pick one and commit. Mixed archetypes confuse copy generation.

**Archetype quick-reference:**
- **Sage** — wisdom, truth, depth (Google, NYT, IBM, McKinsey)
- **Hero** — courage, mastery, achievement (Nike, BMW, FedEx)
- **Creator** — imagination, expression, originality (Apple, Lego, Adobe)
- **Caregiver** — service, compassion, generosity (Johnson & Johnson, UNICEF)
- **Innocent** — simplicity, optimism, purity (Coca-Cola, Dove)
- **Explorer** — freedom, discovery, adventure (Patagonia, Jeep, REI)
- **Rebel** — disruption, revolution, change (Harley-Davidson, Diesel)
- **Magician** — transformation, vision, wonder (Disney, Tesla)
- **Ruler** — control, authority, premium (Mercedes-Benz, Rolex)
- **Lover** — passion, intimacy, sensuality (Victoria's Secret, Chanel)
- **Jester** — humor, fun, lightness (Old Spice, M&Ms, Geico)
- **Everyman** — belonging, reliability, accessibility (IKEA, Levi's, Target)

`voice_principles` examples should be **actual sentences** the brand would write — not abstract descriptions. AI mimics these directly.

`vocabulary.preferred_terms` should capture the small but meaningful word choices a brand makes consistently. "Members" not "users." "Build" not "create." "Ship" not "release."

## Product

`non_features` is the most underrated section in any brand document. Premium products are as defined by what they DON'T do as by what they do. Explicit non-features:
- Stop AI from drift-building scope
- Surface positioning trade-offs to new contributors
- Become marketing copy ("Acme deliberately does not do X, because Y")

The classic example: 37signals' "What we don't do" pages.

## Operations / Legal / Social

These sections are mostly factual. The temptation is to skip them. Don't — they're consulted when generating contact pages, legal pages, footer links, OAuth integrations, and structured data (schema.org / JSON-LD).

## SEO defaults

The `default_page_title_pattern` is consulted for every page that SPEC.md doesn't explicitly override. Standard pattern: `%page% — %brand%` (em-dash). Homepage typically reverses: `%brand% — %tagline%`.

`default_og_image` should be a brand-consistent 1200×630 image. If your project will have many distinct OG images, this is the fallback when none is specified.

## Assets

Paths or URLs to the actual files. AI can generate `<img>` / `<Image>` references against these paths. If the project uses Next.js Image with a public folder, paths look like `/logo.svg`.

`clear_space_rule` is a hard rule for any context that renders the logo. Treat it as inviolable.

---

# Anti-patterns — never do this in INFORMATION.md

- **Don't write generic SaaS marketing speak.** "We empower teams to unlock their full potential" tells the AI to write more of the same. Be specific to this brand.
- **Don't leave slots blank.** Write `n/a` for fields that don't apply. Blank slots get filled with hallucination.
- **Don't fictionalize founders / team / metrics.** AI will surface fake credentials in marketing copy. Real or `n/a`.
- **Don't mix archetypes.** Commit to one. The whole point is consistency.
- **Don't skip anti-personas.** They're more useful than primary personas for AI guidance.
- **Don't skip non-features.** They're more useful than features for scope discipline.
- **Don't restate `DESIGN.md` here.** Colors, fonts, components live in `DESIGN.md`. Brand identity (mission, voice, values, story) lives here.
- **Don't restate `SPEC.md` here.** Page-specific content lives in `SPEC.md`. Defaults that cascade to all pages live here.
- **Don't include secrets.** API keys, passwords, internal access tokens never go in this file — it ships with the project. Use environment variables.

---

# Versioning

`template_version: 1.0.0`. Per-project `INFORMATION.md` instances should preserve this field so you can track which template version they were authored against.

# Source

This template is part of the `premium-product-templates` family. Companion files: `PROJECT.md` (orchestration), `DESIGN.md` / `DESIGN_MOBILE.md` (visual system), `SPEC.md` / `SPEC_MOBILE.md` (content + layout per page/screen).
