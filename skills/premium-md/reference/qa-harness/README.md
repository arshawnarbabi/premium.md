# QA harness

`run-qa.mjs` is the shipped, framework-agnostic checker for the automated half of a premium.md `QA.md`.
Run it instead of writing your own sweep. It reads the project's docs, drives Playwright against a running
site, and leaves evidence a reviewer can open.

## Usage

```bash
# from the project root, with the site running (a production build gives real Gate B numbers)
node <skill>/reference/qa-harness/run-qa.mjs --url http://localhost:4173
# in a clone of the premium.md repo the same file is tools/qa-harness/run-qa.mjs

node run-qa.mjs --url <http://localhost:PORT> [--root .] [--out qa] [--only E,E2,A,B,B2]
                [--paths /,/about] [--expect "main h1"] [--shots full|viewport|none] [--concurrency 4]
node run-qa.mjs --help
```

Needs Node 22.18 or newer and Playwright as a devDependency of the project being checked (it is resolved
from `--root`, not from this folder). Without it the script prints the install command and exits 2:

```bash
npm i -D playwright && npx playwright install chromium webkit
```

The YAML parser is the one vendored in `../brand-kit/scripts/vendor/yaml.mjs`, so keep this folder next to
`brand-kit/` (the repo's `tools/` and the skill's `reference/` both do).

## What it reads

- `QA.md` frontmatter (root or `docs/`): `gates.viewport_matrix` (every class with `sizes`, `input`, `dpr`;
  `in_between_sweep`; `out_of_scope`; `themes`), `gates.performance` and `gates.performance.runtime`.
- `DESIGN.md` (or `DESIGN_MOBILE.md`) frontmatter: `effects.registry`, `effects.limits`, and
  `options.container_width` / `containers` for the wide-end check.

## What each check maps to

| QA gate | Checks |
|---|---|
| **E** (a) | Every matrix size x theme in Chromium (touch classes with `isMobile`, `hasTouch`, their `dpr`): no horizontal scroll, no element crossing the viewport edge unless an ancestor clips it, and the page actually rendered. A screenshot per size and theme. The dark theme must paint differently from light. Then the `in_between_sweep`. |
| **E** (b), (c) | Above the fold at 1280x720 and 1440x900 (the `h1` and the first link or button after it). The wide end at 1920 and 2560: text lines at most 75ch in their own font, content capped near the DESIGN container and centred. |
| **E** (d) | Real iOS Safari: always **unverified**. Emulation never satisfies it. |
| **E2** | WebKit (emulated) on every touch size. From the served CSS: `:hover` only inside `(hover: hover)` with an `:active` or `:focus-visible` twin, no bare `vh`, and full-width fixed or sticky bars at the screen edge (reported **unverified** until checked on an iPhone). Scroll locks and real 60 / 120 Hz: **unverified**. |
| **A** (motion part) | `prefers-reduced-motion: reduce` renders with no endless transform animation and no smooth scrolling; `forced-colors: active` renders without overflow (screenshot to review). |
| **B** | Lab run on a 412x915 phone, 150 ms RTT, 1.6 Mbps, 4x CPU: LCP, CLS, TBT (from long tasks) and initial JS gzipped, against `gates.performance`. A dev server is detected and its numbers are marked **unverified**. Field CWV and field INP: **unverified**. |
| **B2** | Load long tasks; live WebGL contexts; continuous loops in view; visible backdrop-filter layers. A scripted touch scroll on a phone (4x CPU) and a mouse scroll on desktop, both directions, collecting rAF frame times: p95 against the 60 Hz budget. Each `effects.registry` entry is found by `[data-effect="<name>"]` and scrolled through both ways. Registry entries must carry a fallback, a reduced-motion path, `measured_p95_ms` and `devices`. |

When `effects.registry` is empty and the page runs no WebGL, canvas, video, backdrop-filter, endless
animation or rAF loop, the frame-time checks report **n/a** with that reason (they still fail if scrolling
misses the 60 Hz budget anyway).

**What it cannot measure.** Headless browsers render at 60 Hz, so the 120 Hz budget is always
**unverified** in the lab (it fails only when the 60 Hz budget already fails). The numbers written into each
registry entry's `measured_p95_ms` still come from the real `runtime.devices`, measured by hand. Gates A (axe,
contrast, keyboard), C, D, F and G are not covered; Gate H is `../doc-sync/check-drift.mjs`.

## Output

- `<out>/results/<date>.json`: every check with status and numbers.
- `<out>/results/<date>.md`: a table per gate, ready to paste into the QA results.
- `<out>/viewports/<date>/`: `<class>-<size>-<theme>.png`, `webkit-*.png`, `wide-*.png`, `pref-*.png`.

Each check is `pass`, `fail`, `unverified` (needs a device, real users or a person) or `n/a`. Exit code 0
only when nothing failed, 1 when a check failed, 2 for a setup problem (no Playwright, site not reachable,
no viewport matrix).
