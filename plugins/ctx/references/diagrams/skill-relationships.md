# Skill Relationships

Which skill reads which file, which skill hands off to which. For the order a user runs
them in, see `workflow-diagram.md`. The authoritative section-by-section contract for
each file is `../../shared/conventions/file-contracts.md` — this page is the map, that
page is the spec.

## The Ten Skills

| Skill | Kind | Surfaced to users |
|---|---|---|
| `start` | Setup entry point | ✅ |
| `onboard` | Setup entry point | ✅ |
| `epic` | Planning | ✅ |
| `breakdown` | Planning | ✅ |
| `create-task` | Planning | ✅ |
| `domain` | Knowledge | ✅ |
| `log-decision` | Knowledge | ✅ |
| `progress` | Execution | ✅ |
| `task` | Execution | ✅ |
| `sync` | Maintenance | ✅ |

There is no hidden skill. `vision`, `architecture`, `techstack`, and `context-bank` are
**procedures** under `../../shared/procedures/` — plain markdown that `start` and
`onboard` read and follow. They have no frontmatter, no slash command, and no entry in
the skills list.

## File Ownership

Every context file has exactly one set of writers. Nothing else may create it.

| File | Written by | Read by |
|---|---|---|
| `.context/` structure, `progress.md`, `decisions.md` (seed) | context-bank procedure | — |
| `.context/vision.md` | vision procedure (via start / onboard) | epic, architecture procedure, techstack procedure |
| `.context/patterns-architecture.md` | architecture procedure (via start / onboard) | epic, breakdown, task, techstack procedure |
| `.project-init.md` | techstack procedure (via start / onboard) | reference only — nothing consumes it |
| `.context/domain.md` | domain (+ Domain Impact Protocol in epic, breakdown, task) | epic, breakdown, task |
| `.context/plans/epic-<name>.md` | epic | breakdown, sync |
| `.context/tasks/NNN-*.md` | breakdown, create-task | task, progress, sync |
| `.context/progress.md` | breakdown, create-task, sync | progress, sync, create-task |
| `.context/decisions.md` | log-decision | breakdown, architecture procedure |
| `.context/tasks-done/`, `.context/plans-done/` | sync | progress (counts only) |

## Handoffs

```
start ──┐
        ├─→ context-bank ─→ vision ─→ architecture ─→ techstack ──┐
onboard ┘        (procedures, read in order)                      │
                                                                  │
                                     may then invoke ─────────────┤
                                                                  ▼
                                                  domain ─→ epic ─→ breakdown
                                                                       │
                            create-task ──────────────┐                │
                                                      ▼                ▼
                                                  .context/tasks/NNN-*.md
                                                             │
                                                  progress ──┤ (read-only)
                                                             ▼
                                                           task
                                                             │
                                                             ▼
                                                           sync
                                                             │
                                             tasks-done/ + plans-done/
```

**Invocation, not inlining.** `start` and `onboard` invoke `domain`, `epic`, and
`breakdown` through the Skill tool — they are real skills, so they run with their own
instructions rather than being copy-pasted into the orchestrator. The four setup steps
go the other way: they are read as files, because they are procedures.

## Tool Grants

`allowed-tools` has to match what a skill actually does, or the skill silently fails to
do it. Current grants:

| Skill | allowed-tools |
|---|---|
| `start` | Read, Write, Edit, Glob, Bash, AskUserQuestion, Skill, Task |
| `onboard` | Task, Read, Write, Edit, Glob, Bash, AskUserQuestion, Skill |
| `epic` | Read, Write, Edit, Glob, AskUserQuestion, Task |
| `breakdown` | Read, Write, Edit, Glob, Bash, AskUserQuestion, Task |
| `create-task` | Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion, Task |
| `task` | Read, Write, Edit, Glob, Grep, Bash, Task, Skill |
| `domain` | Read, Write, Edit, Glob, AskUserQuestion, Task |
| `log-decision` | Read, Write, Edit, AskUserQuestion |
| `progress` | Read, Glob |
| `sync` | Read, Write, Edit, Glob, Bash |

Two rules behind the grants:

- **`Task` wherever a skill may delegate.** Anything that sweeps a codebase sends an
  Explore subagent instead of reading files one at a time. See `../../shared/subagents.md`.
- **`Skill` only on the skills that orchestrate.** `start`, `onboard`, and `task` invoke
  other skills; nothing else does. `progress` is read-only on purpose — it reports and
  never writes.

## Subagent Use

| Skill | Typical delegation |
|---|---|
| `onboard` | Parallel Explore agents — one for structure, one for stack, one for patterns |
| `breakdown` | Explore, to find every call site and file an epic's requirements touch |
| `create-task` | Explore, when the task modifies existing code |
| `task` | Explore for orientation; `test-runner` / `build-validator` at verification |
| `epic` | Explore, to check a proposed scope against what already exists |
| `start` | Explore, only when an answer needs checking against the repo |

`Explore`, `Plan`, and `general-purpose` are built in. `test-runner` and
`build-validator` are project-defined and may not exist — check before invoking, and
degrade to running the commands directly.

## Skill Discovery

`breakdown` and `task` look for **other** skills the user has installed — a project's
own `prisma-migrate`, `aqa-expert`, and so on — so a task can name the skill that should
handle it.

The list comes from the skills already present in the agent's context. Claude Code puts
every available skill (project, user, and plugin) in front of the agent with its name
and description before any of this runs. Never glob the filesystem for it:
`.claude/skills/*/` and `~/.claude/skills/*/` miss every plugin skill, and the plugin
cache holds several versions of the same plugin under two different layouts.

`breakdown` records the discovered skill's **name** on a `**Specialized Skill:**` line in
the task's `## Technical Notes`. `task` reads that line and invokes the skill by name.
Never record a path.

## Independent Skills

`domain`, `log-decision`, and `progress` have no upstream dependency. They can run at any
point, including before setup finishes, and nothing breaks if they never run at all.

## What Changed in v3

- `investigate` is gone. Bugs and defects go through `create-task` (small, cause known)
  or `epic` (large, cause unknown). See `../../shared/workflows/bug-flow.md`.
- The execution-logging subsystem is gone, along with `recap`.
- `vision`, `architecture`, `techstack`, and `context-init` are no longer skills. They
  are procedures inside `start` and `onboard`.
- `ctx-config.json` and its two convention files are gone. The one setting anything read,
  `carefulMode`, is now the `/ctx:task --careful` flag.
