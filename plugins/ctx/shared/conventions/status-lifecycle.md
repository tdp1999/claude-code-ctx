# Status Lifecycle Reference

Complete reference for status values and transitions in the CTX plugin.

## Overview

Different file types have different status lifecycles. Understanding these helps you track work progress and maintain clean archives.

## Task Status Lifecycle

### The Status Line

A task file declares its status on one line, in this exact shape:

```markdown
## Status: in-progress
```

**The value is one bare token from the table below — nothing else on the line.**
No parenthetical, no qualifier, no date, no "done (pending review)". Every reader
(sync, task, progress) matches the token exactly, so a decorated status matches
nothing: the task is neither archived nor flagged, and it quietly drops out of
every count until a human opens the file. If there is something to say about the
status, `## Progress Log` is where it goes.

Tasks use `done`. (`completed` is the *epic* and *investigation* vocabulary —
they are different lifecycles, see below.)

### Available Statuses

| Status | Meaning | Location | Next Action |
|--------|---------|----------|-------------|
| `pending` | Not started | `tasks/` | Start work → `in-progress` |
| `in-progress` | Currently working | `tasks/` | Complete → `done` or hit blocker → `blocked` |
| `blocked` | Cannot proceed | `tasks/` | Resolve blocker → `in-progress` or `pending` |
| `done` | Finished, **every AC checked** | `tasks-done/<epic-name>/` | Archive (auto or manual) |

### Status Flow

```
pending
   ↓
in-progress ←→ blocked
   ↓
done → [archived to tasks-done/<epic-name>/]
```

### `done` Is Gated on the Acceptance Criteria

`done` means every `- [ ]` under `## Acceptance Criteria` is now `- [x]`. It is a
statement about the checkboxes, not about how finished the work feels.

Work that is functionally complete but has an AC nobody can verify yet — a server
restart, a release to land, a review to come back — is **not** `done`. It stays
`in-progress`, or `blocked` when the wait is on someone else, with the outstanding
item named in the progress log. That way it keeps showing up in active counts,
which is exactly what you want from something unfinished.

### Status Details

#### pending

**When to use:**
- Task created but not started
- Task unblocked but not actively working yet
- Waiting for dependencies to complete

**Example:**
```yaml
status: pending
```

**Typical in file:**
```markdown
# Add User Dashboard Component

**Status:** pending
**Complexity:** M
**Blocked by:** 042-add-user-service

## Description
Create dashboard component to display user stats.
Requires user service from task 042.
```

#### in-progress

**When to use:**
- Actively working on task
- Code changes in progress
- Tests being written

**Example:**
```yaml
status: in-progress
```

**Typical in file:**
```markdown
# Add User Dashboard Component

**Status:** in-progress
**Complexity:** M
**Started:** 2026-02-11

## Description
Create dashboard component to display user stats.

## Progress
- [x] Create component scaffold
- [x] Add service injection
- [ ] Implement template
- [ ] Add unit tests
```

#### blocked

**When to use:**
- Cannot proceed due to external dependency
- Waiting for information
- Dependency task not complete
- Technical blocker discovered

**Example:**
```yaml
status: blocked
blocking_reason: Waiting for API schema from backend team
```

**Typical in file:**
```markdown
# Add User Dashboard Component

**Status:** blocked
**Complexity:** M
**Blocked by:** Backend API schema needed

## Description
Create dashboard component to display user stats.

## Blocker
Cannot implement API integration until backend team provides
OpenAPI schema for new endpoints. Estimated unblock: Feb 15.

## Completed
- [x] Create component scaffold
- [x] Design mockup

## Pending Unblock
- [ ] Implement API integration
- [ ] Add error handling
- [ ] Add unit tests
```

**Unblocking:**
- Update status back to `in-progress` or `pending`
- Document how blocker was resolved
- Continue work

#### done

**When to use:**
- Every acceptance criterion is checked `[x]` — this is the gate
- Tests passing
- Code reviewed (if applicable)
- Merged to main branch

**Typical in file:**
```markdown
# Task: Add User Dashboard Component

## Status: done

## Acceptance Criteria
- [x] Component scaffold created
- [x] User service injected
- [x] Template implemented
- [x] Unit tests added

## Progress Log
- [2026-02-11] Done — all ACs satisfied. 95% coverage.
```

**Not done, even though the code is written:**
```markdown
## Status: in-progress

## Acceptance Criteria
- [x] Component scaffold created
- [x] Template implemented
- [ ] Verified against the staging API   ← still open

## Progress Log
- [2026-02-11] Implementation complete. Last AC blocked on staging redeploy (ETA Feb 13).
```
The temptation here is `## Status: done (pending staging check)`. That line
matches no status token, so sync neither archives nor flags the task and it
vanishes from every count. Leave it `in-progress` and say why in the log.

**Archiving:**
- File moves from `tasks/` to `tasks-done/<epic-name>/` (organized by source epic)
- Can happen automatically (via /ctx:task) or manually
- Preserves completed work history

## Epic Status Lifecycle

### Available Statuses

| Status | Meaning | Location | Next Action |
|--------|---------|----------|-------------|
| `draft` | Initial planning | `plans/` | Complete details → `ready` |
| `ready` | Planned, not started | `plans/` | Break down → `broken-down` |
| `broken-down` | Tasks created | `plans/` | Work on tasks → `in-progress` |
| `in-progress` | Tasks underway | `plans/` | Complete all tasks → `completed` |
| `completed` | All done | `plans-done/` | Archive |

### Status Flow

```
draft
   ↓
ready
   ↓
broken-down
   ↓
in-progress
   ↓
completed → [archived to plans-done/]
```

### Status Details

#### draft

**When to use:**
- Initial epic creation
- Still gathering requirements
- Scope not fully defined
- Stakeholders reviewing

**Example:**
```yaml
status: draft
```

#### ready

**When to use:**
- Requirements complete
- Acceptance criteria defined
- Ready to break down into tasks
- Stakeholders approved

**Example:**
```yaml
status: ready
estimated_tasks: 8-12
```

#### broken-down

**When to use:**
- Tasks created from epic
- Task list complete
- Tasks ready to work
- No active work yet

**Example:**
```yaml
status: broken-down
total_tasks: 10
```

#### in-progress

**When to use:**
- One or more tasks in progress
- Active development happening
- Not all tasks complete

**Example:**
```yaml
status: in-progress
completed_tasks: 4
total_tasks: 10
```

#### completed

**When to use:**
- All tasks completed
- Epic goals achieved
- Acceptance criteria met
- Ready to archive

**Example:**
```yaml
status: completed
completed_date: 2026-02-11
completed_tasks: 10
total_tasks: 10
```

## Investigation Status Lifecycle

### Available Statuses

| Status | Meaning | Location | Next Action |
|--------|---------|----------|-------------|
| `draft` | Initial notes | `investigations/` | Gather info → `ready` |
| `ready` | Info gathered | `investigations/` | Analyze → `analyzed` |
| `analyzed` | Root cause found | `investigations/` | Create tasks → `broken-down` |
| `broken-down` | Fix tasks created | `investigations/` | Work on fixes → `in-progress` |
| `in-progress` | Fixes underway | `investigations/` | Complete fixes → `completed` |
| `blocked` | Need more info | `investigations/` | Get info → `ready` |
| `completed` | Issue resolved | `plans-done/` | Archive |

### Status Flow

```
draft
   ↓
ready ←→ blocked
   ↓
analyzed
   ↓
broken-down
   ↓
in-progress
   ↓
completed → [archived to plans-done/]
```

### Status Details

#### draft (investigation)

**When to use:**
- Initial bug report received
- Gathering reproduction steps
- Collecting error messages

#### ready (investigation)

**When to use:**
- All information collected
- Can reproduce issue
- Ready to analyze root cause

#### analyzed

**When to use:**
- Root cause identified
- Solution approach determined
- Ready to create fix tasks

#### broken-down (investigation)

**When to use:**
- Fix tasks created
- Fix plan documented
- Ready to implement

#### in-progress (investigation)

**When to use:**
- Fix tasks underway
- Implementing solution
- Not all fixes complete

#### blocked (investigation)

**When to use:**
- Cannot reproduce issue
- Need more information
- Waiting for environment/access

#### completed (investigation)

**When to use:**
- All fix tasks complete
- Issue resolved
- Verified in production

## Valid Status Transitions

### Tasks

| From | To | Valid? | Notes |
|------|-----|--------|-------|
| `pending` | `in-progress` | ✅ | Start work |
| `pending` | `blocked` | ✅ | Hit blocker before starting |
| `in-progress` | `blocked` | ✅ | Hit blocker during work |
| `in-progress` | `done` | ✅ | Finish work — **only with every AC checked** |
| `blocked` | `pending` | ✅ | Blocker resolved, not resuming yet |
| `blocked` | `in-progress` | ✅ | Blocker resolved, resume work |
| `done` | `in-progress` | ⚠️ | Only to undo a premature `done` (ACs still open), and only with the user's say-so. Never to reopen finished work — create a new task for that. |
| `done` | `pending` | ❌ | Create new task instead |
| any | `done (…)` | ❌ | A qualified status is not a status. See The Status Line above. |

### Epics

| From | To | Valid? | Notes |
|------|-----|--------|-------|
| `draft` | `ready` | ✅ | Planning complete |
| `ready` | `broken-down` | ✅ | Tasks created |
| `broken-down` | `in-progress` | ✅ | Start working tasks |
| `in-progress` | `completed` | ✅ | All tasks done |
| `ready` | `in-progress` | ❌ | Must break down first |
| `draft` | `broken-down` | ❌ | Must go through ready |

### Investigations

| From | To | Valid? | Notes |
|------|-----|--------|-------|
| `draft` | `ready` | ✅ | Info gathered |
| `ready` | `analyzed` | ✅ | Root cause found |
| `analyzed` | `broken-down` | ✅ | Fix tasks created |
| `broken-down` | `in-progress` | ✅ | Start fixes |
| `in-progress` | `completed` | ✅ | All fixes done |
| `ready` | `blocked` | ✅ | Cannot proceed |
| `blocked` | `ready` | ✅ | Info received |
| `draft` | `completed` | ❌ | Must analyze first |

## Archive Policy

### When to Archive

**Tasks:**
- Status line is exactly `done` — a qualified status disqualifies it
- Every acceptance criterion is checked `[x]`
- Merged to main branch
- No pending follow-up work

**Epics:**
- Status is `completed`
- All tasks completed
- Epic goals achieved
- Retrospective done (optional)

**Investigations:**
- Status is `completed`
- All fix tasks completed
- Issue verified resolved
- No related issues pending

### How to Archive

**Automatic (recommended):**
```bash
/ctx:task  # Automatically archives on completion
```

**Manual:**
```bash
# Move completed task (into epic subfolder)
mv .context/tasks/042-fix-login.md .context/tasks-done/epic-auth/

# Move completed epic
mv .context/plans/001-auth-system.md .context/plans-done/

# Move completed investigation
mv .context/investigations/003-memory-leak.md .context/plans-done/
```

### Archive Structure

```
.context/
├── tasks/              # Active tasks
├── tasks-done/         # Completed tasks, organized by epic subfolder
│   ├── epic-auth/      # Tasks from auth epic
│   ├── epic-payments/  # Tasks from payments epic
│   └── other/          # Standalone tasks (no epic)
├── plans/              # Active epics
├── investigations/     # Active investigations
└── plans-done/          # Completed epics & investigations
```

**Benefits:**
- Preserves work history
- Keeps active directories clean
- Maintains audit trail
- Enables progress tracking

### Never Delete

**Don't delete archived files:**
- They provide historical context
- Show what was accomplished
- Help estimate future work
- Document decisions made

**Disk space:** Markdown files are tiny, archive cost is negligible.

## Status Metadata

### In YAML Frontmatter

```yaml
---
status: in-progress
started: 2026-02-10
updated: 2026-02-11
blocked_by: []
blocks: []
---
```

### In Markdown Headers

```markdown
# Task Title

**Status:** in-progress
**Started:** 2026-02-10
**Updated:** 2026-02-11
```

**Both formats valid:** Use what works for your tooling.

## Checking Status

### View All Task Statuses

```bash
# Using grep
grep -h "^**Status:" .context/tasks/*.md

# Using /ctx:list
/ctx:list
```

### View Epic Progress

```bash
# Check epic file
cat .context/plans/001-auth-system.md

# Look for progress section
## Progress
- Completed: 6 / 10 tasks
- Status: in-progress
```

### View Investigation Status

```bash
# Check investigation file
cat .context/investigations/003-memory-leak.md

# Look for status
**Status:** analyzed
**Fix Tasks:** 2 created, 0 complete
```

## Best Practices

### Update Status Promptly

- Mark `in-progress` when you start
- Mark `blocked` as soon as you hit blocker
- Mark a task `done` (an epic/investigation `completed`) only when truly finished —
  tests passing, merged, every AC checked

### Document Status Changes

```markdown
## Status History
- 2026-02-10: Created (pending)
- 2026-02-11: Started work (in-progress)
- 2026-02-11: Blocked on API schema
- 2026-02-12: Unblocked, resumed work
- 2026-02-13: Completed
```

### Don't Skip Statuses

❌ **Bad:** `pending` → `done` (what happened to in-progress?)
✅ **Good:** `pending` → `in-progress` → `done`

### Use Blocked Thoughtfully

**Do use `blocked` when:**
- Genuinely cannot proceed
- External dependency needed
- Waiting for decisions

**Don't use `blocked` when:**
- Just haven't started yet (use `pending`)
- Paused to work on something else (use `pending`)
- Stuck but can figure it out (stay `in-progress`, ask for help)

### Clean Up When Archiving

Before archiving, ensure file has:
- Final status
- Completion date
- Summary of work done
- Links to relevant PRs/commits
- Any lessons learned

This makes archived files valuable historical references.
