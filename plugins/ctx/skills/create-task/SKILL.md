---
name: create-task
description: Create a single task file from a brief description, independent of any epic. Triggers on "create task", "new task", "quick task", "add a task for", "I need to fix/add/update X". Use for one-off tasks, bug fixes, or small work that doesn't warrant a full epic. For epic-based tasks, use /ctx:breakdown.
argument-hint: "[brief task description or issue]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion, Task
---

# Create Standalone Task

Generate a standalone task file from brief user input. Unlike `/ctx:breakdown` which decomposes an epic, this skill creates **individual tasks directly** without requiring an epic.

**Scope:** This skill strictly focuses on **scoping and planning**. Task creation only—implementation happens when user explicitly requests "Work on this task" or uses `/ctx:task [NNN]`.

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

This skill uses:
- **Explore** (built-in) - For analyzing codebase context when creating tasks that touch existing code
- **general-purpose** (built-in) - For researching technical approaches or best practices when needed

**When to use Explore:**
- When task involves modifying existing code
- When need to understand current implementation patterns
- When identifying affected files for the task

---

## Input

`$ARGUMENTS` can be:
- Brief task description: `/ctx:create-task "Fix slow dev server startup"`
- Issue description: `/ctx:create-task "Investigate performance bottleneck in API"`
- Feature request: `/ctx:create-task "Add rate limiting to auth endpoint"`
- Bug report: `/ctx:create-task "Login form validation not working"`
- Empty: Ask user what task they want to create

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.
See `../../shared/conventions/file-contracts.md` for required output sections.
See `../../shared/conventions/spec-quality.md` for the acceptance-criteria scan.
See `../../shared/conventions/ownership.md` for size, labels, and Owner-first writing.

Skill-specific errors:
- **`.context/tasks/` doesn't exist**: Suggest running `/ctx:start` (new project) or `/ctx:onboard` (existing project) first
- **`progress.md` doesn't exist**: Create it from template after task creation
- **Task numbering conflict**: Always check both `tasks/` and `tasks-done/` for highest number

---

## When to Use This Skill

**Use this skill when:**
- User wants to create a single task quickly without an epic
- Task is not part of a larger feature/epic
- Task is a bug fix, a small enhancement, or a piece of digging with a known scope
- User provides brief description that needs expansion

**Do NOT use this skill when:**
- User wants to break down an epic (use `/ctx:breakdown` instead)
- Multiple related tasks need to be created (use `/ctx:epic` then `/ctx:breakdown` instead)
- The bug's cause is unknown and the fix may span several places (use `/ctx:epic` — see `../../shared/workflows/bug-flow.md`)

---

## Workflow

### Step 1: Understand the Request

If no description provided, ask:

```
What task would you like to create?

Examples:
- "Fix slow dev server performance"
- "Add input validation to contact form"
- "Investigate database query performance"
- "Update dependencies to latest versions"
```

**Scan the description before doing anything else.** Run the **input pass** of the
spec-quality scan (`../../shared/conventions/spec-quality.md` → When it runs) over the
user's own words. This is where the smells actually are — by the time you have
researched the code and drafted criteria, the ambiguity has been silently resolved
into implementation steps and the draft pass will find nothing.

Each smell becomes a clarifying question, not a warning. "Make the blog load faster"
carries *comparative without baseline*, so the question is "faster than what number,
and what would count as fast enough?" Ask it in the same turn as the questions below.

**Size the work (Owner decides).** Name the risk signs you see
(`../../shared/conventions/ownership.md` → Size) and ask the Owner for the size and a
one-line reason, in the same turn as the questions below.
- **L** → suggest `/ctx:epic` instead; continue only if the Owner insists.
- **M** → a standalone task with its own Problem, Questions, and Rules (Step 3).
- **S** → no file is needed. Say so; create one only if the Owner asks, in the old
  short shape (no Problem, Questions, Rules, T3, T5, T6).

**If description is too brief or ambiguous:**
Use AskUserQuestion to clarify:
- What is the expected outcome?
- What files or components are affected?
- Are there specific constraints or requirements?
- What is the priority/urgency?
- Whatever the input pass surfaced

**Example clarification questions:**

```markdown
I need more details to create an effective task:

1. **Scope**: Is this a bug fix, feature, investigation, or refactor?
2. **Affected Area**: Which part of the codebase (landing page, API, shared libs)?
3. **Success Criteria**: How will we know this is complete?
4. **Priority**: Is this blocking other work?
```

---

### Step 2: Analyze Project Context

**Read relevant context files:**

1. **Check task numbering:**

   Run the canonical scan — `tasks-done/` is nested by epic, so a flat `ls` of it
   returns directory names and misses every archived task:
   ```bash
   find .context/tasks .context/tasks-done -name '[0-9][0-9][0-9]*.md' 2>/dev/null \
     | sed 's#.*/##' | grep -oE '^[0-9]+' | sort -n | tail -1
   ```
   Next number = that + 1. See `../../shared/conventions/task-naming.md` → Finding Next Number.

2. **Read project patterns:**
   - `.context/patterns-architecture.md` for coding standards
   - `.context/patterns-design-system.md` if UI-related
   - `.context/testing-guide.md` for test requirements

3. **Check progress:**
   - `.context/progress.md` to understand current project state

4. **Analyze codebase (if needed):**
   Use Explore subagent to:
   - Find affected files
   - Understand current implementation
   - Identify patterns to follow

**Example Explore prompt:**

```
Find the landing page development server configuration in this Nx monorepo.

Look for:
1. apps/landing/project.json - build/serve configuration
2. Any vite.config.ts or webpack config
3. nx.json - cache and task runner settings
4. tsconfig files that might affect build time

Report: file paths and relevant configuration snippets
```

---

### Step 3: Draft Task Content

Use the **Size M task** shape from `../../shared/templates/task-template.md`. The
logic parts come from the Owner, the mechanics from Claude:

| Part | Who writes it |
|---|---|
| `Size:` line | Owner (Step 1) |
| Problem, Done when | Owner. Ask for them; write them labeled `[Owner]` |
| Questions | Claude adds every gap it sees as a question for the Owner, instead of an answer |
| Approach | Claude lays out the options, blast radius, and rabbit holes; the Owner chooses and gives one sentence of why |
| Rules and examples, expected values | Owner. Claude adds boundary examples with `?` unless a rule fixes the value. A draft written at the Owner's request gets the status line `[Claude-proposed]` |
| T2 AC | Claude, in EARS, each citing a rule and its expected source, or `?` |
| T3 Test Design, Technical Notes, Files, Complexity, Verification | Claude |
| T4, T5 | empty |
| T6 Release | Claude drafts rollback and the production smoke test |

**Checklist binding:** follow the `checklist` skill and read the slice for `epic` and
`breakdown` against lane M (see `../../shared/conventions/checklist-binding.md`): a size M
task holds both.

For **size S** (only when the Owner asked for a file), keep the short shape:

```markdown
# Task: [Clear, Actionable Title]

Size: S · [reason]

## Status: pending

## Goal
One sentence describing the desired outcome.

## Acceptance Criteria
- [ ] Specific, measurable criterion

## Files to Touch

## Complexity: S

## Verification: none | test | full

## Progress Log
```

**Complexity Guidelines:**
- **S (Small):** Single file, < 50 lines, clear path, < 1 hour
- **M (Medium):** 2-3 files, 50-200 lines, straightforward, 1-3 hours
- **L (Large):** Multiple files/components, 200-500 lines, some unknowns, 3-8 hours
- **XL (Extra Large):** Significant scope, research needed, 500+ lines, > 8 hours

---

### Step 3.5: Spec Check

Run the **draft pass** from `../../shared/conventions/spec-quality.md` over the
**Acceptance Criteria** just drafted. Draft each criterion into an EARS pattern, then
run both set-level checks from Part 2:

- **Threshold** — if the Goal is a measurable improvement (faster, lighter, fewer
  errors), at least one criterion must state the number to reach. A set where every
  line is work to perform or a measurement to record passes completely while nothing
  actually improves. This is invisible line by line, so check it against the set.
- **Failure path** — at least one criterion covers what happens when something goes
  wrong.

Also check **traceability**: every AC cites a rule (R1) and an expected source, or
`?` with a question.

Findings are **warnings only**. Never withhold the draft, never demand a fix, never
ask a separate approve-the-warnings question. Apply the obvious rewrites into the
draft yourself, and carry the report block into Step 4 so the user sees what changed.
Use the block format from Part 4 — location, smell, `→` rewrite — never prose, and
never a finding whose second line is advice instead of a replacement sentence.

---

### Step 4: Present Draft to User

Show the task content to the user for review:

```markdown
## Task Draft Ready

**Title:** [task title]
**Complexity:** [S/M/L/XL]
**Files Affected:** [count] files

### Summary
[Brief summary of what the task will accomplish]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

[Spec check block from Step 3.5 — one line if clean]

### Open for the Owner
- [Every status line still at `[Claude-proposed]` with the items it names, every `?` value, and every open question — or "none"]

---

[Show full task content in expandable section or truncated preview]

**Would you like to:**
1. ✅ Create this task as-is
2. ✏️ Modify something (I can adjust based on your feedback)
3. ➕ Add more details or context
4. ❌ Cancel
```

---

### Step 5: Create Task File (If Approved)

**If user approves:**

1. **Determine task number:**
   - Highest number = the `find … | sort -n | tail -1` scan from Step 2 (covers
     `tasks/` **and** every epic subfolder under `tasks-done/`)
   - Increment by 1
   - **Then confirm it is free before writing** — this must print nothing:
     ```bash
     find .context/tasks .context/tasks-done -name '<NNN>-*.md' -o -name '<NNN>[a-z]-*.md'
     ```
     If it prints a path, increment and check again. Writing a number that is
     already taken silently forks the task history.

2. **Create filename:**
   ```
   .context/tasks/[NNN]-[kebab-case-name].md
   ```
   - Use 3-digit zero-padded number (001, 002, ..., 065)
   - Use lowercase with hyphens
   - Keep name short but descriptive (3-5 words)

3. **Write task file:**
   Use Write tool to create the task file with full content

4. **Update progress.md:**
   Add task to "Pending" section:
   ```markdown
   ## Pending
   - [ ] [NNN]-[name] - [Brief description] (standalone)
   ```

   Note: Use "(standalone)" to distinguish from epic-based tasks

---

### Step 6: Confirm Creation

Provide confirmation summary:

```markdown
## ✅ Task Created Successfully

**Task Number:** [NNN]
**File:** `.context/tasks/[NNN]-[name].md`
**Complexity:** [S/M/L/XL]
**Status:** pending

### 📋 Task Summary
[One-sentence summary of what needs to be accomplished]

### 🎯 Next Steps

**To start working on this task:**
- Say: "Work on this task" or "Start task [NNN]"
- Or use: `/ctx:task [NNN]`

**Other options:**
- View all pending tasks: `/ctx:progress`
- Create more tasks: `/ctx:create-task [description]`

**Note:** This is a standalone task (not part of an epic). If you need related tasks, consider creating an epic with `/ctx:epic` first.
```

---

## Quality Standards

For full quality standards, examples, self-verification checklist, and skill integration table, read `references/quality-standards.md`.

Key points:
- Task titles: actionable verb + specific subject, < 60 chars
- ACs: specific, measurable, testable
- Always verify with self-verification checklist before finalizing

---

## Tips

- **Be thorough in clarification** - Better to ask too many questions than create incomplete tasks
- **Use Explore for context** - Don't guess about file paths or current implementation
- **Reference project standards** - Always check patterns-architecture.md and other context files
- **Right-size tasks** - If task feels too big, suggest breaking it down or creating an epic
- **Clear acceptance criteria** - Make it obvious when task is complete
- **Update progress.md** - Always add new task to progress tracker
- **Standalone ≠ Isolated** - Task is standalone in planning, but should align with project architecture

---

## Notes

- **Standalone tasks are valid** - Not everything needs to be part of an epic
- **Quick task creation** - This skill optimizes for speed while maintaining quality
- **User confirmation required** - Always get approval before creating the file
- **Context-aware** - Tasks should align with project architecture and patterns
- **Flexible scope** - Can create tasks for bugs, features, investigations, refactors, etc.

## Gotchas

- **Plan only, do not implement**: This skill creates the task file. It does NOT start working on the task. Suggest `/ctx:task NNN` after creation.
- **Never `ls` tasks-done/ to find the highest number**: it is nested by epic, so a flat listing returns folder names and every archived task goes unseen — the exact way duplicate task IDs get minted. Use the `find … | sort -n` scan, and check the chosen number is free before writing.
- **Logic is the Owner's**: problem, done, rules, and expected values come from the Owner. Gaps become questions in the task's Questions table, not answers. Never write `[Owner]` on your own draft. When the Owner approves a section, set its status line to `[Owner]`.
- **Size S needs no file**: say so before drafting one.
- **User must approve before file creation**: Always show the draft task and get explicit confirmation. Do not create the file silently.
- **Standalone tasks are marked differently in progress.md**: Use "(standalone)" label so they're distinguishable from epic-sourced tasks.

