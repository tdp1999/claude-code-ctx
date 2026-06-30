---
name: task
description: Load a task file from .context/tasks/ and work on it, following acceptance criteria and patterns. Triggers on "work on task", "start task", "continue task", "task NNN", "pick up where I left off", "next task". Use when user wants to implement a specific task.
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
   - **If the referenced path does not resolve** (e.g., an older task hardcoded
     `~/.claude/skills/<name>/SKILL.md` but the skill lives project-level — or vice
     versa), re-discover by globbing `.claude/skills/<name>/SKILL.md` then
     `~/.claude/skills/<name>/SKILL.md` and read whichever exists (project-level
     wins). Do not abort on a stale path. These globs use forward slashes + `~`,
     which Claude Code resolves on macOS, Linux, and Windows alike.
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

5. **Brief the user & reconcile approach (MANDATORY — before beginning work):**

   Do NOT jump straight into implementation. First produce a briefing with two parts and show it to the user.

   **5a. Explain what the task is and its context:**
   - Assume the user has NO knowledge of this specific task or the epic/investigation it belongs to — but DOES have a general understanding of the overall system. Write for that reader.
   - In plain language (avoid internal jargon and bare rule IDs — expand them), explain:
     - **What this task accomplishes** and the concrete problem/need it addresses
     - **Why it exists** — the parent epic (`.context/plans/epic-*.md`) or investigation it came from, and how this task fits into that larger goal
     - **Where it sits in the bigger picture** — what depends on it, what it unblocks, what part of the system it touches
   - Keep it tight but genuinely explanatory — enough that someone seeing the task cold understands the "why" before the "how".

   **5b. Present the approach — task's vs. yours after verification:**
   - First summarize the approach the **task file prescribes** (from its acceptance criteria and `## Technical Notes`).
   - Then **scan and verify the actual code** the task references (files, functions, APIs, current behavior). Tasks are often written well before they are picked up, so their assumptions can be stale — files moved or renamed, APIs changed, part of the work already done, or the described state no longer matching reality.
   - Present **your recommended approach** after that verification, and **explicitly flag any mismatch** between what the task assumes and the current state of the code. For each mismatch note: what the task assumed, what you actually found, and how it changes the plan.
   - **If there is a significant mismatch** (stale assumptions, work already partially done, a materially better approach), pause and confirm the direction with the user before proceeding. If everything lines up, say so and continue.

6. **Begin work:**
   - Update status to `in-progress` if pending
   - Add progress log entry: `- [date] Started`
   - Work through acceptance criteria in order

7. **During work:**
   - Follow patterns from patterns-architecture.md
   - If a specialized skill is loaded, follow its guidelines for relevant ACs
   - Update progress log with significant milestones
   - If blocked, update status and note blocker
   - **AC tracking (MANDATORY):** After completing work for an acceptance criterion, immediately edit the task file to change `- [ ]` to `- [x]` for that item. Do NOT defer this — update the checkbox as soon as the criterion is satisfied.

8. **On completion (MANDATORY):**
   After all acceptance criteria are checked `[x]`:
   - Change `## Status: in-progress` to `## Status: done` in the task file
   - Add progress log entry: `- [date] Done — all ACs satisfied`
   - Do NOT leave status as `in-progress` when all ACs are done

9. **Verification on completion:**
   Read the task's `## Verification:` field (none / test / full).
   If config `verification.carefulMode` is true → treat as `full` regardless.

   - **none**: Skip verification entirely.
   - **test**: Check if a test-runner agent exists (glob `.claude/agents/test-runner*` then `~/.claude/agents/test-runner*` — project-level wins).
     - If found → suggest: "Run tests for affected code? (yes/no)"
     - If not found → suggest: "Consider running tests manually before marking complete."
   - **full**: Check for both test-runner and build-validator agents.
     - If found → suggest: "Run tests and build validation? (yes/no)"
     - If not found → suggest: "Consider running tests and build manually."
   - NEVER auto-run — always ask user first.

10. **Suggest commit (discovery-based):**
    After task completion, if a commit-related skill is available:
    - Quick glob: `.claude/skills/*/SKILL.md` and `~/.claude/skills/*/SKILL.md` — scan frontmatter for "commit" or "push" in description
    - If found → suggest: "Task complete. Use [skill-name] to commit with task ID in scope? e.g., `feat(task-NNN): [goal]`"
    - If not found → suggest: "Task complete. Consider committing with task reference: `feat(task-NNN): [goal]`"

11. **Domain check on completion:**
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

## Gotchas

- **Brief before building**: Always run step 5 (explain the task + reconcile the approach) before touching code. Skipping straight to implementation is wrong even when the task looks trivial — the explanation and the staleness check are the point.
- **Trust the code over the task file**: Tasks can be written long before they're picked up. Verify the task's assumptions against the actual code, and flag mismatches instead of blindly following a stale plan.
- **Only search tasks/, never tasks-done/**: Done tasks are archived and read-only. If user asks for a completed task, inform them it's in tasks-done/ but do not re-open it.
- **AC checkbox updates are MANDATORY and immediate**: Update `- [ ]` to `- [x]` the moment an acceptance criterion is satisfied. Do not batch updates at the end.
- **Code vs domain conflict = STOP**: If implementation contradicts a domain rule (referenced by Rule ID in ACs), stop work immediately. Report the conflict and wait for user decision.
- **Blocked tasks need a reason**: If a task cannot proceed, update status to `blocked` and document why. Do not silently skip to another task.
- **Verification field controls post-completion behavior**: Check the task's `Verification:` field. Only suggest test/build runs when the level warrants it (see config-convention).

---

## Final Step — Execution Log

If `${CLAUDE_PLUGIN_DATA}` is set and config `logging.enabled` is true:
- Append one JSONL line to `${CLAUDE_PLUGIN_DATA}/ctx-logs/execution.jsonl`
- Fields: `ts` (ISO-8601), `skill` ("ctx:<name>"), `project` (cwd basename), `args`, `outcome` ("success"|"failure"|"partial"|"corrected"), `failure_type`, `failure_detail`
- See `shared/conventions/logging-convention.md` for schema
