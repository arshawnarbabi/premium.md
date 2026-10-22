# Doc sync

`check-drift.mjs` is QA **Gate H: docs match the build**. It finds the places where the product docs and
the code have drifted apart, so a stale doc is caught in the same change instead of misleading the next
session. Plain Node 22.18 or newer, no install.

## Usage

```bash
# from the project root
node <skill>/reference/doc-sync/check-drift.mjs --root .
# in a clone of the premium.md repo the same file is tools/doc-sync/check-drift.mjs

node check-drift.mjs [--root .] [--since <git-ref>] [--src src,app,components] [--keys k1,k2] [--min 12]
                    [--reverse] [--reverse-ignore dir/,file.tsx] [--exporter <export-tokens.ts>] [--tokens-mtime] [--json]
node check-drift.mjs --help
```

Run it at the end of every change, after the other gates. `--since main` scopes the git check to a branch.
Exit 0 when clean, 1 on any drift, 2 for a setup problem. The YAML parser is the one vendored in
`../brand-kit/scripts/vendor/yaml.mjs`, so keep this folder next to `brand-kit/`.

## The checks

| Check | Finds | Fix |
|---|---|---|
| **COPY** | A string under a copy key in `SPEC.md`, `SPEC_MOBILE.md` or `CONTENT.md` (frontmatter and fenced `yaml` blocks) that does not appear in the source tree: the doc says something the site does not. | Update whichever side is wrong, in the same change. |
| **GIT** | Source files changed since `--since` (default: the last commit that touched a product doc, plus everything uncommitted) while no product doc changed: code changed with no doc update. | Write the change into its owning doc, or say in the QA results why none was needed. |
| **TOKENS** | A generated token export (any `.css` / `.json` whose header says `Generated from <DESIGN>.md by ...`, plus the `tokens.json` and `theme.css` written beside such a `tokens.css`) whose content differs from a fresh export of its DESIGN doc. | Re-run `npm run export` / `export-tokens.ts`. |
| **REVERSE** (opt-in) | User-visible copy in the code that no SPEC, SPEC_MOBILE, CONTENT, SEO or INFORMATION doc holds: "in code, not in docs", with file:line. | Write the string into the doc that owns it (usually SPEC or CONTENT), or fix the code. |

**Copy keys.** PROJECT.md frontmatter `copy_keys:` when set, else the defaults below. `--keys` overrides
both for one run. A `copy_keys:` list replaces the defaults, so keep the ones you still use.

The defaults are every key the SPEC (web and mobile) and CONTENT templates use for shipped copy, plus `q`
and `a`, the short FAQ form many SPECs use:

eyebrow, headline, subhead, heading, title, tagline, one_line, intro_line, trust_marker, body, copy,
description, caption, detail, summary, bio, quote, cta, label, alt, accessibility_label,
placeholder, helper, helper_text, legal_consent, sign_up_link, yearly_discount_label, question,
answer, q, a, message, banner, empty_message, error_message, success_message,
if_denied_settings_link, reason, required, min_length, copied, saved, sent, deleted, subscribed,
syncing, generic, network, network_slow, not_found, permission_denied, rate_limited,
quota_near_limit, unsaved_changes, subject, preview, body_template

Left out on purpose: app-store listing fields (they ship to the store, not the code) and keys that also
hold routes or ids (`name`, `value`, `offline`, `pattern`). Add any of them, or your own keys, with
`copy_keys:`.

**Matching.** Whitespace, curly quotes, dashes, non-breaking spaces, HTML entities, JSX `{" "}`, string
escapes, inline tags and `"a " + "b"` concatenation (same quote on both sides, across lines too) are
normalised on both sides. Strings with an unfilled
`<slot>` are skipped; `{ref}` and `{{slot}}` parts split a string into literal pieces, each checked on its
own; pieces under `--min` characters are skipped. A match that differs only in letter case is noted, not
counted as drift.

**Tokens are checked by content.** A DESIGN.md edit that changes no token (prose, a rationale, a
comment) is not drift, so the check does not compare timestamps: it re-exports the DESIGN doc into a temp
directory and compares the files byte for byte (the design path in the header line is ignored). The
project is never written to: the exporter runs with `--out <temp>` and its working directory in the temp
dir, and the export files are hashed before and after (a change exits 2). The exporter, per file:

1. `--exporter <path>`, for files whose header names `export-tokens.ts`;
2. the tool named in the file's header when that path exists under the root (`Generated from DESIGN.md by tools/export-extra-tokens.ts` runs `tools/export-extra-tokens.ts`);
3. for `export-tokens.ts`: the project's own copy, the first of `tools/brand-kit/scripts/`, `brand-kit/scripts/`, `scripts/`, so the output matches the exporter that made the file; otherwise the one bundled beside this tool (`../brand-kit/scripts/export-tokens.ts`).

The exporter must accept `--design` and `--out`. When none is found, it takes no `--out`, it fails, or it
does not produce that file, the check falls back to timestamps (last commit for a clean tracked file,
else mtime) and says "could not verify, timestamp only" for that file. `--tokens-mtime` forces the
timestamp check for every file.

**Reverse copy check.** Off by default, so turning it on is a deliberate step for an existing project:
pass `--reverse`, or set `doc_sync: { reverse: true }` in PROJECT.md frontmatter to make it part of every
Gate H run. Findings then count as drift. What it collects:

- JSX text. Text inside inline tags (`a`, `em`, `strong`, `span`, `code` and the other phrasing tags)
  joins the surrounding run, so `<p>Roasted <em>fresh</em> daily</p>` is one string; any other element,
  two elements side by side, and any non-string `{expression}` split it.
- Copy attributes: `title`, `alt`, `aria-label`, `aria-description`, `placeholder`, `label`, `summary`,
  `caption`, as a string or a `{string expression}`.
- Object fields named by a copy key (the copy keys above, their camelCase forms such as `helperText`,
  and any `doc_sync.reverse_keys` you add), in any JS or TS file, which covers content and data files such
  as a `workProjects.ts` or the `q` / `a` records of an FAQ. A string or an array of strings.
- `.html` files: text between tags, the same attributes, and `<meta name="description">` content.

`"a" + "b"` concatenation joins (across lines too); a template literal splits at each `${expr}`; a
ternary yields both branches. Normalised like the forward check (whitespace, quotes, dashes, entities).
Ignored: strings under `--min`, strings with no letter, URLs, paths and file names, identifier-like
strings, inline CSS, the tail of a split string (", opens in a new tab"), comments, imports and every
other attribute (`className`, `href`, `src`, `style`, ...), `<style>`, `<script>`, `<code>` and `<pre>`
content, test and story files (`*.test.*`, `*.spec.*`, `__tests__/`, ...), developer-only files (a
`dev/`, `debug/`, `playground/` or `internal/` folder, or a file named like `HeroDevPanel.tsx`), and
control definitions (an object that also has `min` and `max`, `step`, `default` or a shader: a tuning
panel or a form schema, not page copy). Skip more with `--reverse-ignore` path prefixes or
`doc_sync.reverse_ignore: [...]` in PROJECT.md. A doc string with `{ref}` parts matches any code string
that has its literal parts in order.

JS, TS and JSX are read by a built-in scanner (no install, also on TypeScript 7 projects, whose compiler
has no JS API). On a 102-file Next.js site it finds exactly the strings the TypeScript compiler API finds.
A file it cannot follow is listed as skipped, never silently passed.

**Product docs** are PROJECT, INFORMATION, DESIGN, DESIGN_MOBILE, SPEC, SPEC_MOBILE, CONTENT, SEO, QA and
DECISIONS `.md`, at the root or in `docs/`. Source folders default to whichever of `src`, `app`,
`components`, `pages`, `lib`, `content`, `data` exist, plus root `*.html`; build output, `node_modules`,
`qa/` and `design-tokens/` are skipped. Outside a git repository the GIT check is skipped and says so.

## Gate H pass bar

Exit 0, or every finding listed in the QA results with its reason (for example "copy intentionally pending:
SPEC holds the approved line, the component ships it next release"). An unexplained finding fails the gate.
