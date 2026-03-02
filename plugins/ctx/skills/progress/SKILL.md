---
name: progress
description: Show current project progress summary
allowed-tools: Read, Glob
---

# Show Progress

Display project progress from `.context/`.

## Folder Structure

- `.context/tasks/` - Active tasks (pending, in-progress, blocked)
- `.context/tasks-done/` - Archived completed tasks

## Steps

1. **Read progress.md**

2. **Scan task files:**
   - `.context/tasks/` for active tasks (pending, in-progress, blocked)
   - `.context/tasks-done/` for completed task count
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

4. **Highlight:**
   - Decisions needed
   - Blockers to resolve
   - Available pending tasks (list by number for easy selection)
