---
name: premium-product
description: >-
  Build a premium product's website and/or app end to end from a single source of truth — set up the
  brand and design system, run a structured intake to populate the docs, generate an OKLCH color palette
  with verified dark mode, write the page/screen copy, and self-QA against a premium acceptance gate.
  Use when the user wants to build or design a premium website, web app, or mobile app; set up a design
  system, brand kit, or design tokens; run a product/brand intake to capture decisions; generate a brand
  color palette; or turn brand/design docs into production UI. Never fabricates brand decisions.
version: "1.21.0"
---

# Premium Product Builder

This skill turns you into a reliable premium-product builder using the **premium-product-templates** system (v1.21.0): a set of markdown docs that hold a brand's design system, content, and final copy, plus a QA gate — so you build a premium website and/or app from one source of truth, **without inventing brand decisions**.

## Reference material (load on demand — do NOT read it all up front)

Everything is in `reference/` next to this file:

- **`reference/templates/`** — the 10 templates. **Read `PROJECT_TEMPLATE.md` first** — it's the orchestrator and carries the authoritative protocols (the intake protocol, the status protocol, cross-template consistency rules, and the build process). The others: `INFORMATION` (brand/audience/voice), `CONTENT` (reusable records), `DESIGN_TEMPLATE_WEB` / `DESIGN_TEMPLATE_MOBILE` (visual systems), `SPEC_TEMPLATE_WEB` / `SPEC_TEMPLATE_MOBILE` (every word of copy + layout), `SEO` (discoverability), `QA` (the done-gate), `DECISIONS` (locked-choice log).
- **`reference/research.md`** — the brand-agnostic premium-standard research the templates cite by section: design §A–§W, microcopy §X, marketing & conversion copy §X2, discoverability (SEO/AEO/GEO) §X3, build process §X4. Read the cited section when you need the "why" behind a rule.
- **`reference/brand-kit/`** — dependency-free Node scripts (run on plain `node`): `generate-palette.ts` (12-step OKLCH palette + gamut-clamped, APCA-verified dark mode), `export-tokens.ts` (emits `tokens.css` / `theme.css` / DTCG `tokens.json`), `load-tokens.ts`.

## How to use this skill

1. **Orient.** Read `reference/templates/PROJECT_TEMPLATE.md` — it declares which files a project uses, their priority order, and the protocols you must follow.
2. **Instantiate.** Copy the templates this project needs into the project, renaming each (`PROJECT_TEMPLATE.md` → `PROJECT.md`, etc.). Only include the files the project type needs (marketing-site / product-saas / mobile-app / hybrid).
3. **Run the intake.** Follow PROJECT.md's **Interactive Population Protocol** verbatim — produce the structured intake form (PART 0 drafts to approve · PART 1 must-fill · PART 2 defaults), then fill the templates in the declared order, derive the palette + dark mode with the brand-kit, and propagate shared values across files.
4. **Honor the Status protocol.** Mark AI-**inferred** values `# draft` and accepted **out-of-box defaults** `# default`; an unmarked filled value must be the user's own. Emit the state ledger on every audit; never let an unmarked value imply an approval it didn't get. (PROJECT.md → §Status protocol.)
5. **Build as a loop, not one pass.** read the docs → plan → generate against the **exported tokens** (never hardcode `#hex`/raw `oklch()`) → self-QA against `QA.md` → fix → repeat. Pick the build mode and use the visual-iteration loop in research §X4; the build isn't done until every QA gate is green.
6. **Never fabricate.** If a value isn't in the docs, ask. Real, approved data only — no invented testimonials, metrics, or customer names (CONTENT.md + QA Gate F). Pre-launch projects legitimately have empty proof records.

## Progressive disclosure (keep context lean)

Pull a template or a research section into context **only when the step needs it** — e.g. read `DESIGN_TEMPLATE_WEB.md` + research §C when generating colors; `SEO_TEMPLATE.md` + research §X3 when doing discoverability; `SPEC_TEMPLATE_*` + research §X2 when writing copy. Don't preload `research.md` (it's large); reach for the cited section.

## Provenance

Generated from the **premium-product-templates** repo, v1.21.0 (MIT). The `reference/` bundle is produced from the repo's canonical sources by `scripts/build-skill.sh` — treat it as read-only; edit the canonical templates/research instead.
