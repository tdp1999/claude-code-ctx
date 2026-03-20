---
name: start
description: Master orchestrator for initializing new projects. Runs the full workflow: vision → architecture → techstack → epic → breakdown → context. Use when starting a fresh project.
argument-hint: "[optional: project idea]"
allowed-tools: Skill, AskUserQuestion
---

# Start Project

Master orchestrator that guides you through the complete project initialization workflow.

## Input

`$ARGUMENTS` can be:

- A project idea: `/ctx:start "E-commerce platform"`
- Empty: Will ask for the idea during the flow

## Important Notes

- This skill is for **new projects only**
- Each sub-skill (`/ctx:vision`, `/ctx:architecture`, etc.) can be used independently for updates
- The flow is sequential - each step builds on the previous
- You can stop at any point and resume later using individual skills

---

## Workflow Steps

### Step 1: Vision

Run `/ctx:vision` skill:

- If user provided idea in `$ARGUMENTS`, pass it to vision
- Otherwise, vision will ask

**Output:** `.context/vision.md`

After vision is created, summarize the vision briefly and confirm before proceeding.

---

### Step 2: Architecture

Run `/ctx:architecture` skill:

- Architecture reads vision.md for context
- Asks about backend/frontend patterns, domain approach, API style, etc.

**Output:** `.context/patterns-architecture.md`

After architecture is created, summarize the architectural decisions and confirm before proceeding.

---

### Step 3: Techstack

Run `/ctx:techstack` skill:

- Techstack reads vision.md and patterns-architecture.md for smart defaults
- Asks about monorepo structure, package manager, language, frameworks, etc.

**Output:** `.project-init.md`

After techstack is created, summarize the tool selections and confirm before proceeding.

---

### Step 4: Domain Model (Optional)

Ask user:

```
Does this project have business logic — flows, rules, or domain concepts?
(e.g., checkout flow, payment rules, user permissions)

Options:
1. Yes - let's document the domain model now
2. Later - I'll run /ctx:domain when ready
3. No - this project doesn't need domain documentation (e.g., portfolio, CLI tool)
```

If yes:
- Run `/ctx:domain` skill
- It will interview the user about entities, flows, rules, edge cases
- **Output:** `.context/domain.md`

If later or no:
- Continue to next step

---

### Step 5: First Epic

Ask user:

```
What's the first major feature you'd like to plan?
(e.g., "User authentication", "Dashboard", "Payment processing")

Or type "skip" to finish here and create epics later.
```

If user provides a feature:

- Run `/ctx:epic` skill with the feature idea
- **Output:** `.context/plans/epic-<name>.md`

If user skips:

- Note that they can create epics anytime with `/ctx:epic`
- Skip to Step 6 (init-context)

---

### Step 6: Breakdown (Optional)

After epic is created, ask:

```
Would you like to break this epic down into tasks now?
(yes/no - you can always do this later with /ctx:breakdown)
```

If yes:

- Run `/ctx:breakdown` skill with the epic file
- **Output:** `.context/tasks/*.md`

If no:

- Note that they can break down anytime with `/ctx:breakdown`
- Continue to next step

---

### Step 7: Initialize Context

Check if `.context/` folder exists:

- If not: Run `/ctx:context-init` skill automatically (no prompt)
- If exists: Skip this step

**Output:** `.context/` folder structure (if created)

---

### Step 8: Summary & Next Steps

Provide a complete summary:

```markdown
## Project Initialized! 🎉

### Files Created

- `.context/vision.md` - Project vision and scope
- `.context/patterns-architecture.md` - Architecture patterns and conventions
- `.context/domain.md` - Business logic and domain model [if created]
- `.project-init.md` - Technology stack
- `.context/plans/epic-<name>.md` - [if epic was created]
- `.context/tasks/001-*.md, 002-*.md, ...` - [if breakdown was done]
- `.context/` folder structure - [if created]

### What You Have

- **Vision:** [one sentence summary]
- **Architecture:** [backend + frontend style]
- **Stack:** [main technologies]
- **First Epic:** [epic name if created]
- **Tasks:** [X tasks ready if broken down]

### Next Steps

1. Review the files created
2. Create more epics with `/ctx:epic "<feature idea>"`
3. Break down epics with `/ctx:breakdown <epic-name>`
4. Start working on tasks with `/ctx:task <number>` or `/ctx:next`
5. Begin scaffolding your project structure

### Quick Reference

- `/ctx:domain` - Document business logic
- `/ctx:epic` - Create new feature epic
- `/ctx:breakdown` - Break epic into tasks
- `/ctx:task <num>` - Work on a task
- `/ctx:next` - Start next available task
- `/ctx:vision` - Update project vision
- `/ctx:architecture` - Update architecture patterns
- `/ctx:techstack` - Add new tools
```

---

## Error Handling

**If user stops mid-flow:**

- All individual skills can be run independently
- They can resume where they left off:
    - If vision exists but no architecture: run `/ctx:architecture`
    - If architecture exists but no techstack: run `/ctx:techstack`
    - If techstack exists but no epics: run `/ctx:epic`
    - If epics exist but not broken down: run `/ctx:breakdown`

**If files already exist:**

- Vision, architecture, techstack will enter "update mode" instead of create
- This is fine - they can update and continue
- Orchestrator should detect this and inform user

---

## Example Flow

```
User: /ctx:start "Task management SaaS"

[Step 1: Vision]
Assistant runs /ctx:vision with "Task management SaaS"
Asks: Who is it for? Scale? Timeline? MVP features?
Creates .context/vision.md

[Step 2: Architecture]
Assistant runs /ctx:architecture
Asks: Backend style? Frontend style? Domain approach?
Creates .context/patterns-architecture.md

[Step 3: Techstack]
Assistant runs /ctx:techstack
Asks: Monorepo? Package manager? Framework? Database?
Creates .project-init.md

[Step 4: Domain Model]
Assistant asks: Does this project have business logic?
User: "Yes"
Runs /ctx:domain — asks about entities, flows, rules
Creates .context/domain.md

[Step 5: First Epic]
Assistant asks: What's the first major feature?
User: "User authentication"
Runs /ctx:epic "User authentication"
Creates .context/plans/epic-auth.md

[Step 6: Breakdown]
Assistant asks: Break down now?
User: yes
Runs /ctx:breakdown epic-auth
Creates .context/tasks/001-*.md through 005-*.md

[Step 7: Init Context]
Detects .context/ doesn't exist
Runs /ctx:context-init automatically
Creates .context/ folder structure

[Step 8: Summary]
Shows complete summary with all files and next steps
```

---

## Tips

- This is a guided wizard - walk through each step
- Between steps, summarize what was captured
- Give user chance to confirm before proceeding to next step
- If user seems uncertain, offer to explain the step
- Individual skills can be used later for updates/additions
- This workflow is designed for new projects - for existing projects, use individual skills
