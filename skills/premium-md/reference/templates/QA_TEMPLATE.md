---
# ─────────────────────────────────────────────────────────────
# QA_TEMPLATE.md — Premium acceptance checklist (the "done" gate)
# Version: 1.22.0
# Scope: the AI runs this against its OWN build before declaring done.
# Companions: DESIGN_TEMPLATE_*.md (tokens, contrast targets, effects registry),
#            SEO_TEMPLATE.md (discoverability), SPEC_TEMPLATE_*.md (the copy that must
#            match + each section's `responsive:` block), research.md §F.5 + §I.14.
#
# SINGLE OWNER OF NUMBERS: every numeric performance budget (Core Web Vitals, JS
# weight, runtime frame / long-task / effect limits) and the canonical viewport
# matrix live HERE and nowhere else. DESIGN and PROJECT point to these keys; if you
# find a budget number restated in another file, delete it there and point here.
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
#    with intent (e.g. a heavy data-viz app may raise the JS ceiling), and log the
#    change in DECISIONS.md. Same for removing a viewport (→ `out_of_scope`).
# 3. After building, walk every check. Each has: what to verify · how · pass bar.
# 4. Fix → re-check → repeat. Report ✅/❌ per gate; never ship with an open ❌.
# ─────────────────────────────────────────────────────────────

# ─── STATUS MARKERS — every value's state stays trackable (authoritative spec: PROJECT.md → §Status protocol) ───
# An inline comment on a value marks its state; unmarked + filled = "given" (the user's own input).
#   <slot>/<TBD> = unfilled · # draft = AI-inferred, needs approval · # default = out-of-box default,
#   not consciously chosen · # approved = signed off · # locked = approved + logged in DECISIONS.md.
# Rule: the AI never writes an inferred value without `# draft`, nor accepts a default without `# default`
# — so an unmarked filled value is, by construction, the user's. Nothing fabricated slips through unverified.

template_version: "1.22.0"
file_role: "qa"   # information | design | spec | project | content | seo | qa | decisions

# Hard thresholds the build is measured against (machine-readable).
# Every value below is a template default; tune only with a DECISIONS.md entry.
gates:
  accessibility:
    standard: "WCAG 2.2 AA"
    automated: "axe-core: zero critical, zero serious"          # moderate → remediation tickets
    contrast: "{design.a11y.contrast}"                          # APCA/WCAG targets live in DESIGN.md — do not restate

  # ── Performance: the ONE place budgets live (DESIGN + PROJECT point here) ──
  performance:
    # Core Web Vitals — judged at the 75th percentile of FIELD data (CrUX / RUM);
    # a page passes when ≥ 75% of visits are "good". Lab numbers are a proxy.
    percentile: "p75"
    crux_good_pct_min: 75
    LCP_s_max: 2.5
    INP_ms_max: 200            # field data, or a Lighthouse TIMESPAN run of real interactions
    CLS_max: 0.1
    TBT_ms_max_lab: 200        # lab proxy for INP (Lighthouse navigation run) — not a substitute for field INP
    js_kb_max_initial: 200     # gzipped, above-the-fold route
    image_lcp: "AVIF/WebP, sized, fetchpriority=high, no CLS"
    # Runtime smoothness — what CWV does not measure: frames while scrolling and animating.
    # Every DESIGN `effects.registry` entry is measured against these (Gate B2). Research §I.14.
    runtime:
      frame_p95_ms_max_120hz: 8.3     # 95th-percentile frame time on a 120 Hz display (ProMotion iPhone/iPad, 120 Hz Android)
      frame_p95_ms_max_60hz: 16.7     # 95th-percentile frame time on a 60 Hz display
      long_task_ms_max: 50            # no main-thread task longer than this during hydration or interaction
      webgl_contexts_max: 8           # live WebGL contexts per page; browsers cap ~16 and silently drop the OLDEST
      backdrop_filter_layers_max: 2   # backdrop-filter layers visible on screen at the same time
      method: "DevTools Performance trace, or a requestAnimationFrame frame-time log, on a REAL device (or via remote debugging: Safari Web Inspector / chrome://inspect), scrolling in BOTH directions through the effect. Every performance change records before AND after numbers; a change that does not measurably help is reverted."
      devices:
        - "120 Hz iPhone or iPad, Safari (ProMotion)"
        - "mid-tier Android phone, Chrome (e.g. a 2–3-year-old Pixel a-series or Galaxy A)"
        - "desktop, Chrome + Safari"

  discoverability:
    json_ld: "valid (per SEO.md), 0 errors in Rich Results Test"
    social_cards: "OG + Twitter present on every page"
    crawl: "sitemap.xml + robots.txt + canonical on every page"
  fidelity:
    tokens_only: true           # UI uses exported tokens / CSS vars — no hardcoded #hex or raw oklch() in components

  # ── Viewport matrix: the ONE canonical list every change is built and checked at (Gate E) ──
  # size = CSS px width x height. input: touch → Playwright isMobile + hasTouch + the dpr shown;
  # mouse → desktop context. spec_key = the SPEC section `responsive:` key that governs the class.
  # Research §F.5 (device classes, iOS Safari behaviour).
  viewport_matrix:
    phone_portrait:
      spec_key: "phone"
      input: "touch"
      sizes:
        - { size: "320x568", dpr: 2 }    # smallest supported (iPhone SE 1st gen class)
        - { size: "360x780", dpr: 3 }    # compact Android
        - { size: "375x667", dpr: 2 }    # iPhone SE 2nd/3rd gen
        - { size: "390x844", dpr: 3 }    # iPhone 12–14
        - { size: "393x852", dpr: 3 }    # iPhone 15/16 class
        - { size: "412x915", dpr: 2.625 } # Pixel / Galaxy class
        - { size: "430x932", dpr: 3 }    # iPhone Pro Max / Plus class
    phone_landscape:
      spec_key: "phone_landscape"
      input: "touch"
      sizes:
        - { size: "667x375", dpr: 2 }
        - { size: "844x390", dpr: 3 }
        - { size: "932x430", dpr: 3 }
    tablet_portrait:
      spec_key: "tablet_portrait"
      input: "touch"
      sizes:
        - { size: "768x1024", dpr: 2 }   # iPad mini / classic iPad
        - { size: "820x1180", dpr: 2 }   # iPad Air / 10th gen
        - { size: "834x1194", dpr: 2 }   # iPad Pro 11
        - { size: "1024x1366", dpr: 2 }  # iPad Pro 12.9 / 13
    tablet_landscape:
      spec_key: "tablet_landscape"
      input: "touch"
      sizes:
        - { size: "1024x768", dpr: 2 }
        - { size: "1180x820", dpr: 2 }
        - { size: "1194x834", dpr: 2 }
        - { size: "1366x1024", dpr: 2 }
    laptop_short:
      spec_key: "laptop_short"
      input: "mouse"
      sizes:
        - { size: "1280x720", dpr: 1 }   # above-the-fold check (Gate E b)
        - { size: "1366x768", dpr: 1 }
        - { size: "1440x900", dpr: 2 }   # above-the-fold check (Gate E b)
    desktop:
      spec_key: "desktop_wide"
      input: "mouse"
      sizes:
        - { size: "1512x982", dpr: 2 }   # MacBook Pro 14 default
        - { size: "1728x1117", dpr: 2 }  # MacBook Pro 16 default
        - { size: "1920x1080", dpr: 1 }
        - { size: "2560x1440", dpr: 1 }  # wide: content caps + centers
    in_between_sweep:
      from_px: 320
      to_px: 1920
      step_px: 40
      height_px: 900
      note: "catches layouts that break BETWEEN the named sizes (incl. the 600–720 foldable zone); touch emulation below 768"
    out_of_scope: []    # sizes/classes deliberately not supported, e.g. "phone_landscape (rotate prompt)". Each item NEEDS a DECISIONS.md 'Viewport scope' entry.
    themes: "light AND dark both verified"

  content:
    matches_spec: true          # copy is verbatim from SPEC.md; reused content matches CONTENT.md
    no_placeholder: true        # no lorem ipsum / leftover slot syntax / banned words (DESIGN §Microcopy)

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
*Budgets: frontmatter `gates.performance` (this file is their single owner).*
- [ ] **Core Web Vitals** within `LCP_s_max`, `INP_ms_max`, `CLS_max` at **p75 of field data** (CrUX / RUM; ≥ `crux_good_pct_min`% of visits "good"). Pre-launch or low-traffic: lab via Lighthouse. **INP** comes from field data or a **Lighthouse timespan** run of real interactions (a navigation run cannot measure it); **TBT** (`TBT_ms_max_lab`) is the lab proxy, not a substitute. INP is the most-failed vital, so check it hardest.
- [ ] **LCP image:** AVIF/WebP, correctly sized, `fetchpriority="high"`, `width`/`height` set (zero CLS); fonts preloaded with metric-override fallbacks (DESIGN typography).
- [ ] **Weight:** initial route JS ≤ `js_kb_max_initial`; no render-blocking; code-split below the fold; images lazy-loaded below the fold.

## Gate B2 — Runtime smoothness (effects, scrolling, animation)
*Budgets: `gates.performance.runtime`. Method and devices: same block. Research §I.14 (effect cost ladder, frame budgets, adaptive quality).*
- [ ] **Every DESIGN `effects.registry` entry is measured** on each `runtime.devices` entry, scrolling **both directions** through it: p95 frame time ≤ `frame_p95_ms_max_120hz` on 120 Hz screens and ≤ `frame_p95_ms_max_60hz` on 60 Hz; no long task over `long_task_ms_max` during hydration or interaction. The numbers are written into the entry's `measured_p95_ms` + `devices` — an effect with no recorded number has not passed.
- [ ] **Limits:** live WebGL contexts ≤ `webgl_contexts_max` per page (past ~16 the browser drops the oldest context, which blanks that canvas); visible backdrop-filter layers ≤ `backdrop_filter_layers_max` at once.
- [ ] **Fallback and reduced-motion paths verified**, not just declared: force each entry's `fallback` (e.g. via the adaptive-quality step-down or a query flag) and turn on `prefers-reduced-motion`; both render correctly and stay within budget.
- [ ] **Failing budget = lower tier now.** If an effect misses, it ships at the next-lower ladder tier with a DECISIONS.md "Performance trade" entry. "Optimise later" is not a pass.
- [ ] **No blank or late images on a fast flick:** fling-scroll a gallery or long page on a phone; images are pre-decoded / queued ahead of the viewport (`decode()`, prefetch queue, sized placeholders) so nothing shows blank or pops in late.
- [ ] **Cache-safe asset replacement:** a replaced image/video/font gets a **new file name** (content hash or version), so no CDN or browser cache serves the old one.
- [ ] **No canvas covers content before its first frame:** a canvas/WebGL layer stays hidden (or transparent) until it has drawn, so it never paints black or empty over an already-loaded image.
- [ ] Every performance change carries **before and after numbers**; a change that does not measurably help is reverted.

## Gate C — Discoverability (per SEO.md)
- [ ] **JSON-LD** valid (0 errors in the Rich Results Test) for each page-type per `SEO.md`.
- [ ] **Social cards** (Open Graph + Twitter) on every page; OG image renders.
- [ ] **Crawl:** `sitemap.xml`, `robots.txt`, a `<link rel="canonical">` on every page; `llms.txt` if enabled.
- [ ] **AEO/GEO:** answer-first pages have a question heading + concise answer; FAQ/entity markup matches `SEO.md`.

## Gate D — Token fidelity (no drift)
- [ ] UI references the **exported tokens / CSS variables** (`npm run export`) — **no hardcoded `#hex`, `rgb()`, or raw `oklch()`** in component code.
- [ ] **Type, spacing, radius come from tokens too** — **font sizes** use the exported `--text-*` vars and **line-heights** use the `--leading-*` vars (both from `typography.roles`), **not raw `rem`/`px`/unitless literals**; spacing/radius from `--space-*`/`--radius-*`, not magic numbers. *(A purely decorative, `aria-hidden` glyph may use `line-height: 1`.)* If a needed token is missing from the export, **flag it** in the QA report — don't silently hardcode a value.
- [ ] Components match their `DESIGN.md` specs (variants, states, sizes), incl. the project's **surface-separation strategy** (per `DESIGN.md` + `DECISIONS.md` — don't substitute a different one).

## Gate E — Responsive & themes (the full viewport matrix)
*The matrix is frontmatter `gates.viewport_matrix` (single owner). Research §F.5. Runs on EVERY change to layout, type, spacing, motion or imagery, in the same turn, not only at the author's screen.*
- [ ] **(a) Automated sweep** (`PROJECT.workflow.viewport_sweep`, Playwright) over every `viewport_matrix` size **and** the `in_between_sweep`. Touch entries run with `isMobile: true`, `hasTouch: true` and their `deviceScaleFactor` (= `dpr`); mouse entries in a desktop context. At each size assert:
  - `document.documentElement.scrollWidth <= window.innerWidth` (no horizontal page scroll), **and**
  - **no element's box crosses the viewport edge** (`getBoundingClientRect().left < 0` or `.right > innerWidth`), unless an ancestor clips it (`overflow: hidden | clip`) or SPEC marks it as intentional off-canvas. This is what catches **long titles** and **moving text** (marquees, scroll-driven headlines).
  - Screenshots for every matrix entry, plus **start / mid / end** states of each scroll-driven animation (scroll to 0%, 50%, 100% of its range; run the edge assert at each state), saved to a **named folder** (e.g. `qa/viewports/<date>-<change>/`).
- [ ] **(b) Above the fold** at **1280×720** and **1440×900**: the content SPEC puts above the fold (headline + primary CTA at minimum) is visible without scrolling.
- [ ] **(c) Spacing at the wide end as well as the narrow end:** check **1920** and **2560** (section padding uses DESIGN `section_padding.wide`; content caps + centers, line length ≤ ~75ch, no stretched or empty voids), not only phones.
- [ ] **(d) Real iOS Safari:** load the change on a real iPhone (and iPad when tablets are in scope), via Safari Web Inspector if needed. Not done → that item is reported as **unverified**, never ✅.
- [ ] **Light AND dark** both verified on every page/screen (per DESIGN dark-mode rules).
- [ ] Container-query components behave in narrow containers; `out_of_scope` sizes each have a DECISIONS.md "Viewport scope" entry (and whatever covers them, e.g. a rotate prompt, works).

> **A resized desktop window does NOT satisfy this gate.** Desktop browsers stop shrinking at roughly 500 px wide, and a resized window emulates neither touch, DPR, `isMobile` layout viewport rules nor iOS Safari's toolbars and paint behaviour. Use the Playwright sweep for the matrix and a real device for (d).

## Gate E2 — Touch & iOS Safari
*Research §F.5 (iOS Safari behaviour). Applies whenever any touch entry in the matrix is in scope.*
- [ ] **Hover is enhancement only:** hover effects live under `@media (hover: hover) and (pointer: fine)`; every hover state has a touch `:active` equivalent; **no content or control is reachable only by hover**.
- [ ] **Scroll locks block every input:** wheel, `touchmove` and scroll keys (Space, PageUp/Down, arrows, Home/End) are all prevented while a loader, modal or menu is up. `overflow: hidden` on `body`/`html` alone **fails** on iOS touch.
- [ ] **No full-width fixed or sticky element touching the top or bottom screen edge** on touch screens (iOS Safari paints solid toolbar-coloured bars over it as its toolbars collapse) unless it has been tested on a real iPhone and looks right.
- [ ] **Dynamic viewport units:** full-height sections use `svh` / `dvh` (or `lvh` deliberately), never bare `100vh`.
- [ ] **Safe areas:** fixed and sticky elements pad with `env(safe-area-inset-*)` (with `viewport-fit=cover`).
- [ ] **Paint order:** decorative layers (scrims, shadows, glows, gradients) never paint before the content they back, so there is no flash of a dark shape with nothing on it.
- [ ] **60 Hz and 120 Hz both checked:** iOS Safari caps page-driven (`requestAnimationFrame` / JS) animation at **60 fps by default** while its scrolling runs at **120 Hz**, so a JS-driven effect visibly lags the scroll on ProMotion. Prefer CSS / WAAPI animations of `transform` / `opacity`, which run on the compositor.

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
3. **Don't weaken a gate to pass it.** Tune budgets in the frontmatter only with explicit intent, and log the change in `DECISIONS.md`. Don't shrink the viewport matrix to pass it either: a size leaves only through `viewport_matrix.out_of_scope` + a "Viewport scope" decision.
4. **Report per gate as a written artifact** (✅/❌ + what was fixed) — self-QA must leave **evidence**, not just be asserted in passing. Emit a `## QA results` section (or a `QA-RESULTS.md`) alongside the build; surface anything that can't be auto-verified (e.g. real-device checks) as **unverified** rather than silently passing it. Gate E evidence must **name the matrix and the screenshot folder**; Gate B2 evidence must **give the numbers and devices**. "Looks fine across breakpoints" is not evidence. Format:

```md
## QA results — <component/page>
- Gate A (a11y): ✅ — axe 0 critical; focus-visible ring; targets ≥24px
- Gate D (tokens): ✅ — colors/type/spacing all via vars; ran `npm run export`
- Gate B2 (runtime): ✅ — hero glass p95 7.9 ms on iPhone 15 Pro (120 Hz) / 14.8 ms on mid-tier Android (60 Hz), both directions, numbers in effects.registry; fallback + reduced-motion checked
- Gate E (responsive+themes): ✅ — gates.viewport_matrix 25/25 + 40 px sweep, 0 overflow / 0 edge crossings; screenshots in qa/viewports/2026-10-21-hero/; fold OK at 1280×720 + 1440×900; light+dark
- Gate E2 (touch + iOS): ⚠️ unverified — real-iPhone check not run this pass (everything else ✅)
- …one line per applicable gate, ❌ only if fixed-then-rechecked…
```

# Versioning
`template_version: 1.22.0`. Per-project `QA.md` instances should preserve this field.

# Source
Acceptance bars synthesized from 2026 premium-launch standards (WCAG 2.2 AA / axe zero-critical, Core Web Vitals budget, JSON-LD/AEO, token fidelity), with the viewport matrix and iOS Safari behaviour from research.md §F.5 and the runtime budgets and effect cost ladder from research.md §I.14. Background findings F6, F9 and F10 are in `docs/SYSTEM_RESEARCH.md` (in the premium.md repo, the release zip and the skill bundle). **This file is the single owner of every numeric performance budget and of the viewport matrix**; DESIGN.md and PROJECT.md point here. Only the contrast targets live in `DESIGN.md §Accessibility`, referenced above as `{design.a11y.contrast}`.
