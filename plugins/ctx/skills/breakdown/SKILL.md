---
name: breakdown
description: Break down a feature, plan, epic, or investigation into actionable task files in the .context/tasks/ folder
argument-hint: "[epic/investigation name or file path]"
allowed-tools: Read, Write, Edit, Glob, Bash, AskUserQuestion, Task
---

# Task Breakdown

Break down an epic, investigation, feature, plan, PRD, or idea into actionable task files following the project's context bank structure.

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

This skill uses:
- **Explore** (built-in) - For finding related code when creating tasks

**When to use Explore:**
- When tasks need specific file paths
- When understanding existing code to create better tasks
- When need to identify affected areas for refactor tasks

## Input

`$ARGUMENTS` can be:
- Epic name: `/ctx:breakdown epic-auth` or `/ctx:breakdown auth`
- Epic file path: `/ctx:breakdown .context/plans/epic-auth.md`
- Investigation name: `/ctx:breakdown inv-checkout-bug` or `/ctx:breakdown checkout-bug`
- Investigation file path: `/ctx:breakdown .context/investigations/inv-checkout-bug.md`
- Feature description: `/ctx:breakdown Add user authentication` (ad-hoc, not from epic)
- Other file path: `/ctx:breakdown .context/portfolio-v1-plan.md`
- Empty: List available epics and investigations, ask which to break down

## Step 1: Analyze Input

**If empty (no arguments):**
1. Check for epic files in `.context/plans/`
2. Check for investigation files in `.context/investigations/`
3. If epics or investigations exist:
   - List all epics with their status
   - List all investigations with their status
   - Show which have been broken down already
   - Ask: "Which epic or investigation would you like to break down?"
4. If none exist:
   - Ask: "What would you like me to break down? (describe a feature or provide a file path)"

**If epic name or path provided:**
- Look for matching epic file in `.context/plans/`
- Read the epic file
- Extract: Summary, Requirements, Technical Considerations, Risks
- Use epic content as detailed context for breakdown

**If investigation name or path provided:**
- Look for matching investigation file in `.context/investigations/`
- Read the investigation file
- Extract: Root Cause, Affected Files, Proposed Approach, Test Strategy
- Use investigation content as detailed context for breakdown

**If other file path provided:**
- Read the file
- Identify type (PRD, plan, feature spec, idea list)
- Extract all actionable items

**If feature description provided (ad-hoc):**
- Understand the scope
- Ask clarifying questions if ambiguous
- Note: This is ad-hoc breakdown without epic context

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.
See `../../shared/conventions/file-contracts.md` for required file sections.

Skill-specific errors:
- **Epic missing `## High-Level Requirements`**: Cannot break down — inform user, suggest updating epic with `/ctx:epic <path>`
- **Investigation missing `## Proposed Approach`**: Cannot create fix tasks — inform user, suggest updating investigation
- **`.context/tasks/` doesn't exist**: Suggest running `/ctx:context-init` first
- **Epic status is `broken-down`**: Warn user this epic was already decomposed. Ask if they want to add more tasks (continue numbering) or re-breakdown (will not delete existing tasks)

## Step 2: Check Context Bank

Check if `.context/tasks/` exists:
- If yes, read existing task files to understand numbering and avoid duplicates
- Also check `.context/tasks-done/` for archived completed tasks (to avoid number conflicts)
- If no, suggest running `/ctx:context-init` first

Read `.context/patterns-architecture.md` and `.context/decisions.md` for project context.

## Step 3: Decompose into Tasks

Break down the input into tasks following these principles:

**Task Sizing:**
- Each task should be completable in 1-2 Claude sessions
- If a task feels too big, split it
- If tasks are too granular, combine them

**Task Independence:**
- Each task should be executable when dependencies are met
- Minimize coupling between tasks
- Clear handoff points between tasks

**Identify:**
- Explicit requirements from the input
- Implicit tasks not stated but necessary
- Dependencies between tasks
- Logical groupings

## Step 4: Create Task Files

For each task, create a file in `.context/tasks/` using this template:

```markdown
# Task: [Clear, Actionable Title]

## Status: pending

## Goal
One sentence describing the outcome.

## Context
Why this matters, background info, relation to other work.

## Acceptance Criteria
- [ ] Criterion 1 (specific, verifiable)
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Notes
Implementation hints, patterns to follow, edge cases.
Reference `.context/patterns-architecture.md` if relevant.

## Files to Touch
- path/to/file1
- path/to/file2

## Dependencies
- [Task ID] - Brief description (if any)

## Complexity: S | M | L | XL

## Progress Log
```

**File Naming Convention:**
```
.context/tasks/
├── 001-short-name.md
├── 002-another-task.md
└── ...
```

- Use 3-digit sequential numbering
- Use lowercase with hyphens
- Keep names short but descriptive (3-5 words)

## Step 5: Update Source Status

**If from epic:**
- Update epic status from "draft" or "ready" to "broken-down"
- Add note in epic: "Broken down into tasks 001-005 on [date]"

**If from investigation:**
- Update investigation status from "investigating" or "ready" to "broken-down"
- Add note in investigation: "Broken down into tasks 001-003 on [date]"

**Status Lifecycle:**
- `draft` → Epic/investigation being written
- `ready` → Ready to be broken down
- `broken-down` → Has been decomposed into tasks
- `completed` → All tasks finished (set by /ctx:sync when all tasks done)

## Step 6: Update Progress Tracker

Add all new tasks to `.context/progress.md`:

```markdown
## Pending
- [ ] 001-task-name - Brief description (from: epic-auth)
- [ ] 002-another-task - Brief description (from: epic-auth)
- [ ] 006-fix-bug - Brief description (from: inv-checkout-bug)
```

Note which epic or investigation each task came from for traceability.

## Step 7: Generate Summary

After creating tasks, provide:

**Summary Statistics:**
- Total tasks created
- By complexity: X small, Y medium, Z large
- Estimated dependencies/blockers

**Task List:**
| # | Task | Complexity | Dependencies |
|---|------|------------|--------------|
| 001 | ... | S | None |
| 002 | ... | M | 001 |

**Source:**
- If from epic: Note which epic file this breakdown came from
- If from investigation: Note which investigation file this breakdown came from

**Recommended First Task:**
Recommend which task to start first based on:
- No blockers
- Foundational work others depend on
- Quick wins for momentum

Suggest: "Start with `/ctx:task [number]` when ready to begin"

## Self-Verification Checklist

Before finalizing, verify:
- [ ] All requirements from source are covered
- [ ] No orphan dependencies (referencing non-existent tasks)
- [ ] No circular dependencies
- [ ] All tasks have clear acceptance criteria
- [ ] Task numbering is sequential with no gaps
- [ ] progress.md is updated
- [ ] File names follow convention

## Quality Standards

**Completeness:** Every requirement should trace to a task
**Clarity:** Tasks should be understandable without the source document
**Actionability:** Someone can start working immediately
**Right-sized:** Not too big (multi-day), not too small (trivial)

## Examples

**Good task title:** "Set up Strapi content types"
**Bad task title:** "Backend stuff"

**Good acceptance criterion:** "User can log in with email/password and receive JWT token"
**Bad acceptance criterion:** "Authentication works"

**Good complexity estimate:**
- S: Single file change, < 50 lines
- M: Multiple files, clear path, 50-200 lines
- L: Multiple components, some unknowns, 200-500 lines
- XL: Significant feature, research needed, 500+ lines

---

## Examples

### Empty Argument (List Epics and Investigations)

```
User: /ctx:breakdown

Assistant checks .context/plans/ and .context/investigations/

Found:
- epic-auth.md (status: ready)
- epic-payment.md (status: draft)
- inv-checkout-bug.md (status: ready)

Assistant shows:
"Available to break down:

Epics:
1. epic-auth.md (ready) - User authentication
2. epic-payment.md (draft) - Payment processing

Investigations:
3. inv-checkout-bug.md (ready) - Checkout 500 error

Which would you like to break down?"
```

### Epic Name

```
User: /ctx:breakdown auth

Assistant finds .context/plans/epic-auth.md
Reads: Summary, Requirements, Technical Considerations, Risks
Creates tasks:
- 001-setup-user-model.md
- 002-implement-registration.md
- 003-implement-login.md
- 004-password-reset-flow.md
- 005-jwt-token-handling.md

Updates epic status to "broken-down"
Adds tasks to progress.md
```

### Ad-hoc Feature

```
User: /ctx:breakdown "Add caching layer"

No epic exists, so this is ad-hoc.
Assistant asks clarifying questions.
Creates tasks based on description.
Note: Less context than epic-based breakdown.
```

---

## Tips (Updated)

- **Prefer epic or investigation-based breakdown** - they provide richer context
- When listing epics/investigations, show status to help user choose
- Update source file status when breaking down
- Link tasks to their source (epic or investigation) for traceability
- Ad-hoc breakdowns are fine for small additions
- If user provides vague description, suggest creating an epic or investigation first
- Use Explore subagent when tasks need specific file paths
