# Create-Task Quality Standards & Examples

## Task Title Standards

- Actionable (start with verb: "Fix", "Add", "Investigate", "Update")
- Specific (not "Backend stuff" but "Fix slow database queries in user endpoint")
- Concise (< 60 characters)

## Acceptance Criteria Standards

- Specific and measurable (not "authentication works" but "user can log in with email/password and receive JWT")
- Testable (someone can verify it's done)
- Complete (covers all aspects of the task)

## Technical Notes Standards

- Reference project patterns and standards
- Include relevant context (logs, error messages, config snippets)
- Note affected files and components
- Mention potential approaches at high level

## Complexity Guidelines

- **S (Small):** Single file, < 50 lines, clear path, < 1 hour
- **M (Medium):** 2-3 files, 50-200 lines, straightforward, 1-3 hours
- **L (Large):** Multiple files/components, 200-500 lines, some unknowns, 3-8 hours
- **XL (Extra Large):** Significant scope, research needed, 500+ lines, > 8 hours

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

## Integration with Other Skills

| Skill | Relationship |
|-------|--------------|
| `/ctx:epic` | Use epic for multiple related tasks, create-task for single tasks |
| `/ctx:breakdown` | Use breakdown for decomposing epics, create-task for direct task creation |
| `/ctx:investigate` | Investigation creates analysis, then use breakdown or create-task for remediation |
| `/ctx:task` | After creating task with this skill, use `/ctx:task [NNN]` to work on it |
| `/ctx:progress` | Created task tracked in progress.md, view pending tasks |
