// ─────────────────────────────────────────────────────────────────────────
// load-tokens.ts — reads a project's DESIGN.md + INFORMATION.md, parses the
// YAML frontmatter, resolves {token.path} references, copies brand assets, and
// writes src/data/tokens.json + brand.json for the viewer to consume.
//
// This is the "A1" reader: the .md files are the source of truth; this turns
// them into render-ready data. Point it at a project, or it defaults to the
// bundled sample/ so the viewer demos out of the box.
//   node scripts/load-tokens.ts                          # the bundled sample
//   node scripts/load-tokens.ts --root <projectRoot>     # finds DESIGN.md/INFORMATION.md
//   node scripts/load-tokens.ts --design <p> --information <p>   # explicit paths
// ─────────────────────────────────────────────────────────────────────────
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, readdirSync } from "node:fs";
import { join, basename, dirname, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const appDir = fileURLToPath(new URL("..", import.meta.url)); // tools/brand-kit/

/** Find a doc within a project root (root, or one level deep). Tries each candidate name in order;
 *  for DESIGN we accept DESIGN.md OR DESIGN_MOBILE.md so mobile-only projects can be reviewed too. */
function findDoc(rootDir: string, candidates: string[]): string {
  for (const name of candidates) {
    const direct = join(rootDir, name);
    if (existsSync(direct)) return direct;
  }
  for (const entry of readdirSync(rootDir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      for (const name of candidates) {
        const nested = join(rootDir, entry.name, name);
        if (existsSync(nested)) return nested;
      }
    }
  }
  throw new Error(`Could not find ${candidates.join(" / ")} under ${rootDir}`);
}

const root = arg("root");
const designPath = arg("design") ?? (root ? findDoc(root, ["DESIGN.md", "DESIGN_MOBILE.md"]) : join(appDir, "sample/DESIGN.md"));
const infoPath = arg("information") ?? (root ? findDoc(root, ["INFORMATION.md"]) : join(appDir, "sample/INFORMATION.md"));
// Asset base: refined below from INFORMATION.md `assets.assets_base_path` if declared.
let assetBase = root ?? dirname(infoPath);
const dataDir = join(appDir, "src/data");
const publicAssets = join(appDir, "public/assets");
mkdirSync(dataDir, { recursive: true });
mkdirSync(publicAssets, { recursive: true });

/** Extract + parse YAML frontmatter (between the first two `---` lines). */
function frontmatter(path: string): any {
  const text = readFileSync(path, "utf8");
  const parts = text.split(/^---\s*$/m);
  if (parts.length < 3) throw new Error(`No frontmatter found in ${path}`);
  return parseYaml(parts[1]);
}

/** Resolve a dotted path against root; recurse so ref-chains collapse fully. */
function resolveString(s: string, rootObj: any, depth = 0): string {
  if (depth > 12) return s;
  return s.replace(/\{([^}]+)\}/g, (full, path: string) => {
    const val = path.split(".").reduce((acc: any, k: string) => (acc == null ? acc : acc[k]), rootObj);
    if (val === undefined || typeof val === "object") return full; // leave unresolved / don't inline objects
    return resolveString(String(val), rootObj, depth + 1);
  });
}

/** Resolve {a.b.c} references (whole-string AND embedded) throughout the tree. */
function resolveRefs(obj: any, rootObj: any): any {
  if (typeof obj === "string") return resolveString(obj, rootObj);
  if (Array.isArray(obj)) return obj.map((v) => resolveRefs(v, rootObj));
  if (obj && typeof obj === "object") {
    const out: any = {};
    for (const [k, v] of Object.entries(obj)) out[k] = resolveRefs(v, rootObj);
    return out;
  }
  return obj;
}

const design = frontmatter(designPath);
const info = frontmatter(infoPath);
const tokens = resolveRefs(design, design);

// Honor INFORMATION.md → assets.assets_base_path (relative to --root, else the doc's folder).
const declaredBase = info?.assets?.assets_base_path;
if (typeof declaredBase === "string" && declaredBase.trim() && !declaredBase.includes("<")) {
  assetBase = isAbsolute(declaredBase) ? declaredBase : join(root ?? dirname(infoPath), declaredBase);
}

// ── Copy brand assets referenced in INFORMATION.md (paths are project-root-relative) ──
function copyAsset(relPath: string | undefined): string | null {
  if (!relPath || relPath.includes("<") || relPath.toLowerCase().includes("tbd")) return null;
  const src = isAbsolute(relPath) ? relPath : join(assetBase, relPath);
  if (!existsSync(src)) { console.warn(`  ! asset not found: ${src}`); return null; }
  const name = basename(src);
  copyFileSync(src, join(publicAssets, name));
  return `/assets/${name}`;
}

const logo = info?.assets?.logo ?? {};
const brand = {
  name: info?.project?.name ?? tokens?.brand?.name ?? "Brand",
  tagline: info?.project?.tagline ?? "",
  description: info?.project?.one_liner ?? tokens?.brand?.description ?? "",
  archetype: info?.brand?.personality?.archetype ?? "",
  toneDescriptors: info?.brand?.personality?.tone_descriptors ?? [],
  values: info?.brand?.values ?? [],
  voice: tokens?.brand?.voice ?? "",
  voiceSamples: info?.brand?.voice_principles
    ? Object.values(info.brand.voice_principles).filter((v) => typeof v === "string")
    : [],
  logos: {
    lockup: copyAsset(logo.primary),
    brandmark: copyAsset(logo.icon_only),
    darkVariant: copyAsset(logo.dark_mode_variant), // null until produced
  },
  markColor: tokens?.colors?.primary?.base ?? tokens?.colors?.primary?.["9"] ?? tokens?.colors?.neutral?.["12"] ?? "#111111",
};

// Apply surface_separation shadow tuning to the elevation scale, so the viewer's elevation
// swatches + cards render the project's actual shadow_strength / shadow_size (per §Surface separation).
const sep = tokens?.surface_separation ?? {};
const STRENGTH = { subtle: 0.7, default: 1.0, strong: 1.4 };
const SIZE = { tight: 0.85, default: 1.0, airy: 1.2 };
const aMul = STRENGTH[sep.shadow_strength] ?? 1.0; // opacity multiplier
const sMul = SIZE[sep.shadow_size] ?? 1.0;          // blur + offset multiplier
if ((aMul !== 1.0 || sMul !== 1.0) && tokens?.elevation?.scale) {
  for (const k of Object.keys(tokens.elevation.scale)) {
    let v = tokens.elevation.scale[k];
    if (typeof v !== "string" || v === "none") continue;
    if (sMul !== 1.0) v = v.replace(/(-?\d*\.?\d+)px/g, (_, n) => `${+(parseFloat(n) * sMul).toFixed(2)}px`);
    if (aMul !== 1.0) v = v.replace(/\/\s*(\d*\.?\d+)\s*\)/g, (_, n) => `/ ${+Math.min(1, parseFloat(n) * aMul).toFixed(3)})`);
    tokens.elevation.scale[k] = v;
  }
}

writeFileSync(join(dataDir, "tokens.json"), JSON.stringify(tokens, null, 2));
writeFileSync(join(dataDir, "brand.json"), JSON.stringify(brand, null, 2));

console.log("✓ tokens.json + brand.json written to src/data/");
console.log(`  brand: ${brand.name} — "${brand.tagline}"`);
console.log(`  logos: lockup=${brand.logos.lockup} mark=${brand.logos.brandmark} dark=${brand.logos.darkVariant}`);
console.log(`  palettes: ${Object.keys(tokens.colors ?? {}).filter((k) => tokens.colors[k]?.["9"]).join(", ")}`);
