---
# ─────────────────────────────────────────────────────────────
# DECISIONS_TEMPLATE.md — Decision log (append-only; AI-maintained)
# Version: 1.21.0
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

template_version: "1.21.0"
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

# AI Agent Contract (decisions)
1. **Read before proposing or changing.** Consult `DECISIONS.md` before suggesting OR making any change to something it covers.
2. **A request that touches a locked decision is NOT itself authorization to reopen it** — even when phrased as a direct instruction (e.g. "switch the cards to borders," "make it green"). A stakeholder asking for the *change* is not the same as the human explicitly asking to *reopen the locked decision*. Before modifying any file, you MUST: **(a)** surface the locked entry, **(b)** quote its documented rationale, **(c)** ask the human to confirm they intend to supersede it. Implement only after that explicit confirmation — then append a new superseding entry. Do **not** implement in the same turn as the request. (This is the analog of the QA gate: locked decisions are a gate you don't silently pass.)
3. **Append when locked.** When a *new* non-trivial decision is settled, append an entry (Context / Options / Choice / Rationale / Consequences / Status) — same session, while the reasoning is fresh.
4. **Supersede, don't overwrite.** To change a past decision, add a new entry and mark the old one `superseded by <date>`. The log is append-only; never delete or rewrite a prior entry.

# Versioning
`template_version: 1.21.0`. Per-project `DECISIONS.md` instances should preserve this field.

# Source
ADR (Architecture Decision Record) practice, adapted as an append-only log for agentic builds — so locked choices survive across sessions. See `docs/SYSTEM_RESEARCH.md` (F11).
