---
name: sync
description: Reconcile progress.md with actual task files, archive done tasks, update epic statuses, check domain freshness. Triggers on "sync", "reconcile", "clean up tasks", "archive done", "update progress". Use after completing tasks or when progress.md seems stale.
allowed-tools: Read, Write, Edit, Glob
---

# Sync Progress

Update progress.md to match actual task file statuses, archive done tasks, and update epic/investigation statuses based on task completion.

## Folder Structure

```
.context/
├── tasks/              # Active tasks (pending, in-progress, blocked)
├── tasks-done/         # Archived done tasks (organized by epic subfolder)
├── plans/              # Epics
├── investigations/     # Investigation files
├── plans-done/          # Archived done epics & investigations
└── progress.md         # Progress tracker
```

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.

Skill-specific errors:
- **`.context/tasks/` doesn't exist**: Report no context bank found, suggest `/ctx:context-init`
- **Task file missing `## Status`**: Report malformed file, treat as `pending`, include in sync report
- **Task file missing `## Acceptance Criteria`**: Cannot count AC progress — report as "ACs unknown"
- **progress.md doesn't exist**: Create it from template (this is a recovery action)
- **Epic/investigation referenced by task but file missing**: Report orphaned reference in sync report

## Steps

1. **Scan all task files:**
   ```
   .context/tasks/*.md
   .context/tasks-done/**/*.md  (for reference/reporting, includes epic subfolders)
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
   - Determine the source epic/investigation name for each done task
   - Create `.context/tasks-done/<epic-name>/` subfolder if it doesn't exist (e.g., `tasks-done/epic-auth-frontend/`)
   - If task has no associated epic, use `tasks-done/other/`
   - Move any task with `## Status: done` from `tasks/` to the appropriate subfolder
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
     - If ALL tasks are done → update status to "completed" and move the file to `.context/plans-done/` (create folder if needed, preserve original filename)
     - Keep as "broken-down" if any tasks are pending/in-progress

8. **Domain freshness check:**
   If `.context/domain.md` exists:
   - Check its last modified date
   - Check if any epics completed since that date had business logic (scan for entity names, flow references, rule IDs in epic files in `plans-done/`)
   - If domain.md is potentially stale, add to report:
     ```
     Domain Coverage:
     ⚠ domain.md last updated [date] — [N] epics with business logic completed since then
     → Consider reviewing with /ctx:domain
     ```
   - If domain.md is up to date: `Domain Coverage: ✓ Up to date`

   When archiving a completed epic to `plans-done/`:
   - If the epic references domain rule IDs, show a quick review:
     ```
     Epic "[name]" completed. Referenced domain rules:
     - ORD-001: Order must contain at least one Line Item ← still accurate?
     - ORD-003: Free shipping when total > $50 ← still accurate?

     Confirm all still correct? Or need updates?
     ```
   - If user confirms → proceed with archive
   - If user wants updates → apply changes to domain.md → then archive

9. **Failure Pattern Analysis (Self-Learning):**

   If `${CLAUDE_PLUGIN_DATA}/ctx-logs/execution.jsonl` exists and logging is enabled:
   - Scan for failure entries since the last sync (check `ts` field)
   - Group failures by `skill` + `failure_type`
   - If any skill has >= 2 failures of the same type:
     - Draft a proposed gotcha based on the failure pattern
     - Present to user: "Detected repeated failure in [skill]: [pattern]. Proposed gotcha: [text]. Add to skill's Gotchas section? (yes/no)"
     - If confirmed → append to the skill's `## Gotchas` section
     - Mark processed failures with `"gotcha_proposed": true`
   - If no patterns found → skip silently

10. **Write sync summary:**

   If logging is enabled, append one line to `${CLAUDE_PLUGIN_DATA}/ctx-logs/sync-history.jsonl`:
   ```json
   {"ts": "ISO-8601", "project": "name", "tasks_done": N, "tasks_pending": N, "tasks_blocked": N, "epics_completed": ["epic-name"]}
   ```

11. **Report:**

```
Sync complete.

Status Corrections:
- 007-build-ui.md: pending → in-progress (3/5 ACs checked)
- 008-write-tests.md: in-progress → done (all ACs checked)

Archived Tasks:
- 005-implement-auth.md → tasks-done/epic-authentication/
- 006-add-tests.md → tasks-done/epic-authentication/

Task Changes:
- [task] moved to [section]
- [task] added (was missing)
- [task] removed (no file)

Epic/Investigation Updates:
- [epic-name] status changed to "completed" (all 5 tasks done) — archived to plans-done/

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
- `completed` → All tasks finished (archived to `plans-done/`)

**Tasks:**
- `pending` → Not started (in tasks/)
- `in-progress` → Being worked on (in tasks/)
- `done` → Finished (moved to tasks-done/<epic-name>/)
- `blocked` → Waiting on dependency (in tasks/)

## Notes

- Done tasks are archived to keep `tasks/` folder focused on active work
- Completed epics and investigations are archived to `plans-done/` to keep `plans/` and `investigations/` focused on active work
- Archived files retain their original naming for traceability
- Use `tasks-done/` and `plans-done/` to review past work or reference implementations
- The `/ctx:task` skill should only look in `tasks/` for active work

## Gotchas

- **Never delete archived files**: tasks-done/ and plans-done/ are permanent archives. Moving files there is correct; deleting them is not.
- **Auto-status correction can surprise users**: If ACs are all checked but status says "in-progress", sync will correct to "done". Warn the user when this happens.
- **Domain freshness check may produce false positives**: A stale domain.md doesn't always mean it's wrong — the epic may not have changed business logic. Present the finding but don't insist on updates.
- **Missing progress.md is recoverable**: If it doesn't exist, create it from template and scan all task files to rebuild state. Do not error out.
- **Epic archival is gated on ALL tasks done**: Do not archive an epic to plans-done/ if any of its tasks are still pending or in-progress.
