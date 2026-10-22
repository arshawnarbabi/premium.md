---
name: premium-md
description: >-
  Build a premium product's website and/or app end to end from a single source of truth — set up the
  brand and design system, run a structured intake to populate the docs, generate an OKLCH color palette
  with verified dark mode, write the page/screen copy, and self-QA against a premium acceptance gate.
  Use when the user wants to build or design a premium website, web app, or mobile app; set up a design
  system, brand kit, or design tokens; run a product/brand intake to capture decisions; generate a brand
  color palette; or turn brand/design docs into production UI. Never fabricates brand decisions.
version: "1.22.0"
---

# Premium Product Builder

This skill turns you into a reliable premium-md builder using the **premium.md** system (v1.22.0): a set of markdown docs that hold a brand's design system, content, and final copy, plus a QA gate — so you build a premium website and/or app from one source of truth, **without inventing brand decisions**.

## Reference material (load on demand — do NOT read it all up front)

Everything is in `reference/` next to this file:

- **`reference/templates/`** — the 10 templates. **Read `PROJECT_TEMPLATE.md` first** — it's the orchestrator and carries the authoritative protocols (the intake protocol, the status protocol, cross-template consistency rules, and the build process). The others: `INFORMATION` (brand/audience/voice), `CONTENT` (reusable records), `DESIGN_TEMPLATE_WEB` / `DESIGN_TEMPLATE_MOBILE` (visual systems), `SPEC_TEMPLATE_WEB` / `SPEC_TEMPLATE_MOBILE` (every word of copy + layout), `SEO` (discoverability), `QA` (the done-gate), `DECISIONS` (locked-choice log).
- **`reference/research.md`** — the brand-agnostic premium-standard research the templates cite by section, §A to §Z: design and platform standards §A to §W (including the viewport matrix and iOS Safari behaviour §F.5, and runtime performance, the effect cost ladder and frame budgets §I.14), microcopy §X, marketing & conversion copy §X2, discoverability (SEO/AEO/GEO) §X3, build process §X4, measured reference data §Y, open questions §Z. Read the cited section when you need the "why" behind a rule. Its **Freshness protocol** (top of the file) governs time-sensitive claims: anything tagged `[verify-current · last verified YYYY-MM]` that is older than about 6 months is re-checked against current sources before a template default or a build decision relies on it; durable principles are never re-researched.
- **`reference/docs/SYSTEM_RESEARCH.md`**: the workflow-level research log (findings F1 to F15) that some templates cite for background.
- **`reference/brand-kit/scripts/`**: Node scripts that run on plain `node` ≥ 22.18 (built-in TypeScript type stripping) with **no `npm install`**: the YAML parser they need is vendored at `scripts/vendor/yaml.mjs` and the OKLCH/APCA library at `src/lib/oklch.ts`. `generate-palette.ts` (12-step OKLCH palette + gamut-clamped, APCA-verified dark mode), `export-tokens.ts` (emits `tokens.css` / `theme.css` / DTCG `tokens.json`; token names are dot-safe, so scale step `0.5` becomes `--space-0_5`), `load-tokens.ts` (pass `--out <dir>` when running it from here). Example: `node reference/brand-kit/scripts/export-tokens.ts --design DESIGN.md --out design-tokens`.

## How to use this skill

1. **Orient.** Read `reference/templates/PROJECT_TEMPLATE.md` — it declares which files a project uses, their priority order, and the protocols you must follow.
2. **Instantiate.** Copy the templates this project needs into the project, renaming each (`PROJECT_TEMPLATE.md` → `PROJECT.md`, etc.). Only include the files the project type needs (marketing-site / product-saas / mobile-app / hybrid).
3. **Run the intake.** Follow PROJECT.md's **Interactive Population Protocol** verbatim — produce the structured intake form (PART 0 drafts to approve · PART 1 must-fill · PART 2 defaults), then fill the templates in the declared order, derive the palette + dark mode with the brand-kit, and propagate shared values across files.
4. **Honor the Status protocol.** Mark AI-**inferred** values `# draft` and accepted **out-of-box defaults** `# default`; an unmarked filled value must be the user's own. Emit the state ledger on every audit; never let an unmarked value imply an approval it didn't get. (PROJECT.md → §Status protocol.)
5. **Build as a loop, not one pass.** read the docs → plan → generate against the **exported tokens** (never hardcode `#hex`/raw `oklch()`) → self-QA against `QA.md` → fix → repeat. Pick the build mode and use the visual-iteration loop in research §X4. Every change gets a **viewport sweep on every change (QA Gate E/E2)**: each class in QA.md `gates.viewport_matrix` (phones portrait and landscape, tablets portrait and landscape, short laptop, desktop and wide), built in the same change as desktop from each SPEC section's `responsive:` block, never after the fact. Every effect gets **a measured runtime result for every effect (Gate B2)**: it is registered in DESIGN `effects.registry` at the cheapest tier that achieves it, with a fallback and a reduced-motion variant, and its frame-time p95 is measured on the `gates.performance.runtime` devices against the budgets QA.md owns. The build isn't done until every QA gate is green.
6. **Never fabricate.** If a value isn't in the docs, ask. Real, approved data only — no invented testimonials, metrics, or customer names (CONTENT.md + QA Gate F). Pre-launch projects legitimately have empty proof records.

## Progressive disclosure (keep context lean)

Pull a template or a research section into context **only when the step needs it** — e.g. read `DESIGN_TEMPLATE_WEB.md` + research §C when generating colors; `SEO_TEMPLATE.md` + research §X3 when doing discoverability; `SPEC_TEMPLATE_*` + research §X2 when writing copy. Don't preload `research.md` (it's large); reach for the cited section.

## Provenance

Generated from the **premium.md** repo, v1.22.0 (MIT). The `reference/` bundle is produced from the repo's canonical sources by `scripts/build-skill.sh` — treat it as read-only; edit the canonical templates/research instead.
