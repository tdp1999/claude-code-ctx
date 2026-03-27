---
name: progress
description: Show project progress — pending, in-progress, blocked, and done tasks with domain coverage. Triggers on "progress", "status", "what's pending", "what's next", "show tasks", "how far along", "what needs to be done", "pick next task". Use --metrics for velocity and trend data.
allowed-tools: Read, Glob
---

# Show Progress

Display project progress from `.context/`.

## Folder Structure

- `.context/tasks/` - Active tasks (pending, in-progress, blocked)
- `.context/tasks-done/` - Archived completed tasks (organized by epic subfolder)
- `.context/plans-done/` - Archived completed epics and investigations

## Steps

1. **Read progress.md**

2. **Scan task files:**
   - `.context/tasks/` for active tasks (pending, in-progress, blocked)
   - `.context/tasks-done/**/*.md` for completed task count (includes epic subfolders)
   - `.context/plans-done/` for completed epic/investigation count
   - List any blocked tasks with reasons

3. **Display summary:**

```
## Progress

Total: X tasks
- Done: X
- In Progress: X
- Pending: X
- Blocked: X

### Active
- [task] - current status

### Blocked
- [task] - reason

### Recently Completed
- [task]
```

4. **Domain coverage:**
   - If `.context/domain.md` does not exist:
     - Check if any epics or tasks reference business logic (flows, rules, entities)
     - If yes: show `📘 Domain: Not documented — [N] epics reference business logic. Consider /ctx:domain`
   - If `.context/domain.md` exists:
     - Check if epics reference entities not in domain Glossary
     - If gaps found: show `📘 Domain: Partial coverage — [entities] not in glossary`
     - If all covered: show `📘 Domain: ✓ Documented`

5. **Highlight:**
   - Decisions needed
   - Blockers to resolve
   - Available pending tasks (list by number for easy selection)

6. **Metrics mode** (when `--metrics` argument is passed or user asks about velocity/metrics):

   If `${CLAUDE_PLUGIN_DATA}/ctx-logs/` exists:
   - Read `sync-history.jsonl` for historical data
   - Read `execution.jsonl` for skill usage patterns
   - Display after the progress summary:

   ```
   ## Metrics

   Velocity: X tasks/week (last 4 weeks)
   Trend: [improving / stable / declining]
   Top failing skills: [skill] (N failures)
   Most used skills: [skill] (N invocations)
   ```

   If log files don't exist → show: "No metrics available. Enable logging in ctx-config.json and use /ctx:sync to build history."

## Gotchas

- **Read-only skill**: This skill displays information. It does NOT modify progress.md, task files, or any other file. If state is stale, suggest `/ctx:sync`.
- **Scan tasks-done/ for accurate counts**: Completed task count must include archived tasks in tasks-done/ subfolders, not just progress.md entries.
- **Domain coverage can be misleading**: "Partial coverage" means some entities aren't in the glossary — it doesn't mean domain.md is wrong. Don't alarm the user unnecessarily.
