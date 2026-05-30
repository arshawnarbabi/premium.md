---
# ─────────────────────────────────────────────────────────────
# SEO_TEMPLATE.md — Discoverability: SEO + AEO + GEO
# Version: 1.14.0
# Scope: web. How the site gets FOUND (search) and CITED (AI answer engines).
# Companions: INFORMATION.md (the entity — brand/people/social), SPEC.md (the pages),
#            QA.md (validates the output). Basic per-page meta lives in INFORMATION.seo
#            + SPEC.meta_defaults — this file does NOT restate it; it adds the
#            structured-data, answer-engine, and generative-engine layers on top.
#
# WHAT THIS FILE IS:
# In 2026 search is three layers: SEO (rank in results) · AEO (be the direct answer
# in AI Overviews / snippets) · GEO (be CITED by ChatGPT / Claude / Perplexity /
# Gemini). The system already handles classic meta tags; this file adds the
# machine-readable structured data + the content patterns that get a page cited.
#
# HOW TO USE:
# 1. Copy this file to your project as `SEO.md`.
# 2. Fill the entity + per-page-type schema slots (most derive from INFORMATION.md).
# 3. The AI emits the JSON-LD + social cards + (optional) llms.txt during build, and
#    QA.md validates them. Re-review pages quarterly (freshness drives AI citations).
# ─────────────────────────────────────────────────────────────

template_version: "1.14.0"
file_role: "seo"   # information | design | spec | project | content | seo | qa | decisions

# ── Structured data (JSON-LD) — the machine-readable layer AI engines read to CITE you ──
# Emit each as <script type="application/ld+json"> in <head>. Validate with the Rich Results Test (QA gate C).
structured_data:
  # GLOBAL — on every page (derive from INFORMATION.md, don't restate it here):
  organization:
    name: "{information.project.name}"
    url: "{information.seo.canonical_domain}"
    logo: "{information.assets.logo.icon_only}"
    sameAs: "<INFORMATION.social.* URLs — establishes the entity across the web>"
  website:
    name: "{information.project.name}"
    url: "{information.seo.canonical_domain}"
    # potentialAction: SearchAction if the site has search
  # PER PAGE-TYPE — map each SPEC page to the schema(s) it should emit:
  page_type_schema:
    home:        ["Organization", "WebSite"]
    article:     ["Article | BlogPosting", "BreadcrumbList"]   # author, datePublished, dateModified, image
    product:     ["Product", "BreadcrumbList"]                 # + Offer (price, availability) if pricing shown
    pricing:     ["Product | Offer"]
    faq:         ["FAQPage"]                                   # see note below
    how_to:      ["HowTo"]                                     # step-by-step → AI-Overview citations
    local:       ["LocalBusiness"]                             # only if there's a physical location
    about:       ["Organization", "Person (founders)"]        # founders → E-E-A-T entity signals
  notes:
    - "JSON-LD is the format Google, Bing, Perplexity, and ChatGPT all rely on. A page with valid schema is far likelier to be indexed + cited than one without."
    - "FAQPage: Google removed FAQ *rich results* (May 2026), but FAQPage markup still helps LLM answer extraction — keep it where genuine Q&A exists."
    - "Don't fabricate schema fields (fake ratings/prices). Only mark up what's truly on the page."

# ── Social cards (extends INFORMATION.seo.default_og_image; per-page override in SPEC) ──
social_cards:
  open_graph: { title: "{spec page title}", description: "{spec page description}", image: "{information.seo.default_og_image}", type: "website | article" }
  twitter:    { card: "{information.seo.default_twitter_card_type}", site: "<@handle from INFORMATION.social>" }

# ── AEO — Answer Engine Optimization (be the DIRECT answer) ──
aeo:
  answer_first: true        # lead a page/section with a clear question heading + a concise answer right after
  faq_blocks: true          # group genuine Q&A so engines can extract them
  definitional_sections: true   # "What is X" / "How X works" sections for entity clarity
  scannable: true           # descriptive headings, short paragraphs, lists — parseable without guessing

# ── GEO — Generative Engine Optimization (be CITED by LLMs) ──
geo:
  # Measured citation drivers (vs uncited baselines): expert quotes +41%, statistics +30%, inline citations +30%.
  include_statistics: true
  include_expert_quotes: true       # attributed quotes read as credibility to models
  inline_citations: true            # cite authoritative sources for claims (chain of trust)
  entity_consistency: true          # brand name / people / claims identical across pages + sameAs (matches INFORMATION)
  comprehensive_depth: "<topics where a long-form, definitive page should exist>"

# ── Freshness — pages stale > 1 quarter lose AI citations ~3× ──
freshness:
  last_reviewed_per_page: true   # stamp + display a review date; SPEC pages carry `last_reviewed`
  review_cadence: "quarterly"

# ── Crawl + AI-readability files (emitted at build) ──
crawl:
  sitemap: "{information.seo.sitemap_url}"
  robots: "{information.seo.robots_default}"
  canonical: "per-page from SPEC.pages.*.canonical"
  llms_txt:
    enabled: "<true | false>"     # markdown index of key pages at /llms.txt (one-line description + URL each)
    full: "<true | false>"        # optional /llms-full.txt full-text export
    note: "Forward-proofing: no major LLM provider OFFICIALLY consumes llms.txt yet — low-cost, not a 2026 ranking lever."

---

# Discoverability — the three layers

Search in 2026 is **three layers**, run together:

| Layer | Goal | Primary lever |
| --- | --- | --- |
| **SEO** | rank in traditional results | crawlable, fast, good meta (already in INFORMATION.seo + SPEC) |
| **AEO** | be the **direct answer** in AI Overviews / snippets | answer-first content + FAQ/structured data |
| **GEO** | be **cited** by ChatGPT / Claude / Perplexity / Gemini | structured data + credibility signals (stats, quotes, citations) + freshness + entity consistency |

This file owns the **structured-data + AEO + GEO** layers. Classic per-page title/description/canonical/robots live in `INFORMATION.seo` and `SPEC.meta_defaults` — reference them, don't duplicate.

## Structured data (JSON-LD)
For each page, emit the schema(s) in `structured_data.page_type_schema` as `<script type="application/ld+json">` in `<head>`. Global `Organization` + `WebSite` go on every page (from INFORMATION). **It's the machine-readable signal that decides whether an AI engine cites this page or a competitor's** — a page with no schema can fail to index entirely. Validate every page in the Rich Results Test (QA gate C). Never mark up data that isn't on the page.

## AEO — write answer-first
Structure pages so an engine can lift a clean answer: a **question heading** (`H2`) followed immediately by a **concise 1–3 sentence answer**, then depth. Add **FAQ blocks** for real Q&A and **definitional "what is X" sections** for entity clarity. Keep it scannable (descriptive headings, short paragraphs, lists). The SPEC page copy should follow these patterns where the page is informational.

## GEO — earn the citation
LLMs cite content that signals credibility. Measured lifts vs uncited pages: **expert quotes +41%, statistics +30%, inline citations +30%**. So: include real **stats**, **attributed expert quotes**, and **inline citations** to authoritative sources; keep **entity consistency** (the brand name, people, and claims identical across pages and matching `INFORMATION.social.sameAs`); and publish **comprehensive, definitive** pages on your core topics. Platform tilt (FYI): Perplexity rewards freshness/authority, Claude favors long-form, Gemini weighs multimodal.

## Freshness
Stamp a `last_reviewed` date on pages and **review quarterly** — pages not refreshed within a quarter lose AI citations at roughly **3×** the normal rate.

## llms.txt (optional, forward-proofing)
If `crawl.llms_txt.enabled`, emit a `/llms.txt`: a markdown index of the site's key pages (one-line description + URL each), optionally a `/llms-full.txt` full export. Note: no major LLM provider officially consumes it yet — it's cheap future-proofing, not a current ranking factor.

# AI Agent Contract (discoverability)
1. **Emit valid JSON-LD** per `page_type_schema` on every page; validate (0 errors) before "done" (QA gate C). Never fabricate schema fields.
2. **Write SPEC page copy answer-first** for informational pages (question heading + concise answer), with FAQ/definitional blocks where genuine.
3. **Keep the entity consistent** with INFORMATION (name, people, social `sameAs`) — GEO depends on it.
4. **Stamp + surface `last_reviewed`**; flag pages older than a quarter for refresh.
5. **Don't invent** stats, quotes, ratings, or citations — pull from CONTENT.md / INFORMATION.md or ask.

# Versioning
`template_version: 1.14.0`. Per-project `SEO.md` instances should preserve this field.

# Source
2026 SEO/AEO/GEO standards (JSON-LD as the AI-search signal layer; answer-first + FAQ for AEO; stats/quotes/citations/freshness for GEO citation). See `AI_WEBSITE_WORKFLOW_RESEARCH.md` (F2, F5, F14). Entity data lives in `INFORMATION.md`; page copy in `SPEC.md`; this file is the discoverability layer over both.
