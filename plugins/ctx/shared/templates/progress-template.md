# Progress Template

This template is used for creating the progress tracker at `.context/progress.md`. This file tracks all tasks and their current status.

---

# Progress Tracker

## Active Tasks

<!-- Tasks currently being worked on -->

## Pending

<!-- Tasks ready to start -->

## Blocked

<!-- Tasks waiting on something -->

## Completed

<!-- Done tasks - move here when finished -->

---

## Usage Notes

**Task Entry Format:**
```markdown
- [ ] 001-task-name - Brief description (from: epic-auth)
- [ ] 002-another-task - Brief description (from: inv-checkout-bug)
```

**Status Sections:**

- **Active Tasks** - Tasks currently being worked on (status: in-progress)
- **Pending** - Tasks ready to start (status: pending, no blockers)
- **Blocked** - Tasks waiting on dependencies (status: blocked)
- **Completed** - Done tasks (status: done)

**Checkbox States:**
- `[ ]` - Not started or in progress
- `[x]` - Completed

**Source Attribution:**
Always note which epic or investigation each task came from:
- `(from: epic-auth)` - Task came from epic-auth.md
- `(from: inv-checkout-bug)` - Task came from investigation
- `(ad-hoc)` - Task created without epic/investigation

**Syncing:**
Use `/ctx:sync` to synchronize progress.md with actual task files:
- Scans `.context/tasks/` for current task statuses
- Updates progress.md sections accordingly
- Moves completed tasks to `.context/tasks-done/`

**Example:**
```markdown
# Progress Tracker

## Active Tasks
- [ ] 003-implement-login - Add login endpoint and JWT handling (from: epic-auth)

## Pending
- [ ] 001-setup-user-model - Create user entity and repository (from: epic-auth)
- [ ] 002-implement-registration - Add registration endpoint (from: epic-auth)
- [ ] 006-fix-checkout-bug - Add null check in payment service (from: inv-checkout-500)

## Blocked
- [ ] 005-jwt-refresh-tokens - Waiting on 003-implement-login (from: epic-auth)

## Completed
- [x] 004-setup-database - Configure PostgreSQL and migrations (from: epic-auth)
```
