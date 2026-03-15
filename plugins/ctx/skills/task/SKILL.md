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
- `.context/tasks-done/` - Archived done tasks (read-only reference)

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.

Skill-specific errors:
- **Task not found in `tasks/`**: Report not found, do NOT search `tasks-done/`. Suggest `/ctx:progress` to see available tasks.
- **Task missing `## Acceptance Criteria`**: Warn user the task has no ACs — cannot track completion properly. Suggest adding ACs before starting.
- **Task missing `## Status`**: Treat as `pending`, but warn user about malformed file.
- **Task status is `blocked`**: Show blocker reason, ask if user wants to proceed anyway.
- **Task status is `done`**: Inform user this task is already complete. Suggest `/ctx:sync` to archive it.

## Input

`$ARGUMENTS` - Task number or name (e.g., "002" or "bento-grid")

If empty, ask user which task to work on.

## Steps

1. **Find task file:**
   ```
   .context/tasks/*$ARGUMENTS*.md
   ```

   Note: Only search in `tasks/`, not `tasks-done/`. Done tasks are archived and shouldn't be reopened.

2. **Read context:**
   - Task file
   - `.context/patterns-architecture.md` (if exists)
   - Check task status and dependencies

3. **Verify ready:**
   - Status should be `pending` or `in-progress`
   - Dependencies should be done
   - If blocked, report why

4. **Begin work:**
   - Update status to `in-progress` if pending
   - Add progress log entry: `- [date] Started`
   - Work through acceptance criteria in order

5. **During work:**
   - Follow patterns from patterns-architecture.md
   - Update progress log with significant milestones
   - If blocked, update status and note blocker
   - **AC tracking (MANDATORY):** After completing work for an acceptance criterion, immediately edit the task file to change `- [ ]` to `- [x]` for that item. Do NOT defer this — update the checkbox as soon as the criterion is satisfied.

6. **On completion (MANDATORY):**
   After all acceptance criteria are checked `[x]`:
   - Change `## Status: in-progress` to `## Status: done` in the task file
   - Add progress log entry: `- [date] Done — all ACs satisfied`
   - Do NOT leave status as `in-progress` when all ACs are done

## Output

Confirm task loaded and show:
- Goal
- Acceptance criteria (with current status)
- Next action to take
