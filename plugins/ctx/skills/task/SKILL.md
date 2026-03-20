---
name: task
description: Load a task file and continue working on it
argument-hint: "[task number or name]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Continue Task

Load and work on a specific task from `.context/tasks/` (active tasks only).

## Folder Structure

- `.context/tasks/` - Active tasks (pending, in-progress, blocked)
- `.context/tasks-done/` - Archived done tasks (read-only reference)

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.

Skill-specific errors:
- **Task not found in `tasks/`**: Report not found, do NOT search `tasks-done/`. Suggest `/ctx:progress` to see available tasks.
- **Task missing `## Acceptance Criteria`**: Warn user the task has no ACs — cannot track completion properly. Suggest adding ACs before starting.
- **Task missing `## Status`**: Treat as `pending`, but warn user about malformed file.
- **Task status is `blocked`**: Show blocker reason, ask if user wants to proceed anyway.
- **Task status is `done`**: Inform user this task is already complete. Suggest `/ctx:sync` to archive it.

## Input

`$ARGUMENTS` - Task number or name (e.g., "002" or "bento-grid")

If empty, ask user which task to work on.

## Steps

1. **Find task file:**
   ```
   .context/tasks/*$ARGUMENTS*.md
   ```

   Note: Only search in `tasks/`, not `tasks-done/`. Done tasks are archived and shouldn't be reopened.

2. **Read context:**
   - Task file
   - `.context/patterns-architecture.md` (if exists)
   - `.context/domain.md` (if exists) — read domain rules referenced by task acceptance criteria
   - Check task status and dependencies

3. **Load specialized skill (if referenced):**

   Check `## Technical Notes` for a `**Specialized Skill:**` line.

   **If found:**
   - Read ONLY the sections listed in `**Key sections to read:**` from the referenced SKILL.md
   - Do NOT read the entire skill file — only the relevant sections, to keep context lean
   - Follow the skill's guidelines for the ACs in this task alongside patterns-architecture.md
   - Note in progress log: `- [date] Using [skill-name] for [what]`

   **If not found:**
   - Proceed normally with patterns-architecture.md guidance only

   **Fallback discovery** (only if no skill reference in task, AND AC clearly needs specialized work):
   - If an AC mentions writing spec/test files, migrations, or other specialized artifacts
     but no skill was referenced (e.g., task was created by `/ctx:create-task`, not breakdown):
   - Quick glob: `.claude/skills/*/SKILL.md` and `~/.claude/skills/*/SKILL.md`
   - Read frontmatter only (name + description) — match against AC
   - If match found, ask user: "Found skill [name] for this work. Use it? (yes/no)"
   - If yes: read relevant sections, add `**Specialized Skill:**` to Technical Notes for future reference
   - If no: proceed normally

4. **Verify ready:**
   - Status should be `pending` or `in-progress`
   - Dependencies should be done
   - If blocked, report why

5. **Begin work:**
   - Update status to `in-progress` if pending
   - Add progress log entry: `- [date] Started`
   - Work through acceptance criteria in order

6. **During work:**
   - Follow patterns from patterns-architecture.md
   - If a specialized skill is loaded, follow its guidelines for relevant ACs
   - Update progress log with significant milestones
   - If blocked, update status and note blocker
   - **AC tracking (MANDATORY):** After completing work for an acceptance criterion, immediately edit the task file to change `- [ ]` to `- [x]` for that item. Do NOT defer this — update the checkbox as soon as the criterion is satisfied.

7. **On completion (MANDATORY):**
   After all acceptance criteria are checked `[x]`:
   - Change `## Status: in-progress` to `## Status: done` in the task file
   - Add progress log entry: `- [date] Done — all ACs satisfied`
   - Do NOT leave status as `in-progress` when all ACs are done

8. **Domain check on completion:**
   If the task references domain rule IDs (e.g., ORD-001, PAY-002) in its acceptance criteria:
   - Ask: "This task referenced domain rules [list IDs]. Did the implementation match these rules exactly, or did business logic change?"
   - If user says logic changed → generate proposed domain updates using Domain Impact Protocol format → show to user → require confirmation → update `domain.md`
   - If user says matched exactly → no action needed

   If during implementation you discover code behavior contradicts a domain rule:
   - **STOP** — report the conflict: "[Rule ID] says X, but code does Y. Is this a bug or a stale rule?"
   - Wait for user decision before proceeding

## Output

Confirm task loaded and show:
- Goal
- Acceptance criteria (with current status)
- Next action to take
