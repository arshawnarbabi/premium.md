import { useState } from "react";
import { Button, Badge, Card, Switch, Sub, Section, type IconSet } from "../ui";

export default function Composition({ tokens, brand, icons }:
  { tokens: any; brand: any; icons: IconSet }) {
  const [tab, setTab] = useState(0);
  const [sw, setSw] = useState(true);
  const roles = tokens.typography?.roles ?? {};
  const tabs = ["Overview", "Activity", "Settings"];

  return (
    <Section id="composition" kicker="Section B" title="Composition — does it hold together?">
      {/* Components */}
      <Sub title="Buttons">
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <Button variant="primary">Get started</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Learn more</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary">{icons.plus}Add item</Button>
        </div>
      </Sub>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <Sub title="Inputs">
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360 }}>
            <input className="bk-input" placeholder="name@example.com…" />
            <input className="bk-input bk-input--error" defaultValue="not-an-email" />
            <div style={{ fontSize: 13, color: "var(--danger-11)" }}>Enter a valid email address.</div>
          </div>
        </Sub>
        <Sub title="Badges & switch">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="danger">Error</Badge>
            <Badge variant="solid-warning">BETA</Badge>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Switch on={sw} onClick={() => setSw(!sw)} />
            <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Notifications</span>
          </div>
        </Sub>
      </div>

      <Sub title="Tabs">
        <div className="bk-tabs">
          {tabs.map((t, i) => (
            <button key={t} className="bk-tab" aria-selected={i === tab} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>
      </Sub>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 32 }}>
        <Sub title="Table">
          <table className="bk-table">
            <thead><tr><th>Name</th><th>Updated</th><th style={{ textAlign: "right" }}>Status</th></tr></thead>
            <tbody>
              {[["First item", "Today", "success"], ["Second item", "Yesterday", "warning"],
                ["Third item", "Mar 14", "danger"]].map(([t, d, s]) => (
                <tr key={t}>
                  <td>{t}</td><td className="bk-tnum">{d}</td>
                  <td style={{ textAlign: "right" }}><Badge variant={s}>{s === "success" ? "Active" : s === "warning" ? "Pending" : "Error"}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Sub>
        <Sub title="Toast">
          <div className="bk-toast">
            <span style={{ color: "var(--success-9)" }}>{icons.check}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Saved</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Your changes were saved.</div>
            </div>
          </div>
        </Sub>
      </div>

      {/* Marketing composition (uses the brand's real name + tagline) */}
      <Sub title="Marketing composition">
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "64px 48px", textAlign: "center",
            background: "linear-gradient(180deg, var(--surface-canvas), var(--primary-2))" }}>
            <div style={{ fontSize: roles.overline?.size, fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", color: "var(--text-link)", marginBottom: 16 }}>{brand.tagline || "Your tagline here"}</div>
            <div className="bk-h" style={{ fontSize: roles["display-2xl"]?.size, fontWeight: 600,
              lineHeight: roles["display-2xl"]?.line_height ?? 1.05,
              letterSpacing: roles["display-2xl"]?.letter_spacing ?? "-0.03em", maxWidth: 640, margin: "0 auto" }}>A headline that earns the scroll.</div>
            <p style={{ fontSize: roles["body-lg"]?.size, color: "var(--text-secondary)", maxWidth: 480,
              margin: "20px auto 28px", lineHeight: roles["body-lg"]?.line_height ?? 1.55 }}>
              A clear, confident subhead — one sentence on the value, in the body font.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Button variant="primary">Get started</Button>
              <Button variant="outline">Learn more</Button>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1,
            background: "var(--border-subtle)" }}>
            {[["calendar", "Feature one", "A short, concrete sentence about what this does."],
              ["check", "Feature two", "Another benefit, written plainly in the body voice."],
              ["bell", "Feature three", "The third pillar — clear and to the point."]].map(([icon, h, b]) => (
              <div key={h as string} style={{ background: "var(--surface-canvas)", padding: 28 }}>
                <span style={{ color: "var(--primary-9)" }}>{icons[icon as keyof IconSet]}</span>
                <div className="bk-h" style={{ fontWeight: 600, fontSize: 18, margin: "12px 0 6px" }}>{h}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>{b}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "var(--primary-9)", color: "#fff", textAlign: "center", padding: "48px 24px" }}>
            <div className="bk-h" style={{ fontSize: 28, fontWeight: 600, letterSpacing: roles["display-lg"]?.letter_spacing ?? "-0.02em", marginBottom: 16 }}>Ready to begin?</div>
            <button className="bk-btn" style={{ background: "#fff", color: "var(--primary-11)" }}>Get started</button>
          </div>
        </Card>
      </Sub>

      {/* App-screen mock */}
      <Sub title="App screen">
        <div style={{ width: 300, margin: "0 auto", borderRadius: 36, padding: 10,
          background: "var(--neutral-12)", boxShadow: "var(--elev-4)" }}>
          <div style={{ borderRadius: 28, overflow: "hidden", background: "var(--surface-canvas)", height: 560,
            display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 18px 12px" }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Welcome back</div>
              <div className="bk-h" style={{ fontSize: 26, fontWeight: 600, letterSpacing: roles["heading-md"]?.letter_spacing ?? "-0.02em" }}>{brand.name}</div>
            </div>
            <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: 10, flex: 1, overflow: "hidden" }}>
              {[["calendar", "Upcoming", "warning"], ["check", "Completed", "success"],
                ["user", "Account", "neutral"]].map(([icon, label, s], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14,
                  background: "var(--surface-raised)", borderRadius: 14, border: "1px solid var(--border-subtle)" }}>
                  <span style={{ color: "var(--primary-9)" }}>{icons[icon as keyof IconSet]}</span>
                  <span style={{ flex: 1, fontSize: 15 }}>{label}</span>
                  <Badge variant={s as string}>{s === "success" ? "Done" : s === "warning" ? "New" : "•"}</Badge>
                </div>
              ))}
              <button className="bk-btn bk-btn--primary" style={{ justifyContent: "center", marginTop: 4 }}>
                {icons.plus}New</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", padding: "12px 0 18px",
              borderTop: "1px solid var(--border-subtle)", background: "var(--surface-subtle)" }}>
              {(["home", "calendar", "search", "settings"] as const).map((k, i) => (
                <span key={k} style={{ color: i === 0 ? "var(--primary-9)" : "var(--text-disabled)" }}>{icons[k]}</span>
              ))}
            </div>
          </div>
        </div>
      </Sub>
    </Section>
  );
}
