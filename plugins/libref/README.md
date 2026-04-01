# libref — Library & Framework Reference Guides

> Teaches Claude how to correctly use specific tools, libraries, and frameworks within your project conventions.

## Category

**Library & API Reference** — Skills that explain how to correctly use a library, CLI, SDK, or framework, especially project-specific patterns that Claude cannot know from training data alone.

## Skills

| Skill | Triggers | Description |
|---|---|---|
| **stitch** | `stitch`, `design screen`, `generate UI`, `vibe design`, `/stitch` | Google Stitch MCP integration — AI-powered UI design generation, screen editing, design systems, variants |

## Adding a New Skill

1. Create a folder under `skills/<skill-name>/`
2. Add `skill.md` (or `SKILL.md`) with frontmatter: `name`, `description`
3. Add `references/` subfolder for supplementary docs (optional)
4. Register in `plugin.json` if needed
5. Update this README

## Structure

```
libref/
├── .claude-plugin/plugin.json
├── skills/              # One folder per skill
├── shared/
│   └── conventions/     # Error handling, logging
├── CHANGELOG.md
└── README.md
```

## Conventions

- **Error handling**: See `shared/conventions/error-handling.md`
- **Logging**: See `shared/conventions/logging-convention.md` — logs to `${CLAUDE_PLUGIN_DATA}/libref-logs/`
