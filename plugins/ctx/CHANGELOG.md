# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
