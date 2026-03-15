# Error Handling Convention

Standard error handling behavior for all ctx skills.

---

## Missing Files

When a required context file doesn't exist:

1. **Tell the user** which file is missing and why it's needed
2. **Suggest the skill** that creates it (e.g., "Run `/ctx:vision` first to create vision.md")
3. **DO NOT** create placeholder files silently
4. **DO NOT** proceed with assumptions — missing context leads to low-quality output

**Example:**
```
Cannot proceed: `.context/vision.md` not found.
This file provides project context needed for architecture decisions.

To create it, run: /ctx:vision
```

---

## Malformed Files

When a file exists but is missing required sections (see `file-contracts.md` for required sections):

1. **List** which required sections are missing
2. **Ask the user**: fix manually, or let the skill add the missing sections with defaults?
3. **Never** silently ignore missing data — it will produce incomplete output

**Example:**
```
Found `.context/plans/epic-auth.md` but it's missing required sections:
- ## High-Level Requirements (needed for task breakdown)
- ## Scope (needed to define task boundaries)

Options:
1. I can add placeholder sections for you to fill in
2. You can edit the file manually
3. Re-run /ctx:epic to regenerate
```

---

## Invalid State

When status, numbering, or state doesn't match expectations:

1. **Report** the inconsistency clearly
2. **Suggest** `/ctx:sync` to reconcile if it's a status issue
3. **Ask** before making corrections — don't auto-fix silently

**Example:**
```
Task 003 has status "pending" but 3/5 acceptance criteria are checked.
This looks like a stale status. Run /ctx:sync to reconcile, or I can fix it now.
```

---

## Missing Context Folder

When `.context/` directory doesn't exist:

1. **Inform** the user the context bank is not initialized
2. **Suggest** `/ctx:init` (for existing structure) or `/ctx:start` (for new projects)
3. **DO NOT** create the folder structure from non-init skills

---

## Task Number Conflicts

When creating new tasks and numbering conflicts are detected:

1. **Check both** `.context/tasks/` and `.context/tasks-done/` for the highest number
2. **Never** reuse a number from an archived task
3. **If a gap exists**, continue from the highest number (don't fill gaps)

---

## Dependency Not Met

When a task's dependencies haven't been completed:

1. **Report** which dependency tasks are not done
2. **Show** their current status
3. **Ask** if user wants to proceed anyway (some dependencies may be soft)

---

## Agent Not Available

When a skill needs a project-specific agent (test-runner, build-validator) that isn't configured:

1. **Skip** the agent step gracefully
2. **Inform** the user what was skipped and why
3. **Suggest** how to configure the agent if they want it

**Example:**
```
Note: Skipping test-runner — no agent definition found in .claude/agents/.
Tests were not run automatically. You can:
- Run tests manually
- Configure a test-runner agent in .claude/agents/ for automatic test execution
```
