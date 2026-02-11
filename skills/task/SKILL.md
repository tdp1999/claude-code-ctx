---
name: task
description: Load a task file and continue working on it
argument-hint: "[task number or name]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Continue Task

Load and work on a specific task from `.context/tasks/` (active tasks only).

## Folder Structure

- `.context/tasks/` - Active tasks (pending, in-progress, blocked)
- `.context/tasks-done/` - Archived completed tasks (read-only reference)

## Input

`$ARGUMENTS` - Task number or name (e.g., "002" or "bento-grid")

If empty, ask user which task to work on.

## Steps

1. **Find task file:**
   ```
   .context/tasks/*$ARGUMENTS*.md
   ```

   Note: Only search in `tasks/`, not `tasks-done/`. Completed tasks are archived and shouldn't be reopened.

2. **Read context:**
   - Task file
   - `.context/patterns-architecture.md` (if exists)
   - Check task status and dependencies

3. **Verify ready:**
   - Status should be `pending` or `in-progress`
   - Dependencies should be completed
   - If blocked, report why

4. **Begin work:**
   - Update status to `in-progress` if pending
   - Add progress log entry: `- [date] Started`
   - Work through acceptance criteria in order
   - Check off criteria as completed

5. **During work:**
   - Follow patterns from patterns-architecture.md
   - Update progress log with significant milestones
   - If blocked, update status and note blocker

## Output

Confirm task loaded and show:
- Goal
- Acceptance criteria (with current status)
- Next action to take
