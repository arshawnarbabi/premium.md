---
# ─────────────────────────────────────────────────────────────
# DECISIONS_TEMPLATE.md — Decision log (append-only; AI-maintained)
# Version: 1.23.0
# Scope: any project. The short record of WHY the locked choices are locked, so a
#        fresh agent (or teammate) doesn't relitigate settled decisions next session.
# Companions: PROJECT.md (the contract rule that says to read + append here).
#
# WHAT THIS FILE IS:
# A lightweight ADR (Architecture Decision Record) log, adapted for agentic work.
# Every non-trivial, locked decision — a color direction, a framework, a positioning
# call, "we deliberately are NOT doing X" — gets one append-only entry with its
# rationale. Without it, each new session re-asks questions the human already answered.
#
# HOW TO USE:
# 1. Copy this file to your project as `DECISIONS.md` and delete the example entry.
# 2. The AI APPENDS an entry whenever a decision is locked (never edits past entries;
#    to reverse one, append a NEW entry that supersedes it and link back).
# 3. The AI READS this file before proposing changes — settled choices stay settled
#    unless the human explicitly reopens them.
# ─────────────────────────────────────────────────────────────

# ─── STATUS MARKERS — every value's state stays trackable (authoritative spec: PROJECT.md → §Status protocol) ───
# An inline comment on a value marks its state; unmarked + filled = "given" (the user's own input).
#   <slot>/<TBD> = unfilled · # draft = AI-inferred, needs approval · # default = out-of-box default,
#   not consciously chosen · # approved = signed off · # locked = approved + logged in DECISIONS.md.
# Rule: the AI never writes an inferred value without `# draft`, nor accepts a default without `# default`
# — so an unmarked filled value is, by construction, the user's. Nothing fabricated slips through unverified.

template_version: "1.23.0"
file_role: "decisions"   # information | design | spec | project | content | seo | qa | decisions

# Append-only. Newest entry at the top. One entry per locked, non-trivial decision.
# Format per entry (keep it tight — this is a log, not an essay):
#
#   ## YYYY-MM-DD — <short decision title>
#   - **Context:** <what prompted the decision; constraints in play>
#   - **Options considered:** <the real alternatives, briefly>
#   - **Choice:** <what was decided>
#   - **Rationale:** <why this option won>
#   - **Consequences:** <what this commits us to / rules out; revisit triggers>
#   - **Status:** locked   # locked | superseded by <date entry> | revisited
#
# Two TYPED entries have extra required fields (examples in the body):
#   Viewport scope    — a size/class removed from QA.md gates.viewport_matrix → `out_of_scope`.
#                       + **Scope:** which sizes · **Covered by:** what the user sees there instead.
#   Performance trade — an effect shipped below its intended tier because the runtime budget failed.
#                       + **Effect / Tier chosen / Measured / Cheaper path looks like** (numbers required).
---

# Decision log

Append-only record of locked, non-trivial decisions and why. A fresh agent reads this **before** proposing changes so it doesn't reopen settled choices. To reverse a decision, append a **new** entry that supersedes the old one (mark the old one `superseded by <date>`) — never rewrite history.

What belongs here: choices that were genuinely decided and would be costly or confusing to relitigate — a brand/color direction, a framework or platform call, a positioning stance, a scope boundary ("we are deliberately **not** building X"), a naming convention. What doesn't: routine slot-filling already captured in the other templates.

## Example entry (delete in your project)

## 2026-05-30 — Surface separation via borders, not shadows
- **Context:** Cards/panels needed a clear separation strategy; the design system supports shadow / border / surface-tone.
- **Options considered:** soft shadow (default), 1px border, raised surface tone.
- **Choice:** 1px border separation (`surface_separation.strategy: border`).
- **Rationale:** Reads cleaner and flatter for a calm, trustworthy product feel; avoids the "floating SaaS card" look.
- **Consequences:** Components author borders not shadows; dark mode uses a lightened border, not a drop shadow. Revisit only if the brand shifts toward a more dimensional aesthetic.
- **Status:** locked

## Entry types with required fields

Most entries use the plain format above. Two kinds of decision come up on every build and carry extra fields, because other files depend on them: QA.md only accepts a viewport in `out_of_scope` when a **Viewport scope** entry exists, and a failed runtime budget (QA Gate B2) is only resolved by a **Performance trade** entry. Title them with the type so they are greppable.

### Example: Viewport scope (delete in your project)

## 2026-05-30 — Viewport scope: phone landscape out of scope
- **Context:** The full-bleed hero and pinned gallery need more height than a phone held sideways has (375–430 px), and the audience browses in portrait.
- **Options considered:** a dedicated landscape layout; letting portrait layout run sideways; a rotate prompt.
- **Choice:** `phone_landscape` (667×375, 844×390, 932×430) goes in QA.md `gates.viewport_matrix.out_of_scope`.
- **Scope:** phones in landscape only (touch, height ≤ 500 px). Tablets in landscape stay IN scope.
- **Covered by:** a full-screen "rotate your phone" prompt over the site in that orientation; it is itself checked at all three sizes.
- **Rationale:** A landscape layout would double the hero work for a small share of visits; the prompt is honest and cheap.
- **Consequences:** Layout findings at those sizes are not filed. Revisit if analytics show landscape phone traffic above ~5%.
- **Status:** locked

### Example: Performance trade (delete in your project)

## 2026-05-30 — Performance trade: hero glass from live blur to pre-blurred image
- **Context:** The hero's frosted-glass panel used `backdrop-filter: blur(24px)` over a moving background (DESIGN `effects.registry` → `hero-glass`).
- **Effect:** `hero-glass`, intended tier: live backdrop-filter.
- **Measured:** p95 frame time 13.2 ms on iPhone 15 Pro at 120 Hz (budget 8.3), 24.1 ms on a mid-tier Android at 60 Hz (budget 16.7), scrolling down and up. Both fail.
- **Tier chosen:** pre-blurred background image under a translucent fill, crossfaded on scroll with `opacity` only (compositor). Measured 6.9 ms / 12.4 ms on the same devices.
- **Cheaper path looks like:** the glass no longer refracts content scrolling beneath it; at rest it is visually identical. Reduced-motion: static panel, no crossfade.
- **Rationale:** The highest-quality version that meets the budget on both devices; the live blur failed on both.
- **Consequences:** Measured numbers recorded in the registry entry. Revisit only if a new device class is added to QA.md `runtime.devices`, with fresh measurements.
- **Status:** locked

# AI Agent Contract (decisions)
1. **Read before proposing or changing.** Consult `DECISIONS.md` before suggesting OR making any change to something it covers.
2. **A request that touches a locked decision is NOT itself authorization to reopen it** — even when phrased as a direct instruction (e.g. "switch the cards to borders," "make it green"). A stakeholder asking for the *change* is not the same as the human explicitly asking to *reopen the locked decision*. Before modifying any file, you MUST: **(a)** surface the locked entry, **(b)** quote its documented rationale, **(c)** ask the human to confirm they intend to supersede it. Implement only after that explicit confirmation — then append a new superseding entry. Do **not** implement in the same turn as the request. (This is the analog of the QA gate: locked decisions are a gate you don't silently pass.)
3. **Append when locked.** When a *new* non-trivial decision is settled, append an entry (Context / Options / Choice / Rationale / Consequences / Status) — same session, while the reasoning is fresh.
4. **Supersede, don't overwrite.** To change a past decision, add a new entry and mark the old one `superseded by <date>`. The log is append-only; never delete or rewrite a prior entry.
5. **Typed entries are mandatory where other files depend on them.** Removing a viewport from QA.md's matrix needs a **Viewport scope** entry; shipping an effect below its intended tier needs a **Performance trade** entry with measured numbers. Write it in the same turn as the change.
6. **Reversals made in code are logged in the same change.** A locked choice undone in code (a token, a layout, a component, copy), after the confirmation rule 2 requires, gets its superseding entry in the same commit as the code; a reversal that exists only in the code or in chat is invisible to the next session. QA Gate H (`check-drift.mjs`) flags code changed with no doc update.

# Versioning
`template_version: 1.23.0`. Per-project `DECISIONS.md` instances should preserve this field.

# Source
ADR (Architecture Decision Record) practice, adapted as an append-only log for agentic builds — so locked choices survive across sessions. Background (finding F11) is in `docs/SYSTEM_RESEARCH.md` (in the premium.md repo, the release zip and the skill bundle).
