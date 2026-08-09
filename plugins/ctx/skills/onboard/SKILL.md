---
name: onboard
description: Analyze an existing codebase and fill its context bank — vision, architecture, techstack — from what the code already says. Triggers on "onboard", "analyze this project", "document existing codebase", "join project", "extract architecture", "ctx setup". Use on any repo that already has code. For an empty repo, use /ctx:start instead.
argument-hint: '[optional: path to project]'
allowed-tools: Task, Read, Write, Edit, Glob, Bash, AskUserQuestion, Skill
---

# Onboard Project

Analyze an existing codebase and fill its context bank from what the code already
says. Where `/ctx:start` interviews you from scratch, this **discovers and documents**
what is already there, then asks you to confirm.

The setup steps live in `../../shared/procedures/`. They are procedures, not slash
commands — the user never invokes them directly. Read each one when you reach its step
and follow it, in **extract mode**.

| Step | Procedure file | Writes |
|---|---|---|
| 1 | `../../shared/procedures/context-bank.md` | `.context/` structure, `progress.md`, `decisions.md` |
| 4 | `../../shared/procedures/vision.md` | `.context/vision.md` |
| 5 | `../../shared/procedures/architecture.md` | `.context/patterns-architecture.md` |
| 6 | `../../shared/procedures/techstack.md` | `.project-init.md` |

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

This skill leans on **Explore** (built-in, read-only) harder than any other. Every
question about the codebase goes to an Explore, not to a Glob/Grep/Read chain in the
main thread — reading a repo you have never seen is exactly the sweep Explore exists
for, and the answers are what the whole skill is built on.

Send the Step 2 questions as **separate Explores in one batch** so they run together:
identity, folder structure, technology detection, and architecture indicators are
independent of each other.

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

### Step 1: Context Bank (always, first, unconditional)

Read `../../shared/procedures/context-bank.md` and follow it.

This runs **before** anything writes into `.context/`. The procedure is idempotent — on
a repo that already has a partial context bank it creates only what is missing. Do not
guard it on "if `.context/` doesn't exist": by the time the vision step has written
`.context/vision.md`, that guard is false and `progress.md`, `decisions.md`, `tasks/`,
`tasks-done/`, and `plans-done/` never get created.

**Output:** `.context/` structure

---

### Step 2: Initial Analysis

Delegate to Explore. Send these as separate parallel Explores rather than one
mega-prompt — they are independent, and four focused reports beat one sprawling one.

**What to ask for:**

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

### Step 3: Present Findings

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

### Step 4: Extract Vision

Read `../../shared/procedures/vision.md` and follow its **extract mode**:

- Feed it the analysis findings from Step 2
- It writes `.context/vision.md` from what was discovered
- The user confirms or adjusts before you move on

---

### Step 5: Extract Architecture

Read `../../shared/procedures/architecture.md` and follow its **extract mode**:

- Feed it the detected patterns and folder structure
- It writes `.context/patterns-architecture.md`
- The user confirms or adjusts before you move on

---

### Step 6: Extract Techstack

Read `../../shared/procedures/techstack.md` and follow its **extract mode**:

- Feed it the detected dependencies and config files
- It writes `.project-init.md`
- The user confirms or adjusts before you move on

---

### Step 7: Suggest Domain Documentation

If the codebase shows business logic patterns (validation logic, state machines, business rule constants, entity relationships):

```
The codebase appears to contain business logic (validation rules, state machines, domain entities).
Would you like to document the domain model with /ctx:domain?

This captures business flows, rules, and invariants in plain text — helping AI agents
understand what the system should do, not just how it's built.

Options:
1. Yes - document domain model now
2. Later - I'll run /ctx:domain when ready
3. Skip - this project doesn't need domain documentation
```

If yes: invoke the `domain` skill. It interviews the user and writes `domain.md`.

### Step 8: Ask About Epics

Ask user:

```
The project is now documented. Do you have any features you'd like to plan?

Options:
1. Yes - create an epic for a new feature
2. No - I'm done for now
```

If yes: invoke the `epic` skill with the feature.
If no: proceed to the summary.

---

### Step 9: Summary

```markdown
## Project Onboarded!

### Files Created

- `.context/vision.md` - Project vision (extracted)
- `.context/patterns-architecture.md` - Architecture patterns (detected)
- `.context/domain.md` - Business logic and domain model (if created)
- `.project-init.md` - Technology stack (detected)
- `.context/` folder structure

### What Was Discovered

- **Vision:** [one sentence]
- **Architecture:** [backend + frontend style]
- **Stack:** [main technologies]

### Next Steps

1. Review the generated files for accuracy
2. Add code patterns to `.context/patterns-architecture.md` as you discover them
3. Use `/ctx:epic` to plan a new feature or a defect that needs digging
4. Use `/ctx:breakdown` to turn an epic into tasks
5. Use `/ctx:create-task` for a single small fix

### Quick Reference

- `/ctx:epic` - Plan a feature, or a defect whose cause is not yet known
- `/ctx:breakdown` - Turn an epic into tasks
- `/ctx:create-task` - One small task, no epic needed
- `/ctx:progress` - See what is pending
- `/ctx:task NNN` - Work on a task
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

[Step 1] Follows context-bank.md → creates .context/ structure
[Step 2] Four parallel Explores analyze the codebase
[Step 3] Shows findings: "Angular 17 frontend, NestJS backend, PostgreSQL, monorepo-nx"
[Step 4] Follows vision.md extract mode → .context/vision.md from the README
[Step 5] Follows architecture.md extract mode → hexagonal backend, feature-modules frontend
[Step 6] Follows techstack.md extract mode → .project-init.md from package.json + configs
[Step 7] Asks about domain.md — user says "later"
[Step 8] Asks about epics — user says "not now"
[Step 9] Shows summary
```

### With Uncertainties

```
User: /ctx:onboard

[Step 2] Explore finds mixed patterns
[Step 3] Shows findings with the uncertainties called out:
  - "Backend architecture unclear — some modules are hexagonal, others flat"
  - "Found both Jest and Vitest — which is primary?"

User clarifies: "Jest is legacy, we're migrating to Vitest"

[Step 4-9] Continues with the confirmed information, and notes the migration in
           patterns-architecture.md
```

---

## Gotchas

- **Context bank comes FIRST**: Step 1 is unconditional. Guarding it on "if `.context/`
  doesn't exist" and running it late is the bug this ordering prevents — the vision step
  creates `.context/vision.md`, the guard then sees a `.context/` folder and skips, and
  `progress.md`, `decisions.md`, `tasks/`, and the archive folders never get created.
- **The procedures are not slash commands**: `vision`, `architecture`, `techstack`, and
  `context-bank` are markdown procedures under `shared/procedures/`. Read them, do not
  try to invoke them. The consumer-facing surface for setup is `/ctx:start` and
  `/ctx:onboard`, nothing else.
- **Explore does the reading, not you**: onboarding an unfamiliar repo in the main
  thread burns the context the interview needs. Delegate every codebase question.
- **Extract mode still needs confirmation**: what the code implies is a hypothesis. Show
  it, name the uncertain parts, and let the user correct it before writing the file.
- **An empty repo means start, not onboard**: if there is no code to read, `/ctx:start`
  is the right entry point.

---

## Tips

- Use Explore subagent for all analysis - don't manually read files
- Present findings for user confirmation before creating files
- Note inconsistencies honestly - they're valuable documentation
- This skill extracts what exists, not what should exist
- If project is messy, document it as-is - don't idealize

## Gotchas

- **Always use Explore subagent, not manual Glob/Read**: Manual file reading wastes tokens and misses patterns. Explore is designed for codebase analysis.
- **Existing .context/ must be handled carefully**: If .context/ already exists with content, ask user before overwriting. Never silently replace existing vision or architecture docs.
- **Document what IS, not what SHOULD BE**: Extract mode captures current state. Recommendations for improvements go in a separate section, not mixed with findings.
- **Missing README is not a blocker**: Many projects lack README. Fall back to package.json, source code analysis, and user questions.

