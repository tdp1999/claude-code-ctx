# CTX Workflow Diagram

What a user actually runs, in order. For which skill reads and writes which file, see
`skill-relationships.md`.

## The Whole Picture

```
                          SETUP  (once per project)
        ┌──────────────────────────────────────────────────┐
        │                                                  │
   empty repo                                     repo with code
        │                                                  │
   ┌────▼─────┐                                      ┌─────▼──────┐
   │ /ctx:    │                                      │ /ctx:      │
   │  start   │                                      │  onboard   │
   └────┬─────┘                                      └─────┬──────┘
        │  interviews you                                  │  reads the code
        │                                                  │
        └───────────────────┬──────────────────────────────┘
                            │
              both run the same 4 procedures
              (shared/procedures/ — not slash commands)
                            │
        ┌───────────────────┼───────────────────┬───────────────────┐
        ▼                   ▼                   ▼                   ▼
   context-bank         vision            architecture         techstack
   .context/         vision.md      patterns-architecture   .project-init.md
   structure                               .md

                          PLANNING  (per feature or defect)
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
   ┌────▼─────┐                          ┌──────▼────────┐
   │ /ctx:epic│                          │ /ctx:         │
   │          │                          │  create-task  │
   └────┬─────┘                          └──────┬────────┘
        │  plans/epic-<name>.md                 │  tasks/NNN-<name>.md
        │                                       │
   ┌────▼──────────┐                            │
   │ /ctx:breakdown│                            │
   └────┬──────────┘                            │
        │  tasks/NNN-<name>.md × N              │
        └───────────────────┬───────────────────┘
                            │
                          DOING
                            │
                     ┌──────▼───────┐
                     │/ctx:progress │  what's pending, blocked, in flight
                     └──────┬───────┘
                            │  you pick a number
                     ┌──────▼───────┐
                     │ /ctx:task NNN│  briefs you, then implements
                     └──────┬───────┘
                            │  ACs checked, status → done
                     ┌──────▼───────┐
                     │  /ctx:sync   │  reconcile + archive
                     └──────────────┘

                          ALONGSIDE  (any time)
              /ctx:domain         business logic, flows, rules
              /ctx:log-decision   record an architecture decision
```

## Skills, by When You Reach For Them

### Setup — exactly two entry points

| Command | Use when | Produces |
|---|---|---|
| `/ctx:start` | New or empty project | Context bank + vision + architecture + techstack, optionally a first epic |
| `/ctx:onboard` | Repo that already has code | The same files, extracted from the codebase and confirmed by you |

`vision`, `architecture`, `techstack`, and `context-bank` are **procedures**, not
commands — they live in `shared/procedures/` and only `start` and `onboard` run them.
Re-run `/ctx:start` any time to update one of them.

### Planning

| Command | Use when | Produces |
|---|---|---|
| `/ctx:epic "Feature"` | A feature, or a defect whose cause is not yet known | `plans/epic-<name>.md` |
| `/ctx:breakdown epic-<name>` | An epic is `ready` | `tasks/NNN-*.md` × N |
| `/ctx:create-task "…"` | One small piece of work, no epic needed | `tasks/NNN-*.md` |
| `/ctx:domain` | The project has business rules worth writing down | `domain.md` |
| `/ctx:log-decision "Topic"` | An architecture decision was made | entry in `decisions.md` |

### Doing

| Command | Use when | Effect |
|---|---|---|
| `/ctx:progress` | Choosing what to work on | Read-only status report |
| `/ctx:task NNN` | You picked one | Briefs you, verifies the task's assumptions, implements, checks ACs |
| `/ctx:task NNN --careful` | Critical code | Same, but always runs full verification |
| `/ctx:sync` | After finishing work | Fixes stale statuses, archives done tasks and completed epics |

## Common Paths

**New project, first feature:**
```
/ctx:start "Task management SaaS"
  → /ctx:epic "User authentication"   (start offers this at the end)
  → /ctx:breakdown epic-auth
/ctx:progress
/ctx:task 001
/ctx:sync
```

**Joining an existing codebase:**
```
/ctx:onboard
/ctx:epic "Payment integration"
/ctx:breakdown epic-payment
/ctx:task 001
/ctx:sync
```

**Small bug:**
```
/ctx:create-task "Checkout 500s when the payment key is missing"
/ctx:task 042
/ctx:sync
```

**Large defect, cause unknown:**
```
/ctx:epic "Payment gateway configuration"     ← the epic holds the investigation
/ctx:breakdown epic-payment-gateway-config
/ctx:task 043
/ctx:sync
```
See `../../shared/workflows/bug-flow.md` for how to fill a bug epic in.

## Rules the Flow Depends On

**You choose the task, always.** No skill auto-selects one. `/ctx:progress` shows the
list; you name the number.

**`done` is gated on the checkboxes.** A task reaches `done` only when every acceptance
criterion is `[x]`. Caveats go in `## Progress Log`, never on the status line.

**`/ctx:sync` after finishing, not during.** It reconciles `progress.md` against the
files, archives what is genuinely complete, and reports contradictions without
auto-fixing them.
