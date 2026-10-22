---
file_role: "design"
template_version: "1.21.0"
# Fixture for the exporter compatibility test (scripts/build-skill.sh). It uses every DESIGN shape whose
# exported name changed after v1.21: dotted role and step keys, unprefixed spacing roles, underscore
# container keys, tier keys, breakpoints with a record key, axes and role font bindings.
# tokens-v1.21.css and theme-v1.21.css beside it are what an extended project copy of the v1.21 exporter
# wrote for this file (the shape real v1.21 projects carry in tools/brand-kit/).
colors:
  neutral:
    1: "oklch(0.99 0.005 287)"
    6: "oklch(0.83 0.006 287)"
    12: "oklch(0.22 0.0096 287)"
    dark:
      1: "oklch(0.17 0.0099 287)"
      6: "oklch(0.37 0.0087 287)"
      12: "oklch(0.93 0.0054 287)"
  surface:
    canvas: "{colors.neutral.1}"
  text:
    primary: "{colors.neutral.12}"
  border:
    subtle: "{colors.neutral.6}"
  shadow_tint: "{colors.neutral.12}"
typography:
  families:
    body: "Manrope"
  fallbacks:
    sans: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
  fallback_assignments:
    body: "sans"
  axes:
    body:
      wght: 500
  measure_max_ch: 65
  roles:
    heading-5.5xl:
      size: "clamp(4.25rem, 1.2rem + 13.5vw, 13.375rem)"
      size_3xl: "17.9375rem"
      weight: 500
      line_height: 0.95
      letter_spacing: "-0.036em"
      font_family: "{typography.families.body}"
    body-base:
      size: "1rem"
      weight: 400
      line_height: 1.5
      font_family: "{typography.families.body}"
spacing:
  unit: "px"
  scale:
    0.5: 2
    1: 4
    1.5: 6
    3: 12
    6: 24
    10: 40
  roles:
    text_to_icon_inline: "{spacing.scale.1.5}"
    container_padding_mobile: "{spacing.scale.3}"
    container_padding_desktop: "{spacing.scale.6}"
    container_padding_ramp_vw: 1.575
    container_padding_3xl: "{spacing.scale.10}"
    column_offset_subtle: "1lh"
    ui_scale_desktop: 1
    ui_scale_3xl: 1.25
radius:
  scale:
    none: 0
    md: 8
elevation:
  scale:
    1: "0 1px 2px {colors.shadow_tint}"
breakpoints:
  sm: 640
  3xl: 1920
  5xl: 3440
  _freeze_points:
    type_ladder: 1440
containers:
  prose: "65ch"
  full: "100%"
  full_cap: 2560
  full_cap_5xl: 3200
  default: "full"
---
# Design (exporter compatibility fixture)
