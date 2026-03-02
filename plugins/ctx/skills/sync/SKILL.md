---
name: sync
description: Synchronize progress.md with actual task file states
allowed-tools: Read, Write, Edit, Glob
---

# Sync Progress

Update progress.md to match actual task file statuses, archive done tasks, and update epic/investigation statuses based on task completion.

## Folder Structure

```
.context/
├── tasks/              # Active tasks (pending, in-progress, blocked)
├── tasks-done/         # Archived done tasks
├── plans/              # Epics
├── investigations/     # Investigation files
└── progress.md         # Progress tracker
```

## Steps

1. **Scan all task files:**
   ```
   .context/tasks/*.md
   .context/tasks-done/*.md  (for reference/reporting)
   ```

2. **Extract from each:**
   - Task number and name
   - Current status
   - Source epic/investigation (from "from:" note or context)
   - Any blockers noted
   - Acceptance criteria completion (count `- [x]` vs `- [ ]`)

3. **Fix stale task statuses:**
   For each task in `.context/tasks/`:
   - If ALL ACs are `[x]` but status is NOT `done` → update status to `done`
   - If SOME ACs are `[x]` and status is `pending` → update status to `in-progress`
   - Report every status correction made

4. **Archive done tasks:**
   - Create `.context/tasks-done/` if it doesn't exist
   - Move any task with `## Status: done` from `tasks/` to `tasks-done/`
   - Preserve original filename

5. **Compare with progress.md:**
   - Find mismatches
   - Find tasks in progress.md but no file
   - Find task files not in progress.md

6. **Update progress.md:**
   - Move tasks to correct sections
   - Add missing tasks
   - Remove orphaned entries
   - Done tasks remain in "Done" section (reference tasks-done/)

7. **Update epic/investigation statuses:**
   - Check `.context/plans/` for epics with status "broken-down"
   - Check `.context/investigations/` for investigations with status "broken-down"
   - For each broken-down epic/investigation:
     - Find all tasks that belong to it (check both tasks/ and tasks-done/)
     - If ALL tasks are done → update status to "done"
     - Keep as "broken-down" if any tasks are pending/in-progress

8. **Report:**

```
Sync complete.

Status Corrections:
- 007-build-ui.md: pending → in-progress (3/5 ACs checked)
- 008-write-tests.md: in-progress → done (all ACs checked)

Archived Tasks:
- 005-implement-auth.md → tasks-done/
- 006-add-tests.md → tasks-done/

Task Changes:
- [task] moved to [section]
- [task] added (was missing)
- [task] removed (no file)

Epic/Investigation Updates:
- [epic-name] status changed to "done" (all 5 tasks done)

Current state:
- Done: X (in tasks-done/)
- In Progress: X
- Pending: X
- Blocked: X
```

## Status Lifecycle

**Epics/Investigations:**
- `draft` → Being written
- `ready` → Ready to break down
- `broken-down` → Has tasks, work in progress
- `done` → All tasks finished

**Tasks:**
- `pending` → Not started (in tasks/)
- `in-progress` → Being worked on (in tasks/)
- `done` → Done (moved to tasks-done/)
- `blocked` → Waiting on dependency (in tasks/)

## Notes

- Done tasks are archived to keep `tasks/` folder focused on active work
- Archived tasks retain their original numbering for traceability
- Use `tasks-done/` to review past work or reference implementations
- The `/ctx:task` skill should only look in `tasks/` for active work
