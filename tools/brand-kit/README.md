# Brand Kit — viewer + palette generator

Optional tooling for `premium.md`. Two pieces that share one OKLCH/APCA library:

- **Palette generator** (`scripts/generate-palette.ts`) — *model-only, headless*. Given a brand color it
  derives the full 12-step color section of `DESIGN.md` (5 palettes × light + dark = 120 values),
  gamut-clamped and APCA-verified. The AI runs this when filling `DESIGN.md`; you never touch it.
- **Brand-kit viewer** (the Vite/React app) — *the thing you look at*. A static page that reads a
  project's `DESIGN.md` + `INFORMATION.md` and renders the whole kit: a **specimen** (every raw token)
  and a **composition** (the tokens assembled into components + sample layouts). Flip light/dark.

The six markdown templates stay dependency-free — this `tools/` package is an optional accelerator.

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
- **`tokens.css`** — CSS custom properties: `:root` (light) + `[data-theme="dark"]` (dark). Palettes are concrete OKLCH; role tokens (`--surface-canvas`, `--text-primary`, …) are `var()` refs that auto-switch with the theme. Works with **any** stack.
- **`theme.css`** — a **Tailwind v4 `@theme`** block (imports `tokens.css`), mapping the tokens to utilities (`bg-primary-9`, `text-neutral-12`, `font-display`, `rounded-lg`, …).
- **`tokens.json`** — **W3C DTCG (2025.10)** tokens (`$type`/`$value`) — the standard interchange (Style Dictionary, Tokens Studio, Figma). Uses string `$value` for portability.

Dependency-free (`node`, no install). Covers colors (5 palettes × light+dark + role tokens), font families, spacing, radius, elevation, and `border-width`.

## Icons

The viewer renders the project's chosen icon family, read from `icons.library` in `DESIGN.md`:
**`lucide` · `phosphor` · `heroicons` · `tabler` · `hugeicons`** are bundled. Anything else
(`custom`, a Pro set) falls back to a Lucide placeholder with a note — wire it in `src/iconAdapter.tsx`.

## How it routes a DESIGN.md into the kit

`scripts/load-tokens.ts` parses the YAML frontmatter, resolves every `{group.path}` reference, copies the
brand logos, and writes `src/data/{tokens,brand}.json`. `src/applyTokens.ts` turns the color/radius/
elevation/font tokens into CSS variables (one set per theme); fonts load at runtime from
`typography.families`. The token paths the viewer relies on are the **token contract** documented in
`DESIGN_TEMPLATE_WEB.md`.
