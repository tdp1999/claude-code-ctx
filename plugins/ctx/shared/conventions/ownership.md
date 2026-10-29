# Ownership

Who owns which part of an epic or a task, how that ownership is written down, and the
gates that keep a draft from passing as a decision.

The rule this file protects: **logic belongs to the Owner, mechanics belong to Claude.**
A feature whose rules were written by Claude and approved with a nod has no owner. When
it breaks, nobody can say what it was supposed to do, and the tests only prove that the
code matches Claude's guess.

The **Owner** is the person driving the feature in this session, normally the user.

---

## Logic vs mechanics

| Logic (Owner writes, Claude reviews) | Mechanics (Claude writes, Owner reads) |
|---|---|
| The problem, who has it, the evidence | EARS wording of a criterion the Owner already stated |
| What "done" means and how it is measured | Boundary points for a range the Owner already defined (EP + BVA) |
| Scope: in, out, open | Blast radius in the code, call sites, migration mechanics |
| Which design option, and why | Test levels, techniques, automation choice |
| Rules, examples, expected values (incl. what the user sees next) | Files to touch, complexity, dependencies |
| How the work is sliced into tasks | Formatting, numbering, cross-references |

When an item is unclear, treat it as logic.

---

## Status lines and provenance labels

Two kinds of marks record ownership. A **status line** under a heading records approval.
A **provenance label** at the end of an item records where the item came from.

### Status line

Every logic section starts with one status line, directly under its heading. The
heading can be at any level (`##` to `#####`).

```
Status: [Owner]
Status: [Claude-proposed]
Status: [Owner], except 'R3 Duplicate name' and R4.2 [Claude-proposed]
```

| Value | Meaning |
|---|---|
| `[Owner]` | The Owner approved everything under this heading |
| `[Claude-proposed]` | Claude drafted it and the Owner has not approved it |
| `[Owner], except … [Claude-proposed]` | The Owner approved the section, but the named items still wait for review |

Rules for the status line:

1. The status line covers everything down to the next heading of the same or a higher level.
2. A deeper heading with its own status line overrides its parent for its own part.
3. A section that is still `[Claude-proposed]` may name the items to review first: `Status: [Claude-proposed]. Review first: R2, R5`.
4. The word "Status" follows the file's prose language. A Vietnamese epic writes `Trạng thái:`.
5. When the Owner approves a section, Claude changes its status line to `[Owner]`.
6. Mechanics sections carry no status line.

### Provenance labels

An item may end with one label that names its source.

| Label | Meaning | Who sets it |
|---|---|---|
| `[Owner]` | The Owner wrote this item in their own words | Claude, only for what the Owner said or wrote |
| `[Q-n]` | The value comes from answer *n* in the epic's **Questions** section | Claude, when copying an answer that is already recorded |
| Rule ID (`R3`) | The value is copied, unchanged, from a rule the Owner owns | Claude, when citing |

An item that Claude drafted carries no provenance label. The status line of its section
says whether the Owner approved it.

### Rules for both

- **Claude never writes `[Owner]` on its own draft.** A draft section becomes `[Owner]`
  only when the Owner approves that section, or the named items in it. A blanket "ok,
  looks good" over the whole file converts nothing. List the sections and items that
  are still `[Claude-proposed]` and ask about them in a small batch.
- **A value nobody can cite is `?`.** Write `?` and add a question to **Questions**.
  Never fill it with a plausible guess.
- **Older files have no status lines.** A section without a status line is read the
  old way. It counts as approved when no item in it ends with `[Claude-proposed]`.
  Claude adds a status line when it next edits the section.

---

## How the skills talk to the Owner

1. **Owner writes first.** For problem, done, scope, rules, examples, and expected
   values, ask the Owner to write them. Offer a skeleton (headings, empty table rows),
   not content. Draft content only when the Owner asks for a draft, and set the status
   line of every drafted section to `[Claude-proposed]`.
2. **Review by asking, not answering.** When Claude reviews the Owner's logic and finds
   a gap (a missing edge case, an inconsistent rule, an expected value that contradicts
   another), it adds a question to **Questions** with the Owner as the one to answer.
   It does not write the answer into the rule.
3. **A choice needs a reason in the Owner's words.** When the Owner picks a design
   option, record one sentence of why, written or dictated by the Owner. "Option B" with
   no reason is not recorded as a decision; ask for the sentence.
4. **Batch questions per phase.** Collect the logic questions for one step and ask them
   together (at most about five), so each one gets a real answer instead of a reflex
   approval. Never ask the Owner about mechanics.

---

## Gates

A gate is checked before a status change. When it fails, the status stays where it is
and the skill lists exactly what blocks it.

"Holds `[Claude-proposed]`" means one of these: a status line in the section says
`[Claude-proposed]` (alone or after "except"), or an item in a section with no status
line still ends with `[Claude-proposed]`.

| Gate | Blocks when |
|---|---|
| Epic `draft → ready` | A logic section (Problem, Done, Scope, the chosen option and its reason, Flows and screens, Rules) still holds `[Claude-proposed]`; an expected value is `?`; a question marked **blocking** has no answer; or an E3 **In** row names no rule, or a screen in E5 **Flows and screens** or a denied cell of the permission matrix is in no rule's covers line |
| Breakdown writes a task | The criterion or expected value it needs cannot cite a rule ID or `[Q-n]` (the task is still written, with `?` and a new question, but the epic is reported as not fully ready) |
| Size L task, first code | **T3 · Approach** is empty or still `[Claude-proposed]` (the Owner confirms the approach when the task starts) |
| Task `→ done` | Any AC is unchecked; **Slice**, **Acceptance Criteria**, or a size L **Approach** still holds `[Claude-proposed]`; or **Test Results** has no result recorded by the Owner |
| Size M task `pending → in-progress` | **Problem**, the **Approach** choice and its **Flows** and **Screens**, or **Rules and examples** still holds `[Claude-proposed]` or a `?`; or a screen names no rule (the same check as an epic's `draft → ready`) |

Gates never delete or rewrite content. They report and wait.

---

## Size

The first line under an epic's or task's title is the size, chosen by risk, not by
amount of code:

```
Size: L · <one-line reason>
```

| Size | Signs | Files |
|---|---|---|
| **L** | Changes behavior users rely on; touches money, permissions, data, or migration; spans several systems; hard to reverse | Epic + tasks |
| **M** | Visible change with a clear path and an easy undo | One task holding a compact problem, questions, and rules |
| **S** | Local, reversible, no behavior anyone relies on | No file needed |

Size is logic: the Owner chooses it. Claude may name the signs it sees. Raise the size
when a sign appears mid-way; never lower it.
