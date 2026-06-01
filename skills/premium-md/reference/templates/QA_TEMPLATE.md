---
# ─────────────────────────────────────────────────────────────
# QA_TEMPLATE.md — Premium acceptance checklist (the "done" gate)
# Version: 1.21.0
# Scope: the AI runs this against its OWN build before declaring done.
# Companions: DESIGN_TEMPLATE_*.md (token/a11y/perf targets), SEO_TEMPLATE.md
#            (discoverability), SPEC_TEMPLATE_*.md (the copy that must match).
#
# WHAT THIS FILE IS:
# "Premium" is otherwise just asserted. This file makes it VERIFIABLE: a hard,
# runnable acceptance gate. In the docs→code→QA flow, the AI builds, then runs
# THIS checklist against the result, fixes every failure, and re-runs until all
# gates pass. A build is NOT done until this file is green.
#
# HOW TO USE:
# 1. Copy this file to your project as `QA.md`.
# 2. Most projects use the gates as-is. Tune the budgets in the frontmatter only
#    with intent (e.g. a heavy data-viz app may raise the JS ceiling).
# 3. After building, walk every check. Each has: what to verify · how · pass bar.
# 4. Fix → re-check → repeat. Report ✅/❌ per gate; never ship with an open ❌.
# ─────────────────────────────────────────────────────────────

# ─── STATUS MARKERS — every value's state stays trackable (authoritative spec: PROJECT.md → §Status protocol) ───
# An inline comment on a value marks its state; unmarked + filled = "given" (the user's own input).
#   <slot>/<TBD> = unfilled · # draft = AI-inferred, needs approval · # default = out-of-box default,
#   not consciously chosen · # approved = signed off · # locked = approved + logged in DECISIONS.md.
# Rule: the AI never writes an inferred value without `# draft`, nor accepts a default without `# default`
# — so an unmarked filled value is, by construction, the user's. Nothing fabricated slips through unverified.

template_version: "1.21.0"
file_role: "qa"   # information | design | spec | project | content | seo | qa | decisions

# Hard thresholds the build is measured against (machine-readable).
gates:
  accessibility:
    standard: "WCAG 2.2 AA"
    automated: "axe-core: zero critical, zero serious"          # moderate → remediation tickets
    contrast: "{design.a11y.contrast}"                          # APCA/WCAG targets live in DESIGN.md — do not restate
  performance:
    LCP_s_max: 2.5
    INP_ms_max: 200
    CLS_max: 0.1
    crux_good_pct_min: 75
    js_kb_max_initial: 200      # gzipped, above-the-fold route
    image_lcp: "AVIF/WebP, sized, fetchpriority=high, no CLS"
  discoverability:
    json_ld: "valid (per SEO.md), 0 errors in Rich Results Test"
    social_cards: "OG + Twitter present on every page"
    crawl: "sitemap.xml + robots.txt + canonical on every page"
  fidelity:
    tokens_only: true           # UI uses exported tokens / CSS vars — no hardcoded #hex or raw oklch() in components
  responsive:
    range: "xs → 2xl → ultra-wide (≥2560 content capped + centered)"
    themes: "light AND dark both verified"
  content:
    matches_spec: true          # copy is verbatim from SPEC.md; reused content matches CONTENT.md
    no_placeholder: true        # no lorem ipsum / leftover <slot> / banned words (DESIGN §Microcopy)

---

# Acceptance gate

A build is **done** only when **every** gate below is ✅. Run after building; fix and re-run on any ❌. Report results per gate.

## The build loop (how to get here)
`read the docs → plan → generate against the exported tokens → run THIS checklist (self-QA) → fix every failure → re-run`. Building is a verify-and-refine cycle, never a single pass.

---

## Gate A — Accessibility (WCAG 2.2 AA)
- [ ] **Automated:** axe-core (or equivalent) reports **zero critical / zero serious**. Moderate issues → tracked remediation, not shipped silently.
- [ ] **Contrast:** all text/UI meets the DESIGN.md targets (APCA + WCAG). *(Don't restate values — they live in `DESIGN.md §Accessibility`.)*
- [ ] **Keyboard:** every interactive element reachable + operable by keyboard; **visible focus** (DESIGN focus-ring); logical tab order; no traps.
- [ ] **WCAG 2.2 new criteria** (these bite hardest in forms/auth):
  - [ ] **Focus not obscured** (2.4.11/2.4.12) — sticky headers/toasts never hide the focused element.
  - [ ] **Target size ≥ 24×24 px** (2.5.8) — or adequate spacing.
  - [ ] **Dragging alternative** (2.5.7) — anything draggable also works with a single tap/click.
  - [ ] **Consistent help** (3.2.6) — help/support in the same place across pages.
  - [ ] **Accessible authentication** (3.3.8) — no memory/cognitive-test-only login (allow paste, email-link, passkeys).
  - [ ] **Redundant entry** (3.3.7) — don't re-ask for info already provided in the same flow.
- [ ] **Semantics:** landmarks, headings in order, alt text, form labels, ARIA only where needed; live regions for async updates.
- [ ] **Motion:** `prefers-reduced-motion` honored; no autoplay-with-sound.

## Gate B — Performance (Core Web Vitals budget)
- [ ] **LCP < 2.5s**, **INP < 200ms**, **CLS < 0.1** (lab via Lighthouse; field via CrUX where available — INP is the most-failed, check it hardest).
- [ ] **LCP image:** AVIF/WebP, correctly sized, `fetchpriority="high"`, `width`/`height` set (zero CLS); fonts preloaded with metric-override fallbacks (DESIGN typography).
- [ ] **Weight:** initial route JS ≤ budget (`gates.performance.js_kb_max_initial`); no render-blocking; code-split below the fold; images lazy-loaded below the fold.

## Gate C — Discoverability (per SEO.md)
- [ ] **JSON-LD** valid (0 errors in the Rich Results Test) for each page-type per `SEO.md`.
- [ ] **Social cards** (Open Graph + Twitter) on every page; OG image renders.
- [ ] **Crawl:** `sitemap.xml`, `robots.txt`, a `<link rel="canonical">` on every page; `llms.txt` if enabled.
- [ ] **AEO/GEO:** answer-first pages have a question heading + concise answer; FAQ/entity markup matches `SEO.md`.

## Gate D — Token fidelity (no drift)
- [ ] UI references the **exported tokens / CSS variables** (`npm run export`) — **no hardcoded `#hex`, `rgb()`, or raw `oklch()`** in component code.
- [ ] **Type, spacing, radius come from tokens too** — **font sizes** use the exported `--text-*` vars and **line-heights** use the `--leading-*` vars (both from `typography.roles`), **not raw `rem`/`px`/unitless literals**; spacing/radius from `--space-*`/`--radius-*`, not magic numbers. *(A purely decorative, `aria-hidden` glyph may use `line-height: 1`.)* If a needed token is missing from the export, **flag it** in the QA report — don't silently hardcode a value.
- [ ] Components match their `DESIGN.md` specs (variants, states, sizes), incl. the project's **surface-separation strategy** (per `DESIGN.md` + `DECISIONS.md` — don't substitute a different one).

## Gate E — Responsive & themes
- [ ] Renders cleanly across **xs → 2xl**, **plus ultra-wide ≥ 2560** (content **caps + centers**, line length ≤ ~75ch — never stretches), and the **foldable 600–720** zone is sane. *Verify against the **actual running render** in a browser (e.g. Claude in Chrome on `localhost`), not just by reading code — see research §X4.3.*
- [ ] **Light AND dark** both verified on every page/screen (per DESIGN dark-mode rules).
- [ ] Touch targets, safe areas (mobile), and container-query components behave in narrow containers.

## Gate F — Content
- [ ] All copy is **verbatim from `SPEC.md`**; reused content (testimonials, FAQs, stats) matches **`CONTENT.md`** — no duplication/drift.
- [ ] **Zero** lorem ipsum, leftover `<slot>`, placeholder, or banned words (`DESIGN.md §Microcopy`).
- [ ] Numbers/claims are real (from `CONTENT.md` / `INFORMATION.md`) — never fabricated.

## Gate G — Correctness & security
- [ ] Security headers (CSP/HSTS as appropriate); **no secrets** in client bundles; forms validate + handle errors; external links safe (`rel`).
- [ ] All links resolve; **404 + 500** states exist and are on-brand; loading/empty/error states present (DESIGN states).
- [ ] Cross-browser sanity (latest Chrome/Safari/Firefox).

---

# AI Agent Contract (QA)
1. **The build is not done until every gate is ✅.** On any ❌: fix, re-run the affected gate, repeat. Never declare done with an open failure.
2. **Self-QA is mandatory**, not optional — run this before handing the build over.
3. **Don't weaken a gate to pass it.** Tune budgets in the frontmatter only with explicit intent, and log the change in `DECISIONS.md`.
4. **Report per gate as a written artifact** (✅/❌ + what was fixed) — self-QA must leave **evidence**, not just be asserted in passing. Emit a `## QA results` section (or a `QA-RESULTS.md`) alongside the build; surface anything that can't be auto-verified (e.g. real-device checks) rather than silently passing it. Format:

```md
## QA results — <component/page>
- Gate A (a11y): ✅ — axe 0 critical; focus-visible ring; targets ≥24px
- Gate D (tokens): ✅ — colors/type/spacing all via vars; ran `npm run export`
- Gate E (responsive+themes): ✅ — xs→ultra-wide; light+dark verified
- …one line per applicable gate, ❌ only if fixed-then-rechecked…
```

# Versioning
`template_version: 1.21.0`. Per-project `QA.md` instances should preserve this field.

# Source
Acceptance bars synthesized from 2026 premium-launch standards (WCAG 2.2 AA / axe zero-critical, Core Web Vitals budget, JSON-LD/AEO, token fidelity) — see `docs/SYSTEM_RESEARCH.md` (F6, F9, F10). Contrast/perf/a11y target *values* live in `DESIGN.md`; this file references them rather than restating.
