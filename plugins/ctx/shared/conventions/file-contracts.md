# File Contracts

Defines the required sections for each context file type, and which skills read/write them. This is the single source of truth for inter-skill dependencies.

When modifying a file's format, check the **Read by** column to understand which skills will be affected.

---

## vision.md

| | |
|---|---|
| **Location** | `.context/vision.md` |
| **Written by** | `/ctx:start`, `/ctx:onboard` (via the vision procedure) |
| **Read by** | `/ctx:epic`, and the architecture + techstack procedures |

**Required sections:**
- `## Summary` — one sentence project description
- `## Target Users` — who the project is for
- `## Scale` — personal / small-team / startup / enterprise / public-facing
- `## Timeline` — prototype / MVP / full product
- `## MVP Scope` — bullet list of MVP features

**Optional sections:**
- `## Full Vision` — beyond MVP
- `## Changelog` — added by update mode

---

## patterns-architecture.md

| | |
|---|---|
| **Location** | `.context/patterns-architecture.md` |
| **Written by** | `/ctx:start`, `/ctx:onboard` (via the architecture procedure) |
| **Read by** | `/ctx:epic`, `/ctx:breakdown`, `/ctx:task`, and the techstack procedure |

**Required sections:**
- `## Architecture` with at least one of:
  - `### Backend` — style, layers, pattern, domain approach
  - `### Frontend` — style, pattern, state management
- `### Boundaries` — API style, module communication

**Optional sections:**
- `### Modules` — added by `--add-module`
- `### Domains` — added by `--add-domain`
- `## Code Patterns`, `## Naming Conventions`, `## File Organization`

---

## .project-init.md

| | |
|---|---|
| **Location** | `.project-init.md` (repo root — the one ctx file that lives outside `.context/`) |
| **Written by** | `/ctx:start`, `/ctx:onboard` (via the techstack procedure) |
| **Read by** | (reference only — not consumed by other skills programmatically) |

**Required sections:**
- Project structure section (repo type, package manager, language)

---

## domain.md

| | |
|---|---|
| **Location** | `.context/domain.md` and optionally `.context/domain/*.md` |
| **Written by** | `/ctx:domain`, and via Domain Impact Protocol from `/ctx:epic`, `/ctx:breakdown`, `/ctx:task` (all require user confirmation) |
| **Read by** | `/ctx:epic`, `/ctx:breakdown`, `/ctx:task` |

**Required sections:**
- `## Glossary` — table with Term, Definition, Type (Aggregate / Entity / Value Object / Domain Event)
- `## Flows` — at least one flow with Trigger, Actors, Happy path, End states
- `## Rules` — grouped by entity, each with a unique ID (e.g., `ORD-001`)

**Optional sections:**
- `## Invariants` — cross-entity constraints
- `## Edge Cases` — known edge cases with expected behavior
- `## Modules` — index of per-module files (only when split)
- `## Changelog` — added by update mode

**Per-module files (when split):**
- Location: `.context/domain/<module-name>.md`
- Required: `## Dependencies`, `## Flows`, `## Rules`
- Optional: `## Edge Cases`, `## Changelog`

**Rule ID format:** 3-letter entity code + dash + 3-digit number (e.g., `ORD-001`, `PAY-002`)

---

## Epic files

| | |
|---|---|
| **Location** | `.context/plans/epic-<name>.md` |
| **Written by** | `/ctx:epic`; `/ctx:breakdown` (adds questions to E0, fills **Tasks** for one or two slices, writes the broken-down note); `/ctx:task` (updates a slice line in **Tasks**) |
| **Read by** | `/ctx:breakdown`; `/ctx:task` (E0, E5, the E6 rules, Inherited behavior, the AC table, and **Tasks**); `/ctx:sync` (**Tasks**, to update the epic status) |

**Archive location:** `.context/plans-done/` (moved by `/ctx:sync` when all tasks are done)

**Required sections:**
- `# Epic: [Name]` — title
- `Size: L · <reason>` — first line under the title (see `ownership.md` → Size)
- `## Status` — one of: `draft`, `ready`, `broken-down`, `completed`
- `## Legend` — the ID prefixes this epic uses (see `ids-and-references.md`)
- `## E0 · Questions` — table: #, Question, Who answers, Answer, Date, Blocking
- `## E1 · Problem`, `## E2 · Done and measure`, `## E3 · Scope`
- `## E4 · Design` — chosen option with the Owner's reason
- `## E5 · Flows and screens` — flow IDs (`F1`…), screen IDs (`S1`…), and the data
  dictionary; no rule IDs
- `## E6 · Rules and examples` — rules with IDs (`R1`…) and a covers line naming
  their flows and screens, examples with IDs (`R1.1`…),
  each example's expected value citing its source or `?` (this is what breakdown decomposes);
  `### Inherited behavior` (`P1`…) and `### Acceptance criteria and test levels`
  (`AC-1`…), which breakdown, task, and sync cite
- `## Tasks` — one checkbox line per slice, for an epic with one or two slices; a bigger
  epic has task files instead and no Tasks section

**Optional:**
- `### Test design` under E6 (`DT-n`, `ST-n`) — when a rule needs a decision table or a
  state transition table
- `## E7 · Outcome` — filled after release
- `## Specialized Skills`, `## Estimated Complexity`, `## Created`, `## Changelog`

**Status lines:** each heading in E1, E2, E3, E4, E5, and E6 starts with a `Status:`
line (`[Owner]`, `[Claude-proposed]`, or `[Owner], except …`). Items may end with a
provenance label (`[Owner]`, `[Q-n]`, a rule ID). See `ownership.md`. `draft → ready` is
gated on the status lines.

**Changelog entries** are bold lines (`**[YYYY-MM-DD] [Change]**`), never headings, so
they stay out of the outline.

**Older format (still valid):** `## Summary`, `## Scope` with `### In Scope` /
`### Out of Scope`, `## High-Level Requirements` (numbered), `## Status`. Skills read it
as before; requirement numbers stand in for rule IDs.

---

## Task files

| | |
|---|---|
| **Location** | `.context/tasks/NNN-<name>.md` |
| **Written by** | `/ctx:breakdown`, `/ctx:create-task` |
| **Read by** | `/ctx:task`, `/ctx:progress`, `/ctx:sync` |

**Part codes:** headings may carry a code before the name (`## T2 · Acceptance
Criteria`). Readers match on the name after the code, so files without codes stay valid.

**Required sections (all sizes):**
- `# Task: [Title]` — clear, actionable title starting with a verb
- `Size: <S|M|L> · <reason>` — first line under the title (older files may lack it)
- `## Status` — one of: `pending`, `in-progress`, `blocked`, `done`
- `## Acceptance Criteria` (T2) — checklist with `- [ ]` items (minimum 1). Size M: each
  item cites a rule ID and its expected source, or `?`. Size L: each item is an AC ID
  from the epic's AC table with its rule ID, no wording (older size L tasks may carry
  wording)
- `## Complexity` — one of: `S`, `M`, `L`, `XL`
- `## Verification` — one of: `none`, `test`, `full` (see below)

**Size L (from an epic) adds:**
- `## T1 · Slice` — what the slice delivers and the flow, screen, and rule IDs it covers
- `## T3 · Approach` (empty until the task starts; older tasks have `## T3 · Test
  Design`), `## T4 · Progress Log`, `## T5 · Test Results`
- `## T6 · Release` — only on the task that releases the feature

**Size M (standalone) adds:**
- `## Problem` (with **Done when**), `## Questions`, `## Approach` (chosen option with the
  Owner's reason), `## Rules and examples`
- `## T3 · Test Design`, `## T4 · Progress Log`, `## T5 · Test Results`, `## T6 · Release`

**Status lines:** T1, T2, T3, and the size M logic sections (Problem, Approach, Rules and
examples) start with a `Status:` line, as in the epic. A task file without status lines
is read the old way, by its item labels (see `ownership.md`).

**`done` gate:** every AC `[x]`; no `[Claude-proposed]` in T1, T2, or a size L T3; and, when the file
has a T5 section, a result recorded by the Owner. `/ctx:task` and `/ctx:sync` both
enforce it.

**Verification levels:**
- `none` — text/content/style/config changes, complexity S. Skip verification on completion.
- `test` — logic changes in 1-2 files, no API changes. Suggest running test-runner agent (if available).
- `full` — API changes, shared types, infrastructure, complexity L/XL. Suggest test-runner + build-validator (if available).
- Set by `/ctx:breakdown` and `/ctx:create-task` based on task scope. Read by `/ctx:task` on completion.
- `/ctx:task --careful` treats every task as `full` regardless of this field.

**Optional but recommended:**
- `## Context` / `## Goal` (older files), `## Technical Notes`, `## Files to Touch`, `## Dependencies`
- `**Specialized Skill:**` line in Technical Notes — added by `/ctx:breakdown` when a matching skill is discovered; read by `/ctx:task` to load skill guidelines without re-scanning

**Filename contract:**
- Pattern: `NNN-verb-subject.md` (e.g., `001-add-auth-middleware.md`)
- NNN: 3-digit sequential, zero-padded, never reused

---

## ctx-config.md

| | |
|---|---|
| **Location** | `.context/ctx-config.md` (optional) |
| **Written by** | the user |
| **Read by** | `/ctx:epic`, `/ctx:breakdown`, `/ctx:create-task`, `/ctx:task` |

**Format:** `key: value` lines.
- `checklist: off` — turns off the checklist binding (see `checklist-binding.md`)

Absent file or absent key → the binding is on.

---

## progress.md

| | |
|---|---|
| **Location** | `.context/progress.md` |
| **Written by** | the context-bank procedure, `/ctx:breakdown`, `/ctx:create-task`, `/ctx:sync` |
| **Read by** | `/ctx:progress`, `/ctx:sync`, `/ctx:create-task` |

**Required sections:**
- `## Active Tasks` or `## In Progress`
- `## Pending`
- `## Blocked`
- `## Completed`

---

## decisions.md

| | |
|---|---|
| **Location** | `.context/decisions.md` |
| **Written by** | `/ctx:log-decision`, the context-bank procedure |
| **Read by** | `/ctx:breakdown`, the architecture procedure |

**Required format per entry:**
- `### [Date] Decision Title`
- `**Context:**`, `**Decision:**`, `**Rationale:**`, `**Consequences:**`

---

## Validation Rules for Skills

### Skills that WRITE files
Must include ALL required sections as defined above. Never produce files missing required sections.

### Skills that READ files
Must validate required sections exist before processing. On missing sections, follow the error handling convention in `error-handling.md`.
