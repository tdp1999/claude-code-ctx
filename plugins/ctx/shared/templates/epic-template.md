# Epic Template

This template is used for creating epic files in `.context/plans/`. An epic is the
memory of one size-L feature: the problem, the agreed answers, the design, and the
rules every task and test traces back to.

Labels (`[Owner]`, `[Q-n]`, `[Claude-proposed]`) and the size line follow
`../conventions/ownership.md`. Logic sections are marked *(logic)*.

---

# Epic: [Feature Name]

Size: L · [one-line reason, naming the risk sign]

## Status: draft

## E1 · Problem *(logic)*

**Problem:** [One sentence: who cannot do what, today] [Owner]

**Evidence:** [ticket, numbers, a quote, a screenshot path] [Owner]

**Why now:** [what changes if this waits another quarter] [Owner]

**Users and context:** [who, where they are, what they hold in their hands] [Owner]

**How they do it today:** [the workaround, step by step] [Owner]

## E2 · Done and measure *(logic)*

| Measure | Baseline (today) | Target | How it is read |
|---|---|---|---|
| [metric] | [number, date measured] | [number] | [query, dashboard, manual count] |

[One sentence: what a user can do when this is done] [Owner]

## E3 · Scope *(logic)*

### In
| Capability | Covered by |
|---|---|
| [capability] [Owner] | [F-n, S-n, R-n; filled when flows and rules exist] |

### Out
- [excluded, and why] [Owner]

### Situational edge cases
| Edge case | Decision | Note |
|---|---|---|
| [what happens when …] | in / out / open (→ Q-n) | [Owner] |

**Affected indirectly:** [people or systems that never touch the feature but feel it] [Owner]

## E4 · Questions

The oracle. Expected values in E6 and in tasks cite these answers as `[Q-n]`.

| # | Question | Who answers | Answer | Date | Blocking |
|---|---|---|---|---|---|
| Q-1 | [question] | [Owner / name] | | | yes / no |

## E5 · Design

**Chosen option:** [name] [Owner]
**Why (Owner's words):** [one sentence] [Owner]

### Options considered
| Option | Pros | Cons | Why not |
|---|---|---|---|
| [A] | | | |

### Blast radius
- **In code:** [modules, call sites, shared types, migrations]
- **Outside code:** [other teams, reports, integrations, support scripts]

### Migration
[none / steps, reversible or not]

### Rabbit holes and appetite
- **Appetite:** [how much time this is worth] [Owner]
- **Rabbit holes:** [where it could swallow time, incl. edge cases the option itself creates, and how they are capped]

### Flows and screens

Written before E6, so every rule can point at a flow or a screen. Every ticket type
fills this part: a new feature writes new flows; an upgrade or refactor writes the
current flows that must not change; a bug fix writes the broken flow, with the
reproduction steps as one branch. A ticket with no UI lists endpoints, events, or
messages instead of screens.

**F1 · [one job the user or system finishes]**
1. [user action or system response]
2. …

- 2a. [what goes wrong at step 2: bad input, server error, session expired, no
  permission, cancel, concurrent edit] → [what the system does; what the user does next]

| Screen | Name | App | Flows | States | Rules |
|---|---|---|---|---|---|
| S1 | [screen, dialog, error page, email, notification] | [app] | F1 | [first use, empty, no results, loading, partial, error, offline, no permission, success] | [R-n, filled in E6] |

**Data dictionary** (new or changed fields only)
| Field | Meaning | Type | Format, example | Required | Limits | Label |
|---|---|---|---|---|---|---|
| | | | | | | |

**Only when it applies:** a permission matrix (role × action, role × screen) for more
than one role, where every denied cell becomes an example in E6; a state diagram for an entity with a lifecycle; a call sequence for more
than one system (retry, duplicates, timeout); analytics events when E2 needs app data;
audited actions when edits must be traceable.

**Mockup:** [link, every screen above with its states, or "no UI"]

## E6 · Rules and examples *(logic)*

Each rule has an ID. Each example has concrete values and an expected result that says
what the user sees and what they do next. Tasks reference these IDs; they never add
rules of their own.

### R1 · [rule in one sentence] [Owner]
| Example | Given | When | Expected (incl. what the user sees next) | Source |
|---|---|---|---|---|
| R1.1 | [concrete data, names, numbers] | [action] | [result] | [Owner] / [Q-n] |

### R2 · [rule] [Owner]
| Example | Given | When | Expected | Source |
|---|---|---|---|---|
| R2.1 | | | ? | → Q-n |

**Non-functional:** [only the ones this feature actually risks: performance, offline, permissions, audit] [Owner]

## E7 · Outcome

Filled after release.

| Measure | Baseline | Target | Actual | Date read |
|---|---|---|---|---|
| | | | | |

**Lesson (one line):** [what to keep or change next time]

## Specialized Skills
<!-- Added by /ctx:breakdown when matching skills are found -->

## Estimated Complexity
[S / M / L / XL]

**Reasoning:** [why]

## Created
[YYYY-MM-DD]

---

## Usage Notes

**File naming:** `epic-<kebab-case-name>.md`

**Status lifecycle:** `draft` → `ready` → `broken-down` → `completed`
- `draft` → `ready` is gated (see `ownership.md` → Gates): no `[Claude-proposed]` left in
  E1, E2, E3, the chosen option, or E6; no `?` expected value; no unanswered blocking
  question; every E3 **In** row, every screen, and every denied cell of the permission
  matrix names at least one rule. Flows and screens are logic: their `[Claude-proposed]`
  labels block the gate too.

**Older epics** written with `## High-Level Requirements` remain valid. Skills read them
as before; the new gates apply only to the sections that exist. An E3 **In** written
as bullets is checked per bullet: each bullet must name a rule.

**When updating:** add a changelog entry at the bottom:

```markdown
## Changelog

### [YYYY-MM-DD] [Change]
- Updated: [what]
- Reason: [why]
```
