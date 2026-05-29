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
  // --font-sans = BODY font (DM Sans); --font-display = heading font (overridden live by the toolbar)
  const font = `--font-sans:"${fam.body ?? fam.display ?? "DM Sans"}", system-ui, sans-serif;` +
    `--font-display:"${fam.display ?? fam.body ?? "DM Sans"}", Georgia, serif;`;

  return `
.bk-root[data-theme="light"]{${light.join("")}}
.bk-root[data-theme="dark"]{${dark.join("")}}
.bk-root{${roles}${radius}${elev}${font}}
`;
}
