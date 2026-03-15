# CTX - Context Workflow Plugin

Complete task-driven development workflow for `.context/` folder management.

## Overview

The `ctx` plugin provides a unified system for managing project context, planning features, breaking down work into tasks, and tracking progress. It implements a task-driven development workflow that keeps you focused and organized.

**Namespace**: All skills use the `/ctx:` prefix

## Quick Start

```bash
# Setup a new project
/ctx:vision "My project idea"
/ctx:architecture
/ctx:techstack
/ctx:context-init

# Plan a feature
/ctx:epic "User authentication"
/ctx:breakdown epic-auth

# Work on tasks
/ctx:progress
/ctx:task 001
/ctx:sync
```

## Available Skills

### Setup & Initialization (6 skills)

| Skill | Usage | Description |
|-------|-------|-------------|
| `vision` | `/ctx:vision [idea]` | Define/update project vision and scope |
| `architecture` | `/ctx:architecture` | Define/update architectural patterns |
| `techstack` | `/ctx:techstack` | Select/update technologies |
| `init` | `/ctx:context-init` | Initialize .context/ folder structure |
| `onboard` | `/ctx:onboard` | Analyze existing project |
| `start` | `/ctx:start` | Complete new project setup (orchestrator) |

### Planning (4 skills)

| Skill | Usage | Description |
|-------|-------|-------------|
| `epic` | `/ctx:epic "Feature"` | Create feature epic |
| `investigate` | `/ctx:investigate "Issue"` | Investigate bug/refactor |
| `breakdown` | `/ctx:breakdown epic-name` | Decompose epic/investigation into tasks |
| `log-decision` | `/ctx:log-decision "Topic"` | Record architecture decision |

### Task Management (4 skills)

| Skill | Usage | Description |
|-------|-------|-------------|
| `create-task` | `/ctx:create-task "Description"` | Create standalone task |
| `task` | `/ctx:task [number]` | Load and work on task |
| `progress` | `/ctx:progress` | View project status |
| `sync` | `/ctx:sync` | Reconcile progress with files |

## Common Workflows

### New Project Setup

```bash
# Option 1: Full orchestrated setup
/ctx:start

# Option 2: Step-by-step
/ctx:vision "E-commerce platform"
/ctx:architecture
/ctx:techstack
/ctx:context-init
```

### Feature Development

```bash
# 1. Plan the feature
/ctx:epic "Payment integration"

# 2. Break down into tasks
/ctx:breakdown epic-payment

# 3. See what needs to be done
/ctx:progress

# 4. Start working
/ctx:task 001

# 5. Track progress
/ctx:sync
```

### Bug Investigation

```bash
# 1. Investigate the issue
/ctx:investigate "Checkout 500 error"

# 2. Create tasks from findings
/ctx:breakdown inv-checkout-500

# 3. Work on fixes
/ctx:progress
/ctx:task 006
```

### Onboarding Existing Project

```bash
# Extract vision, architecture, techstack from codebase
/ctx:onboard

# Initialize context structure
/ctx:context-init

# Start working
/ctx:epic "First feature"
```

## File Structure Created

The plugin works with a `.context/` folder in your project:

```
.context/
├── plans/              # Epic files (epic-*.md)
├── investigations/     # Investigation files (inv-*.md)
├── tasks/              # Active task files (001-name.md)
├── tasks-done/         # Archived completed tasks
├── workflow.md         # Workflow guide
├── progress.md         # Status tracker
├── patterns-*.md       # Architecture + code patterns
├── decisions.md        # ADRs
└── vision.md           # Project vision
```

## Philosophy

**Conscious Task Selection**: No auto-selection. You always choose which task to work on:
1. Run `/ctx:progress` to see pending tasks
2. Review and choose based on priority/context
3. Run `/ctx:task [number]` to start
4. Complete work consciously
5. Run `/ctx:sync` when done

**Task-Driven Development**: Everything is tracked as tasks with clear acceptance criteria, complexity estimates, and progress logs.

**Pragmatic TDD**: Red → Green → Refactor workflow with automated test execution.

## Installation

### Option 1: Load from Directory (Development)

```bash
claude --plugin-dir ~/.claude/skills/ctx
```

### Option 2: Install from Personal Marketplace

```bash
# Add marketplace (one-time)
claude marketplace add personal ~/.claude/marketplaces/personal.json

# Install plugin
claude plugin install ctx@personal --scope user
```

The plugin will be available in all sessions automatically.

## Documentation

- **Workflows**: See `shared/workflows/` for step-by-step guides
- **Templates**: See `shared/templates/` for file formats
- **Conventions**: See `shared/conventions/` for naming and sizing guidelines
- **Examples**: See `references/examples/` for complete walkthroughs
- **Diagrams**: See `references/diagrams/` for visual workflow maps

## Contributing

This plugin follows semantic versioning. See `CHANGELOG.md` for version history.

## License

MIT License - See LICENSE file for details

## Version

Current version: 1.1.4

## Changelog

See `CHANGELOG.md` for detailed version history and migration notes.
