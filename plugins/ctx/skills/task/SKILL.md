---
name: task
description: Load a task file from .context/tasks/ and work on it, following acceptance criteria and patterns. Triggers on "work on task", "start task", "continue task", "task NNN", "pick up where I left off", "next task". Use when user wants to implement a specific task.
argument-hint: "[task number or name] [--careful]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Task, Skill
---

# Continue Task

Load and work on a specific task from `.context/tasks/` (active tasks only).

## Folder Structure

- `.context/tasks/` - Active tasks (pending, in-progress, blocked)
- `.context/tasks-done/` - Archived done tasks (read-only reference)

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

- **Explore** (built-in, read-only) — for the Step 5b verification sweep when the task
  names an area rather than exact files, or when you need to find every call site
  before changing a signature. Do not read twenty files in the main thread to answer
  "where is this used".
- **test-runner** (project-defined, if present) — Step 9, `test` and `full`
- **build-validator** (project-defined, if present) — Step 9, `full`

Never delegate the writing of the code, the AC checkboxes, or the status line. Those
stay in the main thread where the user can see them.

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.
See `../../shared/conventions/ownership.md` for labels and the `done` gate.
See `../../shared/conventions/checklist-binding.md` for the optional checklist slice.

Skill-specific errors:
- **Task not found in `tasks/`**: Report not found, do NOT search `tasks-done/`. Suggest `/ctx:progress` to see available tasks.
- **Task missing `## Acceptance Criteria`**: Warn user the task has no ACs — cannot track completion properly. Suggest adding ACs before starting.
- **Task missing `## Status`**: Treat as `pending`, but warn user about malformed file.
- **Task status is `blocked`**: Show blocker reason, ask if user wants to proceed anyway.
- **Task status is `done`**: Inform user this task is already complete. Suggest `/ctx:sync` to archive it.

## Input

`$ARGUMENTS` - Task number or name (e.g., "002" or "bento-grid")

If empty, ask user which task to work on.

**Flag:** `--careful` forces the task's verification level to `full` regardless of what
the task file says. Use it on critical code. See Step 9.

## Steps

1. **Find task file:**
   ```
   .context/tasks/*$ARGUMENTS*.md
   ```

   Note: Only search in `tasks/`, not `tasks-done/`. Done tasks are archived and shouldn't be reopened.

2. **Read context:**
   - Task file
   - The parent epic, if the task names one: only the rules (E6) and answers (E4) its ACs
     cite. These are the oracle for every expected value in this task.
   - `.context/patterns-architecture.md` (if exists)
   - `.context/domain.md` (if exists) — read domain rules referenced by task acceptance criteria
   - Check task status and dependencies
   - **Checklist binding:** if `.context/ctx-config.md` has a `checklist:` line, read the
     slice for `task` using the task's `Size:` line (see
     `../../shared/conventions/checklist-binding.md`). Size L tasks without T6 skip the
     release phase.

3. **Load specialized skill (if referenced):**

   Check `## Technical Notes` for a `**Specialized Skill:**` line.

   **If found:**
   - Invoke it by name with the Skill tool. The skill's own instructions load into this
     turn — that is the whole point of naming it.
   - If it is a reference-style skill you only need to consult, read ONLY the sections
     listed in `**Key sections to read:**`. Never read a whole skill file to use one rule.
   - **If the named skill is not available in this session** (uninstalled, renamed, or
     from another machine), say so plainly and continue with
     `patterns-architecture.md` guidance. Do not abort the task over a missing skill,
     and do not go hunting the filesystem for it.
   - Follow the skill's guidelines for the ACs in this task alongside patterns-architecture.md
   - Note in progress log: `- [date] Using [skill-name] for [what]`

   **If not found:**
   - Check the available-skills list already in your context — it names every project,
     user, and plugin skill in this session, with descriptions. If one of them clearly
     covers work in this task's ACs (spec files, migrations, deploys, style review),
     ask: "Found skill [name] for this work. Use it? (yes/no)"
   - If yes: invoke it, and add `**Specialized Skill:** [name]` to `## Technical Notes`
     so the next session does not have to re-derive it. Record the name, never a path.
   - If no match, or the user declines: proceed with patterns-architecture.md guidance only.

4. **Verify ready:**
   - Status should be `pending` or `in-progress`
   - **Size M task:** the logic must be owned before code starts. If **Problem**, the
     **Approach** choice, or **Rules and examples** still holds `[Claude-proposed]` or a
     `?`, list them and ask the Owner first (`ownership.md` → Gates)
   - Dependencies should be done
   - If blocked, report why

5. **Brief the user & reconcile approach (before beginning work):**

   Do NOT jump straight into implementation. First produce a briefing with two parts and show it to the user.

   **5a. Explain what the task is and its context:**
   - Assume the user has NO knowledge of this specific task or the epic it belongs to — but DOES have a general understanding of the overall system. Write for that reader.
   - In plain language (avoid internal jargon and bare rule IDs — expand them), explain:
     - **What this task accomplishes** and the concrete problem/need it addresses
     - **Why it exists** — the parent epic (`.context/plans/epic-*.md`) it came from, and how this task fits into that larger goal
     - **Where it sits in the bigger picture** — what depends on it, what it unblocks, what part of the system it touches
   - Keep it tight but genuinely explanatory — enough that someone seeing the task cold understands the "why" before the "how".

   **5b. Present the approach — task's vs. yours after verification:**
   - First summarize the approach the **task file prescribes** (from its acceptance criteria and `## Technical Notes`).
   - Then **scan and verify the actual code** the task references (files, functions, APIs, current behavior). Tasks are often written well before they are picked up, so their assumptions can be stale — files moved or renamed, APIs changed, part of the work already done, or the described state no longer matching reality.
   - Present **your recommended approach** after that verification, and **explicitly flag any mismatch** between what the task assumes and the current state of the code. For each mismatch note: what the task assumed, what you actually found, and how it changes the plan.
   - **If there is a significant technical mismatch** (stale assumptions, work already partially done, a materially better approach), pause and confirm the direction with the user before proceeding. If everything lines up, say so and continue.

   **5c. Logic check (always stops):**
   - List anything in the task that the Owner has not decided yet: an AC with
     `expected: ?`, an item still `[Claude-proposed]`, an open question it cites.
   - Any **logic mismatch** stops the work, however small: the code already behaves
     differently from a cited rule, two cited rules contradict each other, an example's
     expected value cannot be produced, or the work reveals a case no rule covers.
   - On a logic mismatch: add a question to the epic's **E4 · Questions** (or the task's
     **Questions** for a size M task), say what the rule says and what you found, and
     wait for the Owner. Do not choose an answer, do not code around it, and do not
     edit the rule or the expected value yourself.
   - Work that does not depend on the open question may continue if the Owner says so.

6. **Begin work:**
   - Update status to `in-progress` if pending
   - Add progress log entry: `- [date] Started`
   - Work through acceptance criteria in order
   - Write the tests from **T3 · Test Design** with the expected values from their
     cited source, never from what the code returns

7. **During work:**
   - Follow patterns from patterns-architecture.md
   - If a specialized skill is loaded, follow its guidelines for relevant ACs
   - Update progress log with significant milestones
   - If blocked, update status and note blocker
   - **AC tracking:** After completing work for an acceptance criterion, immediately edit the task file to change `- [ ]` to `- [x]` for that item. Do NOT defer this — update the checkbox as soon as the criterion is satisfied.
   - **A test that looks wrong is a logic mismatch**, not a test to fix. Stop and ask
     as in 5c; the Owner corrects the rule or example first.
   - **T4 · Progress Log is the memory.** For a long task, log decisions, dead ends, and
     the next step at each stopping point, so a fresh session can resume from the file.

8. **On completion:**

   **Gate: `done` requires every AC checked `[x]`.** Before writing the status,
   re-read the `## Acceptance Criteria` block and count. If a single `- [ ]`
   remains, the task is not done — no matter how finished the work feels.

   **Gate: `done` requires a test result from the Owner** (task files with a
   **T5 · Test Results** section). Claude fills what it ran (automated tests, its own
   diff read) and prepares the manual and exploratory checks against the examples. The
   Owner records the result of those checks, or gives a verdict per line that Claude
   writes down labeled `[Owner]`. An empty T5, or one with only Claude's lines, means
   the status stays `in-progress`; say what the Owner still needs to check.
   Also blocked: any `[Claude-proposed]` left in T1 or T2.

   Older task files with no T5 section are gated on the ACs alone.

   When all ACs are `[x]` and the T5 gate passes:
   - Change `## Status: in-progress` to `## Status: done` in the task file
   - Add progress log entry: `- [date] Done — all ACs satisfied`
   - Do NOT leave status as `in-progress` when all ACs are done

   When work is finished but an AC cannot be verified yet (needs a server
   restart, a release to land, someone else's review):
   - Status stays `in-progress`, or becomes `blocked` if the wait is on someone
     else. The unverified AC stays `- [ ]`.
   - Put the reason in `## Progress Log`, naming exactly what is outstanding.
   - **Never encode the caveat in the status line.** `## Status: done (pending
     visual verify)` is not a status: sync cannot parse it, so the task is
     neither archived nor reported, and it falls out of every count until
     someone reads the file by hand. The parenthetical is the proof it is not
     done — write `in-progress` and say why in the log.

   The `## Status:` line holds exactly one of `pending` / `in-progress` /
   `blocked` / `done`. Nothing else on that line, ever.

9. **Verification on completion:**
   Read the task's `## Verification:` field (none / test / full).
   If the user passed `--careful` → treat as `full` regardless of the field.

   - **none**: Skip verification entirely.
   - **test**: If a `test-runner` agent is available in this session, ask:
     "Run tests for affected code? (yes/no)" — on yes, spawn it with the Task tool,
     telling it which files the task touched.
     If there is no `test-runner`, suggest: "Consider running tests manually before
     marking complete."
   - **full**: Same for `test-runner` and `build-validator` together. Ask once:
     "Run tests and build validation? (yes/no)" — on yes, spawn both.
     If neither exists, suggest running tests and build manually.
   - NEVER auto-run — always ask the user first.
   - Report what the agents found. A failing test means the task is not done: leave the
     failing AC unchecked and write the failure into `## Progress Log`.

10. **Suggest commit:**
    After task completion, check the available-skills list in your context for a skill
    whose description covers committing or pushing.
    - If one exists → suggest: "Task complete. Use [skill-name] to commit with the task ID in scope? e.g., `feat(task-NNN): [goal]`"
    - If not → suggest: "Task complete. Consider committing with task reference: `feat(task-NNN): [goal]`"
    - Never commit without the user asking.

11. **Domain check on completion:**
    If the task references domain rule IDs (e.g., ORD-001, PAY-002) in its acceptance criteria:
    - Ask: "This task referenced domain rules [list IDs]. Did the implementation match these rules exactly, or did business logic change?"
    - If user says logic changed → generate proposed domain updates using Domain Impact Protocol format → show to user → require confirmation → update `domain.md`
    - If user says matched exactly → no action needed

    If during implementation you discover code behavior contradicts a domain rule:
    - **STOP** — report the conflict: "[Rule ID] says X, but code does Y. Is this a bug or a stale rule?"
    - Wait for user decision before proceeding

12. **Checklist report (binding on only):** end with the report from
    `checklist-binding.md` for the phases this task covered: what Claude did, which
    rows are the Owner's to do and tick, and what was skipped. Never tick a row.

## Output

Confirm task loaded and show:
- Goal
- Acceptance criteria (with current status)
- Next action to take

## Gotchas

- **Brief before building**: Always run step 5 (explain the task + reconcile the approach) before touching code. Skipping straight to implementation is wrong even when the task looks trivial — the explanation and the staleness check are the point.
- **Trust the code over the task file**: Tasks can be written long before they're picked up. Verify the task's assumptions against the actual code, and flag mismatches instead of blindly following a stale plan.
- **Only search tasks/, never tasks-done/**: Done tasks are archived and read-only. If user asks for a completed task, inform them it's in tasks-done/ but do not re-open it.
- **AC checkbox updates are immediate**: Update `- [ ]` to `- [x]` the moment an acceptance criterion is satisfied. Do not batch updates at the end.
- **`done` is gated on the checkboxes, not on how finished it feels**: count the ACs before writing the status. One `- [ ]` left means `in-progress`.
- **Never qualify the status line**: `## Status: done (pending X)` parses as neither `done` nor anything else, so sync skips the task entirely and it silently leaves every count. Caveats go in `## Progress Log`; the status stays a bare token.
- **Logic mismatch = STOP, always**: an expected value you cannot meet, a rule the code contradicts, a case no rule covers. Add a question and wait. Never pick the answer, and never change a test to match the code.
- **`done` needs the Owner's test result**: all ACs checked is necessary, not sufficient, when the task has a T5 section.
- **Never tick the checklist**: the binding is read-only.
- **Code vs domain conflict = STOP**: If implementation contradicts a domain rule (referenced by Rule ID in ACs), stop work immediately. Report the conflict and wait for user decision.
- **Blocked tasks need a reason**: If a task cannot proceed, update status to `blocked` and document why. Do not silently skip to another task.
- **Verification field controls post-completion behavior**: Check the task's `Verification:` field. Only suggest test/build runs when the level warrants it, or when the user passed `--careful`.
- **Invoke skills by name, don't hunt for their files**: the available-skills list in your context already names every skill in this session, including plugin skills a filesystem glob would never see. A recorded path is stale the moment the skill moves.

