# File Contracts

Defines the required sections for each context file type, and which skills read/write them. This is the single source of truth for inter-skill dependencies.

When modifying a file's format, check the **Read by** column to understand which skills will be affected.

---

## vision.md

| | |
|---|---|
| **Location** | `.context/vision.md` |
| **Written by** | `/ctx:vision`, `/ctx:start`, `/ctx:onboard` |
| **Read by** | `/ctx:architecture`, `/ctx:techstack`, `/ctx:epic` |

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
| **Written by** | `/ctx:architecture`, `/ctx:onboard` |
| **Read by** | `/ctx:epic`, `/ctx:breakdown`, `/ctx:task`, `/ctx:techstack` |

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
| **Location** | `.context/.project-init.md` |
| **Written by** | `/ctx:techstack`, `/ctx:onboard` |
| **Read by** | (reference only — not consumed by other skills programmatically) |

**Required sections:**
- Project structure section (repo type, package manager, language)

---

## Epic files

| | |
|---|---|
| **Location** | `.context/plans/epic-<name>.md` |
| **Written by** | `/ctx:epic` |
| **Read by** | `/ctx:breakdown` |

**Required sections:**
- `# Epic: [Name]` — title
- `## Summary` — one paragraph
- `## Scope` with `### In Scope` and `### Out of Scope`
- `## High-Level Requirements` — numbered list (this is what breakdown decomposes)
- `## Status` — one of: `draft`, `ready`, `broken-down`, `completed`

**Optional but recommended:**
- `## Why`, `## Target Users`, `## Technical Considerations`
- `## Risks & Warnings`, `## Alternatives Considered`
- `## Success Criteria`, `## Estimated Complexity`

---

## Investigation files

| | |
|---|---|
| **Location** | `.context/investigations/inv-<name>.md` |
| **Written by** | `/ctx:investigate` |
| **Read by** | `/ctx:breakdown` |

**Required sections:**
- `# Investigation: [Title]`
- `## Type` — one of: `bug`, `performance`, `refactor`, `tech-debt`, `security`
- `## Summary` — one paragraph
- `## Findings` with `### Root Cause / Current State`
- `## Proposed Approach` — at least one option
- `## Status` — one of: `investigating`, `ready`, `broken-down`, `done`

**Optional but recommended:**
- `## Issue Description` (Expected/Actual/Severity)
- `## Affected Files`, `## Reproduction Steps`
- `## Test Strategy`, `## Estimated Complexity`

---

## Task files

| | |
|---|---|
| **Location** | `.context/tasks/NNN-<name>.md` |
| **Written by** | `/ctx:breakdown`, `/ctx:create-task` |
| **Read by** | `/ctx:task`, `/ctx:progress`, `/ctx:sync` |

**Required sections:**
- `# Task: [Title]` — clear, actionable title starting with a verb
- `## Status` — one of: `pending`, `in-progress`, `blocked`, `done`
- `## Goal` — one sentence
- `## Acceptance Criteria` — checklist with `- [ ]` items (minimum 1)
- `## Complexity` — one of: `S`, `M`, `L`, `XL`

**Optional but recommended:**
- `## Context`, `## Technical Notes`, `## Files to Touch`
- `## Dependencies`, `## Progress Log`

**Filename contract:**
- Pattern: `NNN-verb-subject.md` (e.g., `001-add-auth-middleware.md`)
- NNN: 3-digit sequential, zero-padded, never reused

---

## progress.md

| | |
|---|---|
| **Location** | `.context/progress.md` |
| **Written by** | `/ctx:init`, `/ctx:breakdown`, `/ctx:create-task`, `/ctx:sync` |
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
| **Written by** | `/ctx:log-decision`, `/ctx:init` |
| **Read by** | `/ctx:breakdown`, `/ctx:architecture` |

**Required format per entry:**
- `### [Date] Decision Title`
- `**Context:**`, `**Decision:**`, `**Rationale:**`, `**Consequences:**`

---

## Validation Rules for Skills

### Skills that WRITE files
Must include ALL required sections as defined above. Never produce files missing required sections.

### Skills that READ files
Must validate required sections exist before processing. On missing sections, follow the error handling convention in `error-handling.md`.
