---
name: create-task
description: Create a standalone task from brief user input, independent of any Epic
argument-hint: "[brief task description or issue]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion, Task
---

# Create Standalone Task

Generate a standalone task file from brief user input. Unlike `/ctx:breakdown` which decomposes epics or investigations, this skill creates **individual tasks directly** without requiring an epic or investigation.

**Scope:** This skill strictly focuses on **scoping and planning**. Task creation only—implementation happens when user explicitly requests "Work on this task" or uses `/ctx:task [NNN]`.

## Subagent Usage

See `../../_shared/subagents.md` for available subagents.

This skill uses:
- **Explore** - For analyzing codebase context when creating tasks that touch existing code
- **general-purpose** - For researching technical approaches or best practices when needed

**When to use Explore:**
- When task involves modifying existing code
- When need to understand current implementation patterns
- When identifying affected files for the task

---

## Input

`$ARGUMENTS` can be:
- Brief task description: `/ctx:create-task "Fix slow dev server startup"`
- Issue description: `/ctx:create-task "Investigate performance bottleneck in API"`
- Feature request: `/ctx:create-task "Add rate limiting to auth endpoint"`
- Bug report: `/ctx:create-task "Login form validation not working"`
- Empty: Ask user what task they want to create

---

## When to Use This Skill

**Use this skill when:**
- User wants to create a single task quickly without an epic
- Task is not part of a larger feature/epic
- Task is a bug fix, investigation, or small enhancement
- User provides brief description that needs expansion

**Do NOT use this skill when:**
- User wants to break down an epic (use `/ctx:breakdown` instead)
- User wants to break down an investigation (use `/ctx:breakdown` instead)
- Multiple related tasks need to be created (use `/ctx:epic` then `/ctx:breakdown` instead)

---

## Workflow

### Step 1: Understand the Request

If no description provided, ask:

```
What task would you like to create?

Examples:
- "Fix slow dev server performance"
- "Add input validation to contact form"
- "Investigate database query performance"
- "Update dependencies to latest versions"
```

**If description is too brief or ambiguous:**
Use AskUserQuestion to clarify:
- What is the expected outcome?
- What files or components are affected?
- Are there specific constraints or requirements?
- What is the priority/urgency?

**Example clarification questions:**

```markdown
I need more details to create an effective task:

1. **Scope**: Is this a bug fix, feature, investigation, or refactor?
2. **Affected Area**: Which part of the codebase (landing page, API, shared libs)?
3. **Success Criteria**: How will we know this is complete?
4. **Priority**: Is this blocking other work?
```

---

### Step 2: Analyze Project Context

**Read relevant context files:**

1. **Check task numbering:**
   - Read existing tasks in `.context/tasks/` to determine next task number
   - Also check `.context/tasks-done/` for highest completed number

2. **Read project patterns:**
   - `.context/patterns-architecture.md` for coding standards
   - `.context/patterns-design-system.md` if UI-related
   - `.context/testing-guide.md` for test requirements

3. **Check progress:**
   - `.context/progress.md` to understand current project state

4. **Analyze codebase (if needed):**
   Use Explore subagent to:
   - Find affected files
   - Understand current implementation
   - Identify patterns to follow

**Example Explore prompt:**

```
Find the landing page development server configuration in this Nx monorepo.

Look for:
1. apps/landing/project.json - build/serve configuration
2. Any vite.config.ts or webpack config
3. nx.json - cache and task runner settings
4. tsconfig files that might affect build time

Report: file paths and relevant configuration snippets
```

---

### Step 3: Draft Task Content

Create a comprehensive task following the standard template:

```markdown
# Task: [Clear, Actionable Title]

## Status: pending

## Goal
One sentence describing the desired outcome.

## Context
Why this task matters, background information, how it relates to the project.
Include any logs, error messages, or evidence if applicable.

## Acceptance Criteria
- [ ] Specific, measurable criterion 1
- [ ] Specific, measurable criterion 2
- [ ] Specific, measurable criterion 3
- [ ] Tests pass (if applicable)
- [ ] Documentation updated (if applicable)

## Technical Notes
Implementation hints, patterns to follow, edge cases to consider.
Reference patterns from `.context/patterns-architecture.md` or other context files.

Include relevant context like:
- Affected configuration files
- Current behavior vs expected behavior
- Potential approaches (high-level)
- Patterns to follow from project standards

## Files to Touch
- path/to/file1.ts
- path/to/file2.ts
- path/to/config.json

## Dependencies
None (or list specific task IDs if they exist)

## Complexity: S | M | L | XL

**Reasoning:** [Why this complexity estimate]

## Progress Log
```

**Complexity Guidelines:**
- **S (Small):** Single file, < 50 lines, clear path, < 1 hour
- **M (Medium):** 2-3 files, 50-200 lines, straightforward, 1-3 hours
- **L (Large):** Multiple files/components, 200-500 lines, some unknowns, 3-8 hours
- **XL (Extra Large):** Significant scope, research needed, 500+ lines, > 8 hours

---

### Step 4: Present Draft to User

Show the task content to the user for review:

```markdown
## Task Draft Ready

**Title:** [task title]
**Complexity:** [S/M/L/XL]
**Files Affected:** [count] files

### Summary
[Brief summary of what the task will accomplish]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

---

[Show full task content in expandable section or truncated preview]

**Would you like to:**
1. ✅ Create this task as-is
2. ✏️ Modify something (I can adjust based on your feedback)
3. ➕ Add more details or context
4. ❌ Cancel
```

---

### Step 5: Create Task File (If Approved)

**If user approves:**

1. **Determine task number:**
   - Find highest number in `.context/tasks/` and `.context/tasks-done/`
   - Increment by 1

2. **Create filename:**
   ```
   .context/tasks/[NNN]-[kebab-case-name].md
   ```
   - Use 3-digit zero-padded number (001, 002, ..., 065)
   - Use lowercase with hyphens
   - Keep name short but descriptive (3-5 words)

3. **Write task file:**
   Use Write tool to create the task file with full content

4. **Update progress.md:**
   Add task to "Pending" section:
   ```markdown
   ## Pending
   - [ ] [NNN]-[name] - [Brief description] (standalone)
   ```

   Note: Use "(standalone)" to distinguish from epic-based tasks

---

### Step 6: Confirm Creation

Provide confirmation summary:

```markdown
## ✅ Task Created Successfully

**Task Number:** [NNN]
**File:** `.context/tasks/[NNN]-[name].md`
**Complexity:** [S/M/L/XL]
**Status:** pending

### 📋 Task Summary
[One-sentence summary of what needs to be accomplished]

### 🎯 Next Steps

**To start working on this task:**
- Say: "Work on this task" or "Start task [NNN]"
- Or use: `/ctx:task [NNN]`

**Other options:**
- View all pending tasks: `/ctx:progress`
- Create more tasks: `/ctx:create-task [description]`

**Note:** This is a standalone task (not part of an epic). If you need related tasks, consider creating an epic with `/ctx:epic` first.
```

---

## Quality Standards

**Task titles should be:**
- Actionable (start with verb: "Fix", "Add", "Investigate", "Update")
- Specific (not "Backend stuff" but "Fix slow database queries in user endpoint")
- Concise (< 60 characters)

**Acceptance criteria should be:**
- Specific and measurable (not "authentication works" but "user can log in with email/password and receive JWT")
- Testable (someone can verify it's done)
- Complete (covers all aspects of the task)

**Technical notes should:**
- Reference project patterns and standards
- Include relevant context (logs, error messages, config snippets)
- Note affected files and components
- Mention potential approaches at high level

---

## Examples

### Example 1: Performance Issue

```
User: /ctx:create-task "Dev server takes 2 minutes to start"

[Explore] Analyzes landing app configuration, nx.json, vite config
[Clarification] Asks about frequency, logs, environment
[Creates] Task 066-optimize-landing-serve-performance.md
[Updates] progress.md with new task

Summary:
- Complexity: M
- Files: project.json, nx.json, vite.config.ts
- Goal: Reduce dev server startup to < 10 seconds
- Status: Created (pending)
```

### Example 2: Bug Fix

```
User: /ctx:create-task "Contact form submit button disabled"

[Clarification] Asks which form, expected behavior
[Explore] Finds contact form component
[Creates] Task 067-fix-contact-form-submit.md

Summary:
- Complexity: S
- Files: contact-form.component.ts, contact-form.component.spec.ts
- Goal: Submit button enabled when form is valid
- Status: Created (pending)
```

### Example 3: Investigation

```
User: /ctx:create-task "Find out why API responses are slow"

[Clarification] Asks about which endpoints, how slow
[Explore] Analyzes API controllers, database queries
[Creates] Task 068-investigate-api-performance.md

Summary:
- Complexity: M
- Goal: Identify performance bottlenecks and document findings
- Note: May lead to follow-up tasks based on findings
- Status: Created (pending)
```

---

## Tips

- **Be thorough in clarification** - Better to ask too many questions than create incomplete tasks
- **Use Explore for context** - Don't guess about file paths or current implementation
- **Reference project standards** - Always check patterns-architecture.md and other context files
- **Right-size tasks** - If task feels too big, suggest breaking it down or creating an epic
- **Clear acceptance criteria** - Make it obvious when task is complete
- **Update progress.md** - Always add new task to progress tracker
- **Standalone ≠ Isolated** - Task is standalone in planning, but should align with project architecture

---

## Integration with Other Skills

| Skill | Relationship |
|-------|--------------|
| `/ctx:epic` | Use epic for multiple related tasks, create-task for single tasks |
| `/ctx:breakdown` | Use breakdown for decomposing epics, create-task for direct task creation |
| `/ctx:investigate` | Investigation creates analysis, then use breakdown or create-task for remediation |
| `/ctx:task` | After creating task with this skill, use `/ctx:task [NNN]` to work on it |
| `/ctx:progress` | Created task tracked in progress.md, view pending tasks |

---

## Self-Verification Checklist

Before finalizing task creation:
- [ ] Task number is sequential and unique
- [ ] Title is clear and actionable
- [ ] Goal is one sentence and specific
- [ ] Context explains why this matters
- [ ] Acceptance criteria are specific and measurable
- [ ] Technical notes reference project patterns
- [ ] Files to touch are accurate (verified with Explore if needed)
- [ ] Complexity estimate is justified
- [ ] progress.md is updated
- [ ] User has approved the task content

---

## Notes

- **Standalone tasks are valid** - Not everything needs to be part of an epic
- **Quick task creation** - This skill optimizes for speed while maintaining quality
- **User confirmation required** - Always get approval before creating the file
- **Context-aware** - Tasks should align with project architecture and patterns
- **Flexible scope** - Can create tasks for bugs, features, investigations, refactors, etc.
