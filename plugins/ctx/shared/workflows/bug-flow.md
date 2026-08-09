# Bug & Defect Workflow

How to handle a bug, defect, or refactor with the CTX plugin.

## Overview

There is no separate investigation artifact. A bug is either small enough to be one
task, or large enough to be an epic. Both paths end in the same place: task files in
`.context/tasks/`.

```
Small bug — one place to fix, cause already understood
  /ctx:create-task "Fix <symptom>"
  /ctx:task <NNN>

Large defect — cause unclear, or the fix spans several places
  /ctx:epic "<the broken area>"      ← the epic carries the investigation
  /ctx:breakdown epic-<name>
  /ctx:task <NNN>
```

## Choosing the Path

Ask one question: **can this be finished in a single task?**

| Signal | Path |
|---|---|
| You already know the file and the fix | `create-task` |
| Reproduction is one step and the fix is one change | `create-task` |
| Cause is unknown and needs digging before anything can be written | `epic` |
| The fix touches several modules, or needs a migration, or changes a contract | `epic` |
| Fixing it properly means changing a design decision | `epic` |

When in doubt, start with `create-task`. If the task turns out to be bigger than one
task, `/ctx:task` will say so — promote it to an epic then. Going the other way (an
epic that produces one trivial task) wastes a planning round.

## Path A: Small Bug

```
/ctx:create-task "Checkout returns 500 when the payment API key is missing"
```

`create-task` asks for the goal and acceptance criteria, picks the next free number,
and writes `.context/tasks/NNN-<name>.md`.

Write the reproduction into `## Context` and the expected behaviour into
`## Acceptance Criteria` — an AC like `- [ ] Checkout completes with a valid key` is
what tells `/ctx:task` when it is allowed to write `done`.

Then:

```
/ctx:task NNN
```

## Path B: Large Defect

```
/ctx:epic "Payment gateway configuration"
```

The epic template already has the sections an investigation needs. Use them like this:

| Epic section | What a bug epic puts there |
|---|---|
| `## Summary` | What is broken, in one paragraph |
| `## Why` | The impact — who is affected and how badly |
| `## Scope` → `### In Scope` | Symptoms, reproduction steps, error messages, affected areas |
| `## Scope` → `### Out of Scope` | Related problems you are deliberately not fixing now |
| `## Technical Considerations` | Root cause once found, and the files it touches |
| `## Risks & Warnings` | Regression risk, data risk, anything the fix could break |
| `## Alternatives Considered` | Quick workaround vs proper fix, and why you chose one |
| `## Success Criteria` | How you will know the bug is actually gone |

Do not add bug-only sections to the epic template. Every epic would carry them, and
most epics are features.

If the cause is not known yet, write the epic with `## Status: draft`, dig until you
can fill in `## Technical Considerations`, then move it to `ready` and break it down.
The epic is the investigation record — it does not need a second file.

Then:

```
/ctx:breakdown epic-payment-gateway-config
/ctx:progress
/ctx:task NNN
```

## Example: "Checkout 500 Error"

The cause was unknown at report time and the fix spanned three places, so this is
Path B.

**`.context/plans/epic-checkout-500.md`** (abridged):

```markdown
# Epic: Checkout 500 Error

## Summary
Checkout returns 500 Internal Server Error on payment submission. Started after the
payment gateway update in commit abc123.

## Why
No customer can complete a purchase. Total revenue stop.

## Scope

### In Scope
- Reproduction: add to cart → checkout → fill payment form → Complete Purchase → 500
- Log line: `PaymentService: Missing API key`
- Affected: `apps/api/src/payment/payment.service.ts`, `.env.example`, deploy config

### Out of Scope
- Rewriting the payment provider abstraction

## Technical Considerations
Root cause: commit abc123 made `PAYMENT_API_KEY` required in the `PaymentService`
constructor. The variable was never added to the production environment, and nothing
fails at startup, so the error only surfaces on the first checkout.

## Risks & Warnings
⚠️ Adding a startup check will crash the API on boot if any environment is missing
the key. Verify staging and production before merging.

## Success Criteria
- [ ] Checkout completes end to end in production
- [ ] API refuses to start when the key is absent, with a named error

## Status
ready
```

Breaking it down:

```
/ctx:breakdown epic-checkout-500
```

produces:

- `013-add-payment-api-key-validation.md` (S)
- `014-update-env-example-payment-key.md` (S)
- `015-configure-production-payment-key.md` (S)

When all three are `done`, `/ctx:sync` archives them to
`tasks-done/epic-checkout-500/` and moves the epic to `plans-done/`.

## Tips

**Find the cause, not the symptom.** Ask "why" until you reach something you can
change. A fix that makes the error disappear without explaining it will come back.

**Write the reproduction before the fix.** If you cannot state the steps, you cannot
state the acceptance criterion, and `/ctx:task` has nothing to gate `done` on.

**One bug, one epic.** If digging reveals a second unrelated defect, open a second
epic or task. Do not grow the scope of the first.

**Blocked is a real status.** If you cannot reproduce it, or you are waiting on
someone else's information, set `## Status: blocked` and write why in the progress
log. Do not leave it `in-progress` and forget it.

**Archive only when the fix is verified.** An epic moves to `plans-done/` when every
task under it is `done` with all acceptance criteria checked, not when the code merged.
