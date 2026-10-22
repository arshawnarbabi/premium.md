# Doc sync

`check-drift.mjs` is QA **Gate H: docs match the build**. It finds the places where the product docs and
the code have drifted apart, so a stale doc is caught in the same change instead of misleading the next
session. Plain Node 22.18 or newer, no install.

## Usage

```bash
# from the project root
node <skill>/reference/doc-sync/check-drift.mjs --root .
# in a clone of the premium.md repo the same file is tools/doc-sync/check-drift.mjs

node check-drift.mjs [--root .] [--since <git-ref>] [--src src,app,components] [--keys k1,k2] [--min 12] [--json]
node check-drift.mjs --help
```

Run it at the end of every change, after the other gates. `--since main` scopes the git check to a branch.
Exit 0 when clean, 1 on any drift, 2 for a setup problem. The YAML parser is the one vendored in
`../brand-kit/scripts/vendor/yaml.mjs`, so keep this folder next to `brand-kit/`.

## The three checks

| Check | Finds | Fix |
|---|---|---|
| **COPY** | A string under a copy key in `SPEC.md`, `SPEC_MOBILE.md` or `CONTENT.md` (frontmatter and fenced `yaml` blocks) that does not appear in the source tree: the doc says something the site does not. | Update whichever side is wrong, in the same change. |
| **GIT** | Source files changed since `--since` (default: the last commit that touched a product doc, plus everything uncommitted) while no product doc changed: code changed with no doc update. | Write the change into its owning doc, or say in the QA results why none was needed. |
| **TOKENS** | A generated token export (any `.css` / `.json` whose header says `Generated from <DESIGN>.md by ...`, as `export-tokens.ts` writes) older than its DESIGN doc. | Re-run `npm run export` / `export-tokens.ts`. |

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
escapes, inline tags and `"a " + "b"` concatenation are normalised on both sides. Strings with an unfilled
`<slot>` are skipped; `{ref}` and `{{slot}}` parts split a string into literal pieces, each checked on its
own; pieces under `--min` characters are skipped. A match that differs only in letter case is noted, not
counted as drift.

**Product docs** are PROJECT, INFORMATION, DESIGN, DESIGN_MOBILE, SPEC, SPEC_MOBILE, CONTENT, SEO, QA and
DECISIONS `.md`, at the root or in `docs/`. Source folders default to whichever of `src`, `app`,
`components`, `pages`, `lib`, `content`, `data` exist, plus root `*.html`; build output, `node_modules`,
`qa/` and `design-tokens/` are skipped. Outside a git repository the GIT check is skipped and says so.

## Gate H pass bar

Exit 0, or every finding listed in the QA results with its reason (for example "copy intentionally pending:
SPEC holds the approved line, the component ships it next release"). An unexplained finding fails the gate.
