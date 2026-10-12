# Task Template

This template is used for creating task files in `.context/tasks/`. There are two
shapes, chosen by the size line (see `../conventions/ownership.md` → Size):

- **Size L** — a task cut from an epic. The problem, questions, and rules live in the
  epic; the task points to them.
- **Size M** — a standalone task with no epic. It carries a compact problem, questions,
  and rules of its own.

Size S needs no file. Labels follow `../conventions/ownership.md`.

---

## Size L task (from an epic)

```markdown
# Task: [Clear, Actionable Title]

Size: L · from epic-[name]

## Status: pending

## T1 · Slice
[What this slice delivers, in one sentence] [Owner]
- **Rules:** R1, R3 (epic-[name] E6)
- **Why this slice is separate:** [what it can ship or be tested without]

## T2 · Acceptance Criteria
- [ ] AC-1 · WHEN [trigger] THE SYSTEM SHALL [observable result] · R1 · expected from R1.1
- [ ] AC-2 · IF [failure] THEN THE SYSTEM SHALL [result the user sees, and what they do next] · R3 · [Q-2]
- [ ] AC-3 · ... · R3 · expected: ? → Q-n

## T3 · Test Design
| Case | AC | Level | Technique | Auto / manual | Expected source |
|---|---|---|---|---|---|
| [case] | AC-1 | unit / integration / e2e | example / EP+BVA / state / decision table | auto | R1.1 |

**NFR in play:** [only the ones this slice risks, or "none"]

## Technical Notes
Implementation hints, patterns to follow. Reference `.context/patterns-architecture.md`.

<!-- **Specialized Skill:** [skill-name] — [what it covers for this task] -->
<!-- **Key sections to read:** [§Section1, §Section2] -->

## Files to Touch
- path/to/file

## Dependencies
- [Task ID] - [why]

## Complexity: S | M | L | XL

## Verification: none | test | full

## T4 · Progress Log

## T5 · Test Results
<!-- Filled by the Owner (or with the Owner's verdict on each line). `done` is blocked until this has a result. -->
| Layer | Result | By |
|---|---|---|
| Automated tests | | |
| Code review / diff read | | |
| Manual against the examples | | |
| Exploratory | | |

**Exploratory debrief:** [charter, time spent, what was found]

**Bugs:**
| Bug | What was wrong | Why it slipped through | Fixed in |
|---|---|---|---|

**Handoff note:** [what the next reader or reviewer needs to know]

## T6 · Release
<!-- Only on the task that releases the feature. Delete the section otherwise. -->
- **Rollback:** [how, and how long it takes]
- **Watch:** [metric · threshold · for how long]
- **Notify:** [who]

| Environment | Date | Result |
|---|---|---|
| | | |
```

---

## Size M task (standalone)

```markdown
# Task: [Clear, Actionable Title]

Size: M · [one-line reason]

## Status: pending

## Problem
[Who cannot do what, today, and the evidence] [Owner]
**Done when:** [one sentence, with a number if it is an improvement] [Owner]

## Questions
| # | Question | Who answers | Answer | Blocking |
|---|---|---|---|---|
| Q-1 | | | | yes / no |

## Approach
**Chosen:** [option] [Owner]
**Why (Owner's words):** [one sentence] [Owner]
- **Other option considered:** [option, and why not]
- **Blast radius:** in code [call sites]; outside code [clients, reports, integrations]
- **Rabbit holes and appetite:** [where it could swallow time; how much time it is worth] [Owner]
- **Mockup:** [link with empty, loading, error, offline, no-permission states, or "no UI"]

## Rules and examples
- **R1** · [rule] [Owner]
  - R1.1 · given [data] when [action] → [expected, incl. what the user sees next] · [Owner] / [Q-n]

## T2 · Acceptance Criteria
- [ ] AC-1 · WHEN … THE SYSTEM SHALL … · R1 · expected from R1.1

## T3 · Test Design
| Case | AC | Level | Technique | Auto / manual | Expected source |
|---|---|---|---|---|---|

## Technical Notes

## Files to Touch

## Dependencies

## Complexity: S | M | L | XL

## Verification: none | test | full

## T4 · Progress Log

## T5 · Test Results
| Layer | Result | By |
|---|---|---|

## T6 · Release
- **Rollback:** …
- **Smoke test in production:** …
```

---

## Usage Notes

**File naming:** `.context/tasks/NNN-verb-subject.md` (3-digit, never reused; see
`../conventions/task-naming.md`).

**Part codes.** Headings may carry a part code before the name (`## T2 · Acceptance
Criteria`). Readers match on the name after the code, so older task files without codes
stay valid.

**Status values:** `pending` · `in-progress` · `blocked` · `done`. The `## Status:` line
holds one bare token.

**`done` gate:** every AC checked, no `[Claude-proposed]` left in T1 or T2, and T5 holds a
result recorded by the Owner. Older task files without a T5 section are gated on the ACs
alone, as before.

**Complexity:** S < 50 lines · M 50–200 · L 200–500 · XL 500+ (see
`../conventions/complexity-guidelines.md`). Complexity is effort; Size is risk. They are
independent.

**Verification:**
- `none` — text, config, or style only
- `test` — logic in 1–2 files
- `full` — API, shared types, infrastructure
