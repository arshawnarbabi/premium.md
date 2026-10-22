// ─────────────────────────────────────────────────────────────────────────
// compare-tokens.ts: checks that a NEW tokens.css still provides every custom property an OLD one
// defined, with the same computed value. Use it after upgrading premium.md, before you replace a
// committed design-tokens/tokens.css with a fresh export.
//
// "Same computed value" follows how a browser resolves custom properties: var() is substituted on the
// element that declares the property, so each property is resolved in five places and must match in all:
//   root          :root in a light document
//   dark-doc      data-theme="dark" on <html> (both :root and the dark block apply to one element)
//   dark-section  a data-theme="dark" element inside a light document (inherits the root's resolved values)
//   light-section a data-theme="light" element inside a dark document
//   @media tiers  :root at each min-width block's width (every block at or below that width applies)
// Values are compared after normalising whitespace and string quote style, nothing else (88 and 88px differ).
//
// Usage:
//   node scripts/compare-tokens.ts --old <old tokens.css> --new <new tokens.css> [--json]
// Exit 0 when nothing is missing or changed, 1 otherwise, 2 on a usage problem.
// ─────────────────────────────────────────────────────────────────────────
import { readFileSync, existsSync } from "node:fs";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

type Decls = Map<string, string>;
type Sheet = { root: Decls; dark: Decls; light: Decls; media: { min: number; decls: Decls }[] };

/** Parse the generated stylesheet shape: `sel { decls }` and `@media (min-width: Npx) { :root { decls } }`. */
export function parseTokensCss(css: string): Sheet {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const sheet: Sheet = { root: new Map(), dark: new Map(), light: new Map(), media: [] };
  const readDecls = (body: string, into: Decls) => {
    let depth = 0, quote = "", cur = "";
    const flush = () => {
      const i = cur.indexOf(":");
      if (i > 0) { const name = cur.slice(0, i).trim(); if (name.startsWith("--")) into.set(name, cur.slice(i + 1).trim()); }
      cur = "";
    };
    for (const ch of body) {
      if (quote) { if (ch === quote) quote = ""; cur += ch; continue; }
      if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (ch === ";" && depth === 0) { flush(); continue; }
      cur += ch;
    }
    flush();
  };
  /** Top-level blocks: returns [prelude, body] pairs. */
  const blocks = (s: string): [string, string][] => {
    const out: [string, string][] = [];
    let i = 0;
    while (i < s.length) {
      const open = s.indexOf("{", i);
      if (open < 0) break;
      let depth = 1, j = open + 1, quote = "";
      for (; j < s.length && depth; j++) {
        const ch = s[j];
        if (quote) { if (ch === quote) quote = ""; continue; }
        if (ch === '"' || ch === "'") quote = ch;
        else if (ch === "{") depth++;
        else if (ch === "}") depth--;
      }
      out.push([s.slice(i, open).trim(), s.slice(open + 1, j - 1)]);
      i = j;
    }
    return out;
  };
  const target = (sel: string): Decls | null =>
    /^:root$/.test(sel) ? sheet.root : /data-theme=["']?dark/.test(sel) ? sheet.dark : /data-theme=["']?light/.test(sel) ? sheet.light : null;
  for (const [prelude, body] of blocks(src)) {
    if (prelude.startsWith("@media")) {
      const m = /min-width:\s*([\d.]+)px/.exec(prelude);
      const decls: Decls = new Map();
      for (const [, inner] of blocks(body)) readDecls(inner, decls);
      sheet.media.push({ min: m ? Number(m[1]) : 0, decls });
    } else {
      const t = target(prelude);
      if (t) readDecls(body, t);
    }
  }
  sheet.media.sort((a, b) => a.min - b.min);
  return sheet;
}

// 'Segoe UI' and "Segoe UI" are the same CSS string token, so quote style is normalised too.
const ws = (v: string) => v.replace(/'([^'"]*)'/g, '"$1"').replace(/\s+/g, " ").replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").replace(/\s*,\s*/g, ", ").trim();

/** Resolve every declaration on one element: own declarations override inherited (already resolved) values. */
function computeElement(inherited: Map<string, string>, own: Decls): Map<string, string> {
  const out = new Map(inherited);
  const memo = new Map<string, string | null>();
  const resolving = new Set<string>();
  const sub = (v: string): string | null => {
    let s = v, guard = 0;
    while (/var\(/.test(s) && guard++ < 200) {
      let failed = false;
      s = s.replace(/var\(\s*(--[A-Za-z0-9_-]+)\s*(?:,([^()]*(?:\([^()]*\)[^()]*)*))?\)/, (_m, name, fb) => {
        const r = get(name);
        if (r != null) return r;
        if (fb != null) return fb.trim();
        failed = true;
        return "";
      });
      if (failed) return null;
    }
    return s;
  };
  const get = (name: string): string | null => {
    if (own.has(name)) {
      if (memo.has(name)) return memo.get(name)!;
      if (resolving.has(name)) return null;                       // cycle: invalid at computed-value time
      resolving.add(name);
      const r = sub(own.get(name)!);
      resolving.delete(name);
      memo.set(name, r == null ? null : ws(r));
      return memo.get(name)!;
    }
    return inherited.get(name) ?? null;
  };
  for (const name of own.keys()) { const r = get(name); if (r == null) out.delete(name); else out.set(name, r); }
  return out;
}
const merge = (...ds: Decls[]): Decls => { const m: Decls = new Map(); for (const d of ds) for (const [k, v] of d) m.set(k, v); return m; };

/** Every scope's computed custom properties, keyed by scope name. */
export function computeScopes(sheet: Sheet, widths: number[]): Map<string, Map<string, string>> {
  const scopes = new Map<string, Map<string, string>>();
  const empty = new Map<string, string>();
  const root = computeElement(empty, sheet.root);
  scopes.set("root", root);
  const darkDoc = computeElement(empty, merge(sheet.root, sheet.dark));
  scopes.set("dark-doc", darkDoc);
  scopes.set("dark-section", computeElement(root, sheet.dark));
  scopes.set("light-section", computeElement(darkDoc, sheet.light));
  for (const w of widths) scopes.set(`@media ${w}px`, computeElement(empty, merge(sheet.root, ...sheet.media.filter((m) => m.min <= w).map((m) => m.decls))));
  return scopes;
}

/** Compare: for every scope, every property the old sheet computes there must compute identically in the new. */
export function compareTokens(oldCss: string, newCss: string) {
  const a = parseTokensCss(oldCss), b = parseTokensCss(newCss);
  const widths = [...new Set([...a.media, ...b.media].map((m) => m.min))].sort((x, y) => x - y);
  const A = computeScopes(a, widths), B = computeScopes(b, widths);
  const oldNames = new Set([...a.root.keys(), ...a.dark.keys(), ...a.light.keys(), ...a.media.flatMap((m) => [...m.decls.keys()])]);
  const missing = new Set<string>();
  const changed: { scope: string; name: string; old: string; new: string }[] = [];
  for (const [scope, oa] of A) {
    const ob = B.get(scope)!;
    for (const [name, v] of oa) {
      if (!ob.has(name)) { missing.add(name); continue; }
      if (ob.get(name) !== v) changed.push({ scope, name, old: v, new: ob.get(name)! });
    }
  }
  // a declared-but-invalid old property (cycle, unresolved var) computes to nothing; it still has to be declared
  const newNames = new Set([...b.root.keys(), ...b.dark.keys(), ...b.light.keys(), ...b.media.flatMap((m) => [...m.decls.keys()])]);
  for (const n of oldNames) if (!newNames.has(n)) missing.add(n);
  return { oldNames: oldNames.size, newNames: newNames.size, scopes: [...A.keys()], missing: [...missing].sort(), changed };
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("compare-tokens.ts")) {
  const oldPath = arg("old"), newPath = arg("new");
  if (!oldPath || !newPath || !existsSync(oldPath) || !existsSync(newPath)) {
    console.error("Usage: node scripts/compare-tokens.ts --old <old tokens.css> --new <new tokens.css> [--json]");
    process.exit(2);
  }
  const r = compareTokens(readFileSync(oldPath, "utf8"), readFileSync(newPath, "utf8"));
  if (process.argv.includes("--json")) console.log(JSON.stringify(r, null, 2));
  else {
    console.log(`compare-tokens: ${r.oldNames} properties in the old file, ${r.newNames} in the new; scopes: ${r.scopes.join(", ")}`);
    console.log(`  missing: ${r.missing.length}${r.missing.length ? "  " + r.missing.slice(0, 40).join(" ") : ""}`);
    const byName = new Map<string, typeof r.changed>();
    for (const c of r.changed) byName.set(c.name, [...(byName.get(c.name) ?? []), c]);
    console.log(`  changed value: ${byName.size} propert${byName.size === 1 ? "y" : "ies"} (${r.changed.length} scope results)`);
    for (const [name, cs] of [...byName].slice(0, 40)) console.log(`    ${name} [${cs.map((c) => c.scope).join(", ")}]: "${cs[0].old.slice(0, 70)}" -> "${cs[0].new.slice(0, 70)}"`);
    console.log(r.missing.length || r.changed.length ? "NOT COMPATIBLE: the new export would change or drop properties the old one provided." : "Compatible: every old property exists with the same computed value.");
  }
  process.exit(r.missing.length || r.changed.length ? 1 : 0);
}
