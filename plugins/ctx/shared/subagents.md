# Available Subagents

When a skill needs work that is a sweep, a long-running check, or a self-contained
sub-job, spawn a subagent with the Task tool instead of doing it inline. The subagent
burns its own context and hands back only the conclusion.

Agents fall into two categories:
- **Built-in agents**: always available in any Claude Code environment
- **Project-defined agents**: only present if the project or user configured them. A
  skill must degrade gracefully when one is absent — say so and continue, never abort.

**The rule of thumb:** if answering a question means reading more than a handful of
files, send an Explore. If a step is a self-contained job with a pass/fail answer
(tests, build), send the agent that owns it. Everything the user needs to watch —
writing code, editing task files, setting statuses — stays in the main thread.

---

## Built-in Agents

### Explore

**Use for:** read-only codebase sweeps — finding files, mapping structure, locating
every call site, checking whether something already exists.

**When:**
- Extract mode in the vision / architecture / techstack procedures
- Finding the real `## Files to Touch` for tasks during `/ctx:breakdown`
- Verifying a task's assumptions against the current code in `/ctx:task` Step 5b

**Example prompts:**
- "Analyze the folder structure and detect the architecture patterns in use"
- "Find every call site of `PaymentService.charge` and list file:line for each"
- "Does this repo already have a rate limiter? If so, where?"

**Prefer over:** manual Glob/Grep/Read chains. Send several in parallel when the
questions are independent.

**Note:** Explore is read-only. It locates and summarizes; it does not edit, and it is
not a reviewer.

---

### Plan

**Use for:** designing an implementation approach when several are viable and the
trade-offs matter.

**When:**
- An epic's `## Technical Considerations` needs a real approach, not a guess
- A task turns out to be larger than its file describes

---

### general-purpose

**Use for:** multi-step research that needs both search and synthesis, including
external/web information.

**When:** the job does not fit Explore (read-only) or Plan (design), and you want it
off the main thread.

---

## Project-Defined Agents

These are **not built-in**. They exist only if the project or user configured them.
Check the agent types available in this session before naming one; if it is missing,
tell the user what you skipped and why, then continue.

### test-runner

**Use for:** running the test suite and reporting results.
**When:** `/ctx:task` Step 9, at verification level `test` or `full`.
**If not available:** skip it and tell the user they can run tests manually, or add a
`test-runner` agent to enable this.

### build-validator

**Use for:** type checking and production build validation.
**When:** `/ctx:task` Step 9, at verification level `full`.
**If not available:** skip it and tell the user they can build manually, or add a
`build-validator` agent to enable this.

---

## How to Use in Skills

Reference this file and name only the agents the skill actually uses:

```markdown
## Subagent Usage

See `../../shared/subagents.md` for available subagents.

- **Explore** (built-in) — for [specific use case]
- **test-runner** (project-defined, if present) — for [specific use case]
```

Then invoke via the Task tool with the matching `subagent_type`:

```
Task(subagent_type="Explore", prompt="Find every call site of PaymentService.charge …")
```

Independent questions go out in one batch so they run together. A question that
depends on another's answer waits for it.

### Handling a Missing Project-Defined Agent

1. Check the agent types available in this session.
2. If present: use it.
3. If absent: say so plainly and carry on —

   ```
   Note: skipping [agent-name] — no such agent in this session.
   Configure one to enable automatic [testing / build validation].
   ```

Never block a task on a missing optional agent.
