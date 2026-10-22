#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────
// check-drift.mjs: QA Gate H, "the docs match the build". Plain Node (>= 22.18), no install.
// Three checks:
//   COPY    every shipped-copy string in SPEC.md / SPEC_MOBILE.md / CONTENT.md (string values under
//           the copy keys) appears in the source tree. A miss = the doc says something the site doesn't.
//   GIT     source files changed since a ref while no product doc changed in that range
//           = "code changed with no doc update".
//   TOKENS  a generated token export (export-tokens.ts output) older than the DESIGN doc it came from.
// Exit 0 clean, 1 on any drift, 2 on a setup problem.
// ─────────────────────────────────────────────────────────────────────────
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve, relative, dirname, extname } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

// Every key the SPEC_WEB, SPEC_MOBILE and CONTENT templates use for shipped copy (plus q / a, the common
// short FAQ form). App-store listing fields and keys that also hold routes or ids (name, value, offline,
// pattern) are left out; a project adds them with PROJECT.md `copy_keys:`.
const DEFAULT_KEYS = [
  "eyebrow", "headline", "subhead", "heading", "title", "tagline", "one_line", "intro_line", "trust_marker",
  "body", "copy", "description", "caption", "detail", "summary", "bio", "quote", "cta", "label", "alt",
  "accessibility_label", "placeholder", "helper", "helper_text", "legal_consent", "sign_up_link",
  "yearly_discount_label", "question", "answer", "q", "a", "message", "banner", "empty_message",
  "error_message", "success_message", "if_denied_settings_link", "reason", "required", "min_length",
  "copied", "saved", "sent", "deleted", "subscribed", "syncing", "generic", "network", "network_slow",
  "not_found", "permission_denied", "rate_limited", "quota_near_limit", "unsaved_changes", "subject",
  "preview", "body_template"
];
const wrap = (list, w = 96) => list.join(", ").replace(new RegExp(`(.{1,${w}})(, |$)`, "g"), "  $1,\n").replace(/,\n$/, "");

const HELP = `Usage: node check-drift.mjs [--root .] [--since <git-ref>] [--src src,app,components] [--keys k1,k2] [--min 12] [--json]

  --root <dir>     project root (product docs at the root or in docs/), default .
  --since <ref>    git range start for the GIT check; default: the last commit that touched a
                   product doc. Uncommitted changes are always included.
  --src <list>     source folders, comma separated; default: whichever of
                   src, app, components, pages, lib, content, data exist (plus root *.html)
  --keys <list>    copy keys to check, comma separated (overrides PROJECT.md copy_keys)
  --min <n>        ignore copy strings shorter than n characters, default 12
  --json           machine-readable output
  --help           this text

Copy keys: PROJECT.md frontmatter \`copy_keys:\` when set, else:
${wrap(DEFAULT_KEYS)}`;

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const arg = (n, def) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : def; };
if (flag("help") || flag("h")) { console.log(HELP); process.exit(0); }
const ROOT = resolve(arg("root", "."));
const MIN = Number(arg("min", "12"));
const JSON_OUT = flag("json");
const HERE = dirname(fileURLToPath(import.meta.url));
if (!existsSync(ROOT)) { console.error(`check-drift: no such folder ${ROOT}`); process.exit(2); }

// ── YAML parser: the vendored one beside brand-kit (repo and skill bundle share the layout) ──
async function loadYaml() {
  for (const c of [join(HERE, "../brand-kit/scripts/vendor/yaml.mjs"), join(ROOT, "tools/brand-kit/scripts/vendor/yaml.mjs")])
    if (existsSync(c)) return (await import(pathToFileURL(c).href)).parse;
  try { return (await import(pathToFileURL(createRequire(join(ROOT, "package.json")).resolve("yaml")).href)).parse; } catch {}
  console.error("check-drift: no YAML parser found (expected ../brand-kit/scripts/vendor/yaml.mjs next to this tool)");
  process.exit(2);
}
const parseYaml = await loadYaml();

const DOC_NAMES = ["PROJECT", "INFORMATION", "DESIGN", "DESIGN_MOBILE", "SPEC", "SPEC_MOBILE", "CONTENT", "SEO", "QA", "DECISIONS"].map((n) => n + ".md");
const docPath = (name) => [join(ROOT, name), join(ROOT, "docs", name)].find(existsSync) ?? null;
const DOCS = DOC_NAMES.map(docPath).filter(Boolean);
if (!DOCS.length) { console.error(`check-drift: no premium.md product docs (PROJECT.md, SPEC.md, ...) at ${ROOT} or ${ROOT}/docs`); process.exit(2); }

/** Frontmatter plus every fenced ```yaml block in the body; unparseable blocks are reported, not fatal. */
const parseErrors = [];
function yamlBlocks(path) {
  const text = readFileSync(path, "utf8"), out = [];
  const parts = text.split(/^---\s*$/m);
  const body = parts.length >= 3 ? parts.slice(2).join("---") : text;
  const sources = parts.length >= 3 ? [parts[1]] : [];
  for (const m of body.matchAll(/^```ya?ml\s*\n([\s\S]*?)^```/gm)) sources.push(m[1]);
  for (const s of sources) { try { const v = parseYaml(s); if (v && typeof v === "object") out.push(v); } catch (e) { parseErrors.push(`${relative(ROOT, path)}: ${e.message.split("\n")[0]}`); } }
  return out;
}

// ── COPY ────────────────────────────────────────────────────────────────
const projectFm = docPath("PROJECT.md") ? yamlBlocks(docPath("PROJECT.md"))[0] ?? {} : {};
const COPY_KEYS = new Set(arg("keys") ? arg("keys").split(",").map((k) => k.trim()).filter(Boolean) : Array.isArray(projectFm.copy_keys) ? projectFm.copy_keys.map(String) : Array.isArray(projectFm.doc_sync?.copy_keys) ? projectFm.doc_sync.copy_keys.map(String) : DEFAULT_KEYS);

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', hellip: "...", mdash: "-", ndash: "-", middot: "·", copy: "©", reg: "®", trade: "™", times: "×" };
function norm(s) {
  return s
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENTITIES[e.toLowerCase()] ?? m)
    .replace(/\\u\{?([0-9a-f]{4,5})\}?/gi, (_m, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\(['"`])/g, "$1").replace(/\\n/g, " ")
    .replace(/[‘’‚′`]/g, "'").replace(/[“”„″]/g, '"')
    .replace(/[\u2013\u2014\u2212]/g, "-").replace(/\u2026/g, "...")
    .replace(/[     ]/g, " ").replace(/[​­]/g, "")
    .replace(/\{\s*["'`] ["'`]\s*\}/g, " ")              // JSX {" "}
    .replace(/\s+/g, " ").trim();
}
/** Copy strings with where they came from. {refs} and {{slots}} split a string into literal fragments. */
function collectCopy(path) {
  const found = [];
  const walk = (node, trail) => {
    if (Array.isArray(node)) return node.forEach((v, i) => walk(v, [...trail, i]));
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      const here = [...trail, k];
      const strings = COPY_KEYS.has(k) ? (typeof v === "string" ? [v] : Array.isArray(v) && v.every((x) => typeof x === "string") ? v : []) : [];
      for (const s of strings) found.push({ doc: relative(ROOT, path), key: here.join("."), text: s });
      if (v && typeof v === "object") walk(v, here);
    }
  };
  for (const block of yamlBlocks(path)) walk(block, []);
  return found;
}
const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".next", ".nuxt", ".svelte-kit", ".astro", ".vercel", ".output", "out", "coverage", ".git", ".turbo", ".cache", "qa", "design-tokens"]);
const SRC_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".vue", ".svelte", ".astro", ".html", ".md", ".mdx", ".json", ".yaml", ".yml", ".txt"]);
const srcDirs = (arg("src") ? arg("src").split(",") : ["src", "app", "components", "pages", "lib", "content", "data"]).map((s) => s.trim()).filter(Boolean).filter((d) => existsSync(join(ROOT, d)));
function walkFiles(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") && e.name !== ".well-known") continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walkFiles(p, out); }
    else if (SRC_EXT.has(extname(e.name)) && statSync(p).size < 2_000_000) out.push(p);
  }
  return out;
}
const srcFiles = [...srcDirs.flatMap((d) => walkFiles(join(ROOT, d))), ...readdirSync(ROOT).filter((f) => f.endsWith(".html")).map((f) => join(ROOT, f))];
// "first half " +\n "second half" (string concatenation) reads as one string
const haystack = norm(srcFiles.map((f) => readFileSync(f, "utf8")).join("\n").replace(/(["'`])\s*\+\s*\1/g, ""));
const haystackNoTags = norm(haystack.replace(/<\/?[A-Za-z][^<>]{0,300}>/g, " ").replace(/\s+/g, " "));
const lowerHay = haystackNoTags.toLowerCase();

const copyDocs = ["SPEC.md", "SPEC_MOBILE.md", "CONTENT.md"].map(docPath).filter(Boolean);
const copyItems = copyDocs.flatMap(collectCopy);
const copyMissing = [], caseOnly = [];
let copyChecked = 0, copySkipped = 0;
const seen = new Set();
for (const it of copyItems) {
  if (/<[^<>]*>/.test(it.text)) { copySkipped++; continue; }            // unfilled <slot>
  const frags = it.text.split(/\{\{[^}]*\}\}|\{[^{}]*\}/).map(norm).filter((f) => f.length >= MIN);
  if (!frags.length) { copySkipped++; continue; }
  const sig = frags.join("|");
  if (seen.has(sig)) continue;
  seen.add(sig);
  copyChecked++;
  const miss = frags.filter((f) => !haystack.includes(f) && !haystackNoTags.includes(f));
  if (!miss.length) continue;
  if (miss.every((f) => lowerHay.includes(f.toLowerCase()))) { caseOnly.push(it); continue; }
  copyMissing.push({ ...it, missing: miss });
}

// ── GIT ─────────────────────────────────────────────────────────────────
const git = (...a) => execFileSync("git", ["-C", ROOT, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
let gitResult = { skipped: null, since: null, codeChanged: [], docsChanged: [] };
let top = null;
try { top = git("rev-parse", "--show-toplevel"); } catch { gitResult.skipped = "not a git repository"; }
const relTop = (p) => relative(top, p);
if (top) {
  const docSpecs = DOC_NAMES.flatMap((n) => [relTop(join(ROOT, n)), relTop(join(ROOT, "docs", n))]);
  let since = arg("since");
  if (!since) { try { since = git("log", "-1", "--format=%H", "--", ...docSpecs) || null; } catch { since = null; } }
  gitResult.since = since;
  const changed = new Set();
  if (since) { try { git("diff", "--name-only", `${since}..HEAD`).split("\n").filter(Boolean).forEach((f) => changed.add(f)); } catch { console.error(`check-drift: git ref "${since}" not found`); process.exit(2); } }
  else { try { git("ls-files").split("\n").filter(Boolean).forEach((f) => changed.add(f)); } catch {} }   // no doc ever committed: all tracked code counts
  // uncommitted (staged, unstaged, untracked) always counts
  git("status", "--porcelain", "--untracked-files=all", "--", relTop(ROOT) || ".").split("\n").filter(Boolean).forEach((l) => changed.add(l.slice(3).replace(/^.* -> /, "").replace(/^"|"$/g, "")));
  const srcRel = srcDirs.map((d) => relTop(join(ROOT, d)) + "/");
  const rootRel = relTop(ROOT);
  const docSet = new Set(docSpecs);
  for (const f of changed) {
    if (docSet.has(f)) gitResult.docsChanged.push(f);
    else if (srcRel.some((d) => f.startsWith(d)) || (dirname(f) === (rootRel || ".") && f.endsWith(".html"))) gitResult.codeChanged.push(f);
  }
}
const gitDrift = !gitResult.skipped && gitResult.codeChanged.length > 0 && gitResult.docsChanged.length === 0;

// ── TOKENS ──────────────────────────────────────────────────────────────
/** Last change time: the last commit for a clean tracked file, else the file's mtime. */
function changedAt(p) {
  if (top) {
    try {
      const rel = relTop(p);
      const dirty = git("status", "--porcelain", "--", rel);
      if (!dirty) { const t = git("log", "-1", "--format=%ct", "--", rel); if (t) return Number(t) * 1000; }
    } catch {}
  }
  return statSync(p).mtimeMs;
}
const tokenFiles = [];
(function findTokens(dir, depth) {
  if (depth > 5) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || ["node_modules", ".git", "dist", "build", ".next"].includes(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) findTokens(p, depth + 1);
    else if (/\.(css|json)$/.test(e.name) && statSync(p).size < 3_000_000) {
      const head = readFileSync(p, "utf8").slice(0, 400);
      const m = head.match(/Generated from (\S+\.md) by (\S+)/);
      if (m) tokenFiles.push({ file: p, design: m[1], tool: m[2] });
      else if (e.name === "tokens.json" && existsSync(join(dir, "tokens.css")) && /Generated from/.test(readFileSync(join(dir, "tokens.css"), "utf8").slice(0, 400)))
        tokenFiles.push({ file: p, design: readFileSync(join(dir, "tokens.css"), "utf8").match(/Generated from (\S+\.md)/)?.[1] ?? "DESIGN.md", tool: "export-tokens.ts" });
    }
  }
})(ROOT, 0);
const stale = [];
for (const t of tokenFiles) {
  const design = docPath(t.design.split("/").pop()) ?? docPath("DESIGN.md") ?? docPath("DESIGN_MOBILE.md");
  if (!design) continue;
  const dt = changedAt(design), tt = changedAt(t.file);
  t.designDoc = relative(ROOT, design);
  if (tt + 1000 < dt) stale.push({ ...t, file: relative(ROOT, t.file), behindBy: `${Math.round((dt - tt) / 60000)} min` });
}

// ── report ──────────────────────────────────────────────────────────────
const drift = copyMissing.length > 0 || gitDrift || stale.length > 0;
const report = {
  root: ROOT,
  copy: { keys: [...COPY_KEYS], docs: copyDocs.map((d) => relative(ROOT, d)), srcDirs, sourceFiles: srcFiles.length, checked: copyChecked, skipped: copySkipped, missing: copyMissing, caseOnly },
  git: { ...gitResult, drift: gitDrift },
  tokens: { exports: tokenFiles.map((t) => relative(ROOT, t.file)), stale },
  parseErrors,
  drift,
};
if (JSON_OUT) { console.log(JSON.stringify(report, null, 2)); process.exit(drift ? 1 : 0); }

const L = [];
L.push(`check-drift (QA Gate H): ${ROOT}`, "");
L.push(`COPY    ${copyMissing.length ? "DRIFT" : "ok"}: ${copyChecked} strings checked from ${copyDocs.map((d) => relative(ROOT, d)).join(", ") || "(no SPEC/CONTENT)"} against ${srcFiles.length} source files in ${srcDirs.join(", ") || "(none)"}; ${copySkipped} skipped (unfilled slot or under ${MIN} chars); ${copyMissing.length} not found in code`);
for (const m of copyMissing.slice(0, 60)) L.push(`        - ${m.doc} ${m.key}: "${m.missing[0].slice(0, 90)}${m.missing[0].length > 90 ? "..." : ""}"`);
if (copyMissing.length > 60) L.push(`        ... and ${copyMissing.length - 60} more (use --json for all)`);
if (caseOnly.length) L.push(`        note: ${caseOnly.length} string(s) match only ignoring case (not drift): ${caseOnly.slice(0, 5).map((c) => c.key).join(", ")}`);
if (gitResult.skipped) L.push(`GIT     skipped: ${gitResult.skipped}`);
else {
  const range = gitResult.since ? `${gitResult.since.slice(0, 10)}..HEAD + uncommitted` : "all tracked files (no product doc has ever been committed)";
  L.push(`GIT     ${gitDrift ? "DRIFT" : "ok"}: ${gitResult.codeChanged.length} source file(s) changed in ${range}; ${gitResult.docsChanged.length} product doc(s) changed${gitDrift ? ": code changed with no doc update" : ""}`);
  if (gitDrift) for (const f of gitResult.codeChanged.slice(0, 40)) L.push(`        - ${f}`);
  if (gitDrift && gitResult.codeChanged.length > 40) L.push(`        ... and ${gitResult.codeChanged.length - 40} more`);
}
if (!tokenFiles.length) L.push("TOKENS  skipped: no generated token export found (export-tokens.ts writes tokens.css / theme.css / tokens.json)");
else L.push(`TOKENS  ${stale.length ? "DRIFT" : "ok"}: ${tokenFiles.length} generated file(s)${stale.length ? `; ${stale.length} older than their DESIGN doc, re-run the export:` : ", none older than its DESIGN doc"}`);
for (const s of stale) L.push(`        - ${s.file} (from ${s.designDoc}, behind by ${s.behindBy})`);
for (const e of parseErrors) L.push(`WARN    YAML did not parse: ${e}`);
L.push("", drift ? "DRIFT FOUND: fix the side that is wrong, or list each finding with its reason in the QA results (Gate H)." : "Clean: the docs match the build.");
console.log(L.join("\n"));
process.exit(drift ? 1 : 0);
