# Spec Quality

A text scan over requirements and acceptance criteria. It catches the sentence shapes
that cannot be tested, and the criteria sets that can all pass while the goal is
missed.

**This scan warns. It never blocks.** No skill may refuse to write a file, withhold a
draft, or demand a fix because of a finding. The user reads the warnings and decides.

**Every finding ships with a rewrite.** A warning that only names a problem costs the
user thinking time. A warning that hands over the replacement sentence costs a
keystroke. Never report a finding you cannot rewrite — drop it instead.

## When it runs

Twice, on different text, catching different things.

| Pass | Input | Catches |
|---|---|---|
| **On input** — first thing, before any research | The user's own words | The vagueness in the request. This is where smells actually cluster |
| **On draft** — after drafting, before showing | The requirements or criteria you just wrote | What survived your own drafting, and the set-level checks in Part 2 |

The input pass matters more than it looks. A skill that researches first and drafts
second will usually produce clean criteria, then scan those clean criteria and find
nothing — grading its own homework. Meanwhile the ambiguity the user actually typed
was dissolved into implementation steps and never surfaced as a question.

Findings from the input pass become **clarifying questions**, not warnings. "Faster
than what, by how much" is a question. Ask it alongside the other scoping questions
in the same turn; never add a turn for it.

Who runs both passes: `epic` (E2 Done and measure, E6 rules; or High-Level
Requirements and Success Criteria in older epics),
`create-task` and `breakdown` (Acceptance Criteria).

---

## Part 1 — Line-level smells

A smell is a linguistic signal that one requirement is probably untestable. Each row
is a pattern to look for, and the shape of the rewrite.

| Smell | Looks like | Why it fails | Rewrite toward |
|---|---|---|---|
| **Vague quantifier** | fast, slow, quick, timely, soon, efficient, scalable, reasonable | no threshold, so no test | a number and a unit |
| **Subjective adjective** | friendly, intuitive, clean, seamless, robust, proper, appropriate | two readers reach two verdicts | an observable behaviour |
| **Comparative without baseline** | faster, better, more reliable, improved | faster than what | the baseline, measured |
| **Open-ended list** | etc., and so on, and similar, among others, ... | scope never closes, cannot be broken down | the closed list, or a rule covering the rest |
| **Passive without an agent** | "the data will be validated", "is logged" | who does it, at which layer | name the actor |
| **Ambiguous pronoun** | "it must be retried", "this should fail" | which "it" | repeat the noun |
| **Two requirements in one** | one criterion joined by *and* / *or* | a criterion must fail for exactly one reason | split into two |
| **Unverifiable verb** | support, handle, manage, deal with, take care of | no pass or fail | say what happens, observably |
| **Optionality** | should, may, ideally, if possible, where practical | not a criterion, an aspiration | *shall*, or delete it |
| **Implementation instead of outcome** | "add a `retryCount` column" | passes even when the feature does not work | the behaviour a user or caller can observe |

### Examples

| Before | After |
|---|---|
| Login should be fast | When credentials are valid, the API shall return a session token within 300ms at p95 |
| Handle invalid input properly | If the email field fails format validation, then the form shall show the field-level error and shall not submit |
| The list is paginated and sortable | (1) The list shall return at most 50 items per page. (2) The list shall accept a sort key of `createdAt` or `name` |
| Errors are logged | When a request returns 5xx, the API shall write one error-level log line containing the request id |

### Not smells

Do not report these. False positives are what make a linter get switched off.

- Domain vocabulary that happens to match a smell word. "Fast path" as a named
  concept in `domain.md` is a term, not a vague quantifier.
- A number given without a unit where the unit is unambiguous in context.
- "Should" inside prose sections — Context, Technical Notes, Reasoning. The scan
  covers requirement and criterion lines only, never prose.
- Quoted text, code spans, file paths, identifiers.
- A criterion that is genuinely a binary checklist item, such as "Tests pass" or
  "Documentation updated".

---

## Part 2 — Set-level checks

Part 1 reads one line at a time. These two read the whole set, and they catch what
line-by-line reading is blind to: every criterion can be individually valid while the
set as a whole fails to pin down the goal.

### The threshold check

**If the goal is a measurable improvement, at least one criterion must state the
number to be reached.**

Applies whenever the goal contains a comparative — faster, lighter, smaller, fewer
errors, higher conversion, less memory. Recording a before-number and an after-number
is not enough: a set of criteria that only says "measure, then optimise, then measure
again" passes completely while the thing stays exactly as slow as it was.

The tell is a criteria set where every line describes **work to perform** and none
describes **a state to reach**:

```
- [ ] Baseline captured for both endpoints            ← measurement
- [ ] The category list no longer fetches 200 posts   ← work
- [ ] The list query reads only the columns needed    ← work
- [ ] The detail handler runs its reads concurrently  ← work
- [ ] After-numbers recorded next to the baseline     ← measurement
```

All five can pass with the page no faster. Propose the missing line:

```
- [ ] When /api/blog is requested with default params, p95 response time
      shall be at most 40% of the baseline recorded in this task
```

Pick the target from the evidence gathered, not from thin air. If there is no basis
for a number, that is itself the finding: say the target is unknown and ask what
would count as success.

### The failure-path check

**If no criterion covers a failure path, report one finding and propose one.**

Most weak criteria sets are weak because they only describe the happy path. Propose
the concrete failure that actually applies — bad input, absent permission, an upstream
call timing out, the record already being in the target state — never a generic
"handle errors".

A task where nothing can go wrong is real and does exist. Say so and move on; do not
argue with the user about it.

---

## Part 3 — EARS

EARS (Easy Approach to Requirements Syntax) is five sentence templates. Draft each
requirement into whichever one fits; if none fits, the requirement is probably two
requirements.

| Pattern | Template | Use when |
|---|---|---|
| Ubiquitous | The `<system>` shall `<response>` | always true, no trigger |
| Event-driven | **When** `<trigger>`, the `<system>` shall `<response>` | a specific event starts it |
| State-driven | **While** `<state>`, the `<system>` shall `<response>` | true only in some state |
| Unwanted behaviour | **If** `<bad condition>`, **then** the `<system>` shall `<response>` | failure, bad input, refusal |
| Optional feature | **Where** `<feature is present>`, the `<system>` shall `<response>` | configurable behaviour |

---

## Part 4 — Reporting

Report in one fenced block. **Prose is not an acceptable report** — a paragraph
saying "criteria look observable and two failure paths are present" is a summary of
the scan, not the scan's output. One line per finding: where, what, and the rewrite.

```
Spec check — 3 warnings, nothing blocked

  AC 2   vague quantifier "fast"
         → "returns within 300ms at p95"
  AC 4   two requirements in one sentence
         → split: (4) at most 50 per page  (5) sortable by createdAt or name
  set    no criterion states the target number, only that it will be measured
         → "p95 for /api/blog shall be at most 40% of the baseline in this task"
```

Rules for the report:

- **Every finding has a `→` line.** A finding whose second line is advice ("the task
  should assert this somewhere") is unfinished. Write the sentence.
- **Zero findings prints one line**: `Spec check — clean.` No block, no heading.
- **Cap at 5 findings.** Past five, print the five with the largest effect and a count
  of the rest. A wall of warnings is read as noise and skipped entirely.
- **One finding per criterion**, the worst one. Set-level findings use `set` in the
  location column and are exempt from that limit.
- Do not ask "would you like me to fix these?" as a separate turn. Apply the obvious
  rewrites into the draft yourself and include the block; the user's existing
  approve-or-modify step already covers it.
- If the user declines the rewrites, write the draft as it stands and say nothing
  further. Never re-warn about the same finding later in the same session.

---

## Part 5 — Why it is a warning

A blocking gate on the fastest, most frequent step in the workflow gets disabled
within a week, and then nothing is checked at all. The scan is worth having only if it
stays cheap enough that nobody wants to turn it off.

The deeper checks — multi-perspective review, per-criterion elicitation — belong at
epic readiness, where they are rare and the user has already chosen to slow down.
This scan is the layer that costs nothing and therefore runs every time.
