---
# ─────────────────────────────────────────────────────────────
# SPEC_TEMPLATE_MOBILE.md — App map + screen content + every word of COPY
# Version: 1.1.0
# Scope: mobile apps (iOS HIG + Android Material 3)
# Companions: DESIGN_TEMPLATE_MOBILE.md (visual system), INFORMATION_TEMPLATE.md (brand)
#
# WHAT THIS FILE IS:
# This file is the CANONICAL SOURCE OF EVERY WORD that appears in the app.
# Every screen, every button label, every empty-state title, every error
# message, every onboarding sentence, every permission pre-prompt, every
# push notification body, every settings label, every app store description —
# all the final copy lives here. Not summaries. Not "TBD." The literal text
# that will display in the app.
#
# The <slot> placeholders inside `content:` blocks include guidance about
# what kind of copy to write. REPLACE each one with the actual final
# sentence. The guidance describes the slot; the value you put there IS
# the copy.
#
# HOW TO USE:
# 1. Copy this file to your project as `SPEC_MOBILE.md`.
# 2. Update `app_map` to match every screen in your app.
# 3. For each screen, duplicate the screen template under `screens.*` and
#    fill EVERY content + states slot with the actual final copy.
# 4. Fill the `auth`, `onboarding`, `permissions`, `push_notifications`,
#    `settings`, `app_store` blocks with the actual final copy.
# 5. Verify with `grep -n "<[^>]*>" SPEC_MOBILE.md` — zero matches means complete.
# 6. Reference DESIGN_MOBILE.md vocabulary for layout sections and components.
# 7. Reference INFORMATION.md for brand voice and audience.
# 8. Hand SPEC_MOBILE.md alongside DESIGN_MOBILE.md and INFORMATION.md to
#    any AI tool building the app. The AI renders copy EXACTLY as written.
# ─────────────────────────────────────────────────────────────

template_version: "1.3.1"
file_role: "spec"
platform: "mobile"

# ═══════════════════════════════════════════════════════════════
# APP MAP
# ═══════════════════════════════════════════════════════════════

app_map:
  tab_bar_destinations:
    # The 3-5 top-level destinations in the tab bar / navigation bar.
    # iOS: UITabBarController tabs. Android: M3 NavigationBar destinations.
    - { tab: "home", label: "<Home>", icon: "home", route: "/home" }
    - { tab: "search", label: "<Search>", icon: "search", route: "/search" }
    - { tab: "library", label: "<Library>", icon: "bookmark", route: "/library" }
    - { tab: "profile", label: "<Profile>", icon: "user", route: "/profile" }

  screens:
    # All screens in the app. Each tab has at least one root screen plus drill-downs.
    auth:
      - sign_in: "/auth/sign-in"
      - sign_up: "/auth/sign-up"
      - password_reset: "/auth/password-reset"
      - mfa_challenge: "/auth/mfa"
    onboarding:
      - welcome: "/onboarding/welcome"
      - permissions_intro: "/onboarding/permissions"
      - profile_setup: "/onboarding/profile"
      - first_action: "/onboarding/first-action"
    home:
      - feed: "/home"
      - item_detail: "/home/item/[id]"
    search:
      - search: "/search"
      - search_results: "/search/results"
      - filters: "/search/filters"
    library:
      - library: "/library"
      - collection_detail: "/library/collection/[id]"
    profile:
      - profile: "/profile"
      - settings: "/profile/settings"
      - notifications_settings: "/profile/settings/notifications"
      - account_settings: "/profile/settings/account"
      - billing: "/profile/settings/billing"
    modals:
      # Modal screens that present over current context
      - new_item: "modal:/new"
      - share_sheet: "modal:/share"
    utility:
      - "404": "/error/not-found"
      - offline: "/error/offline"
      - maintenance: "/error/maintenance"

  deep_links:
    # URL schemes the app responds to (universal links + custom scheme)
    universal_link_domain: "{information.operations.domains.primary}"
    custom_scheme: "<appscheme>"
    examples:
      - "https://example.com/item/123 → /home/item/123"
      - "appscheme://item/123 → /home/item/123"

# ═══════════════════════════════════════════════════════════════
# GLOBAL ELEMENTS
# ═══════════════════════════════════════════════════════════════

global:
  nav_style: "{design_mobile.options.mobile_nav_style}"  # tab-bar | navigation-bar | nav-rail | hybrid
  platform_adherence: "{design_mobile.options.platform_adherence}"  # ios-strict | material-strict | cross-platform-hybrid

  top_nav_defaults:
    ios:
      style: "large-title-collapses-on-scroll"   # iOS HIG default for top-level screens
      leading_default: "back-chevron-or-nothing"
      trailing_default: "single-action-icon-or-nothing"
    android:
      style: "center-aligned"                     # M3 TopAppBar Center-Aligned (small)
      navigation_icon: "back-arrow-or-menu"
      action_icons_max: 2_plus_overflow

  tab_bar:
    ios:
      visible_on_screens: ["all top-level except modals"]
      ios_18_compact_on_scroll: true
      background_material: "regular"
    android:
      visible_on_screens: ["all top-level except modals"]
      indicator_pill: true

  bottom_safe_area_supplement: 8   # extra pt below content inside safe area

# ═══════════════════════════════════════════════════════════════
# ONBOARDING SEQUENCE
# ═══════════════════════════════════════════════════════════════

onboarding:
  pattern: "{design_mobile.options.onboarding_pattern}"   # empty-state-driven | progressive | etc.
  goal: "<single conversion goal — e.g., 'user completes first meaningful action within 60 seconds'>"

  flow:
    - step: 1
      screen: "welcome"
      purpose: "<establish trust + value prop>"
      content:
        headline: "<Welcome to {{brand_name}}>"
        body: "<1-sentence value prop tailored to primary persona>"
        media: "<illustration | video | n/a>"
        cta_primary: { label: "<Get started>", action: "advance" }
        cta_secondary: { label: "<I already have an account>", action: "navigate:/auth/sign-in" }

    - step: 2
      screen: "permissions_intro"
      purpose: "<pre-prompt for required permissions before system dialog>"
      content:
        permissions_explained:
          - { permission: "notifications", reason: "<so we can let you know when X>" }
          - { permission: "camera", reason: "<so you can Y>" }
        cta_primary: { label: "<Allow>", action: "request_permissions" }
        cta_secondary: { label: "<Not now>", action: "advance_with_skip" }

    - step: 3
      screen: "profile_setup"
      purpose: "<collect minimum profile info to personalize first experience>"
      content:
        fields:
          - { name: "display_name", label: "<What should we call you?>", required: true }
          - { name: "use_case", label: "<What brings you to {{brand_name}}?>", type: "single-select", options: ["<option 1>", "<option 2>", "<option 3>"] }
        cta_primary: { label: "<Continue>", action: "advance" }

    - step: 4
      screen: "first_action"
      purpose: "<guide the user to their first meaningful action — the moment of value>"
      content:
        headline: "<Let's <do the thing>>"
        body: "<brief instruction>"
        cta_primary: { label: "<context-specific verb>", action: "complete_first_action" }
        skip_link: { label: "<Skip for now>", action: "complete_onboarding" }

  exit_routes:
    completion: "/home"
    skip_at_any_step: "/home"   # always honor skip — don't trap users in onboarding

  re_entry_rules:
    show_again_on_relogin: false   # never repeat onboarding to returning users
    show_progress_indicator: true  # tiny dots or progress bar through the flow

# ═══════════════════════════════════════════════════════════════
# AUTHENTICATION COPY
# ═══════════════════════════════════════════════════════════════

auth:

  sign_up:
    headline: "<Create your account>"
    body: "<optional 1-sentence reassurance>"
    methods:
      social:
        - { provider: "Apple", label: "<Continue with Apple>" }
        - { provider: "Google", label: "<Continue with Google>" }
      magic_link:
        enabled: true
        cta: "<Email me a sign-in link>"
      email_password:
        enabled: true
        fields:
          - { name: "email", label: "<Email>", autocomplete: "email" }
          - { name: "password", label: "<Password>", autocomplete: "new-password", show_hide_toggle: true, helper: "<8+ characters>" }
        cta: "<Create account>"
    legal_consent: "<By signing up, you agree to our Terms and Privacy Policy.>"
    sign_in_link: { label: "<Already have an account? Sign in>", route: "/auth/sign-in" }

  sign_in:
    headline: "<Welcome back>"
    methods:
      social:
        - { provider: "Apple", label: "<Continue with Apple>" }
        - { provider: "Google", label: "<Continue with Google>" }
      email_password:
        fields:
          - { name: "email", label: "<Email>", autocomplete: "email" }
          - { name: "password", label: "<Password>", autocomplete: "current-password" }
        cta: "<Sign in>"
    forgot_password_link: { label: "<Forgot password?>", route: "/auth/password-reset" }
    sign_up_link: { label: "<Don't have an account? Sign up>", route: "/auth/sign-up" }

  password_reset:
    request_screen:
      headline: "<Reset your password>"
      body: "<Enter your email. We'll send you a link to reset it.>"
      cta: "<Send reset link>"
      success_message: "<Check your inbox. If your email is on file, you'll get a reset link shortly.>"

  mfa_challenge:
    headline: "<Verification needed>"
    body: "<Enter the 6-digit code from your authenticator app.>"
    input_type: "6-character-boxes-with-auto-advance"
    paste_handler: "fills all 6 boxes from clipboard"
    resend:
      cooldown_seconds: 30
      cta: "<Resend code>"
    cta: "<Verify>"
    error_message: "<That code isn't right. Try again or request a new one.>"

# ═══════════════════════════════════════════════════════════════
# PERMISSION PRE-PROMPTS (mandatory before system dialog)
# ═══════════════════════════════════════════════════════════════
# Per DESIGN_MOBILE.md §W.10: never trigger system permission dialog
# without showing a custom in-app explanation first.

permissions:

  notifications:
    icon: "bell"
    headline: "<Stay in the loop>"
    body: "<We'll let you know when <specific value — e.g., 'someone replies to your message'>. You can adjust this anytime in Settings.>"
    cta_primary: { label: "<Allow>", action: "request_system_permission" }
    cta_secondary: { label: "<Not now>", action: "dismiss" }
    if_denied_settings_link: "<If you change your mind, enable notifications in Settings.>"

  camera:
    icon: "camera"
    headline: "<Use your camera>"
    body: "<We need camera access to <specific reason — e.g., 'scan documents'>. Your camera is only used in this moment; nothing is stored without your action.>"
    cta_primary: { label: "<Allow>", action: "request_system_permission" }
    cta_secondary: { label: "<Not now>", action: "dismiss" }

  photo_library:
    icon: "image"
    headline: "<Choose photos>"
    body: "<We'd like to read photos you choose. You control which photos we see.>"
    cta_primary: { label: "<Allow access>", action: "request_system_permission" }
    cta_secondary: { label: "<Not now>", action: "dismiss" }

  location:
    icon: "map-pin"
    headline: "<Use your location>"
    body: "<We use your location to <specific reason>. We never sell or share your location data.>"
    cta_primary: { label: "<Allow while using>", action: "request_system_permission_when_in_use" }
    cta_secondary: { label: "<Not now>", action: "dismiss" }

  contacts:
    icon: "users"
    headline: "<Find friends>"
    body: "<We can use your contacts to help you find people you already know on {{brand_name}}. We don't store your contacts.>"
    cta_primary: { label: "<Allow>", action: "request_system_permission" }
    cta_secondary: { label: "<Not now>", action: "dismiss" }

  microphone:
    icon: "mic"
    headline: "<Use your microphone>"
    body: "<We need microphone access to <specific reason>. Recording only happens when you tap record.>"
    cta_primary: { label: "<Allow>", action: "request_system_permission" }
    cta_secondary: { label: "<Not now>", action: "dismiss" }

  bluetooth:
    icon: "bluetooth"
    headline: "<Connect via Bluetooth>"
    body: "<We use Bluetooth to <specific reason>.>"
    cta_primary: { label: "<Allow>", action: "request_system_permission" }
    cta_secondary: { label: "<Not now>", action: "dismiss" }

# ═══════════════════════════════════════════════════════════════
# PUSH NOTIFICATION COPY
# ═══════════════════════════════════════════════════════════════
# Each push has a title (~30 chars), body (~80 chars), and optional category for actions.

push_notifications:

  opt_in_explanation:
    # Same pattern as permissions.notifications — pre-prompt before system dialog
    headline: "<Stay in the loop>"
    body: "<see permissions.notifications above>"

  templates:
    welcome:
      title: "<Welcome to {{brand_name}} 👋>"
      body: "<Get started with your first <action>.>"
      category: "welcome_actions"
      actions: ["<Open app>"]
    mention:
      title: "<{{sender_name}} mentioned you>"
      body: "<{{message_preview}}>"
      category: "message_actions"
      actions: ["<Reply>", "<View>"]
    daily_digest:
      title: "<Your day at {{brand_name}}>"
      body: "<{summary_line — e.g., '3 new updates, 1 reminder'}>"
    reminder:
      title: "<{{reminder_title}}>"
      body: "<{{reminder_body}}>"
      category: "reminder_actions"
      actions: ["<Mark done>", "<Snooze 1h>"]
    re_engagement:
      title: "<Pick up where you left off>"
      body: "<You have <N> things waiting in {{brand_name}}.>"
      conditions: "send after 7 days inactive; max once per 14 days"

  frequency_rules:
    max_per_day: 3
    quiet_hours: "<22:00 – 08:00 user local time>"
    respect_dnd_per_platform: true

# ═══════════════════════════════════════════════════════════════
# IN-APP NOTIFICATIONS (toast / banner / inbox)
# ═══════════════════════════════════════════════════════════════

in_app_notifications:

  toasts:
    success:
      saved: "<Saved.>"
      sent: "<Sent.>"
      copied: "<Copied.>"
      deleted: "<Removed. <undo>Undo</undo>>"
    info:
      syncing: "<Syncing…>"
    warning:
      offline: "<You're offline. Changes will sync when you're back online.>"
    error:
      generic: "<Couldn't complete that. Try again, or contact support.>"
      network: "<No connection. Check your internet.>"

  banners:
    new_version_available:
      headline: "<A new version of {{brand_name}} is available>"
      body: "<Update to get the latest improvements.>"
      cta: { label: "<Update>", action: "open_app_store" }
      dismissible: true
    payment_failed:
      severity: "danger"
      headline: "<Payment didn't go through>"
      body: "<Update your payment method to keep your account active.>"
      cta: { label: "<Update>", action: "navigate:/profile/settings/billing" }
      dismissible: false   # persistent until resolved

  inbox:
    enabled: "<true | false>"
    sections:
      - "All"
      - "Unread"
      - "Mentions"
    empty_state:
      title: "<You're all caught up>"
      body: "<New notifications will appear here.>"

# ═══════════════════════════════════════════════════════════════
# SETTINGS ARCHITECTURE
# ═══════════════════════════════════════════════════════════════

settings:
  ia: "{design_mobile.options.settings_ia}"   # single-page (mobile default) | grouped-list

  sections:

    account:
      title: "<Account>"
      items:
        - { type: "label-value", label: "<Email>", value: "{user.email}" }
        - { type: "navigation", label: "<Edit profile>", route: "/profile/settings/account" }
        - { type: "navigation", label: "<Change password>", route: "/profile/settings/account/password" }
        - { type: "navigation", label: "<Two-factor authentication>", route: "/profile/settings/account/mfa" }

    notifications:
      title: "<Notifications>"
      items:
        - { type: "toggle", label: "<Push notifications>", key: "push_enabled", default: true }
        - { type: "toggle", label: "<Email notifications>", key: "email_enabled", default: true }
        - { type: "toggle", label: "<Daily digest>", key: "daily_digest", default: false }
        - { type: "toggle", label: "<Marketing emails>", key: "marketing_emails", default: false }

    appearance:
      title: "<Appearance>"
      items:
        - { type: "single-select", label: "<Theme>", key: "theme", options: ["System", "Light", "Dark"], default: "System" }
        - { type: "single-select", label: "<Text size>", key: "text_size", options: ["Default", "Larger", "Largest"], default: "Default" }
        - { type: "toggle", label: "<Reduce motion>", key: "reduce_motion", default: false }

    privacy:
      title: "<Privacy & data>"
      items:
        - { type: "navigation", label: "<Data export>", route: "/profile/settings/privacy/export" }
        - { type: "navigation", label: "<Connected apps>", route: "/profile/settings/privacy/connected" }
        - { type: "navigation", label: "<Block list>", route: "/profile/settings/privacy/blocked" }

    billing:
      title: "<Billing>"
      items:
        - { type: "label-value", label: "<Current plan>", value: "{subscription.plan_name}" }
        - { type: "navigation", label: "<Change plan>", route: "/profile/settings/billing/change-plan" }
        - { type: "navigation", label: "<Payment method>", route: "/profile/settings/billing/payment" }
        - { type: "navigation", label: "<Invoices>", route: "/profile/settings/billing/invoices" }

    support:
      title: "<Support>"
      items:
        - { type: "navigation", label: "<Help center>", external_url: "{information.operations.support.docs_url}" }
        - { type: "navigation", label: "<Contact support>", action: "open_support_chat_or_email" }
        - { type: "navigation", label: "<Send feedback>", action: "open_feedback_form" }

    about:
      title: "<About>"
      items:
        - { type: "navigation", label: "<Terms of service>", external_url: "{information.legal.terms_url}" }
        - { type: "navigation", label: "<Privacy policy>", external_url: "{information.legal.privacy_url}" }
        - { type: "label-value", label: "<Version>", value: "{app.version_string}" }

    danger_zone:
      title: "<Danger zone>"
      style: "destructive"   # red border accent, separated from other sections
      items:
        - { type: "action-destructive", label: "<Sign out>", action: "sign_out_with_confirmation" }
        - { type: "action-destructive", label: "<Delete account>", action: "delete_account_with_typed_confirmation" }

# ═══════════════════════════════════════════════════════════════
# SCREENS — every screen's exact copy, layout, and all 4 states
# ═══════════════════════════════════════════════════════════════
# This is where the entire app's screen-level text lives. For each screen in
# `app_map.screens`, duplicate the screen template below and fill EVERY
# content + state slot with the final, brand-voice copy. The AI consuming
# this file renders copy exactly as written — no paraphrasing, no summarizing.
#
# Every screen declares all four state variants (loaded / loading / empty /
# error). Each state needs its real microcopy filled in.
#
# Guidance inside slots describes what KIND of copy to write. Replace it
# with the actual final sentence the user will read on the screen.

screens:

  home:
    route: "/home"
    purpose: "<one-sentence purpose>"
    primary_persona: "{information.audience.primary_persona.name}"

    layout:
      top_bar:
        title: "<Home>"
        style: "large-title-collapses-on-scroll"
        leading: "<none>"
        trailing: [{ icon: "search", action: "navigate:/search" }, { icon: "bell", action: "open_notifications" }]

      sections:
        - type: "scrollable-feed"
          item_type: "card"
          pull_to_refresh: true
          empty_state_id: "home_empty"
          loading_state: "skeleton-list-3-items"
          error_state_id: "home_error"

    states:
      loading:
        type: "skeleton"
        layout: "match-loaded-state"
      empty:
        id: "home_empty"
        illustration: "<asset path>"
        title: "<It's quiet in here>"
        body: "<Once you <do the thing>, you'll see updates here.>"
        cta: { label: "<Get started>", action: "navigate:/onboarding/first-action" }
      error:
        id: "home_error"
        icon: "alert-triangle"
        title: "<Couldn't load>"
        body: "<Check your connection and try again.>"
        cta: { label: "<Retry>", action: "refetch" }
      offline:
        banner: "<You're offline. Showing cached content.>"

    analytics_events:
      - { event: "home_viewed", trigger: "screen_appear" }
      - { event: "home_item_tapped", trigger: "card_tap", properties: { item_id: "<id>" } }
      - { event: "home_refreshed", trigger: "pull_to_refresh" }

  item_detail:
    route: "/home/item/[id]"
    purpose: "<show detail of a single item>"

    layout:
      top_bar:
        title: "<{{item.title}}>"
        style: "inline"   # not large-title — this is a drill-down
        leading: "back"
        trailing: [{ icon: "share", action: "open_share_sheet" }, { icon: "more-horizontal", action: "open_action_sheet" }]
      sections:
        - type: "hero-media"
          aspect: "{design_mobile.images.aspect_ratios.video}"
        - type: "title-block"
        - type: "metadata-row"
        - type: "long-form-content"
        - type: "actions-row"
        - type: "related-items"

    states:
      loading: "skeleton-detail"
      not_found:
        title: "<That item is gone>"
        body: "<It may have been removed.>"
        cta: { label: "<Back to home>", action: "navigate:/home" }
      error:
        title: "<Couldn't load>"
        cta: { label: "<Retry>", action: "refetch" }

  search:
    route: "/search"
    purpose: "<help users find things>"
    layout:
      top_bar:
        type: "search-field-only"
        placeholder: "<Search {{brand_name}}…>"
        cancel_button_on_focus: true
      sections:
        - type: "recent-searches"
          empty_message: "<Your recent searches will appear here.>"
        - type: "suggested"
          source: "personalized_or_trending"
    states:
      empty_query: "show recent + suggested"
      no_results:
        title: '<No results for "{{query}}">'
        body: "<Try a different search or browse <link>categories</link>.>"
      error:
        title: "<Search failed>"
        cta: { label: "<Retry>", action: "retry_search" }

  profile:
    route: "/profile"
    purpose: "<personal home — settings, activity, identity>"
    layout:
      top_bar:
        title: "<Profile>"
        trailing: [{ icon: "settings", action: "navigate:/profile/settings" }]
      sections:
        - type: "profile-header"
          fields: ["avatar", "display_name", "handle", "bio"]
        - type: "stats-row"
        - type: "tab-section"
          tabs: ["Activity", "Saved", "Liked"]
    states:
      loading: "skeleton"
      error:
        title: "<Couldn't load your profile>"
        cta: { label: "<Retry>", action: "refetch" }

  "404":
    route: "/error/not-found"
    purpose: "<dead-end recovery>"
    layout:
      sections:
        - type: "centered-message"
          illustration: "<asset>"
          title: "<This page is missing>"
          body: "<It may have been moved or removed.>"
          cta: { label: "<Back to home>", action: "navigate:/home" }

  offline:
    route: "/error/offline"
    purpose: "<offline recovery>"
    layout:
      sections:
        - type: "centered-message"
          icon: "wifi-off"
          title: "<You're offline>"
          body: "<Check your connection. Your changes will sync when you're back online.>"
          cta: { label: "<Try again>", action: "retry_connection" }

# ═══════════════════════════════════════════════════════════════
# SYSTEM DIALOGS (custom-styled native dialogs / action sheets)
# ═══════════════════════════════════════════════════════════════

system_dialogs:

  destructive_confirmation:
    pattern: "iOS confirmationDialog / Android AlertDialog"
    title: "<Are you sure?>"
    body: "<{specific consequences — e.g., 'This will permanently delete your account and all data.'}>"
    primary_action: { label: "<Delete>", style: "destructive" }
    cancel_action: { label: "<Cancel>", style: "default" }
    requires_typed_confirmation: "<true | false — for catastrophic actions like account deletion>"

  sign_out_confirmation:
    title: "<Sign out?>"
    body: "<You'll need to sign in again to use {{brand_name}}.>"
    primary_action: { label: "<Sign out>", style: "default" }
    cancel_action: { label: "<Cancel>" }

  discard_changes:
    title: "<Discard changes?>"
    body: "<You have unsaved changes. They'll be lost if you go back.>"
    primary_action: { label: "<Discard>", style: "destructive" }
    cancel_action: { label: "<Keep editing>" }

  network_error_retry:
    title: "<No connection>"
    body: "<Check your internet and try again.>"
    primary_action: { label: "<Retry>" }
    cancel_action: { label: "<Cancel>" }

# ═══════════════════════════════════════════════════════════════
# VOICE SAMPLES — real sentences in brand voice
# ═══════════════════════════════════════════════════════════════
# AI mimics these for any new copy. Source: {information.brand.voice_principles}.

voice_samples:
  button_labels:
    - "<actual on-brand button label — 1-2 words>"
    - "<another>"
  empty_states:
    - "<actual on-brand empty-state sentence>"
  error_messages:
    - "<actual on-brand error sentence — what + how-to-fix>"
  onboarding:
    - "<actual on-brand onboarding sentence>"
  push_notifications:
    - "<actual on-brand push body>"

# ═══════════════════════════════════════════════════════════════
# APP STORE METADATA
# ═══════════════════════════════════════════════════════════════

app_store:

  ios:
    name: "<App Name — max 30 chars>"
    subtitle: "<max 30 chars — concise positioning>"
    promotional_text: "<max 170 chars — refreshable without app review>"
    description_short: "<the most important first paragraph — visible above 'more'>"
    description_long: |
      <full long-form description for the App Store listing — multiple paragraphs;
      mirrors the brand voice from INFORMATION.md;
      uses concrete benefits and proof points;
      includes a clear "what's included" section if useful>
    keywords: "<comma-separated keywords, 100 chars total>"
    primary_category: "<Productivity | Lifestyle | etc.>"
    secondary_category: "<another>"
    age_rating: "<4+ | 9+ | 12+ | 17+>"
    privacy_policy_url: "{information.legal.privacy_url}"
    support_url: "{information.operations.support.docs_url}"
    marketing_url: "https://{information.operations.domains.primary}"
    whats_new_template: |
      <What's new in this version:
      • <change 1>
      • <change 2>
      • <bug fixes and performance improvements>>
    screenshots_order:
      - "<screen 1 — feature highlight>"
      - "<screen 2 — second feature>"
      - "<screen 3 — third feature>"
      - "<screen 4 — social proof / testimonial>"
      - "<screen 5 — CTA / pricing>"

  android:
    name: "<App Name — max 50 chars>"
    short_description: "<max 80 chars — appears in search results>"
    full_description: |
      <full description for Google Play — multiple paragraphs;
      mirrors brand voice;
      first 3 lines are most important (above 'read more')>
    category: "<Productivity | etc.>"
    content_rating: "<Everyone | Teen | etc.>"
    contains_ads: false
    in_app_purchases: "<true | false>"
    privacy_policy_url: "{information.legal.privacy_url}"
    feature_graphic: "<path — 1024×500 px>"
    screenshots:
      - "<screen 1>"
      - "<screen 2>"

# ═══════════════════════════════════════════════════════════════
# ANALYTICS — events + naming convention
# ═══════════════════════════════════════════════════════════════

analytics:
  provider: "<PostHog | Mixpanel | Amplitude | Firebase | n/a>"
  naming_convention:
    pattern: "snake_case"
    structure: "<object>_<action>"   # e.g., 'item_viewed', 'cta_tapped'
  global_properties:
    - "user_id (if authenticated)"
    - "session_id"
    - "screen_name"
    - "platform: ios | android"
    - "app_version"
    - "os_version"

  conversion_funnels:
    onboarding:
      name: "onboarding_completion"
      steps:
        - "app_first_open"
        - "onboarding_started"
        - "onboarding_step_completed"   # fired per step with step_number prop
        - "first_action_completed"
        - "onboarding_completed"

    activation:
      name: "user_activation"
      steps:
        - "sign_up_completed"
        - "first_action_completed"
        - "second_session"
        - "first_week_retained"

  privacy:
    ios:
      app_tracking_transparency: "<required if cross-app tracking; show ATT prompt>"
      privacy_manifest_required: "<true — iOS 17+>"
    android:
      data_safety_form: "<keep updated in Play Console>"

# ═══════════════════════════════════════════════════════════════
# ACCESSIBILITY — per-screen notes (universal floor in DESIGN_MOBILE.md)
# ═══════════════════════════════════════════════════════════════

a11y_notes:
  per_screen:
    home:
      voice_over_labels: "<each card has descriptive accessibilityLabel>"
      dynamic_type_max: "<must handle xxxLarge / AX5>"
    settings:
      ios_grouped_list_traits: "<use UITableViewStyleGrouped for proper VoiceOver navigation>"
    onboarding:
      skip_link_focus: "<skip link is first focusable element>"
  global:
    haptic_with_visual: "every haptic feedback paired with a visible state change"
    color_independence: "every status / state communicated by icon + text, not color alone"
    keyboard_external: "support external Bluetooth keyboard nav (iPad / Pixel Fold)"

---

# How to use this template

`SPEC_MOBILE.md` is the **content + screen-flow source of truth** for a mobile app. It declares every screen, what's on it, what states it has, and what copy/microcopy/notifications/permissions it uses. It uses `DESIGN_MOBILE.md` vocabulary for components and `INFORMATION.md` for brand voice and audience.

**Instantiation steps:**

1. Copy this file to your project as `SPEC_MOBILE.md`.
2. Update `app_map` to match your actual app structure.
3. For each screen, duplicate the screen template and fill in `layout`, `states`, `analytics_events`.
4. Fill the `voice_samples` with real sentences.
5. Fill `auth`, `onboarding`, `permissions`, `push_notifications`, `settings`, `app_store`.
6. Verify with `grep -n "<[^>]*>" SPEC_MOBILE.md` — zero matches.
7. Hand alongside `DESIGN_MOBILE.md` and `INFORMATION.md` to any AI tool building the app.

## Guided fill-in mode (v1.2+) — deterministic intake protocol

> **AI behavior rule — read carefully.**
> When the user asks ANY of the following (or close variations), STOP, do NOT summarize, do NOT give a status report, do NOT improvise your own question list. OUTPUT THE BLOCK BELOW VERBATIM with `?` markers left as-is for the user to fill:
>
> - *"help me populate this"* / *"help me fill this in"*
> - *"what do you need to know?"* / *"what do I need to tell you?"*
> - *"run the intake"* / *"give me the questions"*
> - *"walk me through this"* / *"how do I fill this in?"*
> - *"what's missing in this file?"* / *"what's left to fill in?"* / *"what else needs to be done?"*
> - any close variation indicating the user wants to know what to populate
>
> If `PROJECT.md` is present, use its full Interactive Population Protocol instead. The block below is the single-template fallback scoped to `SPEC_MOBILE.md` alone.
>
> **Partial-fill state — audit BEFORE producing PART 1:** Read the file in full, then walk every must-fill item. For each, classify as filled / suspected-stub / unfilled using BOTH mechanical patterns AND semantic reasoning:
> - **Mechanical (unfilled):** still wrapped in `<...>` placeholder syntax, empty string / null, just `?`, contains `TBD` / `TODO` / `FIXME` (case-insensitive), or a list below its declared minimum cardinality.
> - **Semantic (suspected stub):** value passes the mechanical checks but looks like a leftover example — known stubs like "Acme", "example.com", "John Doe"; generic placeholder language; one-word filler in slots needing real content; or contextually inconsistent with other filled values.
> - **Definitively filled:** specific to this brand, contextually coherent, meets cardinality + sub-field requirements.
>
> Include unfilled items in PART 1 as-is. Include suspected stubs in PART 1 with confirmation framing. Exclude definitively-filled items.
>
> When in doubt, INCLUDE in PART 1 with confirmation framing rather than silently treating as filled.
>
> **No brand context provided:** Still produce the intake exactly as below — leave `?` markers.
>
> **Special note for SPEC_MOBILE.md:** This file is the canonical source of every word that appears in the app. The intake covers structural decisions; the actual per-screen copy is gathered through a follow-up loop — too much content for a single intake form.

### OUTPUT THIS BLOCK VERBATIM when triggered (do not paraphrase, do not summarize, do not rewrite)

```
# Intake — SPEC_MOBILE.md

This is everything you need to decide to fully populate your app content + screen-flow spec. Each item has a short plain-English hint after the em dash.

**How to answer:**
- **All at once** — reply with answers numbered, freeform, or both. I'll figure it out.
- **One at a time** — say "let's go one at a time" and I'll walk you through each question, waiting for your answer before moving on.
- For PART 2, accept defaults or list overrides.

After we lock the structure, I'll loop with you screen-by-screen to collect actual copy.

## PART 1 — Must Fill (no defaults possible)

### Brand essentials
1. **Brand name** — what people call your app: ?
2. **One-line product description** — one sentence: what it does, for whom: ?
3. **Primary audience persona name** — your main user's name. Pulled from INFORMATION.md if present: ?

### App map
4. **Tab bar destinations** — the 3-5 top-level sections in the bottom tab bar. E.g., home, search, library, profile: ?
5. **Screen list by tab** — every screen inside each tab. E.g., "Home → feed + item_detail; Profile → profile + settings + billing": ?
6. **Deep link URLs** — universal link domain *(e.g., yourapp.com)* + custom scheme *(e.g., yourapp://)*. Used for sharing + push tap-throughs: ?
7. **Modal screens** — screens that pop up over the main flow rather than push. E.g., new_item, share_sheet, paywall: ?

### Onboarding
8. **Onboarding goal** — the one outcome that signals success. E.g., "User completes first meaningful action within 60 seconds": ?
9. **Onboarding step sequence** — the screens a new user sees, in order. Default flow: welcome → permissions intro → profile setup → first action. Customize as needed: ?

### Authentication
10. **Sign-up methods** — which sign-up options to offer: Apple *(required on iOS if any social)* / Google / email+password / magic-link / phone. Pick all that apply: ?
11. **Sign-in copy** — headline + body text shown on the sign-in screen: ?
12. **MFA (two-factor auth)?** — yes/no. If yes: 6-digit code via email or SMS with auto-advance + auto-submit: ?

### Permissions *(mobile-specific — pre-prompts are mandatory before system dialog)*
13. **Permissions the app needs** — for each: notifications / camera / photos / location / contacts / microphone / Bluetooth, explain **why** in user-friendly terms. E.g., "Notifications → so we can remind you when it's time to meditate.": ?

### Push notifications
14. **Push notification templates** — which types does the app send: welcome / mention / daily digest / reminder / re-engagement / transactional. For each: title + body + tap action: ?
15. **Frequency rules** — max push per day + quiet hours window. Default: 22:00–08:00 user local time: ?

### Settings architecture
16. **Settings sections** — accept defaults or customize. Default sections: Account / Notifications / Appearance / Privacy / Billing / Support / About / Danger zone *(delete account)*: ?

### Voice + vocabulary
17. **5-10 voice samples** — actual button labels, empty-state messages, error messages, onboarding sentences, or push body text written in your brand's voice. The AI mimics these for all new copy. Say **"draft them"** if you'd rather I propose drafts from INFORMATION.md for approval: ?
18. **Vocabulary preferences** — preferred terms + banned terms. E.g., "members" not "users", never "leverage": ?

### App store metadata
19. **iOS App Store** — fill each: name *(max 30 chars)*, subtitle *(max 30)*, promotional text *(max 170)*, short description, long description, keywords *(100 chars total, comma-separated)*, primary + secondary category, age rating: ?
20. **Android Play Store** — fill each: name *(max 50)*, short description *(max 80)*, full description, category, content rating: ?

### Analytics
21. **Analytics provider** — PostHog / Mixpanel / Amplitude / Firebase / n/a: ?
22. **Conversion funnels to track** — the activation + retention steps that matter. E.g., onboarding completion → first session → day-7 retention: ?
23. **iOS App Tracking Transparency required?** — yes if you track users across other apps/sites (e.g., advertising SDKs). Triggers the "Allow tracking?" iOS prompt: ?

## PART 2 — Customizable Defaults (accept or override)

Most SPEC defaults flow from DESIGN_MOBILE.md automatically. The few SPEC-specific options:

- **Toast position** — where in-app notifications appear: **top-center** ← top-right / top-center *(mobile standard)* / bottom-right / bottom-center
- **Time format** — how times display: **hybrid** ← relative *("2h ago")* / absolute *("Mar 5")* / hybrid *(relative ≤7d, absolute after)*
- **Number abbreviation** — large number format: **contextual** ← short *(1.2K)* / long *(1,200)* / contextual
- **Onboarding pattern** — how new users learn the app: **empty-state-driven** ← empty-state-driven *(helpful placeholders)* / progressive *(features revealed as needed)* / coach-marks *(pointer arrows)* / step-by-step-modal *(guided walkthrough)* / milestone-checklist *(gamified)*
- **Save model** — how edits persist: **auto-save** ← auto-save *(saves while typing)* / explicit-save *(requires Save button)*

## PART 3 — When you reply (and what happens after)

I'll:
1. Apply your PART 1 + PART 2 answers to SPEC_MOBILE.md structurally
2. If you said "draft them" for voice samples, draft 8-10 from INFORMATION.md (or your provided voice descriptor) and surface for approval BEFORE committing
3. Generate permission pre-prompt copy from your product description (drafts only — surface for approval)
4. Then loop with you **screen-by-screen** to collect actual copy (headline + body + CTAs + states for each screen). I'll go in priority order: onboarding → home → core feature screens → auth → settings → utility screens.
5. Run the 5-pattern verification: (a) `grep -n "<[^>]*>" SPEC_MOBILE.md` for placeholders, (b) `grep -niE "\bTBD\b|\bTODO\b|\bFIXME\b" SPEC_MOBILE.md` for plain-text deferrals, (c) `grep -nE ': *""\s*$|: *\?\s*$|: *null\s*$' SPEC_MOBILE.md` for empty values, (d) stub scan for common surviving examples, (e) cardinality + semantic-reasoning check on each list slot
6. Report: ✅ filled count, ⚠️ remaining (with reason per item), 🤔 suspected stubs needing confirmation, 📝 user-deferred items. If anything sits in "remaining" or "suspected stubs", do NOT declare complete
7. Offer next steps (generate iOS asset catalog entries, scaffold SwiftUI / Compose screen files matching the layout sections, etc.)
```

The AI MUST produce this output in full (or, if filling a partially-populated SPEC_MOBILE.md, EXCLUDE already-filled items from PART 1 and only ask about gaps). Never improvise the format.

---

# AI Agent Contract

When generating any screen, copy, or interaction from this document, an AI agent **must** follow these rules:

1. **`SPEC_MOBILE.md` is canonical for screen content, layout, AND every word of copy.** Every screen's layout and every word that appears in the app lives here. Layouts declared here override DESIGN_MOBILE.md's defaults. **Copy declared here is the final text that ships** — never paraphrase, summarize, rewrite, or "improve" it. Render it exactly as written, character-for-character. If a content slot still contains placeholder guidance (e.g., `"<≤44 chars, brand voice>"`), surface the gap to the human — don't invent the copy yourself.
2. **Reference DESIGN_MOBILE.md vocabulary** for component names, state styles, and platform conventions.
3. **Reference INFORMATION.md for brand voice and audience.** Anchor all new copy to voice principles + primary persona.
4. **Mimic voice_samples for any generated copy.** Don't average toward generic app copy.
5. **Every screen declares loading / empty / error states.** Never ship a screen without all four states (loaded + 3 alternates).
6. **Permission pre-prompts are mandatory.** Never trigger system permission dialog without showing the custom in-app explanation first.
7. **Settings architecture is final.** Use the declared section ordering and item types — don't reorder or invent items.
8. **App store copy is brand voice.** Treat the store listing as a marketing surface, not a technical artifact.
9. **Analytics events must use the declared naming convention.** Don't invent ad-hoc event names.
10. **Honor accessibility settings declared per-screen.** Dynamic Type, VoiceOver labels, color-independence are non-negotiable.
11. **Use native components first (per DESIGN_MOBILE.md).** Custom UI only when native doesn't satisfy.
12. **System gestures stay system gestures.** Don't override back-swipe, pull-to-refresh, sheet-dismiss-swipe.

---

# How to fill this template well

## App map

Start with the tab bar destinations. iOS HIG and Material both recommend 3-5 top-level destinations — 5 is the absolute max. If you find yourself wanting 6+, you're conflating two different products or you need a hub-screen for the extras.

Drill-down screens nest under their tab. Modals are listed separately because they cross tab boundaries.

Deep links matter for marketing and re-engagement. Declare both universal links (https://) and custom scheme (appscheme://).

## Screens

Each screen needs all four state variants declared:
- **Loading** — usually skeleton matching the loaded layout
- **Loaded** — the default
- **Empty** — first-run, no-data
- **Error** — failed to load

If a screen has additional states (no-search-results, offline-with-cache, restricted-by-permission), declare those too.

The `purpose` line is your contract. Vague purpose → vague screen.

## Onboarding

The fewer steps the better. Each step needs a clear conversion goal. The single biggest mobile UX anti-pattern is the 5-swipeable-intro-slides pattern — users skip them universally. Use empty-state-driven onboarding instead when possible.

Permission pre-prompts at step 2 typically double grant rates vs raw system dialogs.

## Permissions

Pre-prompt every permission. Always. The pattern:
1. Custom in-app screen explaining what + why + benefit
2. User taps "Allow" on YOUR screen
3. System permission dialog appears
4. User responds

If the user denies on your custom screen, never re-prompt within the session. Provide a deep link to Settings if they change their mind later.

## Push notifications

Push opt-in is precious. Don't ask for it on first launch — wait until the user has experienced enough value to want updates. Typical sweet spot: after they've completed their first meaningful action.

Each push template should be short, specific, and respect quiet hours (typically 10 PM – 8 AM user local time).

## Settings

The mobile-native pattern is single-page scrolling with grouped sections. iOS: `List` with `.insetGrouped`. Android: M3 `LazyColumn` with `ListItem`.

`danger_zone` is a real section — destructive actions belong together, visually separated, requiring explicit confirmation.

## App store metadata

The first 3 lines of your store description are the most important. Above the fold = visible without tapping "More." Lead with the strongest value claim.

Screenshots are conversion: order them like a story (1: hook, 2-4: features, 5: CTA / social proof).

## Voice samples

Real sentences. The more concrete, the better. AI mimics these for every generated copy.

## Analytics

Declare the conversion funnels you care about up front. AI wires the events automatically.

iOS apps must show ATT (App Tracking Transparency) prompt if doing cross-app tracking. Android apps must keep Data Safety form current.

---

# Anti-patterns — never do this in SPEC_MOBILE.md

- **Don't restate DESIGN_MOBILE.md visual rules.** Layout grammar lives there.
- **Don't restate INFORMATION.md brand rules.** Voice / audience / story live there.
- **Don't skip pre-prompts for permissions.** Cuts grant rates in half.
- **Don't request all permissions on launch.** Request in context, when the feature needs it.
- **Don't write 5-step swipeable intro onboarding.** Universal anti-pattern. Use empty-state-driven or progressive instead.
- **Don't omit empty / loading / error states.** Every screen has all four.
- **Don't use generic SaaS-app copy.** Anchor to voice_samples.
- **Don't invent feature names.** Use the declared product capabilities from INFORMATION.md.
- **Don't write the app store listing in technical-spec voice.** It's a marketing surface.
- **Don't reorder settings sections per project.** Keep the canonical order: Account → Notifications → Appearance → Privacy → Billing → Support → About → Danger zone.

---

# Versioning

`template_version: 1.0.0`. Per-project `SPEC_MOBILE.md` instances should preserve this field.

# Source

Part of the `premium-product-templates` family. Companion files: `PROJECT.md` (orchestration), `DESIGN_MOBILE.md` (visual system), `INFORMATION.md` (brand / business context), `SPEC.md` (web sibling — for projects that ship both).
