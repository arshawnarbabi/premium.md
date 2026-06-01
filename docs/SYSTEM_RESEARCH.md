# Research — Optimal AI-Agent Workflow for Designing Premium Websites

> **Status:** ✅ RESEARCH COMPLETE. 12 findings (§5), verdicts (§6), ranked recommendations + workflow (§7), next step (§8). Awaiting the user's pick of what to implement.
> **Last updated:** research complete, against `premium.md` v1.8.1.

---

## 0. What this document is (read me first)

This is a **living research log**. Its job: figure out what to **add to / change in** the `premium.md` system so it becomes the *optimal* way to design **premium websites** with AI agents — tailored to one specific division of labour (see §2).

**Rules for maintaining this doc (for the AI writing it):**
- **Append findings as you go**, not at the end. Every research session adds to §5.
- **Write for a fresh, no-context AI model.** Assume the reader has never seen this system. Define terms, link sources, and state *why* each finding matters — not just *what*.
- Every finding cites its **source URL** and ends with a **recommendation** (Add / Extend / Skip) + a one-line rationale.
- Keep the synthesis in §6 in sync with §5 as evidence accumulates.

---

## 1. Baseline — the system as it exists today (v1.8.1)

`premium.md` (GitHub: `arshawnarbabi/premium.md`, MIT) is a markdown template system that turns an AI agent into a reliable premium-grade product builder. A human fills ~30 brand-identity slots; everything else (design tokens, component specs, page patterns, voice rules, accessibility floors) is pre-decided based on what premium design teams do. Inspired by and extending **Google Labs' DESIGN.md** format.

**The six template files (instantiated per project by dropping `_TEMPLATE`):**
1. **`PROJECT.md`** — entry-point orchestration. Declares which sibling files exist + priority order, the tech stack, repo conventions, the **Interactive Population Protocol** (intake), and the **Cross-template consistency rules** (which shared values propagate where, on every update).
2. **`INFORMATION.md`** — brand identity, audience personas (+ anti-personas), business model, voice principles, product features/non-features, social, SEO defaults. The "why/who." Shared web+mobile.
3. **`DESIGN.md`** (web) — the visual system: colors (OKLCH, 12-step Radix-style), typography (8 roles, font-category-aware metrics), spacing, ~25 component specs, motion, **surface separation** (shadow/border/surface-tone, tunable), elevation, **Web surface scope** (marketing vs product app), accessibility (APCA + WCAG 2.2).
4. **`DESIGN_MOBILE.md`** — the mobile visual system (iOS HIG + Material 3), Dynamic Type, haptics, native surface separation.
5. **`SPEC.md`** (web) — sitemap + per-page content/layout/COPY + forms + system messages + transactional email + legal pages + analytics events.
6. **`SPEC_MOBILE.md`** — app map + per-screen content/copy/states + onboarding + auth + permission pre-prompts + push + app-store metadata.

Plus: **`research.md`** (~3,800 lines of brand-agnostic premium-standard design research, the backing for the templates) and an optional **`tools/brand-kit/`** package — a model-only **OKLCH palette generator** + a **brand-kit viewer** (renders a project's DESIGN.md + INFORMATION.md: specimen + composition, light/dark, real fonts + icons).

**Key mechanics:** tokens referenced via `{group.path}` syntax; a guided **intake protocol** (the AI asks a structured question set, the human answers, the AI fills + propagates + verifies); cross-document propagation (change icons/colors/fonts once → all sibling docs update); version-stamped (`template_version`) and released via semver.

**What the system already covers well:** color, typography, spacing, components, motion, elevation/surface-separation, dark mode, accessibility floors, the intake, cross-doc sync, marketing-vs-product surface scoping, and a brand-kit preview. The SPEC files cover sitemap + page copy + forms + emails + analytics events.

---

## 2. The target workflow (what we are optimizing FOR)

The division of labour this research must tailor around:

- **The human (Arshawn) does ALL the design** — the visual/creative decisions.
- **The AI does all the *tracking*** — maintaining the **brand kit**, the **information**, and the **content** as reliable, consistent, single-source-of-truth records, so nothing drifts and everything stays in sync.

So the research is biased toward: *what files / structures / workflow steps make the AI's job — keeping brand + information + content coherent, premium, and build-ready — maximally reliable*, for premium websites specifically.

**Open scoping questions (answers go in §3):** see the questions posed to the user. Until answered, treat the following as the working assumption (to be confirmed): AI maintains the docs; website type and the biggest felt gaps are TBD.

---

## 3. Scoping inputs — from the user  *(confirmed)*

- **AI's role:** **Docs + code + QA.** The AI maintains the source-of-truth docs, generates the website code from them, AND self-audits the result against a premium checklist (a11y, perf, fidelity-to-tokens, content) and fixes issues before handing over. → Research must cover the **full pipeline: track → build → QA**, not just the docs.
- **Website type:** **Both equally** — premium marketing/landing sites AND product web-apps (behind login). The system already has a `tech.web.surfaces` scope (marketing / product / both); research should strengthen both.
- **Biggest gaps:** **None specific / exploratory.** The user hasn't stress-tested the system yet and assumes it already works well; the goal is to surface ANY research-backed improvement, across the board — not to fix a known pain. → Research runs in **discovery mode**: find high-leverage additions and rank them by impact-vs-cost.
- **Additions shape:** **Open** — recommend whatever's optimal (new files or extensions to the existing six), keeping the dependency-free-markdown ethos where possible.
- **Content authorship:** *Working assumption (flagged for confirm):* the AI **manages content end-to-end** — models it, writes/maintains it on-voice, and keeps it in sync (consistent with "AI does the information + content tracking" + docs+code+QA). Research both content **generation** and **governance/modeling**.
- **Human's domain:** all visual / creative DESIGN decisions.

---

## 4. Research questions to answer

1. What is the **proven, repeatable workflow** for designing/building premium websites with AI agents end-to-end (intake → brand → information → content → design → build → QA → maintain)? Where does the human-designs / AI-tracks split fit best?
2. Are there **additional source-of-truth files** premium teams use that this system lacks? (candidates in §6 — e.g., dedicated content/copy, SEO/metadata, component-inventory, motion/interaction, analytics/events, IA/sitemap, design-token export, an AI-agent entry file, a QA/acceptance checklist, a changelog/decision-log).
3. What **conventions** make markdown source-of-truth docs maximally legible/actionable to AI agents (structure, naming, token formats, llms.txt, AGENTS.md/CLAUDE.md, MCP, skills)?
4. What do **premium website standards** (2025–2026) demand that isn't yet captured (perf budgets, Core Web Vitals, structured data/schema.org, OG/social cards, content modeling, i18n, motion accessibility, etc.)?
5. How do leading **design-system-as-code / docs-for-AI** efforts structure things (Google DESIGN.md, design tokens DTCG, Storybook, headless CMS content models, "docs written for AI agents")?

---

## 5. Findings log  *(LIVING — appended during research)*

### Batch 1 — agent workflow, AGENTS.md, llms.txt

**F1 — `AGENTS.md` is now a real open standard, and our `PROJECT.md` should formally align with it (HIGH).**
`AGENTS.md` is "a README for agents": a plain-markdown file checked into the repo that gives coding agents persistent, project-specific operating instructions (build/test commands, conventions, constraints the agent can't infer). It's read *natively* by **Codex, Cursor, Copilot, Gemini CLI, Aider, Windsurf, Zed, Factory, Jules, and 20+ tools**, stewarded by the **Linux Foundation's Agentic AI Foundation**, adopted by **60,000+ repos**. The nearest file in the dir tree wins; explicit chat prompts override.
*Implication for us:* (a) our entry file `PROJECT.md` already plays this role and the README already notes renaming it to `AGENTS.md`/`CLAUDE.md` — but we should make that **first-class** (ship/generate a proper `AGENTS.md` and align its section conventions to the standard), and (b) in the **docs+code+QA** flow, when the AI scaffolds the actual site repo it should **emit an `AGENTS.md` into that repo** (build/test/convention/QA rules) so future agents stay on-rails. **Verdict: ADD** (entry-file alignment + generated `AGENTS.md` for the built codebase). Sources: agents.md, github.com/agentsmd/agents.md, augmentcode.com guide.

**F2 — Premium sites should ship as an "agent-ready" / machine-readable environment, incl. `llms.txt` (MEDIUM-HIGH, forward-looking).**
The 2026 guidance is that a site shouldn't be just "visual marketing pages" but a **structured data environment** — machine-readable schema, transparent info, clear "API-like" entry points — so AI agents can consume it. `llms.txt` is an emerging standard: a markdown file at the site root that **indexes the site's key pages** (one-sentence description + URL each), plus an optional `llms-full.txt` full export, so LLMs can parse the site without scraping HTML. **Caveat:** no major LLM provider *officially* consumes `llms.txt` yet (OpenAI/Anthropic/Google) — it's low-cost future-proofing, not a ranking lever today.
*Implication:* a premium build in 2026 should output **structured data (schema.org), OG/social cards, and an `llms.txt`** as standard. This argues for a dedicated **discoverability/agent-readiness** artifact (a `SEO.md`/`DISCOVERABILITY.md` spec or a SPEC section) that the AI fills + emits. **Verdict: ADD** (as a discoverability spec; mark `llms.txt` as "future-proofing, optional"). Sources: dwmedia.com agent-ready, llmstxt.org, ahrefs/semrush llms.txt explainers.

**F3 — The agent build loop should be an explicit plan → build → self-review → refine cycle (MEDIUM).**
Repeated best-practice across 2026 agent guides: a 4-step loop (assign task → plan/allocate → **iterate & improve via a feedback loop where the agent reviews its own output** → execute), with clear separation of *decision* vs *tool execution* and "structured reasoning before acting." For **design-to-code**, the strongest tools "apply the styling system, **respect design tokens**, scaffold routes, and **generate tests**."
*Implication:* our **AI Agent Contract** + the docs+code+QA flow should encode this explicitly — a named build loop (read docs → plan → generate against tokens → self-QA → fix → repeat) rather than a single pass. Reinforces the case for a **QA/acceptance checklist** the agent runs against itself (Thread 4). **Verdict: EXTEND** (formalize the build+QA loop in the agent contract / a workflow file). Sources: onereach.ai, virtido.com, autonomyai.io.

### Batch 2 — perf standards, structured data, design-token export, content modeling

**F4 — Design-token EXPORT (DTCG `tokens.json` + Tailwind/CSS) is a high-value, low-cost gap — and Google's DESIGN.md already does it (HIGH).**
The W3C **DTCG** spec hit its first stable version (**2025.10**: `$value`/`$type`, color-space info, dimension units; `.tokens.json`, media type `application/design-tokens+json`). **Amazon Style Dictionary** transforms a `tokens.json` into CSS variables / Tailwind config / iOS / Android. Tailwind v4 is CSS-first (`@theme` → CSS vars). **Critically: Google Stitch's open-sourced `DESIGN.md` already auto-exports a DTCG `tokens.json` + a `tailwind.config.js`.** Our system has the generator + brand-kit but **emits no DTCG/Tailwind/CSS export** — so a downstream build has to hand-transcribe tokens, which is exactly where drift enters.
*Implication:* add a **token-export step** (DESIGN.md `colors`/`typography`/`spacing`/`radius`/`elevation` → `tokens.json` (DTCG) + `tailwind.config`/`globals.css` CSS vars). This is the cleanest **docs→code bridge** for the docs+code+QA flow and brings us to parity with Google's DESIGN.md. **Verdict: ADD** (export command in `tools/brand-kit`, or documented loader output). Sources: W3C DTCG (designtokens.org), terrazzo.app, github praveenjuge/tailwindcss-tokens-DTCG, maviklabs.com, pasqualepillitteri.it (Google Stitch DESIGN.md).

**F5 — Structured data (JSON-LD) + social cards are now table-stakes for premium + "AI search," and we don't spec them (HIGH).**
**JSON-LD is the format every AI engine (Google, Bing, Perplexity, ChatGPT) relies on** to extract signals; it's the primary machine-readable layer deciding whether AI Overviews/LLMs **cite your page**. A 2025 controlled test: the schema'd page appeared in an AI Overview while the no-schema page **failed to even index**. High-value 2026 types: **Organization, Article/BlogPosting, Product, LocalBusiness, HowTo**, and **FAQPage** (note: Google *removed FAQ rich results May 7 2026*, but FAQPage still helps LLM extraction). Put JSON-LD in a `<script type="application/ld+json">` in `<head>`. Our `SPEC.md` covers analytics events but **not** structured data, Open Graph/Twitter cards, canonical/sitemap/robots as spec'd, AI-emitted artifacts.
*Implication:* add a **discoverability spec** (JSON-LD schema per page-type + OG/social cards + sitemap/robots + canonical + the `llms.txt` from F2). The AI fills it from `INFORMATION.md` + `SPEC.md` and emits the markup. **Verdict: ADD** (`SEO.md`/discoverability artifact, or a strong SPEC section). Sources: stackmatix.com, growthnatives.com, digitalapplied.com (I/O 2026 schema), incremys.com.

**F6 — Performance budgets (Core Web Vitals) should be explicit targets + a QA gate (MEDIUM-HIGH; EXTEND).**
2026 thresholds: **LCP < 2.5s, INP < 200ms** (INP replaced FID in 2024 and is the **most-failed** CWV — 43% of sites fail it), **CLS < 0.1**; you need "good" for **75% of CrUX visitors**. The **March 2026 Google core update strengthened performance's ranking weight**; passing correlates with ~24% lower bounce. Our `research.md`/AI-contract already names LCP ≤ 2.5s and INP ≤ 200ms — but only as prose, not as a **budget the build is measured against**.
*Implication:* formalize a **performance budget** (CWV targets + JS/image weight ceilings) and make CWV a **QA acceptance check** in the docs+code+QA loop. **Verdict: EXTEND** (perf budget block + QA gate). Sources: corewebvitals.io, web.dev thresholds, digitalapplied.com, w3era.com.

**F7 — Model CONTENT as reusable TYPES, not just per-page copy — this directly serves "AI tracks content, no drift" (HIGH).**
Headless-CMS best practice: think in **content types** (Product, Article, Author, Testimonial, Feature, FAQ, Case Study) with defined fields — **not pages**. Decompose into **modular, reusable** types **referenced** across pages (e.g., one `Author`/`Testimonial` referenced by many pages); update once → reflects everywhere; separate content from presentation; document the model. Our `SPEC.md` is **page-centric** (copy is authored per page), so a testimonial/feature/FAQ reused on 3 pages is copied 3× — a prime drift source, and exactly the thing the user wants the AI to *track* without divergence.
*Implication:* add a **content-model layer** — reusable content-type records (with `{content.path}`-style refs, mirroring our token refs) that SPEC pages reference instead of re-typing. The AI maintains each fact once; pages compose from it. Strong fit for the human-designs / AI-tracks-content split. **Verdict: ADD/EXTEND** (a `CONTENT.md` content model, or a `content_types` block SPEC pages reference). Sources: webiny.com, kontent.ai, dotcms.com, thebcms.com.

### Batch 3 — QA/launch checklist, WCAG 2.2, benchmark vs Google's DESIGN.md

**F8 — Benchmark: where we stand vs Google Stitch's `DESIGN.md` (context, not a gap list).**
Google's open-sourced `DESIGN.md` has **9 sections** (Visual Theme & Atmosphere · Color Palette & Roles · Typography · Component Stylings · Layout · Depth & Elevation · Do's & Don'ts · Responsive Behavior · **Agent Prompt Guide**), stays **< 200 lines**, follows **DTCG** and **exports `tokens.json` + `tailwind.config.js` + CSS/SCSS**, and validates color against WCAG AA/AAA (guidance only — **no CLI lint/validation**). Its headline novelty is the **"Agent Prompt Guide"** (explicit instructions left for the AI).
*Where we already win:* we're far deeper (our DESIGN is ~2,300 lines: ~25 component specs, motion, APCA, surface-separation, font-category metrics, dark mode), we're a **6-file system** (brand + content + web/mobile, not one file), we have the **intake protocol, cross-doc sync, a generator + brand-kit viewer**, and we already have the "Agent Prompt Guide" equivalent (the **AI Agent Contract**, 26 rules). *Where they win:* **token export** (F4) and a tidy < 200-line footprint. **Net:** the single concrete capability to copy is **token export**; otherwise our system is a superset. Source: pasqualepillitteri.it (Google Stitch DESIGN.md).

**F9 — A premium build needs a real QA / launch-acceptance checklist, run by the AI in the +QA step (HIGH; the user chose docs+code+QA).**
2026 consensus: a launch is a **30-day window** (pre-launch hardening → cutover → post-launch monitoring), gated on **a11y, performance, SEO, security, analytics, content**. Hard bars: **WCAG 2.2 AA with zero critical/serious axe violations** (moderate → remediation tickets), **CWV pass** (LCP≤2.5 / INP≤200 / CLS≤0.1), SEO fundamentals (sitemap, meta, alt text, canonical), security headers, analytics firing. There's nothing in our system that defines "done/acceptable" for a built site.
*Implication:* add a **QA / acceptance checklist** the AI runs against its own build and must pass before declaring done — a11y (axe-zero-critical + the WCAG 2.2 criteria in F10), CWV budget, SEO/structured-data (F5), responsive + light/dark, token-fidelity (no hardcoded values), content-vs-SPEC, security. This *operationalizes* the "+QA" half of the workflow. **Verdict: ADD** (`QA.md`/acceptance checklist, or a dedicated agent-contract block + a runnable checklist). Sources: digitalapplied.com (150-item), brandvm.com, get-highlite.app, bugherd.com.

**F10 — Close the WCAG 2.2 gaps, especially for forms/auth in product web-apps (MEDIUM; EXTEND).**
WCAG 2.2 (W3C Rec, Oct 2023; now the **default legal bar** in US + EU) added **9 criteria** over 2.1: **Focus Not Obscured (2.4.11/2.4.12)**, **Dragging Movements** has a single-pointer alternative (2.5.7), **Target Size ≥ 24×24px (2.5.8)**, **Consistent Help (3.2.6)**, **Accessible Authentication (3.3.8 — no cognitive-test/password-memory-only)**, **Redundant Entry (3.3.7 — don't re-ask for info already given)**; and it **removed 4.1.1 Parsing**. We already nail target size and APCA, but the *newer* criteria (accessible auth, redundant entry, consistent help, dragging alternative, focus-not-obscured) aren't called out — and they bite hardest in **auth + multi-step forms**, i.e. the product-web-app surface (which the user wants supported).
*Implication:* fold the 9 new 2.2 criteria into the a11y section + the QA checklist, with form/auth emphasis. **Verdict: EXTEND** (a11y completeness). Sources: w3.org/WAI new-in-22, levelaccess.com, getwcag.com.

### Batch 4 — decision logs for agents, and where AI site-builders fit

**F11 — A decision log (ADR / "Agent Decision Record" style, AI-readable) prevents the AI from relitigating locked choices (MEDIUM-HIGH; strong fit for "AI tracks").**
2026 shift: *"the most important architecture documentation today isn't for humans — it's for AI agents,"* telling them *"what rules they must follow right now."* An ADR captures one decision: **context → options considered → choice → consequences**. The emerging **Agent Decision Record (AgDR)** has agents record decisions in a structured, human-readable ledger that lives with the code — solving lost context, auditability, and knowledge transfer; *"a decision ledger an AI can answer instantly."* Our system has cross-doc sync + the intake, but **no record of WHY** a choice was made (why command palette off, why border separation, why Fraunces). A fresh AI re-opening the project can second-guess or contradict settled decisions.
*Implication:* add a lightweight **decision log** (`DECISIONS.md`, ADR-style, append-only) the AI **writes to when a decision is locked** and **reads first to avoid relitigating**. (We've literally been doing this in `brand-kit-tooling-plan.md`'s decision log this whole project — it works.) **Verdict: ADD.** Sources: nevinmorgan.com (ADRs for vibe engineering), ai.gopubby.com (AGENTS.md vs ADR), github me2resh/agent-decision-record, adr.github.io.

**F12 — Positioning: our system is the "brand/design/content anchor" that AI site-builders lack; our tech defaults already match the market (validation, not a gap).**
The 2026 AI-builder market consolidated to **v0 (Vercel)**, **Bolt.new**, **Lovable** — all natural-language→code, all standardized on **shadcn/ui + Tailwind** as the consistency layer; the favorite agency pipeline is *"v0 for components → Lovable for the app → Claude Code for production cleanup."* These tools **generate fast but don't enforce brand/design/content consistency across a whole project** — which is exactly what our system provides. Our `PROJECT.md` tech defaults (Next.js + Tailwind v4 + shadcn/ui for product, custom for marketing) **already align** with where the market is.
*Implication:* (a) no tech-stack change needed — we're on-target; (b) frame the system as the **source-of-truth anchor** these builders consume, and the **token export (F4)** is the literal bridge into the shadcn/Tailwind world they live in; (c) the docs+code+QA flow = *our docs* → (v0/Claude Code build) → *our QA checklist*. **Verdict: KEEP + document the positioning.** Sources: nxcode.io comparisons, lovable.dev guides, uibakery.io.

---

## 6. Candidate additions to evaluate  *(starter list — confirm/expand via research; each gets an Add/Extend/Skip verdict)*

| Candidate | What it would be | Verdict (evidence) |
| --- | --- | --- |
| Design-token **export** | DTCG `tokens.json` + `tailwind.config` + CSS vars from DESIGN.md | **ADD — Tier 1** (F4, F8) — the docs→code bridge; parity with Google's DESIGN.md; low effort |
| **QA / acceptance** checklist | Premium-launch gate run by the AI: a11y (axe-zero-critical + WCAG 2.2), CWV budget, SEO/structured-data, token-fidelity, responsive+dark, content-vs-SPEC, security | **ADD — Tier 1** (F9, F6, F10) — operationalizes the "+QA" half |
| `SEO.md` / discoverability | JSON-LD schema per page-type + OG/Twitter cards + sitemap/robots/canonical + `llms.txt` | **ADD — Tier 1** (F5, F2) — table-stakes for premium + AI-search; we spec none of it |
| `CONTENT.md` / content model | Reusable content **types** (Testimonial, Feature, FAQ, Author…) referenced across SPEC pages via `{content.path}` refs | **ADD — Tier 1** (F7) — kills copy drift; the core of "AI tracks content" |
| **Decision log** | `DECISIONS.md` — append-only ADR/AgDR-style ledger; AI writes locked decisions + rationale, reads first to avoid relitigating | **ADD — Tier 2** (F11) |
| AI-agent **entry file** | Align `PROJECT.md` to the `AGENTS.md` open standard; emit an `AGENTS.md` into the *built* repo | **ADD — Tier 2** (F1) |
| Perf budget + WCAG-2.2 completeness | Explicit CWV budget + the 9 new 2.2 criteria (auth/forms) | **EXTEND — fold into QA checklist** (F6, F10) |
| `COMPONENTS.md` inventory | Standalone component inventory + state matrix | **SKIP/minor** — DESIGN.md already specs ~25 components; market uses shadcn/ui |
| `MOTION.md`, `ANALYTICS.md`, `SITEMAP.md` | Split-out motion / events / IA artifacts | **SKIP** — already covered in DESIGN.md (motion) + SPEC.md (events, sitemap); splitting adds files w/o much gain |

---

## 7. Recommendations (synthesized)

**Top-line:** the system is already a *superset* of the leading public spec (Google's DESIGN.md) on design depth, and its tech defaults already match the 2026 AI-builder market (shadcn/ui + Tailwind + Next.js). The high-leverage gaps are **not** more design rules — they're the **edges of the pipeline**: getting tokens *out* to code, modeling *content* so it can't drift, making the site *discoverable* to AI search, and *proving* the build is premium via QA. Four Tier-1 additions cover all of it.

### Tier 1 — do these (high impact)

1. **Token export → `tokens.json` (DTCG) + `tailwind.config` + CSS variables.** *(F4, F8)*
   The single capability Google's DESIGN.md has that we don't, and the cleanest **docs→code bridge**. Add an `export` command to `tools/brand-kit` (or document it as loader output) that turns DESIGN.md `colors/typography/spacing/radius/elevation/surface_separation` into a W3C-DTCG `tokens.json`, a `tailwind.config.{js,ts}`, and a `globals.css` `:root` variable set (light + dark). *Effort: low. Removes hand-transcription, the #1 drift source in docs→code.*

2. **A QA / acceptance checklist the AI runs against its own build (the "+QA" half).** *(F9, F6, F10)*
   A `QA.md` (or agent-contract block) that defines "premium-done": **a11y** = axe **zero critical/serious** + the 9 new **WCAG 2.2** criteria (focus-not-obscured, target ≥24px, dragging alt, consistent help, **accessible auth**, **redundant entry** — auth/forms emphasis); **performance** = CWV budget (LCP<2.5s, INP<200ms, CLS<0.1) + JS/image ceilings; **discoverability** = JSON-LD valid + OG cards + sitemap; **fidelity** = uses tokens, no hardcoded `#hex`; **responsive + light/dark**; **content matches SPEC**; **security headers**. The agent self-audits → fixes → re-checks until it passes.

3. **A discoverability spec — `SEO.md` (JSON-LD + social cards + `llms.txt`).** *(F5, F2)*
   JSON-LD is what every AI engine (Google/Bing/Perplexity/ChatGPT) reads to decide whether to **cite** the page; we currently spec none of it. Page-type → schema mapping (Organization, Article/BlogPosting, Product, FAQPage, HowTo, BreadcrumbList), Open Graph/Twitter cards, canonical, sitemap/robots, and an `llms.txt` index (mark `llms.txt` "future-proofing, optional"). The AI fills it from INFORMATION + SPEC and emits the markup. *(Could also live as a strong section in SPEC rather than a new file.)*

4. **A content model — reusable content types (`CONTENT.md` or `content_types` in SPEC).** *(F7)*
   The core of "AI tracks content without drift." Model **content types** (Testimonial, Feature, FAQ, TeamMember, Author, Stat, CaseStudy) as records the AI maintains **once**; SPEC pages **reference** them (`{content.testimonials.maria}`) instead of re-typing copy that then diverges across pages. Mirrors our existing `{group.path}` token-ref pattern, so it's idiomatic.

### Tier 2 — worth doing (medium)

5. **`DECISIONS.md` — append-only decision log (ADR/AgDR-style).** *(F11)* The AI records each **locked** decision + rationale ("border separation because flat/calm fits the brand") and reads it first, so a fresh agent never relitigates a settled choice. We've proven the pattern in this project's own plan-doc decision log.
6. **`AGENTS.md` alignment.** *(F1)* Make the `PROJECT.md → AGENTS.md` relationship first-class (it's a 60k-repo, Linux-Foundation standard read by 20+ tools), and have the docs+code flow **emit an `AGENTS.md` into the built repo** (build/test/convention/QA rules) so downstream agents stay on-rails.

### Tier 3 — skip (already covered / low ROI)
Standalone `COMPONENTS.md` (DESIGN.md already specs ~25 components; shadcn/ui is the library), `MOTION.md` (DESIGN.md + research cover motion), `ANALYTICS.md` / `SITEMAP.md` (already in SPEC). Adding these mostly multiplies files without new capability — against the system's lean ethos.

### The recommended end-to-end workflow (human designs · AI tracks + builds + QAs)
```
1. PROJECT.md     — orchestration / tech / agent contract     (AI maintains; aligns to AGENTS.md)
2. INFORMATION.md — brand, audience, voice, business          (AI tracks)
3. CONTENT.md     — reusable content types (facts once)        (AI tracks)   ← NEW
4. DESIGN.md(+M)  — visual system                              (HUMAN designs; AI records)
5. SPEC.md(+M)    — pages compose from CONTENT + DESIGN        (AI tracks)
6. SEO.md         — JSON-LD + OG + sitemap + llms.txt          (AI emits)    ← NEW
   tokens export  — tokens.json + tailwind.config + CSS        (AI emits)    ← NEW
7. BUILD          — Next.js + Tailwind + shadcn/ui from tokens (AI builds)   ← build loop: plan → generate-against-tokens → self-QA → fix
8. QA.md gate     — a11y/CWV/SEO/fidelity/content/security     (AI verifies) ← NEW
9. DECISIONS.md   — locked decisions + rationale, append-only  (AI logs)     ← NEW
```
Every shared value still flows through the existing **cross-template consistency** rules; the new files plug into that same propagation graph.

### What this buys, in one line
Tokens stop being hand-copied (export), content stops drifting (content model), the site becomes citable by AI search (SEO/JSON-LD), and "premium" becomes *verifiable* instead of asserted (QA gate) — with a decision log so none of it gets relitigated.

---

## 8. Status & next step
**Research: COMPLETE.** Findings F1–F12 recorded; verdicts in §6; plan in §7.
**Implementation: IN PROGRESS** (user approved building all six; build per item with targeted research appended here).

## 9. Build log
- **✅ Tier-1 #1 — Token export — SHIPPED.** Added `tools/brand-kit/scripts/export-tokens.ts` + `npm run export`. From `DESIGN.md` it emits: **`tokens.css`** (CSS vars, `:root` light + `[data-theme="dark"]` dark; palettes concrete OKLCH, role tokens as `var()` refs), **`theme.css`** (Tailwind v4 `@theme inline`, imports tokens.css), **`tokens.json`** (W3C **DTCG 2025.10**, `$type`/`$value`, string values for portability). Dependency-free. Verified on Temperance: 120 light + 60 dark vars, 112 Tailwind-mapped tokens, 5 palettes/3 fonts/18 spacing/7 radii in DTCG. *Targeted format research (DTCG 2025.10 = `$value`/`$type`, color `colorSpace`/`components` or string, dimension `value`/`unit` or string, composite types; Tailwind v4 `@theme` namespaces `--color-*`/`--font-*`/`--spacing-*`/`--radius-*` → utilities + runtime CSS vars). Sources: designtokens.org/tr/drafts/format (2025.10), styledictionary.com/info/dtcg, tailwindcss.com/docs/theme, maviklabs.com.* Released as part of the next version bump.
- **✅ Tier-1 #2 — QA acceptance gate + responsiveness + build loop — SHIPPED (v1.10.0).** New `QA_TEMPLATE.md` (→ `QA.md`): machine-readable gates + checklist (a11y WCAG 2.2 AA / axe zero-critical / 9 new criteria; CWV budget; token fidelity; discoverability; responsive incl. ultra-wide; content-vs-SPEC; security) + a QA AI-contract. `PROJECT.md` gained `source_files.qa_md` + the build-loop rule (F3) + "not done until QA passes." Responsiveness (F15): `3xl`/ultra-wide ≥2560 breakpoint + foldable note in DESIGN_WEB **and** research §F. Verified (7-point pass: QA structure, PROJECT wiring, responsive sync ×3, README, file-handling, versions, loader+export). File hygiene: this research doc is repo-tracked but **export-ignored** from the lean download (verified: 0 in archive); the build plan is local/gitignored.
- **✅ Tier-1 #3 — Discoverability (SEO + AEO + GEO) — SHIPPED (v1.11.0).** New `SEO_TEMPLATE.md` (→ `SEO.md`, `file_role: "seo"`): JSON-LD structured data (global `Organization`/`WebSite` from INFORMATION + page-type→schema map: Article/BlogPosting, Product, FAQPage, HowTo, BreadcrumbList, LocalBusiness, Person); AEO answer-first/FAQ/definitional patterns; GEO citability (stats +30% / expert quotes +41% / inline citations +30% / entity consistency / freshness ~3× decay); social cards; `llms.txt` (marked optional/forward-proofing). References `INFORMATION.seo` + `SPEC.meta_defaults` rather than restating them. Wired: `PROJECT.source_files.seo_md` + priority_order + cross-template table (INFORMATION entity → SEO `sameAs`; SPEC pages → schema map) + intake (sitemap page-type, llms.txt default); `SPEC.md` per-page `meta` gained `page_type`/`aeo`/`last_reviewed` hooks; `QA.md` Gate C already validates it. All templates bumped to `template_version 1.11.0`. *Sources: 2026 SEO/AEO/GEO standards — JSON-LD as the AI-search signal layer; answer-first + FAQ for AEO; stats/quotes/citations/freshness for GEO citation. See F2/F5/F14.*
- **✅ Tier-1 #4 — Content model — SHIPPED (v1.12.0).** New `CONTENT_TEMPLATE.md` (→ `CONTENT.md`, `file_role: "content"`): typed reusable records (testimonials, stats, features, faqs, team_members, case_studies, integrations, pricing_tiers, notable_customers, press_mentions) each with a stable `id`; pages reference fields via `{content.*}` — same `{group.path}` mechanism as design tokens. **Reconciled with SPEC:** `SPEC.proof_points` (testimonial_library / trust_metrics / notable_customers / press_mentions) migrated to CONTENT records — `proof_points` now a `source: content` pointer + legacy fallback; SPEC contract rule 5 + Don'ts + SPEC_MOBILE contract (new rule 4) point at CONTENT. Loader needs no change (already namespace-agnostic — resolves any `{a.b.c}`). Wired: `PROJECT.source_files.content_md` + priority_order (top — single source) + cross-template table (CONTENT records → SPEC refs / SEO GEO+FAQPage+Person / voice-checked vs INFORMATION) + intake (Q30 reusable content) + fill order (CONTENT before SPEC); README (row + feature + token-ref example + count-agnostic). All templates bumped to `template_version 1.12.0`; header banners synced. *Source: content-modeling / headless-CMS pattern as a markdown layer; generalizes the existing proof_points records. See F7.*
- **✅ Tier-2 #5 + #6 — Decision log + AGENTS.md alignment — SHIPPED (v1.13.0).** **#5:** new `DECISIONS_TEMPLATE.md` (→ `DECISIONS.md`, `file_role: "decisions"`) — append-only ADR-style log; entry format Context/Options/Choice/Rationale/Consequences/Status; newest-on-top; supersede-don't-overwrite. `PROJECT` gained `source_files.decisions_md` + priority_order entry + two `must` rules ("read DECISIONS.md before proposing changes; append when a non-trivial decision is locked"). **#6:** `PROJECT` instantiation step 5 + a `must` rule — when docs→code, emit an `AGENTS.md` at the built repo root (the open standard read by 20+ coding agents: Codex/Cursor/Copilot/Gemini/Zed/…) carrying build/test/lint commands, conventions, the QA gate, and a pointer back to the design docs; rename note strengthened to call AGENTS.md a Linux-Foundation-stewarded standard. `README` Tool-conventions section + DECISIONS row + feature bullet. All templates bumped to `template_version 1.13.0`. *Sources: ADR practice adapted as an append-only agentic log (F11); AGENTS.md open standard, Linux Foundation (F1).*
- **✅ Temperance application + STOP — DONE (v1.13.0).** All 4 new files instantiated for Temperance (CONTENT/SEO/QA/DECISIONS), 10 files at v1.13.0, PROJECT wired, loader clean. README/description/LinkedIn/memory updated.
- **✅ Fresh-agent eval campaign + v1.14.0 hardening — SHIPPED (v1.14.0).** Built a fresh-agent eval harness (6 scenarios — orchestration / content-single-source / discoverability / decision-discipline / build-loop+tokens+QA / AGENTS.md — × Sonnet+Opus × 2 trials, each strict-graded by an adversarial grader that runs the real loader/exporter + scores understanding 0–3) against a fresh invented-brand fixture ("Cadence"; indigo/shadow/⌘K-on — opposite of Temperance). R1 16/24 surfaced **3 real gaps**, fixed + re-run to green, then a clean **24/24 @ 3.00 understanding** full-confirmation round. The 4 fixes (now v1.14.0, in templates + Temperance): **(a)** CONTENT code-layer rule — components import from a content module (`lib/content.ts`), never inline content strings incl. default props (closed: agents honored `{content.*}` in docs but inlined in TSX); **(b)** DECISIONS reopen protocol — a request touching a *locked* decision is NOT authorization; surface+cite+confirm before editing (closed: agents read the request as the "explicit ask"); **(c)** `export-tokens.ts` now emits typography role tokens (`--text-*`/`--leading-*` from `typography.roles`) + DTCG `fontSize` group (closed: font sizes were un-tokenized, forcing raw `rem`); **(d)** QA written-self-QA-artifact + Gate D type tokenization (closed: self-QA was claimed without evidence). *Method: blank-slate agents in isolated `/tmp` workspaces, machine-graded via the real tooling — validates the system on cold agents, not by assertion.*
- ⏳ Next (v1.15.0): repo reorganization — `templates/` folder + `docs/SYSTEM_RESEARCH.md` (this file, renamed); download stays flat.

## 10. Follow-up topics raised by the user (to fold into the build)

**F14 — AEO/GEO is a real gap; it should *elevate* the SEO addition (F5) from "SEO" to "discoverability incl. AEO + GEO" (HIGH).**
*Current coverage:* AEO/answer-engine/GEO = **0 hits** in DESIGN/SPEC templates, ~4 in research. Essentially absent.
*What it is:* **SEO** = baseline search visibility; **AEO** = be the *direct answer* in AI Overviews / answer snippets; **GEO** = be *cited* by LLMs (ChatGPT/Claude/Perplexity/Gemini). Run as a **3-layer** strategy. What actually earns citations (measured): **expert quotes (+41%)**, **statistics (+30%)**, **inline citations (+30%)**, **entity consistency**, **freshness** (*pages not updated quarterly lose citations at 3× the rate*). Content must be **answer-first** (clear question headings, a concise answer right after, structured FAQs), **resolve ambiguity**, **reflect real entities**, and be **machine-parseable**. Platform tilts: Perplexity→freshness/authority, Claude→long-form comprehensive, Gemini→multimodal.
*Implication:* the planned **`SEO.md`** (F5) should be a **discoverability spec covering SEO + AEO + GEO**: JSON-LD structured data **+** answer-first content patterns (Q&A headings, FAQ blocks, definitional "what is X" sections) **+** GEO citability (clear claims, stats, expert quotes, attribution) **+** entity/E-E-A-T consistency (ties to INFORMATION.md) **+** a freshness/`last_reviewed` convention **+** `llms.txt` + OG cards. This also touches **SPEC.md** (answer-first page copy) and **INFORMATION.md** (entity/author/expertise signals). **Verdict: ADD — elevate F5 to "Discoverability (SEO + AEO + GEO)".** Sources: surmado.com, jasper.ai geo-aeo, hubspot.com AEO trends, frase.io, stackmatix.com.

**F15 — Responsiveness is already strong; only a *minor* extend needed (ultra-wide/4K + explicit foldable zones) (LOW-MEDIUM; EXTEND).**
*Current coverage (good):* research **§F** (5 mobile-first breakpoints, **container queries** for components, **fluid `clamp()`** type, 12-col→8→4 grid) + **§M** Density & Responsive; DESIGN_WEB "Breakpoints / Fluid scaling / Container queries first"; DESIGN_MOBILE **iOS size classes + foldables + safe areas + nav-rail**. This already matches the 2026 baseline (media + container + clamp + Grid, mobile-first).
*What 2026 adds:* device range now spans **4-inch phone → 34-inch ultrawide**; the "Golden Zones" call out **Foldables/Mini-Tablets (600–720px)** and **Ultra-Wide & 4K (2560px+)** explicitly. Foldables (e.g. Z Fold) = narrow outer (380–430) ↔ mini-tablet inner (600–768).
*Gap:* our web breakpoints likely top out around `xl` (~1280–1440) with content capped by `container_width` — so **ultra-wide (2560px+)** isn't explicitly addressed (content should *cap + center*, never stretch; optionally use the extra space for a max-width gutter or a 2-up layout), and the **foldable 600–720 zone** isn't named on web. Mobile already handles foldables.
*Implication:* a **small EXTEND** to DESIGN_WEB: an explicit **ultra-wide rule** (max content width + centered, no full-bleed line lengths beyond ~75ch; optional ultra-wide treatment) and a one-line **foldable/600–720 note**. Not a new file. **Verdict: EXTEND (minor).** Sources: rapiddoctools.com (2026 breakpoints/Golden Zones), framer.com, dev.to container-queries-2026, scrimba.com.

*Net for these two:* **AEO = significant — fold into (and rename) the SEO/discoverability addition.** **Responsiveness = already covered — just a small ultra-wide/foldable extend, no new file.*
