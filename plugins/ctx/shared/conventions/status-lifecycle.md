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

Tasks use `done`. (`completed` is the *epic* vocabulary —
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

**Typical in file:**
```markdown
# Task: Add User Dashboard Component

## Status: pending

## Goal
Display user stats on a dashboard component.

## Acceptance Criteria
- [ ] Component scaffold created
- [ ] User service injected
- [ ] Unit tests added

## Complexity: M

## Dependencies
042-add-user-service
```

#### in-progress

**When to use:**
- Actively working on task
- Code changes in progress
- Tests being written

**Typical in file:**
```markdown
# Task: Add User Dashboard Component

## Status: in-progress

## Acceptance Criteria
- [x] Component scaffold created
- [x] User service injected
- [ ] Template implemented
- [ ] Unit tests added

## Progress Log
- [2026-02-11] Started. Scaffold and service injection done.
```

#### blocked

**When to use:**
- Cannot proceed due to external dependency
- Waiting for information
- Dependency task not complete
- Technical blocker discovered

**Typical in file:**
```markdown
# Task: Add User Dashboard Component

## Status: blocked

## Acceptance Criteria
- [x] Component scaffold created
- [ ] API integration implemented
- [ ] Error handling added
- [ ] Unit tests added

## Progress Log
- [2026-02-11] Scaffold done.
- [2026-02-12] Blocked: the API integration needs the OpenAPI schema for the new
  endpoints, which the backend team has not published. Estimated unblock Feb 15.
```

The blocker goes in `## Progress Log` with what is being waited on and who owns it.
A blocked task with no stated blocker cannot be triaged by anyone but its author.

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
| `broken-down` | Tasks created, work under way | `plans/` | All tasks done → `completed` |
| `completed` | All tasks done | `plans-done/` | Archived by `/ctx:sync` |

### Status Flow

```
draft
   ↓
ready
   ↓
broken-down
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
```markdown
## Status
draft
```

#### ready

**When to use:**
- Requirements complete
- Acceptance criteria defined
- Ready to break down into tasks
- Stakeholders approved

**Example:**
```markdown
## Status
ready
```

#### broken-down

**When to use:**
- Tasks created from the epic
- Work on those tasks has started, or has not started yet

An epic stays `broken-down` for the whole time its tasks are being worked on. There is
no separate epic-level `in-progress`: per-task state already lives in the task files and
in `progress.md`, and a second place to track the same thing is a second place to get it
wrong. `/ctx:sync` moves the epic to `completed` when every one of its tasks is done.

**Example:**
```markdown
## Status
broken-down
```

#### completed

**When to use:**
- All tasks completed
- Epic goals achieved
- Acceptance criteria met
- Ready to archive

**Example:**
```markdown
## Status
completed
```

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
| `broken-down` | `completed` | ✅ | Every task done — applied by `/ctx:sync`, which also archives the file |
| `ready` | `completed` | ❌ | Must break down first |
| `draft` | `broken-down` | ❌ | Must go through ready |
| any | `in-progress` | ❌ | Not an epic status. Epics stay `broken-down` while their tasks are worked on |

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
└── plans-done/         # Completed epics
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

## Where the Status Lives

One format, in both tasks and epics: a `## Status` markdown heading. There is no YAML
frontmatter and no `**Status:**` bold line — every skill in this plugin reads the
heading, so anything else is invisible to `/ctx:progress` and `/ctx:sync`.

**Task file:**
```markdown
# Task: Add auth middleware

## Status: in-progress
```

**Epic file:**
```markdown
# Epic: Authentication

## Status
broken-down
```

Dates, blockers, and history go in `## Progress Log`, never on the status line. See
"A `## Status:` line holds one token" above.

## Checking Status

### View all task statuses

```bash
grep -H "^## Status" .context/tasks/*.md
```

### View the full picture

```
/ctx:progress
```

It counts tasks by status, shows what is blocked and why, and reports domain coverage.
`/ctx:sync` is the write-side equivalent: it reconciles `progress.md` against the files
and flags contradictions.

## Best Practices

### Update Status Promptly

- Mark `in-progress` when you start
- Mark `blocked` as soon as you hit blocker
- Mark a task `done` (an epic `completed`) only when truly finished —
  tests passing, merged, every AC checked

### Document Status Changes

Status history goes in the task's `## Progress Log`, dated, one line per change:

```markdown
## Progress Log
- 2026-02-10: Created
- 2026-02-11: Started work
- 2026-02-11: Blocked on the API schema — waiting on the payments team
- 2026-02-12: Unblocked, resumed
- 2026-02-13: All ACs checked, marked done
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
