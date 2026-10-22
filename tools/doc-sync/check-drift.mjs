#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────
// check-drift.mjs: QA Gate H, "the docs match the build". Plain Node (>= 22.18), no install.
// Three checks:
//   COPY    every shipped-copy string in SPEC.md / SPEC_MOBILE.md / CONTENT.md (string values under
//           the copy keys) appears in the source tree. A miss = the doc says something the site doesn't.
//   GIT     source files changed since a ref while no product doc changed in that range
//           = "code changed with no doc update".
//   TOKENS  a generated token export (export-tokens.ts output) that differs from a fresh export of its
//           DESIGN doc (regenerated into a temp dir with the project's exporter); timestamps only as a fallback.
// Exit 0 clean, 1 on any drift, 2 on a setup problem.
// ─────────────────────────────────────────────────────────────────────────
import { existsSync, readFileSync, readdirSync, statSync, mkdtempSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
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

const HELP = `Usage: node check-drift.mjs [--root .] [--since <git-ref>] [--src src,app,components] [--keys k1,k2] [--min 12]
                      [--reverse] [--reverse-ignore dir/,file.tsx] [--exporter <export-tokens.ts>] [--tokens-mtime] [--json]

  --root <dir>     project root (product docs at the root or in docs/), default .
  --since <ref>    git range start for the GIT check; default: the last commit that touched a
                   product doc. Uncommitted changes are always included.
  --src <list>     source folders, comma separated; default: whichever of
                   src, app, components, pages, lib, content, data exist (plus root *.html)
  --keys <list>    copy keys to check, comma separated (overrides PROJECT.md copy_keys)
  --min <n>        ignore copy strings shorter than n characters, default 12 (both directions)
  --reverse        also list user-visible copy in the code that no SPEC, SPEC_MOBILE, CONTENT, SEO
                   or INFORMATION doc holds ("in code, not in docs"); counts as drift.
                   PROJECT.md doc_sync.reverse: true turns it on by default.
  --reverse-ignore <list>  path prefixes (relative to the root) the reverse check skips, comma
                   separated; PROJECT.md doc_sync.reverse_ignore adds to it
  --exporter <f>   token exporter to regenerate with (default: the project's
                   tools/brand-kit/scripts/export-tokens.ts, else the bundled one)
  --tokens-mtime   judge token exports by timestamp only (the pre-1.23.1 behaviour)
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

// ── built-in JS/TS/JSX scanner for the REVERSE check (no dependencies) ──
// Emits copy candidates: JSX text runs, copy attributes, and string values of copy-key object fields.
// Not a parser: a tokenizer that knows strings, templates, comments, regex literals and JSX, which is all
// that is needed to find literal text reliably. A file it cannot follow is skipped and reported.
function scanSource(src, { jsx, isCopyAttr, isField, inlineTags, BREAK, onText }) {
  let i = 0;
  const n = src.length;
  const nl = []; for (let k = 0; k < n; k++) if (src.charCodeAt(k) === 10) nl.push(k);
  const lineAt = (p) => { let lo = 0, hi = nl.length; while (lo < hi) { const m = (lo + hi) >> 1; if (nl[m] < p) lo = m + 1; else hi = m; } return lo + 1; };
  const fail = (why) => { throw new Error(`${why} at line ${lineAt(i)}`); };
  const isId = (c) => /[\p{L}\p{N}_$]/u.test(c);
  const EXPR_KW = new Set(["return", "typeof", "case", "do", "else", "in", "of", "new", "delete", "void", "throw", "yield", "await", "instanceof", "default", "extends"]);
  const SKIP_TAGS = /^(style|script|code|pre)$/;
  const skipWsComments = () => {
    for (;;) {
      while (i < n && /\s/.test(src[i])) i++;
      if (src[i] === "/" && src[i + 1] === "/") { while (i < n && src[i] !== "\n") i++; continue; }
      if (src[i] === "/" && src[i + 1] === "*") { const e = src.indexOf("*/", i + 2); if (e < 0) fail("unterminated comment"); i = e + 2; continue; }
      return;
    }
  };
  const readString = (q) => {
    let out = ""; i++;
    while (i < n && src[i] !== q) {
      if (src[i] === "\\") {
        const c = src[i + 1];
        if (c === "u" && src[i + 2] === "{") { const e = src.indexOf("}", i); out += String.fromCodePoint(parseInt(src.slice(i + 3, e), 16)); i = e + 1; continue; }
        if (c === "u") { out += String.fromCharCode(parseInt(src.slice(i + 2, i + 6), 16)); i += 6; continue; }
        if (c === "x") { out += String.fromCharCode(parseInt(src.slice(i + 2, i + 4), 16)); i += 4; continue; }
        if (c === "\n") { i += 2; continue; }
        out += { n: "\n", t: "\t", r: "", b: "", f: "", v: "", 0: "" }[c] ?? c; i += 2; continue;
      }
      if (src[i] === "\n" && q !== "`") fail("unterminated string");
      out += src[i++];
    }
    if (i >= n) fail("unterminated string");
    i++;
    return out;
  };
  const readTemplate = () => {
    const parts = []; let cur = ""; i++;
    while (i < n && src[i] !== "`") {
      if (src[i] === "\\") { const c = src[i + 1]; cur += { n: "\n", t: "\t" }[c] ?? c; i += 2; continue; }
      if (src[i] === "$" && src[i + 1] === "{") { parts.push(cur); cur = ""; i += 2; scanExpr("}"); i++; continue; }
      cur += src[i++];
    }
    if (i >= n) fail("unterminated template");
    i++; parts.push(cur);
    return parts;
  };
  const readRegex = () => {
    i++; let cls = false;
    while (i < n) {
      const c = src[i];
      if (c === "\\") { i += 2; continue; }
      if (c === "\n") fail("unterminated regex");
      if (cls) { if (c === "]") cls = false; }
      else if (c === "[") cls = true;
      else if (c === "/") break;
      i++;
    }
    i++; while (i < n && /[a-z]/i.test(src[i])) i++;
  };
  /** String value of an expression's tokens: a list of texts (BREAK = a non-literal part), or null. */
  const evalStr = (toks) => {
    let t = toks;
    const depth0 = (pred) => { let d = 0; for (let k = 0; k < t.length; k++) { const x = t[k]; if (x.t === "p" && "([{".includes(x.v)) d++; else if (x.t === "p" && ")]}".includes(x.v)) d--; else if (d === 0 && pred(x)) return k; } return -1; };
    const cut = depth0((x) => x.t === "id" && (x.v === "as" || x.v === "satisfies"));
    if (cut >= 0) t = t.slice(0, cut);
    while (t.length >= 2 && t[0].v === "(" && t[t.length - 1].v === ")") t = t.slice(1, -1);
    if (!t.length) return null;
    const q = depth0((x) => x.t === "p" && x.v === "?");
    if (q >= 0) {
      let d = 0, c = -1;
      for (let k = q + 1; k < t.length; k++) { const x = t[k]; if (x.t === "p" && "([{".includes(x.v)) d++; else if (x.t === "p" && ")]}".includes(x.v)) d--; else if (d === 0 && x.t === "p" && x.v === "?") d += 100; else if (x.t === "p" && x.v === ":") { if (d === 0) { c = k; break; } if (d >= 100) d -= 100; } }
      if (c < 0) return null;
      const a = evalStr(t.slice(q + 1, c)), b = evalStr(t.slice(c + 1));
      return a || b ? [...(a ?? []), ...(b ?? [])] : null;
    }
    const lo = (() => { let d = 0, last = -1; for (let k = 0; k < t.length; k++) { const x = t[k]; if (x.t === "p" && "([{".includes(x.v)) d++; else if (x.t === "p" && ")]}".includes(x.v)) d--; else if (d === 0 && x.t === "p" && ["||", "??", "&&"].includes(x.v)) last = k; } return last; })();
    if (lo >= 0) return evalStr(t.slice(lo + 1));
    const ops = []; let start = 0, d = 0;
    for (let k = 0; k <= t.length; k++) {
      const x = t[k];
      if (x && x.t === "p" && "([{".includes(x.v)) d++;
      else if (x && x.t === "p" && ")]}".includes(x.v)) d--;
      if (k === t.length || (d === 0 && x.t === "p" && x.v === "+")) { ops.push(t.slice(start, k)); start = k + 1; }
    }
    let any = false;
    const txt = ops.map((o) => {
      if (o.length === 1 && o[0].t === "str") { any = true; return o[0].v; }
      if (o.length === 1 && o[0].t === "tpl") { any = true; return o[0].v.join(BREAK); }
      return BREAK;
    }).join("");
    return any ? [txt] : null;
  };
  /** JSX element at src[i] === "<". Returns { tag, parts } where parts is the element's own text run. */
  const parseJsx = () => {
    const at = i; i++;
    skipWsComments();
    let tag = "";
    if (src[i] !== ">") { const m = /^[\p{L}\p{N}_$.:-]+/u.exec(src.slice(i, i + 200)); if (!m) fail("bad JSX tag"); tag = m[0]; i += tag.length; }
    // attributes
    for (;;) {
      skipWsComments();
      if (src[i] === "/" && src[i + 1] === ">") { i += 2; return { tag, parts: [], at }; }
      if (src[i] === ">") { i++; break; }
      if (src[i] === "{") { i++; scanExpr("}"); i++; continue; }          // {...spread}
      if (src[i] === "<" && !tag) fail("bad JSX");
      const m = /^[\p{L}\p{N}_$:-]+/u.exec(src.slice(i, i + 200));
      if (!m) fail("bad JSX attribute");
      const name = m[0]; i += name.length;
      skipWsComments();
      if (src[i] !== "=") continue;
      i++; skipWsComments();
      const apos = i;
      let val = null;
      if (src[i] === '"' || src[i] === "'") { const q = src[i]; const e = src.indexOf(q, i + 1); if (e < 0) fail("unterminated attribute"); val = [src.slice(i + 1, e)]; i = e + 1; }
      else if (src[i] === "{") { i++; const toks = scanExpr("}"); i++; val = evalStr(toks); }
      else if (src[i] === "<") { parseJsx(); }
      else fail("bad JSX attribute value");
      if (val && isCopyAttr(name)) for (const v of val) onText(v, lineAt(apos), "attr");
    }
    // children
    const parts = []; let prevEl = false;
    for (;;) {
      if (i >= n) fail("unterminated JSX element");
      if (src[i] === "<" && src[i + 1] === "/") { const e = src.indexOf(">", i); if (e < 0) fail("bad closing tag"); i = e + 1; break; }
      if (src[i] === "<") {
        if (prevEl) parts.push(BREAK);
        const child = parseJsx(); prevEl = true;
        if (inlineTags.has(child.tag)) parts.push(...child.parts);
        else if (child.tag === "br") parts.push(" ");
        else { if (!SKIP_TAGS.test(child.tag)) onText(child.parts.join(""), lineAt(child.at), "jsx"); parts.push(BREAK); }
        continue;
      }
      if (src[i] === "{") {
        i++; const toks = scanExpr("}"); i++;
        if (!toks.length) continue;                                  // {/* comment */}
        const v = evalStr(toks);
        parts.push(v && v.length === 1 ? v[0] : BREAK); prevEl = false;
        continue;
      }
      let e = i; while (e < n && src[e] !== "<" && src[e] !== "{") e++;
      const text = src.slice(i, e); i = e;
      parts.push(text.replace(/\s*\n\s*/g, " "));
      if (text.trim()) prevEl = false;
    }
    return { tag, parts, at };
  };
  /** Scan code until `stop` ("}" at depth 0) or end of input; returns that level's tokens. */
  function scanExpr(stop) {
    const toks = [];
    let prev = "punct";
    const braces = [];                 // object/blocks: { keys:Set, fields:[] }
    let depth = 0;
    const closeBrace = () => {
      const b = braces.pop();
      if (b && b.fields.length) {
        const control = (b.keys.has("min") && b.keys.has("max")) || [...b.keys].some((k) => ["step", "default", "defaultValue", "shader", "fragmentShader", "vertexShader", "uniform", "uniforms"].includes(k));
        if (!control) for (const f of b.fields) for (const v of f.vals) onText(v, f.line, "field");
      }
    };
    const finishField = (b) => {
      const f = b?.open;
      if (!f) return;
      b.open = null;
      const vt = toks.slice(f.from);
      let vals = null;
      if (vt.length && vt[0].v === "[" && vt[vt.length - 1].v === "]") {
        vals = []; let d = 0, s = 1;
        for (let k = 1; k < vt.length; k++) { const x = vt[k]; if (x.t === "p" && "([{".includes(x.v)) d++; else if (x.t === "p" && ")]}".includes(x.v)) { if (d === 0) { vals.push(...(evalStr(vt.slice(s, k)) ?? [])); break; } d--; } else if (d === 0 && x.v === ",") { vals.push(...(evalStr(vt.slice(s, k)) ?? [])); s = k + 1; } }
      } else vals = evalStr(vt);
      if (vals && vals.length) b.fields.push({ key: f.key, line: f.line, vals });
    };
    while (i < n) {
      skipWsComments();
      if (i >= n) break;
      const c = src[i], p0 = i;
      if (c === "}" && depth === 0 && braces.length === 0 && stop === "}") return toks;
      if (c === '"' || c === "'") { toks.push({ t: "str", v: readString(c), pos: p0 }); prev = "value"; continue; }
      if (c === "`") { toks.push({ t: "tpl", v: readTemplate(), pos: p0 }); prev = "value"; continue; }
      if (c === "/" && prev === "punct") { readRegex(); toks.push({ t: "re", pos: p0 }); prev = "value"; continue; }
      if (c === "<" && jsx && prev === "punct" && /[\p{L}_$>]/u.test(src[i + 1] ?? "")) { const el = parseJsx(); if (!SKIP_TAGS.test(el.tag)) onText(el.parts.join(""), lineAt(el.at), "jsx"); toks.push({ t: "jsx", pos: p0 }); prev = "value"; continue; }
      if (isId(c)) {
        let e = i; while (e < n && isId(src[e])) e++;
        const v = src.slice(i, e); i = e;
        if (/^\d/.test(v)) { while (i < n && /[\w.]/.test(src[i])) i++; toks.push({ t: "num", pos: p0 }); prev = "value"; continue; }
        toks.push({ t: "id", v, pos: p0 }); prev = EXPR_KW.has(v) ? "punct" : "value";
        continue;
      }
      if (c === "." && /\d/.test(src[i + 1] ?? "")) { i++; while (i < n && /[\w.]/.test(src[i])) i++; toks.push({ t: "num", pos: p0 }); prev = "value"; continue; }
      // punctuators
      const three = src.slice(i, i + 3), two = src.slice(i, i + 2);
      let v = c;
      if (["===", "!==", "...", "**=", "<<=", ">>=", "&&=", "||=", "??="].includes(three)) v = three;
      else if (["=>", "==", "!=", "<=", ">=", "&&", "||", "??", "?.", "++", "--", "+=", "-=", "*=", "/=", "**", "<<", ">>"].includes(two)) v = two;
      i += v.length;
      const b = braces[braces.length - 1];
      if (v === "{") { braces.push({ keys: new Set(), fields: [], open: null, depth }); toks.push({ t: "p", v, pos: p0 }); prev = "punct"; continue; }
      if (v === "}") { if (b && b.depth === depth) finishField(b); closeBrace(); toks.push({ t: "p", v, pos: p0 }); prev = "punct"; continue; }
      if (v === "(" || v === "[") depth++;
      if (v === ")" || v === "]") depth--;
      if (v === "," && b && b.depth === depth) finishField(b);
      if (v === ":" && b && b.depth === depth && !b.open) {
        const k = toks[toks.length - 1], before = toks[toks.length - 2];
        if (k && (k.t === "id" || k.t === "str") && before && before.t === "p" && (before.v === "{" || before.v === ",")) {
          b.keys.add(k.v);
          if (isField(k.v)) b.open = { key: k.v, from: toks.length + 1, line: lineAt(k.pos) };
        }
      }
      toks.push({ t: "p", v, pos: p0 });
      prev = v === ")" || v === "]" ? "value" : "punct";
    }
    if (stop === "}") fail("unbalanced braces");
    return toks;
  }
  scanExpr(null);
}

// ── REVERSE (opt-in: --reverse, or PROJECT.md doc_sync.reverse: true) ──────────────────────
// User-visible copy in the code that no SPEC / SPEC_MOBILE / CONTENT / SEO / INFORMATION doc holds: "in code, not in docs".
// Collected: JSX text (inline tags such as <em> and <a> join into one run, any other element or
// expression splits it), copy attributes (title, alt, aria-label, placeholder, label, ...), and object
// fields named by a copy key (q, a, title, description, ...; camelCase forms too) in any JS/TS file.
// "a" + "b" joins; a template literal splits at each ${expr}; ternaries yield both branches. Not collected:
// comments, imports, className/style/href/src and every other attribute, CSS, test and story files.
// Strings under --min, without a letter, URLs, paths and identifier-like strings are ignored, and so are
// developer-only files (a dev/ or debug/ folder, a file named like HeroDevPanel.tsx) and control
// definitions (an object that also has min/max, step, default or a shader). JS/TS/JSX is read by the
// built-in scanner above (no install; on 102 files of a Next.js site it found exactly the strings the
// TypeScript compiler API finds); .html is scanned for text and copy attributes.
const REVERSE = flag("reverse") || projectFm.doc_sync?.reverse === true;
const COPY_ATTRS = new Set(["title", "alt", "aria-label", "aria-description", "aria-roledescription", "aria-valuetext", "placeholder", "label", "summary", "caption"]);
const camel = (k) => k.replace(/[_-]([a-z])/g, (_m, c) => c.toUpperCase());
const FIELD_KEYS = new Set([...COPY_KEYS, ...[...COPY_KEYS].map(camel), ...(Array.isArray(projectFm.doc_sync?.reverse_keys) ? projectFm.doc_sync.reverse_keys.map(String) : [])]);
const INLINE_TAGS = new Set(["a", "abbr", "b", "bdi", "bdo", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "del", "ins"]);
// developer-only screens: a dev/debug/playground folder, or a file named like HeroDevPanel.tsx / DebugOverlay.tsx
const DEV_FILE = /(^|\/)(dev|debug|playground|sandbox|internal|_dev|__dev__)\/|(Dev|Debug)(?![a-z])[^\/]*$|(^|\/|[-_.])(dev|debug)[-_.][^\/]*$/;
const TEST_FILE = /(^|\/)(__tests__|__mocks__|tests?|e2e|fixtures?|stories)\/|\.(test|spec|stories|story|e2e)\.[cm]?[jt]sx?$|\.d\.ts$/;
const reverseIgnore = [...(arg("reverse-ignore") ? arg("reverse-ignore").split(",") : []), ...(Array.isArray(projectFm.doc_sync?.reverse_ignore) ? projectFm.doc_sync.reverse_ignore.map(String) : [])].map((x) => x.trim()).filter(Boolean);
const BREAK = "\u0000";
/** Is a normalised fragment worth checking as copy? */
function isCopy(t) {
  if (t.length < MIN || !/\p{L}/u.test(t)) return false;
  if (/^(https?:|mailto:|tel:|data:|www\.)|\b(https?:\/\/|www\.)\S+$/i.test(t)) return false;            // URL
  if (!/\s/.test(t) && (/[\/\\]/.test(t) || /^[@~.#]/.test(t) || /^[\w.-]+\.[a-z0-9]{1,5}$/i.test(t))) return false;   // path, file, selector
  if (!/\s/.test(t) && /^[a-z0-9]+([_-][a-z0-9]+)+$|^[a-z]+([A-Z][a-z0-9]*)+$|^[A-Z0-9_]+$/.test(t)) return false;    // identifier-like
  if (/[{}]/.test(t) && /[\w-]\s*:\s*[^;{}]+;/.test(t)) return false;                                   // inline CSS / JS source
  if (/^[\w-]+\s*:\s*[^:]+;?$/.test(t) && /;|\d(px|rem|em|%|vh|vw)\b/.test(t)) return false;      // CSS declaration
  if (/^[\w:\/\[\]().#%-]+( [\w:\/\[\]().#%-]+)+$/.test(t) && t.split(" ").every((w) => /[-:\[]/.test(w))) return false;   // utility class list
  return true;
}
const reverse = { enabled: REVERSE, files: 0, skippedFiles: [], checked: 0, missing: [], caseOnly: 0 };
if (REVERSE) {
  // docs side: every YAML string (any key) plus the raw text, from the docs that own copy
  const revDocs = ["SPEC.md", "SPEC_MOBILE.md", "CONTENT.md", "SEO.md", "INFORMATION.md"].map(docPath).filter(Boolean);
  reverse.docs = revDocs.map((d) => relative(ROOT, d));
  const docStrings = [];
  const collectAll = (node) => { if (typeof node === "string") docStrings.push(node); else if (node && typeof node === "object") Object.values(node).forEach(collectAll); };
  for (const d of revDocs) for (const b of yamlBlocks(d)) collectAll(b);
  const mdStrip = (x) => x.replace(/\*\*|__|`/g, "").replace(/\\([\\`*_{}\[\]()#+\-.!|>])/g, "$1");
  const docHay = norm(docStrings.map(mdStrip).join("\n")) + "\n" + norm(mdStrip(revDocs.map((d) => readFileSync(d, "utf8")).join("\n")));
  const docHayLower = docHay.toLowerCase();
  // doc strings with {refs} or {{slots}}: their literal parts, in order, with anything between
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const docPatterns = docStrings.filter((x) => /\{[^{}]+\}/.test(x)).map((x) => x.split(/\{\{[^}]*\}\}|\{[^{}]*\}/).map(norm)).filter((parts) => parts.some((p) => p.length >= 4))
    .map((parts) => new RegExp(parts.map(esc).join(".{1,200}?")));
  const inDocs = (t) => docHay.includes(t) || docPatterns.some((re) => re.test(t));
  const found = new Map();                              // text → { file, line, count }
  const add = (raw, file, line) => {
    const pieces = raw.split(BREAK);
    for (const piece of pieces) {
      const t = norm(piece);
      if (!isCopy(t)) continue;
      if (pieces.length > 1 && /^[,.;:!?)\]]/.test(t)) continue;      // the tail of a split string ("${name}, opens in a new tab")
      const f = found.get(t);
      if (f) f.count++; else found.set(t, { text: t, file, line, count: 1 });
    }
  };
  const revFiles = srcFiles.filter((f) => /\.(tsx?|jsx?|mjs|cjs|html?)$/.test(f) && !TEST_FILE.test(relative(ROOT, f)) && !DEV_FILE.test(relative(ROOT, f)) && !reverseIgnore.some((g) => relative(ROOT, f).startsWith(g.replace(/\*+$/, ""))));
  for (const file of revFiles) {
    const rel = relative(ROOT, file), text = readFileSync(file, "utf8");
    if (/\.html?$/.test(file)) {
      const body = text.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " ")).replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, (m) => m.replace(/[^\n]/g, " "));
      const lineAt = (i) => body.slice(0, i).split("\n").length;
      for (const m of body.matchAll(/>([^<>]+)</g)) add(m[1], rel, lineAt(m.index));
      for (const m of body.matchAll(/\s(title|alt|aria-label|placeholder|label)\s*=\s*("([^"]*)"|'([^']*)')/gi)) add(m[3] ?? m[4], rel, lineAt(m.index));
      for (const m of body.matchAll(/<meta\b[^>]*\bname=["'](description|twitter:title|twitter:description)["'][^>]*\bcontent=["']([^"']*)["']/gi)) add(m[2], rel, lineAt(m.index));
      reverse.files++;
      continue;
    }
    try {
      scanSource(text, { jsx: /\.(jsx|tsx|js)$/.test(file), isCopyAttr: (x) => COPY_ATTRS.has(x), isField: (k) => FIELD_KEYS.has(k), inlineTags: INLINE_TAGS, BREAK, onText: (t, line) => add(t, rel, line) });
      reverse.files++;
    } catch (e) { reverse.skippedFiles.push(`${rel} (${e.message})`); }
  }
  for (const f of found.values()) {
    reverse.checked++;
    if (inDocs(f.text)) continue;
    if (docHayLower.includes(f.text.toLowerCase())) { reverse.caseOnly++; continue; }
    reverse.missing.push(f);
  }
}
const reverseDrift = REVERSE && reverse.missing.length > 0;

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
// By CONTENT when the exporter can be found: regenerate into a temp dir with the project's own exporter
// and compare bytes, so a DESIGN.md prose edit that changes no token is not drift. The project is never
// written to: the exporter runs with --out <temp> and cwd <temp>, and the export files are hashed before
// and after to prove it. Exporter detection, per export file:
//   1. --exporter <path>, for files whose header names export-tokens.ts
//   2. the tool named in the header ("Generated from DESIGN.md by tools/x.ts"), when that path exists under the root
//   3. for export-tokens.ts: the project's copy (tools/brand-kit/scripts/, brand-kit/scripts/, scripts/), then
//      the one bundled beside this tool (../brand-kit/scripts/export-tokens.ts)
// No exporter, an exporter that does not take --out, a failed run or a file the run did not produce: fall
// back to timestamps (last commit for a clean tracked file, else mtime), reported as "could not verify".
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
      const siblingCss = join(dir, "tokens.css");
      const siblingGen = existsSync(siblingCss) && readFileSync(siblingCss, "utf8").slice(0, 400).match(/Generated from (\S+\.md) by (\S+)/);
      if (m) tokenFiles.push({ file: p, design: m[1], tool: m[2] });
      else if (siblingGen && (e.name === "tokens.json" || (e.name === "theme.css" && /@import\s+["']\.\/tokens\.css["']/.test(head))))
        tokenFiles.push({ file: p, design: siblingGen[1], tool: siblingGen[2] });
    }
  }
})(ROOT, 0);
const BUNDLED_EXPORTER = join(HERE, "../brand-kit/scripts/export-tokens.ts");
function findExporter(tool) {
  const base = tool.split("/").pop();
  if (base === "export-tokens.ts" && arg("exporter")) return resolve(arg("exporter"));
  if (tool.includes("/") && existsSync(join(ROOT, tool))) return join(ROOT, tool);
  if (base === "export-tokens.ts") {
    for (const c of ["tools/brand-kit/scripts", "brand-kit/scripts", "scripts"].map((d) => join(ROOT, d, base))) if (existsSync(c)) return c;
    if (existsSync(BUNDLED_EXPORTER)) return BUNDLED_EXPORTER;
  } else if (existsSync(join(ROOT, base))) return join(ROOT, base);
  return null;
}
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const runs = new Map();                                   // exporter|design → { dir } | { error }
function regenerate(exporter, design) {
  const key = `${exporter}|${design}`;
  if (runs.has(key)) return runs.get(key);
  let r;
  if (!/["'`]out["'`]|--out\b/.test(readFileSync(exporter, "utf8"))) r = { error: `${relative(ROOT, exporter)} takes no --out, so it cannot run outside the project` };
  else {
    const dir = mkdtempSync(join(tmpdir(), "check-drift-tokens-"));
    try {
      execFileSync(process.execPath, [exporter, "--design", design, "--out", dir], { cwd: dir, stdio: ["ignore", "ignore", "pipe"], timeout: 60_000 });
      r = { dir };
    } catch (e) { r = { error: `${relative(ROOT, exporter)} failed: ${String(e.stderr || e.message).trim().split("\n").filter(Boolean).pop()?.slice(0, 160)}` }; }
  }
  runs.set(key, r);
  return r;
}
const stale = [], unverified = [];
const before = new Map(tokenFiles.map((t) => [t.file, sha(t.file)]));
for (const t of tokenFiles) {
  const design = docPath(t.design.split("/").pop()) ?? docPath("DESIGN.md") ?? docPath("DESIGN_MOBILE.md");
  if (!design) continue;
  t.designDoc = relative(ROOT, design);
  const rel = relative(ROOT, t.file);
  const exporter = flag("tokens-mtime") ? null : findExporter(t.tool);
  let reason = flag("tokens-mtime") ? "--tokens-mtime" : exporter ? null : `no exporter found for "${t.tool}"`;
  if (exporter) {
    const r = regenerate(exporter, design);
    const fresh = r.dir && join(r.dir, t.file.split("/").pop());
    if (r.error) reason = r.error;
    else if (!existsSync(fresh)) reason = `${relative(ROOT, exporter) || exporter} did not produce ${t.file.split("/").pop()}`;
    else {
      t.exporter = exporter.startsWith(ROOT) ? relative(ROOT, exporter) : `bundled ${relative(join(HERE, ".."), exporter)}`;
      // the header's design path depends on how the exporter was called (DESIGN.md vs an absolute path); it is not token content
      const hdr = (x) => x.replace(/(Generated from )(\S+\.md)( by)/, (_m, a, p, b) => a + p.split("/").pop() + b);
      const a = hdr(readFileSync(t.file, "utf8")), b = hdr(readFileSync(fresh, "utf8"));
      if (a !== b) {
        const al = a.split("\n"), bl = b.split("\n");
        let first = 0; while (first < al.length && al[first] === bl[first]) first++;
        const bs = new Set(bl), as = new Set(al);
        stale.push({ ...t, file: rel, how: "content", exporter: t.exporter, firstDiffLine: first + 1, linesOnlyInFile: al.filter((l) => !bs.has(l)).length, linesOnlyInFresh: bl.filter((l) => !as.has(l)).length });
      }
      continue;
    }
  }
  const dt = changedAt(design), tt = changedAt(t.file);
  unverified.push({ file: rel, reason });
  if (tt + 1000 < dt) stale.push({ ...t, file: rel, how: "timestamp", reason, behindBy: `${Math.round((dt - tt) / 60000)} min` });
}
for (const r of runs.values()) if (r.dir) rmSync(r.dir, { recursive: true, force: true });
const touched = tokenFiles.filter((t) => sha(t.file) !== before.get(t.file)).map((t) => relative(ROOT, t.file));
if (touched.length) { console.error(`check-drift: an exporter changed project files it was told to write elsewhere: ${touched.join(", ")}`); process.exit(2); }

// ── report ──────────────────────────────────────────────────────────────
const drift = copyMissing.length > 0 || gitDrift || stale.length > 0 || reverseDrift;
const report = {
  root: ROOT,
  copy: { keys: [...COPY_KEYS], docs: copyDocs.map((d) => relative(ROOT, d)), srcDirs, sourceFiles: srcFiles.length, checked: copyChecked, skipped: copySkipped, missing: copyMissing, caseOnly },
  reverse,
  git: { ...gitResult, drift: gitDrift },
  tokens: { exports: tokenFiles.map((t) => relative(ROOT, t.file)), verifiedByContent: tokenFiles.length - unverified.length, unverified, stale },
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
if (!REVERSE) L.push("REVERSE off: add --reverse (or PROJECT.md doc_sync.reverse: true) to also list copy in code that no doc holds");
else {
  L.push(`REVERSE ${reverseDrift ? "DRIFT" : "ok"}: ${reverse.checked} copy strings found in ${reverse.files} source file(s) checked against ${reverse.docs.join(", ") || "(no SPEC/CONTENT/SEO)"}; ${reverse.missing.length} in code, not in docs`);
  for (const m of reverse.missing.slice(0, 80)) L.push(`        - ${m.file}:${m.line} "${m.text.slice(0, 90)}${m.text.length > 90 ? "..." : ""}"${m.count > 1 ? ` (${m.count} places)` : ""}`);
  if (reverse.missing.length > 80) L.push(`        ... and ${reverse.missing.length - 80} more (use --json for all)`);
  if (reverse.caseOnly) L.push(`        note: ${reverse.caseOnly} string(s) match only ignoring case (not drift)`);
  for (const f of reverse.skippedFiles) L.push(`        note: could not scan ${f}, skipped`);
}
if (gitResult.skipped) L.push(`GIT     skipped: ${gitResult.skipped}`);
else {
  const range = gitResult.since ? `${gitResult.since.slice(0, 10)}..HEAD + uncommitted` : "all tracked files (no product doc has ever been committed)";
  L.push(`GIT     ${gitDrift ? "DRIFT" : "ok"}: ${gitResult.codeChanged.length} source file(s) changed in ${range}; ${gitResult.docsChanged.length} product doc(s) changed${gitDrift ? ": code changed with no doc update" : ""}`);
  if (gitDrift) for (const f of gitResult.codeChanged.slice(0, 40)) L.push(`        - ${f}`);
  if (gitDrift && gitResult.codeChanged.length > 40) L.push(`        ... and ${gitResult.codeChanged.length - 40} more`);
}
if (!tokenFiles.length) L.push("TOKENS  skipped: no generated token export found (export-tokens.ts writes tokens.css / theme.css / tokens.json)");
else {
  const verified = tokenFiles.length - unverified.length;
  const used = [...new Set(tokenFiles.map((t) => t.exporter).filter(Boolean))];
  const parts = [];
  if (verified) parts.push(`${verified} verified by content (re-exported into a temp dir with ${used.join(", ")})`);
  if (unverified.length) parts.push(`${unverified.length} could not verify, timestamp only`);
  L.push(`TOKENS  ${stale.length ? "DRIFT" : "ok"}: ${tokenFiles.length} generated file(s); ${parts.join("; ")}${stale.length ? `; ${stale.length} stale, re-run the export:` : ", none stale"}`);
  for (const s of stale) L.push(s.how === "content"
    ? `        - ${s.file}: differs from a fresh export of ${s.designDoc} (first difference at line ${s.firstDiffLine}; ${s.linesOnlyInFile} line(s) only in the file, ${s.linesOnlyInFresh} only in the fresh export)`
    : `        - ${s.file} (from ${s.designDoc}, behind by ${s.behindBy}; could not verify, timestamp only: ${s.reason})`);
  for (const u of unverified) if (!stale.some((s) => s.file === u.file)) L.push(`        note: ${u.file}: could not verify, timestamp only (${u.reason})`);
}
for (const e of parseErrors) L.push(`WARN    YAML did not parse: ${e}`);
L.push("", drift ? "DRIFT FOUND: fix the side that is wrong, or list each finding with its reason in the QA results (Gate H)." : "Clean: the docs match the build.");
console.log(L.join("\n"));
process.exit(drift ? 1 : 0);
