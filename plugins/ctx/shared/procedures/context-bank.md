# Procedure: Context Bank

Create the `.context/` folder structure that every other ctx skill reads and writes.

**Not a slash command.** `/ctx:start` and `/ctx:onboard` both run this as their FIRST
step, before anything writes a file into `.context/`. It is idempotent — running it
on an existing context bank reports what is there and creates only what is missing.

## Step 1: Check Current State

Check for the existence of these paths:

- `.context/plans/` folder (for epic files)
- `.context/tasks/` folder (for active task files)
- `.context/tasks-done/` folder (for archived completed tasks)
- `.context/plans-done/` folder (for archived completed epics)
- `.context/progress.md`
- `.context/patterns-architecture.md` (NOTE: created by the architecture procedure, not this one)
- `.context/domain.md` (NOTE: created by `/ctx:domain`, not this procedure)
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
├── tasks/                  # Active task files (pending, in-progress, blocked)
├── tasks-done/             # Archived completed tasks, organized by epic subfolder (created by /sync)
├── plans-done/             # Archived completed epics (created by /sync)
├── progress.md            # Progress tracker
└── decisions.md           # Architecture Decision Records
```

**IMPORTANT:** Do NOT create `patterns-architecture.md` - the architecture procedure owns it.
If it already exists, leave it as-is.

**IMPORTANT:** Do NOT create `domain.md` - `/ctx:domain` owns it.
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

**IMPORTANT:** Do NOT create `patterns-architecture.md` here.
The architecture procedure writes it, with both architecture decisions and code patterns.

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
- `.context/tasks/` - Active task files
- `.context/tasks-done/` - Archived completed tasks
- `.context/plans-done/` - Archived completed epics
- `.context/progress.md` - Current progress and blockers
- `.context/patterns-architecture.md` - Architecture and code patterns
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
- `.context/tasks/` - Active task files
- `.context/tasks-done/` - Archived completed tasks
- `.context/plans-done/` - Archived completed epics
- `.context/progress.md` - Current progress and blockers
- `.context/patterns-architecture.md` - Architecture and code patterns
- `.context/domain.md` - Business logic, flows, and rules (from /ctx:domain)
- `.context/decisions.md` - Architecture decisions
````

## Step 5: Summary

After completion, summarize:

- What was created
- Next steps:
    - Use `/ctx:breakdown [feature]` to create tasks
    - Use `/ctx:task [num]` to start working

## Gotchas

- **Do NOT create patterns-architecture.md or domain.md**: the architecture procedure and `/ctx:domain` own those. This procedure only creates the folder structure and the boilerplate files (progress.md, decisions.md).
- **Idempotent**: Running twice must not overwrite existing files. Check what exists, report it, create only what's missing.
- **Do NOT create CLAUDE.md if one already exists**: Only offer to create it if the project has no CLAUDE.md at all.

