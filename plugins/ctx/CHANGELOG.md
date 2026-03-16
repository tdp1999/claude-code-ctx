# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
| 1.2.0 | 2026-03-16 | Add epic-done archive, tasks-done subfolder org, remove stale workflow.md |
| 1.1.5 | 2026-03-15 | Fix marketplace plugin source path |
| 1.1.4 | 2026-03-15 | Fix marketplace source to use relative path |
| 1.1.2 | 2026-03-15 | Rename init→context-init, add error handling conventions, fix shared paths |
| 1.0.0 | 2026-02-11 | Initial plugin release with 14 migrated skills |
