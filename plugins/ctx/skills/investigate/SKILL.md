---
name: investigate
description: Investigate bugs, refactors, performance issues, or tech debt. Uses subagents to analyze code, reproduce issues, and document findings. Outputs investigation file that can be broken down into tasks.
argument-hint: '[issue description or file path]'
allowed-tools: Task, Read, Write, Edit, Glob, Grep, AskUserQuestion
---

# Investigate

Analyze bugs, refactors, performance issues, or tech debt. Unlike `/ctx:epic` which plans new features, this skill **investigates existing problems** and documents findings.

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

This skill uses:

- **Explore** (built-in) - For analyzing relevant code, finding root causes, tracing execution paths
- **test-runner** (project-specific) - For reproducing failing tests or verifying issues
- **build-validator** (project-specific) - For checking if issue causes build/type errors

**IMPORTANT:** Use subagents for analysis instead of manual searching. For project-specific agents (test-runner, build-validator), check `.claude/agents/` first — skip if not configured.

---

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.
See `../../shared/conventions/file-contracts.md` for required output sections.

Skill-specific errors:
- **`.context/investigations/` doesn't exist**: Suggest running `/ctx:context-init` first
- **Investigation file already exists with same name**: Ask user — update existing or create with different name?
- **Project-specific agents unavailable**: Skip gracefully (see subagents.md), continue investigation without automated testing/validation

## Input

`$ARGUMENTS` can be:

- Issue description: `/ctx:investigate "Login is slow"`
- Bug report: `/ctx:investigate "Users getting 500 error on checkout"`
- Refactor request: `/ctx:investigate "Refactor auth module to hexagonal"`
- Tech debt: `/ctx:investigate "Remove deprecated API calls"`
- File path: `/ctx:investigate .context/investigations/inv-login-perf.md` (update existing)
- Empty: Ask user what to investigate

---

## Investigation Types

| Type            | Focus                                               | Example                          |
| --------------- | --------------------------------------------------- | -------------------------------- |
| **Bug**         | Root cause, reproduction steps, fix approach        | "500 error on checkout"          |
| **Performance** | Bottleneck identification, metrics, optimization    | "Login is slow"                  |
| **Refactor**    | Current state, target state, migration path         | "Move to hexagonal architecture" |
| **Tech Debt**   | Scope of debt, impact, cleanup approach             | "Remove deprecated APIs"         |
| **Security**    | Vulnerability analysis, affected areas, remediation | "SQL injection in search"        |

---

## Workflow

### Step 1: Understand the Issue

If no description provided, ask:

```
What would you like to investigate?

Examples:
- "Login takes 5+ seconds"
- "Checkout fails with 500 error"
- "Refactor payment module to clean architecture"
- "Update deprecated lodash methods"
```

Read `.context/domain.md` (if exists) — domain rules help distinguish "bug" (code doesn't match domain intent) from "undocumented behavior" (code works differently but no rule covers it).

Clarify:

- What is the expected behavior?
- What is the actual behavior?
- When did this start? (if known)
- Any error messages or logs?

---

### Step 2: Analyze with Subagents

**For bugs/performance:**

Use Explore subagent:

```
Investigate: [issue description]

Find:
1. Relevant code paths (trace the flow)
2. Error handling in the area
3. Recent changes to affected files (if git available)
4. Related tests
5. Configuration that might affect this

Report: file paths, suspicious code, potential causes
```

Use test-runner if there are related tests:

```
Run tests related to [area] and report any failures
```

Use build-validator to check for type issues:

```
Check for TypeScript errors in [affected area]
```

**For refactors/tech debt:**

Use Explore subagent:

```
Analyze: [area to refactor]

Find:
1. Current structure and patterns
2. All files that would be affected
3. Dependencies (what uses this code)
4. Tests covering this area
5. Similar patterns elsewhere for reference

Report: scope of change, risk areas, suggested approach
```

---

### Step 3: Document Findings

Create investigation file in `.context/investigations/`:

**Filename:** `inv-<kebab-case-name>.md`

**Template:**

```markdown
# Investigation: [Title]

## Type

[bug / performance / refactor / tech-debt / security]

## Summary

[One paragraph describing what was investigated]

## Issue Description

**Expected:** [what should happen]
**Actual:** [what actually happens]
**Severity:** [critical / high / medium / low]

## Findings

### Root Cause / Current State

[What was discovered - the why behind the issue]

### Affected Files

| File              | Role           | Impact              |
| ----------------- | -------------- | ------------------- |
| `path/to/file.ts` | [what it does] | [how it's affected] |

### Code Analysis

[Relevant code snippets with explanations]

// Example problematic code

### Execution Flow

[How the code executes, where it fails/slows]

1. User calls X
2. X calls Y
3. Y does Z ← problem here
4. ...

## Reproduction Steps

1. [Step to reproduce]
2. [Step to reproduce]
3. [Expected vs actual]

## Proposed Approach

### Option A: [Name]

- **Description:** [what to do]
- **Pros:** [benefits]
- **Cons:** [drawbacks]
- **Effort:** [S/M/L]

### Option B: [Name] (if applicable)

- **Description:** [alternative]
- **Pros:** [benefits]
- **Cons:** [drawbacks]
- **Effort:** [S/M/L]

### Recommended: [Option X]

**Reason:** [why this option]

## Risks & Warnings

⚠️ **[Risk]**

- [Description]
- [Mitigation]

## Dependencies

- [What needs to happen first]
- [External dependencies]

## Test Strategy

- [ ] [How to verify the fix]
- [ ] [Regression tests needed]

## Estimated Complexity

[S / M / L / XL]

**Reasoning:** [Why this estimate]

## Status

investigating | ready | in-progress | done

## Created

[YYYY-MM-DD]
```

---

### Step 4: Present to User

Show summary:

```markdown
## Investigation Complete

**Issue:** [title]
**Root Cause:** [one sentence]
**Affected Files:** [count] files
**Recommended Approach:** [option name]
**Estimated Complexity:** [S/M/L/XL]

Investigation saved to: `.context/investigations/inv-[name].md`

Would you like to:

1. Break this down into tasks (`/ctx:breakdown inv-[name]`)
2. Investigate further
3. Done for now
```

---

## Update Mode

When path to existing investigation is provided:

1. Read existing investigation
2. Ask what's changed or what to add
3. Update relevant sections
4. Add changelog entry:

```markdown
## Changelog

### [YYYY-MM-DD] [Update Description]

- Added: [new findings]
- Changed: [updated info]
- Reason: [why updated]
```

---

## Examples

### Bug Investigation

```
User: /ctx:investigate "Checkout fails with 500 error"

[Explore] Traces checkout flow, finds error in payment service
[test-runner] Runs payment tests - 2 failing
[Findings] Missing null check when payment provider returns error

Creates: .context/investigations/inv-checkout-500-error.md
Recommends: Add null check and proper error handling
Complexity: S
```

### Performance Investigation

```
User: /ctx:investigate "Dashboard loads slowly"

[Explore] Analyzes dashboard component and data fetching
[Findings] N+1 query problem - fetching user for each item
[Findings] No pagination on large dataset

Creates: .context/investigations/inv-dashboard-performance.md
Recommends: Add eager loading and pagination
Complexity: M
```

### Refactor Investigation

```
User: /ctx:investigate "Refactor auth module to hexagonal"

[Explore] Maps current auth structure
[Findings] Auth logic mixed with HTTP layer
[Findings] Database calls directly in controllers
[Affected] 12 files need changes

Creates: .context/investigations/inv-auth-hexagonal-refactor.md
Recommends: Phased migration - ports first, then adapters
Complexity: L
```

---

## Tips

- Use subagents for analysis - don't manually search
- Be specific about root causes, not just symptoms
- Document multiple options when they exist
- Include reproduction steps for bugs
- Investigations can be broken down with `/ctx:breakdown`
- Link to related epics or tasks if they exist
- Update investigations as you learn more
