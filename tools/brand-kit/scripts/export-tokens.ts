// ─────────────────────────────────────────────────────────────────────────
// export-tokens.ts — turns a project's DESIGN.md into BUILD-READY token files,
// so the design tokens reach code without hand-transcription (the #1 drift source).
// Emits three formats from the same source of truth:
//   <out>/tokens.css   — CSS custom properties: :root (light) + [data-theme="dark"] (dark).
//                        Works with ANY stack. Palettes are concrete oklch; role tokens are var() refs.
//                        Covers colours (plus dark ROLE overrides), font stacks with their fallbacks,
//                        type size / leading / weight / letter_spacing per role, measure, spacing (scale +
//                        roles), radius, elevation, motion (profile multiplier applied), containers,
//                        section padding (active profile), focus ring, touch targets, z-index, icon sizes,
//                        and component dimensions / colours from `components`, breakpoints (--bp-*),
//                        variable-font axes (--axis-*), role-to-family bindings (--font-role-*), and
//                        @media (min-width) tier blocks for size_<tier> / X_<tier> keys.
//                        Colour roles repeat in the dark block and in a [data-theme="light"] block, so a
//                        dark SECTION in a light page (and the reverse) resolves against its own ramp.
//                        LEGACY NAMES: every name an older exporter emitted for the same DESIGN.md is
//                        still emitted, as a deprecated alias (--old: var(--new)) in its own block at the
//                        end of :root. Check an upgrade with scripts/compare-tokens.ts (README, Upgrading).
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
import { parse as parseYaml } from "./vendor/yaml.mjs"; // vendored `yaml` parse(): runs on plain node, no install

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
const typo = d.typography ?? {};
const motion = d.motion ?? {};

/** Walk a dotted DESIGN path ("options.heading_weight"); keys may themselves contain dots ("spacing.scale.0.5"). */
function lookup(p: string): any {
  let o: any = d;
  const keys = p.split(".");
  for (let i = 0; i < keys.length; i++) {
    if (o == null || typeof o !== "object") return undefined;
    let hit = false;
    for (let j = keys.length; j > i; j--) {               // longest key first, so "0.5" wins over "0"
      const k = keys.slice(i, j).join(".");
      if (k in o) { o = o[k]; i = j - 1; hit = true; break; }
    }
    if (!hit) return undefined;
  }
  return o;
}

/** {colors.neutral.1} → var(--neutral-1) ; {typography.families.display} → var(--font-display) ; etc. */
function pathToVar(p: string): string {
  if (p.startsWith("colors.shadow_tint")) return "shadow-tint";
  if (p.startsWith("colors.")) return p.slice(7).replace(/\./g, "-");                 // neutral.1, surface.canvas
  if (p.startsWith("typography.families.")) return "font-" + p.slice(20);
  if (p.startsWith("typography.roles.")) return "text-" + ck(p.slice(17));   // {typography.roles.body-md} → var(--text-body-md)
  if (p.startsWith("spacing.scale.")) return "space-" + p.slice(14).replace(/\./g, "_");   // {spacing.scale.0.5} → var(--space-0_5)
  if (p.startsWith("radius.scale.")) return "radius-" + p.slice(13).replace(/\./g, "_");
  if (p.startsWith("elevation.scale.")) return "elev-" + p.slice(16);
  if (p.startsWith("radius.components.")) return "radius-" + kebab(p.slice(18));
  if (p.startsWith("motion.duration.")) return "duration-" + p.slice(16);
  if (p.startsWith("motion.easing.")) return "ease-" + p.slice(14);
  if (p.startsWith("icons.sizes.")) return "icon-" + ck(p.slice(12));
  return p.replace(/\./g, "-");
}
const kebab = (k: string) => k.replace(/[_.]/g, "-");
const ck = (k: string | number) => String(k).replace(/\./g, "_"); // CSS-safe ident: a dot is illegal in a custom-property name (0.5 → 0_5)
/** Token refs become var(); a ref to a plain setting ({options.heading_weight}, {mode.primary}) is inlined. */
const TOKEN_REF = /^(colors|typography\.(families|roles)|spacing\.scale|radius\.(scale|components)|elevation\.scale|motion\.(duration|easing)|icons\.sizes)\./;
const refToVar = (v: any, depth = 0): string =>
  typeof v === "string"
    ? v.replace(/\{([^}]+)\}/g, (m, p) => {
        if (TOKEN_REF.test(p)) return `var(--${pathToVar(p)})`;
        const val = lookup(p);
        return val == null || typeof val === "object" || depth > 8 ? m : refToVar(val, depth + 1);
      })
    : String(v);
const dim = (n: any): string => (typeof n === "number" ? `${n}px` : String(n));
// Legacy names (the v1.21 exporter as projects extended it in their tools/brand-kit/): a dot in a key became "-" instead of
// "_" (--text-heading-5-5xl, --space-0-5), spacing roles had no --space- prefix (--container-padding-desktop),
// container keys kept "-" for "_" (--container-full-cap), the measure was --measure-max. Each is emitted as
// `--legacy: var(--current)` unless a current token already owns that name.
const dashKey = (k: string | number) => String(k).replace(/[^a-zA-Z0-9_-]/g, "-");
const legacy = new Map<string, string>();                   // legacy name → current name
const alias = (oldName: string, current: string) => { if (oldName !== current && !legacy.has(oldName)) legacy.set(oldName, current); };

// ── tokens.css ──────────────────────────────────────────────────────────
const isScalarColor = (v: any) => typeof v === "string" || typeof v === "number";
const lightLines: string[] = [];
const darkLines: string[] = [];
for (const p of PALETTES) {
  for (let i = 1; i <= 12; i++) if (colors[p][i] != null) lightLines.push(`  --${p}-${i}: ${colors[p][i]};`);
  const dk = colors[p].dark ?? {};
  for (let i = 1; i <= 12; i++) if (dk[i] != null) darkLines.push(`  --${p}-${i}: ${dk[i]};`);
}
// Colour roles go into the dark block too, and into a [data-theme="light"] block with the light ramp.
// A custom property's var() is substituted on the element that declares it, so a role declared only on
// :root resolves once against the light ramp and every descendant inherits that resolved colour: a
// data-theme="dark" SECTION would swap its ramp and change no role. Re-declaring the roles on each theme
// selector makes them resolve against the ramp in scope there, which is what makes a dark section in a
// light page (and a light section in a dark page) work, not only a dark document.
const lightThemeLines: string[] = [];
for (const p of PALETTES) for (let i = 1; i <= 12; i++) if (colors[p][i] != null) lightThemeLines.push(`  --${p}-${i}: ${colors[p][i]};`);
for (const g of ROLEGROUPS) for (const [k, v] of Object.entries(colors[g])) if (isScalarColor(v)) {
  const line = `  --${g}-${k}: ${refToVar(v)};`;
  lightLines.push(line); darkLines.push(line); lightThemeLines.push(line);
}
if (typeof colors.shadow_tint === "string") {
  const line = `  --shadow-tint: ${refToVar(colors.shadow_tint)};`;
  lightLines.push(line); darkLines.push(line); lightThemeLines.push(line);
}
/** A family plus its assigned fallback stack (DESIGN: family and fallback always travel together). */
function fontStack(k: string, v: any): string {
  const s = String(v);
  if (s.includes(",")) return s;
  const fb = typo.fallbacks?.[typo.fallback_assignments?.[k] ?? ""];
  return fb ? `"${s}", ${fb}` : `"${s}"`;
}
for (const [k, v] of Object.entries(fams)) lightLines.push(`  --font-${k}: ${fontStack(k, v)};`);
// Variable-font axes from any family that declares them (typography.axes.<family>.<tag>), so a variable
// face renders at the brand instance rather than its fvar defaults.
const axes: Record<string, unknown> = Object.assign({}, ...Object.values(typo.axes ?? {}).filter((v) => v && typeof v === "object"));
for (const [tag, v] of Object.entries(axes)) if (isScalarColor(v)) lightLines.push(`  --axis-${tag.toLowerCase()}: ${v};`);
// The DESIGN templates name letter-spacing `letter_spacing` (web: an em string, mobile: a number in pt/sp);
// `tracking` is still read for older docs. Every role gets every var, "0" included, so the CSS never
// has to guess which roles define one.
const trackingOf = (r: any) => { const t = r.letter_spacing ?? r.tracking; return t == null ? null : typeof t === "number" ? (t === 0 ? "0" : `${t}px`) : String(t); };
for (const [k, r] of Object.entries(roles)) {                              // typography scale roles → size / line-height / weight / tracking vars
  if (r && typeof r === "object") {
    const role = r as any;
    const n = ck(k);                                     // "heading-5.5xl" → "heading-5_5xl"
    if (role.size != null) lightLines.push(`  --text-${n}: ${typeof role.size === "number" ? `${role.size}px` : role.size};`);
    if (role.line_height != null) lightLines.push(`  --leading-${n}: ${role.line_height};`);
    if (role.weight != null) lightLines.push(`  --weight-${n}: ${refToVar(role.weight)};`);
    if (trackingOf(role) != null) lightLines.push(`  --tracking-${n}: ${trackingOf(role)};`);
    // Bind the role to its family, so --text-<role> never renders in whatever face is inherited.
    // font_family is the unresolved ref "{typography.families.body}" or the literal family name.
    if (role.font_family != null) {
      const fm = /families\.([A-Za-z0-9_-]+)/.exec(String(role.font_family));
      const fk = fm ? fm[1] : Object.entries(fams).find(([, v]) => v === role.font_family)?.[0];
      if (fk && fk in fams) lightLines.push(`  --font-role-${n}: var(--font-${fk});`);
    }
    for (const pre of ["text", "leading", "weight", "tracking", "font-role"]) alias(`--${pre}-${dashKey(k)}`, `--${pre}-${n}`);
  }
}
if (typo.measure_max_ch != null) { lightLines.push(`  --measure: ${typo.measure_max_ch}ch;`); alias("--measure-max", "--measure"); }
for (const [k, v] of Object.entries(typo.font_features ?? {})) lightLines.push(`  --font-features-${k}: ${v};`);
for (const [k, v] of Object.entries(spacing)) { lightLines.push(`  --space-${ck(k)}: ${typeof v === "number" ? `${v}${spaceUnit}` : v};`); alias(`--space-${dashKey(k)}`, `--space-${ck(k)}`); }
for (const [k, v] of Object.entries(radii)) { lightLines.push(`  --radius-${ck(k)}: ${dim(v)};`); alias(`--radius-${dashKey(k)}`, `--radius-${ck(k)}`); }
for (const [k, v] of Object.entries(elev)) { lightLines.push(`  --elev-${k}: ${refToVar(v)};`); alias(`--elev-${dashKey(k)}`, `--elev-${k}`); }
if (sep.border_width != null) lightLines.push(`  --border-width: ${dim(sep.border_width)};`);
// Everything else the CSS needs from DESIGN, so nothing is hand-transcribed (QA Gate D).
const isScalar = (v: any) => typeof v === "string" || typeof v === "number";
// Keys starting with "_" are records for humans (breakpoints._freeze_points), never values.
for (const [k, v] of Object.entries(d.spacing?.roles ?? {})) if (!k.startsWith("_") && isScalar(v)) { lightLines.push(`  --space-${kebab(k)}: ${refToVar(v)};`); alias(`--${kebab(k)}`, `--space-${kebab(k)}`); }
for (const [k, v] of Object.entries(d.radius?.components ?? {})) if (isScalar(v)) lightLines.push(`  --radius-${kebab(k)}: ${refToVar(v)};`);
for (const [k, v] of Object.entries(d.elevation?.components ?? {})) if (isScalar(v)) lightLines.push(`  --elev-${kebab(k)}: ${refToVar(v)};`);
const motionMult = Number(motion.profile_modifiers?.[d.profiles?.motion ?? "default"]?.duration_multiplier ?? 1);
for (const [k, v] of Object.entries(motion.duration ?? {})) {
  const ms = parseFloat(String(v));                       // "150ms" → 150 × the motion profile multiplier
  lightLines.push(`  --duration-${k}: ${Number.isFinite(ms) ? `${Math.round(ms * motionMult)}ms` : v};`);
}
for (const [k, v] of Object.entries(motion.easing ?? {})) lightLines.push(`  --ease-${k}: ${v};`);
for (const [k, v] of Object.entries(d.containers ?? {})) if (k !== "default" && !k.startsWith("_") && isScalar(v)) {
  // a container whose value names another container key is a pointer: var() it, never `max-width: full`
  const points = typeof v === "string" && v !== k && d.containers[v] != null;
  lightLines.push(`  --container-${ck(k)}: ${points ? `var(--container-${ck(v)})` : dim(v)};`);
  alias(`--container-${dashKey(k).replace(/_/g, "-")}`, `--container-${ck(k)}`);
}
const containerDefault = d.options?.container_width ?? d.containers?.default;
if (containerDefault != null && d.containers?.[containerDefault] != null) lightLines.push(`  --container-default: var(--container-${ck(containerDefault)});`);
for (const [k, v] of Object.entries(d.breakpoints ?? {})) if (!k.startsWith("_") && isScalar(v)) lightLines.push(`  --bp-${ck(k)}: ${dim(v)};`);
// section_padding.<kind>.<profile>.<device> (template) or .<kind>.<device> (already resolved)
const padProfile = d.profiles?.section_padding ?? "default";
for (const [kind, v] of Object.entries<any>(d.section_padding ?? {})) {
  const devices = v?.[padProfile] && typeof v[padProfile] === "object" ? v[padProfile] : v;
  for (const [dev, px] of Object.entries<any>(devices ?? {})) if (isScalar(px)) lightLines.push(`  --section-${kebab(kind)}-${kebab(dev)}: ${dim(px)};`);
}
const fr = d.states?.focus_ring;
if (fr) {
  if (fr.width != null) lightLines.push(`  --focus-ring-width: ${dim(fr.width)};`);
  if (fr.offset != null) lightLines.push(`  --focus-ring-offset: ${dim(fr.offset)};`);
  if (fr.color != null) lightLines.push(`  --focus-ring-color: ${refToVar(fr.color)};`);
}
const tt = d.touch_targets ?? {};
if (tt.touch_min_px != null) lightLines.push(`  --touch-min: ${dim(tt.touch_min_px)};`);
if (tt.pointer_min_px != null) lightLines.push(`  --pointer-min: ${dim(tt.pointer_min_px)};`);
for (const [k, v] of Object.entries(d.z_index ?? {})) if (isScalar(v)) lightLines.push(`  --z-${kebab(k)}: ${v};`);
for (const [k, v] of Object.entries(d.icons?.sizes ?? {})) if (isScalar(v)) lightLines.push(`  --icon-${ck(k)}: ${dim(v)};`);
// Component dimensions and colours: components.<name>[.sizes|.variants].<...>.<key> → --<name>-<...>-<key>.
// Numbers become px only under dimension-like keys; a string ships only when every {ref} in it resolves.
// Behaviour subtrees (states, constraints, rules) and role names (`type`) are not CSS, so they are skipped.
const SKIP_SUBTREE = /^(states|constraints|mobile_rules|behavior|behaviour|a11y|accessibility|rules|usage|content|copy|notes?)$/;
const DIM_KEY = /(height|width|size|padding|gap|margin|radius|offset|inset|indent|spacing)/;
let componentVars = 0;
function walkComponent(prefix: string[], node: any) {
  for (const [k, v] of Object.entries<any>(node ?? {})) {
    if (SKIP_SUBTREE.test(k) || k === "type") continue;
    const path = k === "sizes" || k === "variants" ? prefix : [...prefix, kebab(ck(k))];
    if (v && typeof v === "object" && !Array.isArray(v)) { walkComponent(path, v); continue; }
    let out: string | null = null;
    if (typeof v === "number" && DIM_KEY.test(k)) out = `${v}px`;
    else if (typeof v === "string" && v.includes("{")) { const r = refToVar(v); if (!r.includes("{")) out = r; }
    if (out != null) { lightLines.push(`  --${path.join("-")}: ${out};`); componentVars++; }
  }
}
for (const [name, c] of Object.entries<any>(d.components ?? {})) if (c && typeof c === "object") walkComponent([kebab(name)], c);
// Per-mode ROLE overrides (dark ramps often need a role to point at a different step to meet APCA):
// a `dark:` map inside a role group (colors.border.dark.subtle), the same shape as a palette's `dark:`
// ramp; this is the documented form (DESIGN templates, §Colors → Dark mode). A flat top-level
// colors_dark_overrides map keyed "group.role" is still read, for docs written before it was
// documented. Both land in [data-theme="dark"] under the light-mode var name.
for (const g of ROLEGROUPS) {
  const dk = colors[g].dark;
  if (dk && typeof dk === "object") for (const [k, v] of Object.entries(dk)) darkLines.push(`  --${g}-${k}: ${refToVar(v)};`);
}
for (const [path, v] of Object.entries(d.colors_dark_overrides ?? {})) darkLines.push(`  --${String(path).replace(/^colors\./, "").replace(/\./g, "-")}: ${refToVar(v)};`);

// ── Tiers: one @media (min-width: breakpoints.<tier>) :root block per tier ─────────────────────
// A role's size_<tier> overrides --text-<role>; a spacing role X_<tier> whose X_desktop sibling exists
// overrides --space-X-desktop; a container key <base>_<tier> overrides --container-<base>. So a value can
// keep growing above the width where its clamp() freezes without any component changing. The tier is the
// LAST "_" segment and must be a declared breakpoint; size_<tier> with no such breakpoint is warned about.
const bps = d.breakpoints ?? {};
const tierLines = new Map<string, string[]>();
const addTier = (tier: string, line: string) => tierLines.set(tier, [...(tierLines.get(tier) ?? []), line]);
for (const [k, v] of Object.entries<any>(d.containers ?? {})) {
  const m = /^(.+)_(\w+)$/.exec(k);
  if (!m || !isScalar(v) || !(m[1] in d.containers) || bps[m[2]] == null || m[2].startsWith("_")) continue;
  addTier(m[2], `    --container-${ck(m[1])}: ${dim(v)};`);
}
for (const [k, v] of Object.entries<any>(d.spacing?.roles ?? {})) {
  const m = /^(.+)_(\w+)$/.exec(k);
  if (!m || !isScalar(v) || !(`${m[1]}_desktop` in d.spacing.roles) || bps[m[2]] == null || m[2].startsWith("_")) continue;
  addTier(m[2], `    --space-${kebab(`${m[1]}_desktop`)}: ${refToVar(v)};`);
}
for (const [k, r] of Object.entries<any>(roles)) {
  if (!r || typeof r !== "object") continue;
  for (const [field, val] of Object.entries<any>(r)) {
    const m = /^size_(.+)$/.exec(field);
    if (!m || val == null) continue;
    if (bps[m[1]] == null) { console.warn(`  ! role "${k}" declares ${field} but breakpoints.${m[1]} does not exist, skipped`); continue; }
    addTier(m[1], `    --text-${ck(k)}: ${typeof val === "number" ? `${val}px` : val};`);
  }
}
const tierCss = [...tierLines.entries()]
  .sort((a, b) => parseFloat(String(bps[a[0]])) - parseFloat(String(bps[b[0]])))
  .map(([t, lines]) => `@media (min-width: ${dim(bps[t])}) {\n  :root {\n${lines.join("\n")}\n  }\n}\n`)
  .join("\n");

// Legacy aliases last in :root, skipping any name a current token already defines.
const defined = new Set(lightLines.map((l) => l.trim().split(":")[0]));
const legacyLines = [...legacy].filter(([o, c]) => !defined.has(o) && defined.has(c)).map(([o, c]) => `  ${o}: var(${c});`);
const tokensCss =
  `/* Generated from ${designPath.split("/").pop()} by export-tokens.ts — do not hand-edit. */\n` +
  `:root {\n${lightLines.join("\n")}\n` +
  (legacyLines.length ? `\n  /* Deprecated names from older exporters (v1.21 and project copies of it), kept so existing CSS keeps working.\n     Each points at its current name; move to the current name, these will be removed in a major release. */\n${legacyLines.join("\n")}\n` : "") +
  `}\n\n` +
  `[data-theme="dark"] {\n${darkLines.join("\n")}\n}\n\n` +
  `[data-theme="light"] {\n${lightThemeLines.join("\n")}\n}\n` +
  (tierCss ? `\n${tierCss}` : "");
writeFileSync(join(outDir, "tokens.css"), tokensCss);

// ── theme.css (Tailwind v4) ─────────────────────────────────────────────
const themeLines: string[] = [];
for (const p of PALETTES) for (let i = 1; i <= 12; i++) if (colors[p][i] != null) themeLines.push(`  --color-${p}-${i}: var(--${p}-${i});`);
for (const g of ROLEGROUPS) for (const [k, v] of Object.entries(colors[g])) if (isScalarColor(v)) themeLines.push(`  --color-${g}-${k}: var(--${g}-${k});`);
for (const k of Object.keys(fams)) themeLines.push(`  --font-${k}: var(--font-${k});`);
for (const [k, r] of Object.entries(roles)) if (r && typeof r === "object" && (r as any).size != null) themeLines.push(`  --text-${ck(k)}: var(--text-${ck(k)});`);
// Tailwind v4's font-weight namespace, so a role's weight reaches utilities next to its size.
for (const [k, r] of Object.entries(roles)) if (r && typeof r === "object" && (r as any).weight != null) themeLines.push(`  --font-weight-${ck(k)}: var(--weight-${ck(k)});`);
for (const k of Object.keys(radii)) themeLines.push(`  --radius-${ck(k)}: var(--radius-${ck(k)});`);
for (const k of Object.keys(spacing)) themeLines.push(`  --spacing-${ck(k)}: var(--space-${ck(k)});`);
// Deprecated legacy utility names (a dot in a key became "-"), so existing class names keep working.
const themeNames = new Set(themeLines.map((l) => l.trim().split(":")[0]));
const themeLegacy: string[] = [];
const themeAlias = (name: string, target: string) => { if (!themeNames.has(name)) { themeNames.add(name); themeLegacy.push(`  ${name}: var(${target});`); } };
for (const [k, r] of Object.entries<any>(roles)) if (r && typeof r === "object" && dashKey(k) !== ck(k)) {
  if (r.size != null) themeAlias(`--text-${dashKey(k)}`, `--text-${ck(k)}`);
  if (r.weight != null) themeAlias(`--font-weight-${dashKey(k)}`, `--weight-${ck(k)}`);
}
for (const k of Object.keys(radii)) if (dashKey(k) !== ck(k)) themeAlias(`--radius-${dashKey(k)}`, `--radius-${ck(k)}`);
for (const k of Object.keys(spacing)) if (dashKey(k) !== ck(k)) themeAlias(`--spacing-${dashKey(k)}`, `--space-${ck(k)}`);
if (themeLegacy.length) themeLines.push("  /* Deprecated names from older exporters (v1.21 and project copies of it); use the names above. */", ...themeLegacy);
const themeCss =
  `/* Tailwind v4 theme — @import "./tokens.css" first so the vars resolve (and switch in dark). */\n` +
  `@import "tailwindcss";\n@import "./tokens.css";\n\n@theme inline {\n${themeLines.join("\n")}\n}\n`;
writeFileSync(join(outDir, "theme.css"), themeCss);

// ── tokens.json (DTCG 2025.10) ──────────────────────────────────────────
const dt: any = { color: {}, fontFamily: {}, fontSize: {}, fontWeight: {}, letterSpacing: {}, duration: {}, spacing: {}, radius: {} };
for (const p of PALETTES) {
  dt.color[p] = {};
  for (let i = 1; i <= 12; i++) if (colors[p][i] != null) dt.color[p][i] = { $type: "color", $value: colors[p][i] };
  const dk = colors[p].dark ?? {};
  if (Object.keys(dk).length) { dt.color[p].dark = {}; for (let i = 1; i <= 12; i++) if (dk[i] != null) dt.color[p].dark[i] = { $type: "color", $value: dk[i] }; }
}
for (const [k, v] of Object.entries(fams)) dt.fontFamily[k] = { $type: "fontFamily", $value: fontStack(k, v).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")) };
for (const [k, r] of Object.entries<any>(roles)) {
  if (!r || typeof r !== "object") continue;
  if (r.weight != null) { const w = Number(refToVar(r.weight)); if (Number.isFinite(w)) dt.fontWeight[ck(k)] = { $type: "fontWeight", $value: w }; }
  if (trackingOf(r) != null) dt.letterSpacing[ck(k)] = { $type: "dimension", $value: trackingOf(r) };
}
for (const [k, v] of Object.entries(motion.duration ?? {})) { const ms = parseFloat(String(v)); if (Number.isFinite(ms)) dt.duration[k] = { $type: "duration", $value: `${Math.round(ms * motionMult)}ms` }; }
for (const [k, r] of Object.entries(roles)) if (r && typeof r === "object" && (r as any).size != null) dt.fontSize[ck(k)] = { $type: "dimension", $value: String((r as any).size) };
for (const [k, v] of Object.entries(spacing)) dt.spacing[ck(k)] = { $type: "dimension", $value: typeof v === "number" ? `${v}${spaceUnit}` : v };
for (const [k, v] of Object.entries(radii)) dt.radius[ck(k)] = { $type: "dimension", $value: dim(v) };
writeFileSync(join(outDir, "tokens.json"), JSON.stringify(dt, null, 2));

console.log(`✓ exported design tokens from ${designPath.split("/").pop()} → ${outDir}`);
console.log(`  tokens.css   (${lightLines.length} CSS vars incl. ${componentVars} component vars, light + ${darkLines.length} dark${legacyLines.length ? `, + ${legacyLines.length} deprecated legacy aliases` : ""})`);
console.log(`  theme.css    (Tailwind v4 @theme — ${themeLines.length} mapped tokens)`);
console.log(`  tokens.json  (DTCG: ${PALETTES.length} palettes, ${Object.keys(fams).length} fonts, ${Object.keys(dt.fontSize).length} type roles, ${Object.keys(spacing).length} spacing, ${Object.keys(radii).length} radii)`);
