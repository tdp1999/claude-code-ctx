# CTX Plugin - Skill Relationships

Visual map of which skills call other skills and their dependencies.

---

## Skill Relationship Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   ORCHESTRATORS                          │
│  (Skills that call multiple other skills)               │
└─────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────▼────┐    ┌─────▼─────┐   ┌────▼─────┐
   │  start  │    │  onboard  │   │   epic   │
   └────┬────┘    └─────┬─────┘   └────┬─────┘
        │               │               │
        │               │               │
  Calls │         Calls │         Calls │
        │               │               │
┌───────▼────────────┐  │       ┌───────▼──────┐
│ vision             │  │       │ log-decision │
│ architecture       │  │       └──────────────┘
│ techstack          │  │
│ init               │  │
└────────────────────┘  │
                        │
                ┌───────▼─────────────┐
                │ vision --extract     │
                │ architecture --extract│
                │ techstack --extract  │
                │ init                 │
                └──────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   DECOMPOSERS                            │
│  (Skills that create multiple task files)               │
└─────────────────────────────────────────────────────────┘
                        │
        ┌───────────────┴───────────────┐
        │                               │
   ┌────▼─────┐                ┌────────▼─────────┐
   │breakdown │                │ create-task      │
   └────┬─────┘                │ (standalone)     │
        │                      └──────────────────┘
        │
  Reads │
        │
┌───────▼──────────┐
│ Epic files       │
│ Investigation    │
│ files            │
└──────────────────┘
        │
  Creates│
        │
┌───────▼──────────┐
│ Task files       │
│ (001-*.md)       │
└──────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   WORKFLOW SKILLS                        │
│  (Skills used in sequence)                              │
└─────────────────────────────────────────────────────────┘

Feature Flow:
  epic → [domain impact?] → breakdown → progress → task → sync

Bug Flow:
  investigate → breakdown → progress → task → sync

Domain Flow:
  domain → (standalone, or triggered by epic/breakdown/task)

Update Flow:
  vision/architecture → log-decision
```

---

## Skill Dependencies Matrix

| Skill | Calls/References | Called By | Creates Files |
|-------|------------------|-----------|---------------|
| **start** | vision, architecture, techstack, init | (user) | Multiple .context files |
| **onboard** | vision --extract, architecture --extract, techstack --extract, init | (user) | Multiple .context files |
| **vision** | log-decision (on update) | start, onboard | .context/vision.md |
| **architecture** | log-decision (on update) | start, onboard | .context/patterns-architecture.md |
| **techstack** | - | start, onboard | .context/.project-init.md |
| **init** | - | start, onboard | .context/* structure |
| **epic** | log-decision (on update) | (user), onboard | .context/plans/epic-*.md |
| **investigate** | - | (user) | .context/investigations/inv-*.md |
| **domain** | - | (user), epic, breakdown, task (via Domain Impact Protocol) | .context/domain.md, .context/domain/*.md |
| **breakdown** | - | (user), after epic/investigate | .context/tasks/NNN-*.md |
| **log-decision** | - | vision, architecture, epic | .context/decisions.md |
| **create-task** | - | (user) | .context/tasks/NNN-*.md |
| **task** | - | (user), after breakdown | Updates task file |
| **progress** | - | (user), after breakdown | Displays .context/progress.md |
| **sync** | - | (user), after task | Moves to .context/tasks-done/ |

---

## Call Chains

### New Project Setup

```
User → /ctx:start
  ├─→ /ctx:vision [user answers questions]
  │     └─→ Creates .context/vision.md
  ├─→ /ctx:architecture [user answers questions]
  │     └─→ Creates .context/patterns-architecture.md
  ├─→ /ctx:techstack [user answers questions]
  │     └─→ Creates .context/.project-init.md
  └─→ /ctx:context-init
        └─→ Creates .context/ folder structure
```

### Existing Project Onboarding

```
User → /ctx:onboard
  ├─→ /ctx:vision --extract [analyzes README, package.json]
  │     └─→ Creates .context/vision.md
  ├─→ /ctx:architecture --extract [analyzes folder structure]
  │     └─→ Creates .context/patterns-architecture.md
  ├─→ /ctx:techstack --extract [analyzes dependencies]
  │     └─→ Creates .context/.project-init.md
  └─→ /ctx:context-init
        └─→ Creates .context/ folder structure
```

### Feature Development

```
User → /ctx:epic "Feature name"
  └─→ Creates .context/plans/epic-feature.md

User → /ctx:breakdown epic-feature
  └─→ Creates .context/tasks/001-*.md through NNN-*.md

User → /ctx:progress
  └─→ Displays pending tasks

User → /ctx:task 001
  └─→ Updates task status to in-progress

User → /ctx:sync
  └─→ Moves completed task to .context/tasks-done/
```

### Vision Update with Decision Logging

```
User → /ctx:vision [when .context/vision.md exists]
  ├─→ Shows current vision
  ├─→ Asks what's changing and why
  ├─→ Updates .context/vision.md with changelog
  └─→ /ctx:log-decision [automatic call]
        └─→ Adds entry to .context/decisions.md
```

---

## Skill Categories

### Setup & Initialization (6 skills)
- **Orchestrators**: start, onboard
- **Core Setup**: vision, architecture, techstack
- **Structure**: init

**Dependencies**:
- start depends on: vision, architecture, techstack, init
- onboard depends on: vision, architecture, techstack, init (all in --extract mode)

---

### Planning (5 skills)
- **Feature Planning**: epic
- **Bug/Refactor**: investigate
- **Domain Knowledge**: domain
- **Decomposition**: breakdown
- **Decision Recording**: log-decision

**Dependencies**:
- breakdown depends on: epic OR investigate (reads their files), domain.md (optional)
- epic can call: log-decision (on updates), domain (via Domain Impact Protocol)
- domain: standalone or triggered by epic/breakdown/task when business logic changes

---

### Task Management (4 skills)
- **Creation**: create-task
- **Execution**: task
- **Tracking**: progress, sync

**Dependencies**:
- task reads: .context/tasks/NNN-*.md, and optionally external skill SKILL.md files (via Skill Discovery — see below)
- progress reads: .context/progress.md, .context/tasks/*
- sync reads/writes: .context/tasks/, .context/tasks-done/, .context/progress.md

---

### Skill Discovery Protocol

CTX can discover and leverage specialized skills installed by the user (project or personal level).

**How it works:**
- `/ctx:breakdown` scans available skills ONCE per breakdown, matches them to tasks, and writes `**Specialized Skill:**` references into task files
- `/ctx:task` reads the reference and loads only the relevant sections of the external skill — no re-scanning needed
- If a task was created without breakdown (e.g., `/ctx:create-task`), `/ctx:task` does a lightweight fallback scan only when ACs clearly need specialized work

**Scan locations:**
- `.claude/skills/*/SKILL.md` (project-level)
- `~/.claude/skills/*/SKILL.md` (user-level)

**Cost optimization:**
- Scan reads frontmatter only (~50 tokens/skill)
- Skill references are persisted in task files — no repeat scanning
- Task skill reads only specified sections, not full skill files

---

## Cross-File References

### Files Read by Multiple Skills

**`.context/vision.md`**:
- Read by: architecture, techstack, epic, onboard
- Created by: vision
- Purpose: Understand project scope and goals

**`.context/patterns-architecture.md`**:
- Read by: epic, breakdown, task
- Created by: architecture
- Purpose: Follow architectural patterns

**`.context/domain.md`**:
- Read by: epic, breakdown, task, investigate
- Created by: domain (and via Domain Impact Protocol from epic/breakdown/task with user confirmation)
- Purpose: Business logic, flows, rules, and edge cases

**`.context/progress.md`**:
- Read by: progress, sync, breakdown
- Updated by: breakdown, create-task, sync
- Purpose: Track task status

**`.context/tasks/`**:
- Read by: task, progress, sync
- Created by: breakdown, create-task
- Moved from by: sync (to tasks-done/)
- Purpose: Active task tracking

---

## Skill Invocation Patterns

### User-Initiated (Direct Calls)
- vision, architecture, techstack, init
- epic, investigate, create-task
- breakdown, task, progress, sync

### Auto-Initiated (Called by Other Skills)
- log-decision (called by vision, architecture, epic on updates)
- vision/architecture/techstack in --extract mode (called by onboard)

### Conditional Calls
- log-decision is only called on UPDATE mode, not CREATE mode
- onboard calls skills in --extract mode, not regular mode

---

## Skill Communication

### Via Files (Asynchronous)
Most skills communicate by creating/reading files:
- epic creates epic file → breakdown reads epic file
- breakdown creates task files → task reads task files
- task updates task status → sync reads status

### Via Direct Calls (Synchronous)
Some skills call others directly:
- start calls vision, architecture, techstack, init in sequence
- onboard calls vision --extract, architecture --extract, etc.
- vision/architecture/epic call log-decision on updates

---

## Quick Reference

**Most Independent Skills** (don't call others):
- init, techstack, investigate, create-task, progress

**Most Connected Skills** (call multiple others):
- start (calls 4 skills)
- onboard (calls 4 skills in extract mode)

**Most Called Skills** (called by others):
- log-decision (called by 3 skills)
- init (called by 2 orchestrators)

**Hub Skills** (both call and are called):
- vision (calls log-decision, called by start/onboard)
- architecture (calls log-decision, called by start/onboard)

---

## External Skill Ecosystem

CTX skills can integrate with user-installed skills and agents via the **Skill Discovery Protocol** (see above) and **fallback discovery**. These integrations are optional — CTX never hard-depends on external skills.

### Discovery Pattern

All external integrations follow this convention:
1. Check if relevant skill/agent exists (glob `~/.claude/skills/*/SKILL.md`, `~/.claude/agents/*.md`)
2. If found → suggest it with context
3. If not found → provide manual alternative
4. **NEVER fail because an external skill is missing**

### Common Complementary Skills

These are examples of skill types that enhance CTX workflows. They are NOT requirements.

| CTX Skill | Complementary Type | Purpose | Fallback |
|-----------|-------------------|---------|----------|
| task | Commit skill | Reference task ID in commits | Manual commit with `feat(task-NNN): goal` |
| task | Test runner agent | Verify task output | Manual test command |
| task | Build validator agent | Check build health | Manual build command |
| investigate | Doc fetcher skill | Library/framework docs | Web search or manual lookup |
| techstack | Package installer agent | Install dependencies | Manual install commands |
| techstack | Doc fetcher skill | Tool documentation | Web search or manual lookup |
| epic | Design skill | UI/UX guidance for features | Manual design decisions |
| breakdown | Skill creator | When tasks need new specialized skills | Create skill manually |

### MCP Integration Points

When MCP tools are available (check allowed-tools), certain skills offer optional integrations:

| CTX Skill | MCP Integration | Config Gate | Behavior |
|-----------|----------------|-------------|----------|
| sync | Atlassian (Jira) | `integrations.jiraSync` | Map task status → Jira transition |
| progress | Atlassian (Jira) | `integrations.jiraSync` | Cross-reference tasks with Jira issues |
| investigate | Atlassian (Jira) | (always offer) | Fetch related Jira issue details |

If MCP tools are NOT available → skip silently, no error.
