---
name: onboard
description: Onboard an existing project by analyzing codebase and extracting vision, architecture, and techstack into context files. Use when joining or documenting an established codebase.
argument-hint: '[optional: path to project]'
allowed-tools: Task, Read, Write, Edit, Glob, AskUserQuestion, Skill
---

# Onboard Project

Analyze an existing codebase and extract its vision, architecture, and techstack into context files. Unlike `/ctx:start` which creates from scratch, this skill **discovers and documents** what already exists.

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

This skill heavily uses:

- **Explore** (built-in) - For analyzing codebase structure, finding patterns, scanning configs

**IMPORTANT:** Use the Task tool with `subagent_type="Explore"` for all codebase analysis instead of manual Glob/Grep/Read calls.

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.

Skill-specific errors:
- **`.context/` already exists with files**: Ask user — overwrite existing context, or merge/update?
- **README.md missing**: Vision extraction will have less data — inform user, rely on package.json and code analysis
- **No package.json**: Techstack extraction limited — inform user, ask for manual input on key technology choices

---

## Input

`$ARGUMENTS` can be:

- Empty: Analyze current working directory
- Path: Analyze specified directory

---

## Workflow

### Step 1: Initial Analysis

Use Explore subagent to gather information:

**Prompt for Explore:**

```
Analyze this codebase and report:

1. Project identity:
   - README.md content (summary, purpose)
   - package.json (name, description, keywords)
   - Any docs/ folder content

2. Folder structure:
   - Top-level directories
   - Source code organization (src/, apps/, libs/, etc.)
   - Monorepo indicators (nx.json, turbo.json, pnpm-workspace.yaml)

3. Technology detection:
   - package.json dependencies (frameworks, libraries)
   - Config files present (tsconfig, eslint, prettier, docker, etc.)
   - Database indicators (prisma/, migrations/, ormconfig)

4. Architecture indicators:
   - Folder patterns (modules/, features/, domain/, infrastructure/)
   - File naming patterns (*.controller.ts, *.service.ts, *.repository.ts)
   - API style indicators (resolvers = GraphQL, controllers = REST)

Return a structured summary.
```

---

### Step 2: Present Findings

Show user what was discovered:

```markdown
## Project Analysis

### Identity

- **Name:** [from package.json]
- **Description:** [from README or package.json]

### Structure

- **Type:** [monorepo-nx / monorepo-turborepo / single-repo]
- **Source layout:** [description]

### Detected Stack

- **Frontend:** [framework, version]
- **Backend:** [framework, version]
- **Database:** [type, ORM]
- **Testing:** [frameworks]
- **CI/CD:** [detected]

### Detected Architecture

- **Backend style:** [hexagonal / layered / modular / unclear]
- **Frontend style:** [feature-modules / atomic / flat / unclear]
- **API style:** [REST / GraphQL / mixed]

### Confidence

- High confidence: [list]
- Uncertain: [list - need user confirmation]
```

Ask user: "Is this analysis correct? What needs adjustment?"

---

### Step 3: Extract Vision

Run `/ctx:vision` in **extract mode**:

- Pass the analysis findings
- Vision skill will create `.context/vision.md` based on discovered info
- User confirms or adjusts

---

### Step 4: Extract Architecture

Run `/ctx:architecture` in **extract mode**:

- Pass the detected patterns and structure
- Architecture skill will create `.context/patterns-architecture.md` based on findings
- User confirms or adjusts

---

### Step 5: Extract Techstack

Run `/ctx:techstack` in **extract mode**:

- Pass the detected dependencies and configs
- Techstack skill will create `.project-init.md` based on findings
- User confirms or adjusts

---

### Step 6: Initialize Context

Check if `.context/` exists:

- If not: Run `/ctx:init` to create folder structure
- If exists: Skip, just ensure all files are in place

---

### Step 7: Ask About Epics

Ask user:

```
The project is now documented. Do you have any features you'd like to plan?

Options:
1. Yes - create an epic for a new feature
2. No - I'm done for now
```

If yes: Run `/ctx:epic` for the feature
If no: Proceed to summary

---

### Step 8: Summary

```markdown
## Project Onboarded!

### Files Created

- `.context/vision.md` - Project vision (extracted)
- `.context/patterns-architecture.md` - Architecture patterns (detected)
- `.project-init.md` - Technology stack (detected)
- `.context/` folder structure

### What Was Discovered

- **Vision:** [one sentence]
- **Architecture:** [backend + frontend style]
- **Stack:** [main technologies]

### Next Steps

1. Review the generated files for accuracy
2. Add code patterns to `.context/patterns-architecture.md` as you discover them
3. Use `/ctx:epic` to plan new features
4. Use `/ctx:investigate` to document bugs or refactors
5. Use `/ctx:breakdown` to create tasks

### Quick Reference

- `/ctx:epic` - Plan a new feature
- `/ctx:investigate` - Analyze a bug or refactor
- `/ctx:vision` - Update project vision
- `/ctx:architecture` - Update architecture patterns
```

---

## Handling Uncertainty

When analysis is uncertain:

**Ask user directly:**

- "I found both REST controllers and GraphQL resolvers. Is this project using both, or is one deprecated?"
- "The folder structure suggests hexagonal architecture but it's not consistent. Was this intentional?"

**Don't assume:**

- If patterns are inconsistent, note it in patterns-architecture.md
- If purpose is unclear, ask user rather than guessing

---

## Examples

### Basic Onboarding

```
User: /ctx:onboard

[Step 1] Explore subagent analyzes codebase
[Step 2] Shows findings: "Angular 17 frontend, NestJS backend, PostgreSQL, monorepo-nx"
[Step 3] Extracts vision from README
[Step 4] Detects hexagonal architecture in backend, feature-modules in frontend
[Step 5] Extracts techstack from package.json and configs
[Step 6] Creates .context/ structure
[Step 7] Asks about epics - user says "not now"
[Step 8] Shows summary
```

### With Uncertainties

```
User: /ctx:onboard

[Step 1] Explore finds mixed patterns
[Step 2] Shows findings with uncertainties:
  - "Backend architecture unclear - some modules use hexagonal, others are flat"
  - "Found both Jest and Vitest - which is primary?"

User clarifies: "Jest is legacy, we're migrating to Vitest"

[Step 3-8] Continues with confirmed information, notes migration in patterns-architecture.md
```

---

## Tips

- Use Explore subagent for all analysis - don't manually read files
- Present findings for user confirmation before creating files
- Note inconsistencies honestly - they're valuable documentation
- This skill extracts what exists, not what should exist
- If project is messy, document it as-is - don't idealize
