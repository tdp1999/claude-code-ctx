# Epic Template

This template is used for creating epic files in `.context/plans/`. Epics are high-level feature plans that can be broken down into tasks.

---

# Epic: [Feature Name]

## Summary
[One paragraph describing the feature]

## Why
[Problem this solves, value it provides]

## Target Users
[Who will use this feature]

## Scope

### In Scope
- [Specific feature/capability 1]
- [Specific feature/capability 2]
- [Specific feature/capability 3]

### Out of Scope
- [What's NOT included - save for future]
- [Excluded to keep MVP focused]

## High-Level Requirements

1. [Requirement 1 - specific, testable]
2. [Requirement 2]
3. [Requirement 3]
4. [etc.]

## Technical Considerations

### Architecture
- [How this fits into existing architecture from patterns-architecture.md]
- [Modules/domains involved]
- [Integration points]

### Dependencies
- [Other features this depends on]
- [External services needed]
- [Infrastructure requirements]

### Data Model
- [Key entities/tables needed]
- [Relationships]

## Risks & Warnings

⚠️ **[Risk Category]**
- [Specific risk or error-prone area]
- [Mitigation or recommendation]

⚠️ **[Another Risk]**
- [Description]
- [How to avoid]

## Alternatives Considered

### [Alternative Approach 1]
- **Pros:** [benefits]
- **Cons:** [drawbacks]
- **Why not chosen:** [reasoning]

## Success Criteria

- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
- [ ] [Measurable outcome 3]

## Specialized Skills
<!-- Added by /ctx:breakdown when matching skills are found -->
<!-- - **[skill-name]** — [description] → tasks [NNN, NNN] -->

## Estimated Complexity
[S / M / L / XL]

**Reasoning:** [Why this complexity estimate]

## Status
draft | ready | in-progress | done

## Created
[YYYY-MM-DD]

---

## Usage Notes

**File Naming Convention:**
- `epic-<kebab-case-name>.md`
- Example: `epic-user-authentication.md`

**Status Lifecycle:**
- `draft` - Epic being written
- `ready` - Ready to be broken down into tasks
- `broken-down` - Has been decomposed into tasks
- `completed` - All tasks finished

**When updating:**
Add a changelog entry:

```markdown
## Changelog

### [YYYY-MM-DD] [Change Description]
- Updated: [what changed]
- Reason: [why]
```
