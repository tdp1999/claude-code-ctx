# Breakdown Skill Examples

## Empty Argument (List Epics and Investigations)

```
User: /ctx:breakdown

Assistant checks .context/plans/ and .context/investigations/

Found:
- epic-auth.md (status: ready)
- epic-payment.md (status: draft)
- inv-checkout-bug.md (status: ready)

Assistant shows:
"Available to break down:

Epics:
1. epic-auth.md (ready) - User authentication
2. epic-payment.md (draft) - Payment processing

Investigations:
3. inv-checkout-bug.md (ready) - Checkout 500 error

Which would you like to break down?"
```

## Epic Name

```
User: /ctx:breakdown auth

Assistant finds .context/plans/epic-auth.md
Reads: Summary, Requirements, Technical Considerations, Risks
Creates tasks:
- 001-setup-user-model.md
- 002-implement-registration.md
- 003-implement-login.md
- 004-password-reset-flow.md
- 005-jwt-token-handling.md

Updates epic status to "broken-down"
Adds tasks to progress.md
```

## Ad-hoc Feature

```
User: /ctx:breakdown "Add caching layer"

No epic exists, so this is ad-hoc.
Assistant asks clarifying questions.
Creates tasks based on description.
Note: Less context than epic-based breakdown.
```

---

## Quality Standards

**Completeness:** Every requirement should trace to a task
**Clarity:** Tasks should be understandable without the source document
**Actionability:** Someone can start working immediately
**Right-sized:** Not too big (multi-day), not too small (trivial)

**Good task title:** "Set up Strapi content types"
**Bad task title:** "Backend stuff"

**Good acceptance criterion:** "User can log in with email/password and receive JWT token"
**Bad acceptance criterion:** "Authentication works"

**Complexity estimates:**
- S: Single file change, < 50 lines
- M: Multiple files, clear path, 50-200 lines
- L: Multiple components, some unknowns, 200-500 lines
- XL: Significant feature, research needed, 500+ lines

## Self-Verification Checklist

Before finalizing, verify:
- [ ] All requirements from source are covered
- [ ] No orphan dependencies (referencing non-existent tasks)
- [ ] No circular dependencies
- [ ] All tasks have clear acceptance criteria
- [ ] Task numbering is sequential with no gaps
- [ ] progress.md is updated
- [ ] File names follow convention
