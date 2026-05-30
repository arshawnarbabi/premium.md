---
# ─────────────────────────────────────────────────────────────
# SPEC_TEMPLATE_WEB.md — Site map + content/layout/COPY for a web project
# Version: 1.7.0
# Scope: web (marketing sites, product/SaaS websites, hybrid)
# Companions: DESIGN_TEMPLATE_WEB.md (visual system), INFORMATION_TEMPLATE.md (brand)
#
# WHAT THIS FILE IS:
# This file is the CANONICAL SOURCE OF EVERY WORD that appears on the website.
# Every page, every section, every headline, every body paragraph, every button
# label, every form placeholder, every email subject, every error message —
# all the final copy lives here. Not summaries of copy. Not descriptions of
# what copy should say. The literal text that will display on the rendered site.
#
# The <slot> placeholders inside `content:` blocks include guidance about what
# to write (e.g., "<≤44 chars, brand voice, one sharp value claim>"). REPLACE
# each one with the actual final sentence. The guidance describes the slot;
# the value you put there IS the copy.
#
# HOW TO USE:
# 1. Copy this file to your project as `SPEC.md`.
# 2. Update `sitemap` to list every page on your site.
# 3. For each page, duplicate the page template under `pages.*` and fill
#    EVERY content slot with the actual final copy. No "to be written later"
#    placeholders should remain.
# 4. Verify with `grep -n "<[^>]*>" SPEC.md` — zero matches means complete.
# 5. Reference DESIGN.md vocabulary for section types and component names.
# 6. Reference INFORMATION.md for brand voice, audience, defaults.
# 7. Hand SPEC.md alongside DESIGN.md and INFORMATION.md to any AI tool
#    building the site. The AI renders copy EXACTLY as written here.
# ─────────────────────────────────────────────────────────────

template_version: "1.7.0"
file_role: "spec"          # information | design | spec | project
platform: "web"

# ═══════════════════════════════════════════════════════════════
# SITE MAP
# ═══════════════════════════════════════════════════════════════

sitemap:
  # Top-level pages reachable from the primary nav or directly via URL.
  # Hierarchy is implied by nesting. Each entry must have a corresponding
  # entry in the `pages:` map below.
  top_level:
    - home: "/"
    - pricing: "/pricing"
    - about: "/about"
    - blog: "/blog"
    - contact: "/contact"
  product_pages:
    # If this is a product/SaaS site with feature pages
    - "<features/feature-name>: /features/feature-name"
  resource_pages:
    - docs: "<docs.example.com or /docs>"
    - changelog: "/changelog"
    - help: "/help"
  legal_pages:
    - privacy: "/privacy"
    - terms: "/terms"
    - cookies: "/cookies"
  utility_pages:
    - "404": "/404"
    - "500": "/500"
    - maintenance: "/maintenance"
  auth_pages:
    # Only if the site has authenticated areas
    - sign_in: "/login"
    - sign_up: "/signup"
    - password_reset: "/password/reset"

# ═══════════════════════════════════════════════════════════════
# GLOBAL ELEMENTS (apply across every page unless a page overrides)
# ═══════════════════════════════════════════════════════════════

global:
  top_nav:
    style: "{design.options.product_nav_style}"   # from DESIGN.md
    links:
      - label: "<Pricing>"
        href: "/pricing"
      - label: "<About>"
        href: "/about"
      - label: "<Blog>"
        href: "/blog"
    cta_primary:
      label: "<Get started>"
      href: "<URL — likely /signup>"
    cta_secondary:
      label: "<Sign in>"
      href: "/login"
    mobile_collapse: "hamburger-to-sheet"   # per DESIGN.md

  footer:
    style: "{design.options.footer_style}"   # multi-column | minimal
    columns:
      - heading: "<Product>"
        links:
          - { label: "<Features>", href: "/features" }
          - { label: "<Pricing>", href: "/pricing" }
          - { label: "<Changelog>", href: "/changelog" }
      - heading: "<Company>"
        links:
          - { label: "<About>", href: "/about" }
          - { label: "<Blog>", href: "/blog" }
          - { label: "<Contact>", href: "/contact" }
      - heading: "<Resources>"
        links:
          - { label: "<Docs>", href: "/docs" }
          - { label: "<Help>", href: "/help" }
      - heading: "<Legal>"
        links:
          - { label: "<Privacy>", href: "/privacy" }
          - { label: "<Terms>", href: "/terms" }
    brand_column:
      logo_position: "leading"
      tagline: "{information.project.tagline}"
      social_icons: "{information.social.*}"
    bottom_bar:
      copyright_pattern: "© <YYYY> <{information.project.legal_name}>. All rights reserved."
      language_switcher: false   # true if multilingual
      additional_links: []

  meta_defaults:
    # Reference INFORMATION.md's seo block; only override here for project-specific patterns
    title_pattern: "{information.seo.default_page_title_pattern}"
    description_default: "{information.seo.default_meta_description}"
    og_image_default: "{information.seo.default_og_image}"
    twitter_card_type: "{information.seo.default_twitter_card_type}"
    favicon_paths:
      ico: "{information.assets.favicon.ico}"
      svg: "{information.assets.favicon.svg}"
      apple_touch: "{information.assets.favicon.apple_touch}"

  cookie_banner:
    required: "<true | false — depends on jurisdiction / cookies used>"
    copy: "<We use cookies to improve your experience. <link>Learn more</link>>"
    actions: ["Accept all", "Reject non-essential", "Manage preferences"]

# ═══════════════════════════════════════════════════════════════
# PAGES — every page's exact copy, layout, and section sequence
# ═══════════════════════════════════════════════════════════════
# This is where the entire website's text lives. For each page in `sitemap`,
# duplicate the page template below and fill EVERY content slot with the
# final, brand-voice copy. The AI consuming this file renders the copy
# exactly as written — no paraphrasing, no summarizing, no "improving."
#
# Guidance inside slots (e.g., "≤44 chars, one sharp value claim") describes
# what KIND of copy to write. Replace it with the actual sentence the user
# will read on the page.
#
# Use DESIGN.md vocabulary for section types and component names.
# Use INFORMATION.md audience to write copy that resonates with the primary
# persona, and INFORMATION.md voice principles to maintain consistency.

pages:

  # ─── HOME PAGE ───
  home:
    route: "/"
    purpose: "<one-sentence purpose — e.g., 'Convert visitors to sign up or schedule a demo'>"
    primary_persona: "{information.audience.primary_persona.name}"
    meta:
      title: "<override default — typically '{{brand_name}} — {{tagline}}'>"
      description: "<page-specific 150-160 char description>"
      og_image: "<page-specific image or omit to use default>"
      canonical: "<URL>"
      robots: "index, follow"

    # Section sequence — uses DESIGN.md canonical landing composition
    # Override the default order only with clear justification
    sections:

      - type: "hero"
        variant: "{design.options.hero_variant}"   # centered | split-asymmetric | background-led
        content:
          eyebrow: "<optional 2-4 word overline — sentence|UPPERCASE per design>"
          headline: "<≤44 chars, brand voice, one sharp value claim>"
          subhead: "<1-2 sentences, body-lg, expands the headline>"
          cta_primary: { label: "<Start free>", href: "<URL>" }
          cta_secondary: { label: "<Watch demo>", href: "<URL or modal trigger>" }
          trust_marker: "<optional: 'No credit card required' or '<logo wall row>'>"
        media:
          type: "<illustration | screenshot | product-ui | video | animation | none>"
          asset: "<path/url or n/a>"
          alt: "<descriptive alt text for accessibility>"
          motion: "<static | scroll-pinned | autoplay-loop | rive-interactive>"

      - type: "social-proof-logo-wall"
        content:
          intro_line: "<optional — 'Trusted by teams at'>"
          logos:
            - { name: "<Company>", asset: "<path/url>" }
            - { name: "<Company>", asset: "<path/url>" }
          motion: "<static | slow-marquee>"

      - type: "narrative-pair"
        direction: "left-text-right-media"
        content:
          eyebrow: "<optional>"
          headline: "<heading-md scale — one-thought, max ~10 words>"
          body: "<2-4 sentence elaboration in brand voice>"
          cta: { label: "<optional inline link CTA>", href: "<URL>" }
          media:
            type: "<screenshot | illustration | data-viz | video>"
            asset: "<path/url>"
            alt: "<alt text>"

      - type: "narrative-pair"
        direction: "right-text-left-media"
        content:
          # same shape as above; alternates direction
          headline: "<…>"
          body: "<…>"
          media:
            type: "<…>"
            asset: "<…>"

      - type: "bento-grid"
        # Use when ≥4 co-equal features need showcasing
        content:
          eyebrow: "<optional>"
          headline: "<section headline — heading-md or display-lg>"
          subhead: "<optional 1-sentence intro>"
          cells:
            - size: "6"                  # of 12 grid units
              title: "<feature name>"
              body: "<1-2 sentence description>"
              media: "<path/url or n/a>"
            - size: "6"
              title: "<…>"
              body: "<…>"
              media: "<…>"
            - size: "4"
              title: "<…>"
              body: "<…>"
              media: "<…>"
            - size: "4"
              title: "<…>"
              body: "<…>"
              media: "<…>"
            - size: "4"
              title: "<…>"
              body: "<…>"
              media: "<…>"

      - type: "testimonial"
        variant: "single-quote"   # single-quote (premium) | carousel
        content:
          quote: "<one strong customer quote — 1-2 sentences>"
          attribution:
            name: "<Customer Name>"
            title: "<Role, Company>"
            photo: "<path/url — real person, not stock>"

      - type: "final-cta-band"
        content:
          eyebrow: "<optional>"
          headline: "<close-with-conviction headline, ≤8 words>"
          subhead: "<optional reassurance>"
          cta_primary: { label: "<Start free>", href: "<URL>" }
          cta_secondary: { label: "<Talk to sales>", href: "<URL or n/a>" }
          background: "<surface.subtle | surface.raised | primary-tinted>"

    analytics_events:
      # Conversion events to fire on this page
      - event_name: "<homepage_viewed>"
        trigger: "page_load"
      - event_name: "<homepage_primary_cta_clicked>"
        trigger: "click_cta_primary"
      - event_name: "<homepage_demo_requested>"
        trigger: "click_cta_secondary"

  # ─── PRICING PAGE ───
  pricing:
    route: "/pricing"
    purpose: "<convert evaluators to paid signups or trigger sales contact>"
    primary_persona: "{information.audience.primary_persona.name}"
    meta:
      title: "<override>"
      description: "<page-specific>"
      og_image: "<…>"
      canonical: "<URL>"

    sections:

      - type: "hero"
        variant: "centered"
        content:
          headline: "<one-line value claim about pricing — e.g., 'Pricing that grows with you'>"
          subhead: "<1 sentence reassurance>"
          billing_toggle:
            options: ["Monthly", "Yearly"]
            default: "Yearly"
            yearly_discount_label: "<Save 20%>"

      - type: "pricing-table"
        variant: "card-row"          # card-row | comparison-matrix | feature-by-feature
        tiers:
          - name: "<Free>"
            price:
              monthly: "$0"
              yearly: "$0"
            description: "<1-sentence positioning>"
            cta: { label: "<Start free>", href: "/signup", variant: "outline" }
            features:
              - "<feature line>"
              - "<feature line>"
          - name: "<Pro>"
            featured: true            # the recommended tier
            price:
              monthly: "$<X>"
              yearly: "$<Y> /mo"
            description: "<1-sentence positioning>"
            cta: { label: "<Start free trial>", href: "/signup?plan=pro", variant: "primary" }
            features:
              - "<feature line>"
              - "<feature line>"
          - name: "<Enterprise>"
            price:
              monthly: "Custom"
              yearly: "Custom"
            description: "<1-sentence positioning>"
            cta: { label: "<Talk to sales>", href: "/contact", variant: "outline" }
            features:
              - "<feature line>"

      - type: "feature-comparison-matrix"
        # Optional — only if buyers need detailed feature-by-feature comparison
        groups:
          - heading: "<Core features>"
            features:
              - { name: "<Feature A>", free: "✓", pro: "✓", enterprise: "✓" }
              - { name: "<Feature B>", free: "—", pro: "✓", enterprise: "✓" }

      - type: "faq"
        items:
          - question: "<Can I change plans later?>"
            answer: "<answer in 2-3 sentences, brand voice>"
          - question: "<What payment methods do you accept?>"
            answer: "<…>"
          - question: "<Do you offer refunds?>"
            answer: "<…>"

      - type: "final-cta-band"
        content:
          headline: "<close>"
          cta_primary: { label: "<Start free>", href: "/signup" }

    analytics_events:
      - event_name: "<pricing_viewed>"
        trigger: "page_load"
      - event_name: "<pricing_tier_selected>"
        trigger: "click_cta_primary"
        properties: { tier: "<Free|Pro|Enterprise>" }
      - event_name: "<billing_toggle_changed>"
        trigger: "toggle_yearly_monthly"

  # ─── ABOUT PAGE ───
  about:
    route: "/about"
    purpose: "<build trust through team + mission storytelling>"
    sections:
      - type: "hero"
        variant: "centered"
        content:
          headline: "<mission-driven headline>"
          subhead: "<the why behind the company>"
      - type: "long-form-prose"
        content: "<2-4 paragraphs of origin story — uses {information.brand.story.origin} as raw material>"
      - type: "team-grid"
        members:
          # Pulled from {information.people.founders} and {information.people.team}
          - name: "{information.people.founders[0].name}"
            role: "{information.people.founders[0].role}"
            bio: "{information.people.founders[0].bio}"
            photo: "<path/url>"
      - type: "values-list"
        # Pulled from {information.brand.values}
        items:
          - heading: "{information.brand.values[0]}"
            body: "<1-2 sentence elaboration>"
      - type: "final-cta-band"
        content:
          headline: "<join us / try it / etc.>"

  # ─── CONTACT PAGE ───
  contact:
    route: "/contact"
    purpose: "<route inquiries to the right channel>"
    sections:
      - type: "hero"
        variant: "centered"
        content:
          headline: "<Get in touch>"
          subhead: "<reassuring 1-sentence intro>"
      - type: "contact-options"
        options:
          - { channel: "<Email>", value: "{information.operations.email.from_address_default}", icon: "mail" }
          - { channel: "<Sales>", value: "<sales@…>", icon: "briefcase" }
          - { channel: "<Support>", value: "<support@…>", icon: "life-buoy" }
      - type: "contact-form"
        form_id: "general_contact"     # references forms.* below

  # ─── BLOG INDEX ───
  blog:
    route: "/blog"
    purpose: "<thought leadership / SEO / community>"
    sections:
      - type: "hero"
        variant: "centered"
        content:
          headline: "<Blog headline / category name>"
          subhead: "<1-sentence intro>"
      - type: "post-grid"
        layout: "3-column"
        per_post:
          - cover_image
          - category_tag
          - title
          - excerpt
          - author + date
          - read_time
      - type: "pagination"

  blog_post:
    # Template for individual blog posts — generated dynamically per post
    route: "/blog/[slug]"
    purpose: "<single post detail>"
    sections:
      - type: "post-header"
        content:
          category_tag: "<…>"
          title: "<post title>"
          subhead: "<optional>"
          author: { name: "<…>", photo: "<…>", role: "<…>" }
          published_date: "<ISO date>"
          read_time_min: "<5>"
          cover_image: "<path/url>"
      - type: "long-form-prose"
        content_source: "MDX content"
      - type: "related-posts"
        count: 3
      - type: "newsletter-signup"
        form_id: "newsletter"
      - type: "comments"
        enabled: "<true | false>"

  # ─── 404 PAGE ───
  "404":
    route: "/404"
    purpose: "<help lost users get back on track>"
    sections:
      - type: "centered-message"
        content:
          eyebrow: "<404>"
          headline: "<We couldn't find that page.>"
          subhead: "<It might have moved, or the link might be wrong.>"
          actions:
            - { label: "<Go home>", href: "/", variant: "primary" }
            - { label: "<Search docs>", href: "/docs", variant: "outline" }

  # ─── 500 PAGE ───
  "500":
    route: "/500"
    purpose: "<own the error, reassure, give recovery path>"
    sections:
      - type: "centered-message"
        content:
          eyebrow: "<500>"
          headline: "<Something went wrong on our end.>"
          subhead: "<We've been notified and we're looking into it. Try again in a moment, or contact support if it persists.>"
          actions:
            - { label: "<Try again>", href: "javascript:location.reload()", variant: "primary" }
            - { label: "<Contact support>", href: "{information.operations.support.docs_url}", variant: "outline" }

# ═══════════════════════════════════════════════════════════════
# VOICE SAMPLES — real sentences in the brand voice
# ═══════════════════════════════════════════════════════════════
# AI mimics these. The more concrete, the better.
# Source: {information.brand.voice_principles} elaborated into actual sentences.

voice_samples:
  marketing_headlines:
    - "<actual on-brand marketing headline — 5-10 words>"
    - "<another>"
    - "<another>"
  product_microcopy:
    - "<actual on-brand button label — 1-3 words>"
    - "<actual on-brand empty-state message — 1 sentence>"
    - "<actual on-brand success toast — 1 sentence>"
  error_messages:
    - "<actual on-brand error message — what happened + how to fix>"
    - "<another>"
  long_form:
    - "<a paragraph of brand-voice long-form prose — used for About / mission pages>"

# ═══════════════════════════════════════════════════════════════
# VOCABULARY — project-specific word choices
# ═══════════════════════════════════════════════════════════════
# Extends {information.brand.vocabulary} with page-level term preferences.

vocabulary:
  preferred_terms:
    # Format: "use this → not this"
    - "{information.brand.vocabulary.preferred_terms}"   # inherit from INFORMATION.md
    # Add project-specific terms here:
    - "<workspace → not 'account'>"
    - "<members → not 'users'>"
  brand_capitalization:
    # How specific terms are cased (e.g., "macOS" not "MacOS")
    - "<{project.name} — never abbreviated>"
    - "<API (all caps)>"
  number_format: "{information.brand.vocabulary.number_format or 'contextual'}"   # short | long | contextual

# ═══════════════════════════════════════════════════════════════
# PROOF POINTS — concrete metrics + social proof to weave through copy
# ═══════════════════════════════════════════════════════════════

proof_points:
  trust_metrics:
    # Real, verifiable numbers — never invent these
    - "<10,000+ active teams>"
    - "<$X processed monthly>"
    - "<99.99% uptime>"
  notable_customers:
    # Customer logos for social proof — get permission before using
    - { name: "<Company>", logo: "<path/url>" }
  testimonial_library:
    # Pool of approved customer quotes — pages reference these
    - id: "testimonial_1"
      quote: "<actual customer quote>"
      attribution: { name: "<…>", role: "<…>", company: "<…>", photo: "<path/url>" }
  press_mentions:
    - { publication: "<…>", quote: "<…>", url: "<URL>" }

# ═══════════════════════════════════════════════════════════════
# FORMS — every form on the site
# ═══════════════════════════════════════════════════════════════

forms:

  general_contact:
    purpose: "<route general inquiries>"
    fields:
      - name: "name"
        label: "<Your name>"
        type: "text"
        required: true
        placeholder: "<Jane Doe>"
        validation: { min_length: 2 }
        error_messages:
          required: "<Please enter your name.>"
          min_length: "<Name is too short.>"
      - name: "email"
        label: "<Email address>"
        type: "email"
        required: true
        placeholder: "<jane@example.com>"
        autocomplete: "email"
        validation: { pattern: "email" }
        error_messages:
          required: "<We need an email to reply.>"
          pattern: "<That doesn't look like a valid email.>"
      - name: "message"
        label: "<How can we help?>"
        type: "textarea"
        required: true
        placeholder: "<Tell us a bit about what you're looking for…>"
        validation: { min_length: 20 }
    submit:
      label: "<Send message>"
      variant: "primary"
    success_state:
      type: "inline"
      title: "<Got it.>"
      body: "<We'll get back to you within 1 business day.>"
    error_state:
      type: "inline"
      message: "<Couldn't send your message. Try again, or email us directly at {information.operations.email.from_address_default}.>"

  newsletter:
    purpose: "<grow email list>"
    fields:
      - name: "email"
        label: "<Email>"
        type: "email"
        required: true
        placeholder: "<you@example.com>"
        autocomplete: "email"
    submit:
      label: "<Subscribe>"
      variant: "primary"
    success_state:
      type: "inline-replace"
      message: "<Subscribed. Check your inbox for a welcome note.>"
    error_state:
      message: "<Couldn't subscribe right now. Try again in a moment.>"

  sign_up:
    purpose: "<account creation>"
    fields:
      - name: "email"
        label: "<Work email>"
        type: "email"
        required: true
        autocomplete: "email"
      - name: "password"
        label: "<Password>"
        type: "password"
        required: true
        autocomplete: "new-password"
        validation: { min_length: 8 }
        helper_text: "<8+ characters, mix of letters and numbers>"
        show_hide_toggle: true
    social_auth:
      - { provider: "Google", label: "<Continue with Google>" }
      - { provider: "GitHub", label: "<Continue with GitHub>" }
    submit:
      label: "<Create account>"
      variant: "primary"
    legal_consent: "<By creating an account, you agree to our <link>Terms</link> and <link>Privacy Policy</link>.>"
    success_redirect: "/onboarding"

  sign_in:
    purpose: "<authentication>"
    fields:
      - name: "email"
        label: "<Email>"
        type: "email"
        autocomplete: "email"
      - name: "password"
        label: "<Password>"
        type: "password"
        autocomplete: "current-password"
        show_hide_toggle: true
    forgot_password_link: { label: "<Forgot password?>", href: "/password/reset" }
    submit:
      label: "<Sign in>"
      variant: "primary"
    sign_up_link: "<Don't have an account? <link>Sign up</link>>"

  password_reset_request:
    purpose: "<initiate password reset>"
    fields:
      - name: "email"
        label: "<Email>"
        type: "email"
        autocomplete: "email"
    submit: { label: "<Send reset link>", variant: "primary" }
    success_state:
      message: "<Check your inbox. If <email> has an account, you'll get a reset link shortly.>"

# ═══════════════════════════════════════════════════════════════
# SYSTEM MESSAGES — toast / banner / inline copy library
# ═══════════════════════════════════════════════════════════════

system_messages:
  success:
    saved: "<Saved.>"
    copied: "<Copied to clipboard.>"
    sent: "<Sent.>"
    deleted: "<Removed.>"
    subscribed: "<Subscribed.>"
  info:
    syncing: "<Syncing…>"
    network_slow: "<Connection is slow.>"
  warning:
    unsaved_changes: "<You have unsaved changes.>"
    quota_near_limit: "<You're approaching your plan limit.>"
  error:
    generic: "<Something went wrong. Try again, or contact support if it persists.>"
    network: "<Couldn't connect. Check your internet and try again.>"
    permission_denied: "<You don't have permission to do that.>"
    not_found: "<We couldn't find what you were looking for.>"
    rate_limited: "<Too many attempts. Wait a moment and try again.>"

# ═══════════════════════════════════════════════════════════════
# TRANSACTIONAL EMAIL — copy for every system email
# ═══════════════════════════════════════════════════════════════
# Each email has: subject, preview text (preheader), body. Use {{variables}}
# (Mustache-style) for personalization. Brand voice per {information.brand.voice_principles}.

emails:

  welcome:
    trigger: "user_signed_up"
    subject: "<Welcome to {{brand_name}}>"
    preview: "<Get started in 3 steps>"
    body_template: |
      <Hi {{first_name}},>

      <Welcome to {{brand_name}}. Here's how to get started:>

      <1. <first action — e.g., Connect your first project></1>
      <2. <second action></2>
      <3. <third action></3>

      <If you get stuck, just reply to this email — we read every one.>

      <{{sender_name}}>
    cta: { label: "<Get started>", href: "<URL>" }
    from: "{information.operations.email.from_address_default}"
    reply_to: "<…>"

  password_reset:
    trigger: "password_reset_requested"
    subject: "<Reset your {{brand_name}} password>"
    preview: "<This link expires in 1 hour.>"
    body_template: |
      <Hi,>

      <Click the link below to reset your password. The link expires in 1 hour.>

      <If you didn't request this, ignore this email — your account stays safe.>
    cta: { label: "<Reset password>", href: "<reset URL with token>" }

  email_verification:
    trigger: "email_verification_required"
    subject: "<Confirm your email>"
    preview: "<Just one click to finish setup.>"
    body_template: |
      <Hi {{first_name}},>

      <Click below to confirm your email and finish setting up your account.>
    cta: { label: "<Confirm email>", href: "<verification URL>" }

  invoice_receipt:
    trigger: "payment_succeeded"
    subject: "<Your {{brand_name}} receipt — {{amount}}>"
    preview: "<Thanks for your payment.>"
    body_template: |
      <Hi {{first_name}},>

      <Here's your receipt for {{amount}} ({{plan_name}}).>

      <Receipt ID: {{receipt_id}}>
      <Period: {{start_date}} – {{end_date}}>

      <You can view and download all invoices anytime in your account.>
    cta: { label: "<View invoices>", href: "<billing URL>" }

  trial_ending:
    trigger: "trial_3_days_remaining"
    subject: "<Your trial ends in 3 days>"
    preview: "<Pick a plan to keep going.>"
    body_template: |
      <Hi {{first_name}},>

      <Your {{brand_name}} trial ends in 3 days. Pick a plan to keep your data and your workflow going.>
    cta: { label: "<See plans>", href: "/pricing" }

  account_deleted:
    trigger: "account_deletion_complete"
    subject: "<Your {{brand_name}} account has been deleted>"
    body_template: |
      <Hi {{first_name}},>

      <We've deleted your account and all your data. We're sorry to see you go.>

      <If you change your mind, you're always welcome back.>

# ═══════════════════════════════════════════════════════════════
# LEGAL PAGES — structural outlines (full text typically lawyered)
# ═══════════════════════════════════════════════════════════════

legal_pages:

  privacy:
    last_updated: "<YYYY-MM-DD>"
    sections:
      - "<Information we collect>"
      - "<How we use information>"
      - "<How we share information>"
      - "<Data retention>"
      - "<Your rights and choices>"
      - "<Cookies and tracking>"
      - "<Children's privacy>"
      - "<International data transfers>"
      - "<Changes to this policy>"
      - "<Contact us>"
    jurisdiction_notes:
      gdpr: "{information.legal.compliance_requirements contains 'GDPR'}"
      ccpa: "{information.legal.compliance_requirements contains 'CCPA'}"

  terms:
    last_updated: "<YYYY-MM-DD>"
    sections:
      - "<Acceptance of terms>"
      - "<Use of the service>"
      - "<Accounts>"
      - "<Billing and payments>"
      - "<Intellectual property>"
      - "<User content>"
      - "<Acceptable use>"
      - "<Termination>"
      - "<Disclaimers and limitation of liability>"
      - "<Governing law>"
      - "<Changes to terms>"
      - "<Contact>"

  cookies:
    required: "{information.legal.compliance_requirements contains 'GDPR' or 'CCPA'}"
    last_updated: "<YYYY-MM-DD>"
    sections:
      - "<What cookies we use>"
      - "<Why we use cookies>"
      - "<How to control cookies>"

# ═══════════════════════════════════════════════════════════════
# ANALYTICS — events to track + naming conventions
# ═══════════════════════════════════════════════════════════════

analytics:
  provider: "<PostHog | Plausible | Mixpanel | GA4 | n/a>"
  naming_convention:
    pattern: "snake_case"      # snake_case | dot.case | camelCase
    structure: "<object>_<action>"   # e.g., 'signup_started', 'pricing_viewed'
  global_properties:
    # Properties attached to every event
    - "user_id (if authenticated)"
    - "session_id"
    - "page_path"
    - "referrer"
  conversion_funnels:
    primary_funnel:
      name: "<sign-up>"
      steps:
        - "homepage_viewed"
        - "signup_started"
        - "signup_completed"
        - "onboarding_completed"
        - "first_meaningful_action"
  privacy:
    respect_dnt: true            # honor Do Not Track header
    cookie_consent_required: "{information.legal.compliance_requirements contains 'GDPR'}"
    ip_anonymization: true

# ═══════════════════════════════════════════════════════════════
# ACCESSIBILITY — page-level notes (universal floor lives in DESIGN.md)
# ═══════════════════════════════════════════════════════════════

a11y_notes:
  per_page:
    home:
      heading_structure: "<h1> in hero only; <h2> per section"
      lang_attribute: "{information.seo.default_locale}"
      skip_to_main: true
    pricing:
      pricing_table_aria: "use proper <table> with <caption> for screen readers"
    blog_post:
      reading_order: "ensure logical DOM order matches visual order"
  global:
    keyboard_nav: "every interactive element keyboard-reachable; tab order matches visual order"
    focus_indicators: "use {design.states.focus_ring} (never remove)"
    aria_live_regions: "toasts use role='status' polite; errors use role='alert' assertive"

---

# How to use this template

`SPEC.md` is the **content + layout source of truth** for a web project. It declares every page, what's on it, in what order, with what copy. It uses `DESIGN.md`'s vocabulary (section types, components) and `INFORMATION.md`'s context (audience, voice, defaults) — never restates them.

**Instantiation steps:**

1. Copy this file to your project as `SPEC.md`.
2. Update the `sitemap` to match your actual pages.
3. For each page in the sitemap, duplicate the page template under `pages.*` and fill it in.
4. Fill the `voice_samples` with **real sentences** in the brand voice (the more concrete, the better — AI mimics these directly).
5. Fill the `forms`, `system_messages`, `emails`, `analytics` blocks.
6. Verify with `grep -n "<[^>]*>" SPEC.md` — zero matches.
7. Hand `SPEC.md` alongside `DESIGN.md` and `INFORMATION.md` to any AI tool building your site.

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
> If `PROJECT.md` is present, use its full Interactive Population Protocol instead. The block below is the single-template fallback scoped to `SPEC.md` alone.
>
> **Partial-fill state — audit BEFORE producing PART 1:** Read the file in full, then walk every must-fill item. For each, classify as filled / suspected-stub / unfilled using BOTH mechanical patterns AND semantic reasoning:
> - **Mechanical (unfilled):** still wrapped in `<...>` placeholder syntax, empty string / null, just `?`, contains `TBD` / `TODO` / `FIXME` (case-insensitive), or a list below its declared minimum cardinality (e.g., "3-5 trust metrics" → 2 items = unfilled).
> - **Semantic (suspected stub):** value passes the mechanical checks but looks like a leftover example — known stubs like "Acme Labs", "example.com", "John Doe", "Lorem ipsum"; generic placeholder language like "Insert your tagline here"; one-word filler in slots needing real content; or contextually inconsistent with other filled values.
> - **Definitively filled:** specific to this brand, contextually coherent, meets cardinality + sub-field requirements.
>
> Include unfilled items in PART 1 as-is. Include suspected stubs in PART 1 with confirmation framing. Exclude definitively-filled items.
>
> When in doubt, INCLUDE in PART 1 with confirmation framing rather than silently treating as filled.
>
> **No brand context provided:** Still produce the intake exactly as below — leave `?` markers.
>
> **Special note for SPEC.md:** This file is the canonical source of every word that appears on the website. The intake covers structural decisions; the actual per-page copy is gathered through a follow-up loop after intake — too much content for a single form.

### OUTPUT THIS BLOCK VERBATIM when triggered (do not paraphrase, do not summarize, do not rewrite)

```
# Intake — SPEC.md (web)

This is everything you need to decide to fully populate your site content + layout spec. Each item has a short plain-English hint after the em dash.

**How to answer:**
- **All at once** — reply with answers numbered, freeform, or both. I'll figure it out.
- **One at a time** — say "let's go one at a time" and I'll walk you through each question, waiting for your answer before moving on.
- For PART 2, accept the defaults or list overrides.

After we lock the structure, I'll loop with you page-by-page to collect the actual copy.

## PART 1 — Must Fill (no defaults possible)

### Brand essentials
1. **Brand name** — what people call your product: ?
2. **One-line product description** — one sentence: what it does, for whom. Also used as default OG/social-share description: ?
3. **Primary audience persona name** — your main user's name. Pulled from INFORMATION.md if present; otherwise just give a name: ?

### Sitemap
4. **Pages list** — every top-level page the site has. E.g., home, pricing, about, blog, contact, plus any product/feature pages. Mark which appear in **top nav** and **footer**: ?
5. **Authentication area?** — does the site have user accounts? yes/no. If yes, I'll add `/login`, `/signup`, `/password/reset`: ?
6. **Blog?** — does the site have a blog? yes/no. If yes, I'll add `/blog` index + `/blog/[slug]` dynamic routes: ?

### Global elements (nav, CTAs, footer)
7. **Top nav link labels** — in order, left to right. E.g., "Product, Pricing, Customers, Blog": ?
8. **Primary CTA** — label + destination URL. The main "do this" button on every page. E.g., "Start free → /signup": ?
9. **Secondary CTA** — label + destination URL. The "I'm not ready yet" button. E.g., "Sign in → /login": ?
10. **Footer columns** — heading + 3-6 link labels per column. Typical structure: Product / Company / Resources / Legal: ?

### Voice + vocabulary *(the "AI mimics these" inputs)*
11. **5-10 voice samples** — actual headlines, button labels, error messages, or long-form prose written in your brand's voice. The AI uses these to mimic your tone everywhere. Say **"draft them"** if you'd rather I propose drafts from INFORMATION.md for your approval: ?
12. **Vocabulary preferences** — preferred terms + banned terms. E.g., "members" not "users", "create" not "make", never "leverage": ?
13. **Brand capitalization rules** — proper-noun casing the AI must respect. E.g., "GitHub" not "Github", "API" all caps, brand name never abbreviated: ?

### Proof points
14. **3-5 trust metrics** — real, verifiable numbers for social proof. E.g., "10,000+ teams", "$1.9T processed". Say **"none yet"** if pre-launch: ?
15. **Notable customer logos** — companies you can name (with their permission): ?
16. **Testimonials** — approved customer quotes with attribution (name, title, company): ?

### Forms
17. **Forms on the site** — which forms exist (contact, newsletter, sign-up, sign-in, password-reset, custom). For each: fields + validation rules + success message + error copy. Defaults are pre-filled in the template — tell me which to use as-is and which to customize: ?

### Transactional emails *(if applicable)*
18. **Email templates** to include — check which apply: welcome / password-reset / email-verification / invoice-receipt / trial-ending / account-deleted: ?
19. **From-address** *(the email senders see — e.g., hello@brand.com)* + **support email** *(where replies go)*: ?

### Legal pages
20. **Legal entity name** — full registered company name for copyright footer. E.g., "Acme Labs, Inc.": ?
21. **Compliance jurisdiction** — drives cookie banner + privacy policy scope: GDPR *(EU users)* / CCPA *(California users)* / both / neither: ?

### Analytics
22. **Analytics provider** — PostHog *(product analytics)* / Plausible *(privacy-friendly)* / Mixpanel / GA4 *(Google)* / n/a: ?
23. **Conversion events to track** — the funnel steps that matter. E.g., `homepage_viewed → signup_started → signup_completed → first_action`: ?

## PART 2 — Customizable Defaults (accept or override)

Most SPEC defaults flow from DESIGN.md and INFORMATION.md automatically. The few SPEC-specific options:

- **Hero variant** — homepage hero layout: **split-asymmetric** ← centered / split-asymmetric *(text left, image right)* / background-led *(full-bleed image)*
- **Toast position** — where notifications appear: **top-right** ← top-right / top-center / bottom-right / bottom-center
- **Footer style** — page footer: **multi-column** ← multi-column *(link directory)* / minimal *(legal + a few links only)*
- **Time format** — how times display: **hybrid** ← relative *("2h ago")* / absolute *("Mar 5")* / hybrid *(relative ≤7d, absolute after)*
- **Number abbreviation** — large number format: **contextual** ← short *(1.2K)* / long *(1,200)* / contextual

## PART 3 — When you reply (and what happens after)

I'll:
1. Apply your PART 1 + PART 2 answers to SPEC.md structurally
2. If you said "draft them" for voice samples, draft 8-10 from INFORMATION.md (or your provided voice descriptor) and surface for approval BEFORE committing
3. Fill default form / system message / email copy from the template's library
4. Then loop with you **page-by-page** to collect the actual copy (hero headline + subhead + CTAs, narrative section content, bento cells, testimonials, etc.). I'll go in priority order: homepage → pricing → about → contact → blog → others.
5. Run the 5-pattern verification: (a) `grep -n "<[^>]*>" SPEC.md` for placeholders, (b) `grep -niE "\bTBD\b|\bTODO\b|\bFIXME\b" SPEC.md` for plain-text deferrals, (c) `grep -nE ': *""\s*$|: *\?\s*$|: *null\s*$' SPEC.md` for empty values, (d) stub scan for common surviving examples, (e) cardinality + semantic-reasoning check on each list slot (voice samples ≥5; trust metrics ≥3 or "none yet"; footer columns ≥3; etc.)
6. Report: ✅ filled count, ⚠️ remaining (with reason per item), 🤔 suspected stubs needing confirmation, 📝 user-deferred items. If anything sits in "remaining" or "suspected stubs", do NOT declare complete
7. Offer next steps (write the legal page outlines, generate Next.js page scaffolds matching the section sequence, etc.)
```

The AI MUST produce this output in full (or, if filling a partially-populated SPEC.md, EXCLUDE already-filled items from PART 1 and only ask about gaps). Never improvise the format.

---

# AI Agent Contract

When generating any page, copy, form, email, or content from this document, an AI agent **must** follow these rules:

1. **`SPEC.md` is canonical for page content, layout, AND every word of copy.** Every page's section sequence and every word that appears on the website lives here. Section sequences declared here override DESIGN.md's canonical defaults. **Copy declared here is the final text that ships** — never paraphrase, summarize, rewrite, or "improve" declared copy. Render it exactly as written, character-for-character. If a content slot still contains placeholder guidance (e.g., `"<≤44 chars, one sharp value claim>"`), surface the gap to the human — don't invent the copy yourself.
2. **Reference DESIGN.md vocabulary for visual choices.** When a section type is named (`hero`, `bento-grid`, `narrative-pair`), look up its spec in DESIGN.md. Don't invent new section types.
3. **Reference INFORMATION.md for brand voice and audience.** When generating new copy that isn't pre-written here, anchor to the brand voice principles and primary persona declared there.
4. **Mimic voice_samples.** When generating new copy, the cadence, vocabulary, and tone must match the `voice_samples`. Don't invent a different voice.
5. **Never invent metrics or proof points.** Only use numbers from `proof_points.trust_metrics`. If a needed number isn't there, ask — don't fabricate.
6. **Form copy is final.** When generating form code, use the labels, placeholders, helper text, and error messages exactly as written. Don't rephrase to "improve" them.
7. **Email copy is the design.** Transactional emails are part of the product UX, not technical artifacts. Render them with the same care as a landing page hero.
8. **Analytics events are part of the spec.** When generating component code, wire up the analytics events declared per-page. Naming follows the declared convention.
9. **Legal pages need lawyer-reviewed text.** Generate the structural outline declared here, but never invent legal language. Use a placeholder ("[legal text TBD]") and flag for human review.
10. **A11y notes are non-negotiable.** Apply both DESIGN.md's universal a11y floor and the per-page notes here.

---

# How to fill this template well

## Site map

List every public page. Don't try to be exhaustive on day one — start with the pages you're actually building. Add more as the site grows.

Routes use clean URLs: `/pricing` not `/page?id=4`. Nest only when the URL structure reflects real hierarchy: `/features/sso` is fine; `/about/team/jane` is over-nested.

## Pages

Each page block is a contract between you and the AI. Pages with thin specs produce thin output. Pages with rich specs produce premium output. Spend disproportionate time on the homepage and pricing page — they convert.

The `purpose` field is the most important single line. If you can't write a purpose in one sentence, the page doesn't have a clear job. Cut the page or refocus it.

The `primary_persona` is a reference to `{information.audience.primary_persona.name}`. The AI uses it to anchor voice and pain-point framing.

Sections use DESIGN.md vocabulary. If you need a section type not in DESIGN.md, add it there — don't define it ad hoc here.

## Voice samples

The single highest-leverage section of this template. AI generates dramatically better copy when given 5-10 real sentences in the brand voice. Without samples, AI averages toward generic SaaS copy.

Examples of good voice samples:
- "Built for the way modern teams actually ship — fast, with fewer meetings, and zero busywork."
- "Connect your repo. We handle the rest."
- "Couldn't deploy. The build failed on line 47 — fix it and try again."

Examples of useless voice samples:
- "Welcome to our platform." (Generic, no brand identity)
- "We're committed to delivering value." (Corporate-speak)
- "Lorem ipsum…" (Not real copy)

## Forms

Treat forms like product surfaces. Bad form copy is one of the biggest preventable conversion killers. Each form needs:
- Labels that are nouns or short verb-phrases ("Email", "Confirm password" — not "Please enter your email")
- Placeholders that show valid example input ("you@example.com")
- Helper text only when context isn't obvious from the label
- Error messages that are specific and recoverable ("That doesn't look like a valid email" not "Invalid input")

## Emails

Transactional emails are read by every paying user. They're not technical artifacts — they're brand touchpoints. Write them in the same voice as marketing copy. Brief, helpful, human.

Use `{{variables}}` (Mustache-style, double-curly) for personalization: `{{first_name}}`, `{{brand_name}}`, `{{amount}}`. The double-curly disambiguates from design-token refs (which use single-curly `{group.path}`). Document the variables your email system supports.

## Analytics events

Define the events you care about up front. AI wires them into component code automatically when this section is filled.

Use a consistent naming convention. The recommended pattern is `<object>_<action>` in snake_case: `signup_started`, `pricing_viewed`, `cta_clicked`.

## Legal pages

The structural outline is fine in SPEC.md. The actual legal text needs a lawyer — don't have AI generate it. The template marks "[legal text TBD]" so human review is unavoidable.

---

# Anti-patterns — never do this in SPEC.md

- **Don't restate visual rules from DESIGN.md.** Section types, component specs, colors — DESIGN.md owns these.
- **Don't restate brand context from INFORMATION.md.** Audience, voice, mission — INFORMATION.md owns these.
- **Don't invent metrics, testimonials, or customer names.** Only use real, approved proof points.
- **Don't write lorem ipsum.** Either write the real copy or mark `<TBD>` clearly. Lorem ipsum gets shipped accidentally.
- **Don't skip the `purpose` field per page.** A page without a stated purpose is a page that won't convert.
- **Don't ignore mobile layout.** Each page should consider how sections collapse / reorder on mobile (DESIGN.md provides the rules).
- **Don't write generic SaaS copy.** Anchor every sentence in `voice_samples`. If you don't have samples, write them first before writing pages.
- **Don't define new section types ad hoc.** If you need one, add it to DESIGN.md first.
- **Don't omit legal pages.** Even simple sites need privacy + terms. Plan for them from day one.
- **Don't forget transactional email.** Sign-up, password reset, billing — these are part of UX and need brand-voice copy.

---

# Versioning

`template_version: 1.7.0`. Per-project `SPEC.md` instances should preserve this field.

# Source

Part of the `premium-product-templates` family. Companion files: `PROJECT.md` (orchestration), `DESIGN.md` (visual system), `INFORMATION.md` (brand / business context).
