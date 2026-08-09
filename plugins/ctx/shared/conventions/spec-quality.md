# Spec Quality

A text scan over requirements and acceptance criteria, run right before a draft is
shown to the user. It catches the sentence shapes that cannot be tested.

**This scan warns. It never blocks.** No skill may refuse to write a file, withhold a
draft, or demand a fix because of a finding. The user reads the warnings and decides.

**Every finding ships with a rewrite.** A warning that only names a problem costs the
user thinking time. A warning that hands over the replacement sentence costs a
keystroke. Never report a finding you cannot rewrite — drop it instead.

Who runs it: `epic` (on High-Level Requirements and Success Criteria), `create-task`
and `breakdown` (on Acceptance Criteria).

---

## Part 1 — Smells

A smell is a linguistic signal that a requirement is probably untestable. Each row is
a pattern to look for, and the shape of the rewrite.

| Smell | Looks like | Why it fails | Rewrite toward |
|---|---|---|---|
| **Vague quantifier** | fast, slow, quick, timely, soon, efficient, scalable, reasonable | no threshold, so no test | a number and a unit |
| **Subjective adjective** | friendly, intuitive, clean, seamless, robust, proper, appropriate | two readers reach two verdicts | an observable behaviour |
| **Comparative without baseline** | faster, better, more reliable, improved | faster than what | the baseline, measured |
| **Open-ended list** | etc., and so on, and similar, among others, ... | scope never closes, cannot be broken down | the closed list, or a rule that covers the rest |
| **Passive without an agent** | "the data will be validated", "is logged" | who does it, at which layer | name the actor |
| **Ambiguous pronoun** | "it must be retried", "this should fail" | which "it" | repeat the noun |
| **Two requirements in one** | one criterion joined by *and* / *or* | an AC must fail for exactly one reason | split into two ACs |
| **Unverifiable verb** | support, handle, manage, deal with, take care of | no pass or fail | say what happens, observably |
| **Optionality** | should, may, ideally, if possible, where practical | not a criterion, an aspiration | *shall*, or delete it |
| **Implementation instead of outcome** | "add a `retryCount` column" | describes the how; the AC passes even when the feature does not work | the behaviour a user or caller can observe |

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
- A criterion that is genuinely a checklist item with a binary outcome, such as
  "Tests pass" or "Documentation updated".

---

## Part 2 — EARS

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

### The failure-path check

Most weak criteria are weak because they only describe the happy path.

If a task or epic has **no** unwanted-behaviour criterion, report one finding saying
so, and propose one. This is the single highest-value line in this document. Propose
the concrete failure that actually applies — bad input, absent permission, the
upstream call timing out, the record already being in the target state — not a
generic "handle errors".

A task where nothing can go wrong is real and does exist. Say so and move on; do not
argue with the user about it.

---

## Part 3 — Reporting

Run the scan after the draft exists and before showing it. Report in one compact
block. One line per finding: where, what, and the rewrite.

```
Spec check — 3 warnings, nothing blocked

  AC 2   vague quantifier "fast"
         → "returns within 300ms at p95"
  AC 4   two requirements in one sentence
         → split: (4) at most 50 per page  (5) sortable by createdAt or name
  —      no failure-path criterion
         → add: "If the upload exceeds 10MB, then the request is rejected with 413"
```

Rules for the report:

- **Zero findings prints one line**: `Spec check — clean.` No section, no heading.
- **Cap at 5 findings.** Past five, print the five with the largest effect and a
  count of the rest. A wall of warnings is read as noise and skipped entirely.
- **One finding per criterion**, the worst one. Do not stack three smells on one line.
- Do not ask "would you like me to fix these?" as a separate turn. Include the
  rewrites in the block; the user's existing approve-or-modify step already covers it.
- If the user declines the rewrites, write the draft as it stands and say nothing
  further. Never re-warn about the same finding later in the same session.

---

## Part 4 — Why it is a warning

A blocking gate on the fastest, most frequent step in the workflow gets disabled
within a week, and then nothing is checked at all. The scan is worth having only if
it stays cheap enough that nobody wants to turn it off.

The deeper checks — multi-perspective review, per-criterion elicitation — belong at
epic readiness, where they are rare and the user has already chosen to slow down.
This scan is the layer that costs nothing and therefore runs every time.
