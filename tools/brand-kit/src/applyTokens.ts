// Builds the CSS-variable stylesheet from the loaded DESIGN.md tokens.
// Palette steps are emitted per-mode ([data-theme=light|dark]); role tokens
// reference the step vars so they adapt automatically when the theme flips.

const PALETTES = ["primary", "neutral", "success", "warning", "danger"] as const;

export function buildTokenCss(t: any): string {
  const light: string[] = [];
  const dark: string[] = [];
  for (const p of PALETTES) {
    const pal = t.colors?.[p];
    if (!pal) continue;
    for (let n = 1; n <= 12; n++) {
      if (pal[n]) light.push(`--${p}-${n}:${pal[n]};`);
      if (pal.dark?.[n]) dark.push(`--${p}-${n}:${pal.dark[n]};`);
    }
  }

  const roles = `
    --surface-canvas:var(--neutral-1); --surface-subtle:var(--neutral-2);
    --surface-raised:var(--neutral-3); --surface-overlay:var(--neutral-1);
    --border-subtle:var(--neutral-6); --border-default:var(--neutral-7); --border-strong:var(--neutral-8);
    --text-primary:var(--neutral-12); --text-secondary:var(--neutral-11);
    --text-disabled:var(--neutral-8); --text-inverse:var(--neutral-1); --text-link:var(--primary-11);
  `;

  const radiusScale = t.radius?.scale ?? {};
  const radius = Object.entries(radiusScale)
    .map(([k, v]) => `--radius-${k}:${Number(v) >= 9999 ? "9999px" : v + "px"};`)
    .join("");

  const elevScale = t.elevation?.scale ?? {};
  const elev = Object.entries(elevScale).map(([k, v]) => `--elev-${k}:${v};`).join("");

  const fam = t.typography?.families ?? {};
  const fb = t.typography?.fallbacks ?? {};
  const assign = t.typography?.fallback_assignments ?? {};
  // Fallback stack per font CATEGORY — pulled from the PROJECT's typography (DESIGN.md), never brand-specific.
  const stack = (cat?: string) =>
    cat === "serif" ? (fb.serif ?? "ui-serif, Georgia, serif")
    : cat === "mono" ? (fb.mono ?? "ui-monospace, SFMono-Regular, Menlo, monospace")
    : (fb.sans ?? "ui-sans-serif, system-ui, sans-serif");
  const ff = (name: string | undefined, cat?: string) => (name ? `"${name}", ${stack(cat)}` : stack(cat));
  // --font-sans = body · --font-display = heading (toolbar can override) · --font-mono = code/data.
  const font = `--font-sans:${ff(fam.body ?? fam.display, assign.body)};` +
    `--font-display:${ff(fam.display ?? fam.body, assign.display)};` +
    `--font-mono:${ff(fam.mono, assign.mono ?? "mono")};`;

  return `
.bk-root[data-theme="light"]{${light.join("")}}
.bk-root[data-theme="dark"]{${dark.join("")}}
.bk-root{${roles}${radius}${elev}${font}}
`;
}
