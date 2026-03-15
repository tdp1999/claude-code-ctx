---
name: vision
description: Define or update project vision and scope. Use when starting new projects, pivoting strategy, or documenting existing projects. Supports extract mode for existing codebases.
allowed-tools: Read, Write, Edit, AskUserQuestion, Skill, Task, Glob
---

# Vision

Capture or update the project's vision, scope, and goals.

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

This skill uses:
- **Explore** (built-in) - For extract mode (scanning README, docs, package.json)

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.
See `../../shared/conventions/file-contracts.md` for required output sections.

Skill-specific errors:
- **`.context/` doesn't exist (create mode)**: Proceed — vision.md can be created before init. Suggest running `/ctx:context-init` after.
- **vision.md exists but missing required sections (update mode)**: Show which sections are missing, offer to add them during the update.

## Input

`$ARGUMENTS` can be:
- A project idea: `/ctx:vision "E-commerce platform for artisans"`
- `--extract`: Extract vision from existing project
- Empty: Ask user for their project idea
- Path to existing vision.md: `/ctx:vision .context/vision.md` (triggers update mode)

## Step 1: Detect Mode

Check if `.context/vision.md` exists:
- **If `--extract` flag:** Enter **Extract Mode** (for existing projects)
- **If exists:** Enter **Update Mode**
- **If not exists:** Enter **Create Mode**

---

## Create Mode

Use when no vision.md exists (new project).

### Questions

Ask these questions conversationally, not as a rigid form:

| ID | Question | Notes |
|----|----------|-------|
| V-1 | What are you building? | One clear sentence |
| V-2 | Who is it for? | Target users, not technical audience |
| V-3 | What scale? | personal-use, small-team, startup, enterprise, public-facing |
| V-4 | Timeline? | prototype (weekend), MVP (2 weeks), MVP (1 month), full product (3+ months), no deadline |
| V-5 | What's the MVP scope? What's the full vision? | Separate minimum viable from complete vision |

### Output

Create `.context/vision.md`:

```markdown
# Vision

## Summary
[One sentence from V-1]

## Target Users
[Who is it for - from V-2]

## Scale
[personal / small-team / startup / enterprise / public-facing]

## Timeline
[prototype / MVP / full product]

## MVP Scope
- Feature 1
- Feature 2
- Feature 3

## Full Vision
- All MVP features
- Plus: Additional feature 1
- Plus: Additional feature 2
```

After creating, summarize what was captured and move to next step in workflow.

---

## Update Mode

Use when vision.md already exists (mid-project change).

### Process

1. **Read and display current vision:**
   - Show current Summary, Target Users, Scale, Timeline
   - Show current MVP and Full Vision

2. **Ask update questions:**
   - What's changing?
   - **Why** are you making this change? (critical for decision logging)
   - Which areas are affected? (epics, tasks, architecture)

3. **Identify impacts:**
   - Check `.context/plans/` for epic files that may be affected
   - Check `.context/tasks/` for tasks that may need updating
   - Check `.context/patterns-architecture.md` for conflicts

4. **Update vision.md:**
   - Update the changed sections
   - Add a Changelog entry at the bottom:

```markdown
## Changelog

### [YYYY-MM-DD] Change Title
- Changed: [what changed]
- From: [old value]
- To: [new value]
- Reason: [why - from user's answer]
- Impact: [affected epics/tasks/patterns]
- Decision: See decisions.md [YYYY-MM-DD]
```

5. **Trigger `/ctx:log-decision`:**
   - Automatically call the log-decision skill
   - Pass the change details and user's rationale
   - This creates an ADR entry in decisions.md

6. **Suggest follow-up actions:**
   - List affected epics that may need updating
   - List affected tasks that may need review
   - Suggest running `/ctx:architecture` if vision changes affect architecture

---

## Extract Mode

Use when onboarding an existing project (`--extract` flag or called from `/ctx:onboard`).

### Process

1. **Use Explore subagent to gather information:**

**Prompt for Explore:**
```
Analyze this project and extract vision information:

1. Read README.md (if exists):
   - Project summary/intro
   - Purpose statement
   - Target audience mentioned

2. Read package.json:
   - name, description, keywords
   - Repository URL, homepage

3. Read any docs/ folder:
   - Overview documents
   - Getting started guides

4. Infer from codebase:
   - Scale indicators (complexity, features, architecture)
   - User-facing features suggest target users

Return structured findings.
```

2. **Present findings to user:**

```markdown
Based on your existing project, here's what I found:

**Summary:** [extracted from README or inferred]
**Target Users:** [from description/README or inferred]
**Scale:** [inferred from structure - personal/small-team/startup/enterprise]
**Timeline:** [existing project - "ongoing"]

**MVP Scope (inferred):**
- [Feature 1 - based on existing code]
- [Feature 2 - based on existing code]

**Full Vision (unknown):**
- [Suggest user fill this in]

Is this correct? What would you adjust?
```

3. **Create vision.md with confirmed data:**
   - Use user's corrections/additions
   - Mark inferred items clearly
   - Add note: "Extracted from existing project on [date]"

---

## Examples

### Create Mode Example

```
User: /ctx:vision "Task management app for remote teams"

Assistant asks: Who is it for? What scale? Timeline? MVP features?

Creates .context/vision.md with all answers.
```

### Update Mode Example

```
User: /ctx:vision

Assistant detects existing vision.md, shows current state.

Assistant asks: What's changing? Why?

User: "Pivoting from B2C to B2B enterprise customers because we got feedback that businesses would pay more"
Assistant updates vision.md with changelog, triggers /ctx:log-decision, identifies affected epics.
```

### Extract Mode Example

```
User: /ctx:vision --extract

[Explore] Scans README.md, package.json, docs/
[Findings] Project is "Task Manager Pro - collaboration tool for remote teams"
[Presents] Extracted vision with inferred scale and timeline

User confirms and adjusts full vision section.

Creates .context/vision.md with extracted + confirmed data.
```

## Tips

- In create mode, keep questions conversational - don't overwhelm with all at once
- In update mode, always ask "why" - this is critical for decision logging
- Impact analysis helps user understand downstream effects
- The changelog provides traceability over time
