// ─────────────────────────────────────────────────────────────────────────
// oklch.ts — shared color math for the premium-product-templates tooling.
// Used by BOTH the headless palette generator (scripts/generate-palette.ts)
// and the brand-kit viewer (for hex rendering + live APCA badges).
//
// Implements research §C.15 (OKLCH 12-step derivation) with the canonical
// curves locked in the build plan §3.6. Framework-agnostic (browser + node).
// ─────────────────────────────────────────────────────────────────────────

export type RGB = [number, number, number]; // 0..1
export interface LCH { L: number; C: number; H: number; }

// ── OKLab / OKLCH ⇄ linear sRGB ⇄ sRGB ───────────────────────────────────
function oklabToLinearSrgb(L: number, a: number, b: number): RGB {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}
const linToSrgb = (c: number): number =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

export function oklchToSrgb01(L: number, C: number, H: number): RGB {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  return oklabToLinearSrgb(L, a, b).map(linToSrgb) as RGB;
}

export function inGamut(srgb: RGB, eps = 0.0008): boolean {
  return srgb.every((v) => v >= -eps && v <= 1 + eps);
}

/** Reduce chroma (binary search) until the color is inside sRGB. */
export function clampChroma(L: number, C: number, H: number): number {
  if (inGamut(oklchToSrgb01(L, C, H))) return C;
  let lo = 0, hi = C;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklchToSrgb01(L, mid, H))) lo = mid; else hi = mid;
  }
  return lo;
}

export function oklchToHex(L: number, C: number, H: number): string {
  const [r, g, b] = oklchToSrgb01(L, C, H).map((v) =>
    Math.max(0, Math.min(255, Math.round(v * 255)))
  );
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

/** Parse an `oklch(L C H)` string (the template's authoring format). */
export function parseOklch(str: string): LCH | null {
  const m = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/i);
  if (!m) return null;
  return { L: parseFloat(m[1]), C: parseFloat(m[2]), H: parseFloat(m[3]) };
}

const srgbToLinear = (c: number): number => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

/** Convert a hex string (#rgb or #rrggbb) to OKLCH. */
export function hexToOklch(hex: string): LCH | null {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  const r = srgbToLinear(parseInt(h.slice(0, 2), 16) / 255);
  const g = srgbToLinear(parseInt(h.slice(2, 4), 16) / 255);
  const b = srgbToLinear(parseInt(h.slice(4, 6), 16) / 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L: round(L, 3), C: round(Math.hypot(A, B), 3), H: round(H, 1) };
}

/** Accept either `oklch(L C H)` or a hex string — so users can pass their brand hex directly. */
export function parseColor(str: string): LCH | null {
  return parseOklch(str) ?? hexToOklch(str);
}

export const fmtOklch = (L: number, C: number, H: number): string =>
  `oklch(${round(L, 3)} ${round(clampChroma(L, C, H), 3)} ${H})`;

function round(n: number, d: number): number {
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

// ── APCA (0.1.x — perceptual contrast) ────────────────────────────────────
function apcaY(srgb: RGB): number {
  const [r, g, b] = srgb.map((v) => Math.max(0, Math.min(1, v)));
  return 0.2126729 * r ** 2.4 + 0.7151522 * g ** 2.4 + 0.0721750 * b ** 2.4;
}

/** APCA Lc (absolute value) for text on background, both as sRGB 0..1. */
export function apca(text: RGB, bg: RGB): number {
  const blk = 0.022;
  let Yt = apcaY(text), Yb = apcaY(bg);
  if (Yt < blk) Yt += (blk - Yt) ** 1.414;
  if (Yb < blk) Yb += (blk - Yb) ** 1.414;
  if (Math.abs(Yb - Yt) < 0.0005) return 0;
  let Lc: number;
  if (Yb > Yt) {
    const S = (Yb ** 0.56 - Yt ** 0.57) * 1.14;
    Lc = S < 0.1 ? 0 : (S - 0.027) * 100;
  } else {
    const S = (Yb ** 0.65 - Yt ** 0.62) * 1.14;
    Lc = S > -0.1 ? 0 : (S + 0.027) * 100;
  }
  return Math.abs(Lc);
}

export const apcaOklch = (txt: LCH, bg: LCH): number =>
  apca(oklchToSrgb01(txt.L, txt.C, txt.H), oklchToSrgb01(bg.L, bg.C, bg.H));

// ── Canonical derivation curves (build plan §3.6) ─────────────────────────
export const L_STD   = [0.99, 0.97, 0.95, 0.92, 0.88, 0.83, 0.75, 0.66, 0.55, 0.49, 0.38, 0.22];
export const C_MULT  = [0.10, 0.10, 0.18, 0.30, 0.45, 0.60, 0.75, 0.90, 1.00, 0.95, 0.55, 0.30];
export const L_DARK  = [0.17, 0.21, 0.24, 0.28, 0.32, 0.37, 0.44, 0.53, 0.62, 0.68, 0.79, 0.93];
// High-lightness variant for amber/yellow bases (L_brand > 0.66) — step 9 = base L.
export const L_HI    = [0.99, 0.97, 0.94, 0.91, 0.88, 0.84, 0.80, 0.76, 0.72, 0.64, 0.50, 0.34];
export const L_HI_DK = [0.18, 0.22, 0.26, 0.31, 0.37, 0.44, 0.52, 0.62, 0.72, 0.78, 0.85, 0.93];
// Neutral chroma = the "cream" base curve, scaled by `chromaScale` (the warmth/tint knob).
// chromaScale ≈ 1.0 → full cream; ≈ 0.2 → subtle warm off-white; → 0 → pure gray.
export const CREAM_C    = [0.016, 0.018, 0.020, 0.022, 0.022, 0.020, 0.018, 0.015, 0.013, 0.012, 0.010, 0.008];
export const CREAM_C_DK = [0.010, 0.012, 0.013, 0.014, 0.014, 0.013, 0.012, 0.011, 0.010, 0.010, 0.009, 0.007];

export const SATURATION: Record<string, number> = { muted: 0.7, default: 1.0, vivid: 1.3 };
export type Step = { step: number; L: number; C: number; H: number; oklch: string; hex: string };

function tune(steps: LCH[], reverse: boolean): void {
  const bg = oklchToSrgb01(steps[1].L, steps[1].C, steps[1].H);
  for (const [idx, target] of [[10, 60], [11, 90]] as const) {
    let { L, C, H } = steps[idx];
    for (let i = 0; i < 40; i++) {
      if (apca(oklchToSrgb01(L, C, H), bg) >= target) break;
      L = reverse ? L + 0.02 : L - 0.02;
      if (L <= 0.04 || L >= 0.985) break;
      C = clampChroma(L, C, H);
    }
    steps[idx] = { L, C, H };
  }
}

function toSteps(lch: LCH[]): Step[] {
  return lch.map((s, i) => {
    const C = clampChroma(s.L, s.C, s.H); // gamut-clamp once; oklch + hex stay consistent
    return {
      step: i + 1, L: round(s.L, 3), C: round(C, 3), H: s.H,
      oklch: `oklch(${round(s.L, 3)} ${round(C, 3)} ${s.H})`,
      hex: oklchToHex(s.L, C, s.H),
    };
  });
}

export function genAccent(
  baseL: number, baseC: number, H: number, satMult = 1.0
): { light: Step[]; dark: Step[] } {
  const hi = baseL > 0.66;
  const baseCurve = hi ? L_HI : L_STD;
  const darkCurve = hi ? L_HI_DK : L_DARK;
  const step10Delta = hi ? 0.08 : 0.06;
  // §C.15: step 9 = the brand L; step 10 = one notch darker. Steps 1–8 and 11–12
  // keep the fixed ramp so the palette rebuilds AROUND the chosen base lightness.
  const lightL = baseCurve.map((L, i) =>
    i === 8 ? baseL : i === 9 ? Math.max(0.12, baseL - step10Delta) : L);
  const light: LCH[] = lightL.map((L, i) => ({ L, C: clampChroma(L, baseC * C_MULT[i] * satMult, H), H }));
  const dark: LCH[] = darkCurve.map((L, i) => ({ L, C: clampChroma(L, baseC * C_MULT[i] * satMult * 0.72, H), H }));
  tune(light, false);
  tune(dark, true);
  return { light: toSteps(light), dark: toSteps(dark) };
}

export function genNeutral(H: number, chromaScale = 0.25): { light: Step[]; dark: Step[] } {
  const light: LCH[] = L_STD.map((L, i) => ({ L, C: CREAM_C[i] * chromaScale, H }));
  const dark: LCH[] = L_DARK.map((L, i) => ({ L, C: CREAM_C_DK[i] * chromaScale, H }));
  tune(light, false);
  tune(dark, true);
  return { light: toSteps(light), dark: toSteps(dark) };
}

export interface GenInput {
  base: LCH;                 // primary brand color (anchored to step 9)
  saturation?: string;       // muted | default | vivid
  neutralHue?: number;       // default = brand hue
  neutralChromaScale?: number; // warmth/tint intensity (default 0.25; Temperance uses 0.2 at hue 85)
  success?: LCH; warning?: LCH; danger?: LCH;
}

export function generateAll(input: GenInput) {
  const sat = SATURATION[input.saturation ?? "default"] ?? 1.0;
  const nHue = input.neutralHue ?? input.base.H;
  const success = input.success ?? { L: 0.55, C: 0.13, H: 145 };
  const warning = input.warning ?? { L: 0.72, C: 0.15, H: 75 };
  const danger  = input.danger  ?? { L: 0.55, C: 0.20, H: 25 };
  return {
    primary: genAccent(input.base.L, input.base.C, input.base.H, sat),
    neutral: genNeutral(nHue, input.neutralChromaScale ?? 0.25),
    success: genAccent(success.L, success.C, success.H, sat),
    warning: genAccent(warning.L, warning.C, warning.H, sat),
    danger:  genAccent(danger.L, danger.C, danger.H, sat),
  };
}
