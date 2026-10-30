---
name: breakdown
description: Decompose an epic into actionable task files in .context/tasks/. Triggers on "break down", "decompose", "create tasks from", "split into tasks", "breakdown". Use when an epic is ready and needs concrete work items. For standalone tasks without an epic, use /ctx:create-task.
argument-hint: "[epic name or file path]"
allowed-tools: Read, Write, Edit, Glob, Bash, AskUserQuestion, Task
---

# Task Breakdown

Break down an epic, feature, plan, PRD, or idea into actionable task files following the project's context bank structure.

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

Delegate to **Explore** (built-in, read-only) rather than reading the codebase yourself
whenever the answer needs a sweep instead of a single known file:

- Finding the files each task will touch, so `## Files to Touch` is real and not a guess
- Mapping the blast radius of a refactor across modules
- Checking whether something in the epic already exists in the codebase

Send one Explore per independent question and let them run together — a breakdown that
needs file paths for six tasks should not read fifty files in the main thread.

Do NOT delegate: writing the task files, the domain impact check, or anything that
needs the user's answer.

## Input

`$ARGUMENTS` can be:
- Epic name: `/ctx:breakdown epic-auth` or `/ctx:breakdown auth`
- Epic file path: `/ctx:breakdown .context/plans/epic-auth.md`
- Feature description: `/ctx:breakdown Add user authentication` (ad-hoc, not from epic)
- Other file path: `/ctx:breakdown .context/portfolio-v1-plan.md`
- Empty: List available epics, ask which to break down

## Step 1: Analyze Input

**If empty (no arguments):**
1. Check for epic files in `.context/plans/`
2. If epics exist:
   - List all epics with their status
   - Show which have been broken down already
   - Ask: "Which epic would you like to break down?"
3. If none exist:
   - Ask: "What would you like me to break down? (describe a feature or provide a file path)"

**If epic name or path provided:**
- Look for matching epic file in `.context/plans/`
- Read the epic file
- **E0–E7 epic:** extract the rules and examples (E6), the answers (E0), scope (E3),
  the design (E4), and the flows and screens (E5). E6 is what gets decomposed; E0 and E6 are the only sources for
  expected values.
- **Older epic** (`## High-Level Requirements`, no E6): extract Summary, Requirements,
  Technical Considerations, Risks, as before. The no-new-rules rule in Step 3 still
  applies, with requirement numbers in place of rule IDs.
- **Checklist binding:** follow the `checklist` skill and read the slice for `breakdown`,
  using the epic's `Size:` line (see `../../shared/conventions/checklist-binding.md`).

**If other file path provided:**
- Read the file
- Identify type (PRD, plan, feature spec, idea list)
- Extract all actionable items

**If feature description provided (ad-hoc):**
- Understand the scope
- Run the **input pass** of the spec-quality scan
  (`../../shared/conventions/spec-quality.md` → When it runs) over the description as
  the user wrote it. Turn each smell into a clarifying question in the same turn — a
  vague description breaks down into vague tasks, and nothing downstream recovers it
- Ask clarifying questions if ambiguous
- Note: This is ad-hoc breakdown without epic context

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.
See `../../shared/conventions/file-contracts.md` for required file sections.
See `../../shared/conventions/spec-quality.md` for the acceptance-criteria scan.
See `../../shared/conventions/ownership.md` for labels, citations, and gates.

Skill-specific errors:
- **Epic has neither `E6 · Rules and examples` nor `## High-Level Requirements`**: Cannot break down — inform user, suggest updating epic with `/ctx:epic <path>`
- **Epic status is `draft`**: The ownership gate has not passed. List what blocks it (status lines still at `[Claude-proposed]`, `?` values, open blocking questions) and suggest `/ctx:epic <path>`. Break down anyway only if the Owner says so, and say that the tasks will carry `?` where the epic does
- **`.context/tasks/` doesn't exist**: Suggest running `/ctx:start` (new project) or `/ctx:onboard` (existing project) first
- **Epic status is `broken-down`**: Warn user this epic was already decomposed. Ask if they want to add more tasks (continue numbering) or re-breakdown (will not delete existing tasks)

## Step 2: Check Context Bank

Check if `.context/tasks/` exists:
- If yes, get the highest number in use with the canonical scan — `tasks-done/` is
  nested by epic, so a flat `ls` of it returns directory names and misses every
  archived task:
  ```bash
  find .context/tasks .context/tasks-done -name '[0-9][0-9][0-9]*.md' 2>/dev/null \
    | sed 's#.*/##' | grep -oE '^[0-9]+' | sort -n | tail -1
  ```
  A breakdown mints a whole block of numbers, so a wrong starting point duplicates
  every one of them. See `../../shared/conventions/task-naming.md`.
- If no, suggest running `/ctx:start` (new project) or `/ctx:onboard` (existing project) first

Read `.context/patterns-architecture.md`, `.context/decisions.md`, and `.context/domain.md` (if exists) for project context. When domain.md exists, use domain rule IDs in acceptance criteria for traceability (e.g., "Validate ORD-001: Order must contain at least one Line Item").

## Step 2.5: Domain Impact Check

If `.context/domain.md` exists:
- Compare entities/flows/rules in the source document against domain.md
- If the source references entities NOT in domain Glossary, or implies rules/flows not captured:
  - Generate proposed domain changes using Domain Impact Protocol format:
    ```
    📘 Glossary — adding: ...
    📋 Flows — updating: ...
    📏 Rules — adding: ...
    ```
  - Present to user: "Before breaking down, this epic references domain concepts not yet documented:"
  - **Wait for user confirmation** → update domain.md → then proceed with breakdown
  - This ensures tasks get accurate domain-aware acceptance criteria

## Step 2.7: Skill Discovery

Find the specialized skills already installed in this session that the upcoming tasks
should use. This is a one-time pass per breakdown — the result is written into the task
files so `/ctx:task` never has to repeat it.

### Where the list comes from

**Start from the skills already listed in your context.** Claude Code puts every
available skill — project, user, and plugin — in front of you with its name and
description before this skill ever runs. That list is the authority. Reading it costs
nothing and it is the only source that sees plugin skills at all.

Do NOT try to enumerate skills by globbing the filesystem. `.claude/skills/*/` and
`~/.claude/skills/*/` miss every plugin skill, and the plugin cache holds several
versions of the same plugin in two different directory layouts — a glob there will
match stale copies.

### When to match

Only when the epic mentions work a specialized skill would cover:
- E2E tests, spec files, Playwright, Cypress
- Database migrations, schema changes, Prisma, TypeORM
- Style review, CSS audit, UI review
- Deployment, CI/CD pipeline
- Performance audit, security scan
- Any domain-specific tooling

If the epic is purely business logic, CRUD, or standard code — skip this step entirely.

### How to match

1. **Compare each available skill's description against the epic's requirements:**
   - Does the skill's trigger match a file type in the epic? (`*.spec.ts`, `*.prisma`)
   - Does its description cover a kind of work this epic contains?

2. **If matches found**, add to the epic file:

```markdown
## Specialized Skills
- **[skill-name]** — [one-line what it does] → tasks [NNN, NNN, NNN]
```

3. **Write the skill name into the matching task files** (see the Step 4 template) — by
   name only. `/ctx:task` invokes it by name; a path recorded today goes stale the next
   time the skill moves or the plugin updates.

### If no skills match

Skip silently. Tasks proceed with standard `patterns-architecture.md` guidance.

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
- Implicit tasks not stated but necessary (scaffolding, migration, wiring)
- Dependencies between tasks
- Logical groupings

**Slicing is the Owner's call, and it is the conversation of this skill.** The logic
is already in the epic, so the breakdown decides only three things with the Owner:

1. **The slices:** title, the flows, screens, and AC IDs each one covers, and why it is
   separate. Every AC in the epic's AC table lands in exactly one slice; an AC in no
   slice, or in two, is a finding to raise.
2. **The order and dependencies** between slices.
3. **Where the steps live:** one or two slices → the epic's **Tasks** section, no task
   files (recommend this). Three or more → one task file per slice.

Ask in one batch and wait for the answers before writing anything. Record each
confirmed slice with the provenance label `[Owner]`. When the Owner confirms the slices,
set the T1 and T2 status lines of each task (or of the epic's Tasks section) to `[Owner]`.

**The epic has no AC table** (an older epic, or phase 4 not done): say so, and suggest
finishing it with `/ctx:epic`. Continue only if the Owner says so; the tasks then
carry their own AC wording, as older tasks did.

**Breakdown never invents rules.** Everything a task asserts about behavior comes from
the epic:

- **Every AC references a rule ID** (`R3`), or a requirement number for an older epic.
  Implicit technical tasks (scaffolding, a migration) reference the rule they enable.
- **Every expected value cites its source**: an E6 example (`R3.2`), a rule ID, or an
  answer `[Q-n]`. Copy it unchanged.
- **No source → `?`.** Write `expected: ? → Q-n` in the AC and add the question to the
  epic's **E0 · Questions** with the Owner as the one to answer. Never fill the value
  with a plausible guess.
- **A behavior the epic does not cover** (you found a case while slicing) is a new
  question in E0, not a new rule and not a new AC.

## Step 4: Create Task Files (or the Tasks section)

**One or two slices, Owner chose the Tasks section:** fill the epic's **Tasks**
section from `../../shared/templates/epic-template.md`, one checkbox line per slice with
the IDs it covers. Write no task files. Skip to Step 5.

**Otherwise**, create one file per slice in `.context/tasks/` using the **Size L task**
shape from `../../shared/templates/task-template.md`: the `Size:` line (`Size: L · from
epic-<name>`), `## Status: pending`, **T1 · Slice**, **T2 · Acceptance Criteria**, an
empty **T3 · Approach**, Technical Notes, Files to Touch, Dependencies, Complexity,
Verification, **T4 · Progress Log**, an empty **T5 · Test Results**, and **T6 ·
Release** only on the task that releases the feature.

What Claude fills, and what it leaves:

| Part | Who | Notes |
|---|---|---|
| T1 Slice | Owner confirmed in Step 3 | Flow, screen, and rule IDs from E5 and E6 |
| T2 AC | Claude | AC IDs and their rule IDs from the epic's AC table. No wording copied |
| T3 Approach | empty | `/ctx:task` fills it with the Owner when the task starts, after reading the code |
| Files to Touch | Claude, a first guess | Confirmed in T3 |
| T4, T5 | empty | T5 is filled when the task is tested |
| T6 | Claude drafts rollback and watch list from E4 | Only on the releasing task |

<!-- If a specialized skill was matched in Step 2.7, add to Technical Notes.
     Record the skill NAME only — the name is how /ctx:task invokes it, and it stays
     correct when the skill moves or its plugin updates. Never record a file path. -->
```markdown
**Specialized Skill:** [skill-name] — [one line on what it covers for this task]
**Key sections to read:** [§Section1, §Section2] (only the sections relevant to this task)
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

### Spec Check

**Epic with an AC table:** the spec check ran on the epic, so skip the draft pass.
Check coverage only: every AC in the table is in exactly one slice, and every slice
names at least one AC. Report gaps in Step 7.

**Older epic without an AC table:** before writing the files, run the **draft pass** from
`../../shared/conventions/spec-quality.md` over every task's **Acceptance Criteria**.
Draft each criterion into an EARS pattern, then run both set-level checks from Part 2
per task: a task whose goal is a measurable improvement needs at least one criterion
stating the **target number** (not merely that a before-and-after will be recorded),
and each task needs at least one criterion covering a failure path.

Then check **traceability** per task: every AC names a rule ID and an expected source
(or `?`). An AC with neither is a finding, and its rewrite adds the citation or the
`?`.

Findings are **warnings only** — write the task files regardless. Apply the obvious
rewrites yourself, and report one consolidated block in Step 7 covering all tasks, not
one block per task. Cap it at 5 findings across the whole breakdown. Use the block
format from Part 4 — prefix each location with the task number (`012 AC 3`, `012 set`)
— never prose, and never a finding without a `→` replacement sentence.

## Step 5: Update Source Status

**If from epic:**
- Update epic status from "ready" (or "draft", when the Owner chose to proceed) to "broken-down"
- Add note in epic: "Broken down into tasks 001-005 on [date]"
- Add any new questions raised in Step 3 to the epic's **E0 · Questions**

**Status Lifecycle** (see `shared/conventions/status-lifecycle.md` for full reference):
- `draft` → Being written
- `ready` → Ready to be broken down
- `broken-down` → Has been decomposed into tasks, and stays here for the whole time
  those tasks are being worked on. There is no epic-level `in-progress`.
- `completed` → All tasks finished, archived to plans-done/ (set by /ctx:sync)

## Step 6: Update Progress Tracker

Add all new tasks to `.context/progress.md`:

```markdown
## Pending
- [ ] 001-task-name - Brief description (from: epic-auth)
- [ ] 002-another-task - Brief description (from: epic-auth)
- [ ] 006-fix-bug - Brief description (from: epic-checkout-500)
```

Note which epic each task came from for traceability.

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

**Spec check:**
- The consolidated block from Step 4 (one line if clean)

**Open for the Owner:**
- Every `?` expected value, with its task, AC, and question number
- New questions added to E0

**Checklist (binding on only):** the end-of-phase report from `checklist-binding.md`.

**Recommended First Task:**
Recommend which task to start first based on:
- No blockers
- Foundational work others depend on
- Quick wins for momentum

Suggest: "Start with `/ctx:task [number]` when ready to begin"

## Quality Standards & Self-Verification

For quality standards, self-verification checklist, and complete examples, read `references/examples.md`.

Key points:
- Every requirement traces to a task
- Tasks understandable without source document
- Verify: no orphan/circular dependencies, sequential numbering, progress.md updated

---

## Tips

- **Prefer epic-based breakdown** - an epic provides far richer context than a one-line description
- When listing epics, show status to help the user choose
- Update the epic's status when breaking it down
- Link tasks to their epic for traceability
- Ad-hoc breakdowns are fine for small additions
- If the user provides a vague description, suggest creating an epic first
- Delegate to Explore when tasks need specific file paths

## Gotchas

- **Domain Impact Check BEFORE breaking down**: If epic references entities/flows/rules not in domain.md, propose domain updates first. Do not create tasks that reference undocumented domain concepts.
- **Never `ls` tasks-done/ to find the highest number**: it is nested by epic, so a flat listing returns folder names and every archived task goes unseen. Use the `find … | sort -n` scan from Step 2. A breakdown assigns a block of numbers at once, so one bad starting point duplicates the entire block.
- **XL tasks should become separate epics**: If a single task estimates >500 lines or 8+ files, it's too big. Split it or suggest a sub-epic.
- **Skill Discovery matches ONCE per breakdown**: Do not repeat it per task. Match against the available-skills list once, then write the skill names into the task files.
- **Record skill names, never skill paths**: a path goes stale when the skill moves or its plugin updates; the name is what `/ctx:task` invokes.
- **No new rules in a breakdown**: a case the epic does not cover becomes a question in E0, never an AC. An AC without a rule ID is an invented rule.
- **Expected values come from E0 or E6, never from the code or from what seems reasonable**: no source means `?`.
- **The Owner confirms the slices before files are written**: slicing is logic.
- **Never copy AC wording into a task**: a copy drifts the day the epic changes. Cite the
  AC ID; the wording stays in the epic.
- **Never fill T3 at breakdown**: the approach is decided with the Owner when the task
  starts and the code is read, not before.
- **Never tick the checklist**: the binding is read-only.
- **Epic must have rules or requirements**: An epic in "draft" has not passed the ownership gate; break it down only when the Owner says so.

