// ─────────────────────────────────────────────────────────────────────────
// export-tokens.ts — turns a project's DESIGN.md into BUILD-READY token files,
// so the design tokens reach code without hand-transcription (the #1 drift source).
// Emits three formats from the same source of truth:
//   <out>/tokens.css   — CSS custom properties: :root (light) + [data-theme="dark"] (dark).
//                        Works with ANY stack. Palettes are concrete oklch; role tokens are var() refs.
//   <out>/theme.css    — Tailwind v4 @theme block (maps the tokens to utilities: bg-primary-9, font-display, …).
//   <out>/tokens.json  — W3C DTCG (2025.10) token file (the standard interchange; string $value for portability).
//
// Usage:
//   node scripts/export-tokens.ts --design <DESIGN.md> [--out <dir>]
//   node scripts/export-tokens.ts --root <projectRoot>  [--out <dir>]   (finds DESIGN.md, or DESIGN_MOBILE.md)
//   (default --out: ./design-tokens next to the DESIGN.md)
// ─────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const appDir = fileURLToPath(new URL("..", import.meta.url));
function findDoc(rootDir: string, names: string[]): string {
  for (const n of names) { const d = join(rootDir, n); if (existsSync(d)) return d; }
  for (const e of readdirSync(rootDir, { withFileTypes: true }))
    if (e.isDirectory()) for (const n of names) { const p = join(rootDir, e.name, n); if (existsSync(p)) return p; }
  throw new Error(`Could not find ${names.join(" / ")} under ${rootDir}`);
}
const root = arg("root");
const designPath = arg("design") ?? (root ? findDoc(root, ["DESIGN.md", "DESIGN_MOBILE.md"]) : join(appDir, "sample/DESIGN.md"));
const outDir = arg("out") ?? join(dirname(designPath), "design-tokens");
mkdirSync(outDir, { recursive: true });

const text = readFileSync(designPath, "utf8");
const parts = text.split(/^---\s*$/m);
if (parts.length < 3) throw new Error(`No frontmatter in ${designPath}`);
const d: any = parseYaml(parts[1]);

const colors = d.colors ?? {};
const PALETTES = Object.keys(colors).filter((k) => colors[k] && typeof colors[k] === "object" && colors[k]["1"]);
const ROLEGROUPS = Object.keys(colors).filter(
  (k) => colors[k] && typeof colors[k] === "object" && !colors[k]["1"] && Object.values(colors[k]).some((v) => typeof v === "string" && (v as string).includes("{")),
);
const fams = d.typography?.families ?? {};
const roles = d.typography?.roles ?? {};
const spacing = d.spacing?.scale ?? {};
const spaceUnit = d.spacing?.unit ?? "px";
const radii = d.radius?.scale ?? {};
const elev = d.elevation?.scale ?? {};
const sep = d.surface_separation ?? {};

/** {colors.neutral.1} → var(--neutral-1) ; {typography.families.display} → var(--font-display) ; etc. */
function pathToVar(p: string): string {
  if (p.startsWith("colors.shadow_tint")) return "shadow-tint";
  if (p.startsWith("colors.")) return p.slice(7).replace(/\./g, "-");                 // neutral.1, surface.canvas
  if (p.startsWith("typography.families.")) return "font-" + p.slice(20);
  if (p.startsWith("typography.roles.")) return "text-" + p.slice(17);   // {typography.roles.body-md} → var(--text-body-md)
  if (p.startsWith("spacing.scale.")) return "space-" + p.slice(14);
  if (p.startsWith("radius.scale.")) return "radius-" + p.slice(13);
  if (p.startsWith("elevation.scale.")) return "elev-" + p.slice(16);
  return p.replace(/\./g, "-");
}
const refToVar = (v: any): string =>
  typeof v === "string" ? v.replace(/\{([^}]+)\}/g, (_m, p) => `var(--${pathToVar(p)})`) : String(v);
const dim = (n: any): string => (typeof n === "number" ? `${n}px` : String(n));

// ── tokens.css ──────────────────────────────────────────────────────────
const lightLines: string[] = [];
const darkLines: string[] = [];
for (const p of PALETTES) {
  for (let i = 1; i <= 12; i++) if (colors[p][i] != null) lightLines.push(`  --${p}-${i}: ${colors[p][i]};`);
  const dk = colors[p].dark ?? {};
  for (let i = 1; i <= 12; i++) if (dk[i] != null) darkLines.push(`  --${p}-${i}: ${dk[i]};`);
}
for (const g of ROLEGROUPS) for (const [k, v] of Object.entries(colors[g])) lightLines.push(`  --${g}-${k}: ${refToVar(v)};`);
if (typeof colors.shadow_tint === "string") lightLines.push(`  --shadow-tint: ${refToVar(colors.shadow_tint)};`);
for (const [k, v] of Object.entries(fams)) lightLines.push(`  --font-${k}: ${typeof v === "string" && v.includes(",") ? v : `"${v}"`};`);
for (const [k, r] of Object.entries(roles)) {                              // typography scale roles → size / line-height / tracking vars
  if (r && typeof r === "object") {
    if ((r as any).size != null) lightLines.push(`  --text-${k}: ${(r as any).size};`);
    if ((r as any).line_height != null) lightLines.push(`  --leading-${k}: ${(r as any).line_height};`);
    if ((r as any).tracking != null && (r as any).tracking !== "0") lightLines.push(`  --tracking-${k}: ${(r as any).tracking};`);
  }
}
for (const [k, v] of Object.entries(spacing)) lightLines.push(`  --space-${k}: ${typeof v === "number" ? `${v}${spaceUnit}` : v};`);
for (const [k, v] of Object.entries(radii)) lightLines.push(`  --radius-${k}: ${dim(v)};`);
for (const [k, v] of Object.entries(elev)) lightLines.push(`  --elev-${k}: ${refToVar(v)};`);
if (sep.border_width != null) lightLines.push(`  --border-width: ${dim(sep.border_width)};`);

const tokensCss =
  `/* Generated from ${designPath.split("/").pop()} by export-tokens.ts — do not hand-edit. */\n` +
  `:root {\n${lightLines.join("\n")}\n}\n\n` +
  `[data-theme="dark"] {\n${darkLines.join("\n")}\n}\n`;
writeFileSync(join(outDir, "tokens.css"), tokensCss);

// ── theme.css (Tailwind v4) ─────────────────────────────────────────────
const themeLines: string[] = [];
for (const p of PALETTES) for (let i = 1; i <= 12; i++) if (colors[p][i] != null) themeLines.push(`  --color-${p}-${i}: var(--${p}-${i});`);
for (const g of ROLEGROUPS) for (const k of Object.keys(colors[g])) themeLines.push(`  --color-${g}-${k}: var(--${g}-${k});`);
for (const k of Object.keys(fams)) themeLines.push(`  --font-${k}: var(--font-${k});`);
for (const [k, r] of Object.entries(roles)) if (r && typeof r === "object" && (r as any).size != null) themeLines.push(`  --text-${k}: var(--text-${k});`);
for (const k of Object.keys(radii)) themeLines.push(`  --radius-${k}: var(--radius-${k});`);
for (const k of Object.keys(spacing)) themeLines.push(`  --spacing-${k}: var(--space-${k});`);
const themeCss =
  `/* Tailwind v4 theme — @import "./tokens.css" first so the vars resolve (and switch in dark). */\n` +
  `@import "tailwindcss";\n@import "./tokens.css";\n\n@theme inline {\n${themeLines.join("\n")}\n}\n`;
writeFileSync(join(outDir, "theme.css"), themeCss);

// ── tokens.json (DTCG 2025.10) ──────────────────────────────────────────
const dt: any = { color: {}, fontFamily: {}, fontSize: {}, spacing: {}, radius: {} };
for (const p of PALETTES) {
  dt.color[p] = {};
  for (let i = 1; i <= 12; i++) if (colors[p][i] != null) dt.color[p][i] = { $type: "color", $value: colors[p][i] };
  const dk = colors[p].dark ?? {};
  if (Object.keys(dk).length) { dt.color[p].dark = {}; for (let i = 1; i <= 12; i++) if (dk[i] != null) dt.color[p].dark[i] = { $type: "color", $value: dk[i] }; }
}
for (const [k, v] of Object.entries(fams)) dt.fontFamily[k] = { $type: "fontFamily", $value: String(v).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")) };
for (const [k, r] of Object.entries(roles)) if (r && typeof r === "object" && (r as any).size != null) dt.fontSize[k] = { $type: "dimension", $value: String((r as any).size) };
for (const [k, v] of Object.entries(spacing)) dt.spacing[k] = { $type: "dimension", $value: typeof v === "number" ? `${v}${spaceUnit}` : v };
for (const [k, v] of Object.entries(radii)) dt.radius[k] = { $type: "dimension", $value: dim(v) };
writeFileSync(join(outDir, "tokens.json"), JSON.stringify(dt, null, 2));

console.log(`✓ exported design tokens from ${designPath.split("/").pop()} → ${outDir}`);
console.log(`  tokens.css   (${lightLines.length} CSS vars, light + ${darkLines.length} dark)`);
console.log(`  theme.css    (Tailwind v4 @theme — ${themeLines.length} mapped tokens)`);
console.log(`  tokens.json  (DTCG: ${PALETTES.length} palettes, ${Object.keys(fams).length} fonts, ${Object.keys(dt.fontSize).length} type roles, ${Object.keys(spacing).length} spacing, ${Object.keys(radii).length} radii)`);
