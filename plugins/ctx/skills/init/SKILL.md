---
name: init
description: Initialize or check project context bank (.context folder with tasks, patterns, decisions, progress tracking)
allowed-tools: Read, Write, Edit, Glob, Bash, AskUserQuestion
---

# Initialize Project Context Bank

Check if this project has a context bank (`.context/` folder structure for task tracking and project context). If not, offer to create one.

## Step 1: Check Current State

Check for the existence of these paths:

- `.context/plans/` folder (for epic files)
- `.context/investigations/` folder (for investigation files)
- `.context/tasks/` folder (for active task files)
- `.context/tasks-done/` folder (for archived completed tasks)
- `.context/progress.md`
- `.context/patterns-architecture.md` (NOTE: created by `/ctx:architecture`, not this skill)
- `.context/decisions.md`
- `.context/workflow.md`

Also check if `CLAUDE.md` exists at the project root.

## Step 2: Report Status

Report what exists and what's missing:

**If everything exists:**
Report "Context bank already initialized" and show a summary of:

- Number of task files in `.context/tasks/`
- Current progress status (from progress.md)

**If partially exists:**
List what's present and what's missing. Ask user if they want to create the missing pieces.

**If nothing exists:**
Ask user: "No context bank found. Would you like me to create one?"

## Step 3: Create Missing Structure (if user agrees)

Create the following structure:

```
.context/
├── plans/                  # Epic files go here
│   └── .gitkeep           # Placeholder to keep folder in git
├── investigations/         # Investigation files go here
│   └── .gitkeep           # Placeholder to keep folder in git
├── tasks/                  # Active task files (pending, in-progress, blocked)
│   └── .gitkeep           # Placeholder to keep folder in git
├── tasks-done/             # Archived completed tasks (created by /sync)
│   └── .gitkeep           # Placeholder to keep folder in git
├── workflow.md            # How to use the context bank
├── progress.md            # Progress tracker
└── decisions.md           # Architecture Decision Records
```

**IMPORTANT:** Do NOT create `patterns-architecture.md` - this is created by `/ctx:architecture` skill.
If `patterns-architecture.md` already exists (created by `/ctx:architecture`), leave it as-is.

### workflow.md template:

````markdown
# Claude Code Workflow

Task-driven development with `.context/` folder structure.

## Structure

```
project/
├── .context/
│   ├── plans/           # Epic files (epic-*.md)
│   ├── investigations/  # Investigation files (inv-*.md)
│   ├── tasks/           # Active task files (001-name.md)
│   ├── tasks-done/      # Archived completed tasks
│   ├── workflow.md      # This file
│   ├── progress.md      # Status tracker
│   ├── patterns-architecture.md      # Architecture + code patterns (from /ctx:architecture)
│   └── decisions.md     # ADRs
└── CLAUDE.md            # Project overview
```

## Task File Format

```markdown
# Task: [Title]

## Status: pending | in-progress | done | blocked

## Goal

## Acceptance Criteria

- [ ] ...

## Technical Notes

## Files to Touch

## Dependencies

## Complexity: S | M | L | XL

## Progress Log
```

## Skills

| Skill                       | Purpose                                |
| --------------------------- | -------------------------------------- |
| `/ctx:start`                | Initialize new project (full flow)     |
| `/ctx:onboard`              | Onboard existing project               |
| `/ctx:vision`               | Define/update project vision           |
| `/ctx:architecture`         | Define/update architecture patterns    |
| `/ctx:techstack`            | Select/update tools                    |
| `/ctx:epic [idea]`          | Create epic from feature idea          |
| `/ctx:investigate [issue]`  | Investigate bug/refactor/tech debt     |
| `/ctx:breakdown [epic/inv]` | Break epic or investigation into tasks |
| `/ctx:task [num]`           | Load and work on task                  |
| `/ctx:progress`             | Show status summary                    |
| `/ctx:log-decision [topic]` | Record ADR                             |
| `/ctx:sync`                 | Sync progress.md with files            |

## Session Flow

1. **Review:** `/ctx:progress` to see pending tasks
2. **Start:** `/ctx:task [num]` to load a specific task
3. **Work:** Complete acceptance criteria
4. **Finish:** Mark task as completed, sync with `/ctx:sync`

## Principles

- Tasks are source of truth
- One task per session (focus)
- Update progress every session
- Completable in 1-2 sessions
````

### progress.md template:

```markdown
# Progress Tracker

## Active Tasks

<!-- Tasks currently being worked on -->

## Pending

<!-- Tasks ready to start -->

## Blocked

<!-- Tasks waiting on something -->

## Completed

<!-- Done tasks - move here when finished -->
```

**IMPORTANT:** Do NOT create `patterns-architecture.md` - this file is created by `/ctx:architecture` skill.
The `/ctx:architecture` skill creates `patterns-architecture.md` with both architecture decisions and code patterns.

### decisions.md template:

```markdown
# Architecture Decision Records

<!-- Document important technical decisions and their rationale -->

## Template

### [Date] Decision Title

**Context:** Why this decision was needed

**Decision:** What was decided

**Rationale:** Why this option was chosen

**Consequences:** What this means going forward

---
```

## Step 4: Update CLAUDE.md (if needed)

If CLAUDE.md exists, check if it already references the `.context/` folder.

If not, add a section pointing to the context files:

```markdown
## Project Context

- `.context/workflow.md` - How to use the context bank
- `.context/plans/` - Epic files (feature planning)
- `.context/investigations/` - Investigation files (bugs, refactors)
- `.context/tasks/` - Active task files
- `.context/tasks-done/` - Archived completed tasks
- `.context/progress.md` - Current progress and blockers
- `.context/patterns-architecture.md` - Architecture and code patterns (from /ctx:architecture)
- `.context/decisions.md` - Architecture decisions
```

**Note:** If CLAUDE.md has content that should be moved to patterns-architecture.md or decisions.md (like code conventions or architectural notes), suggest this to the user but don't move automatically.

If CLAUDE.md doesn't exist, create a minimal one:

````markdown
# Project Name

## Commands

```bash
# Add common commands here
```

## Project Context

- `.context/workflow.md` - How to use the context bank
- `.context/plans/` - Epic files (feature planning)
- `.context/investigations/` - Investigation files (bugs, refactors)
- `.context/tasks/` - Active task files
- `.context/tasks-done/` - Archived completed tasks
- `.context/progress.md` - Current progress and blockers
- `.context/patterns-architecture.md` - Architecture and code patterns (from /ctx:architecture)
- `.context/decisions.md` - Architecture decisions
````

## Step 5: Summary

After completion, summarize:

- What was created
- Next steps:
    - Read `.context/workflow.md` for full guide
    - Use `/ctx:breakdown [feature]` to create tasks
    - Use `/ctx:task [num]` to start working
