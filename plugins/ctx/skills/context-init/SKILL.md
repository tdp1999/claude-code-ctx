---
name: context-init
description: Initialize or check the .context/ folder structure for task tracking. Triggers on "init context", "setup context", "create .context", "initialize project tracking". Use when .context/ folder is missing or needs verification. For full project setup, use /ctx:start instead.
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
- `.context/plans-done/` folder (for archived completed epics and investigations)
- `.context/progress.md`
- `.context/patterns-architecture.md` (NOTE: created by `/ctx:architecture`, not this skill)
- `.context/domain.md` (NOTE: created by `/ctx:domain`, not this skill)
- `.context/decisions.md`

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
├── investigations/         # Investigation files go here
├── tasks/                  # Active task files (pending, in-progress, blocked)
├── tasks-done/             # Archived completed tasks, organized by epic subfolder (created by /sync)
├── plans-done/              # Archived completed epics & investigations (created by /sync)
├── progress.md            # Progress tracker
└── decisions.md           # Architecture Decision Records
```

**IMPORTANT:** Do NOT create `patterns-architecture.md` - this is created by `/ctx:architecture` skill.
If `patterns-architecture.md` already exists (created by `/ctx:architecture`), leave it as-is.

**IMPORTANT:** Do NOT create `domain.md` - this is created by `/ctx:domain` skill.
If `domain.md` already exists, leave it as-is.

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

- `.context/plans/` - Epic files (feature planning)
- `.context/investigations/` - Investigation files (bugs, refactors)
- `.context/tasks/` - Active task files
- `.context/tasks-done/` - Archived completed tasks
- `.context/plans-done/` - Archived completed epics and investigations
- `.context/progress.md` - Current progress and blockers
- `.context/patterns-architecture.md` - Architecture and code patterns (from /ctx:architecture)
- `.context/domain.md` - Business logic, flows, and rules (from /ctx:domain)
- `.context/decisions.md` - Architecture decisions
```

If `domain.md` is missing and the project appears to have business logic (epics reference flows, rules, or user interactions), suggest:
```
💡 If this project has business rules or domain flows, run /ctx:domain to capture them.
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

- `.context/plans/` - Epic files (feature planning)
- `.context/investigations/` - Investigation files (bugs, refactors)
- `.context/tasks/` - Active task files
- `.context/tasks-done/` - Archived completed tasks
- `.context/plans-done/` - Archived completed epics and investigations
- `.context/progress.md` - Current progress and blockers
- `.context/patterns-architecture.md` - Architecture and code patterns (from /ctx:architecture)
- `.context/domain.md` - Business logic, flows, and rules (from /ctx:domain)
- `.context/decisions.md` - Architecture decisions
````

## Step 5: Offer Project Config (Optional)

After creating the folder structure, ask:

"Create project config (`.context/ctx-config.json`) with defaults? This controls verification behavior, logging, and naming conventions. (yes/no)"

If yes, create `.context/ctx-config.json` with the minimal template from `config-convention.md`:

```json
{
  "verification": {
    "onTaskComplete": "ask",
    "carefulMode": false
  },
  "logging": {
    "enabled": true
  }
}
```

If no, skip. Config is optional — all skills use defaults when no config exists.

## Step 6: Summary

After completion, summarize:

- What was created
- Next steps:
    - Use `/ctx:breakdown [feature]` to create tasks
    - Use `/ctx:task [num]` to start working

## Gotchas

- **Do NOT create patterns-architecture.md or domain.md**: Those are owned by `/ctx:architecture` and `/ctx:domain` respectively. This skill only creates the folder structure and boilerplate files (progress.md, decisions.md).
- **Idempotent**: Running twice must not overwrite existing files. Check what exists, report it, create only what's missing.
- **Do NOT create CLAUDE.md if one already exists**: Only offer to create it if the project has no CLAUDE.md at all.
