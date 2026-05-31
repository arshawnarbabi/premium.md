# premium-product — Agent Skill

The **premium-product-templates** system packaged as a cross-tool [Agent Skill](https://agentskills.io) (`SKILL.md`, the open standard). It works in Claude Code, Codex, Gemini CLI, Cursor, Copilot, and other tools that read the standard.

- **`SKILL.md`** — the instructions (hand-authored). This is the only file to edit here.
- **`reference/`** — **generated, do not hand-edit.** It mirrors the repo's canonical `templates/`, `research.md`, and brand-kit scripts so the skill is self-contained (it installs/copies as one unit). Regenerate it after changing any canonical source:

  ```bash
  scripts/build-skill.sh
  ```

## Install

```
npx skills add arshawnarbabi/premium-product-templates --skill premium-product
```

Installs into every detected agent (Claude Code, Codex, Cursor, …). See the repo root [`README.md` → "Install the skill"](../../README.md) for the fallback (git clone + copy) and details.
