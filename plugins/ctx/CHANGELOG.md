# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Flows and screens before rules.** `epic` now drafts flows (numbered main steps plus
  branches per step), a screen list with the states each screen needs, and a data
  dictionary in E5, before the rules in E6. Every rule names its flow or screen. The
  same part covers every ticket type: new flows for a feature, the unchanged current
  flow for a refactor, the broken flow with reproduction steps for a bug. A permission
  matrix, state diagram, or call sequence is added only when the feature needs one.
  The size M task's **Approach** carries the same lines.

### Changed
- **Approval moves to a status line per section.** Each logic heading, at any level, starts with `Status: [Owner]`, `Status: [Claude-proposed]`, or `Status: [Owner], except …` naming the items still under review. Labels at the end of an item (`[Owner]`, `[Q-n]`, a rule ID) now only name the item's source. The gates read the status lines; an older item-level `[Claude-proposed]` still blocks. The word "Status" follows the file's prose language.
- **Changelog entries are bold lines, not headings.** Epic, vision, and architecture changelogs write `**[YYYY-MM-DD] [Change]**`, so entries stay out of the outline. New epic entries go at the top of the Changelog section.
- **`[Owner]` at the end of an item now means only "the Owner wrote this".** Approval of a draft is recorded in the status line, not by relabeling the item. Files written before this change have no status lines and are read the old way: a section counts as approved when no item in it ends with `[Claude-proposed]`.
- **Epic rules cite patterns instead of restating them.** E6 gains an Inherited behavior table (one row per existing pattern, with a smoke test); project-wide decisions are promoted to the standards files, then cited.
- **Epics use one fixed ID registry.** The registry is `shared/conventions/ids-and-references.md`: inherited patterns are `P`, every ID in prose carries a short name, and flows, rules and test tables are headings. The template gains a Legend, a Technique column in the AC table, and a Test design section (cost table, decision tables, state transition tables); the epic file contract lists Legend, Tasks, Inherited behavior, the AC table and Test design.

- **Epic steps run one at a time.** `/ctx:epic` creates the file in step 3, writes each
  section at the end of its step, and stops for the Owner's approval. It never drafts a
  later section before the earlier one is approved, so E6 can no longer be written
  before E5 and go stale.
- **Procedure pointers are mandatory.** With the checklist binding on, a `⚙` row
  (for example `⚙ review`) is run from the procedure section every time, with every
  step. One Claude reviewer no longer stands in for the two independent reviewers the
  procedure asks for. Skipped steps are reported with the reason.
- **Thin size L tasks.** Acceptance criteria are written once, in the epic's new
  **Acceptance criteria and test levels** table. A size L task cites AC IDs and copies
  no wording. Its `T3 · Test Design` becomes `T3 · Approach`, filled with the Owner when
  `/ctx:task` starts and the code has been read. Logic found while building goes to the
  epic's E0, never to the task.
- **Breakdown asks, then writes.** `/ctx:breakdown` settles three things with the
  Owner: the slices (every AC in exactly one), their order, and where the steps live.
  An epic with one or two slices keeps them in a new **Tasks** section and gets no task
  files; `/ctx:task` and `/ctx:sync` handle that section.
- **Coverage gate.** E3 **In** is a table with a **Covered by** column. An epic cannot
  move `draft → ready` while an In row names no rule, or a screen or a denied cell of
  the permission matrix is in no rule's covers line.
- **One numbered section, one step.** Questions move to **E0** (used in every step).
  Design is **E4**; Flows and screens leave it and become **E5**. E5 cites flow and
  screen IDs only, and the screen table loses its Rules column: each rule in E6 gets a
  covers line naming its flows and screens instead. A reader in the flow step no longer
  has to open the rules first.

## [3.3.0] - 2026-10-12

### Added

- **Ownership: the Owner writes the logic, Claude writes the mechanics.** A new
  convention (`shared/conventions/ownership.md`) splits every epic and task into logic
  (problem, done, scope, the chosen option, rules, expected values, slicing) and
  mechanics (EARS wording, boundary points, blast radius, test design). `epic`,
  `breakdown`, `create-task`, and `task` now ask the Owner to write the logic first,
  review it by adding questions instead of answers, and record a design choice only
  with one sentence of why in the Owner's words.

- **Provenance labels.** Items in logic sections end with `[Owner]`, `[Q-n]` (copied
  from an answered question), or `[Claude-proposed]`. Claude never labels its own draft
  `[Owner]`, and a blanket "looks good" converts nothing.

- **Gates.** An epic cannot move `draft → ready` while a logic section holds
  `[Claude-proposed]`, an expected value is `?`, or a blocking question is open. A task
  cannot become `done` without a test result recorded by the Owner in **T5 · Test
  Results**; `sync` no longer auto-promotes such a task.

- **Size line.** Epics and tasks start with `Size: <S|M|L> · <reason>`, chosen by risk
  by the Owner. L is an epic plus tasks, M is one standalone task holding its own
  problem, questions, and rules, S needs no file.

- **New templates.** Epic parts E1 Problem, E2 Done and measure (with baseline), E3
  Scope (with situational edge cases), E4 Questions (the test oracle), E5 Design, E6
  Rules and examples, E7 Outcome. Task parts T1 Slice, T2 Acceptance Criteria, T3 Test
  Design, T4 Progress Log, T5 Test Results, T6 Release, plus a compact size M shape.

- **Traceability in breakdown.** Breakdown never adds rules. Every AC cites a rule ID
  and every expected value cites its source; a value with no source is `?` plus a new
  question in the epic's E4. The Owner confirms the slices before files are written.

- **Logic mismatch always stops `task`.** A rule the code contradicts, an expected value
  that cannot be met, a case no rule covers, or a test that looks wrong: Claude adds a
  question and waits instead of choosing.

- **Optional checklist binding** (`shared/conventions/checklist-binding.md`). A project
  can name its own phase checklist folder in `.context/ctx-config.md`; the skills then
  read only the phases they own for the current size, follow pointers lazily, never
  tick a row, and end with a report of which rows Claude did and which are the
  Owner's. Without the line nothing changes.

### Compatibility

- Older epics (`## High-Level Requirements`) and older task files (no part codes, no
  T5) stay valid. Skills read them as before; the new gates apply only to sections that
  exist.

## [3.2.0] - 2026-10-09

### Added

- **The spec scan now reads your request, not only its own draft.** `epic`,
  `create-task`, and `breakdown` run the smell scan on the description you typed,
  before any code research happens, and turn each hit into a clarifying question in the
  same turn. The previous single pass ran after drafting, which meant the skill
  researched the code, wrote clean criteria, then graded its own clean criteria and
  found nothing — while the ambiguity you actually typed had been quietly absorbed into
  implementation steps.

- **Set-level checks.** Two checks now read the whole criteria set instead of one line
  at a time, because a set can be entirely valid line by line and still fail to pin
  down the goal:
  - **Threshold** — if the goal is a measurable improvement, at least one criterion
    must state the number to reach. A set where every line is work to perform
    ("no longer fetches 200 posts", "reads only the needed columns") plus a
    before-and-after measurement passes in full while the page stays exactly as slow.
  - **Failure path** — promoted from a footnote under EARS to a named set-level check.

### Changed

- **The spec check report must use the block format.** Prose such as "criteria look
  observable and two failure paths are present" is a summary of the scan, not its
  output. Every finding now carries a location, the smell, and a `→` line holding the
  replacement sentence; a finding whose second line is advice is unfinished and must
  either be written properly or dropped.

- **Plain wording in `task` and `domain`.** The MANDATORY and NON-NEGOTIABLE markers
  are gone; the steps they marked still apply exactly as before. Current models follow
  plainly stated instructions closely, and capitalised pressure made them over-apply.

---

## [3.1.0] - 2026-08-09

### Added

- **Spec quality scan** — `epic`, `create-task`, and `breakdown` now check the wording
  of requirements and acceptance criteria before showing you a draft. It flags the
  sentence shapes that cannot be tested (vague quantifiers, subjective adjectives,
  two requirements in one line, unverifiable verbs) and flags a task that has no
  failure-path criterion at all. Every finding comes with the replacement sentence, so
  acting on one costs a keystroke rather than a decision. New convention:
  `shared/conventions/spec-quality.md`, which also carries the five EARS patterns.

  **It warns, it never blocks.** No skill withholds a draft or refuses to write a file
  because of a finding. A clean scan prints one line, and the report is capped at five
  findings so it cannot turn into noise.

### Fixed

- `breakdown` still listed `in-progress` as an epic status. An epic stays
  `broken-down` for the whole time its tasks are being worked on.

---

## [3.0.0] - 2026-08-08

Breaking release. Six skills were removed and the setup surface collapsed to two
commands. Nothing in `.context/` changes format, so existing projects keep working —
only the commands you type change.

### Removed

- **`investigate`** — a third planning path that duplicated `epic` in everything but its
  filename prefix (`inv-` vs `epic-`) and its own status lifecycle. Bugs and defects now
  go through `create-task` (small, cause already understood) or `epic` (large, cause
  unclear). The epic template already had every section a bug write-up needs — `## Why`,
  `## Scope`, `## Technical Considerations`, `## Risks & Warnings` — so the investigation
  template was pure duplication. See `shared/workflows/bug-flow.md`.
  - `.context/investigations/` is no longer created or scanned. **Migration:** if you
    have investigation files, move them to `.context/plans/` and rename `inv-<name>.md`
    to `epic-<name>.md`. `/ctx:breakdown` then treats them like any other epic.
- **The execution-logging subsystem**, and the `recap` skill that read it. Logging never
  actually ran: the write step lived in a skill nothing invoked, so every consumer's log
  directory was empty and `recap` had nothing to report on. Removed rather than repaired.
  **Migration:** delete `~/.claude/plugins/data/<marketplace>/ctx-logs` by hand if it
  exists; the plugin no longer touches it.
- **`vision`, `architecture`, `techstack`, `context-init` as skills.** They are now
  **procedures** — plain markdown in `shared/procedures/`, read and followed by `start`
  and `onboard`. Six setup commands where a user could only reasonably guess at two was
  a discovery problem, not a capability the removal takes away: every question they asked
  is still asked, by the two commands that remain.
  **Migration:** `/ctx:vision` → `/ctx:start` (it detects existing files and enters
  update mode for just the parts you pick). Same for `/ctx:architecture`,
  `/ctx:techstack`, `/ctx:context-init`.
- **`ctx-config.json` and the config layer** (`config-convention.md`,
  `modes-convention.md`). Nine documented settings, exactly one of which any skill ever
  read. **Migration:** `verification.carefulMode` is now the `/ctx:task --careful` flag.
  `freezeMode` has no replacement. Delete the file; nothing reads it.

### Fixed

- **The context bank was never created by either orchestrator.** `start` and `onboard`
  both ran the context-bank step *last* and guarded it on "if `.context/` doesn't
  exist" — but the vision step had already written `.context/vision.md` several steps
  earlier, so the guard always saw a folder and always skipped. Consequence:
  `progress.md`, `decisions.md`, `tasks/`, `tasks-done/`, `plans-done/`, and the
  `## Project Context` block in `CLAUDE.md` were silently never created, and the first
  `/ctx:breakdown` had nowhere to write. The context bank is now **step 1, unconditional**
  in both skills, and idempotent so re-running is safe.
- **Skill discovery could not see plugin skills.** `/ctx:breakdown` enumerated candidate
  skills by globbing `.claude/skills/*/` and `~/.claude/skills/*/`. Every skill shipped
  by a plugin lives under `~/.claude/plugins/` and matched neither glob, so plugin skills
  were invisible to task planning. Adding a third glob is a trap — the plugin cache holds
  several versions of the same plugin under two different directory layouts, so a glob
  can resolve to a stale version. Discovery now reads the skill list already present in
  the agent's context, which Claude Code populates with project, user, **and** plugin
  skills.
- **Tasks recorded a skill's file path instead of its name.** A path goes stale the
  moment a plugin updates or a skill moves between project and user scope; v2.0.6 added
  self-healing re-discovery to work around it. `/ctx:breakdown` now writes the skill
  **name** on the `**Specialized Skill:**` line and `/ctx:task` invokes it by name
  through the Skill tool. Old task files with paths still work.
- **`.project-init.md` had two documented locations** — `file-contracts.md` said
  `.context/.project-init.md`, everything else said the repo root. Repo root is correct.
- **`status-lifecycle.md` still documented formats no skill reads.** Its "Status
  Metadata" section offered YAML frontmatter and a `**Status:**` bold line as equally
  valid, and the `pending` / `in-progress` / `blocked` examples used both — while every
  skill reads a `## Status` heading and nothing else. All examples now match the real
  task and epic templates, and `/ctx:list` (a command that does not exist) is gone.
- **Epics had a fifth status nothing could write.** `status-lifecycle.md` listed
  `broken-down → in-progress → completed`, but `/ctx:sync` only ever transitions
  `broken-down → completed`, and `file-contracts.md` listed four statuses, not five. An
  epic now stays `broken-down` for the whole time its tasks are worked on; per-task state
  already lives in the task files and `progress.md`. `epic-template.md` offered a fourth
  contradictory set (`draft | ready | in-progress | done`) and now matches.

### Changed

- **`/ctx:task --careful`** replaces the `carefulMode` config key. It forces `full`
  verification regardless of the task's `## Verification` level. Default behavior is
  unchanged: the level in the task file governs.
- **Subagent delegation is now specified, not implied.** `task` gained `Task` and `Skill`
  in `allowed-tools`; `breakdown`, `create-task`, `epic`, `start`, and `onboard` gained
  concrete guidance on what to send to an Explore agent and when. `onboard` fans out
  parallel Explore agents for structure, stack, and patterns instead of reading the
  repo serially. `domain` gained `Task` — it documented Explore delegation for extract
  mode without the grant to do it. `shared/subagents.md` was rewritten and the
  non-existent `package-installer` agent removed from it.
- **`/ctx:start` gained a mode check.** It now detects an existing codebase and redirects
  to `/ctx:onboard`, and detects partial setup and offers to fill in only what's missing.

### Documentation

- `references/diagrams/workflow-diagram.md` and `skill-relationships.md` redrawn around
  the ten-skill model.
- `README.md` rewritten: two setup commands, no `investigate`, no `--metrics`, accurate
  skill counts.
- Deleted three orphaned reference documents that nothing linked to and that taught the
  removed four-command setup model: `references/examples/new-project-example.md`,
  `shared/workflows/new-project-flow.md`, `shared/workflows/onboarding-flow.md`.

---

## [2.2.0] - 2026-07-28

### Fixed

- **Duplicate task numbers** — the "find the next number" recipe in `task-naming.md` was `ls .context/tasks-done/ | tail -1`. Since tasks are archived into per-epic subfolders (`tasks-done/epic-auth/…`), that flat listing returns *directory names*, so every archived task was invisible to the scan and freshly archived numbers were handed straight back out. Observed in the wild: two task 390s and two task 391s in one project. All numbering now goes through a recursive, numerically-sorted scan of both directories, plus an explicit "is this number free" check before the file is written. Applied to `create-task` and `breakdown` (which mints a whole block at once, so a bad start duplicates all of it).
- **`done` with unfinished acceptance criteria** — `/ctx:task` said to mark `done` after all ACs are checked, but nothing stopped `done` being written while ACs were still `[ ]`. `/ctx:sync` only auto-corrected the opposite direction (all ACs checked → `done`), so the contradiction was never surfaced. `done` is now explicitly gated on the checkbox count, and sync reports the contradiction and proposes `done → in-progress` rather than resolving it silently.
- **Qualified status lines silently drop a task from every count** — `## Status: done (pending visual verify)` matches no status token, so sync neither archived nor flagged the task and it disappeared from the progress tracker until someone opened the file by hand. The status line is now specified as one bare token (`pending` / `in-progress` / `blocked` / `done`), caveats belong in `## Progress Log`, and sync reports a decorated status as malformed instead of prefix-matching it.
- **`status-lifecycle.md` documented a vocabulary nothing used** — it described task statuses as `completed` in `**Status:**` frontmatter, while the template, `/ctx:task` and `/ctx:sync` all use `done` on a `## Status:` line. The task sections now match what the skills actually read. (`completed` remains correct for epics and investigations, which are separate lifecycles.)

### Added

- **`/ctx:sync` integrity check** — sync is the only skill that sees every task at once, so it now scans for duplicate task numbers and status/AC contradictions on every run. Both are report-only: a task number appears in commit messages and branch names, so renumbering is the user's call, and only the newest file is ever a candidate (an archived number is already in git history).

---

## [2.1.0] - 2026-06-30

### Added

- **`/ctx:task` now briefs the user before implementing** — a new mandatory step runs before "Begin work" with two parts:
  - **Explain the task & its context** — describes, in plain language, what the task accomplishes, why it exists (the parent epic/investigation), and where it fits in the bigger picture. Written for a reader who knows the overall system but nothing about this task or its epic.
  - **Reconcile the approach** — summarizes the approach the task file prescribes, then scans/verifies the actual code and presents the recommended approach, explicitly flagging any mismatch between the task's (possibly stale) assumptions and the current state. Pauses for confirmation when a significant mismatch is found.

---

## [2.0.6] - 2026-06-22

### Fixed

- **Specialized-skill path resolution** — `/ctx:breakdown` now records each skill's SKILL.md at the location the discovery glob actually found it, with project-level `.claude/skills/<name>/` taking precedence over user-level `~/.claude/skills/<name>/`. Previously it could hardcode the `~/.claude/...` path even when the skill lived project-level, so `/ctx:task` failed to load it.
- **`/ctx:task` self-heals stale skill paths** — when a task's `**Specialized Skill:**` path does not resolve, the skill now re-discovers by globbing `.claude/skills/<name>/` then `~/.claude/skills/<name>/` instead of aborting. Existing tasks with the old hardcoded path keep working.
- **Agent + commit-skill discovery now checks project-level too** — the verification (test-runner) and commit-skill globs in `/ctx:task` scan `.claude/agents/` & `.claude/skills/` before `~/.claude/...`, no longer user-level only.

### Changed

- Path guidance in `breakdown/SKILL.md`, `task/SKILL.md`, `task-template.md`, and the skill-relationships diagram now states that paths use forward slashes + `~` (home), which Claude Code resolves on macOS, Linux, and Windows alike — never OS-specific separators or absolute paths.

---

## [2.0.5] - 2026-04-01

### Changed

- **Logging strategy revised** — removed plugin hooks approach (unreliable on Windows); added explicit "Final Step — Execution Log" to all 14 skills
- Skills now directly append to `execution.jsonl` with full outcome data (success/failure/partial/corrected + details)
- Plugin hooks removed; logging now guaranteed via skill-level instructions

### Removed

- `hooks/` folder and `hooks.json` — plugin hooks were not firing reliably

---

## [2.0.4] - 2026-04-01

### Fixed

- **Duplicate hooks error** — removed `hooks` field from plugin.json; `hooks/hooks.json` is auto-discovered by convention, declaring it causes duplicate load

---

## [2.0.3] - 2026-04-01

### Fixed

- **Invalid plugin manifest** — `hooks` field must be a string path (`"./hooks/hooks.json"`), not an object with `source` key

---

## [2.0.2] - 2026-04-01

### Fixed

- **Plugin hooks not firing** — added `hooks.source` declaration in plugin.json manifest so plugin system loads hooks.json
- **Hook command** — removed non-existent `$TOOL_INPUT` env var, added `mkdir -p` for log directory creation

---

## [2.0.1] - 2026-04-01

### Added

- **Plugin hook for execution logging** — `hooks/hooks.json` with `PostToolUse` hook that fires after every ctx skill invocation. This is a debug/verification version to confirm hook input format before building full logging.

### Changed

- **Logging strategy** — moved from convention-only (skills self-log as final step) to hybrid approach: plugin hooks for guaranteed basic logging + skill-level logging for outcome data

---

## [2.0.0] - 2026-03-27

### Added

- **Gotchas sections** for all 16 skills — documenting specific failure modes Claude encounters, with auto-maintenance protocol via `/ctx:sync`
- **`gotchas-convention.md`** — standard format and maintenance rules for gotchas
- **Dynamic Config System** — layered config (`${CLAUDE_PLUGIN_DATA}/ctx-config.json` → `.context/ctx-config.json`) with defaults for naming, verification, logging, integrations, and onboarding tiers
- **`config-convention.md`** — config schema, merge rules, and loading protocol
- **Logging Infrastructure** — execution.jsonl (all skill invocations), sync-history.jsonl (velocity tracking), recaps.log (weekly summaries)
- **`logging-convention.md`** — log schemas, failure tracking, and data retention
- **Impact-Based Verification** — `Verification: none | test | full` field in task template; breakdown/create-task set level based on scope; task skill respects level on completion
- **Self-Learning Mechanisms** — sync skill scans failure logs, detects patterns (>= 2 failures of same type), proposes new gotchas with user confirmation
- **Execution Metrics** — `/ctx:progress --metrics` shows velocity, trend, top failing skills from log data
- **Careful/Freeze Modes** — config-driven behavior overrides: careful mode forces full verification, freeze mode makes task/sync read-only
- **`modes-convention.md`** — documents careful and freeze mode behavior per skill
- **`/ctx:recap` skill** (16th skill) — weekly progress recap with velocity trends, git activity, and week-over-week comparison
- **External Skill Ecosystem** section in skill-relationships.md — documents discovery-based integration with user-scope skills and MCP tools
- **CTX task context detection in `/cap`** — auto-detects in-progress task and suggests task ID in commit scope
- **Discovery-based verification** in `/ctx:task` — discovers test-runner/build-validator agents if available, suggests running with user confirmation
- **Discovery-based commit suggestion** in `/ctx:task` — discovers commit skills and suggests using them with task reference

### Changed

- **All 15 skill descriptions rewritten** for model triggering — added trigger keywords, negative triggers, and use-case examples
- **6 oversized skills extracted** into progressive disclosure references (domain 491→316, create-task 414→323, architecture 403→337, breakdown 384→302, investigate 358→316)
- **`/ctx:context-init`** now offers project config creation (`.context/ctx-config.json`)
- **`file-contracts.md`** updated with Verification field, config contracts, and logging contracts
- **Task template** updated with `## Verification: none | test | full` field
- **`remember` global skill** description updated with trigger patterns

### Fixed

- **Epic status values** aligned: template now uses `draft | ready | broken-down | in-progress | completed` (was `draft | ready | in-progress | done`)
- **Investigation status values** aligned: template now uses `draft | ready | analyzed | broken-down | in-progress | completed` (was `investigating | ready | in-progress | done`)
- **Sync skill** now writes `completed` for epic/investigation terminal status (was `done`)
- **Sync embedded lifecycle** table aligned with status-lifecycle.md
- **Breakdown lifecycle listing** now includes all states with reference to status-lifecycle.md
- **Start skill** removed broken `/ctx:next` reference

---

## [1.3.1] - 2026-03-20

### Added

- **Skill Discovery Protocol** — `/ctx:breakdown` scans user's installed skills (project and personal level) once per breakdown, matches them to tasks, and writes references into task files
- **Specialized Skill loading in `/ctx:task`** — reads only relevant sections of matched skills, no re-scanning across tasks
- **Fallback discovery in `/ctx:task`** — lightweight scan for tasks created via `/ctx:create-task` when ACs clearly need specialized work
- **`Specialized Skills` section** in epic template — tracks which skills are used by which tasks
- **`Specialized Skill` field** in task template — points to skill path and key sections to read

---

## [1.3.0] - 2026-03-20

### Added

- **`/ctx:domain` skill** — 15th skill for capturing business logic, flows, rules, invariants, and edge cases in plain text using DDD naming conventions
- **Domain Impact Protocol** — epic, breakdown, and task skills auto-detect business logic changes, generate proposed domain updates, and require user confirmation before writing
- **Domain freshness check in `/ctx:sync`** — warns when domain.md may be stale relative to completed epics
- **Domain coverage indicator in `/ctx:progress`** — shows whether business logic is documented, partial, or missing
- **`domain-template.md`** in shared templates
- **`domain.md` file contract** in file-contracts.md with full read/write relationships

### Changed

- **Renamed `epic-done/` → `plans-done/`** across all skills, conventions, workflows, and diagrams — reflects that the folder archives both epics and investigations
- **`/ctx:epic`** now reads domain.md and runs Domain Impact Analysis after generating epic
- **`/ctx:breakdown`** reads domain.md, references rule IDs in task acceptance criteria, checks for undocumented entities
- **`/ctx:task`** reads domain.md, checks domain rules on completion, stops on code-vs-domain conflicts
- **`/ctx:investigate`** reads domain.md to distinguish bugs from undocumented behavior
- **`/ctx:context-init`** detects domain.md presence, suggests `/ctx:domain` if missing
- **`/ctx:onboard`** suggests domain documentation when business logic patterns detected
- **`/ctx:start`** adds optional domain model step (Step 4) in project setup flow
- **`/ctx:architecture`** suggests `/ctx:domain` after `--add-domain`
- Updated README: Planning section now 5 skills (added domain)
- Updated skill-relationships.md and workflow-diagram.md with domain integration

---

## [1.2.0] - 2026-03-16

### Added

- **`epic-done/` archive folder** for completed epics and investigations, unified from separate `epics-done/` and `investigations-done/`
- **Subfolder organization in `tasks-done/`** — completed tasks are now archived into subfolders by epic name (e.g., `tasks-done/epic-auth/`), with `other/` for standalone tasks

### Changed

- Updated all skills, conventions, workflows, and examples to reflect new archive structure
- Removed `workflow.md` from context-init (was stale/unused in practice)
- Removed `.gitkeep` placeholder files from context-init structure

### Fixed

- Fixed stale `epics/` folder references → `plans/` across onboarding-flow, status-lifecycle, and other docs

---

## [1.1.5] - 2026-03-15

### Fixed

- Fixed marketplace.json plugin source path from `../plugins/ctx` to `./plugins/ctx`

---

## [1.1.4] - 2026-03-15

### Fixed

- Fixed marketplace.json source to use relative path (`../plugins/ctx`) for correct plugin resolution

---

## [1.1.2] - 2026-03-15

### Changed

- Renamed `init` skill to `context-init` (`/ctx:context-init`) to avoid conflict with Claude Code's built-in `/init` command
- Updated all references across skills, shared docs, examples, and diagrams

### Added

- **Error handling sections** to 8 skills: architecture, breakdown, create-task, epic, investigate, onboard, sync, vision
- **Shared conventions**: `error-handling.md`, `file-contracts.md` for consistent error behavior across skills
- **Shared subagents reference**: `subagents.md` documenting available built-in subagents

### Fixed

- Fixed shared path references (`_shared` → `shared`) across all skills
- Clarified subagent labels as "(built-in)" for accuracy

---

## [1.0.0] - 2026-02-11

### Added

**Initial Plugin Release**

Migrated 14 standalone skills into unified `ctx` plugin:

**Setup & Initialization (6 skills)**:
- `vision` - Define/update project vision and scope
- `architecture` - Define/update architectural patterns
- `techstack` - Select/update technologies
- `init` - Initialize .context/ folder structure
- `onboard` - Analyze existing project
- `start` - Complete new project setup (orchestrator)

**Planning (4 skills)**:
- `epic` - Create feature epic
- `investigate` - Investigate bug/refactor
- `breakdown` - Decompose epic/investigation into tasks
- `log-decision` - Record architecture decision

**Task Management (4 skills)**:
- `create-task` - Create standalone task
- `task` - Load and work on task
- `progress` - View project status
- `sync` - Reconcile progress with files

**Plugin Resources**:
- Shared templates for task, epic, investigation, vision, patterns files
- Workflow guides for common development flows
- Conventions documentation (naming, complexity, status lifecycle)
- Usage examples and diagrams
- Complete README and documentation

### Changed

**Skill Invocation** (namespace required):
- Old: `/vision` → New: `/ctx:vision`
- Old: `/task 042` → New: `/ctx:task 042`
- Old: `/epic "Feature"` → New: `/ctx:epic "Feature"`

**Skill Names** (shortened for brevity):
- `init-context` → `init`
- `create-standalone-task` → `create-task`
- `onboard-project` → `onboard`

**Structure**:
- All skills now use `SKILL.md` format (uppercase)
- Skills organized in plugin directory structure
- Shared resources centralized in plugin

### Migration Notes

**From Standalone Skills**:

If you were using the old standalone skills:
1. Old skills have been removed
2. Install this plugin to personal marketplace
3. Update your muscle memory for new namespace (`/ctx:`)
4. All functionality preserved, just different invocation

**Breaking Changes**:
- Skill names now require `/ctx:` namespace prefix
- No backward-compatible aliases (clean break)

**Benefits**:
- ✅ All context skills in one unified package
- ✅ Better organized with shared templates
- ✅ Can be distributed and versioned
- ✅ Consistent structure across all skills

### Technical

**Plugin Structure**:
```
ctx/
├── .claude-plugin/plugin.json
├── skills/              # 14 skill directories
├── shared/              # Templates, workflows, conventions
├── references/          # Diagrams, examples
└── README.md
```

**Installation**:
- Personal marketplace: `claude plugin install ctx@personal --scope user`
- Development mode: `claude --plugin-dir ~/.claude/skills/ctx`

---

## Future Releases

### Planned for 1.1.0
- [ ] Additional workflow templates
- [ ] Enhanced examples with screenshots
- [ ] Integration with build-validator and test-runner agents

### Planned for 2.0.0
- [ ] Public marketplace distribution
- [ ] Team collaboration features
- [ ] Enhanced progress visualization

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 2.0.6 | 2026-06-22 | Fix specialized-skill path resolution (project-level precedence, self-healing, cross-platform notes) |
| 2.0.5 | 2026-04-01 | Move logging from plugin hooks to skill-level instructions |
| 2.0.4 | 2026-04-01 | Remove duplicate hooks declaration — auto-discovered |
| 2.0.3 | 2026-04-01 | Fix invalid manifest — hooks field must be string path |
| 2.0.2 | 2026-04-01 | Fix plugin hooks not firing — add manifest declaration |
| 2.0.1 | 2026-04-01 | Plugin hook for execution logging (debug version) |
| 2.0.0 | 2026-03-27 | Self-learning, config system, logging, progressive disclosure, recap skill, cross-connections |
| 1.3.1 | 2026-03-20 | Add Skill Discovery Protocol for breakdown and task skills |
| 1.3.0 | 2026-03-20 | Add /ctx:domain skill, Domain Impact Protocol, rename epic-done → plans-done |
| 1.2.0 | 2026-03-16 | Add epic-done archive, tasks-done subfolder org, remove stale workflow.md |
| 1.1.5 | 2026-03-15 | Fix marketplace plugin source path |
| 1.1.4 | 2026-03-15 | Fix marketplace source to use relative path |
| 1.1.2 | 2026-03-15 | Rename init→context-init, add error handling conventions, fix shared paths |
| 1.0.0 | 2026-02-11 | Initial plugin release with 14 migrated skills |
