#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────
// run-qa.mjs: the automated, framework-agnostic half of a premium.md QA.md.
// Drives Playwright (the PROJECT's devDependency) against a running site and checks:
//   Gate E   every gates.viewport_matrix size x theme, the in-between sweep, above the fold,
//            the wide end; no horizontal scroll, no element crossing the viewport edge unless
//            clipped, and the page must actually render (a blank page never passes)
//   Gate E2  WebKit on every touch size (emulated), hover / :active / vh / fixed-bar rules read
//            from the served CSS; real iOS Safari is always reported "unverified"
//   Gate A   prefers-reduced-motion and forced-colors render (the parts a script can see)
//   Gate B   lab LCP, CLS, TBT and initial JS (gzipped) on a throttled phone profile
//   Gate B2  scripted scroll on a phone and a desktop profile: rAF frame times (p95) against the
//            60 and 120 Hz budgets, long tasks, WebGL contexts, backdrop-filter layers, and each
//            DESIGN effects.registry entry (found by [data-effect="<name>"])
// Writes <out>/results/<date>.json + <date>.md and <out>/viewports/<date>/*.png.
// Exit 0 only when no check failed; 1 when one did; 2 on a setup problem.
// ─────────────────────────────────────────────────────────────────────────
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const HELP = `Usage: node run-qa.mjs --url <http://localhost:PORT> [options]

  --url <url>        the running site (production build preferred: vite preview, next start, ...)
  --root <dir>       project root holding QA.md and DESIGN.md (or docs/), default .
  --out <dir>        evidence folder, relative to --root, default qa
  --only <list>      run only these gates, comma separated: E,E2,A,B,B2
  --paths <list>     pages to check, comma separated, default /
  --expect <css>     selector that must exist for a page to count as rendered (default: none,
                     the text-length guard still applies)
  --shots <mode>     full | viewport | none, default full
  --concurrency <n>  parallel browser contexts for the matrix, default 4
  --help             this text

Needs Node >= 22.18 and Playwright installed in the project:
  npm i -D playwright && npx playwright install chromium webkit`;

// ── args ────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const arg = (n, def) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : def; };
if (flag("help") || flag("h")) { console.log(HELP); process.exit(0); }
const URL0 = arg("url");
if (!URL0) { console.error("run-qa: --url is required\n\n" + HELP); process.exit(2); }
const ROOT = resolve(arg("root", "."));
const OUT = resolve(ROOT, arg("out", "qa"));
const ONLY = arg("only") ? new Set(arg("only").split(",").map((s) => s.trim().toUpperCase())) : null;
const PATHS = arg("paths", "/").split(",").map((s) => s.trim()).filter(Boolean);
const EXPECT = arg("expect", "");
const SHOTS_MODE = arg("shots", "full");
const CONC = Math.max(1, Number(arg("concurrency", "4")));
const want = (g) => !ONLY || ONLY.has(g);
const DATE = new Date().toLocaleDateString("en-CA");
const HERE = dirname(fileURLToPath(import.meta.url));

// ── YAML parser: the vendored one beside brand-kit, in the repo AND in the skill bundle ──
async function loadYaml() {
  const candidates = [
    join(HERE, "../brand-kit/scripts/vendor/yaml.mjs"),          // tools/qa-harness or reference/qa-harness
    join(ROOT, "tools/brand-kit/scripts/vendor/yaml.mjs"),       // a project that copied brand-kit in
  ];
  for (const c of candidates) if (existsSync(c)) return (await import(pathToFileURL(c).href)).parse;
  try { return (await import(pathToFileURL(createRequire(join(ROOT, "package.json")).resolve("yaml")).href)).parse; } catch {}
  console.error(`run-qa: no YAML parser found (looked in ${candidates.join(", ")} and the project's node_modules/yaml)`);
  process.exit(2);
}
// Playwright resolves from the PROJECT, not from this script's folder.
async function loadPlaywright() {
  try {
    const m = await import(pathToFileURL(createRequire(join(ROOT, "package.json")).resolve("playwright")).href);
    return m.default ?? m;
  } catch {
    console.error(`run-qa: Playwright is not installed in ${ROOT}. Install it there:\n  npm i -D playwright && npx playwright install chromium webkit`);
    process.exit(2);
  }
}
const parseYaml = await loadYaml();
function frontmatter(names) {
  for (const n of names) for (const p of [join(ROOT, n), join(ROOT, "docs", n)])
    if (existsSync(p)) { const parts = readFileSync(p, "utf8").split(/^---\s*$/m); return { path: p, data: parts.length >= 3 ? parseYaml(parts[1]) ?? {} : {} }; }
  return null;
}
const qaDoc = frontmatter(["QA.md"]);
const designDoc = frontmatter(["DESIGN.md", "DESIGN_MOBILE.md"]);
if (!qaDoc?.data?.gates?.viewport_matrix) { console.error(`run-qa: no gates.viewport_matrix in QA.md frontmatter under ${ROOT} (or docs/)`); process.exit(2); }
const G = qaDoc.data.gates;
const PERF = G.performance ?? {};
const RT = PERF.runtime ?? {};
const D = designDoc?.data ?? {};
const MATRIX = G.viewport_matrix;
const outOfScope = (MATRIX.out_of_scope ?? []).map(String);
const CLASSES = Object.entries(MATRIX)
  .filter(([k, v]) => v && typeof v === "object" && Array.isArray(v.sizes) && !outOfScope.some((o) => o.split(/[\s(]/)[0] === k))
  .map(([name, v]) => ({ name, touch: v.input === "touch", sizes: v.sizes.map((s) => { const [w, h] = String(s.size ?? s).split("x").map(Number); return { w, h, dpr: Number(s.dpr ?? 1), label: `${w}x${h}` }; }) }));
const THEMES = Array.isArray(MATRIX.themes) ? MATRIX.themes : /dark/i.test(String(MATRIX.themes ?? "light and dark")) ? ["light", "dark"] : ["light"];
const REGISTRY = D.effects?.registry ?? [];
const num = (v, d) => (typeof v === "number" ? v : Number.isFinite(parseFloat(v)) ? parseFloat(v) : d);

// ── results ─────────────────────────────────────────────────────────────
const results = [];
function record(gate, check, status, detail) {
  if (typeof status === "boolean") status = status ? "pass" : "fail";
  results.push({ gate, check, status, detail });
  const mark = { pass: "PASS", fail: "FAIL", unverified: "UNVERIFIED", "n/a": "N/A" }[status];
  console.log(`${mark.padEnd(10)} ${gate.padEnd(3)} ${check}`);
}
const SHOTDIR = join(OUT, "viewports", DATE);
if (SHOTS_MODE !== "none") mkdirSync(SHOTDIR, { recursive: true });
async function shot(page, name) {
  if (SHOTS_MODE === "none") return;
  await page.screenshot({ path: join(SHOTDIR, `${name}.png`), fullPage: SHOTS_MODE === "full" }).catch(() => {});
}
async function pool(items, n, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}
const pct = (arr, p) => { if (!arr.length) return 0; const s = [...arr].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.ceil((p / 100) * s.length) - 1)]; };
const r1 = (n) => Math.round(n * 10) / 10;

// ── in-page probes (serialized into the page, so they must be self-contained) ──
function inspect() {
  const de = document.documentElement, W = de.clientWidth, offenders = [];
  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || el.closest("[data-qa-offcanvas]")) continue;
    const r = el.getBoundingClientRect();
    if ((r.width === 0 && r.height === 0) || (r.left >= -0.5 && r.right <= W + 0.5)) continue;
    let a = el.parentElement, clipped = false;
    while (a && a !== document.body) {
      const s = getComputedStyle(a);
      if (/hidden|clip|auto|scroll/.test(s.overflowX) || /paint|strict|content/.test(s.contain) || s.clipPath !== "none") { clipped = true; break; }
      a = a.parentElement;
    }
    if (!clipped) offenders.push(`${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}${[...el.classList].slice(0, 3).map((c) => "." + c).join("")} [${Math.round(r.left)}, ${Math.round(r.right)}]`);
  }
  const bg = (e) => getComputedStyle(e).backgroundColor;
  return {
    scrollWidth: de.scrollWidth, clientWidth: W, overflow: de.scrollWidth > W + 1,
    offenders: offenders.slice(0, 8), offenderCount: offenders.length,
    textLen: (document.body?.innerText ?? "").trim().length,
    bodyHeight: document.body?.scrollHeight ?? 0,
    bg: bg(document.body) === "rgba(0, 0, 0, 0)" ? bg(de) : bg(document.body),
    fg: getComputedStyle(document.body).color,
  };
}

// ── main ────────────────────────────────────────────────────────────────
const pw = await loadPlaywright();
const base = URL0.replace(/\/$/, "");
const urlOf = (p) => base + (p.startsWith("/") ? p : "/" + p);
try { const r = await fetch(urlOf(PATHS[0])); if (!r.ok) throw new Error(`HTTP ${r.status}`); }
catch (e) { console.error(`run-qa: ${urlOf(PATHS[0])} is not reachable (${e.message}). Start the site first.`); process.exit(2); }

const consoleErrors = [];
const browsers = {};
async function browser(kind) {
  if (!(kind in browsers)) browsers[kind] = await pw[kind].launch().catch((e) => ({ error: e.message.split("\n")[0] }));
  return browsers[kind];
}
async function open(b, { w, h, dpr = 1, touch = false, scheme = "light", reducedMotion, forcedColors, path = "/", init }) {
  const kind = b.browserType().name();
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: touch && kind !== "firefox", hasTouch: touch, colorScheme: scheme, reducedMotion, forcedColors });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => consoleErrors.push(`${kind} ${w}x${h} ${path}: ${e.message}`));
  await page.goto(urlOf(path), { waitUntil: "load", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  return { ctx, page };
}
// "page actually rendered": text present, the --expect selector (if any), and at least half the
// text the reference desktop load had (this is what catches a blank WebKit page).
const refText = {};
async function rendered(page, path) {
  const r = await page.evaluate(inspect);
  const hasExpect = EXPECT ? await page.$(EXPECT).then(Boolean) : true;
  const ref = refText[path] ?? 0;
  const ok = r.textLen >= 20 && r.bodyHeight > 0 && hasExpect && r.textLen >= ref * 0.5;
  return { ...r, rendered: ok, why: ok ? "" : `PAGE DID NOT RENDER (text ${r.textLen} chars vs reference ${ref}${EXPECT && !hasExpect ? `, no ${EXPECT}` : ""})` };
}
const bad = (r) => r.overflow || r.offenderCount > 0 || !r.rendered;
const brief = (r) => ({ scrollWidth: r.scrollWidth, clientWidth: r.clientWidth, offenders: r.offenders, ...(r.rendered ? {} : { rendered: r.why }) });

try {
  const cr = await browser("chromium");
  if (cr.error) { console.error(`run-qa: Chromium will not launch (${cr.error}). Run: npx playwright install chromium`); process.exit(2); }
  for (const path of PATHS) {
    const { ctx, page } = await open(cr, { w: 1440, h: 900, path });
    refText[path] = (await page.evaluate(inspect)).textLen;
    await ctx.close();
  }
  const tag = (path) => (PATHS.length > 1 ? `${path.replace(/\W+/g, "_") || "home"}-` : "");

  // ═════ Gate E: the matrix x themes, the sweep, fold, wide end ═════
  if (want("E")) {
    for (const path of PATHS) {
      const jobs = CLASSES.flatMap((c) => c.sizes.flatMap((s) => THEMES.map((scheme) => ({ c, s, scheme }))));
      const fails = [], themeBg = {};
      await pool(jobs, CONC, async ({ c, s, scheme }) => {
        const { ctx, page } = await open(cr, { w: s.w, h: s.h, dpr: s.dpr, touch: c.touch, scheme, path });
        const r = await rendered(page, path);
        (themeBg[scheme] ??= new Set()).add(r.bg + "|" + r.fg);
        if (bad(r)) fails.push({ class: c.name, size: s.label, theme: scheme, ...brief(r) });
        await shot(page, `${tag(path)}${c.name}-${s.label}-${scheme}`);
        await ctx.close();
      });
      const sizes = CLASSES.reduce((n, c) => n + c.sizes.length, 0);
      record("E", `${path}: viewport matrix, ${sizes} sizes x ${THEMES.join(" + ")} (Chromium): no horizontal scroll, no edge crossings, page rendered`, fails.length === 0,
        fails.length ? fails : `${sizes * THEMES.length}/${sizes * THEMES.length} clean; classes: ${CLASSES.map((c) => c.name).join(", ")}${outOfScope.length ? `; out of scope: ${outOfScope.join(", ")}` : ""}; screenshots ${SHOTDIR}`);
      if (THEMES.includes("dark")) {
        const same = [...(themeBg.light ?? [])].some((x) => themeBg.dark?.has(x));
        record("E", `${path}: dark theme actually applies (page colours differ from light)`, !same, same ? "light and dark loads painted the same background and text colour: is the dark theme wired to prefers-color-scheme?" : { light: [...themeBg.light], dark: [...themeBg.dark] });
      }

      const sw = MATRIX.in_between_sweep;
      if (sw) {
        const touchBelow = num(sw.touch_below_px, 768), widths = [];
        for (let w = num(sw.from_px, 320); w <= num(sw.to_px, 1920); w += num(sw.step_px, 40)) widths.push(w);
        const sf = [];
        await pool(widths, CONC, async (w) => {
          const { ctx, page } = await open(cr, { w, h: num(sw.height_px, 900), touch: w < touchBelow, dpr: w < touchBelow ? 2 : 1, path });
          const r = await rendered(page, path);
          if (bad(r)) sf.push({ width: w, ...brief(r) });
          await ctx.close();
        });
        record("E", `${path}: in-between sweep ${widths[0]} to ${widths.at(-1)} px every ${sw.step_px} px (touch below ${touchBelow})`, sf.length === 0, sf.length ? sf.sort((a, b) => a.width - b.width) : `${widths.length}/${widths.length} widths clean`);
      }

      // (b) above the fold: the h1 and the first link/button after it inside its section
      for (const [w, h] of [[1280, 720], [1440, 900]]) {
        const { ctx, page } = await open(cr, { w, h, path });
        const f = await page.evaluate(() => {
          const h1 = document.querySelector("h1");
          if (!h1) return null;
          const scope = h1.closest("section, header, main, [role=main]") ?? document.body;
          const all = [...scope.querySelectorAll("a[href], button")].filter((e) => e.getClientRects().length && (h1.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING));
          const cta = all[0];
          return { h1Bottom: Math.round(h1.getBoundingClientRect().bottom), ctaBottom: cta ? Math.round(cta.getBoundingClientRect().bottom) : null, cta: cta?.textContent.trim().slice(0, 40) ?? null, vh: innerHeight };
        });
        if (!f) record("E", `${path}: (b) above the fold at ${w}x${h}`, "unverified", "no h1 on the page; check the SPEC above-the-fold content by eye");
        else record("E", `${path}: (b) above the fold at ${w}x${h}: headline + first CTA visible`, f.h1Bottom <= f.vh && (f.ctaBottom == null || f.ctaBottom <= f.vh), f);
        await ctx.close();
      }

      // (c) the wide end: text lines <= 75ch in their own font, content capped and centred
      const capKey = D.options?.container_width ?? D.containers?.default ?? "lg";
      const cap = num(D.containers?.[capKey], 1440);
      for (const w of [1920, 2560]) {
        const { ctx, page } = await open(cr, { w, h: 1080, path });
        const m = await page.evaluate(() => {
          const probe = (el) => { const p = document.createElement("span"), cs = getComputedStyle(el); for (const k of ["fontFamily", "fontSize", "fontWeight", "letterSpacing"]) p.style[k] = cs[k]; Object.assign(p.style, { position: "absolute", display: "block", inlineSize: "75ch", visibility: "hidden" }); document.body.append(p); const x = p.getBoundingClientRect().width; p.remove(); return x; };
          const text = [...document.querySelectorAll("p, li, blockquote, dd, figcaption")].filter((e) => e.getClientRects().length && e.textContent.trim().length > 60);
          const over = text.map((e) => ({ e, w: e.getBoundingClientRect().width, m: probe(e) })).filter((x) => x.w > x.m + 1).map((x) => `${x.e.tagName.toLowerCase()} "${x.e.textContent.trim().slice(0, 30)}" ${Math.round(x.w)} > ${Math.round(x.m)}`);
          const boxes = [...document.querySelectorAll("h1, h2, h3, p, li")].filter((e) => e.getClientRects().length).map((e) => e.getBoundingClientRect());
          const L = Math.min(...boxes.map((b) => b.left)), R = Math.max(...boxes.map((b) => b.right));
          return { overMeasure: over.slice(0, 6), textBlocks: text.length, contentWidth: Math.round(R - L), leftGap: Math.round(L), rightGap: Math.round(innerWidth - R) };
        });
        const ok = m.overMeasure.length === 0 && m.contentWidth <= cap + 2 * 32 && Math.abs(m.leftGap - m.rightGap) <= w * 0.04;
        record("E", `${path}: (c) wide end ${w} px: lines <= 75ch, content caps near ${cap} px and centres`, ok, m);
        await shot(page, `${tag(path)}wide-${w}`);
        await ctx.close();
      }
    }
    record("E", "(d) real iOS Safari on an iPhone / iPad", "unverified", "needs a real device (Safari Web Inspector); emulation never satisfies (d)");
  }

  // ═════ Gate E2: WebKit on touch sizes + touch rules read from the served CSS ═════
  if (want("E2")) {
    const touchClasses = CLASSES.filter((c) => c.touch);
    const wk = await browser("webkit");
    if (!touchClasses.length) record("E2", "touch sizes", "n/a", "no touch class in the viewport matrix");
    else if (wk.error) record("E2", "WebKit pass on touch sizes", "unverified", `WebKit did not launch (${wk.error}). Run: npx playwright install webkit`);
    else for (const path of PATHS) {
      const jobs = touchClasses.flatMap((c) => c.sizes.map((s) => ({ c, s })));
      const fails = [];
      await pool(jobs, CONC, async ({ c, s }) => {
        const { ctx, page } = await open(wk, { w: s.w, h: s.h, dpr: s.dpr, touch: true, path });
        const r = await rendered(page, path);
        if (bad(r)) fails.push({ class: c.name, size: s.label, ...brief(r) });
        await shot(page, `${tag(path)}webkit-${c.name}-${s.label}`);
        await ctx.close();
      });
      record("E2", `${path}: WebKit (Safari engine, emulated) on all ${jobs.length} touch sizes: no overflow, page rendered`, fails.length === 0, fails.length ? fails : `${jobs.length}/${jobs.length} clean; screenshots webkit-*.png`);
    }
    for (const path of PATHS) {
      const { ctx, page } = await open(cr, { w: 390, h: 844, dpr: 3, touch: true, path });
      const css = await page.evaluate(() => {
        const hoverOutside = [], hovers = [], selectors = new Set(), vh = [], unreadable = [];
        const walk = (rules, media) => {
          for (const r of rules) {
            if (r.media && r.cssRules) walk(r.cssRules, [...media, r.conditionText ?? r.media.mediaText]);
            else if (r.cssRules && !r.selectorText) walk(r.cssRules, media);
            if (!r.selectorText) continue;
            for (const sel of r.selectorText.split(",").map((s) => s.trim())) {
              selectors.add(sel);
              if (sel.includes(":hover")) { hovers.push(sel); if (!media.some((m) => /hover:\s*hover/.test(m))) hoverOutside.push(sel); }
            }
            if (/(^|[^svdl])\b\d+(\.\d+)?vh\b/.test(r.style?.cssText ?? "")) vh.push(r.selectorText);
          }
        };
        for (const s of document.styleSheets) { try { walk(s.cssRules, []); } catch { unreadable.push(s.href); } }
        const noActive = hovers.filter((h) => !selectors.has(h.replace(/:hover/g, ":active")) && !selectors.has(h.replace(/:hover/g, ":focus-visible")));
        const H = innerHeight, W = innerWidth;
        const bars = [...document.querySelectorAll("body *")].filter((e) => { const cs = getComputedStyle(e); if (!/fixed|sticky/.test(cs.position) || cs.display === "none") return false; const r = e.getBoundingClientRect(); return r.width >= W * 0.9 && (r.top <= 1 || r.bottom >= H - 1) && r.height > 0; })
          .map((e) => ({ el: e.tagName.toLowerCase() + [...e.classList].slice(0, 2).map((c) => "." + c).join(""), position: getComputedStyle(e).position }));
        const sheetsText = [...document.styleSheets].map((s) => { try { return [...s.cssRules].map((r) => r.cssText).join(""); } catch { return ""; } }).join("");
        return { hoverOutside: [...new Set(hoverOutside)].slice(0, 10), noActive: [...new Set(noActive)].slice(0, 10), hoverCount: hovers.length, vh: [...new Set(vh)].slice(0, 10), bars, safeArea: /safe-area-inset/.test(sheetsText), unreadable };
      });
      const sheetsNote = css.unreadable.length ? `; ${css.unreadable.length} cross-origin stylesheet(s) not readable` : "";
      record("E2", `${path}: hover only under (hover: hover); every :hover has an :active (or :focus-visible) twin`, css.hoverOutside.length === 0 && css.noActive.length === 0, { hoverRules: css.hoverCount, outsideHoverQuery: css.hoverOutside, missingActive: css.noActive, note: `read from the served CSS${sheetsNote}` });
      record("E2", `${path}: no bare vh units (svh / dvh / lvh only)`, css.vh.length === 0, css.vh.length ? css.vh : "none in the served CSS");
      record("E2", `${path}: full-width fixed/sticky bars touching the top or bottom edge on a phone`, css.bars.length === 0 ? "pass" : "unverified",
        css.bars.length ? { bars: css.bars, safeAreaInsetsInCss: css.safeArea, note: "allowed only after a real-iPhone check (iOS paints toolbar-coloured bars over them)" } : "none");
      await ctx.close();
    }
    record("E2", "scroll locks block wheel, touchmove and scroll keys", "unverified", "needs the loader / modal / menu open; check by hand or add a project test");
    record("E2", "real iOS Safari, 60 Hz and 120 Hz", "unverified", "needs a real iPhone / iPad (ProMotion)");
  }

  // ═════ Gate A (part): reduced motion + forced colors render ═════
  if (want("A")) for (const path of PATHS) {
    {
      const { ctx, page } = await open(cr, { w: 1440, h: 900, reducedMotion: "reduce", path });
      const r = await rendered(page, path);
      const m = await page.evaluate(() => {
        const motionProps = /transform|translate|scale|rotate|offset|left|top|margin|inset/;
        const running = document.getAnimations().filter((a) => a.playState === "running");
        const moving = running.filter((a) => a.effect?.getTiming?.().iterations === Infinity && a.effect.getKeyframes().some((k) => Object.keys(k).some((p) => motionProps.test(p))));
        return { running: running.length, infiniteMotion: moving.map((a) => a.animationName ?? a.id ?? "animation").slice(0, 8), scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior };
      });
      await shot(page, `${tag(path)}pref-reduced-motion`);
      record("A", `${path}: prefers-reduced-motion: renders, no endless motion, no smooth scrolling`, !bad(r) && m.infiniteMotion.length === 0 && m.scrollBehavior !== "smooth", { ...m, ...(bad(r) ? brief(r) : {}) });
      await ctx.close();
    }
    {
      const { ctx, page } = await open(cr, { w: 1440, h: 900, forcedColors: "active", path });
      const r = await rendered(page, path);
      await shot(page, `${tag(path)}pref-forced-colors`);
      record("A", `${path}: forced-colors: active renders with no overflow (look at pref-forced-colors.png)`, !bad(r), bad(r) ? brief(r) : "renders; screenshot saved");
      await ctx.close();
    }
  }

  // ═════ Gate B: lab load metrics on a throttled phone ═════
  if (want("B")) for (const path of PATHS) {
    const ctx = await cr.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });
    await ctx.addInitScript(() => {
      const P = (window.__qa = { lcp: 0, lcpEl: "", cls: 0, long: [] });
      try { new PerformanceObserver((l) => l.getEntries().forEach((e) => { P.lcp = e.startTime; P.lcpEl = e.element ? e.element.tagName.toLowerCase() + (e.element.className && typeof e.element.className === "string" ? "." + e.element.className.split(" ")[0] : "") : e.url; })).observe({ type: "largest-contentful-paint", buffered: true }); } catch {}
      try { new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) P.cls += e.value; })).observe({ type: "layout-shift", buffered: true }); } catch {}
      try { new PerformanceObserver((l) => l.getEntries().forEach((e) => P.long.push(e.duration))).observe({ type: "longtask", buffered: true }); } catch {}
    });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.goto(urlOf(path), { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(4000);
    const p = await page.evaluate(() => ({ ...window.__qa, scripts: performance.getEntriesByType("resource").filter((e) => e.initiatorType === "script" || /\.m?js(\?|$)/.test(e.name)).map((e) => e.name), dev: !!document.querySelector('script[src*="/@vite/client"], script[src*="react-refresh"], script[src*="webpack-hmr"], script[src*="turbopack"]') || window.__NEXT_DATA__?.buildId === "development" }));
    await ctx.close();
    let jsBytes = 0;
    for (const s of new Set(p.scripts)) { try { jsBytes += gzipSync(Buffer.from(await (await fetch(s)).arrayBuffer())).length; } catch {} }
    const tbt = p.long.reduce((s, d) => s + Math.max(0, d - 50), 0);
    const lab = (ok) => (p.dev ? "unverified" : ok);
    const devNote = p.dev ? " DEV SERVER DETECTED: numbers are not a production measurement; rerun against a production build (vite preview, next start, ...)." : "";
    const prof = "lab: 412x915 phone, 150 ms RTT / 1.6 Mbps, 4x CPU";
    record("B", `${path}: LCP <= ${PERF.LCP_s_max ?? 2.5} s (${prof})`, lab(p.lcp / 1000 <= num(PERF.LCP_s_max, 2.5)), `${(p.lcp / 1000).toFixed(2)} s, element ${p.lcpEl || "n/a"}.${devNote}`);
    record("B", `${path}: CLS <= ${PERF.CLS_max ?? 0.1}`, lab(p.cls <= num(PERF.CLS_max, 0.1)), `${p.cls.toFixed(4)}.${devNote}`);
    record("B", `${path}: TBT <= ${PERF.TBT_ms_max_lab ?? 200} ms (lab proxy for INP)`, lab(tbt <= num(PERF.TBT_ms_max_lab, 200)), `${Math.round(tbt)} ms; long tasks: ${p.long.map(Math.round).join(", ") || "none"}.${devNote}`);
    record("B", `${path}: initial JS <= ${PERF.js_kb_max_initial ?? 200} KB gzipped`, lab(jsBytes / 1024 <= num(PERF.js_kb_max_initial, 200)), `${r1(jsBytes / 1024)} KB across ${new Set(p.scripts).size} script(s), gzipped here.${devNote}`);
    if (want("B2")) record("B2", `${path}: no main-thread task > ${RT.long_task_ms_max ?? 50} ms during load (4x CPU)`, lab(Math.max(0, ...p.long) <= num(RT.long_task_ms_max, 50)), p.long.length ? `${p.long.map(Math.round).join(", ")} ms` : "none");
  }
  if (want("B")) record("B", "Core Web Vitals at p75 of field data (CrUX / RUM), field INP", "unverified", "needs real users; the lab numbers above are the proxy");

  // ═════ Gate B2: runtime smoothness ═════
  if (want("B2")) {
    const initFx = () => {
      const fx = (window.__fx = { webgl: 0, c2d: 0 });
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (t, ...a) { const c = orig.call(this, t, ...a); if (c && !this.__qaCounted) { this.__qaCounted = true; if (/webgl/.test(t)) fx.webgl++; else if (t === "2d") fx.c2d++; } return c; };
      const raf = window.requestAnimationFrame.bind(window);
      fx.ext = 0;
      window.requestAnimationFrame = (cb) => { if (!cb.__qa) fx.ext++; return raf(cb); };
    };
    const survey = () => {
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.width > 0; };
      const els = [...document.querySelectorAll("body *")];
      const back = els.filter((e) => { const v = getComputedStyle(e).backdropFilter; return v && v !== "none"; });
      const anims = document.getAnimations().filter((a) => a.playState === "running");
      return { backdropTotal: back.length, backdropVisible: back.filter(vis).length, filters: els.filter((e) => getComputedStyle(e).filter !== "none").length, video: document.querySelectorAll("video").length, canvas: document.querySelectorAll("canvas").length, webgl: window.__fx.webgl, canvas2d: window.__fx.c2d, infiniteAnimations: anims.filter((a) => a.effect?.getTiming?.().iterations === Infinity).length };
    };
    const idleLoops = () => new Promise((res) => { const s = window.__fx.ext; let n = 0; const tick = () => { if (++n < 30) { const f = () => tick(); f.__qa = true; requestAnimationFrame(f); } else res(Math.round((window.__fx.ext - s) / 30)); }; const f = () => tick(); f.__qa = true; requestAnimationFrame(f); });
    const startFrames = () => {
      const S = (window.__frames = { iv: [], long: [], on: true });
      let last = 0;
      const loop = (t) => {
        if (!S.on) return;
        if (last) S.iv.push(t - last);
        last = t;
        loop.__qa = true; requestAnimationFrame(loop);
      };
      loop.__qa = true; requestAnimationFrame(loop);
      try { S.obs = new PerformanceObserver((l) => l.getEntries().forEach((e) => S.long.push(e.duration))); S.obs.observe({ type: "longtask" }); } catch {}
    };
    const stopFrames = () => { const S = window.__frames; S.on = false; S.obs?.disconnect(); return { iv: S.iv, long: S.long }; };
    async function scrollMeasure(page, cdp, touch, fromY, toY) {
      await page.evaluate((y) => scrollTo(0, y), fromY);
      await page.waitForTimeout(300);
      await page.evaluate(startFrames);
      for (const [a, b] of [[fromY, toY], [toY, fromY]]) {          // both directions
        let y = a;
        while (Math.abs(b - y) > 4) {
          const step = Math.sign(b - y) * Math.min(Math.abs(b - y), 1600);
          await cdp.send("Input.synthesizeScrollGesture", { x: 100, y: 300, yDistance: -step, speed: 1600, gestureSourceType: touch ? "touch" : "mouse", preventFling: true });
          const now = await page.evaluate(() => scrollY);
          if (Math.abs(now - y) < 2) break;
          y = now;
        }
      }
      return page.evaluate(stopFrames);
    }
    const b60 = num(RT.frame_p95_ms_max_60hz, 16.7), b120 = num(RT.frame_p95_ms_max_120hz, 8.3), bLong = num(RT.long_task_ms_max, 50);
    const profiles = [
      { label: "phone (390x844, touch, 4x CPU)", w: 390, h: 844, dpr: 3, touch: true, cpu: 4 },
      { label: "desktop (1440x900, mouse)", w: 1440, h: 900, dpr: 1, touch: false, cpu: 1 },
    ];
    function judge(m, label) {
      const p95 = pct(m.iv, 95), refresh = pct(m.iv, 50), longMax = Math.max(0, ...m.long);
      const dropped = m.iv.filter((x) => x > refresh * 1.5).length;
      const ok60 = p95 <= b60 + 1 && longMax <= bLong;    // +1 ms: vsync jitter of the emulated 60 Hz display
      const s120 = ok60 ? "unverified" : "fail";      // a 60 Hz miss is a 120 Hz miss; a 60 Hz pass proves nothing about 120 Hz
      return { ok60, s120, detail: { frames: m.iv.length, refreshMs: r1(refresh), p95Ms: r1(p95), dropped, longTaskMaxMs: Math.round(longMax), budgets: { p95_60hz: b60, p95_120hz: b120, long_task: bLong } }, label };
    }
    for (const path of PATHS) {
      // survey: what effects exist (registry + what the page actually runs)
      const { ctx: sctx, page: sp } = await open(cr, { w: 1440, h: 900, path, init: initFx });
      await sp.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } scrollTo(0, 0); });
      const sv = { ...(await sp.evaluate(survey)), rafLoopsIdle: await sp.evaluate(idleLoops) };
      await sctx.close();
      const costly = sv.webgl + sv.canvas2d + sv.video + sv.backdropTotal + sv.infiniteAnimations + sv.rafLoopsIdle > 0;
      record("B2", `${path}: WebGL contexts <= ${RT.webgl_contexts_max ?? 8}`, sv.webgl <= num(RT.webgl_contexts_max, 8), `${sv.webgl} live`);
      record("B2", `${path}: continuous loops in view <= ${D.effects?.limits?.continuous_loops_per_viewport_max ?? 1} (idle, top of page)`, sv.rafLoopsIdle + sv.infiniteAnimations <= num(D.effects?.limits?.continuous_loops_per_viewport_max, 1), { rafCallbacksPerFrameIdle: sv.rafLoopsIdle, infiniteAnimations: sv.infiniteAnimations });

      let maxBackdrop = 0;
      for (const pr of profiles) {
        const ctx = await cr.newContext({ viewport: { width: pr.w, height: pr.h }, deviceScaleFactor: pr.dpr, isMobile: pr.touch, hasTouch: pr.touch });
        await ctx.addInitScript(initFx);
        const page = await ctx.newPage();
        await page.goto(urlOf(path), { waitUntil: "load" });
        await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
        const cdp = await ctx.newCDPSession(page);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: pr.cpu });
        const bottom = await page.evaluate(() => Math.min(document.documentElement.scrollHeight - innerHeight, innerHeight * 20));
        const j = judge(await scrollMeasure(page, cdp, pr.touch, 0, bottom), pr.label);
        maxBackdrop = Math.max(maxBackdrop, (await page.evaluate(survey)).backdropVisible);
        if (!REGISTRY.length && !costly) record("B2", `${path}: page scroll, ${pr.label}, both directions`, j.ok60 ? "n/a" : "fail", { reason: j.ok60 ? "effects.registry is empty and the page runs no WebGL, canvas, video, backdrop-filter, endless animation or rAF loop: frame budgets do not apply" : "registry empty, but scrolling misses the 60 Hz budget", found: sv, ...j.detail });
        else {
          record("B2", `${path}: page scroll, ${pr.label}, both directions: p95 <= ${b60} ms at 60 Hz (lab)`, j.ok60, j.detail);
          record("B2", `${path}: page scroll, ${pr.label}: 120 Hz budget ${b120} ms`, j.s120, { ...j.detail, why: j.s120 === "fail" ? "already misses the 60 Hz budget" : "headless browsers render at 60 Hz, so the 120 Hz budget needs a ProMotion device" });
        }
        for (const e of REGISTRY) {
          const box = await page.evaluate((n) => { const el = document.querySelector(`[data-effect="${CSS.escape(n)}"]`); if (!el) return null; const r = el.getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; }, e.name);
          if (!box) { record("B2", `effect "${e.name}", ${pr.label}`, "unverified", `no [data-effect="${e.name}"] element on ${path}: tag the effect's root so it can be measured`); continue; }
          const from = Math.max(0, box.top - pr.h), to = Math.min(bottom, Math.max(box.top + box.h, from + 2 * pr.h));   // at least two screens of scroll
          const je = judge(await scrollMeasure(page, cdp, pr.touch, from, to), pr.label);
          record("B2", `effect "${e.name}" (tier ${e.tier ?? "?"}), ${pr.label}, scrolled through both ways: p95 <= ${b60} ms at 60 Hz (lab)`, je.ok60, je.detail);
          record("B2", `effect "${e.name}", ${pr.label}: 120 Hz budget ${b120} ms`, je.s120, je.detail);
        }
        await ctx.close();
      }
      record("B2", `${path}: visible backdrop-filter layers <= ${RT.backdrop_filter_layers_max ?? 2}`, maxBackdrop <= num(RT.backdrop_filter_layers_max, 2), `max ${maxBackdrop} on screen at once (${sv.backdropTotal} on the page)`);
    }
    for (const e of REGISTRY) {
      const missing = ["fallback", "reduced_motion", "measured_p95_ms"].filter((k) => e[k] == null || e[k] === "" || /^</.test(String(e[k])));
      if (!e.devices?.length) missing.push("devices");
      if (num(e.tier, 0) >= 2 && !e.why_not_cheaper) missing.push("why_not_cheaper");
      record("B2", `registry entry "${e.name}" is complete (fallback, reduced-motion path, measured p95 on devices)`, missing.length === 0, missing.length ? `missing: ${missing.join(", ")}` : `measured ${e.measured_p95_ms} ms on ${e.devices.join("; ")}`);
    }
    record("B2", "frame times on the real runtime.devices (120 Hz iPhone/iPad, mid-tier Android)", REGISTRY.length ? "unverified" : "n/a", REGISTRY.length ? "lab numbers above are a proxy; measure on the devices and write measured_p95_ms" : "no registered effects");
  }
  if (consoleErrors.length) record("G", "no uncaught page errors during the run", false, consoleErrors.slice(0, 10));
} finally {
  for (const b of Object.values(browsers)) if (b && !b.error) await b.close().catch(() => {});
}

// ── evidence ────────────────────────────────────────────────────────────
const count = (s) => results.filter((r) => r.status === s).length;
const summary = { pass: count("pass"), fail: count("fail"), unverified: count("unverified"), "n/a": count("n/a") };
mkdirSync(join(OUT, "results"), { recursive: true });
const jsonPath = join(OUT, "results", `${DATE}.json`), mdPath = join(OUT, "results", `${DATE}.md`);
writeFileSync(jsonPath, JSON.stringify({ date: DATE, url: base, paths: PATHS, qa: qaDoc.path, design: designDoc?.path ?? null, screenshots: SHOTS_MODE === "none" ? null : SHOTDIR, summary, results }, null, 2));
const fmt = (d) => (typeof d === "string" ? d : "`" + JSON.stringify(d).slice(0, 400).replace(/`/g, "'") + "`");
const md = [`# QA harness results, ${DATE}`, "", `Site: ${base} (${PATHS.join(", ")}). Evidence: \`${jsonPath}\`${SHOTS_MODE === "none" ? "" : `, screenshots \`${SHOTDIR}\``}.`, "",
  `**${summary.pass} pass, ${summary.fail} fail, ${summary.unverified} unverified, ${summary["n/a"]} not applicable.** Unverified items need a real device, real users or a person; they are never a pass.`, ""];
for (const gate of [...new Set(results.map((r) => r.gate))]) {
  md.push(`## Gate ${gate}`, "", "| Status | Check | Detail |", "|---|---|---|");
  for (const r of results.filter((x) => x.gate === gate)) md.push(`| ${r.status.toUpperCase()} | ${r.check.replace(/\|/g, "/")} | ${fmt(r.detail).replace(/\|/g, "/").replace(/\n/g, " ")} |`);
  md.push("");
}
writeFileSync(mdPath, md.join("\n"));
console.log(`\n${summary.pass} pass, ${summary.fail} fail, ${summary.unverified} unverified, ${summary["n/a"]} n/a. Evidence: ${mdPath}`);
process.exit(summary.fail ? 1 : 0);
