# Feature Development Workflow

Step-by-step guide for planning and implementing new features using the Epic → Breakdown → Task flow.

---

## Overview

**Goal**: Transform a feature idea into completed, tested code
**Steps**: Epic → Breakdown → Task → Work → Sync
**Time**: Varies by feature complexity

---

## The Feature Workflow

```
Feature Idea
    ↓
[Epic Planning] - Expand idea, identify requirements, foresee risks
    ↓
[Breakdown] - Decompose into 3-10 actionable tasks
    ↓
[Review Tasks] - Understand scope and dependencies
    ↓
[Work on Task] - Complete one task at a time
    ↓
[Sync Progress] - Archive completed, update progress
    ↓
(Repeat until all tasks done)
    ↓
Feature Complete ✅
```

---

## Step 1: Create an Epic (10-15 min)

### Start Planning

```bash
/ctx:epic "Feature name or brief description"
```

**Examples**:
- `/ctx:epic "User authentication with JWT"`
- `/ctx:epic "Payment integration with Stripe"`
- `/ctx:epic "Admin dashboard for content management"`

### What Happens

The epic skill will:
1. **Ask clarifying questions**:
   - What problem does this solve?
   - Who benefits from this feature?
   - What's in scope vs out of scope?
   - Any specific requirements or constraints?

2. **Suggest improvements**:
   - Alternative approaches you might not have considered
   - Related use cases to include
   - Simpler MVP versions

3. **Warn about risks**:
   - Common pitfalls in this type of feature
   - Security/performance/scalability concerns
   - Required dependencies or prerequisites
   - Error-prone areas to watch out for

4. **Identify technical considerations**:
   - How it fits with your architecture
   - Modules/domains involved
   - Integration points
   - Testing strategy

### Output

Creates `.context/plans/epic-feature-name.md` with:
- Summary and why it matters
- In-scope and out-of-scope items
- High-level requirements
- Technical considerations
- Risks and warnings
- Success criteria
- Complexity estimate

---

## Step 2: Break Down into Tasks (5-10 min)

### Start Breakdown

```bash
/ctx:breakdown epic-feature-name
```

### What Happens

The breakdown skill will:
1. Read your epic file
2. Analyze requirements
3. Identify implicit tasks (not stated but necessary)
4. Create task files with:
   - Clear acceptance criteria
   - Technical notes
   - Files to touch
   - Dependencies
   - Complexity estimate (S/M/L/XL)

### Output

Creates multiple task files:
```
.context/tasks/
├── 001-setup-auth-module.md
├── 002-implement-jwt-service.md
├── 003-create-login-endpoint.md
├── 004-create-register-endpoint.md
├── 005-add-auth-middleware.md
└── 006-write-integration-tests.md
```

Updates `.context/progress.md` with all new tasks.

### Task Sizing

The skill automatically estimates complexity:
- **S (Small)**: < 50 lines, single file, < 1 hour
- **M (Medium)**: 50-200 lines, 2-3 files, 1-3 hours
- **L (Large)**: 200-500 lines, multiple components, 3-8 hours
- **XL (Extra Large)**: 500+ lines, significant scope, > 8 hours

If a task is XL, consider breaking the epic into smaller epics.

---

## Step 3: Review Tasks (2-5 min)

### Check Progress

```bash
/ctx:progress
```

### What You See

- **Pending tasks**: Listed by number with brief description
- **Complexity**: S/M/L/XL for each task
- **Dependencies**: If task 002 depends on 001, it's noted
- **Recommended start**: Skill suggests which task to start first

### Review Checklist

Before starting work:
- [ ] All requirements from epic are covered by tasks
- [ ] No missing implicit tasks
- [ ] Dependencies are correct (no circular deps)
- [ ] Complexity estimates seem reasonable
- [ ] You understand what each task involves

**If something is missing**: Edit the epic and re-run breakdown, or use `/ctx:create-task` for small additions.

---

## Step 4: Work on Tasks (Ongoing)

### Choose a Task

```bash
/ctx:task 001
```

**Selection Criteria**:
- ✅ No blockers (dependencies completed)
- ✅ Foundational work (others depend on it)
- ✅ Matches your current context
- ✅ Quick wins for momentum (S tasks)

### What Happens

The task skill will:
1. Load task file
2. Show goal and acceptance criteria
3. Update status to "in-progress"
4. Add progress log entry

### During Work

**Follow TDD Approach**:
1. **Red**: Write failing test for first acceptance criterion
2. **Green**: Implement minimal code to make test pass
3. **Refactor**: Clean up code while keeping tests green
4. Repeat for next criterion

**Track Progress**:
- Check off acceptance criteria as you complete them
- Add notes to progress log for significant milestones
- Reference `.context/patterns-architecture.md` for coding patterns

### When Task is Done

All acceptance criteria must be:
- ✅ Implemented and working
- ✅ Tested (unit and/or integration)
- ✅ Code reviewed (if working with team)
- ✅ Passing CI/CD checks

Then mark status as "completed" in the task file.

---

## Step 5: Sync Progress (1 min)

### After Completing a Task

```bash
/ctx:sync
```

### What Happens

The sync skill will:
1. Scan `.context/tasks/` for completed tasks
2. Move completed tasks to `.context/tasks-done/<epic-name>/`
3. Update `.context/progress.md`
4. Check if epic is complete (all tasks done)
5. Update epic status if complete

### Output

- Archived tasks report
- Updated progress summary
- Epic completion status (if applicable)

---

## Step 6: Continue with Next Task

### Check What's Next

```bash
/ctx:progress
```

### Choose Next Task

```bash
/ctx:task 002
```

**Repeat Steps 4-6** until all tasks are completed.

---

## Complete Example: Payment Integration

### Session 1: Planning (20 min)

```bash
/ctx:epic "Payment integration with Stripe"
```

**Conversation**:
- Q: What payment methods?
- A: Credit card and PayPal for now
- Q: One-time or recurring?
- A: One-time for MVP, recurring later
- Q: Refunds in scope?
- A: No, out of scope for MVP

**Warnings Given**:
- ⚠️ Webhooks need idempotency - duplicates will happen
- ⚠️ Requires HTTPS in production
- ⚠️ Test with Stripe test mode extensively

**Epic Created**: `.context/plans/epic-payment-integration.md`

```bash
/ctx:breakdown epic-payment-integration
```

**Tasks Created**:
- 007-setup-stripe-sdk.md (S)
- 008-create-payment-intent-endpoint.md (M)
- 009-implement-webhook-handler.md (M)
- 010-add-payment-ui-component.md (M)
- 011-write-payment-tests.md (L)
- 012-setup-stripe-test-mode.md (S)

**6 tasks, total ~10-15 hours estimated**

---

### Session 2: Foundation Work (3 hours)

```bash
/ctx:progress
# Review: 6 pending tasks, start with 007 (setup)

/ctx:task 007
# Work: Install Stripe SDK, configure API keys
# ✅ Acceptance: SDK installed, test connection works
# Complete in ~1 hour

/ctx:sync
# Task 007 archived to tasks-done/<epic-name>/

/ctx:task 012
# Work: Configure Stripe test mode, create test products
# ✅ Acceptance: Can create test payment intents
# Complete in ~2 hours

/ctx:sync
# Task 012 archived
```

---

### Session 3: Core Implementation (4 hours)

```bash
/ctx:progress
# Review: 4 pending tasks

/ctx:task 008
# Work: Create payment intent endpoint
# TDD: Write test → Implement → Refactor
# ✅ All criteria met
# Complete in ~3 hours

/ctx:sync

/ctx:task 009
# Work: Implement webhook handler with idempotency
# ✅ All criteria met
# Complete in ~1 hour (continued next session)
```

---

### Session 4: UI & Testing (5 hours)

```bash
/ctx:task 009
# Continue from last session
# Complete in ~1 hour total

/ctx:sync

/ctx:task 010
# Work: Payment UI component with form
# Complete in ~2 hours

/ctx:sync

/ctx:task 011
# Work: Integration tests for payment flow
# Complete in ~2 hours

/ctx:sync

/ctx:progress
# All tasks completed! ✅
# Epic status: completed
```

**Feature Complete**: Payment integration working end-to-end

---

## Tips & Best Practices

### Epic Phase
- ✅ Be specific about MVP scope
- ✅ Listen to risk warnings - they're based on common mistakes
- ✅ Consider alternatives suggested
- ✅ Document "out of scope" clearly to avoid scope creep
- ❌ Don't skip the "why" - it helps with prioritization later

### Breakdown Phase
- ✅ Review all tasks before starting any work
- ✅ Check dependencies - foundational work should come first
- ✅ Verify complexity estimates feel right
- ✅ Add missing tasks if you spot gaps
- ❌ Don't start working until breakdown is complete

### Working Phase
- ✅ Complete one task fully before starting next
- ✅ Follow TDD approach (Red → Green → Refactor)
- ✅ Check off acceptance criteria as you go
- ✅ Update progress log for future reference
- ❌ Don't skip tests "to save time" - they save time later

### Sync Phase
- ✅ Run sync after completing each task
- ✅ Review archived tasks - they're your progress history
- ✅ Celebrate when epic is complete!
- ❌ Don't let tasks pile up - sync regularly

---

## Troubleshooting

### Issue: "Epic is too big (15+ tasks)"
**Solution**: Split into multiple smaller epics. Each epic should be completable in 1-2 weeks.

### Issue: "Task dependencies are blocking me"
**Solution**: Work on independent tasks first, or complete blocking tasks before blocked ones.

### Issue: "Acceptance criteria unclear"
**Solution**: Update task file with clearer criteria before starting work. Better to clarify upfront.

### Issue: "Task is taking much longer than estimate"
**Solution**: Normal variation is okay. If 2x longer, consider if scope increased or complexity was underestimated.

---

## Next Steps

After completing a feature:
1. ✅ Celebrate completion!
2. ✅ Review what went well / what could improve
3. ✅ Document any decisions made: `/ctx:log-decision`
4. ✅ Plan next feature: `/ctx:epic "Next feature"`

---

## Quick Reference

| Step | Command | Output |
|------|---------|--------|
| 1. Plan | `/ctx:epic "Feature"` | Epic file in plans/ |
| 2. Breakdown | `/ctx:breakdown epic-*` | Task files in tasks/ |
| 3. Review | `/ctx:progress` | Pending tasks list |
| 4. Work | `/ctx:task [num]` | Complete task |
| 5. Sync | `/ctx:sync` | Archive & update |
| Repeat | Back to step 3 | Until all tasks done |

**Time per Feature**: Varies (2 hours to 2 weeks depending on scope)
