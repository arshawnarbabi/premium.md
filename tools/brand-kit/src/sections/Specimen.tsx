import { Swatch, Sub, Section, Badge, type IconSet } from "../ui";

const PALS = [
  { key: "primary", label: "Primary" },
  { key: "neutral", label: "Neutral" },
  { key: "success", label: "Success" },
  { key: "warning", label: "Warning" },
  { key: "danger", label: "Danger" },
];
const ROLE_LABELS: Record<number, string> = {
  1: "app bg", 2: "subtle", 3: "ui bg", 4: "hover", 5: "active", 6: "border",
  7: "border·i", 8: "focus", 9: "solid", 10: "hover", 11: "text·lo", 12: "text·hi",
};

export default function Specimen({ tokens, brand, theme, icons, iconMeta }:
  { tokens: any; brand: any; theme: "light" | "dark"; icons: IconSet; iconMeta: { library: string; supported: boolean } }) {
  const step = (pal: string, n: number) =>
    theme === "dark" ? tokens.colors?.[pal]?.dark?.[n] : tokens.colors?.[pal]?.[n];

  const roles = tokens.typography?.roles ?? {};
  const roleOrder = ["display-2xl", "display-xl", "display-lg", "heading-md", "heading-sm",
    "body-lg", "body-md", "body-sm", "label-sm", "overline"];
  const spacing = tokens.spacing?.scale ?? {};
  const spaceKeys = ["1", "2", "3", "4", "6", "8", "12", "16", "24"];
  const radius = tokens.radius?.scale ?? {};

  return (
    <Section id="specimen" kicker="Section A" title="Specimen — the raw values">
      {/* Brand identity */}
      <Sub title="Brand">
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "stretch" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "28px 36px",
            display: "flex", alignItems: "center", border: "1px solid var(--border-subtle)" }}>
            {brand.logos?.lockup
              ? <img src={brand.logos.lockup} alt="logo lockup" style={{ height: 56 }} />
              : <span>{brand.name}</span>}
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="bk-h" style={{ fontSize: 24, fontWeight: 600 }}>{brand.name}</div>
            <div style={{ color: "var(--text-secondary)", marginBottom: 10 }}>{brand.tagline}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {brand.archetype && <Badge variant="primary">Archetype · {brand.archetype}</Badge>}
              {(brand.toneDescriptors ?? []).slice(0, 5).map((t: string) => <Badge key={t}>{t}</Badge>)}
            </div>
            <ul style={{ margin: 0, paddingLeft: 18, color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
              {(brand.values ?? []).map((v: string) => <li key={v}>{v}</li>)}
            </ul>
          </div>
        </div>
        {brand.voiceSamples?.length > 0 && (
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
            {brand.voiceSamples.map((s: string, i: number) => (
              <div key={i} style={{ fontStyle: "italic", color: "var(--text-secondary)", fontSize: 14,
                borderLeft: "2px solid var(--primary-9)", paddingLeft: 12 }}>“{s}”</div>
            ))}
          </div>
        )}
      </Sub>

      {/* Color palettes */}
      <Sub title="Color — 12-step palettes (APCA badge on text steps)">
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {PALS.map((p) => (
            <div key={p.key}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{p.label}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 6 }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <Swatch key={n} value={step(p.key, n)} step={n} role={ROLE_LABELS[n]}
                    textOnBgFor={n >= 11 ? step(p.key, 2) : undefined} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Sub>

      {/* Typography */}
      <Sub title={`Typography — ${tokens.typography?.families?.body ?? "system"} · 8 roles`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {roleOrder.filter((r) => roles[r]).map((r) => {
            const role = roles[r];
            return (
              <div key={r} style={{ display: "flex", gap: 20, alignItems: "baseline",
                borderBottom: "1px solid var(--border-subtle)", paddingBottom: 14 }}>
                <div className="bk-mono" style={{ width: 150, flexShrink: 0, fontSize: 11.5, color: "var(--text-secondary)" }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{r}</div>
                  <div>{role.weight} · {role.line_height} · {role.letter_spacing}</div>
                </div>
                <div style={{
                  fontFamily: (r.startsWith("display") || r.startsWith("heading")) ? "var(--font-display)" : "var(--font-sans)",
                  fontSize: role.size, fontWeight: role.weight,
                  lineHeight: role.line_height, letterSpacing: role.letter_spacing,
                  textTransform: role.text_transform || "none", minWidth: 0, overflow: "hidden",
                }}>Crafted with intention</div>
              </div>
            );
          })}
        </div>
      </Sub>

      {/* Spacing + Radius */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <Sub title="Spacing — 4px base">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {spaceKeys.filter((k) => spacing[k] != null).map((k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="bk-mono" style={{ width: 64, fontSize: 12, color: "var(--text-secondary)" }}>
                  space.{k}</span>
                <div style={{ height: 12, width: spacing[k], background: "var(--primary-9)", borderRadius: 3 }} />
                <span className="bk-mono" style={{ fontSize: 12, color: "var(--text-secondary)" }}>{spacing[k]}px</span>
              </div>
            ))}
          </div>
        </Sub>
        <Sub title="Radius">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {Object.entries(radius).map(([k, v]) => (
              <div key={k} style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, background: "var(--primary-3)",
                  border: "2px solid var(--primary-9)",
                  borderRadius: Number(v) >= 9999 ? 9999 : Number(v) }} />
                <div className="bk-mono" style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 6 }}>
                  {k}<br />{String(v)}{Number(v) >= 9999 ? "" : "px"}</div>
              </div>
            ))}
          </div>
        </Sub>
      </div>

      {/* Elevation + Icons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <Sub title="Elevation">
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {["1", "2", "3", "4", "5"].filter((k) => tokens.elevation?.scale?.[k]).map((k) => (
              <div key={k} style={{ width: 84, height: 64, borderRadius: 12, background: "var(--surface-raised)",
                boxShadow: `var(--elev-${k})`, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, color: "var(--text-secondary)" }}>elev {k}</div>
            ))}
          </div>
        </Sub>
        <Sub title="Iconography">
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", color: "var(--text-primary)", alignItems: "center" }}>
            {Object.entries(icons).map(([k, node]) => <span key={k} title={k}>{node}</span>)}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 12 }}>
            {tokens.icons?.family ?? "—"}
            <div style={{ opacity: 0.7, marginTop: 4 }}>
              {iconMeta.supported
                ? `live from the ${iconMeta.library} package`
                : `family "${iconMeta.library}" isn't bundled — showing a Lucide placeholder (wire it in iconAdapter.tsx)`}
            </div>
          </div>
        </Sub>
      </div>
    </Section>
  );
}
