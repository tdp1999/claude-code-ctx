# Investigation Template

This template is used for creating investigation files in `.context/investigations/`. Investigations analyze bugs, refactors, performance issues, or tech debt.

---

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

```typescript
// Example problematic code
```

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

---

## Usage Notes

**File Naming Convention:**
- `inv-<kebab-case-name>.md`
- Example: `inv-checkout-500-error.md`

**Investigation Types:**

| Type            | Focus                                               |
| --------------- | --------------------------------------------------- |
| **Bug**         | Root cause, reproduction steps, fix approach        |
| **Performance** | Bottleneck identification, metrics, optimization    |
| **Refactor**    | Current state, target state, migration path         |
| **Tech Debt**   | Scope of debt, impact, cleanup approach             |
| **Security**    | Vulnerability analysis, affected areas, remediation |

**Status Lifecycle:**
- `investigating` - Analysis in progress
- `ready` - Ready to be broken down into tasks
- `broken-down` - Has been decomposed into tasks
- `done` - All tasks finished

**When updating:**
Add a changelog entry:

```markdown
## Changelog

### [YYYY-MM-DD] [Update Description]

- Added: [new findings]
- Changed: [updated info]
- Reason: [why updated]
```
