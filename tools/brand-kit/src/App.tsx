import { useEffect, useState } from "react";
import tokensData from "./data/tokens.json";
import brandData from "./data/brand.json";
import { buildTokenCss } from "./applyTokens";
import { getIconSet } from "./iconAdapter";
import Specimen from "./sections/Specimen";
import Composition from "./sections/Composition";

const tokens = tokensData as any;
const brand = brandData as any;
const css = buildTokenCss(tokens);
const iconRes = getIconSet(tokens.icons); // chosen family from icons.library, with graceful fallback

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Load the project's declared fonts from Google Fonts (best-effort; non-Google fonts fall back).
  useEffect(() => {
    const fams = tokens.typography?.families ?? {};
    const uniq = [...new Set([fams.display, fams.body, fams.mono].filter(Boolean))] as string[];
    if (!uniq.length) return;
    const q = uniq.map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:ital,wght@0,400;0,500;0,600;0,700;1,400`).join("&");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${q}&display=swap`;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div className="bk-root" data-theme={theme}>
      <style>{css}</style>

      {/* Sticky header (viewer chrome) */}
      <header style={{
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", alignItems: "center", gap: 20,
        padding: "14px 32px", borderBottom: "1px solid var(--border-subtle)",
        background: "color-mix(in oklch, var(--surface-canvas) 85%, transparent)",
        backdropFilter: "blur(12px)",
      }}>
        <strong style={{ fontSize: 16, letterSpacing: "-0.01em" }}>{brand.name}</strong>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Brand Kit</span>
        <nav style={{ display: "flex", gap: 4, marginLeft: 8 }}>
          <a className="bk-link" href="#specimen" style={{ fontSize: 13, padding: "4px 8px" }}>Specimen</a>
          <a className="bk-link" href="#composition" style={{ fontSize: 13, padding: "4px 8px" }}>Composition</a>
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", border: "1px solid var(--border-default)",
          borderRadius: 9999, overflow: "hidden" }}>
          {(["light", "dark"] as const).map((m) => (
            <button key={m} onClick={() => setTheme(m)}
              style={{
                border: "none", cursor: "pointer", padding: "6px 14px", fontSize: 13,
                fontFamily: "var(--font-sans)", textTransform: "capitalize",
                background: theme === m ? "var(--primary-9)" : "transparent",
                color: theme === m ? "#fff" : "var(--text-secondary)",
              }}>{m}</button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 32px 120px" }}>
        <div style={{ marginBottom: 56 }}>
          <h1 className="bk-h" style={{ fontSize: "clamp(2rem, 1.4rem + 2vw, 3rem)", fontWeight: 600,
            letterSpacing: "-0.03em", margin: "0 0 8px" }}>{brand.name} — Brand Kit</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 18, margin: 0, maxWidth: 620 }}>
            Every token from <span className="bk-mono">DESIGN.md</span>, rendered. The specimen shows the
            raw values; the composition shows them working together. Flip the theme to check both modes.
          </p>
        </div>

        <Specimen tokens={tokens} brand={brand} theme={theme}
          icons={iconRes.set} iconMeta={{ library: iconRes.library, supported: iconRes.supported }} />
        <Composition tokens={tokens} brand={brand} icons={iconRes.set} />
      </main>
    </div>
  );
}
