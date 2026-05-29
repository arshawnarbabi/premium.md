---
# ─────────────────────────────────────────────────────────────
# DESIGN_TEMPLATE_MOBILE.md — Premium mobile design system template
# Version: 1.0.0
# Platform: mobile (iOS HIG + Android Material 3)
# Companion: DESIGN_TEMPLATE_WEB.md (separate file for marketing + product sites)
#
# HOW TO USE:
# 1. Copy this file to your project as `DESIGN_MOBILE.md`.
# 2. Fill every `<slot>` value. Greppable: `grep -n "<[^>]*>" DESIGN_MOBILE.md`
#    should return zero results once instantiation is complete.
# 3. If the project also has a website, keep the shared brand-identity fields
#    identical between this file and DESIGN.md (web instance).
# 4. Run the color-derivation step (same algorithm as web template).
# 5. Profiles and pick-one slots have safe defaults. Override only with intent.
# 6. The Markdown body below contains the rules an AI consuming this file
#    must follow when generating iOS / Android UI.
# ─────────────────────────────────────────────────────────────

template_version: "1.1.0"
platform: "mobile"

# ─── Brand identity (REQUIRED — must match DESIGN.md web instance if project has both) ───
brand:
  name: "<Brand Name>"
  description: "<one-line product description>"
  audience: "<primary persona — one sentence>"
  voice: "<1–2 sentence voice descriptor>"

# ─── Mode declaration ───
mode:
  primary: "light"            # light | dark | system (mobile typically respects system)
  rtl_support: "disabled"     # enabled | disabled

# ─── Profile selections (shared with web; same defaults) ───
profiles:
  radius: "default"           # sharp | default | soft | pill
  type_scale: "balanced"      # compact | balanced | spacious | dramatic | editorial
  density: "comfortable"      # compact | comfortable | spacious
  motion: "default"           # subtle | default | expressive
  elevation: "default"        # flat | default | dimensional (mobile defaults flatter — see §Elevation)
  saturation: "default"       # muted | default | vivid
  warmth: "neutral"           # cool | neutral | warm
  chart_minimalism: "default" # tufte | default | carbon

# ─── Pick-one option slots (shared subset + mobile-specific additions) ───
options:
  # Shared with web
  icon_fill: "outline"                # outline | filled
  avatar_shape: "circle"              # circle | squircle | rounded-square
  onboarding_pattern: "empty-state-driven"  # empty-state-driven | progressive | coach-marks | step-by-step-modal | milestone-checklist
  save_model: "auto-save"             # auto-save | explicit-save
  settings_ia: "single-page"          # single-page (mobile default) | grouped-list
  heading_weight: 600                 # 600 | 700
  time_format: "hybrid"               # relative-only | absolute-only | hybrid
  number_abbreviation: "contextual"   # short | long | contextual
  toast_position: "top-center"        # top-right | top-center | bottom-right | bottom-center
  illustration_style: "vector"        # vector | 3D | abstract | mixed | none

  # Mobile-only
  mobile_nav_style: "tab-bar"         # tab-bar (iOS) | navigation-bar (Material 3) | nav-rail (tablet) | hybrid (auto-platform)
  platform_adherence: "cross-platform-hybrid"  # ios-strict | material-strict | cross-platform-hybrid
  haptic_intensity: "default"         # subtle | default | expressive
  bottom_sheet_detents: "medium-large"  # medium-large | small-medium-large | custom
  chart_library: "platform-native"    # swift-charts (iOS) | compose-charts (Android) | platform-native | custom

# ═══════════════════════════════════════════════════════════════
# COLORS (shared with web — derivation algorithm identical)
# ═══════════════════════════════════════════════════════════════

colors:
  primary:
    base: "<oklch(L C H) — your brand color; anchored to step 9>"
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

  neutral:
    hue: "<0–360 hue angle>"
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

  success:
    base: "oklch(0.55 0.13 145)"
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
    base: "oklch(0.72 0.15 75)"
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
    base: "oklch(0.55 0.20 25)"
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

  surface:
    canvas: "{colors.neutral.1}"
    subtle: "{colors.neutral.2}"
    raised: "{colors.neutral.3}"
    overlay: "{colors.neutral.1}"
    # Mobile-specific: material surfaces (iOS frosted, Android tonal)
    material_thin: "ultra-thin-material"   # iOS UIBlurEffect equivalent
    material_regular: "regular-material"
    material_thick: "thick-material"

  border:
    subtle: "{colors.neutral.6}"
    default: "{colors.neutral.7}"
    strong: "{colors.neutral.8}"
    hairline: "1px / @1x, 0.5pt @2x+"      # iOS hairline convention

  text:
    primary: "{colors.neutral.12}"
    secondary: "{colors.neutral.11}"
    disabled: "{colors.neutral.8}"
    inverse: "{colors.neutral.1}"
    link: "{colors.primary.11}"

  semantic:
    success-bg: "{colors.success.3}"
    success-text: "{colors.success.11}"
    warning-bg: "{colors.warning.3}"
    warning-text: "{colors.warning.11}"
    danger-bg: "{colors.danger.3}"
    danger-text: "{colors.danger.11}"

  shadow_tint: "{colors.neutral.12}"

  # iOS system-color equivalents (use when targeting iOS strict adherence)
  ios_system:
    label: "UIColor.label"
    secondary_label: "UIColor.secondaryLabel"
    tertiary_label: "UIColor.tertiaryLabel"
    quaternary_label: "UIColor.quaternaryLabel"
    system_background: "UIColor.systemBackground"
    secondary_system_background: "UIColor.secondarySystemBackground"
    tertiary_system_background: "UIColor.tertiarySystemBackground"
    grouped_background: "UIColor.systemGroupedBackground"
    separator: "UIColor.separator"
    tint: "{colors.primary.9}"

# ═══════════════════════════════════════════════════════════════
# TYPOGRAPHY (mapped to iOS Dynamic Type + Material 3 sp scale)
# ═══════════════════════════════════════════════════════════════

typography:
  families:
    display: "<font family — default SF Pro (iOS) / Roboto (Android) / Inter (cross-platform)>"
    body: "<font family — default same as display>"
    mono: "<font family — default SF Mono (iOS) / Roboto Mono (Android) / JetBrains Mono>"

  # The 8 semantic roles mapped to platform text styles
  # Use platform APIs (UIFontMetrics, MaterialTypography) to allow Dynamic Type / sp scaling
  roles:
    display-2xl:
      ios_text_style: "largeTitle"        # 34 pt default → scales with Dynamic Type
      ios_weight: "{options.heading_weight}"
      android_sp: 57                       # Material 3 Display Large
      android_weight: "{options.heading_weight}"
      line_height_multiplier: 1.05
      letter_spacing: -0.5                 # pt / sp
    display-xl:
      ios_text_style: "title1"             # 28 pt
      ios_weight: "{options.heading_weight}"
      android_sp: 45                       # Display Medium
      android_weight: "{options.heading_weight}"
      line_height_multiplier: 1.1
      letter_spacing: -0.4
    display-lg:
      ios_text_style: "title2"             # 22 pt
      ios_weight: "{options.heading_weight}"
      android_sp: 36                       # Display Small
      android_weight: "{options.heading_weight}"
      line_height_multiplier: 1.1
      letter_spacing: -0.3
    heading-md:
      ios_text_style: "title3"             # 20 pt
      ios_weight: "{options.heading_weight}"
      android_sp: 28                       # Headline Medium
      android_weight: "{options.heading_weight}"
      line_height_multiplier: 1.2
      letter_spacing: -0.2
    heading-sm:
      ios_text_style: "headline"           # 17 pt SemiBold
      ios_weight: "{options.heading_weight}"
      android_sp: 22                       # Title Large
      android_weight: 500
      line_height_multiplier: 1.25
      letter_spacing: -0.1
    body-lg:
      ios_text_style: "body"               # 17 pt
      ios_weight: 400
      android_sp: 16                       # Body Large
      android_weight: 400
      line_height_multiplier: 1.5
      letter_spacing: 0
    body-md:
      ios_text_style: "callout"            # 16 pt
      ios_weight: 400
      android_sp: 14                       # Body Medium
      android_weight: 400
      line_height_multiplier: 1.5
      letter_spacing: 0
    body-sm:
      ios_text_style: "subhead"            # 15 pt
      ios_weight: 400
      android_sp: 12                       # Body Small
      android_weight: 400
      line_height_multiplier: 1.4
      letter_spacing: 0.1
    label-sm:
      ios_text_style: "footnote"           # 13 pt
      ios_weight: 500
      android_sp: 14                       # Label Large
      android_weight: 500
      line_height_multiplier: 1.2
      letter_spacing: 0.1
    overline:
      ios_text_style: "caption2"           # 11 pt UPPERCASE
      ios_weight: 600
      android_sp: 11                       # Label Small
      android_weight: 600
      line_height_multiplier: 1.0
      letter_spacing: 0.5
      text_transform: "uppercase"

  # Dynamic Type / sp scaling support is MANDATORY
  scaling:
    ios_dynamic_type: "required"           # use UIFont.preferredFont(forTextStyle:) or @ScaledMetric in SwiftUI
    ios_max_scale_percent: 310             # iOS 17 ranges xSmall → AX5
    android_sp_scaling: "required"         # never use dp for text
    android_max_scale_percent: 200         # Android 14+

  font_features:
    tabular: "tnum, lnum"

  # Premium published craft details (universal copy conventions — same as web)
  craft:
    quotes: "typographic"          # use “ ” (curly), never " " (straight)
    ellipsis: "…"                  # use the ellipsis character, never three periods
    units_use_nbsp: true           # "10 MB" / "⌘ K" use non-breaking space
    rag_target: "balanced"         # avoid widows / orphans in headlines and body
    optical_alignment_tolerance_pt: 1  # adjust ±1 pt when perception beats geometry

# ═══════════════════════════════════════════════════════════════
# SPACING (pt on iOS, dp on Android — both use 4-base scale)
# ═══════════════════════════════════════════════════════════════

spacing:
  base: 4
  unit: "pt"     # pt on iOS, dp on Android — numerically identical
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

  density_multipliers:
    compact: 0.75
    comfortable: 1.0
    spacious: 1.25

  roles:
    text_to_icon_inline: "{spacing.scale.2}"
    label_to_input: "{spacing.scale.2}"
    within_card_default: "{spacing.scale.6}"     # 24 pt
    between_list_items: "{spacing.scale.3}"      # 12 pt
    screen_padding: "{spacing.scale.4}"          # 16 pt (standard iOS / Material side margin)
    section_gap_in_screen: "{spacing.scale.6}"   # 24 pt
    safe_area_supplement: "{spacing.scale.2}"    # additional gap inside safe area

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
  # iOS prefers continuous (squircle) corners — use RoundedRectangle(.., style: .continuous)
  ios_continuous_corners: true
  components:
    button: "{radius.scale.md}"
    input:  "{radius.scale.md}"
    card:   "{radius.scale.lg}"
    modal:  "{radius.scale.xl}"
    sheet:  { top_corners: "{radius.scale.xl}", bottom_corners: 0 }   # bottom sheet rounded top only
    badge:  "{radius.scale.sm}"
    avatar: "{radius.scale.full}"      # overridden by options.avatar_shape

# ═══════════════════════════════════════════════════════════════
# ELEVATION & DEPTH (flatter on mobile; iOS uses material, Android uses M3 elevation)
# ═══════════════════════════════════════════════════════════════

elevation:
  # iOS: prefer tonal differentiation + material (UIBlurEffect) over shadows
  ios:
    surfaces_use_material: true
    materials:
      thin: "thinMaterial"
      regular: "regularMaterial"
      thick: "thickMaterial"
      ultra_thin: "ultraThinMaterial"
    shadow_strategy: "minimal"
  # Android Material 3 elevation levels (dp)
  android:
    "0": 0
    "1": 1     # raised cards
    "2": 3     # FAB resting
    "3": 6     # dropdown
    "4": 8     # modal / nav drawer
    "5": 12    # bottom sheet at rest

  # Component default elevation references
  components:
    card_ios: "{elevation.ios.materials.regular}"
    card_android: "{elevation.android.1}"
    modal_ios: "{elevation.ios.materials.thick}"
    modal_android: "{elevation.android.4}"
    fab_android: "{elevation.android.2}"
    bottom_sheet_android: "{elevation.android.5}"

# ═══════════════════════════════════════════════════════════════
# MOTION (spring physics for gestures; native APIs)
# ═══════════════════════════════════════════════════════════════

motion:
  duration:
    instant: "100ms"
    fast: "200ms"      # iOS slightly longer than web by convention
    base: "300ms"
    slow: "400ms"
    deliberate: "600ms"

  easing:
    standard_ios: "easeOut"           # iOS UIView.AnimationOptions
    standard_android: "FastOutSlowIn" # Material 3 standard
    emphasized_android: "FastOutSlowIn" # with longer duration
    decelerate_android: "LinearOutSlowIn"
    accelerate_android: "FastOutLinearIn"

  spring:
    # iOS: UIView.animate(withDuration:delay:usingSpringWithDamping:initialSpringVelocity:)
    # SwiftUI: .interactiveSpring() / .spring(response:, dampingFraction:)
    # Android Compose: Spring.StiffnessLow / Medium / High
    gentle:  { response: "0.5s", damping_fraction: 0.86, stiffness_compose: "Spring.StiffnessLow" }
    snappy:  { response: "0.35s", damping_fraction: 0.85, stiffness_compose: "Spring.StiffnessMedium" }
    bouncy:  { response: "0.45s", damping_fraction: 0.65, stiffness_compose: "Spring.StiffnessHigh" }

  profile_modifiers:
    subtle:    { duration_multiplier: 0.85, stagger_ms: 30, prefer_springs: false }
    default:   { duration_multiplier: 1.0,  stagger_ms: 50, prefer_springs: true }
    expressive: { duration_multiplier: 1.15, stagger_ms: 70, prefer_springs: true }

  # Standard transitions
  transitions:
    push_pop:        # nav stack push/pop
      ios: "default UINavigationController slide"
      android: "Material shared axis X"
    modal_present:   # full-screen modal
      ios: "sheet from bottom with spring.gentle"
      android: "fade-through with elevation rise"
    sheet_present:   # bottom sheet
      ios: "sheet detents with drag interaction"
      android: "ModalBottomSheet with drag handle"
    tab_switch:
      ios: "instant"   # native UITabBarController behavior
      android: "fade-through with shared-axis-Y"

  reduced_motion:
    transform_animations: "disable"
    opacity_animations: "preserve"
    cross_fade_transitions: "use when isReduceMotionEnabled (iOS prefersCrossFadeTransitions)"
    spring_to_decelerate: true

# ═══════════════════════════════════════════════════════════════
# HAPTICS
# ═══════════════════════════════════════════════════════════════

haptics:
  intensity_profile: "{options.haptic_intensity}"

  ios:
    # UIImpactFeedbackGenerator levels
    light: "UIImpactFeedbackGenerator(style: .light)"     # toggle, segment change
    medium: "UIImpactFeedbackGenerator(style: .medium)"   # primary action confirm
    heavy: "UIImpactFeedbackGenerator(style: .heavy)"     # significant event, drag complete
    soft: "UIImpactFeedbackGenerator(style: .soft)"
    rigid: "UIImpactFeedbackGenerator(style: .rigid)"
    # UINotificationFeedbackGenerator
    success: "UINotificationFeedbackGenerator().notificationOccurred(.success)"
    warning: "UINotificationFeedbackGenerator().notificationOccurred(.warning)"
    error: "UINotificationFeedbackGenerator().notificationOccurred(.error)"
    # UISelectionFeedbackGenerator
    selection: "UISelectionFeedbackGenerator().selectionChanged()"  # picker scroll, continuous

  android:
    # HapticFeedbackConstants
    context_click: "CONTEXT_CLICK"
    long_press: "LONG_PRESS"
    virtual_key: "VIRTUAL_KEY"
    confirm: "CONFIRM"
    reject: "REJECT"
    gesture_start: "GESTURE_START"
    gesture_end: "GESTURE_END"

  use_cases:
    toggle_change: "ios.light / android.context_click"
    primary_action_complete: "ios.medium / android.confirm"
    drag_start: "ios.light / android.gesture_start"
    drag_snap: "ios.heavy / android.gesture_end"
    error: "ios.error / android.reject"
    success: "ios.success / android.confirm"
    selection_continuous: "ios.selection / android.context_click"

  honor_reduced_motion: true   # iOS isReduceMotionEnabled → reduce or disable haptics
  honor_system_haptics_setting: true

# ═══════════════════════════════════════════════════════════════
# STATES (no hover; touch states only)
# ═══════════════════════════════════════════════════════════════

states:
  # Mobile has no hover — touch states only
  list: ["default", "focus", "pressed", "disabled", "loading", "selected", "error", "success"]

  touch_state:
    ios: { dim_percent: 80, duration: "{motion.duration.fast}" }     # press dims to 80% brightness
    android: { ripple_color_alpha: 0.20, ripple_duration: "{motion.duration.fast}" }

  focus_ring:
    # External keyboard / accessibility focus
    width: 2
    offset: 2
    color: "{colors.primary.8}"

  disabled_tokens:
    background: "{colors.neutral.3}"
    text: "{colors.neutral.8}"
    border: "{colors.neutral.6}"
    # NEVER use opacity to derive disabled state

  # Loading-state visibility (prevents flicker — same rule as web)
  loading_visibility:
    show_delay_ms: [150, 300]      # don't show spinner if action completes < 150 ms
    minimum_visible_ms: [300, 500] # once shown, keep visible at least 300 ms

# ═══════════════════════════════════════════════════════════════
# ICONOGRAPHY (SF Symbols / Material Symbols / cross-platform alternatives)
# ═══════════════════════════════════════════════════════════════

icons:
  ios_default: "SF Symbols"        # native iOS — pairs with SF Pro, supports weight / scale axes
  android_default: "Material Symbols"  # native Android — supports weight / fill / grade axes
  cross_platform_default: "<Lucide (free default) | Phosphor (free, 6 weights) | HugeIcons (premium — 5K free / 51K Pro across 10 styles)>"  # use when consistent visual across both platforms is desired
  fill_style: "{options.icon_fill}"
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
  optical_alignment_offset_pt: -1   # icons sit 1 pt above cap-height baseline by default (same rule as web)

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
  asset_variants:
    ios: "@2x, @3x"                    # iOS asset catalog scale variants
    android: ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"]
  illustration_style: "{options.illustration_style}"
  photography_style: "<descriptor — same as web instance if shared brand>"

# ═══════════════════════════════════════════════════════════════
# DENSITY & RESPONSIVE (size classes, safe areas)
# ═══════════════════════════════════════════════════════════════

density:
  mode: "{profiles.density}"
  multipliers:
    compact: 0.75
    comfortable: 1.0
    spacious: 1.25

touch_targets:
  ios_min_pt: 44              # Apple HIG minimum
  android_min_dp: 48          # Material minimum
  recommended_pt_dp: 48
  spacing_between_targets_pt_dp: 12

# iOS size classes
ios_size_classes:
  compact_width: "iPhone portrait, iPad split"
  regular_width: "iPad full, iPhone landscape Plus models"
  compact_height: "iPhone landscape"
  regular_height: "iPhone portrait, iPad"

# Android window size classes (Material 3 WindowSizeClass)
android_window_size_classes:
  compact: "< 600 dp width — phones"
  medium: "600–840 dp — foldables, small tablets"
  expanded: "≥ 840 dp — tablets"

safe_areas:
  ios:
    top: "UIView.safeAreaLayoutGuide.topAnchor"      # status bar / dynamic island
    bottom: "UIView.safeAreaLayoutGuide.bottomAnchor" # home indicator
    leading_trailing: "respect notch in landscape"
  android:
    top_insets: "WindowInsets.statusBars"
    bottom_insets: "WindowInsets.navigationBars"     # gesture nav or 3-button
    ime_insets: "WindowInsets.ime"                   # keyboard

# ═══════════════════════════════════════════════════════════════
# ACCESSIBILITY (VoiceOver, TalkBack, Dynamic Type, system settings)
# ═══════════════════════════════════════════════════════════════

a11y:
  contrast:
    body_text_apca_min: 75
    fine_print_apca_min: 60
    ui_text_apca_min: 75
    non_text_apca_min: 30
    wcag_normal_text_min: "4.5:1"
    wcag_large_text_min: "3:1"
  focus_visible_required: true   # for external keyboard / accessibility focus on mobile too
  ios:
    voiceover: "required — set accessibilityLabel, accessibilityTraits, accessibilityHint"
    dynamic_type: "required — use preferredFont(forTextStyle:)"
    is_reduce_motion_enabled: "honor — replace transform animations with cross-fade"
    is_bold_text_enabled: "honor — switch to bolder text variant"
    prefers_cross_fade_transitions: "honor"
    is_grayscale_enabled: "test designs in grayscale"
  android:
    talkback: "required — set contentDescription, Role"
    animator_duration_scale: "honor Settings.Global.ANIMATOR_DURATION_SCALE"
    font_scale: "honor — Material text scales with sp"
  min_text_sizes:
    ios_min_pt: 11
    ios_recommended_pt: 17    # Body
    android_min_sp: 12
    android_recommended_sp: 14

# ═══════════════════════════════════════════════════════════════
# COMPONENTS (native iOS HIG + Material 3 specs)
# ═══════════════════════════════════════════════════════════════

components:

  # ─── Button ───
  button:
    ios:
      sizes:
        sm: { height: 28, padding_x: 12, type: "label-sm" }
        md: { height: 36, padding_x: 16, type: "body-md" }
        lg: { height: 50, padding_x: 24, type: "body-lg" }   # iOS HIG "Filled" button standard
      variants:
        filled: { background: "{colors.primary.9}", text: "white", radius: "{radius.scale.md}" }
        tinted: { background: "{colors.primary.3}", text: "{colors.primary.11}", radius: "{radius.scale.md}" }
        plain: { background: "transparent", text: "{colors.primary.11}", radius: "{radius.scale.md}" }
        bordered: { background: "{colors.surface.subtle}", text: "{colors.text.primary}", border: "1pt {colors.border.default}", radius: "{radius.scale.md}" }
        destructive: { background: "{colors.semantic.danger-text}", text: "white", radius: "{radius.scale.md}" }
    android:
      sizes:
        # Material 3 button heights
        sm: { height: 32, padding_x: 12, type: "label-sm" }
        md: { height: 40, padding_x: 24, type: "label-sm" }
        lg: { height: 56, padding_x: 24, type: "body-md" }   # large
      variants:
        filled: { background: "{colors.primary.9}", text: "white", radius: 20 }   # Material full-pill default
        tonal:  { background: "{colors.primary.3}", text: "{colors.primary.11}", radius: 20 }
        elevated: { background: "{colors.surface.raised}", text: "{colors.primary.11}", elevation: "{elevation.components.card_android}", radius: 20 }
        outlined: { background: "transparent", text: "{colors.primary.11}", border: "1dp {colors.border.default}", radius: 20 }
        text:   { background: "transparent", text: "{colors.primary.11}", radius: 20 }
    states:
      pressed: "{states.touch_state}"
      disabled: "{states.disabled_tokens}"
      loading: { spinner_inside: true, preserve_label_width: true }
    constraints:
      max_label_chars: 24
      max_primary_per_screen: 1
      min_touch_height: "{touch_targets.ios_min_pt}"    # 44 pt iOS / 48 dp Android

  # ─── Text input ───
  text_field:
    ios:
      # iOS TextField (UIKit / SwiftUI)
      height: 44                      # touch target
      padding_x: 16
      padding_y: 11
      type: "body-lg"                 # 17 pt — iOS standard
      background: "{colors.surface.subtle}"
      border: "none"
      radius: "{radius.scale.md}"
      focus_border: "2pt {colors.primary.8}"
      clear_button: "while editing"
    android:
      # Material 3 TextField variants
      filled:
        height: 56
        padding_x: 16
        padding_y: 8
        background: "{colors.surface.subtle}"
        indicator_active: "2dp {colors.primary.8}"
        indicator_inactive: "1dp {colors.border.default}"
        radius_top: "{radius.scale.sm}"
      outlined:
        height: 56
        padding_x: 16
        background: "transparent"
        border_inactive: "1dp {colors.border.default}"
        border_active: "2dp {colors.primary.8}"
        radius: "{radius.scale.sm}"
      label_position: "floating"      # Material floating label
    states:
      error: { border_color: "{colors.danger.8}", helper_color: "{colors.danger.11}" }
      success: { border_color: "{colors.success.8}" }
      disabled: "{states.disabled_tokens}"

  # ─── Toggle / Switch ───
  switch:
    ios:
      # UISwitch — native fixed dimensions, brand-tint only
      track_w: 51
      track_h: 31
      thumb: 27
      tint_on: "{colors.primary.9}"
      thumb_color: "white"
    android:
      track_w: 52
      track_h: 32
      thumb: 24
      tint_on: "{colors.primary.9}"
      thumb_color_on: "{colors.primary.1}"
      thumb_color_off: "{colors.neutral.8}"
    haptic_on_toggle: "ios.light / android.context_click"

  # ─── Checkbox / Radio ───
  checkbox:
    ios:
      # iOS doesn't have a system checkbox; use a custom one or use Toggle
      box: 22
      radius: "{radius.scale.sm}"
      stroke: 1.5
    android:
      box: 18
      radius: "{radius.scale.sm}"
      stroke: 2

  radio:
    ios:
      outer: 22
      inner: 10
    android:
      outer: 20
      inner: 10

  # ─── Slider ───
  slider:
    ios:
      track_h: 4
      thumb: 28               # generous thumb for touch
      track_color: "{colors.neutral.5}"
      filled_track_color: "{colors.primary.9}"
      thumb_color: "white"
      haptic_at_min_max: "ios.light"
    android:
      track_h: 4
      thumb: 20
      thumb_with_indicator: "M3 discrete slider"

  # ─── Card ───
  card:
    ios:
      background: "{colors.surface.raised}"
      radius: "{radius.scale.lg}"           # use .continuous corner style
      padding: 16
      separation_strategy: "material_or_subtle_border"
    android:
      # Material 3 Card variants
      elevated: { background: "{colors.surface.raised}", radius: "{radius.scale.lg}", padding: 16, elevation: "{elevation.android.1}" }
      filled: { background: "{colors.surface.subtle}", radius: "{radius.scale.lg}", padding: 16 }
      outlined: { background: "{colors.surface.canvas}", border: "1dp {colors.border.subtle}", radius: "{radius.scale.lg}", padding: 16 }

  # ─── List item ───
  list_item:
    ios:
      # iOS standard list (UITableViewCell / SwiftUI List)
      style: "grouped_or_inset_grouped_or_plain"
      row_min_height: 44
      padding_x: 16
      padding_y: 11
      leading_image_size: 32
      trailing_chevron: "for navigation rows only"
      separator: "0.5pt {colors.border.subtle} from leading edge of label"
    android:
      # Material 3 List
      single_line: 56
      two_line: 72
      three_line: 88
      leading_size: 40
      padding_x: 16
      trailing_meta_size: 24

  # ─── Sheets ───
  sheet:
    ios:
      # iOS native sheet() / presentationDetents
      detents: "{options.bottom_sheet_detents}"  # medium | large | custom
      grabber_visible: true
      grabber_w: 36
      grabber_h: 5
      background_material: "{elevation.ios.materials.thick}"
      radius_top: "{radius.scale.xl}"
      drag_to_dismiss: true
    android:
      # Material 3 ModalBottomSheet / StandardBottomSheet
      modal: { background: "{colors.surface.overlay}", radius_top: "{radius.scale.xl}", elevation: "{elevation.android.5}" }
      standard: { background: "{colors.surface.raised}", radius_top: "{radius.scale.xl}" }
      drag_handle: { w: 32, h: 4, color: "{colors.neutral.6}", margin_top: 8 }
      snap_points: ["peek", "expanded"]

  # ─── Modal / Dialog ───
  modal:
    ios:
      # iOS full-screen modal (UIModalPresentationStyle .fullScreen / .pageSheet)
      style: "page_sheet"               # preferred for tasks
      full_screen_for_required: true
      cancel_button: "top-leading"      # iOS HIG: Cancel left, Done/Save right
      done_button: "top-trailing"
    android:
      # Material 3 Dialog
      basic: { max_width: 560, padding: 24, radius: "{radius.scale.xl}", elevation: "{elevation.android.4}" }
      full_screen: { use_for: "complex forms / multi-step" }

  # ─── Top app bar / Navigation bar ───
  top_app_bar:
    ios:
      # iOS UINavigationBar / SwiftUI NavigationStack
      large_title:
        height: 96                       # 34pt SemiBold title + padding
        background: "transparent_initial"
        compresses_to_standard_on_scroll: true
      standard:
        height: 44
        title_type: "headline"           # 17pt SemiBold
        title_align: "center"            # default; left for navigation hierarchies
      leading: "back chevron or hamburger or nothing"
      trailing: "1-2 action icons max"
    android:
      # Material 3 TopAppBar variants
      small: { height: 64, title_align: "left", title_type: "title-large" }
      center_aligned: { height: 64, title_align: "center", title_type: "title-large" }
      medium: { height: 112, title_type: "headline-medium" }
      large: { height: 152, title_type: "headline-large" }

  # ─── Tab bar (iOS) / Navigation bar (Android) ───
  bottom_nav:
    ios:
      # UITabBarController
      height: 49        # + safe-area-inset-bottom (typically +34 on home-indicator phones)
      background: "{elevation.ios.materials.regular}"
      hairline_top: "0.5pt {colors.border.subtle}"
      tab_item:
        icon_size: 24
        label_type: "caption2"   # 10-11pt
        active_tint: "{colors.primary.9}"
        inactive_tint: "{colors.neutral.8}"
      tab_count_max: 5
      ios_18_compact_on_scroll: true
    android:
      # Material 3 NavigationBar
      height: 80
      background: "{colors.surface.canvas}"
      indicator: { pill_h: 32, background: "{colors.primary.3}" }
      tab_item:
        icon_size: 24
        label_type: "label-sm"   # 12sp
        active_tint: "{colors.primary.11}"
        inactive_tint: "{colors.neutral.11}"
      destination_count_range: [3, 5]

  # ─── Floating action button (Android Material 3) ───
  fab:
    android:
      sizes:
        small: { size: 40, icon: 24 }
        default: { size: 56, icon: 24 }
        large: { size: 96, icon: 36 }
        extended: { height: 56, padding_x: 16, includes_label: true }
      background: "{colors.primary.9}"
      icon_color: "white"
      elevation: "{elevation.android.2}"
      radius: "{radius.scale.full}"      # circular; or rounded-rect for M3 expressive
      position: "bottom-trailing with 16dp margin"
    # M3 Expressive: FAB Menu (FloatingActionButtonMenu) — toggleable expanded state
    fab_menu_pattern: "use instead of stacked secondary FABs"
    # Floating toolbars (M3 Expressive) replace deprecated BottomAppBar

  # ─── Toast / Snackbar ───
  toast:
    ios:
      # iOS lacks a native toast — use a custom view or HUD
      container: { background: "{colors.surface.overlay}", radius: "{radius.scale.lg}", padding: "12 16", elevation: "{elevation.ios.materials.thick}" }
      position: "{options.toast_position}"
      auto_dismiss_s: 4
    android:
      # Material 3 Snackbar
      container: { background: "{colors.neutral.12}", text: "{colors.text.inverse}", radius: "{radius.scale.md}", padding: "14 16" }
      position: "bottom-center"   # above bottom nav if present
      auto_dismiss_s: 4
      action_button: "max 1 action; uppercase Material label"

  # ─── Avatar ───
  avatar:
    shape: "{options.avatar_shape}"
    sizes: [16, 20, 24, 32, 40, 48, 56, 64, 80, 96]
    fallback: "initials_on_hash_tinted_background"

  # ─── Action sheet (iOS specific) ───
  action_sheet:
    ios:
      # iOS UIAlertController(.actionSheet) / SwiftUI confirmationDialog
      slides_from_bottom: true
      destructive_action_styled_red: true
      cancel_button: "always last, separated by gap"
    android:
      replacement: "ModalBottomSheet with action list"

  # ─── Segmented control ───
  segmented_control:
    ios:
      height: 32
      type: "body-md"
      background: "{colors.surface.subtle}"
      selected_segment_background: "{colors.surface.canvas}"
      selected_segment_shadow: "{elevation.ios.materials.thin}"
      radius: "{radius.scale.md}"
    android:
      replacement: "Material 3 SegmentedButton"
      height: 40

  # ─── Badge / Chip ───
  badge:
    sizes:
      sm: { height: 18, padding_x: 6, type: "overline" }
      md: { height: 22, padding_x: 8, type: "label-sm" }
    radius: "{radius.scale.full}"   # mobile badges typically pill on mobile
    variants:
      neutral:  { background: "{colors.neutral.3}", text: "{colors.text.secondary}" }
      primary:  { background: "{colors.primary.3}", text: "{colors.primary.11}" }
      success:  { background: "{colors.semantic.success-bg}", text: "{colors.semantic.success-text}" }
      warning:  { background: "{colors.semantic.warning-bg}", text: "{colors.semantic.warning-text}" }
      danger:   { background: "{colors.semantic.danger-bg}", text: "{colors.semantic.danger-text}" }
    notification_dot:    # tab bar / icon overlay
      size: 8
      background: "{colors.semantic.danger-text}"
      position: "top-trailing"
    notification_count:
      min_size: 16
      padding_x: 4
      background: "{colors.semantic.danger-text}"
      text: "white"
      type: "overline"

  chip:
    sizes:
      sm: { height: 28, padding_x: 10, type: "label-sm" }
      md: { height: 32, padding_x: 12, type: "label-sm" }
    radius: "{radius.scale.full}"
    variants:
      filter: { background: "{colors.surface.subtle}", text: "{colors.text.primary}", selected_background: "{colors.primary.9}", selected_text: "white" }
      input:  { background: "{colors.surface.subtle}", text: "{colors.text.primary}", trailing_icon: "x" }
      action: { background: "{colors.surface.subtle}", text: "{colors.text.primary}" }
      suggestion: { background: "transparent", border: "1pt {colors.border.default}", text: "{colors.text.primary}" }
    selection_haptic: "ios.light / android.context_click"

  # ─── Banner / Alert ───
  banner:
    padding: "12 16"
    radius: "{radius.scale.md}"
    variants:
      info:    { background: "{colors.primary.3}", text: "{colors.primary.11}", icon_color: "{colors.primary.9}" }
      success: { background: "{colors.semantic.success-bg}", text: "{colors.semantic.success-text}", icon_color: "{colors.success.9}" }
      warning: { background: "{colors.semantic.warning-bg}", text: "{colors.semantic.warning-text}", icon_color: "{colors.warning.9}" }
      danger:  { background: "{colors.semantic.danger-bg}", text: "{colors.semantic.danger-text}", icon_color: "{colors.danger.9}" }
      neutral: { background: "{colors.surface.subtle}", text: "{colors.text.primary}", icon_color: "{colors.text.secondary}" }
    leading_icon_size: "{icons.sizes.md}"
    dismiss_icon: 16
    position_options: ["top-of-screen", "above-content-section"]
    persistent: true   # unlike toasts, banners don't auto-dismiss

  # ─── Empty state ───
  empty_state:
    container_max_width: "screen - 32"
    illustration_size: [96, 160]
    title_type: "heading-sm"
    title_gap_above: "{spacing.scale.4}"
    body_type: "body-md"
    body_color: "{colors.text.secondary}"
    body_gap_above: "{spacing.scale.2}"
    cta_gap_above: "{spacing.scale.6}"
    vertical_padding: "{spacing.scale.10}"
    variants:
      initial: "illustration + title + body + primary CTA"
      filtered: "small (no illustration) + 'No results for [query]' + reset action"
      error: "error icon + brief message + retry CTA"

  # ─── Skeleton ───
  skeleton:
    background: "{colors.neutral.3}"
    shimmer:
      enabled: true
      gradient: "linear gradient {colors.neutral.3} → {colors.neutral.4} → {colors.neutral.3}"
      duration: "1.5s"
      easing: "linear"
    reduced_motion_fallback:
      shimmer: false
    use_for: ["initial content load", "list row placeholders", "image placeholders"]

  # ─── Label / Helper text / Error text ───
  label:
    type: "label-sm"
    color: "{colors.text.primary}"
    required_marker: { char: "*", color: "{colors.danger.11}", margin_leading: 4 }
    placement: "above_field"   # mobile prefers static label above (not floating placeholder)

  helper_text:
    type: "body-sm"
    color: "{colors.text.secondary}"
    placement: "below_field"

  error_text:
    type: "body-sm"
    color: "{colors.danger.11}"
    leading_icon: { name: "alert-circle", size: 14 }
    placement: "below_field"

  # ─── Picker (Date / Time / Wheel) ───
  picker:
    ios:
      date_picker:
        styles: ["compact", "graphical", "wheel"]
        default_style: "compact"        # SwiftUI .datePickerStyle(.compact) — opens inline calendar
      time_picker: "wheel or compact"
      generic_wheel: "SwiftUI Picker style .wheel"
    android:
      date_picker:
        m3_styles: ["modal-calendar", "modal-input", "docked"]
        default_style: "modal-calendar"
      time_picker:
        m3_styles: ["clock", "input"]
      number_picker: "Compose NumberPicker (custom) or BottomSheet of options"
    use_native_picker_always: true   # never build custom wheel pickers — platform UX is paramount

  # ─── Search bar ───
  search_bar:
    ios:
      component: "SwiftUI .searchable() modifier / UISearchController"
      placement: "top-of-nav-bar"
      placeholder_type: "body-md"
      cancel_button_on_focus: true
      scope_buttons_optional: true
    android:
      component: "Material 3 SearchBar / SearchView"
      placement: "top-of-screen"
      docked_variant: "embedded in top app bar"
      modal_variant: "expands to full-screen search overlay"
    debounce_ms: 200
    voice_search: "platform-native mic icon when supported"
    recent_searches_in_dropdown: true

  # ─── Progress indicator ───
  progress:
    ios:
      determinate: "SwiftUI ProgressView(value:total:) / UIProgressView"
      indeterminate: "SwiftUI ProgressView() / UIActivityIndicatorView"
      linear_height: 4
      circular_diameter: [20, 28, 36]
      tint: "{colors.primary.9}"
      track: "{colors.neutral.5}"
    android:
      determinate: "Material 3 LinearProgressIndicator / CircularProgressIndicator"
      indeterminate: "same, omit progress value"
      linear_height: 4
      circular_diameter: [24, 40, 48]
      tint: "{colors.primary.9}"
      track: "{colors.neutral.5}"
    when_to_use:
      determinate: "uploads, downloads, multi-step flows with known progress"
      indeterminate: "fetches with unknown duration < 3 s (otherwise use skeleton)"
      linear: "at the top of content area or above a button"
      circular: "inside buttons (replaces label) or centered in empty content area"

  # ─── Pull-to-refresh ───
  pull_to_refresh:
    ios:
      component: "SwiftUI .refreshable() / UIRefreshControl"
      indicator: "native spinner appearing at top of scroll view"
      triggers_when_pulled_distance: 80   # pt from top, then release
      haptic_on_trigger: "ios.medium"
    android:
      component: "Material SwipeRefreshLayout / Compose pullRefresh modifier"
      indicator: "M3 circular progress in pill"
      triggers_when_pulled_distance: 56
      haptic_on_trigger: "android.confirm"
    rules:
      use_only_for_user_initiated_refresh: true
      preserve_scroll_position: true
      do_not_combine_with_infinite_scroll_at_top: true

# ═══════════════════════════════════════════════════════════════
# DATA VISUALIZATION
# ═══════════════════════════════════════════════════════════════

viz:
  library: "{options.chart_library}"  # swift-charts | compose-charts | platform-native | custom
  ios_default: "Swift Charts (SwiftUI)"
  android_default: "Compose Charts / Vico"
  minimalism: "{profiles.chart_minimalism}"
  palettes:
    categorical: ["<color1>", "<color2>", "<color3>", "<color4>", "<color5>", "<color6>", "<color7>", "<color8>"]
    sequential: ["<derived 9 steps>"]
    diverging: ["<derived 11 steps>"]
  numeric_features: "tabular"
  hover_replacement: "tap-and-hold"  # mobile has no hover
  legend_position: "top-leading"

# ═══════════════════════════════════════════════════════════════
# INTERNATIONALIZATION
# ═══════════════════════════════════════════════════════════════

i18n:
  rtl_support: "{mode.rtl_support}"
  target_locales: ["<en, …>"]
  ios:
    use_localized_string: "NSLocalizedString or String(localized:)"
    use_formatter: "DateFormatter, NumberFormatter, MeasurementFormatter"
    rtl_auto_layout: "natural alignment honors locale"
  android:
    use_string_resources: "strings.xml + plurals"
    use_locale_aware: "DateFormat, NumberFormat, MessageFormat"
    rtl_supported_manifest: "android:supportsRtl=\"true\""
  script_line_height_multipliers:
    latin: 1.0
    arabic: 1.30
    devanagari: 1.35
    thai: 1.35
    cjk: 1.60

# ═══════════════════════════════════════════════════════════════
# DERIVATION (color generation — same as web)
# ═══════════════════════════════════════════════════════════════

derivation:
  lightness_curve_light:  [0.99, 0.97, 0.95, 0.92, 0.88, 0.83, 0.75, 0.66, "L_brand", "L_brand-0.06", 0.38, 0.22]
  chroma_curve:           [0.10, 0.10, 0.18, 0.30, 0.45, 0.60, 0.75, 0.90, 1.00, 0.95, 0.55, 0.30]
  lightness_curve_dark:   [0.18, 0.22, 0.26, 0.30, 0.34, 0.40, 0.48, 0.56, "L_brand", "L_brand+0.06", 0.78, 0.95]
  saturation_multipliers: { muted: 0.7, default: 1.0, vivid: 1.3 }
  warmth_neutral_hue:     { cool: 240, neutral: 60, warm: 40 }

---

# How to use this template

This is the **mobile sibling** of `DESIGN_TEMPLATE_WEB.md`. The two files share brand-identity fields (colors, type families, voice, microcopy) and diverge in platform-specific surface specs.

**Instantiation steps:**

1. Copy this file to your project as `DESIGN_MOBILE.md`.
2. If your project also has a website, copy the shared brand fields (under `brand:`, `colors:`, `typography.families:`, `profiles:` for shared profiles) from your `DESIGN.md` (web) so they match exactly.
3. Fill remaining `<slot>` values.
4. Run color generation: same algorithm as web — see web template `§Colors → Generating the scale`.
5. Hand the resulting `DESIGN_MOBILE.md` to any AI tool generating iOS or Android UI code.

**Platform philosophy:** mobile defaults to **platform-native conventions**. iOS UI follows Apple Human Interface Guidelines; Android UI follows Material 3. Brand differentiation lives in color, typography, illustration, motion personality, and microcopy — NOT in navigation patterns, sheet behaviors, gestures, or haptics.

## Guided fill-in mode (v1.2+)

Don't want to fill every slot manually? Ask your AI: "help me populate this" (or any of: "what do you need to know?", "run the intake", "walk me through this"). It will produce a structured intake form covering every decision — separating must-fill items from customizable defaults. After answering, the AI fills the templates for you and runs final verification.

The full Interactive Population Protocol lives in `PROJECT.md`. If your project doesn't have a `PROJECT.md`, the AI walks through this template's slots top-to-bottom — but having `PROJECT.md` provides better orchestration across multiple templates.

---

# AI Agent Contract

When generating any iOS or Android UI from this document, an AI agent **must** follow these rules in addition to all rules in the web template's AI Agent Contract that are platform-agnostic.

1. **Platform-native first.** Use iOS HIG components on iOS (Tab Bar, Nav Bar, Sheets, Action Sheets). Use Material 3 components on Android (Navigation Bar, Top App Bar, Bottom Sheet, FAB). Do not invent cross-platform alternatives unless `options.platform_adherence` is `cross-platform-hybrid` and the substitution is justified.
2. **Reference tokens, never raw values.** Same rule as web — `colors.primary.9`, not raw OKLCH.
3. **Use platform text-style APIs, never fixed pixel sizes.** iOS: `UIFont.preferredFont(forTextStyle:)` or SwiftUI `@ScaledMetric`. Android: `sp` units only for text, never `dp`.
4. **Touch targets ≥ 44 pt (iOS) / 48 dp (Android).** Mandatory floor.
5. **No hover.** Mobile has no hover state. Use `pressed` (iOS dim) or `ripple` (Android) per `states.touch_state`.
6. **Respect safe areas.** Every full-bleed element uses `safeAreaLayoutGuide` (iOS) or `WindowInsets` (Android). Never overlap status bar, dynamic island, home indicator, or system bars.
7. **Use system gestures; don't override.** Back-swipe from left edge, pull-to-refresh, swipe-down to dismiss sheet are system gestures — preserve them.
8. **Haptics are purposeful.** Use haptic feedback only on: toggle state change, primary action completion, drag operations, errors / successes. Never on every tap.
9. **Honor accessibility settings.** iOS: VoiceOver, Dynamic Type, isReduceMotionEnabled, isBoldTextEnabled, prefersCrossFadeTransitions. Android: TalkBack, ANIMATOR_DURATION_SCALE, font scale.
10. **Permissions are pre-prompted.** Always show a custom in-app explanation BEFORE triggering the system permission dialog. Never request all permissions on app launch.
11. **Use platform formatters for dates / numbers / currencies.** Never hardcode formats.
12. **Apply Dynamic Type / sp scaling to ALL text.** Layouts must remain functional at maximum text scale (iOS up to 310%, Android up to 200%).
13. **iOS prefers continuous corners (squircles).** Use `RoundedRectangle(cornerRadius:, style: .continuous)`.
14. **Use materials over shadows on iOS.** Reach for `UIBlurEffect` / `.thinMaterial` / `.regularMaterial` for surface separation; reserve shadows for FABs and elevated cards on Android.
15. **Mobile copy is shorter than web.** Button labels typically 1–2 words; toasts under 60 chars; tooltips don't apply (no hover).
16. **Details are the product** — same rule as web. Premium is felt in haptics, micro-interactions, gesture responsiveness, and edge-case copy.

---

# Overview

> Same Overview rules as the web template. Fill in your brand context. This is the only project-specific prose section.

**Brand:** `<brand.name>`

**Product:** `<brand.description>`

**Audience:** `<brand.audience>`

**Voice:** `<brand.voice>` — *(if the project also has an `INFORMATION.md`, that file is the canonical source for brand voice; this slot becomes a brief restatement)*

**Primary mode:** `<mode.primary>`

**Platform adherence:** `<options.platform_adherence>` (ios-strict / material-strict / cross-platform-hybrid)

**Personality summary:** [Same as web instance if shared brand.]

---

# Colors

Same rules as web (`DESIGN_TEMPLATE_WEB.md §Colors`). Same OKLCH authoring, same 12-step Radix scale, same APCA targets, same dark-mode strategy.

**Mobile-specific notes:**

- **iOS native colors:** when `options.platform_adherence` is `ios-strict`, prefer iOS system colors (`UIColor.label`, `UIColor.systemBackground`, `UIColor.separator`, etc.) for text and surface — they auto-adapt to light / dark / elevated contexts. Brand color overlays the system foundation as `tint`.
- **Android dynamic color:** Material 3 supports user-wallpaper-derived dynamic color. Brand-tier apps opt out via static `ColorScheme`. Use `MaterialTheme.colorScheme.primary` mapped to `colors.primary.9`.
- **Higher outdoor-readability bar:** treat APCA Lc 75 as the floor for mobile body text (not Lc 60 like web), accounting for bright-light outdoor conditions.

The shadow tint is the same; on iOS, prefer material-based surface separation over actual shadows.

---

# Typography

Same 8 semantic roles as web. The difference is mapping: each role maps to an **iOS text style** (Dynamic Type) and an **Android Material 3 size** (sp). See `typography.roles` in the frontmatter for the mapping table.

## Dynamic Type / sp scaling is mandatory

- **iOS:** every text element uses `UIFont.preferredFont(forTextStyle:)` (UIKit) or `Text("…").font(.body)` (SwiftUI). Custom fonts use `UIFontMetrics(forTextStyle:).scaledFont(for:)`. Never fixed-point sizes for body content.
- **Android:** every text element uses `sp` units. Layouts must accommodate up to 200% scaling. Use `Text` with `style = MaterialTheme.typography.bodyMedium`.

## Maximum scale behavior

At 310% on iOS, body text in `body-lg` becomes ~52 pt. Layouts must:
- Allow text to wrap to multiple lines
- Avoid fixed-height containers
- Use scrollable containers for long content
- Reflow stacked layouts (don't horizontally compress)

## Heading character vs body character (same rule as web)

Picking a role is picking the *bundle*: size + weight + leading + tracking together. Use `heading-md` for headings even when the size happens to match `body-lg`.

## CJK and tall scripts

Apply `i18n.script_line_height_multipliers`. Use platform-native locale-aware fonts (iOS automatically falls back to PingFang for Chinese, Hiragino for Japanese; Android uses Noto fallback).

---

# Spacing

Same 4-base scale. Unit is `pt` on iOS, `dp` on Android (numerically identical for layout purposes).

**Standard spacing roles on mobile:**

| Role | Value |
| --- | --- |
| Screen edge margin | 16 pt (`space.4`) on phones; 20–24 on tablets |
| Between major sections in a scroll view | 24 pt (`space.6`) |
| Between list items | 0 (when using native separator) or 8 pt (custom) |
| Within a card | 16 pt (`space.4`) |
| Button to button gap | 12 pt (`space.3`) |
| Icon to label inline | 8 pt (`space.2`) |
| Safe-area supplemental padding | 8 pt (`space.2`) inside safe area for visual comfort |

## Density modes

The `density.mode` adjusts between-component spacing, not within-component padding. Components retain their native touch-target compliance regardless of density.

---

# Shapes (Radius)

Same six-step scale as web. **iOS strongly prefers continuous corners** (squircles) over circular-arc corners on rounded rectangles. Use `RoundedRectangle(cornerRadius:, style: .continuous)` in SwiftUI; `UIBezierPath(roundedRect:cornerRadius:)` doesn't produce continuous corners.

## Profile resolution

Same profile choices as web. Mobile rendering applies continuous corners on top of profile selection.

Sheet corners are rounded **top-only** (`top_corners: radius.xl, bottom_corners: 0`) — bottom edges are flush with the screen.

## Forbidden

- Mixing sharp + rounded corners in the same view
- Hard-coded corner radius values
- Circular-arc corners on iOS rounded rectangles ≥ 12 pt (use continuous)

---

# Elevation & Depth

**iOS:** prefer **tonal differentiation + material (frosted blur)** over shadows. Use `.regularMaterial`, `.thickMaterial`, `.ultraThinMaterial` for surface separation. Shadows are reserved for floating elements only (FAB-equivalents on iOS are rare).

**Android Material 3:** the 6-level dp elevation scale (0, 1, 3, 6, 8, 12) plus tonal differentiation. M3 Expressive guidance reduces shadow intensity vs prior Material versions; tonal differentiation is increasingly the primary depth cue.

## Separation strategy

Mobile UI is materially flatter than web UI. Use elevation sparingly — reserve for FAB, sheets, dialogs, raised cards in scrollable lists.

## Z-index / layering

Native platforms handle z-order via view hierarchy. Don't fight the platform: use `.zIndex()` modifier (SwiftUI) or `elevation` (Compose) only when default layering doesn't satisfy.

---

# Motion

Same five duration tokens, four easings, three spring presets — but durations slightly longer on mobile by convention (200 / 300 / 400 / 600 ms vs 150 / 200 / 300 / 500 ms web).

## Spring physics for gestures

All gesture-driven motion uses springs from `motion.spring`:

- Drag-to-dismiss (sheet)
- Pull-to-refresh
- Swipe actions (reveal / commit)
- Drag-and-drop (snap into place)
- Toggle / switch (snap)

Bezier easings are reserved for non-interactive transitions (modal appearance, tab transitions, list reveals).

## Native transition patterns

- **Navigation push/pop:** iOS native slide; Android Material Shared Axis X
- **Modal present:** iOS sheet with detents; Android fade-through + elevation rise
- **Sheet present:** iOS detents with drag; Android `ModalBottomSheet` with drag handle
- **Tab switch:** iOS instant; Android fade-through + shared-axis Y

## Reduced motion

Honor `isReduceMotionEnabled` (iOS) and `ANIMATOR_DURATION_SCALE` (Android). Specifically:
- Replace transform animations with cross-fade
- Disable parallax
- Disable spring bounces (use decelerate instead)
- Cap auto-advancing animations

## Forbidden

- Long-duration animations on micro-interactions
- Custom easings outside the four named curves
- Animating layout properties at 60 fps with main-thread work (use platform-native APIs)

---

# Haptics

Mobile-only sense modality. Used to **confirm important actions and changes of state** — not for every tap.

## Use cases

Per `haptics.use_cases`:

- Toggle / switch state change → light (iOS) / context_click (Android)
- Primary action completion → medium (iOS) / confirm (Android)
- Drag start → light / gesture_start
- Drag snap or commit → heavy / gesture_end
- Error → notification.error / reject
- Success → notification.success / confirm
- Continuous selection (picker scroll) → selection / context_click

## Restraint

The single biggest haptic mistake is overuse. Premium products use haptics 5–10× per session, not 50–100×. Calibration matters: lighter on iOS than the platform's default suggestions.

## Accessibility

Honor `UIAccessibility.isReduceMotionEnabled` (which also reduces haptic intensity per Apple's guidance) and the system haptics toggle. When reduced, fall back to subtle haptics or none.

---

# States

Mobile has no hover. State list excludes hover; includes `pressed` instead.

## Touch state visualization

- **iOS:** dim element to ~80% brightness during press. Release reverts over `duration.fast`. Apply via SwiftUI `.scaleEffect` + `.opacity` modifiers triggered by `GestureState`, or UIKit's `setHighlighted:animated:`.
- **Android:** apply Material ripple originating at the touch point. Ripple color is the text color at 20% alpha. Use `MaterialRipple` / `rippleColor`.

## Focus state

Mobile keyboard accessibility (external Bluetooth keyboard on iPad; hardware keyboard on Android) uses the focus-visible ring. Same 2-pt offset, 2-pt width spec as web.

## Disabled state

Same as web: explicit tokens, never opacity-based.

## Loading state

- **Button loading:** inline spinner replaces label, preserves width
- **Page loading:** native platform spinner (UIActivityIndicatorView / CircularProgressIndicator) — but prefer skeleton screens for content
- **Pull-to-refresh:** native PTR indicator at top of scroll view

---

# Iconography

Three icon family strategies:
- **iOS strict:** SF Symbols (paired with SF Pro). Supports weight + scale axes. Free, ships with the OS.
- **Android strict:** Material Symbols. Supports weight + fill + grade + optical-size axes. Free, official.
- **Cross-platform:** Use a single library across both platforms when consistent brand visual matters more than native fit.

Cross-platform options (when chosen):
- **Lucide** (free, 1.5-px stroke) — most ubiquitous
- **Phosphor** (free, six weights)
- **Heroicons** (free, outline + solid)
- **HugeIcons** (premium tier — 5,100+ free / **51,000+ Pro** across 10 styles; React-first; tree-shakeable) — the premium choice for brand polish

Per `options.platform_adherence`, pick one strategy. Same size scale and stroke-weight pairing rules as web. Never mix families on the same surface.

---

# Imagery

Same aspect ratios and treatment philosophy as web.

**Mobile-specific asset variants:**
- iOS: `@2x` and `@3x` per asset; `imageset` in Xcode asset catalog with light/dark mode variants
- Android: `mdpi / hdpi / xhdpi / xxhdpi / xxxhdpi` density buckets per drawable

**Format:** prefer modern formats where supported (HEIC on iOS, AVIF/WebP on Android API 28+). JPEG/PNG as fallback.

---

# Density & Responsive

Mobile density is governed by `density.mode` (same three levels) but does NOT shrink touch targets below the platform minimums.

## Size classes

- **iOS:** Compact vs Regular for both width and height. Use `horizontalSizeClass` / `verticalSizeClass` to adapt layouts. iPhone portrait = compact width; iPad full = regular width.
- **Android:** `WindowSizeClass` (Compact / Medium / Expanded) drives layout transformations. Bottom nav (compact) → Navigation Rail (medium) → Navigation Drawer (expanded) for primary nav.

## Foldables

Respect fold-aware insets. Allow content to span both halves or stay on a single screen as appropriate. Use `WindowInfoTracker` (Android) and `UIWindowScene.windowingMode` checks.

---

# Accessibility

Premium products honor all platform accessibility APIs.

## iOS

- VoiceOver: `accessibilityLabel`, `accessibilityTraits`, `accessibilityHint` on every interactive element
- Dynamic Type: required for all text (per §Typography)
- `UIAccessibility.isReduceMotionEnabled` — reduce or replace transform animations
- `UIAccessibility.prefersCrossFadeTransitions` — use cross-fade transitions when set
- `UIAccessibility.isBoldTextEnabled` — switch to bolder text variant
- `UIAccessibility.isGrayscaleEnabled` — test designs in grayscale (color is never sole signal)
- `UIAccessibility.isInvertColorsEnabled` — don't fight inversion; design for it
- `UIAccessibility.shouldDifferentiateWithoutColor` — pair semantic colors with icons or patterns

## Android

- TalkBack: `contentDescription` on every interactive element; `Role` on custom widgets
- `Settings.Global.ANIMATOR_DURATION_SCALE` — honor user's animation scale (0 = off)
- Font scale: text scales automatically with `sp`; layouts must adapt
- High-contrast text: switch from step 11 to step 12 when active

## Minimum text sizes

- iOS: 11 pt absolute floor (Caption2); 17 pt Body recommended default
- Android: 12 sp floor; 14 sp recommended default

---

# Components

Each component spec in the frontmatter declares iOS and Android variants. Use the variant matching the platform you're targeting.

**Universal rules:**

- Use native components first (`UIButton`, `UISwitch`, `UIDatePicker`, `UIAlertController`; `Button`, `Switch`, `DatePicker`, `Dialog` in Compose / Material 3). Custom components only when native doesn't satisfy.
- Touch targets meet platform minimums (44 pt iOS / 48 dp Android).
- Components inherit state behavior from `states.touch_state` and `states.disabled_tokens`.

## Buttons

- **iOS:** prefer SwiftUI's `Button(role:)` with `.buttonStyle()` — `.borderedProminent` (filled), `.bordered` (tinted), `.borderless` (plain). For destructive, use `role: .destructive`.
- **Android:** Material 3 `Button` (filled), `FilledTonalButton` (tonal), `ElevatedButton`, `OutlinedButton`, `TextButton`. Material's default radius is pill-full; override to `radius.md` for sharper aesthetic.

Cap labels at 24 characters. One primary per screen.

## Text fields

- **iOS:** `TextField` with `.textFieldStyle(.roundedBorder)` or custom. Float labels are NOT standard iOS — use static labels above the field instead.
- **Android:** `OutlinedTextField` or `TextField` (filled) with floating labels (M3 standard).

Mobile text-field font size ≥ 16 pt (iOS) / 16 sp (Android) so the keyboard zoom doesn't trigger.

## Lists

- **iOS:** `List` (SwiftUI) with `.listStyle(.insetGrouped)` for settings-style; `.plain` for content. Standard row 44 pt; with disclosure indicator and leading icon.
- **Android:** `LazyColumn` (Compose) with `ListItem` (M3). Single-line 56 dp; two-line 72 dp; three-line 88 dp.

Both: swipe-to-reveal trailing actions (Delete, Archive) are platform-conventional. iOS uses `.swipeActions()`. Android uses `SwipeToDismiss` or `SwipeRefreshLayout`.

## Sheets

- **iOS:** native `.sheet()` modifier with `.presentationDetents([.medium, .large])`. Grabber visible by default. Drag-to-dismiss enabled.
- **Android:** `ModalBottomSheet` (M3) with drag handle. Snap at `peek` and `expanded`.

Mobile-first modal pattern: use sheets instead of full-screen modals for most tasks. Reserve full-screen modals for truly modal flows (sign-up, payment, multi-step).

## Modals / Dialogs

Use **only** for tasks that must complete (not for non-essential reveals — use sheets or popovers instead).

- **iOS:** `.fullScreenCover()` for required modals. Cancel top-left, Done/Save top-right (HIG convention — never swap).
- **Android:** `AlertDialog` (M3) for short interruptive prompts; full-screen Activity for complex forms.

## Top app bar / Navigation bar

- **iOS:** `NavigationStack` with `.navigationTitle()`. Large titles by default (compress to standard on scroll). Center-aligned standard title.
- **Android:** M3 `TopAppBar` variants: Small (64 dp), Center-Aligned (64 dp), Medium (112 dp), Large (152 dp). Pick based on emphasis needed.

Trailing actions: max 2 icons visible + overflow menu (Material).

## Bottom nav

- **iOS:** `TabView` with 3–5 tabs. Use ONLY for top-level destinations — never for actions ("Compose," "Add" are not destinations). iOS 18+: tab bar compacts on scroll, expands on scroll-up.
- **Android:** `NavigationBar` (M3) with 3–5 destinations. Pill indicator behind active icon. M3 Expressive deprecates the BottomAppBar in favor of docked toolbars.

## FAB (Android-specific, optional on iOS)

Single primary action per screen. M3 Expressive introduces FAB Menu (replaces stacked secondary FABs) and Toggleable FAB (explicit expanded state).

## Toast / Snackbar

- **iOS:** no native toast — render a custom HUD-style view. Default position top-center on mobile (per `options.toast_position`).
- **Android:** Material `Snackbar`. Bottom-center; rises above bottom nav when present. Max 1 action button.

## Action sheet (iOS) / Bottom sheet menu (Android)

For multiple action choices presented contextually:
- **iOS:** `confirmationDialog()` (SwiftUI) / `UIAlertController(.actionSheet)`. Destructive actions styled red. Cancel last with separation gap.
- **Android:** `ModalBottomSheet` with action list (M3 doesn't have a native action sheet).

---

# Mobile Patterns

## Navigation patterns

| Pattern | When |
| --- | --- |
| Tab bar (iOS) / Navigation bar (Android) | Top-level destinations (3–5) |
| Nav rail (Android) | Medium-width windows (foldables, small tablets) |
| Nav drawer (Android) | Expanded-width windows (tablets) or 6+ destinations |
| Hub-and-spoke (full screen → drill-down) | Apps without clear top-level structure |

Per `options.mobile_nav_style` — `tab-bar` is iOS-native default; `navigation-bar` is Material 3 default; `hybrid` picks based on platform automatically.

## Safe areas (mandatory)

Every full-bleed surface respects safe areas. Common safe-area-aware layouts:
- Status bar / notch / Dynamic Island at top
- Home indicator at bottom (iPhone X+)
- System bars / gesture nav at bottom (Android)
- IME (keyboard) — push content up when keyboard appears

## Gesture conventions (preserve, don't override)

| Gesture | iOS | Android |
| --- | --- | --- |
| Back | Swipe from left edge | Swipe from left/right edge or back button |
| Dismiss sheet | Swipe down | Swipe down |
| Pull to refresh | Native PTR (see `components.pull_to_refresh.ios`) | Native PTR (see `components.pull_to_refresh.android`) |
| Reveal swipe actions | Swipe left/right on row | Swipe left/right on row |
| Long-press | Context menu / preview | Selection / context menu |
| Predictive back (Android 14+) | n/a | System-driven preview during back-swipe; opt-in via `android:enableOnBackInvokedCallback="true"` |
| Scroll bounce (rubber-band) | Preserve on iOS — premium signal; never disable `bounces` on `UIScrollView` | Material overscroll glow (default; don't override) |

Avoid: left-edge swipe gestures that compete with system back. Any custom gesture must not conflict with system gestures.

## Scroll behavior

- **iOS:** preserve rubber-band scroll behavior. Setting `bounces = false` on a `UIScrollView` is a premium-tier failure — it removes a signature platform feel users expect.
- **Android:** preserve the M3 overscroll stretch effect. It's enabled by default in Compose; don't disable.

## Onboarding

Per `options.onboarding_pattern` — same five options as web, but `empty-state-driven` is even stronger for premium mobile (the product reveals itself). Step-by-step modal is acceptable for required signup/permission flows.

**Avoid:** 5+ swipeable intro slides on first launch. Universal anti-pattern.

## Permissions (pre-prompt mandatory)

Always show a custom in-app explanation BEFORE the system permission dialog. Roughly doubles grant rates and prevents accidental permanent denials. Pre-prompt anatomy:

```
[Icon] What this enables
[Body] Brief explanation: "We need camera access to scan documents."
[Primary CTA] Allow
[Secondary CTA] Not now
```

User taps Allow → trigger system dialog. If denied, never re-prompt within session; offer deep-link to Settings.

## Push notifications

Opt-in pre-prompt mandatory. Explain value before triggering iOS `requestAuthorization` or Android 13+ POST_NOTIFICATIONS request.

## Settings

`options.settings_ia: single-page` is the mobile default — vertically scrolling list with section headings. Sidebar / tabs are inappropriate on phone-sized devices.

Use platform-native list styles:
- iOS: `List` with `.insetGrouped` style; section headers in UPPERCASE per HIG
- Android: M3 `ListItem` with `LazyColumn`; section headers in title-medium

## Loading & error states

Skeleton screens for content load (preferred over spinners). Pull-to-refresh for manual refresh. Native PTR indicator.

Errors: same three-part structure as web. Mobile-specific: connection-loss banner at top of screen (persistent until restored).

## Confirmation patterns

- **Destructive:** native `.confirmationDialog` (iOS) or `AlertDialog` (Android). Destructive verb on the destructive button.
- **Undo:** toast/snackbar with Undo action. 5–10 s window.
- **Success:** toast for low-stakes; inline checkmark for in-context (toggle, switch). Brief haptic confirmation.

---

# Data Visualization

Same three-palette philosophy as web. Mobile-specific differences:

- Use platform-native libraries: `Swift Charts` (iOS 16+, SwiftUI) or `Compose Charts` / `Vico` (Android Compose). Both support the design tokens defined here.
- **No hover →** use tap-and-hold for tooltips / data drilling.
- Charts often have less screen real estate; consider sparklines and bento-card mini-charts over full charts.
- Same accessibility rules: chart `<title>` + `<desc>` equivalent (iOS `accessibilityElement`; Android `contentDescription`).

---

# Internationalization

Same i18n principles as web. Platform-specific implementation:

- **iOS:** `NSLocalizedString` / `String(localized:)`. `DateFormatter`, `NumberFormatter`, `MeasurementFormatter`. RTL handled by `semanticContentAttribute` and natural alignment.
- **Android:** `strings.xml` + plurals; `getString(R.string.…)`. `DateFormat`, `NumberFormat`, `MessageFormat`. RTL via `android:supportsRtl="true"` in manifest.

CJK and tall-script line-height multipliers same as web. Use platform-native fallback fonts (iOS PingFang / Hiragino; Android Noto fallback).

---

# Microcopy & UX Writing

Same voice principles and banned-words list as web. Mobile-specific tightening:

| Element | Mobile cap |
| --- | --- |
| Button label | 1–2 words preferred (3 max) |
| Tab bar label | 1 word (≤ 12 chars) |
| Toast / Snackbar | ≤ 60 chars |
| Helper text | ≤ 60 chars |
| Error message | 1 sentence |
| Empty state title | ≤ 4 words |
| Empty state body | 1 short sentence |

**Mobile-conventional verb labels:**
- "Continue" (forward in flow)
- "Done" (complete a contained task) — iOS convention; Android prefers "Save" or "Apply"
- "Cancel" (back out)
- "Allow" / "Don't Allow" (permission dialogs — iOS standard)
- "Sign in with Apple" / "Continue with Google" (OAuth — match vendor casing)

Avoid all banned words from web template's microcopy section. Same forbidden list.

---

# Do's and Don'ts

## Do
- Use platform-native components first
- Use platform text-style APIs (Dynamic Type, sp)
- Touch targets ≥ 44 pt iOS / 48 dp Android
- Respect safe areas
- Pre-prompt permissions
- Use spring physics for gesture-driven motion
- Use haptics for confirmation, sparingly
- Use sheets over modals for most tasks
- Use platform formatters for dates / numbers / currencies
- Honor accessibility APIs (VoiceOver, TalkBack, Dynamic Type, reduced motion)
- Use continuous corners on iOS rounded rectangles
- Use materials (frosted blur) for surface separation on iOS
- Use M3 elevation + tonal for Android depth
- Cap mobile copy tighter than web

## Don't
- Invent cross-platform components when native exists
- Use hover states (mobile has no hover)
- Use fixed-point text sizes (must scale with Dynamic Type / sp)
- Override system gestures (back-swipe, home-swipe, pull-to-refresh)
- Stack permissions on app launch
- Use heavy haptics on every interaction
- Use full-screen modals for non-essential reveals (use sheets)
- Use 5+ swipeable intro screens
- Auto-play video with sound
- Use tooltips on touch (no hover)
- Use opacity to disable elements
- Hardcode date/number formats
- Use ANIMATOR_DURATION_SCALE in the app (system handles it)
- Use circular-arc corners on iOS rounded rectangles ≥ 12 pt
- Use shadows liberally on iOS (use material instead)
- Use banned marketing words from web's avoidance list

---

# Versioning

`template_version: 1.0.0`. Shares versioning conventions with the web template. When the template evolves, both files version together to preserve cross-platform parity of brand identity.

# Source

This template is generated from the brand-agnostic research in `research.md` and parallels `DESIGN_TEMPLATE_WEB.md`. Shared brand-identity values must match between web and mobile instances of a project to maintain cross-platform brand consistency.
