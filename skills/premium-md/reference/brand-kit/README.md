# Brand Kit — viewer + palette generator

Optional tooling for `premium.md`. Two pieces that share one OKLCH/APCA library:

- **Palette generator** (`scripts/generate-palette.ts`) — *model-only, headless*. Given a brand color it
  derives the full 12-step color section of `DESIGN.md` (5 palettes × light + dark = 120 values),
  gamut-clamped and APCA-verified. The AI runs this when filling `DESIGN.md`; you never touch it.
- **Brand-kit viewer** (the Vite/React app) — *the thing you look at*. A static page that reads a
  project's `DESIGN.md` + `INFORMATION.md` and renders the whole kit: a **specimen** (every raw token)
  and a **composition** (the tokens assembled into components + sample layouts). Flip light/dark.

The ten markdown templates stay dependency-free; this `tools/` package is an optional accelerator.

**Requirements:** Node ≥ 22.18 (it runs the `.ts` scripts directly with built-in type stripping; `engines` in `package.json` says the same). The three scripts in `scripts/` need **no `npm install`**: their only third-party code, the `yaml` parser, is vendored as one file at `scripts/vendor/yaml.mjs` (ISC licence, regeneration steps in its header), and the OKLCH/APCA library is `src/lib/oklch.ts`. Run them as `node scripts/<name>.ts` or through the `npm run` aliases below. Only the viewer (`npm run dev` / `build`) needs `npm install`.

## Quick start

```bash
cd tools/brand-kit
npm install
npm run dev          # opens the viewer on the bundled sample project
```

Point it at your own project:

```bash
# finds DESIGN.md + INFORMATION.md inside the given root (root or one level deep)
npm run load -- --root /path/to/your/project
# or pass explicit paths:
npm run load -- --design /path/to/DESIGN.md --information /path/to/INFORMATION.md
npm run dev
```

Build a **static export** to open anywhere or share:

```bash
npm run build        # → dist/  (host it, or open via `npm run preview`)
```

## The generator (model-only)

```bash
npm run gen -- --base "oklch(0.49 0.12 162)" [--neutral-hue 85] [--neutral-chroma 0.2] [--saturation default]
```

- `--base` — the brand color in OKLCH (anchors step 9; the scale rebuilds around its lightness).
- `--neutral-hue` — neutral tint hue (default = brand hue). `--neutral-chroma` — tint intensity
  (default `0.25`; lower = closer to a clean off-white).
- Prints the `colors:` YAML block (stdout) + an APCA report (stderr).
- *How it derives the scale* (hue held constant, fixed lightness curve with step 9 = your brand L,
  chroma peaking mid-tone, a separately-authored dark ramp, sRGB gamut clamp, APCA targets) is the
  algorithm spec'd in `DESIGN_TEMPLATE_WEB.md` §Colors → "Generating the scale" and `research.md` §C.15 —
  this script is its exact implementation.

## Token export (docs → code)

Turn `DESIGN.md` into build-ready token files so the design tokens reach code **without hand-transcription** (the #1 docs→code drift source):

```bash
npm run export -- --root /path/to/your/project   # or --design /path/to/DESIGN.md
# default output: <project>/design-tokens/
```

Writes three files from the same source of truth:
- **`tokens.css`** — CSS custom properties: `:root` (light), `[data-theme="dark"]` (dark) and `[data-theme="light"]`, plus one `@media (min-width)` block per tier when DESIGN.md declares tiers. Palettes are concrete OKLCH; role tokens (`--surface-canvas`, `--text-primary`, …) are `var()` refs, repeated in both theme blocks so they switch on any element: a dark section inside a light page, or a light one inside a dark page, works as well as a dark document. Works with **any** stack.
- **`theme.css`** — a **Tailwind v4 `@theme`** block (imports `tokens.css`), mapping the tokens to utilities (`bg-primary-9`, `text-neutral-12`, `font-display`, `rounded-lg`, …).
- **`tokens.json`** — **W3C DTCG (2025.10)** tokens (`$type`/`$value`) — the standard interchange (Style Dictionary, Tokens Studio, Figma). Uses string `$value` for portability.

Runs on plain `node` ≥ 22.18 with no install. What it emits, by group:

| DESIGN.md source | `tokens.css` variables |
|---|---|
| `colors.<palette>.1..12` and `.dark.1..12` | `--<palette>-<step>`, concrete OKLCH; the dark ramp goes in `[data-theme="dark"]` |
| `colors.<group>.<role>` (`surface`, `border`, `text`, `semantic`, ...) and `colors.shadow_tint` | `--<group>-<role>` and `--shadow-tint`, as `var()` refs that switch with the theme |
| `colors.<group>.dark.<role>` (a dark-mode role override, see `DESIGN_TEMPLATE_WEB.md` §Colors → Dark mode) | the same `--<group>-<role>`, in `[data-theme="dark"]` |
| `typography.families` (+ `fallbacks` / `fallback_assignments`) | `--font-<family>`, with its fallback stack |
| `typography.roles.<role>`: `size`, `line_height`, `weight`, `letter_spacing` | `--text-<role>`, `--leading-<role>`, `--weight-<role>`, `--tracking-<role>` (`tracking` is still read for older docs) |
| `typography.roles.<role>.font_family` | `--font-role-<role>`, a `var()` to the role's family |
| `typography.roles.<role>.size_<tier>` | `--text-<role>` inside `@media (min-width: breakpoints.<tier>)` (a warning when that breakpoint does not exist) |
| `typography.axes.<family>.<tag>` | `--axis-<tag>` |
| `typography.measure_max_ch`, `typography.font_features` | `--measure`, `--font-features-<name>` |
| `spacing.scale`, `spacing.roles` | `--space-<step>`, `--space-<role>`; a role `X_<tier>` whose `X_desktop` sibling exists overrides `--space-X-desktop` in that tier's `@media` block |
| `radius.scale`, `radius.components` | `--radius-<step>`, `--radius-<component>` |
| `elevation.scale`, `elevation.components`, `surface_separation.border_width` | `--elev-<level>`, `--elev-<component>`, `--border-width` |
| `motion.duration`, `motion.easing` | `--duration-<name>` (times the active motion profile's multiplier), `--ease-<name>` |
| `containers`, `options.container_width` | `--container-<name>` (a value naming another container becomes its `var()`), `--container-default`; a key `<base>_<tier>` overrides `--container-<base>` in that tier's `@media` block |
| `breakpoints` | `--bp-<name>` (keys starting with `_`, such as `_freeze_points`, are records, never variables) |
| `section_padding` (active `profiles.section_padding`) | `--section-<kind>-<device>` |
| `states.focus_ring` | `--focus-ring-width`, `--focus-ring-offset`, `--focus-ring-color` |
| `touch_targets` | `--touch-min`, `--pointer-min` |
| `z_index`, `icons.sizes` | `--z-<layer>`, `--icon-<size>` |
| `components.<name>...` | `--<name>-<part>-<key>`: dimensions (numbers under size, padding, gap, radius and similar keys, in px) and color or token refs that fully resolve; behaviour subtrees (`states`, `rules`, `a11y`, copy) are skipped |

`theme.css` maps palettes and role colors (`--color-*`), fonts, type sizes (`--text-*`), type weights (`--font-weight-*`), radii and spacing (`--spacing-*`) into Tailwind's `@theme`. `tokens.json` (DTCG) carries `color` (palettes with their dark ramps), `fontFamily`, `fontSize`, `fontWeight`, `letterSpacing`, `duration`, `spacing` and `radius`.

A flat top-level `colors_dark_overrides` map keyed `group.role` is still read for older docs and lands in the same dark block; new docs use the `dark:` map inside the role group.

**Token names are dot-safe.** A dot is not allowed in a CSS custom-property name (and DTCG token names may not contain one), so a scale step whose key contains a dot is written with an underscore: `spacing.scale.0.5` becomes `--space-0_5` in `tokens.css`, `--spacing-0_5` in `theme.css` and `spacing.0_5` in `tokens.json`, and a `{spacing.scale.0.5}` reference resolves to `var(--space-0_5)`. The same rule covers radius and icon steps, type role names (`heading-5.5xl` becomes `--text-heading-5_5xl`, and `heading-5_5xl` in `tokens.json`) and container names. Names built from spacing roles, component parts, z-index layers and section padding use dashes instead (`_` and `.` both become `-`). Keys without a dot are unchanged (`--space-4`, `--radius-md`).

## Upgrading an existing project

A project set up on v1.21 or earlier carries its own copy of this exporter in `tools/brand-kit/`, often
extended. Those copies wrote some names differently: a dot in a key became `-` (`--text-heading-5-5xl`,
`--space-0-5`), spacing roles had no `--space-` prefix (`--container-padding-desktop`,
`--section-pad-mobile`, `--ui-scale-desktop`), container keys used `-` for `_` (`--container-full-cap`),
and the measure was `--measure-max`. Since v1.23.1 every one of those names is still emitted, as a
deprecated alias that points at the current name (`--text-heading-5-5xl: var(--text-heading-5_5xl);`),
in a commented block at the end of `:root`; `theme.css` keeps the old utility names the same way, and
breakpoints (`--bp-*`), role families (`--font-role-*`), font axes (`--axis-*`) and the `@media` tier
blocks are emitted as current names. Nothing in your CSS has to change on upgrade. Move to the current
names when convenient; the aliases go in a future major release. The one kind of old name that is not
re-emitted is a name with a literal dot (`--space-0.5`, written by the unmodified v1.21 exporter): it was
never valid CSS, so no stylesheet can be using it.

Before you replace a committed `design-tokens/tokens.css` with a fresh export, check it:

```bash
node scripts/export-tokens.ts --design /path/to/DESIGN.md --out /tmp/new-tokens
node scripts/compare-tokens.ts --old /path/to/design-tokens/tokens.css --new /tmp/new-tokens/tokens.css
```

`compare-tokens.ts` resolves every custom property the way a browser does (a `var()` is substituted on
the element that declares it) in `:root`, a dark document, a dark section in a light page, a light
section in a dark page and each `@media` tier, and lists every old property that is missing or computes
to a different value there. Exit 0 means the new file is a drop-in replacement. Values are compared as
written after whitespace and quote normalisation, so `88` and `88px` count as different. A listed change
is not always a regression: a role that the old file left on the light ramp inside a dark section is
listed too, because the new file fixes it; read each one before deciding.

## Icons

The viewer renders the project's chosen icon family, read from `icons.library` in `DESIGN.md`:
**`lucide` · `phosphor` · `heroicons` · `tabler` · `hugeicons`** are bundled. Anything else
(`custom`, a Pro set) falls back to a Lucide placeholder with a note — wire it in `src/iconAdapter.tsx`.

## How it routes a DESIGN.md into the kit

`scripts/load-tokens.ts` parses the YAML frontmatter, resolves every `{group.path}` reference, copies the
brand logos, and writes `src/data/{tokens,brand}.json` (or `<dir>/{tokens,brand}.json` plus `<dir>/assets/`
with `--out <dir>`, which is how to run it from the Agent Skill bundle, where there is no viewer). `src/applyTokens.ts` turns the color/radius/
elevation/font tokens into CSS variables (one set per theme); fonts load at runtime from
`typography.families`. The token paths the viewer relies on are the **token contract** documented in
`DESIGN_TEMPLATE_WEB.md`.

## Related tools

Two sibling tools check a build against the docs this kit reads:

- **`tools/qa-harness/`**: `node tools/qa-harness/run-qa.mjs --url http://localhost:<PORT>` runs QA Gates E, E2, A (motion part), B (lab) and B2 and writes `qa/results/<date>.{json,md}` plus `qa/viewports/<date>/`. Needs Playwright as a devDependency of the project it checks.
- **`tools/doc-sync/`**: `node tools/doc-sync/check-drift.mjs --root .` is QA Gate H. Among its checks it re-exports `DESIGN.md` into a temp dir with the project's own exporter and flags any token file whose content differs, so after any token change re-run `npm run export` in the same change.
