---
name: start
description: Set up a new project's context bank end to end — context folders, vision, architecture, techstack, and optionally a first epic broken into tasks. Triggers on "start project", "new project", "bootstrap", "init everything", "set up from scratch", "ctx setup". For a project that already has code, use /ctx:onboard instead.
argument-hint: "[optional: project idea]"
allowed-tools: Read, Write, Edit, Glob, Bash, AskUserQuestion, Skill, Task
---

# Start Project

The single entry point for setting up a new project. It creates the `.context/` folder
structure and walks through vision, architecture, and techstack, then optionally plans
the first feature.

The setup steps live in `../../shared/procedures/`. They are procedures, not slash
commands — the user never invokes them directly. Read each one when you reach its step
and follow it.

| Step | Procedure file | Writes |
|---|---|---|
| 1 | `../../shared/procedures/context-bank.md` | `.context/` structure, `progress.md`, `decisions.md` |
| 2 | `../../shared/procedures/vision.md` | `.context/vision.md` |
| 3 | `../../shared/procedures/architecture.md` | `.context/patterns-architecture.md` |
| 4 | `../../shared/procedures/techstack.md` | `.project-init.md` |

## Input

`$ARGUMENTS` can be:
- A project idea: `/ctx:start "E-commerce platform"`
- Empty: the vision step will ask

## Step 0: Pick the Mode

Before anything else, check what already exists:

- `.context/vision.md`
- `.context/patterns-architecture.md`
- `.project-init.md`
- Any source files at all (is this an empty repo or a real codebase?)

**If the repo has substantial existing code but no `.context/`** → stop and redirect:
"This project already has code. `/ctx:onboard` reads it and fills the context bank from
what is there, instead of asking you to describe it from scratch. Run that instead?"

**If none of the three files exist** → **full setup mode**. Run every step in order.

**If some exist** → **update mode**. Report what is already there, then ask which parts
to work on:

```
Your context bank already has:
  ✓ vision.md            (last updated <date>)
  ✓ patterns-architecture.md
  ✗ .project-init.md     (missing)

What would you like to do?
  1. Fill in what is missing (techstack)
  2. Update vision
  3. Update architecture
  4. Plan a feature instead — /ctx:epic
```

Run only the steps the user picks. Every procedure detects an existing file and enters
its own update mode, so re-running one is safe.

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

`/ctx:start` is a conversation with the user, so most of it stays in the main thread.
Delegate to **Explore** only when a procedure's extract mode needs a codebase sweep, or
when the user's answer needs checking against what is actually in the repo.

---

## Step 1: Context Bank (always, first, unconditional)

Read `../../shared/procedures/context-bank.md` and follow it.

This runs **before** the vision step, not after. Every later step writes into
`.context/`, and if the folder is created afterwards the boilerplate files
(`progress.md`, `decisions.md`, `tasks/`, `tasks-done/`, `plans-done/`, and the
`## Project Context` section in `CLAUDE.md`) never get created at all.

The procedure is idempotent. On a repo that already has a partial `.context/` it
creates only what is missing and reports the rest.

**Output:** `.context/` structure

---

## Step 2: Vision

Read `../../shared/procedures/vision.md` and follow it.

- If the user gave an idea in `$ARGUMENTS`, use it as the starting point
- Otherwise the procedure asks

**Output:** `.context/vision.md`

Summarize the vision in two or three sentences and confirm before moving on.

---

## Step 3: Architecture

Read `../../shared/procedures/architecture.md` and follow it.

It reads `vision.md` for context, then asks about backend and frontend patterns, the
domain approach, and API style.

**Output:** `.context/patterns-architecture.md`

Summarize the architectural decisions and confirm before moving on.

---

## Step 4: Techstack

Read `../../shared/procedures/techstack.md` and follow it.

It reads `vision.md` and `patterns-architecture.md` for smart defaults, then asks about
repo layout, package manager, language, frameworks, and database.

**Output:** `.project-init.md`

Summarize the tool selections and confirm before moving on.

---

## Step 5: Domain Model (optional)

Ask:

```
Does this project have business logic — flows, rules, or domain concepts?
(for example: a checkout flow, payment rules, permission tiers)

  1. Yes — let's document the domain model now
  2. Later — I'll run /ctx:domain when ready
  3. No — this project doesn't need it (portfolio, CLI tool, static site)
```

If yes, invoke the `domain` skill. It interviews the user about entities, flows, rules,
and edge cases.

**Output:** `.context/domain.md`

---

## Step 6: First Epic (optional)

Ask:

```
What's the first major feature you'd like to plan?
(for example: "User authentication", "Dashboard", "Payment processing")

Or say "skip" to finish here — /ctx:epic works any time.
```

If the user names a feature, invoke the `epic` skill with it.

**Output:** `.context/plans/epic-<name>.md`

---

## Step 7: Breakdown (optional)

Only if an epic was created. Ask:

```
Break this epic down into tasks now? (yes/no — /ctx:breakdown works any time)
```

If yes, invoke the `breakdown` skill with the epic file.

**Output:** `.context/tasks/*.md`

---

## Step 8: Summary & Next Steps

```markdown
## Project Initialized 🎉

### Created

- `.context/` — plans/, tasks/, tasks-done/, plans-done/, progress.md, decisions.md
- `.context/vision.md` — project vision and scope
- `.context/patterns-architecture.md` — architecture patterns and conventions
- `.project-init.md` — technology stack
- `.context/domain.md` — business logic [if created]
- `.context/plans/epic-<name>.md` [if created]
- `.context/tasks/001-*.md …` [if broken down]

### What You Have

- **Vision:** [one sentence]
- **Architecture:** [backend + frontend style]
- **Stack:** [main technologies]
- **First epic:** [name, if created]
- **Tasks ready:** [count, if broken down]

### What To Do Next

1. Review the files above — they are yours to edit by hand any time
2. `/ctx:epic "<feature>"` to plan a feature
3. `/ctx:breakdown <epic-name>` to turn it into tasks
4. `/ctx:progress` to see what is pending
5. `/ctx:task <number>` to start working

### The Commands You'll Actually Use

- `/ctx:epic` — plan a feature, or a defect whose cause is not yet known
- `/ctx:breakdown` — turn an epic into tasks
- `/ctx:create-task` — one small task, no epic needed
- `/ctx:progress` — what's pending, in progress, blocked
- `/ctx:task <num>` — work on a task
- `/ctx:sync` — reconcile progress.md and archive finished work
- `/ctx:domain` — document business logic
- `/ctx:log-decision` — record an architecture decision

Run `/ctx:start` again any time to update vision, architecture, or techstack.
```

---

## Error Handling

**If the user stops mid-flow:** nothing is lost. Re-run `/ctx:start` — Step 0 detects
what exists and offers to continue from there.

**If files already exist:** each procedure enters its own update mode rather than
overwriting. Tell the user which files went to update mode instead of create.

**If this is an existing codebase:** redirect to `/ctx:onboard`. See Step 0.

---

## Example Flow

```
User: /ctx:start "Task management SaaS"

[Step 0] No .context/, no source files → full setup mode

[Step 1] Follows context-bank.md
         Creates .context/ with plans/, tasks/, tasks-done/, plans-done/,
         progress.md, decisions.md

[Step 2] Follows vision.md with "Task management SaaS"
         Asks: who is it for? scale? timeline? MVP features?
         Writes .context/vision.md

[Step 3] Follows architecture.md
         Asks: backend style? frontend style? domain approach?
         Writes .context/patterns-architecture.md

[Step 4] Follows techstack.md
         Asks: monorepo? package manager? framework? database?
         Writes .project-init.md

[Step 5] Asks about business logic → user says yes
         Invokes the domain skill → .context/domain.md

[Step 6] Asks for the first feature → "User authentication"
         Invokes the epic skill → .context/plans/epic-auth.md

[Step 7] Asks to break down → yes
         Invokes the breakdown skill → .context/tasks/001-*.md … 005-*.md

[Step 8] Summary
```

---

## Tips

- This is a guided wizard. Summarize after each step and let the user confirm.
- If the user seems unsure about a step, explain what the file is for before asking.
- Read each procedure file when you reach its step, not all four upfront — they are
  long, and loading them all at once wastes the context the interview needs.

## Gotchas

- **Context bank comes FIRST**: Step 1 is unconditional and runs before anything writes
  into `.context/`. Guarding it on "if `.context/` doesn't exist" and putting it last is
  the bug this ordering exists to prevent: the vision step creates `.context/vision.md`,
  the guard then sees a `.context/` folder and skips, and `progress.md`, `decisions.md`,
  `tasks/`, and the archive folders are silently never created.
- **The procedures are not slash commands**: `vision`, `architecture`, `techstack`, and
  `context-bank` are markdown procedures under `shared/procedures/`. Read them, do not
  try to invoke them. The consumer-facing surface for setup is `/ctx:start` and
  `/ctx:onboard`, nothing else.
- **Existing code means onboard, not start**: `/ctx:start` interviews the user from
  scratch. On a repo that already has code, `/ctx:onboard` reads the answers out of the
  codebase instead. Check in Step 0.
- **Re-running is safe**: every procedure detects its own output file and enters update
  mode. Say which files are being updated rather than created.
- **The domain step is optional**: not every project needs `domain.md`. Skip it for CLI
  tools, libraries, and static sites.
