# CTX - Context Workflow Plugin

Complete task-driven development workflow for `.context/` folder management.

## Overview

The `ctx` plugin manages project context, plans features, breaks work into tasks, and
tracks progress — all as plain markdown in a `.context/` folder you own and can edit by
hand at any time.

**Namespace**: All skills use the `/ctx:` prefix.

## Quick Start

```bash
# Set up — pick ONE, based on whether the repo already has code
/ctx:start "My project idea"     # new or empty repo
/ctx:onboard                     # repo that already has code

# Plan a feature
/ctx:epic "User authentication"
/ctx:breakdown epic-auth

# Work
/ctx:progress
/ctx:task 001
/ctx:sync
```

## Available Skills

### Setup (2 skills)

| Skill     | Usage                  | Description                                              |
| --------- | ---------------------- | -------------------------------------------------------- |
| `start`   | `/ctx:start [idea]`    | Set up a new project: context bank, vision, architecture, techstack |
| `onboard` | `/ctx:onboard [path]`  | Same files, extracted from an existing codebase           |

Both run the same four steps. They are **procedures** in `shared/procedures/`, not slash
commands — you never invoke `vision`, `architecture`, `techstack`, or `context-bank`
yourself. Re-run `/ctx:start` any time to update one of them.

### Planning (4 skills)

| Skill          | Usage                       | Description                                          |
| -------------- | --------------------------- | ---------------------------------------------------- |
| `epic`         | `/ctx:epic "Feature"`       | Plan a feature, or a defect whose cause is not yet known |
| `breakdown`    | `/ctx:breakdown epic-name`  | Decompose an epic into tasks                         |
| `create-task`  | `/ctx:create-task "…"`      | One standalone task, no epic needed                  |
| `domain`       | `/ctx:domain`               | Capture business logic, flows, rules, and edge cases |

### Execution (3 skills)

| Skill      | Usage                            | Description                                    |
| ---------- | -------------------------------- | ---------------------------------------------- |
| `progress` | `/ctx:progress`                  | View pending, in-progress, blocked, done        |
| `task`     | `/ctx:task [number] [--careful]` | Load a task and work on it                      |
| `sync`     | `/ctx:sync`                      | Reconcile progress.md, archive finished work    |

### Knowledge (2 skills)

| Skill          | Usage                       | Description                  |
| -------------- | --------------------------- | ---------------------------- |
| `log-decision` | `/ctx:log-decision "Topic"` | Record an architecture decision as an ADR |
| `checklist`    | `/ctx:checklist`            | The Owner's phase checklist: lanes S, M, L, lookup table, Claude's playbook |

Eleven skills total.

## Common Workflows

### New Project Setup

```bash
/ctx:start "E-commerce platform"
```

One command. It creates the `.context/` structure first, then walks through vision,
architecture, and techstack, and offers to plan a first epic at the end.

### Onboarding an Existing Project

```bash
/ctx:onboard
```

Reads the codebase — structure, stack, patterns — and drafts the same files for you to
confirm rather than asking you to describe a repo you just joined.

### Feature Development

```bash
/ctx:epic "Payment integration"     # 1. plan
/ctx:breakdown epic-payment         # 2. decompose
/ctx:progress                       # 3. see what's ready
/ctx:task 001                       # 4. work
/ctx:sync                           # 5. reconcile and archive
```

### Bugs and Defects

There is no separate investigation command. Pick by how much you already know:

```bash
# Small — one place to fix, cause already understood
/ctx:create-task "Checkout 500s when the payment key is missing"
/ctx:task 042

# Large — cause unclear, or the fix spans several places
/ctx:epic "Payment gateway configuration"   # the epic carries the investigation
/ctx:breakdown epic-payment-gateway-config
/ctx:task 043
```

See `shared/workflows/bug-flow.md` for how to fill in a bug epic.

## File Structure Created

```
.context/
├── plans/              # Epic files (epic-*.md)
├── tasks/              # Active tasks (001-name.md)
├── tasks-done/         # Archived completed tasks, by epic subfolder
├── plans-done/         # Archived completed epics
├── progress.md         # Status tracker
├── patterns-*.md       # Architecture + code patterns
├── decisions.md        # ADRs
├── domain.md           # Business logic (optional)
└── vision.md           # Project vision
```

Plus `.project-init.md` at the repo root — the technology stack, and the one ctx file
that lives outside `.context/`.

## Philosophy

**Conscious task selection.** No auto-selection, ever. You run `/ctx:progress`, you pick
the number, you run `/ctx:task <number>`.

**Task-driven development.** Everything is a task with acceptance criteria, a complexity
estimate, and a progress log. A task reaches `done` only when every criterion is checked.

**Pragmatic TDD.** Red → Green → Refactor, with verification scaled to the task —
`none` / `test` / `full`, or `--careful` to force full.

**Plain markdown.** No database, no lockfile, no config. Every file is yours to edit.

## Installation

### Option 1: Load from Directory (Development)

```bash
claude --plugin-dir <path-to>/plugins/ctx
```

### Option 2: Install from Marketplace

```bash
claude plugin marketplace add tdp1999/claude-code-ctx
claude plugin install ctx@tdp-plugins --scope user
```

The plugin is then available in all sessions automatically.

## Documentation

- **Workflows**: `shared/workflows/` — feature flow, bug flow
- **Procedures**: `shared/procedures/` — the four setup steps run by start / onboard
- **Templates**: `shared/templates/` — file formats
- **Conventions**: `shared/conventions/` — file contracts, naming, status lifecycle, complexity, ownership (labels and gates), checklist binding
- **Checklist**: `checklist/` — lanes S, M, L, the lookup table, Claude's playbook and the profile template. The portfolio `/checklist` page reads these files through their raw GitHub URL
- **Subagents**: `shared/subagents.md` — when to delegate and to which agent
- **Examples**: `references/examples/` — a complete epic breakdown walkthrough
- **Diagrams**: `references/diagrams/` — workflow map and skill relationships

## Contributing

This plugin follows semantic versioning. See `CHANGELOG.md` for version history.

## License

MIT License - See LICENSE file for details

## Version

Current version: 3.5.0

## Changelog

See `CHANGELOG.md` for detailed version history and migration notes.
