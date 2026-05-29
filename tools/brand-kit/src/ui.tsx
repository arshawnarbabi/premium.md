import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
import { parseOklch, oklchToHex, apca, oklchToSrgb01 } from "./lib/oklch";
// Icons come from the project's chosen family via src/iconAdapter.tsx (passed in as props).

// ── Color swatch (computes hex + APCA from the oklch token) ───────────────
export function Swatch({
  value, step, role, textOnBgFor,
}: { value: string; step?: number | string; role?: string; textOnBgFor?: string }) {
  const lch = parseOklch(value);
  const hex = lch ? oklchToHex(lch.L, lch.C, lch.H) : "#000";
  let badge: number | null = null;
  if (textOnBgFor && lch) {
    const bg = parseOklch(textOnBgFor);
    if (bg) badge = Math.round(apca(oklchToSrgb01(lch.L, lch.C, lch.H), oklchToSrgb01(bg.L, bg.C, bg.H)));
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
      <div style={{
        height: 52, borderRadius: 8, background: value,
        border: "1px solid var(--border-subtle)", position: "relative",
      }}>
        {badge !== null && (
          <span style={{
            position: "absolute", right: 4, bottom: 4, fontSize: 10, fontWeight: 600,
            padding: "1px 5px", borderRadius: 5,
            background: badge >= 60 ? "var(--success-3)" : "var(--danger-3)",
            color: badge >= 60 ? "var(--success-11)" : "var(--danger-11)",
          }}>Lc {badge}</span>
        )}
      </div>
      <div style={{ fontSize: 10.5, lineHeight: 1.3, color: "var(--text-secondary)" }}>
        <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{step}{role ? ` · ${role}` : ""}</div>
        <div className="bk-mono">{hex}</div>
      </div>
    </div>
  );
}

// ── Primitives (thin className wrappers; styling lives in index.css) ──────
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive";
};
export function Button({ variant = "primary", children, ...rest }: BtnProps) {
  return <button className={`bk-btn bk-btn--${variant}`} {...rest}>{children}</button>;
}

export function Badge({ variant = "neutral", children }: { variant?: string; children: ReactNode }) {
  return <span className={`bk-badge bk-badge--${variant}`}>{children}</span>;
}

export function Card({ elevated, children, style }:
  { elevated?: boolean; children: ReactNode; style?: CSSProperties }) {
  return <div className={`bk-card${elevated ? " bk-card--elevated" : ""}`} style={style}>{children}</div>;
}

export function Switch({ on, onClick }: { on: boolean; onClick?: () => void }) {
  return <button className="bk-switch" data-on={on} aria-pressed={on} onClick={onClick} />;
}

// ── Layout helpers (the kit's own chrome — plain Tailwind) ────────────────
export function Section({ id, title, kicker, children }:
  { id: string; title: string; kicker?: string; children: ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: 72 }}>
      {kicker && <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
        textTransform: "uppercase", color: "var(--text-link)", marginBottom: 8 }}>{kicker}</div>}
      <h2 className="bk-h" style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 24px" }}>{title}</h2>
      {children}
    </section>
  );
}

export function Sub({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase",
        color: "var(--text-secondary)", margin: "0 0 14px" }}>{title}</h3>
      {children}
    </div>
  );
}

// Re-export the icon-set type so sections can type their `icons` prop.
export type { IconSet } from "./iconAdapter";
