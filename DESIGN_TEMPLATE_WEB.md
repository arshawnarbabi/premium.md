---
# ─────────────────────────────────────────────────────────────
# DESIGN_TEMPLATE_WEB.md — Premium web design system template
# Version: 1.0.0
# Platform: web (marketing sites + product/SaaS websites)
# Companion: DESIGN_TEMPLATE_MOBILE.md (separate file for iOS/Android)
#
# HOW TO USE:
# 1. Copy this file to your project as `DESIGN.md`.
# 2. Fill every `<slot>` value. Greppable: `grep -n "<[^>]*>" DESIGN.md` should
#    return zero results once instantiation is complete.
# 3. Run the color-derivation step: given `colors.primary.base` (OKLCH), generate
#    all 12 steps per the algorithm in `§Colors → Generating the scale`. Repeat
#    for `colors.neutral` using `colors.neutral.hue`. Semantic palettes are
#    pre-derived from common anchor hues; override if your brand requires.
# 4. Profiles and pick-one slots have safe defaults. Override only with intent.
# 5. The Markdown body below contains the rules an AI consuming this file
#    must follow. The YAML frontmatter contains the values. Both are normative.
# ─────────────────────────────────────────────────────────────

template_version: "1.0.0"
platform: "web"

# ─── Brand identity (REQUIRED inputs) ───
brand:
  name: "<Brand Name>"
  description: "<one-line product description — what it is, what it does>"
  audience: "<primary persona — who uses this every day, in one sentence>"
  voice: "<1–2 sentence voice descriptor — tone, energy, formality, what to avoid>"

# ─── Mode declaration ───
mode:
  primary: "light"          # light | dark | system
  rtl_support: "disabled"   # enabled | disabled (enabling activates §Internationalization rules)

# ─── Profile selections (preset bundles) ───
profiles:
  radius: "default"           # sharp | default | soft | pill
  type_scale: "balanced"      # compact (1.125) | balanced (1.200) | spacious (1.250) | dramatic (1.333) | editorial (1.414)
  density: "comfortable"      # compact (×0.75) | comfortable (×1.0) | spacious (×1.25)
  motion: "default"           # subtle | default | expressive
  elevation: "default"        # flat (border-only) | default (subtle shadows) | dimensional (richer shadows)
  saturation: "default"       # muted (×0.7 chroma) | default (×1.0) | vivid (×1.3)
  warmth: "neutral"           # cool (hue ≈ 240) | neutral (≈ 60) | warm (≈ 40)
  section_padding: "default"  # compact (~96 px) | default (~128 px) | generous (~160 px)
  chart_minimalism: "default" # tufte (minimal) | default | carbon (full axes/gridlines)

# ─── Pick-one option slots ───
options:
  input_style: "outlined"            # outlined | filled | underlined
  tabs_style: "underline"            # underline | filled
  icon_fill: "outline"               # outline | filled
  avatar_shape: "circle"             # circle | squircle | rounded-square
  modal_backdrop: "blur"             # scrim | blur
  code_surface: "always-dark"        # match-page | always-dark
  onboarding_pattern: "empty-state-driven"  # empty-state-driven | progressive | coach-marks | step-by-step-modal | milestone-checklist
  save_model: "auto-save"            # auto-save | explicit-save
  settings_ia: "sidebar"             # sidebar | tabs | single-page
  container_width: "lg"              # md (1024) | lg (1280) | xl (1440)
  heading_weight: 600                # 600 | 700
  time_format: "hybrid"              # relative-only | absolute-only | hybrid
  number_abbreviation: "contextual"  # short | long | contextual
  product_nav_style: "sidebar"       # top-bar | sidebar | hybrid | none
  hero_variant: "split-asymmetric"   # centered | split-asymmetric | background-led
  toast_position: "top-right"        # top-right | top-center | bottom-right | bottom-center
  footer_style: "multi-column"       # multi-column | minimal
  command_palette: "enabled"         # enabled | disabled
  chart_library: "recharts"          # recharts | visx | tremor | echarts | custom
  illustration_style: "vector"       # vector | 3D | abstract | mixed | none

# ═══════════════════════════════════════════════════════════════
# COLORS
# ═══════════════════════════════════════════════════════════════
# Author in OKLCH. Each 12-step palette derives from a single base color
# using the algorithm in §Colors → Generating the scale.
# Steps 1–12 follow Radix semantic roles (1 = app bg, 9 = solid CTA, 12 = high-contrast text).

colors:
  primary:
    base: "<oklch(L C H) — your brand color; anchored to step 9>"
    # Derived 12-step scale (light mode). Generate at instantiation per §Colors → Generating the scale.
    1:  "<derived>"   # app background
    2:  "<derived>"   # subtle bg / alt stripe
    3:  "<derived>"   # component background
    4:  "<derived>"   # hovered component bg
    5:  "<derived>"   # active/pressed bg
    6:  "<derived>"   # subtle border
    7:  "<derived>"   # interactive border
    8:  "<derived>"   # focus ring / strong border
    9:  "<derived = base>"  # solid CTA background
    10: "<derived>"   # hovered solid
    11: "<derived>"   # low-contrast text (APCA Lc 60 vs step 2)
    12: "<derived>"   # high-contrast text (APCA Lc 90 vs step 2)
    # Dark-mode counterpart — separately derived (NOT inverted; see §Colors → Dark mode):
    dark:
      1:  "<derived>"
      2:  "<derived>"
      3:  "<derived>"
      4:  "<derived>"
      5:  "<derived>"
      6:  "<derived>"
      7:  "<derived>"
      8:  "<derived>"
      9:  "<derived>"
      10: "<derived>"
      11: "<derived>"
      12: "<derived>"

  neutral:
    hue: "<0–360 hue angle — slight tint toward brand warmth>"
    # 12 steps + dark counterpart. Chroma is very low (~0.01–0.03) so neutrals read as gray.
    1:  "<derived>"
    2:  "<derived>"
    3:  "<derived>"
    4:  "<derived>"
    5:  "<derived>"
    6:  "<derived>"
    7:  "<derived>"
    8:  "<derived>"
    9:  "<derived>"
    10: "<derived>"
    11: "<derived>"
    12: "<derived>"
    dark:
      1:  "<derived>"
      2:  "<derived>"
      3:  "<derived>"
      4:  "<derived>"
      5:  "<derived>"
      6:  "<derived>"
      7:  "<derived>"
      8:  "<derived>"
      9:  "<derived>"
      10: "<derived>"
      11: "<derived>"
      12: "<derived>"

  # Optional secondary brand color. Leave commented unless brand truly uses two accents.
  # secondary:
  #   base: "<oklch(L C H)>"
  #   1: "<derived>"  # ... through 12 + dark counterpart, same shape as primary

  # Semantic palettes — pre-anchored to conventional hues. Override `base` only if brand requires.
  success:
    base: "oklch(0.55 0.13 145)"   # green
    1:  "<derived>"
    2:  "<derived>"
    3:  "<derived>"
    4:  "<derived>"
    5:  "<derived>"
    6:  "<derived>"
    7:  "<derived>"
    8:  "<derived>"
    9:  "<derived = base>"
    10: "<derived>"
    11: "<derived>"
    12: "<derived>"
    dark:
      1:  "<derived>"
      2:  "<derived>"
      3:  "<derived>"
      4:  "<derived>"
      5:  "<derived>"
      6:  "<derived>"
      7:  "<derived>"
      8:  "<derived>"
      9:  "<derived>"
      10: "<derived>"
      11: "<derived>"
      12: "<derived>"
  warning:
    base: "oklch(0.72 0.15 75)"    # amber
    1:  "<derived>"
    2:  "<derived>"
    3:  "<derived>"
    4:  "<derived>"
    5:  "<derived>"
    6:  "<derived>"
    7:  "<derived>"
    8:  "<derived>"
    9:  "<derived = base>"
    10: "<derived>"
    11: "<derived>"
    12: "<derived>"
    dark:
      1:  "<derived>"
      2:  "<derived>"
      3:  "<derived>"
      4:  "<derived>"
      5:  "<derived>"
      6:  "<derived>"
      7:  "<derived>"
      8:  "<derived>"
      9:  "<derived>"
      10: "<derived>"
      11: "<derived>"
      12: "<derived>"
  danger:
    base: "oklch(0.55 0.20 25)"    # red
    1:  "<derived>"
    2:  "<derived>"
    3:  "<derived>"
    4:  "<derived>"
    5:  "<derived>"
    6:  "<derived>"
    7:  "<derived>"
    8:  "<derived>"
    9:  "<derived = base>"
    10: "<derived>"
    11: "<derived>"
    12: "<derived>"
    dark:
      1:  "<derived>"
      2:  "<derived>"
      3:  "<derived>"
      4:  "<derived>"
      5:  "<derived>"
      6:  "<derived>"
      7:  "<derived>"
      8:  "<derived>"
      9:  "<derived>"
      10: "<derived>"
      11: "<derived>"
      12: "<derived>"

  # Surface role tokens — reference the underlying neutral steps
  surface:
    canvas: "{colors.neutral.1}"   # page background
    subtle: "{colors.neutral.2}"   # alt-stripe / subtle panel
    raised: "{colors.neutral.3}"   # cards
    overlay: "{colors.neutral.1}"  # modals/popovers (white in light, +1 in dark per §Colors)

  # Border role tokens
  border:
    subtle: "{colors.neutral.6}"   # non-interactive separators
    default: "{colors.neutral.7}"  # interactive borders (inputs, buttons)
    strong: "{colors.neutral.8}"   # hovered/focused interactive

  # Text role tokens
  text:
    primary: "{colors.neutral.12}"
    secondary: "{colors.neutral.11}"
    disabled: "{colors.neutral.8}"
    inverse: "{colors.neutral.1}"
    link: "{colors.primary.11}"

  # Semantic role tokens (use these in components, not the step refs directly)
  semantic:
    success-bg: "{colors.success.3}"
    success-border: "{colors.success.7}"
    success-solid: "{colors.success.9}"
    success-text: "{colors.success.11}"
    warning-bg: "{colors.warning.3}"
    warning-border: "{colors.warning.7}"
    warning-solid: "{colors.warning.9}"
    warning-text: "{colors.warning.11}"
    danger-bg: "{colors.danger.3}"
    danger-border: "{colors.danger.7}"
    danger-solid: "{colors.danger.9}"
    danger-text: "{colors.danger.11}"

  # Shadow tint — used by elevation tokens at low alpha
  shadow_tint: "{colors.neutral.12}"

  # Browser UI integration
  theme_color_meta: "{colors.surface.canvas}"   # <meta name="theme-color"> matches page background
  css_color_scheme: "{mode.primary}"            # set `color-scheme: light|dark` on <html> for native scrollbar contrast

# ═══════════════════════════════════════════════════════════════
# TYPOGRAPHY
# ═══════════════════════════════════════════════════════════════

typography:
  families:
    display: "<font family — default 'Geist Sans' or 'Inter'>"
    body: "<font family — default 'Geist Sans' or 'Inter' (often same as display)>"
    mono: "<font family — default 'Geist Mono' or 'JetBrains Mono'>"
  # The system stack fallback applied automatically:
  fallback_stack: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

  # 8 semantic roles. Sizes shown for ratio=1.200 (balanced profile).
  # Use clamp() for fluid sizing across viewport widths.
  # Re-derive sizes if a different type_scale profile is chosen.
  roles:
    display-2xl:
      size: "clamp(2.5rem, 1.5rem + 4vw, 4rem)"    # 40 → 64 px
      weight: "{options.heading_weight}"             # 600 by default
      line_height: 1.05
      letter_spacing: "-0.03em"
      font_family: "{typography.families.display}"
    display-xl:
      size: "clamp(2rem, 1.25rem + 3vw, 3rem)"     # 32 → 48 px
      weight: "{options.heading_weight}"
      line_height: 1.1
      letter_spacing: "-0.025em"
      font_family: "{typography.families.display}"
    display-lg:
      size: "clamp(1.75rem, 1.25rem + 1.5vw, 2.25rem)"  # 28 → 36 px
      weight: "{options.heading_weight}"
      line_height: 1.1
      letter_spacing: "-0.02em"
      font_family: "{typography.families.display}"
    heading-md:
      size: "1.5rem"   # 24 px
      weight: "{options.heading_weight}"
      line_height: 1.2
      letter_spacing: "-0.015em"
      font_family: "{typography.families.display}"
    heading-sm:
      size: "1.25rem"  # 20 px
      weight: "{options.heading_weight}"
      line_height: 1.25
      letter_spacing: "-0.01em"
      font_family: "{typography.families.display}"
    body-lg:
      size: "1.125rem" # 18 px
      weight: 400
      line_height: 1.55
      letter_spacing: "0"
      font_family: "{typography.families.body}"
    body-md:
      size: "1rem"     # 16 px — base
      weight: 400
      line_height: 1.5
      letter_spacing: "0"
      font_family: "{typography.families.body}"
    body-sm:
      size: "0.8125rem" # 13 px
      weight: 400
      line_height: 1.4
      letter_spacing: "0.005em"
      font_family: "{typography.families.body}"
    label-sm:
      size: "0.875rem" # 14 px
      weight: 500
      line_height: 1.0
      letter_spacing: "0"
      font_family: "{typography.families.body}"
    overline:
      size: "0.75rem"  # 12 px
      weight: 600
      line_height: 1.0
      letter_spacing: "0.08em"
      text_transform: "uppercase"
      font_family: "{typography.families.body}"

  # HTML → role default mapping. Override per context as needed.
  html_mapping:
    marketing:
      h1: "display-2xl"
      h2: "display-lg"
      h3: "heading-md"
      h4: "heading-sm"
      p: "body-md"
      lead_p: "body-lg"
    product:
      h1: "display-lg"
      h2: "heading-md"
      h3: "heading-sm"
      h4: "label-sm"
      p: "body-md"
      lead_p: "body-md"
    universal:
      label: "label-sm"
      caption: "body-sm"
      kbd: "body-sm"
      code: "body-sm"   # rendered in mono

  # Font feature settings applied per role
  font_features:
    body: "'kern' 1, 'liga' 1, 'ss01' 1"
    tabular: "'tnum' 1, 'lnum' 1"
    display: "'ss02' 1, 'calt' 1"

  measure_max_ch: 65  # max-width for body text containers

  # Premium published craft details (industry-standard typographic conventions)
  craft:
    quotes: "typographic"          # use “ ” (curly), never " " (straight)
    ellipsis: "…"                  # use the ellipsis character, never three periods
    units_use_nbsp: true           # "10 MB" / "⌘ K" use non-breaking space (`&nbsp;`)
    rag_target: "balanced"         # avoid widows/orphans in headlines and body
    optical_alignment_tolerance_px: 1  # adjust ±1 px when perception beats geometry

# ═══════════════════════════════════════════════════════════════
# SPACING — 4 px base, 18-step scale. Hardcoded.
# ═══════════════════════════════════════════════════════════════

spacing:
  base: 4
  unit: "px"
  scale:
    "0":   0
    "0.5": 2
    "1":   4
    "1.5": 6
    "2":   8
    "3":   12
    "4":   16
    "5":   20
    "6":   24
    "8":   32
    "10":  40
    "12":  48
    "16":  64
    "20":  80
    "24":  96
    "32":  128
    "40":  160
    "48":  192

  # Density multiplier (applied to between-component spacing only)
  density_multipliers:
    compact: 0.75
    comfortable: 1.0
    spacious: 1.25

  # Common role conventions
  roles:
    text_to_icon_inline: "{spacing.scale.2}"
    label_to_input: "{spacing.scale.2}"
    input_to_helper: "{spacing.scale.1.5}"
    within_card_compact: "{spacing.scale.6}"
    within_card_default: "{spacing.scale.8}"
    between_cards_default: "{spacing.scale.4}"
    container_padding_mobile: "{spacing.scale.4}"
    container_padding_desktop: "{spacing.scale.6}"

# ═══════════════════════════════════════════════════════════════
# SHAPES (RADIUS)
# ═══════════════════════════════════════════════════════════════

radius:
  scale:
    none: 0
    sm:   4
    md:   8
    lg:   12
    xl:   16
    "2xl": 24
    full: 9999
  # Per-component assignments resolved by profile.
  # Default profile assignments shown:
  components:
    button: "{radius.scale.md}"     # sharp→sm, soft→lg, pill→full
    input:  "{radius.scale.md}"     # sharp→sm, soft→md, pill→md
    card:   "{radius.scale.lg}"     # sharp→md, soft→xl, pill→xl
    modal:  "{radius.scale.xl}"     # sharp→lg, soft→2xl, pill→2xl
    badge:  "{radius.scale.sm}"     # sharp→sm, soft→md, pill→full
    chip:   "{radius.scale.full}"
    avatar: "{radius.scale.full}"   # overridden by options.avatar_shape
    tooltip: "{radius.scale.md}"
    code_inline: "{radius.scale.sm}"
    code_block: "{radius.scale.lg}"

# ═══════════════════════════════════════════════════════════════
# ELEVATION & DEPTH
# ═══════════════════════════════════════════════════════════════

elevation:
  # Layered shadow specs (light mode). Each level = key + ambient.
  # Tint via {colors.shadow_tint} (= colors.neutral.12 by default).
  # Profile applies multiplier: flat = use border instead, dimensional = +1 opacity step.
  scale:
    "0": "none"
    "1": "0 1px 2px 0 oklch(from {colors.shadow_tint} l c h / 0.06), 0 1px 3px 0 oklch(from {colors.shadow_tint} l c h / 0.08)"
    "2": "0 2px 4px 0 oklch(from {colors.shadow_tint} l c h / 0.06), 0 4px 8px 0 oklch(from {colors.shadow_tint} l c h / 0.08)"
    "3": "0 4px 8px 0 oklch(from {colors.shadow_tint} l c h / 0.06), 0 8px 16px 0 oklch(from {colors.shadow_tint} l c h / 0.10)"
    "4": "0 8px 16px 0 oklch(from {colors.shadow_tint} l c h / 0.08), 0 16px 32px 0 oklch(from {colors.shadow_tint} l c h / 0.12)"
    "5": "0 16px 32px 0 oklch(from {colors.shadow_tint} l c h / 0.10), 0 32px 64px 0 oklch(from {colors.shadow_tint} l c h / 0.16)"

  # Per-component default assignments
  components:
    card: "{elevation.scale.1}"
    dropdown: "{elevation.scale.2}"
    popover: "{elevation.scale.2}"
    tooltip: "{elevation.scale.3}"
    modal: "{elevation.scale.4}"
    sheet: "{elevation.scale.4}"
    fullscreen: "{elevation.scale.5}"

# ─── Z-INDEX ───

z_index:
  base: 0
  dropdown: 1000
  sticky: 1100
  fixed: 1200
  overlay: 1300
  modal: 1400
  popover: 1500
  tooltip: 1600

# ═══════════════════════════════════════════════════════════════
# MOTION
# ═══════════════════════════════════════════════════════════════

motion:
  duration:
    instant: "100ms"
    fast: "150ms"
    base: "200ms"
    slow: "300ms"
    deliberate: "500ms"

  easing:
    standard: "cubic-bezier(0.2, 0, 0, 1)"
    emphasized: "cubic-bezier(0.2, 0, 0, 1)"
    decelerate: "cubic-bezier(0, 0, 0, 1)"
    accelerate: "cubic-bezier(0.3, 0, 1, 1)"

  spring:
    gentle:  { stiffness: 170, damping: 26 }
    snappy:  { stiffness: 300, damping: 30 }
    bouncy:  { stiffness: 400, damping: 22 }

  # Profile modifiers
  profile_modifiers:
    subtle:    { duration_multiplier: 0.85, stagger_ms: 30, prefer_springs: false }
    default:   { duration_multiplier: 1.0,  stagger_ms: 50, prefer_springs: true }
    expressive: { duration_multiplier: 1.15, stagger_ms: 70, prefer_springs: true }

  # Reduced-motion replacements
  reduced_motion:
    transform_animations: "disable"
    opacity_animations: "preserve"
    parallax: "disable"
    auto_advance_carousels: "disable"
    spring_to_bezier: true

# ═══════════════════════════════════════════════════════════════
# STATES
# ═══════════════════════════════════════════════════════════════

states:
  list: ["default", "hover", "focus", "focus-visible", "active", "pressed", "disabled", "loading", "selected", "error", "success"]

  focus_ring:
    width: 2
    offset: 2
    color: "{colors.primary.8}"
    transition: "{motion.duration.fast} {motion.easing.standard}"

  transitions:
    default_to_hover: { duration: "{motion.duration.fast}", easing: "{motion.easing.standard}" }
    hover_to_default: { duration: "{motion.duration.fast}", easing: "{motion.easing.standard}" }
    to_pressed:       { duration: "{motion.duration.instant}", easing: "{motion.easing.standard}" }
    pressed_to_release: { duration: "{motion.duration.fast}", easing: "{motion.easing.decelerate}" }
    to_focus_visible: { duration: "{motion.duration.fast}", easing: "{motion.easing.standard}" }
    to_disabled:      { duration: "{motion.duration.base}", easing: "{motion.easing.standard}" }

  disabled_tokens:
    background: "{colors.neutral.3}"
    text: "{colors.neutral.8}"
    border: "{colors.neutral.6}"
    cursor: "not-allowed"
    # NEVER use opacity to derive disabled state.

  # Touch-action: prevent double-tap-zoom on all tappable elements
  touch_action: "manipulation"

  # Loading-state visibility rules (prevents flicker / micro-flash)
  loading_visibility:
    show_delay_ms: [150, 300]      # don't show spinner / skeleton if action completes < 150 ms
    minimum_visible_ms: [300, 500] # once shown, keep visible at least 300 ms to avoid flicker

  # Performance budgets (as design constraints — anything slower needs explicit loading state)
  perf:
    mutation_request_max_ms: 500   # POST/PATCH/DELETE — beyond this, design a loading state
    lcp_target_ms: 2500            # Largest Contentful Paint
    inp_target_ms: 200             # Interaction to Next Paint

# ═══════════════════════════════════════════════════════════════
# ICONOGRAPHY
# ═══════════════════════════════════════════════════════════════

icons:
  family: "<icon family — declare per project. Recommended: Lucide (free default), Phosphor (free, 6 weights), Heroicons (free, outline + solid), Tabler (free, 1.5-px stroke), HugeIcons (premium — 5K free / 51K Pro across 10 styles), or custom>"
  fill_style: "{options.icon_fill}"     # outline | filled
  sizes:
    xs: 12
    sm: 16
    md: 20
    lg: 24
    xl: 32
    "2xl": 48
  stroke_weight_by_text_weight:
    "400": 1.5
    "500": 1.5
    "600": 1.75
    "700": 2.0
  optical_alignment_offset_px: -1   # icons sit 1 px above cap-height baseline by default

# ═══════════════════════════════════════════════════════════════
# IMAGERY
# ═══════════════════════════════════════════════════════════════

images:
  aspect_ratios:
    square: "1 / 1"
    portrait: "4 / 5"
    landscape: "3 / 2"
    video: "16 / 9"
    wide: "21 / 9"
    classic: "4 / 3"

  formats:
    preferred: ["avif", "webp", "jpg"]
    fallback_jpg_quality: 82
    fallback_webp_quality: 80
    fallback_avif_quality: 65

  loading:
    above_fold_eager_count: 5
    lazy_default: true
    fetchpriority_high_per_page: 1   # exactly one image gets fetchpriority="high"

  placeholders:
    above_fold: "skeleton"
    feed: "blurhash"
    avatar: "initials-svg"

  illustration_style: "{options.illustration_style}"
  photography_style: "<descriptor — e.g., 'natural light, real people, no stock-photo headsets'>"

# ═══════════════════════════════════════════════════════════════
# DENSITY & RESPONSIVE
# ═══════════════════════════════════════════════════════════════

density:
  mode: "{profiles.density}"
  multipliers:
    compact: 0.75
    comfortable: 1.0
    spacious: 1.25

touch_targets:
  pointer_min_px: 24       # WCAG 2.5.8 AA
  touch_min_px: 44         # WCAG 2.5.5 AAA / mobile premium
  pointer_recommended_px: 36
  spacing_between_targets_px: 12

breakpoints:
  xs: 0
  sm: 640
  md: 768
  lg: 1024
  xl: 1280
  "2xl": 1536

containers:
  prose: "65ch"
  sm: 768
  md: 1024
  lg: 1280
  xl: 1440
  full: "100%"
  default: "lg"   # = 1280 px; overridden by options.container_width

grid:
  desktop:
    columns: 12
    gutter: "{spacing.scale.6}"   # 24 px
  tablet:
    columns: 8
    gutter: "{spacing.scale.5}"   # 20 px
  mobile:
    columns: 4
    gutter: "{spacing.scale.4}"   # 16 px

# Section vertical padding profile resolution (px desktop / mobile)
section_padding:
  hero:
    compact:  { desktop: 96,  mobile: 64 }
    default:  { desktop: 128, mobile: 80 }
    generous: { desktop: 160, mobile: 96 }
  major:
    compact:  { desktop: 80,  mobile: 48 }
    default:  { desktop: 96,  mobile: 64 }
    generous: { desktop: 128, mobile: 80 }
  cta:
    compact:  { desktop: 96,  mobile: 64 }
    default:  { desktop: 128, mobile: 80 }
    generous: { desktop: 160, mobile: 96 }
  footer_top:
    compact:  { desktop: 64,  mobile: 48 }
    default:  { desktop: 96,  mobile: 64 }
    generous: { desktop: 128, mobile: 80 }

# ═══════════════════════════════════════════════════════════════
# ACCESSIBILITY
# ═══════════════════════════════════════════════════════════════

a11y:
  contrast:
    body_text_apca_min: 75
    fine_print_apca_min: 60
    ui_text_apca_min: 75
    non_text_apca_min: 30
    wcag_normal_text_min: "4.5:1"
    wcag_large_text_min: "3:1"
  focus_visible_required: true
  min_text_sizes:
    web_desktop: 14
    web_mobile: 16   # iOS auto-zoom guard
  preference_media_queries:
    - "prefers-color-scheme"
    - "prefers-reduced-motion"
    - "prefers-reduced-transparency"
    - "prefers-contrast"
    - "forced-colors"

# ═══════════════════════════════════════════════════════════════
# COMPONENTS (atoms + molecules)
# ═══════════════════════════════════════════════════════════════
# Each component declares: sizes, padding, radius, typography role, state styling.
# State styling references the global focus_ring + transitions defined above.

components:

  # ─── Button ───
  button:
    sizes:
      sm: { height: 32, padding_x: 12, padding_y: 6,  type: "label-sm", icon: "{icons.sizes.sm}", radius: "{radius.scale.md}", icon_gap: "{spacing.scale.2}" }
      md: { height: 40, padding_x: 16, padding_y: 10, type: "label-sm", icon: "{icons.sizes.md}", radius: "{radius.scale.md}", icon_gap: "{spacing.scale.2}" }
      lg: { height: 48, padding_x: 20, padding_y: 12, type: "body-md",  icon: "{icons.sizes.md}", radius: "{radius.scale.lg}", icon_gap: "{spacing.scale.3}" }
      xl: { height: 56, padding_x: 24, padding_y: 16, type: "body-lg",  icon: "{icons.sizes.lg}", radius: "{radius.scale.lg}", icon_gap: "{spacing.scale.3}" }
      icon_only:
        sm: { size: 32, radius: "{radius.scale.md}" }
        md: { size: 40, radius: "{radius.scale.md}" }
        lg: { size: 48, radius: "{radius.scale.lg}" }
    variants:
      primary:
        background: "{colors.primary.9}"
        text: "white"
        border: "none"
        hover_background: "{colors.primary.10}"
        pressed_background: "{colors.primary.11}"
      secondary:
        background: "{colors.neutral.3}"
        text: "{colors.text.primary}"
        border: "1px solid {colors.border.default}"
        hover_background: "{colors.neutral.4}"
        pressed_background: "{colors.neutral.5}"
      outline:
        background: "transparent"
        text: "{colors.text.primary}"
        border: "1px solid {colors.border.default}"
        hover_background: "{colors.neutral.3}"
        pressed_background: "{colors.neutral.4}"
      ghost:
        background: "transparent"
        text: "{colors.text.primary}"
        border: "none"
        hover_background: "{colors.neutral.3}"
        pressed_background: "{colors.neutral.4}"
      link:
        background: "transparent"
        text: "{colors.text.link}"
        border: "none"
        hover_text_decoration: "underline"
      destructive:
        background: "{colors.semantic.danger-solid}"
        text: "white"
        border: "none"
        hover_background: "{colors.danger.10}"
        pressed_background: "{colors.danger.11}"
    states:
      focus_visible: "{states.focus_ring}"
      disabled: "{states.disabled_tokens}"
      loading: { spinner: true, preserve_label_width: true, aria_busy: true }
    constraints:
      max_label_chars: 24
      max_primary_per_screen: 1

  # ─── Input (text/email/password/number/search) ───
  input:
    sizes:
      sm: { height: 32, padding_x: 10, padding_y: 6,  type: "body-sm", radius: "{radius.scale.md}" }
      md: { height: 40, padding_x: 12, padding_y: 10, type: "body-md", radius: "{radius.scale.md}" }
      lg: { height: 48, padding_x: 16, padding_y: 12, type: "body-md", radius: "{radius.scale.md}" }
    variants:
      outlined:
        background: "{colors.surface.canvas}"
        border: "1px solid {colors.border.default}"
        focus_border: "1px solid {colors.primary.8}"
        focus_ring: "0 0 0 2px oklch(from {colors.primary.8} l c h / 0.40)"
      filled:
        background: "{colors.surface.subtle}"
        border: "1px solid transparent"
        focus_border: "1px solid {colors.primary.8}"
        focus_ring: "0 0 0 2px oklch(from {colors.primary.8} l c h / 0.40)"
      underlined:
        background: "transparent"
        border: "none"
        border_bottom: "1px solid {colors.border.default}"
        focus_border_bottom: "2px solid {colors.primary.8}"
    states:
      hover_border: "{colors.border.strong}"
      error_border: "{colors.danger.8}"
      success_border: "{colors.success.8}"
      disabled:
        background: "{colors.neutral.2}"
        text: "{colors.text.disabled}"
        border: "{colors.border.subtle}"
    mobile_rules:
      min_font_size_px: 16   # prevents iOS auto-zoom

  textarea:
    extends: "input"
    overrides:
      min_height: 80
      padding: 12
      resize: "vertical"

  select:
    extends: "input"
    overrides:
      trailing_icon: "chevron-down"
      dropdown_menu: "{components.dropdown}"

  checkbox:
    sizes:
      sm: { box: 16, stroke: 1.5 }
      md: { box: 20, stroke: 1.5 }
    radius: "{radius.scale.sm}"
    label_gap: "{spacing.scale.2}"
    states:
      unchecked:    { background: "{colors.surface.canvas}", border: "{colors.border.default}" }
      hover:        { border: "{colors.border.strong}" }
      checked:      { background: "{colors.primary.9}", border: "{colors.primary.9}", checkmark: "white" }
      indeterminate: { background: "{colors.primary.9}", icon: "dash", icon_color: "white" }
      disabled:     { background: "{colors.neutral.3}", border: "{colors.border.subtle}", checkmark: "{colors.text.disabled}" }
      error:        { border: "{colors.danger.8}" }

  radio:
    sizes:
      sm: { outer: 16, inner: 6 }
      md: { outer: 20, inner: 8 }
    radius: "{radius.scale.full}"
    label_gap: "{spacing.scale.2}"
    states:
      unchecked: { background: "{colors.surface.canvas}", border: "{colors.border.default}" }
      checked:   { background: "{colors.primary.9}", border: "{colors.primary.9}", dot: "white" }
      disabled:  { background: "{colors.neutral.3}", border: "{colors.border.subtle}" }

  switch:
    sizes:
      sm: { track_w: 32, track_h: 18, thumb: 14 }
      md: { track_w: 44, track_h: 24, thumb: 20 }
    radius: "{radius.scale.full}"
    states:
      off:       { track: "{colors.neutral.6}", thumb_position: "start" }
      on:        { track: "{colors.primary.9}", thumb_position: "end" }
      hover_off: { track: "{colors.neutral.7}" }
      hover_on:  { track: "{colors.primary.10}" }
      disabled:  { track: "{colors.neutral.4}" }
    transition: "{states.transitions.default_to_hover}"

  slider:
    sizes:
      sm: { track_h: 4, thumb: 16 }
      md: { track_h: 6, thumb: 20 }
    track_color: "{colors.neutral.5}"
    filled_track_color: "{colors.primary.9}"
    thumb:
      background: "white"
      border: "1px solid {colors.border.default}"
      elevation: "{elevation.scale.1}"
    keyboard_step: 1
    keyboard_step_shift: 10

  badge:
    sizes:
      sm: { height: 20, padding_x: 8,  type: "body-sm", icon: "{icons.sizes.xs}" }
      md: { height: 24, padding_x: 10, type: "body-sm", icon: "{icons.sizes.sm}" }
      lg: { height: 28, padding_x: 12, type: "label-sm", icon: "{icons.sizes.sm}" }
    radius: "{radius.scale.sm}"
    variants:
      neutral:  { background: "{colors.neutral.3}", text: "{colors.text.secondary}" }
      primary:  { background: "{colors.primary.3}", text: "{colors.primary.11}" }
      success:  { background: "{colors.semantic.success-bg}", text: "{colors.semantic.success-text}" }
      warning:  { background: "{colors.semantic.warning-bg}", text: "{colors.semantic.warning-text}" }
      danger:   { background: "{colors.semantic.danger-bg}", text: "{colors.semantic.danger-text}" }
      solid_primary: { background: "{colors.primary.9}", text: "white" }

  chip:
    extends: "badge"
    overrides:
      radius: "{radius.scale.full}"
      includes_close_button: true

  avatar:
    shape: "{options.avatar_shape}"   # circle | squircle | rounded-square
    sizes: [16, 20, 24, 32, 40, 48, 56, 64, 80, 96]
    fallback:
      background_derivation: "hash_of_name"
      initials_count: 2
      initials_type: "label-sm"
      initials_weight: 600
    group_overlap_percent: 35
    group_ring_color: "{colors.surface.canvas}"

  divider:
    variants:
      hairline: { thickness: 1, color: "{colors.border.subtle}" }
      strong:   { thickness: 1, color: "{colors.border.default}" }

  tooltip:
    background: "{colors.neutral.12}"
    text: "{colors.text.inverse}"
    padding: "6px 10px"
    radius: "{radius.scale.md}"
    type: "body-sm"
    max_width: 240
    elevation: "{elevation.scale.2}"
    show_delay: "500ms"
    hide_delay: "100ms"
    position_default: "top"
    arrow: true

  label:
    type: "label-sm"
    color: "{colors.text.primary}"
    required_marker: { char: "*", color: "{colors.danger.11}", margin_left: 4 }

  helper_text:
    type: "body-sm"
    color: "{colors.text.secondary}"

  error_text:
    type: "body-sm"
    color: "{colors.danger.11}"
    leading_icon: { name: "alert-circle", size: 14 }

  skeleton:
    background: "{colors.neutral.3}"
    shimmer:
      enabled: true
      gradient: "linear-gradient(90deg, transparent, {colors.neutral.4}, transparent)"
      duration: "1.5s"
      easing: "linear"
    reduced_motion_fallback:
      shimmer: false

  # ─── Molecules ───

  card:
    padding: 32                         # space.8 default; compact density → 24
    radius: "{radius.components.card}"
    background: "{colors.surface.raised}"
    elevation: "{elevation.components.card}"
    border_or_elevation_only: "elevation"   # choose one separation strategy
    internal_gap: "{spacing.scale.4}"
    media_extends_to_edges: true
    interactive:
      hover_elevation: "{elevation.scale.2}"
      focus_visible: "{states.focus_ring}"
      cursor: "pointer"

  modal:
    backdrop: "{options.modal_backdrop}"   # scrim | blur
    backdrop_scrim: "oklch(from {colors.neutral.12} l c h / 0.50)"
    backdrop_blur: "backdrop-filter: blur(8px)"
    container:
      background: "{colors.surface.overlay}"
      radius: "{radius.components.modal}"
      elevation: "{elevation.components.modal}"
      max_width_sm: 560
      max_width_md: 720
      max_width_lg: 960
      padding: 24
      header_height: 64
      header_title_type: "heading-md"
      header_close_icon_size: "{icons.sizes.lg}"
      footer_border_top: "1px solid {colors.border.subtle}"
      footer_action_gap: "{spacing.scale.3}"
    motion:
      enter:
        backdrop: { property: "opacity", duration: "{motion.duration.base}", easing: "{motion.easing.standard}" }
        container: { properties: ["opacity", "transform"], from: { opacity: 0, transform: "scale(0.96)" }, to: { opacity: 1, transform: "scale(1)" }, duration: "{motion.duration.slow}", easing: "{motion.easing.decelerate}" }
      exit:
        container: { properties: ["opacity", "transform"], to: { opacity: 0, transform: "scale(0.98)" }, duration: "{motion.duration.fast}", easing: "{motion.easing.accelerate}" }
    focus_trap: true
    close_on_esc: true
    close_on_backdrop_click: true   # unless declared as required

  toast:
    position: "{options.toast_position}"
    container:
      background: "{colors.surface.overlay}"
      radius: "{radius.scale.md}"
      padding: "12px 16px"
      elevation: "{elevation.scale.3}"
      width_min: 360
      width_max: 440
      mobile_width: "calc(100% - 32px)"
    leading_icon_size: "{icons.sizes.md}"
    type: "body-md"
    text_color: "{colors.text.primary}"
    auto_dismiss_ms:
      info: 5000
      success: 5000
      warning: 8000
      error: 0   # manual-dismiss only
    stack:
      direction: "vertical"
      newest_on: "top"
      gap: "{spacing.scale.2}"
    motion:
      enter: { type: "slide-fade", from_direction: "right", duration: "{motion.duration.base}" }
      exit: { type: "fade", duration: "{motion.duration.fast}" }
    pause_on_hover: true

  dropdown:
    container:
      background: "{colors.surface.overlay}"
      radius: "{radius.scale.lg}"
      elevation: "{elevation.scale.2}"
      border: "1px solid {colors.border.subtle}"
      padding: 4
      min_width: 160
      max_height: "60vh"
    item:
      height_compact: 32
      height_default: 36
      height_comfortable: 40
      padding: "8px 12px"
      type: "body-sm"
      text: "{colors.text.primary}"
      hover_background: "{colors.neutral.3}"
      active_background: "{colors.neutral.4}"
      selected_indicator: "leading-checkmark"
    section_label:
      type: "overline"
      color: "{colors.text.secondary}"
      padding: "4px 12px"
    separator:
      thickness: 1
      color: "{colors.border.subtle}"
      margin_y: 4
    motion:
      enter: { properties: ["opacity", "transform"], from: { opacity: 0, transform: "scale(0.96)" }, duration: "{motion.duration.fast}", easing: "{motion.easing.decelerate}" }
    close_on_outside_click: true

  tabs:
    style: "{options.tabs_style}"      # underline | filled
    height: 40
    padding: "12px 16px"
    type: "body-md"
    weight: 500
    text_default: "{colors.text.secondary}"
    text_hover: "{colors.text.primary}"
    text_selected: "{colors.text.primary}"
    underline_thickness: 2
    underline_color: "{colors.primary.9}"
    filled_selected_background: "{colors.surface.raised}"
    filled_unselected_background: "{colors.surface.subtle}"
    indicator_motion: { properties: ["transform", "width"], duration: "{motion.duration.base}", easing: "{motion.easing.standard}" }
    focus_visible: "{states.focus_ring}"

  accordion:
    border_top: "1px solid {colors.border.subtle}"
    border_bottom: "1px solid {colors.border.subtle}"
    collapse_adjacent_borders: true
    trigger:
      padding_y: 16
      type: "body-md"
      weight: 500
      chevron_size: "{icons.sizes.md}"
      chevron_rotate_on_open_deg: 180
    content:
      padding_bottom: 16
      type: "body-md"
    motion: { properties: ["height", "opacity"], duration: "{motion.duration.base}", easing: "{motion.easing.standard}" }

  top_nav:
    height_desktop: 64
    height_mobile: 56
    background: "{colors.surface.canvas}"
    sticky_scroll_background: "oklch(from {colors.surface.canvas} l c h / 0.80)"
    sticky_scroll_backdrop: "backdrop-filter: blur(12px)"
    padding_x_desktop: "{spacing.scale.6}"
    padding_x_mobile: "{spacing.scale.4}"
    logo_align: "start"
    nav_link_type: "label-sm"
    nav_link_color: "{colors.text.secondary}"
    nav_link_hover_color: "{colors.text.primary}"
    nav_link_active_color: "{colors.text.primary}"
    nav_link_active_indicator: "underline-2px"
    cta_align: "end"
    cta_gap: "{spacing.scale.3}"
    mobile_collapse: "hamburger-to-sheet"

  sidebar:
    width_default: 240
    width_collapsed: 64
    width_expanded: 280
    background: "{colors.surface.subtle}"
    border_inline_end: "1px solid {colors.border.subtle}"
    padding: "{spacing.scale.4}"
    section_gap: "{spacing.scale.6}"
    item:
      height: 36
      padding: "8px 12px"
      radius: "{radius.scale.md}"
      type: "body-sm"
      weight: 500
      default_background: "transparent"
      hover_background: "{colors.neutral.3}"
      active_background: "{colors.primary.3}"
      active_text: "{colors.primary.11}"
      active_indicator: "leading-3px-bar"
      icon_size: "{icons.sizes.md}"
      icon_gap: "{spacing.scale.3}"
    collapse_motion: { property: "width", duration: "{motion.duration.base}", easing: "{motion.easing.standard}" }

  table:
    header:
      height: 40
      background: "{colors.surface.subtle}"
      type: "body-sm"
      weight: 600
      color: "{colors.text.secondary}"
      padding_x: 12
    body_row:
      height_compact: 40
      height_default: 48
      height_comfortable: 56
      padding: "12px 16px"
      type: "body-sm"
      border_bottom: "1px solid {colors.border.subtle}"
      hover_background: "{colors.neutral.2}"
      selected_background: "{colors.primary.3}"
      selected_indicator: "leading-3px-bar"
    numeric_columns: { font_features: "{typography.font_features.tabular}" }
    sticky_header_on_scroll: true

  form_group:
    layout: "stack"
    label_to_control_gap: 6
    control_to_helper_gap: 6
    required_marker: "{components.label.required_marker}"
    submission:
      enter_submits: true                # Enter submits when text input is sole / last control
      textarea_cmd_enter_submits: true   # ⌘/Ctrl+Enter submits textarea; Enter inserts newline
    validation:
      block_keystrokes: false            # allow any input; show errors as feedback
      error_placement: "adjacent_to_field"
      focus_first_error_on_submit: true
    autocomplete: "required_per_field"   # set autocomplete="email|new-password|..." attribute
    placeholder_pattern: "example_with_trailing_ellipsis"   # "name@example.com…" / "+1 (555) 000-0000…"

  pagination:
    item_size: 36
    item_gap: 8
    item_type: "body-sm"
    item_default_color: "{colors.text.secondary}"
    item_hover_background: "{colors.surface.subtle}"
    item_active_background: "{colors.primary.9}"
    item_active_text: "white"
    prev_next: "icon-button"

  breadcrumbs:
    type: "body-sm"
    color_default: "{colors.text.secondary}"
    color_current: "{colors.text.primary}"
    separator_char: "/"
    separator_color: "{colors.text.disabled}"
    separator_margin_x: 8

  banner:
    padding: "12px 16px"
    radius: "{radius.scale.md}"
    variants:
      info:    { background: "{colors.primary.3}",  text: "{colors.primary.11}",  icon_color: "{colors.primary.9}",  border: "{colors.primary.6}" }
      success: { background: "{colors.semantic.success-bg}", text: "{colors.semantic.success-text}", icon_color: "{colors.semantic.success-solid}", border: "{colors.success.6}" }
      warning: { background: "{colors.semantic.warning-bg}", text: "{colors.semantic.warning-text}", icon_color: "{colors.semantic.warning-solid}", border: "{colors.warning.6}" }
      danger:  { background: "{colors.semantic.danger-bg}",  text: "{colors.semantic.danger-text}",  icon_color: "{colors.semantic.danger-solid}",  border: "{colors.danger.6}" }
      neutral: { background: "{colors.surface.subtle}", text: "{colors.text.primary}", icon_color: "{colors.text.secondary}", border: "{colors.border.subtle}" }
    dismiss_icon: 16

  empty_state:
    container_max_width: 480
    illustration_size: [96, 160]
    title_type: "heading-sm"
    title_gap_above: "{spacing.scale.4}"
    body_type: "body-md"
    body_color: "{colors.text.secondary}"
    body_gap_above: "{spacing.scale.2}"
    cta_gap_above: "{spacing.scale.6}"
    vertical_padding: "{spacing.scale.16}"

  command_palette:
    enabled: "{options.command_palette}"
    trigger_shortcut: "cmd+k / ctrl+k"
    container:
      max_width: 560
      top_offset_vh: 15
      radius: "{radius.scale.xl}"
      elevation: "{elevation.scale.4}"
    header:
      search_input_height: 56
      search_input_border: "none"
      placeholder_type: "body-md"
    result_item:
      height: 40
      padding: "8px 12px"
      type: "body-md"
      leading_icon_size: "{icons.sizes.md}"
    section_label_type: "overline"
    keyboard_nav: true

# ═══════════════════════════════════════════════════════════════
# CODE & TECHNICAL SURFACES
# ═══════════════════════════════════════════════════════════════

code:
  inline:
    font_size_em: 0.9
    background: "{colors.surface.subtle}"
    padding: "2px 6px"
    radius: "{radius.scale.sm}"
    color: "{colors.text.primary}"
  block:
    surface: "{options.code_surface}"   # match-page | always-dark
    background_always_dark: "oklch(0.18 0.005 240)"
    background_match_page: "{colors.surface.subtle}"
    text_always_dark: "oklch(0.92 0 0)"
    text_match_page: "{colors.text.primary}"
    radius: "{radius.scale.lg}"
    border: "1px solid {colors.border.subtle}"
    padding: 24
    font: "{typography.families.mono}"
    font_size: 14
    line_height: 1.6
    tab_size: 2
    header_height: 40
    copy_button: { size: 32, position: "top-right" }
    line_numbers_default: false
    syntax_theme_light: "github-light"
    syntax_theme_dark: "github-dark"
  kbd:
    font: "{typography.families.mono}"
    font_size_em: 0.9
    padding: "2px 6px"
    background: "{colors.surface.canvas}"
    border: "1px solid {colors.border.default}"
    border_bottom_width: 2
    radius: "{radius.scale.sm}"
    color: "{colors.text.primary}"
    min_width: 18

# ═══════════════════════════════════════════════════════════════
# DATA VISUALIZATION
# ═══════════════════════════════════════════════════════════════

viz:
  library: "{options.chart_library}"
  minimalism: "{profiles.chart_minimalism}"
  palettes:
    categorical: ["<color1>", "<color2>", "<color3>", "<color4>", "<color5>", "<color6>", "<color7>", "<color8>"]
    sequential: ["<derived 9 steps>"]
    diverging: ["<derived 11 steps>"]
  axis:
    line_color: "{colors.border.subtle}"
    line_width: 1
    label_type: "body-sm"
    label_color: "{colors.text.secondary}"
    title_type: "label-sm"
    title_color: "{colors.text.primary}"
    tick_count: [4, 6]
  gridlines:
    horizontal: { color: "oklch(from {colors.border.subtle} l c h / 0.5)", style: "dashed" }
    vertical: "omit"
  tooltip:
    show_delay: "0ms"
    crosshair: { thickness: 1, color: "{colors.border.default}", style: "dashed" }
    max_width: 280
    numerals: "tabular"
  legend:
    position_default: "top-left-above"
    item_swatch_size: 12
    item_gap: 16
    item_type: "body-sm"
    hover_dim_other_series_opacity: 0.3
  enter_animation:
    duration: "{motion.duration.deliberate}"
    easing: "{motion.easing.decelerate}"

# ═══════════════════════════════════════════════════════════════
# INTERNATIONALIZATION & RTL
# ═══════════════════════════════════════════════════════════════

i18n:
  rtl_support: "{mode.rtl_support}"
  use_logical_properties: true
  target_locales: ["<en, …>"]
  script_line_height_multipliers:
    latin: 1.0
    arabic: 1.30
    hebrew: 1.20
    devanagari: 1.35
    thai: 1.35
    vietnamese: 1.20
    cjk: 1.60
  cjk_rules:
    no_italic: true
    no_underline_for_emphasis: true
    word_break: "break-word"
  rtl_mirroring:
    layout: true
    text_align: "start"
    directional_icons: true
    media_controls: false
    numerals: false
    logos: false
    code_blocks: false

# ═══════════════════════════════════════════════════════════════
# DO NOT EDIT — universal token reference
# ═══════════════════════════════════════════════════════════════

derivation:
  # Color generation curves (used at instantiation; see body §Colors → Generating the scale)
  lightness_curve_light:  [0.99, 0.97, 0.95, 0.92, 0.88, 0.83, 0.75, 0.66, "L_brand", "L_brand-0.06", 0.38, 0.22]
  chroma_curve:           [0.10, 0.10, 0.18, 0.30, 0.45, 0.60, 0.75, 0.90, 1.00, 0.95, 0.55, 0.30]
  lightness_curve_dark:   [0.18, 0.22, 0.26, 0.30, 0.34, 0.40, 0.48, 0.56, "L_brand", "L_brand+0.06", 0.78, 0.95]
  saturation_multipliers:
    muted: 0.7
    default: 1.0
    vivid: 1.3
  warmth_neutral_hue:
    cool: 240
    neutral: 60
    warm: 40

---

# How to use this template

This file is the **single source of truth** for the visual design system of any premium website built from this template. It contains two parts:

- **YAML frontmatter (above)** — every design token, slot, and profile. Machine-readable. Any AI agent generating UI from this file must reference tokens via `{group.path}` syntax — never invent values that aren't here.
- **Markdown body (below)** — the *rules* an AI consuming this file must follow. The frontmatter says *what* the values are; the body says *how* to apply them and *what not to do*.

**Instantiation steps:**

1. Copy this file to your project as `DESIGN.md`.
2. Fill every `<slot>`. Verify with `grep -n "<[^>]*>" DESIGN.md` — zero matches means complete.
3. Run color generation: take `colors.primary.base` and produce all 12 steps (light + dark) using the algorithm in §Colors. Repeat for `colors.neutral` and any semantic palettes you've customized.
4. Profiles and pick-one slots have safe defaults. Override only when the brand explicitly demands.
5. Hand the resulting `DESIGN.md` to any AI tool generating UI code — they will produce premium, consistent output.

The companion file `DESIGN_TEMPLATE_MOBILE.md` covers iOS + Android apps. Shared brand-identity values (color, typography, voice) should match identically between web and mobile instances.

---

# AI Agent Contract

When generating any UI, code, or design artifact from this document, an AI agent **must** follow these rules. Violations produce drift; drift defeats the entire purpose of the template.

1. **Reference tokens, never raw values.** Use `var(--colors-primary-9)` or `{colors.primary.9}` — never `#3a8455` or `oklch(0.55 0.13 152)` inline in component code.
2. **Never invent values.** If a color, spacing, size, radius, or duration isn't in the token tables, round to the nearest existing token. Never interpolate.
3. **Stay within declared variants.** Components have specific variants (`button.variants.primary`, `button.variants.secondary`, etc.). Do not generate new variants on the fly.
4. **One primary CTA per screen.** Use `button.variants.primary` exactly once per visible viewport.
5. **Apply states from the token table, not from opacity.** Disabled state references `states.disabled_tokens`, not `opacity: 0.5`.
6. **Honor preference media queries.** `prefers-reduced-motion`, `prefers-color-scheme`, `prefers-contrast`, `prefers-reduced-transparency`, and `forced-colors` are mandatory branches.
7. **Animate only `transform` and `opacity` on the main render path.** Layout properties (`width`, `height`, `top`, `left`, `margin`) cause reflow; use `transform` or FLIP instead.
8. **Never `transition: all`.** Always list the specific properties.
9. **Touch targets ≥ 44 px on touch contexts, ≥ 24 px on pointer contexts.** Never below.
10. **Body text inputs ≥ 16 px on mobile** to prevent iOS auto-zoom on focus.
11. **Honor the avoidance list in `§Microcopy`** — never use banned words ("seamless," "leverage," "powerful," "world-class," etc.) in generated copy.
12. **The role decides the type, not the size.** When a heading is needed, use `heading-sm` or `heading-md` even if a visually similar `body-lg` exists — the role carries weight + leading + tracking together.
13. **HTML semantics and visual roles are independent.** Choose the heading level (`<h1>`–`<h6>`) for document outline; choose the visual role (`display-2xl`, `heading-md`, etc.) for appearance.
14. **Tabular numerals are mandatory** for any column of numbers, any pricing display, and any data table.
15. **Use logical CSS properties** (`margin-inline-start`, `padding-block-end`, etc.) — never physical (`margin-left`, `padding-top`) — so layouts adapt to RTL automatically when enabled.
16. **Use typographic punctuation in all copy.** Curly quotes (`"` `"` `'` `'`), em-dash (`—`), ellipsis character (`…`) — never straight `"`, double-hyphens, or three periods.
17. **Connect units with non-breaking spaces.** `10&nbsp;MB`, `⌘&nbsp;K`, `3&nbsp;hours`. Prevents awkward line breaks between number and unit.
18. **Apply `touch-action: manipulation` to every tappable element.** Prevents 300 ms double-tap-zoom delay on mobile web.
19. **Spinner / skeleton show-delay 150–300 ms, minimum visible 300–500 ms.** Prevents flicker on fast operations.
20. **Enter submits forms** when a text input is the sole / last control. **⌘/Ctrl+Enter submits textareas**; bare Enter creates a newline in textareas.
21. **Optical alignment trumps strict geometry.** Adjust ±1 px when perception beats the math (icons that sit lower than they look; text that needs a 1-px raise to align with adjacent labels). Document the adjustment on the component.
22. **Performance is design.** Operations slower than 500 ms (POST/PATCH/DELETE) require a designed loading state. LCP target ≤ 2.5 s; INP target ≤ 200 ms.
23. **Details are the product.** Every micro-interaction, every edge-case copy, every focus ring, every loading state must be authored with the same care as the primary flow. Premium is felt in the corners, not the headlines.

---

# Overview

> Fill in your project's brand context here. This is the only section where prose is intentionally project-specific. Every other section's prose is universal.

**Brand:** `<brand.name>`

**Product:** `<brand.description>`

**Audience:** `<brand.audience>`

**Voice:** `<brand.voice>` — *(if the project also has an `INFORMATION.md`, that file is the canonical source for brand voice; this slot becomes a brief restatement)*

**Primary mode:** `<mode.primary>` (light / dark / system)

**Density default:** `<profiles.density>`

**Personality summary (2–3 paragraphs):** Replace this with a description of the brand's emotional positioning — what it feels like to use, what it's trying NOT to feel like, which existing products it shares DNA with and which it explicitly rejects. This is the only freeform prose in the document; everything else is structured.

---

# Colors

**Rule:** Author every color in OKLCH. Reference via tokens. Never inline raw values.

**Why OKLCH:** perceptually uniform — colors at the same lightness look equally bright regardless of hue. HSL and sRGB are not perceptually uniform, which is why HSL-based palettes have uneven steps. Browser support is universal in evergreen browsers as of 2026.

**Palette structure:** five role groups — `primary` (brand accent), `neutral` (80–95% of the surface), `success`, `warning`, `danger`. Optionally one `secondary` brand color (most projects skip this).

**The 12-step scale (Radix model):** each step has a single defined purpose. Never use a step outside its purpose.

| Step | Purpose |
| --- | --- |
| 1 | App background |
| 2 | Subtle background (alt surface) |
| 3 | UI element background (cards, panels) |
| 4 | Hovered UI element background |
| 5 | Active / pressed UI element background |
| 6 | Subtle borders / separators (non-interactive) |
| 7 | UI element border / interactive borders |
| 8 | Hovered border / focus rings |
| 9 | Solid backgrounds (primary CTA fill) |
| 10 | Hovered solid backgrounds |
| 11 | Low-contrast accessible text (APCA Lc 60+ on step 2) |
| 12 | High-contrast accessible text (APCA Lc 90+ on step 2) |

## Generating the scale

Given the brand color at step 9 in OKLCH (`L_brand`, `C_brand`, `H_brand`):

1. Hold `H_brand` constant across all 12 steps.
2. Apply the **lightness curve** per `derivation.lightness_curve_light`:
   `[0.99, 0.97, 0.95, 0.92, 0.88, 0.83, 0.75, 0.66, L_brand, L_brand−0.06, 0.38, 0.22]`
3. Apply the **chroma curve** as a multiplier on `C_brand`: `[0.10, 0.10, 0.18, 0.30, 0.45, 0.60, 0.75, 0.90, 1.00, 0.95, 0.55, 0.30]`
4. Apply the **saturation profile multiplier** (`profiles.saturation`): muted ×0.7, default ×1.0, vivid ×1.3 — to chroma only.
5. Verify APCA: step 11 vs step 2 must clear Lc 60; step 12 vs step 2 must clear Lc 90. If either fails, lower the step's L by 0.02 increments until it passes.

For **neutrals**, the same algorithm applies with very low base chroma (≈ 0.01–0.03) and a slight hue tint per `profiles.warmth` (cool 240, neutral 60, warm 40). Pure grayscale (chroma 0) reads sterile against a warm brand.

## Dark mode

Dark mode is a **separately authored palette**, never an inversion. Three reasons inversion fails:

1. **Chroma must drop.** Saturated colors that look intentional on white look radioactive on near-black. Reduce C by 20–40% for accent colors in dark mode.
2. **Lightness compresses.** Pure black (`L = 0`) causes halation around white text. Use a near-black like `L ≈ 0.18`. White text drops to `L ≈ 0.95`, not 1.
3. **Surface direction stays the same.** Raised surfaces in dark mode get *lighter* (closer to L=0.3) than the page background (L=0.18), same as light mode where raised surfaces get *lighter* than the page. Modals in dark mode are not "darker than the page" — they're lighter. This is the opposite of what naive inversion would produce.

Use the same token names across modes; only the underlying palette differs. The browser switches automatically via `prefers-color-scheme` or via a `[data-theme]` attribute selector.

## Contrast

WCAG 2.2 AA is the floor (4.5:1 for normal text, 3:1 for large or UI). Additionally test against APCA (perceptual). Reject any pairing below:
- Body text: Lc 75 preferred, Lc 60 absolute minimum
- Fine print / small UI: Lc 60+
- Non-text UI (borders, icons): Lc 30+

When WCAG passes but APCA fails, change the color — not the standard.

## State color conventions

Hover, pressed, focus, disabled are explicit token slots — never derived at runtime via opacity:

| State | Convention |
| --- | --- |
| Default solid | Step 9 |
| Hover | Step 10 |
| Pressed | Step 11 |
| Focus ring | 2 px ring of step 8 with 2 px offset |
| Disabled | Background step 3, text step 8 (low contrast intentionally) |

## Forbidden

- Inline hex / rgb / oklch values in component code
- Color as the sole indicator of state (must pair with icon / label / pattern)
- Pure `#000000` text on `#FFFFFF` — soften both
- More than one brand accent competing for attention
- Inverting light → dark to produce dark mode (must re-author)
- Using `opacity` to derive disabled states

---

# Typography

**Rule:** Use at most two type families. The system enforces 8 semantic type roles. The role decides size + weight + line-height + letter-spacing as a bundle; you pick the role, not the values.

## Families

Pick three: display, body, mono. Single-family for display + body is the strongest default. Mono is only required if the product renders code or tabular data.

Free defaults if no brand-specific choice: Geist Sans (display + body), Geist Mono (code), Inter (fallback). Avoid web-safe stacks (Arial, Helvetica) — they signal generic.

## Variable fonts

Prefer a variable font over multiple static weights. A variable font (~80–150 KB) replaces 4–6 static weights (~600 KB–1 MB), reduces requests, eliminates CLS, and unlocks intermediate weights for animation. When `opsz` (optical-size axis) is available, bind it to the actual rendered size.

## The 8 roles

| Role | Purpose | Default size (balanced profile, 1.200 ratio) |
| --- | --- | --- |
| `display-2xl` | Hero / landing anchor headlines | 40 → 64 px (fluid) |
| `display-xl` | Page-level headlines | 32 → 48 px (fluid) |
| `display-lg` | Section headlines | 28 → 36 px (fluid) |
| `heading-md` | Modal titles, major section headings | 24 px |
| `heading-sm` | Card titles, subsection headings | 20 px |
| `body-lg` | Lead paragraphs, marketing body | 18 px |
| `body-md` | Default product body | 16 px (base) |
| `body-sm` | Helper text, captions, dense UI | 13 px |
| `label-sm` | Form labels, button text, chip text | 14 px |
| `overline` | Eyebrow text, category labels | 12 px UPPERCASE |

## The role-decides-the-bundle rule

When you want "larger body text," pick `body-lg` — and weight (400), line-height (1.55), and tracking (0) come with it. When you want a heading, pick a `heading-*` role — and the heading character (weight 600, tighter leading, slight negative tracking) comes with it. Same size as a body role does not mean same role.

## Line-height and letter-spacing rules

Both are inverse to size:
- Display (≥ 36 px): line-height 1.0–1.1, tracking -0.02 to -0.04em
- Heading (20–32 px): line-height 1.15–1.25, tracking -0.01 to -0.015em
- Body (14–18 px): line-height 1.5–1.6, tracking 0
- Small / caps: line-height 1.0–1.4, tracking +0.005 to +0.1em

Hardcoded per role in the frontmatter — never recomputed.

## Weight system

Three weights per screen maximum. Available:
- 400 Regular — body
- 500 Medium — labels, buttons, emphasized body
- 600 SemiBold — headings, display (default `options.heading_weight`)
- 700 Bold — only when 600 doesn't carry enough emphasis (override `options.heading_weight`)

Light / Thin (≤ 300) are not in the system.

## HTML mapping

Visual roles are **decoupled from HTML heading levels**. The same `<h2>` can render as `display-2xl` on a marketing hero or `heading-md` in a product modal. Choose the HTML tag for document semantics (outline, accessibility); choose the visual role for appearance. Defaults are in `typography.html_mapping`.

## Measure

Body text container `max-width: 65ch`. Lines longer than 75 characters reduce reading speed; shorter than 45 increases eye saccade. Premium products enforce this.

## Tabular numerals

Mandatory for any numeric column, price display, comparison, or table. Apply `font-feature-settings: "tnum"` via the `typography.font_features.tabular` token.

## Forbidden

- Light or Thin weights in body
- More than three weights per screen
- More than two type families
- Justified body text (creates rivers)
- Body lines > 75 ch
- All caps without positive tracking
- Default web-safe font stacks
- Setting `line-height` in `px` instead of unitless

---

# Spacing & Layout

**Rule:** 4 px base. Every spacing value is a multiple of 4. The 18-step scale in `spacing.scale` is the complete vocabulary — never invent in-between values.

## The scale

Pre-filled in `spacing.scale`. Use multiplier notation: `space.4` = 16 px (4 × base).

## Inset / Stack / Inline pattern

Three patterns; choose one per use:

| Pattern | Use | Token kind |
| --- | --- | --- |
| **Inset** | Padding inside a container | Single value or asymmetric |
| **Stack** | Vertical gap between sibling elements | `gap` on a vertical flex/grid |
| **Inline** | Horizontal gap between siblings | `gap` on a horizontal flex/grid |

Never mix margin and padding to achieve spacing. Use `gap` on the parent and reserve padding for inset.

## Section padding

Resolved by `profiles.section_padding`. Default profile: 128 px desktop hero, 80 px mobile hero; 96 px desktop major sections, 64 px mobile.

## Container queries first

Component-level responsive behavior uses `@container`. Page-level uses `@media`. A component dropped into a sidebar should respond to the sidebar's width, not the viewport — container queries solve this.

## Whitespace ratio rule

Whitespace surrounding a content block should be ≥ 30–40% of the block's height for premium feel. Marketing heroes commonly exceed 50%. Compact in-app surfaces drop to ~20% but never below.

## Forbidden

- Inventing in-between spacing values (e.g., 14 px when 12 and 16 exist)
- Mixing margin and padding for the same gap intent
- Fixed-pixel layouts that break user zoom
- Content touching viewport edges (use container padding)
- z-index inflation (`z-index: 9999`) — use the `z_index` token scale

---

# Shapes (Radius)

**Rule:** Six radius tokens. Pick one radius family per project (via `profiles.radius`); never mix sharp + soft within a single composition.

## Nested radius math

Inner radius = outer radius − padding. If the result is negative, clamp to 0 (the inner element is square-cornered).

## Continuous corners

On hero-scale rounded elements (and on iOS surfaces in the mobile template), prefer continuous (squircle) corners over circular-arc corners. Below ~12 px radius the difference is invisible — circular-arc is fine.

## Profile resolution

| Profile | Button | Card | Modal | Input |
| --- | --- | --- | --- | --- |
| sharp | sm (4) | md (8) | lg (12) | sm (4) |
| default | md (8) | lg (12) | xl (16) | md (8) |
| soft | lg (12) | xl (16) | 2xl (24) | md (8) |
| pill | full | xl (16) | 2xl (24) | md (8) |

## Forbidden

- Mixing radii within a single composition
- Hard-coded `border-radius` values in component code (use `radius.*` tokens)

---

# Elevation & Depth

**Rule:** Six elevation levels (0–5). Every non-zero level combines at least two shadows (key + ambient). Shadow color is the darkest neutral of the palette tinted with low alpha — never pure black.

## Separation strategy

For any element requiring visual separation, use **exactly one** of: border, shadow, or surface-tone change. Never combine all three.

| Strategy | When |
| --- | --- |
| Border only | Flat / engineered aesthetic (default in dark-mode UIs where shadows render poorly) |
| Shadow only | Warm / dimensional aesthetic (default in light-mode marketing + consumer products) |
| Surface-tone only | Maximum minimalism (premium dark-mode products often use this) |

`profiles.elevation` choice: `flat` = use borders, `default` = use subtle shadows, `dimensional` = use richer layered shadows.

## Z-index

Use the `z_index` token scale. Never invent custom values.

## Forbidden

- Single-layer `box-shadow`
- Pure black shadow color
- Borders + shadows + heavy backgrounds on the same element
- `z-index: 9999` or any number not in the token scale

---

# Motion

**Rule:** Five duration tokens, four easing curves, three spring presets. Every animation uses one of these — no inline durations or custom beziers.

## The 60/30/10 distribution

- ~60% of animations use `standard` or `decelerate` easing (entries, normal transitions)
- ~30% use `accelerate` (exits)
- ~10% use `emphasized` (hero moments)

`linear` is reserved for indeterminate loaders and rotation animations — never UI transitions.

## Spring physics for gestures

For drag-to-dismiss, pull-to-refresh, sheet snapping, swipe actions, drag-and-drop, use spring physics from `motion.spring` — not bezier. Springs respond to velocity and feel "connected" to the gesture.

## Reduced motion is first-class

`prefers-reduced-motion: reduce` disables: parallax, scroll-driven transforms, auto-advancing carousels, hero entrance animations. Opacity transitions are preserved. Transform + opacity pairs become opacity only.

## Choreography invariants

- Stagger: 30–80 ms per item for sequential reveals
- Smallest moves first, largest moves last
- One focal point per beat — never animate two unrelated regions simultaneously
- Out before in — never crossfade unrelated content

## FLIP and View Transitions

For layout changes (rearranging lists, expanding cards), use the FLIP technique or the View Transitions API. Both animate via `transform` rather than animating `width`/`height` (which forces layout). The View Transitions API is the modern native standard; fall back to FLIP libraries (Framer Motion `layout`, GSAP Flip plugin) where unsupported.

## Forbidden

- `transition: all`
- Animating layout properties (`width`, `height`, `top`, `left`) on the main render path
- Re-triggering scroll animations on scroll-back
- Decorative scroll-triggered animation (it must serve explanation)
- Long durations (> 500 ms) on micro-interactions
- More than one continuous looping animation per viewport

---

# States

**Rule:** Every interactive component declares the 10 states in `states.list`. Focus-visible is mandatory and uses the `states.focus_ring` token. Disabled never uses opacity.

## Focus ring (universal)

2 px ring of `colors.primary.8` with 2 px offset, transitioning at `motion.duration.fast` `motion.easing.standard`. Only suppress on pointer-induced focus via `:focus:not(:focus-visible)`. Never globally.

## State transitions

See `states.transitions` for timing per transition type. Hover transitions in `fast` with `standard`. Pressed is `instant`. Release returns at `fast` with `decelerate`.

## Loading patterns

Three valid patterns; pick one per context:

| Pattern | When |
| --- | --- |
| Spinner inside button | Action-triggered, < 3 s expected |
| Skeleton screen | Initial content load |
| Progress bar | Determinate operation |

A global "page spinner" is an anti-pattern — skeletons preserve layout and feel faster.

## Forbidden

- `opacity: 0.5` for disabled
- Removing focus indicators
- Shake / pulse error animations (vestibular harm; use color + icon instead)
- A page-wide spinner as the primary loading pattern

---

# Iconography

**Rule:** One icon family per project. Six sizes. Stroke weight matches text weight. Optically align against cap-height, not line-box.

## Sizes

| Token | Size | Pairs with |
| --- | --- | --- |
| xs | 12 | overline, body-sm inline |
| sm | 16 | body-md inline (default) |
| md | 20 | body-lg, label-sm (buttons) |
| lg | 24 | heading-sm |
| xl | 32 | heading-md, feature-card |
| 2xl | 48 | hero / feature illustration |

## Stroke weight pairing

| Text weight | Icon stroke |
| --- | --- |
| 400–500 | 1.5 px |
| 600 | 1.75 px |
| 700 | 2 px |

Below 16 px, use 1.5 px regardless. Below 16 px, prefer filled over outline.

## Recommended icon families

Pick one. Mixing families on the same surface — even similar styles — reads as inconsistent.

| Family | Tier | Notes |
| --- | --- | --- |
| **Lucide** | Free | 1.5-px stroke, ~1,500+ icons, the default for most modern systems |
| **Phosphor** | Free | Six weights (thin / light / regular / bold / fill / duotone); broad coverage |
| **Heroicons** | Free | Tailwind's official; only outline + solid; small but high quality |
| **Tabler** | Free | Large catalog, 1.5-px stroke, free and open |
| **HugeIcons** | Premium | 5,100+ free / **51,000+ Pro** across 10 styles (rounded stroke / two-tone / solid / bulk / duotone / sharp / etc.). React-first, tree-shakeable. The premium choice when brand polish requires going beyond the free libraries. |
| **Custom** | Project-built | A small custom set (~30 icons) used alongside a base library for brand-differentiating icons |

## ARIA

Functional icons (sole label for a button) require `aria-label`. Decorative icons (paired with visible text) require `aria-hidden="true"`. Default to `aria-hidden` unless the icon is the only label.

## Forbidden

- Mixing icon families on the same surface
- Filled and outline icons on the same surface (pick one per `options.icon_fill`)
- Stroke weights outside the 1.5 / 1.75 / 2 set

---

# Imagery

**Rule:** Six aspect ratios. Three image formats with explicit fallback. Every image has a placeholder. Custom illustration > stock photography.

## Format stack

AVIF first → WebP fallback → JPG safety net via `<picture>`. AVIF saves ~50% vs JPG and 20–30% vs WebP at equivalent quality.

## Loading priorities

Exactly **one image per page** uses `fetchpriority="high"` — the LCP (typically hero). Above-the-fold images load eager; below-the-fold lazy. **Never lazy-load the LCP image** — defeats Largest Contentful Paint.

## CLS prevention

Every image declares explicit `width` and `height` OR uses `aspect-ratio` CSS. Layout shift is a premium-tier failure.

## Dark mode image swap

When an image looks wrong in both modes (e.g., a product screenshot with light UI), provide a separate dark-mode variant via `<picture>` with `prefers-color-scheme`. Never use `filter: invert()` on raster images.

## Forbidden

- Stock photography of people in headsets / staged office shots in primary surfaces
- Lazy-loading the LCP image
- Missing `width`/`height` on raster images
- More than one `fetchpriority="high"` per page

---

# Density & Responsive

**Rule:** Three density modes. Touch-target minimums by device. Container queries over media queries for components.

## Touch targets

| Context | Minimum | Recommended |
| --- | --- | --- |
| Mobile / touch | 44 px | 48 px |
| Pointer (mouse/trackpad) | 24 px (WCAG 2.5.8 AA) | 36–44 px |

Spacing between adjacent targets: 12 px minimum.

## Breakpoints

Mobile-first. Default styles target mobile; `min-width` media queries layer larger styles on top. See `breakpoints` table.

## Fluid scaling

Type sizes, section padding, container widths use `clamp(min, fluid, max)`. Component sizing, internal padding, radii, border widths use discrete token values.

---

# Accessibility

**Rule:** WCAG 2.2 AA is the floor. APCA is the perceptual sanity check. Six preference media queries are honored.

## Contrast targets (per `a11y.contrast`)

- Body text: APCA Lc 75+ preferred, Lc 60 minimum; WCAG 4.5:1
- Fine print: APCA Lc 60+
- UI text: APCA Lc 75+
- Non-text UI: APCA Lc 30+

## Preference media queries

All six are honored:
1. `prefers-color-scheme` — swap palettes
2. `prefers-reduced-motion` — disable transform animations, preserve opacity
3. `prefers-reduced-transparency` — replace `backdrop-filter: blur()` with solid surfaces; replace translucent overlays with solid equivalents
4. `prefers-contrast: more` — switch text from step 11 to step 12; increase border weights
5. `prefers-contrast: less` — soften shadows; reduce text contrast slightly
6. `forced-colors: active` — use `system-color` keywords (`Canvas`, `ButtonText`, `LinkText`, `Highlight`); strip backgrounds + shadows; never `display: none` content

## Required UI features

- Skip-to-content link as first focusable element
- Proper landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)
- Heading hierarchy starting from `<h1>` without skipping levels
- ARIA live regions (`role="status"` polite, `role="alert"` assertive) for dynamic updates
- Brand names wrapped in `<span translate="no">`

## Forbidden

- `<div onClick>` instead of `<button>`
- Color-only meaning
- Custom interactive widgets without ARIA patterns from WAI-ARIA Authoring Practices
- Focus traps that don't restore focus on close
- Skip-to-content link missing

---

# Components

The YAML frontmatter `components.*` is the normative spec. Each component declares: sizes, variants (where applicable), padding, radius, typography role, state styling.

**Universal rules across components:**

- Components have three or four sizes (`sm` / `md` / `lg`, optionally `xl`). The `md` size is the default unless specified.
- Components inherit the focus ring, motion timings, and disabled token from the global `states` definitions.
- Components reference type roles, not raw font sizes.
- Components reference radius via `radius.components.<name>`.
- Components reference elevation via `elevation.components.<name>`.

**For each interactive component, the canonical state matrix is:**

| State | Reference |
| --- | --- |
| default | Component's base spec |
| hover | Component's `hover_*` overrides |
| pressed | Component's `pressed_*` overrides |
| focus-visible | `states.focus_ring` (universal) |
| disabled | `states.disabled_tokens` (universal) |
| loading | Component-specific spinner / skeleton |
| selected | Component-specific (tabs, menu items, list rows) |
| error / success | Component-specific (inputs, validation) |

Refer to the YAML frontmatter for exact values. Below are the component-class anatomies and any rules that don't fit the YAML.

## Button

Anatomy: `container > [leading-icon?] + label + [trailing-icon?]`. Four sizes (sm/md/lg/xl) plus icon-only variants. Six style variants (primary, secondary, outline, ghost, link, destructive). Cap label length at 24 characters. One `primary` per visible viewport.

## Input

Anatomy: `[label] + container[(leading-addon?) + (leading-icon?) + input-element + (clear-button?) + (trailing-icon?) + (trailing-addon?)] + [helper-text | error-text]`. Three sizes. Style follows `options.input_style` (outlined / filled / underlined). On mobile, font-size ≥ 16 px.

## Card

Anatomy: `container[(media?) + (header[title + subtitle?]) + body + (footer[actions?])]`. Choose one separation strategy per project (border OR elevation, not both). Media at the top extends to card edges (negate the padding via `margin: -padding`). Title is `heading-sm`. Footer actions right-aligned.

## Modal / Dialog

Standard sizes: sm 560 / md 720 / lg 960. Backdrop per `options.modal_backdrop`. Focus trap required. Restore focus on close. Escape closes; backdrop click closes (unless declared as required modal).

## Toast

Auto-dismiss timing per severity. Errors require manual dismiss. Pause on hover. Stack with newest on top.

## Dropdown / Menu / Popover

Use Radix Popper or Floating UI positioning. Default position below trigger; flip to above when no space. Outside-click closes. Max height 60 vh with scroll.

## Tabs

`options.tabs_style` selects underline (default premium) or filled. Indicator animates position + width on selection change.

## Accordion

Single-open or multi-open per instance. Chevron rotates 180° on open. Content expands height + opacity.

## Top nav

64 px desktop / 56 px mobile. Sticky on scroll with `backdrop-filter: blur(12px)` and 80% opacity surface. Mobile collapses to hamburger trigger opening a sheet or full-screen menu.

## Sidebar

240 px default / 64 px collapsed / 280 px expanded. Items use the `radius.md` pill highlight. Active item gets primary tint + 3-px leading bar (or `options.product_nav_style` variant).

## Table

40 px header, 48 px default body row (compact 40, comfortable 56). Tabular numerals mandatory on numeric columns. Sticky header on scroll. Empty state with illustration + CTA when no data.

## Form group

Vertical stack: label → control → helper / error. Required marker is a red asterisk after the label, 4 px left margin. ARIA: `aria-describedby` → helper/error ID; `aria-invalid="true"` when error.

## Empty state

Centered, max-width 480 px. Illustration top (96–160 px), title `heading-sm`, body `body-md` `secondary` color, optional CTA. Vertical padding ≥ 64 px.

## Command palette

If `options.command_palette: enabled`, the product surfaces a global ⌘K / Ctrl+K command palette. Centered overlay (max-width 560), top offset 15 vh, search-first, keyboard-driven. Sections labeled with `overline` UPPERCASE.

---

# Web Patterns

**Rule:** Marketing / product landing pages follow the canonical composition by default. Deviation requires justification.

## Canonical landing composition

1. Top navigation (sticky, transparent-to-blurred on scroll)
2. Hero (1 viewport tall desktop, `min-height: 88vh`)
3. Social proof (monochrome logo wall)
4. Narrative section 1 (alternating left-text / right-image)
5. Narrative section 2 (alternates direction)
6. Bento grid (feature showcase)
7. Use-case / persona tabs
8. Testimonial(s) — single quote (premium) or limited carousel
9. Pricing (if commerce-focused)
10. FAQ (accordion)
11. Final CTA band (high-contrast surface)
12. Footer (multi-column per `options.footer_style`)

## Hero variant

Per `options.hero_variant`:
- `centered` — nav-style top, headline and CTA centered, optional media below; symmetric and assertive
- `split-asymmetric` — 6/6 or 7/5 of 12 cols, text on one side, media on the other; the dominant premium SaaS pattern — DEFAULT
- `background-led` — full-bleed media or animation, content overlaid; story-led, common for products that need to demonstrate an unfamiliar concept visually

Headline ≤ 44 characters. Subhead `body-lg` `secondary` color, max-width 480–560 px. CTA cluster: primary + secondary, gap `space.4`.

## Section padding

Per `profiles.section_padding`. Default profile: hero 128 desktop / 80 mobile; major sections 96 / 64; CTA band 128 / 80.

## Bento grids

Asymmetric cells (e.g., 6+6, 4+4+4, 8+4, 6+3+3). Use when ≥ 4 co-equal features. Collapse to single-column stack on mobile in priority order.

## Logo wall

Monochrome rendering (all logos in `neutral.11` light / `neutral.8` dark) — never original brand colors. 5–7 logos visible at once. Optional slow marquee, paused on hover.

## Scroll-triggered animation

Permitted only when it serves explanation. Patterns:
- Pin and scrub (section pins, internal content advances)
- Stagger reveal (fade + rise 8 px)
- Sticky highlight (element pins next to descriptive text)

Trigger once per element. Threshold: ~25% in viewport.

## Forbidden in marketing

- Carousels as primary content navigation
- Auto-playing video with sound
- Animation on every element on every scroll
- More than two primary CTAs visible in the hero
- "Click here" link text — use specific action verbs

---

# Data Visualization

**Rule:** Three palette types (categorical, sequential, diverging). Tabular numerals everywhere. One legend per chart. Every chart has empty / loading / error states.

## Palettes

Per `viz.palettes`:
- Categorical: 6–8 distinct hues, OKLCH-spaced ≥ 30° apart, equal lightness ~0.55–0.70
- Sequential: 7–9 lightness steps of a single hue; floor 0.95, ceiling 0.20
- Diverging: odd count (5/7/9/11) with neutral midpoint, ends complementary

## Axes & gridlines

1 px `border.subtle` for axes. Horizontal gridlines dashed `border.subtle` at 50% alpha. Vertical gridlines omitted unless required. Tick count 4–6 per axis. Use "nice" numbers (multiples of 1, 2, 5, 10).

## Tooltips

Show on hover at 0 ms delay. Snap to nearest data point. Crosshair guide. Tabular numerals.

## Forbidden

- Pie charts when bar charts work (pies are hard to compare)
- Red ↔ green diverging without secondary cues (CVD failure)
- More than 8 categorical colors
- Wobble / pulse animations on chart elements
- Color-only series differentiation (vary lightness or pattern as well)

---

# Internationalization & RTL

**Rule:** Use CSS logical properties everywhere — never physical. When `mode.rtl_support: enabled`, the layout flips automatically.

## Logical properties

| Physical (forbidden) | Logical (required) |
| --- | --- |
| `margin-left` | `margin-inline-start` |
| `padding-top` | `padding-block-start` |
| `left: 0` | `inset-inline-start: 0` |
| `text-align: left` | `text-align: start` |
| `border-left` | `border-inline-start` |
| `width` | `inline-size` |

## What mirrors and what doesn't (RTL)

Per `i18n.rtl_mirroring`:
- Layout, text-align, directional icons → flip
- Media controls (play, fast-forward), numerals, logos, code blocks → never flip

## Locale formatting

Use `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat`, `Intl.PluralRules`, `Intl.ListFormat`. Never hardcode formats.

## Tall-script line-height

Per `i18n.script_line_height_multipliers`. Apply via `:lang(ar)` etc. selectors.

## CJK rules

No italic. No underline for emphasis (use weight or color). `word-break: break-word`. Full-width punctuation. Half-width spacing around inline Latin.

## Forbidden

- Physical CSS properties in new code
- Hardcoded date / number / currency formats
- Italic or underline emphasis in CJK
- Brand names without `translate="no"`

---

# Code & Technical Surfaces

**Rule:** Monospace family declared once. Inline code 0.9em of surrounding text. Code blocks have header + body + copy button. Per `options.code_surface`, blocks are either always-dark or match the page mode.

## Syntax highlighting

Use Shiki (modern, uses VS Code grammars), Prism, or highlight.js. Default themes per mode are pre-set; brands can override.

## Keyboard shortcuts

`<kbd>` styling per `code.kbd`. Use platform-aware modifier symbols (⌘ ⌃ ⌥ ⇧ on macOS; `Ctrl Alt Shift` on Windows/Linux). Connect with non-breaking space, never `+`.

## Forbidden

- Proportional fonts for code
- `font-weight: bold` on entire code blocks (syntax highlighting handles emphasis)
- Code blocks without a copy button
- `text-shadow` or `letter-spacing` on code

---

# Product Flow Patterns

## Authentication

Sign-up: email + password (or social row + email link). Single password field with show/hide. Inline password rules. Magic link preferred for consumer products. Errors render below the field, never as global alerts.

Sign-in: email + password. "Forgot password" link. "Don't have an account? Sign up" at bottom.

MFA: 6 individual character boxes (not a single field). Auto-advance focus. Paste fills all 6.

## Settings

Architecture per `options.settings_ia`: sidebar (desktop default), tabs (≤ 6 categories), or single-page (mobile / lightweight). Save model per `options.save_model`: auto-save (consumer default) or explicit-save (sensitive areas). Discard-on-leave warning required for explicit-save.

Dangerous actions (delete account, transfer ownership) in a "Danger zone" section with red border accent and explicit confirmation modal requiring typed string ("DELETE", project name).

## Search / command palette

Per `components.command_palette` — if enabled, ⌘K triggers a centered overlay with search input, recent / suggested / contextual results, keyboard navigation, fuzzy match (50–100 ms debounce).

## Notifications taxonomy

Five channels, each with a clear role:
1. Toast — transient confirmation
2. Banner — persistent contextual message
3. Inbox — async notifications for later review
4. Badge — numeric indicator on icon / nav item
5. Push — out-of-app notification

Action confirmation ("Saved") → toast. Status alert ("Storage almost full") → banner. Async event ("Alice commented") → inbox + badge + optional push. Never use a modal for async notification.

## Onboarding

Per `options.onboarding_pattern`. Five valid patterns; empty-state-driven is the default for premium products. Forbidden: 5+ swipeable intro slides before product use.

## Empty / Error states

Three empty variants: initial (illustration + CTA), filtered (smaller, no illustration, "reset filter"), error (retry action + optional support link).

Errors are calm and helpful — never blame the user. Provide a way back; never dead-end.

## Confirmation patterns

Destructive: modal with title (question form), body (state consequences), Cancel + Confirm (destructive variant). Catastrophic: require typed string. Destructive button on the right (matches macOS convention).

Undo: toast with "Action — Undo" button, 5–10 s window. Preferred over destructive confirmation for any reversible action.

Success: toast for low-stakes; inline checkmark for in-context (toggle, switch). Brief celebration only for milestones — never routine saves.

## Pagination

Three valid: numbered (bounded scannable lists), infinite scroll (feed-like — anti-pattern for footer-bearing pages), "Load more" button (default recommendation for most lists).

## Optimistic UI

Default for premium consumer products. Apply user action immediately, send request in background, reconcile on response. Pair with undo toast for safety.

---

# Microcopy & UX Writing

**Rule:** Four voice invariants — active, concise, human, specific. Banned-word list is mandatory. Length budgets per element are enforced.

## Voice invariants

| Principle | Application |
| --- | --- |
| Active voice | "Install the CLI" not "The CLI will be installed" |
| Concise | Cut "in order to" → "to", "make sure to" → "verify" |
| Human | Write how a thoughtful person would explain to a colleague |
| Specific | "Saved" beats "Success". "12 new comments" beats "You have notifications" |

## Capitalization

Sentence case is the default modern premium choice — easier to read, more conversational, more international-friendly. Title Case (Chicago) is the editorial-premium alternative — more formal, more authoritative, common in publication-style sites. Pick one and apply consistently across headlines, buttons, navigation, menu items.

UPPERCASE is reserved for `overline` eyebrows, badges, status indicators ("LIVE", "BETA"). Always with positive tracking (+0.05 to +0.1em).

## Button label conventions

- Verb-first ("Save changes", "Create project", "Send invite")
- Cap 24 characters (3–4 words)
- Specific over generic ("Save API Key" beats "Save")
- No periods
- Common library:

| Intent | Use | Avoid |
| --- | --- | --- |
| Confirm | "Save", "Save changes" | "OK", "Done" |
| Cancel | "Cancel" | "No", "Dismiss" |
| Destructive | "Delete", "Remove access" | "OK" |
| Marketing CTA | "Get started", "Try it free" | "Click here", "Submit" |
| Auth | "Sign in", "Sign up" | "Login", "Register" |

## Error message structure

Three-part: `[What happened] · [Why (optional)] · [How to fix]`

Examples:
- ✓ "Couldn't save your changes. The connection timed out. Try again, or check your network."
- ✗ "Error occurred."
- ✗ "Internal Server Error (500)."

Frame as forward motion: "Something went wrong — try again or contact support" beats "Your deployment failed."

## Inclusive language (mandatory)

- **Gender-neutral.** "they", "team", "people", "users" — not "guys", "manpower".
- **Non-ableist.** "outdated" not "broken"; "ignore" not "blind to"; "complex" not "crazy"; "main" not "master"; "allowlist / blocklist" not "whitelist / blacklist".
- **Non-violent metaphors in onboarding/help.** "remove" not "kill"; "stop" not "abort" (technical contexts excepted).
- **Plain words.** "use" not "utilize"; "help" not "assist"; "show" not "exhibit"; "before" not "prior to".

## Banned words (mandatory avoidance)

`seamless`, `leverage` (verb), `robust`, `powerful` (without specifics), `cutting-edge`, `revolutionary`, `game-changing`, `world-class`, `best-in-class`, `synergy`, `unlock` (verb), `empower`, `unleash`, `supercharge`, `reimagined`, `redefined`, `transformed`, "click here", "please" before every action.

## Length budgets

| Element | Cap |
| --- | --- |
| Button label | 1–4 words (≤ 24 chars) |
| Toast | 1 short sentence (≤ 60 chars) |
| Tooltip | 1 short sentence (≤ 100 chars) |
| Helper text | 1 sentence (≤ 80 chars) |
| Error message | 1–2 sentences |
| Section heading | 1–6 words |
| Page headline (product UI) | 1–8 words |
| Page headline (marketing hero) | ≤ 44 chars |
| Empty state title | ≤ 6 words |
| Empty state body | 1 sentence |

## Premium positioning structure (marketing)

The four-part arc that recurs across the best premium product marketing:

1. **Acknowledge** a status-quo problem
2. **Frame** the alternative as restoring valuable craft
3. **Prove** with concrete specifics (real numbers, real customers)
4. **Act** with a verb-first CTA

vs the SaaS-generic arc that signals genericness:
1. Abstract benefit ("unlock your team's potential")
2. Vague feature list ("powerful tools to streamline workflows")
3. No specifics, no proof
4. Generic CTA ("get started", "learn more")

## Brand names

Always capitalized as the brand spells itself ("GitHub" not "Github", "macOS" not "MacOS"). Wrap in `<span translate="no">` to prevent auto-translation.

## Numbers

Numerals for counts ("8 deployments" not "eight"). Currency: consistently 0 or 2 decimals — never mixed. Per `options.time_format` and `options.number_abbreviation`.

---

# Do's and Don'ts

A consolidated list of the most important Do / Don't rules. The full anti-pattern catalog lives in `research.md §S` (referenced; not duplicated here).

## Do
- Reference tokens via `{group.path}` for every value
- Use APCA for contrast sanity-checking in addition to WCAG
- Use logical CSS properties
- Pair color with a non-color cue for any meaning
- Author dark mode as a separate palette
- Animate only `transform` and `opacity` on the main render path
- Use `:focus-visible` for keyboard focus rings
- Honor `prefers-reduced-motion`, `prefers-color-scheme`, `forced-colors`
- Use tabular numerals for any numeric column
- Cap body line length at `65ch`
- Use sentence case (or title case — pick one, stay consistent)
- Use the role to choose typography, not the size

## Don't
- Inline raw hex / px / font names in component code
- Invent in-between spacing / size / radius values
- Mix sharp and rounded radii in one composition
- Use opacity to derive disabled state
- Use `transition: all`
- Use Light or Thin font weights in body
- Use more than three weights per screen
- Use more than two type families
- Use justified body text on the web
- Stack a Bold + Drop Shadow + Gradient combination
- Use stock photography of staged office scenes in primary surfaces
- Lazy-load the LCP image
- Use `z-index: 9999` or any value outside the token scale
- Use banned marketing words in copy
- Use "Click here" link text
- Use carousels as primary content navigation
- Use auto-playing video with sound
- Use pie charts when bar charts work
- Hardcode date / number / currency formats
- Skip preference media queries

---

# Versioning

This template is on `template_version: 1.0.0`. Per-project `DESIGN.md` instances should preserve this field; when the template evolves, projects can migrate or stay on prior versions.

# Source

This template is generated from the brand-agnostic research in `research.md` (3,800+ lines covering 23 design dimensions plus measured production-site analysis). The companion mobile template `DESIGN_TEMPLATE_MOBILE.md` shares brand-identity values and applies the same rules to iOS HIG + Material 3 conventions.
