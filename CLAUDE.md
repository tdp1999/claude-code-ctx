# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CTX is a Claude Code plugin that provides a task-driven development workflow through 11 skills in the `/ctx:` namespace. It manages project context via a `.context/` folder with vision, architecture, epics, tasks, and progress tracking. Distributed through the TDP Plugins Marketplace.

## Repository Structure

- `.claude-plugin/marketplace.json` — Marketplace listing metadata
- `plugins/ctx/.claude-plugin/plugin.json` — Plugin manifest (version info)
- `plugins/ctx/skills/` — Skill implementations (each skill is a folder with `SKILL.md`)
- `plugins/ctx/shared/procedures/` — The four setup steps (`context-bank`, `vision`, `architecture`, `techstack`). **Procedures, not skills**: no frontmatter, no slash command. Only `start` and `onboard` read them. Adding a setup step means adding a procedure here, not a skill.
- `plugins/ctx/shared/` — Templates, conventions, and workflows shared across skills
- `plugins/ctx/checklist/` — The Owner's checklist: lanes, lookup table, playbook, profile template. Read by the `checklist` skill, and fetched by raw URL by the portfolio `/checklist` page, so keep paths stable
- `plugins/ctx/references/` — Examples and diagrams

No build system, test suite, or linting — this is a documentation-driven plugin package.

## Key Conventions

### Version Bumping

> Canonical, fuller process (SemVer levels, multi-plugin tagging, releases): **`RELEASING.md`** at the repo root.

When bumping the version, update ALL of these files:
- `plugins/ctx/.claude-plugin/plugin.json` (version field)
- `.claude-plugin/marketplace.json` (version field)
- `plugins/ctx/CHANGELOG.md`
- `plugins/ctx/README.md` (badge/header if applicable)

After committing the version bump, create an annotated git tag:
- Format: `v<version>` (e.g., `v1.1.5`)
- Tag message: one-line summary of the release, e.g., `v1.1.5: Fix marketplace plugin source path`

For major releases (1.0.0, 2.0.0, ...) or when the user requests it, also create a GitHub release:
- Title: `v<version>`
- Body: release notes summarizing all notable changes since the last release (use `git log --oneline <prev-tag>..HEAD` to gather changes)
- Group changes under sections: **Added**, **Changed**, **Fixed**, **Removed** (Keep Changelog format)
- Push the tag (`git push origin v<version>`) and create the release via `gh release create`

### File Contracts Between Skills

Skills depend on each other through specific files in the consumer's `.context/` folder:
- `vision.md` — written by the vision procedure (via start/onboard), read by epic and the architecture/techstack procedures
- `patterns-architecture.md` — written by the architecture procedure (via start/onboard), read by epic/breakdown/task
- `domain.md` — written by domain (and via Domain Impact Protocol from epic/breakdown/task with user confirmation), read by epic/breakdown/task
- `plans/epic-*.md` — written by epic, read by breakdown
- `tasks/*.md` — written by breakdown/create-task, read by task/progress/sync
- `progress.md` — written by breakdown/sync, read by progress/task

When modifying a skill, check `shared/conventions/file-contracts.md` to understand what other skills depend on its output format.

### Naming Conventions

- Tasks: `001-short-name.md` (3-digit sequential)
- Epics: `epic-kebab-case-name.md`

### Status Lifecycles

- **Tasks**: pending → in-progress ↔ blocked → done (archived to `tasks-done/<epic-name>/`). The `## Status:` line holds one bare token and nothing else.
- **Epics**: draft → ready → broken-down → completed (archived to `plans-done/`). There is no epic-level `in-progress`; an epic stays `broken-down` while its tasks are worked on.
