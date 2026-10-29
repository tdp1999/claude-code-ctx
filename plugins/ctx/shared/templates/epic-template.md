# Epic Template

This template is used for creating epic files in `.context/plans/`. An epic is the
memory of one size-L feature: the problem, the agreed answers, the design, and the
rules every task and test traces back to.

Status lines, provenance labels, and the size line follow `../conventions/ownership.md`.
Logic sections are marked *(logic)*. Each logic heading, at any level, starts with a
`Status:` line that records the Owner's approval. It can name the items that still
need review. A label at the end of an item (`[Owner]`, `[Q-n]`, a rule ID) only names
its source. Write "Status" in the epic's prose language.

**One numbered section, one step.** E1–E3 hold the problem, E4 the design, E5 the
flows and screens, E6 the rules and acceptance criteria, E7 the outcome. Each is
written in one step, so a reader can stop at the step they are in. E0 · Questions and
the unnumbered sections (Status, Tasks, Changelog) are used across steps.

**No forward references.** A section never cites an ID that a later section defines.
E5 names flows and screens only; each rule in E6 points back at the flows and screens
it covers. Trace columns filled later (E3 **Covered by**) are the one exception: the
section reads complete without them.

---

# Epic: [Feature Name]

Size: L · [one-line reason, naming the risk sign]

## Status: draft

## Legend

ID prefixes follow `shared/conventions/ids-and-references.md`. Keep only the rows this epic uses.

| Prefix | Item | Defined in |
|---|---|---|
| `Q-n` | Question to the Owner | [[#E0 · Questions]] |
| `Fn` | Flow | [[#Flows]] |
| `Sn` | Screen or dialog | [[#Screens]] |
| `Rn`, `Rn.m` | Rule, example of a rule | [[#Rules]] |
| `Pn` | Inherited pattern | [[#Inherited behavior]] |
| `AC-n` | Acceptance criterion | [[#Acceptance criteria and test levels]] |
| `DT-n`, `ST-n` | Decision table, state transition table | [[#Test design]] |

## E0 · Questions

The oracle, used in every step. Expected values in E6 and in tasks cite these answers
as `[Q-n]`. New questions go at the bottom; the Date column shows when each was asked.

| # | Question | Who answers | Answer | Date | Blocking |
|---|---|---|---|---|---|
| Q-1 | [question] | [Owner / name] | | | yes / no |

## E1 · Problem *(logic)*

Status: [Claude-proposed]

**Problem:** [One sentence: who cannot do what, today] [Owner]

**Evidence:** [ticket, numbers, a quote, a screenshot path] [Owner]

**Why now:** [what changes if this waits another quarter] [Owner]

**Users and context:** [who, where they are, what they hold in their hands] [Owner]

**How they do it today:** [the workaround, step by step] [Owner]

## E2 · Done and measure *(logic)*

Status: [Claude-proposed]

| Measure | Baseline (today) | Target | How it is read |
|---|---|---|---|
| [metric] | [number, date measured] | [number] | [query, dashboard, manual count] |

[One sentence: what a user can do when this is done] [Owner]

## E3 · Scope *(logic)*

Status: [Claude-proposed]

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

## E4 · Design

Status: [Claude-proposed]. Review first: the chosen option and its reason

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

## E5 · Flows and screens

Status: [Claude-proposed]

Written before E6, so every rule can point back at a flow or a screen. This section
cites flow and screen IDs only, never rule IDs. Every ticket type
fills this part: a new feature writes new flows; an upgrade or refactor writes the
current flows that must not change; a bug fix writes the broken flow, with the
reproduction steps as one branch. A ticket with no UI lists endpoints, events, or
messages instead of screens.

Every flow, rule, decision table, and state transition table is a `####` heading in the
form `ID · Short name` (2 to 4 words). In prose, write an ID with its short name in
single quotes: `'S1 Order list'`, never a bare `S1`. See `shared/conventions/ids-and-references.md`.

### Flows

#### F1 · [short name]
[one job the user or system finishes]
1. [user action or system response]
2. …

- 2a. [what goes wrong at step 2: bad input, server error, session expired, no
  permission, cancel, concurrent edit] → [what the system does; what the user does next]

### Screens

| Screen | Short name | What it is | App | Flows | States |
|---|---|---|---|---|---|
| S1 | [2 to 4 words] | [screen, dialog, error page, email, notification] | [app] | F1 | [first use, empty, no results, loading, partial, error, offline, no permission, success] |

### Data dictionary

New or changed fields only.

| Field | Meaning | Type | Format, example | Required | Limits | Label |
|---|---|---|---|---|---|---|
| | | | | | | |

### Only when it applies

A permission matrix (role × action, role × screen) for more
than one role, where every denied cell later gets an example in E6; a state diagram for an entity with a lifecycle; a call sequence for more
than one system (retry, duplicates, timeout); analytics events when E2 needs app data;
audited actions when edits must be traceable.

### Mockup

[link, every screen above with its states, or "no UI"]

## E6 · Rules and examples *(logic)*

Status: [Claude-proposed]

Each rule has an ID and a covers line (the flows and screens it applies to). Each
example has concrete values and an expected result that says what the user sees and
what they do next. Tasks reference these IDs; they never add rules of their own.
All rules sit under one `### Rules` heading, each as a `####` heading with a short name;
the full rule is the bold sentence under it.

### Rules

#### R1 · [short name]
Status: [Owner], except R1.2 [Claude-proposed]

**[rule in one sentence] [Owner]**
*'F1 [short name]' · 'S1 [short name]'*

| Example | Given | When | Expected (incl. what the user sees next) | Source |
|---|---|---|---|---|
| R1.1 | [concrete data, names, numbers] | [action] | [result] | [Owner] / [Q-n] |

#### R2 · [short name]
**[rule] [Owner]**
*'F1 [short name]' · 'S1 [short name]', permission matrix*

| Example | Given | When | Expected | Source |
|---|---|---|---|---|
| R2.1 | | | ? | → Q-n |

### Inherited behavior
Behavior that comes from an existing pattern or convention. One row per pattern, no
examples: the feature only has to hook the pattern up, and the smoke test catches a
missing hookup. A project-wide decision made in this epic is promoted to the standards
files first, then listed here.

| ID | Short name | Pattern | Source | Applies to | Smoke test |
|---|---|---|---|---|---|
| P1 | [2 to 4 words] | [pattern] | [standards file or ADR] | [flows, screens, endpoints] | [one check] |

**Non-functional:** [only the ones this feature actually risks: performance, offline, permissions, audit] [Owner]

### Acceptance criteria and test levels
The only place ACs are written. Tasks cite these IDs and copy no wording.

| AC | Rule | WHEN … THE SYSTEM SHALL … | Test level | Technique | Examples covered |
|---|---|---|---|---|---|
| AC-1 | R1 | WHEN [trigger] THE SYSTEM SHALL [observable result] | unit / integration / e2e | EP / BVA / decision table / state transition / scenario | R1.1–R1.3 |

### Test design
Only when an AC's technique needs a table. Answer three questions first: where a
mistake costs most, where the expected values come from (examples, never code), and
how many cases are enough for each cost level.

| Cost | Rule | If it is wrong | Enough is |
|---|---|---|---|
| High / Medium / Low | 'R1 [short name]' | [what the user loses] | [every row of DT-1, at which test level] |

#### DT-1 · [short name]
*AC-1 · [condition] × [condition]*

| [condition] | [condition] | Expected | Example |
|---|---|---|---|
| | | | R1.1 / [Owner] for a case no example had |

#### ST-1 · [short name]
*AC-n · 'S1 [short name]'*

| From | The user does | To | Example |
|---|---|---|---|
| | | | |

## Tasks
<!-- Only for an epic with one or two slices. A bigger epic gets task files from
     /ctx:breakdown and deletes this section. -->
- [ ] **Slice 1 · [what it delivers]** · covers F1 · S1 · AC-1, AC-2 [Owner]
  - **Approach:** [filled when the slice starts; the Owner confirms before code. A long
    approach gets its own `###` heading with a status line and a short list of the
    points the Owner must review]
  - **Progress:** [dated notes]
  - **Test results:** [layer · result · by; the Owner records the result]

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
- `draft` → `ready` is gated (see `ownership.md` → Gates): no status line in E1, E2, E3,
  E5, E6, or the E4 choice and its reason holds `[Claude-proposed]`; no `?` expected value; no unanswered blocking
  question; every E3 **In** row names at least one rule, and every screen and every
  denied cell of the permission matrix is covered by at least one rule (its covers
  line in E6). Flows and screens are logic: a `[Claude-proposed]` status line there
  blocks the gate too.

**Tasks section or task files:** `/ctx:breakdown` asks. One or two slices → the
**Tasks** section, no task files. Three or more → one task file per slice, and the
section is deleted. Either way the logic stays in the epic.

**Older epics** written with `## High-Level Requirements` remain valid. Skills read them
as before; the new gates apply only to the sections that exist. An E3 **In** written
as bullets is checked per bullet: each bullet must name a rule.

**When updating:** add a changelog entry at the top of the Changelog section. Each
entry starts with a bold line, not a heading, so the outline stays short:

```markdown
## Changelog

**[YYYY-MM-DD] [Change]**
- Updated: [what]
- Reason: [why]
```

**Approval:** when the Owner approves a section, change its status line to
`Status: [Owner]`. When the Owner approves only some items, list the rest after
"except".
