# Task Template

This template is used for creating individual task files in `.context/tasks/`.

---

# Task: [Clear, Actionable Title]

## Status: pending

## Goal
One sentence describing the outcome.

## Context
Why this matters, background info, relation to other work.

## Acceptance Criteria
- [ ] Criterion 1 (specific, verifiable)
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Notes
Implementation hints, patterns to follow, edge cases.
Reference `.context/patterns-architecture.md` if relevant.

<!-- Optional: Added by /ctx:breakdown when a specialized skill matches this task -->
<!-- **Specialized Skill:** [skill-name] — read `[path/to/SKILL.md]` for guidelines. -->
<!-- **Key sections to read:** [§Section1, §Section2] -->

## Files to Touch
- path/to/file1
- path/to/file2

## Dependencies
- [Task ID] - Brief description (if any)

## Complexity: S | M | L | XL

## Progress Log

---

## Usage Notes

**File Naming Convention:**
```
.context/tasks/
├── 001-short-name.md
├── 002-another-task.md
└── ...
```

- Use 3-digit sequential numbering
- Use lowercase with hyphens
- Keep names short but descriptive (3-5 words)

**Complexity Estimates:**
- S: Single file change, < 50 lines
- M: Multiple files, clear path, 50-200 lines
- L: Multiple components, some unknowns, 200-500 lines
- XL: Significant feature, research needed, 500+ lines

**Status Values:**
- `pending` - Ready to start
- `in-progress` - Currently being worked on
- `blocked` - Waiting on dependencies
- `done` - Completed
