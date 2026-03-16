# Bug Investigation Workflow

Complete workflow for investigating and fixing bugs using the CTX plugin.

## Overview

The bug investigation workflow follows a structured approach: **Investigate → Breakdown → Task**. This ensures bugs are properly understood before attempting fixes, reducing wasted effort and preventing incomplete solutions.

## Workflow Steps

### 1. Investigate the Bug

Start with `/ctx:investigate` to create a structured investigation file:

```
/ctx:investigate
```

Claude will ask clarifying questions:

- **What's the expected behavior?** - What should happen?
- **What's the actual behavior?** - What's happening instead?
- **When did this start?** - Recent change or long-standing issue?
- **Error messages?** - Stack traces, console errors, logs
- **Steps to reproduce?** - Minimal reproduction steps
- **Environment details?** - Browser, OS, version, configuration

**Output:** Creates `.context/investigations/NNN-description.md` with:
- Symptoms and reproduction steps
- Root cause analysis
- Affected areas of codebase
- Proposed solution approach
- Related files and components

### 2. Break Down the Fix

Once investigation is complete, use `/ctx:breakdown` to create actionable tasks:

```
/ctx:breakdown investigations/NNN-description.md
```

Claude will:
- Review the investigation findings
- Identify discrete fix steps
- Create tasks with appropriate complexity
- Add dependencies if fixes must be sequential

**Output:** Creates tasks in `.context/tasks/` with clear acceptance criteria.

### 3. Execute Tasks

Work through fix tasks using `/ctx:task`:

```
/ctx:task
```

Claude will:
- Show available tasks from the investigation
- Work on highest priority task
- Run tests to verify fix
- Mark task complete when done

### 4. Verify and Close

After all fix tasks are complete:
- Run full test suite to ensure no regressions
- Update investigation status to `completed`
- Move investigation to `epic-done/`
- Update progress.md

## Example: Investigating "Checkout 500 Error"

### Step 1: Create Investigation

```
User: /ctx:investigate
Claude: I'll help investigate this issue. What's happening?
User: Users getting 500 error on checkout page
Claude: What's the expected behavior?
User: Should process payment and show confirmation
Claude: When did this start?
User: After yesterday's payment gateway update
Claude: Any error messages in logs?
User: "PaymentService: Missing API key"
```

**Created:** `.context/investigations/012-checkout-500-error.md`

```markdown
# Investigation: Checkout 500 Error

**Status:** ready
**Started:** 2026-02-11
**Reporter:** User report via support

## Symptoms

Users receive 500 error when submitting checkout form.

## Reproduction Steps

1. Add item to cart
2. Navigate to checkout
3. Fill payment form
4. Click "Complete Purchase"
5. Error: 500 Internal Server Error

## Root Cause

Payment gateway update (commit abc123) introduced new required API key configuration.
`PaymentService` constructor expects `PAYMENT_API_KEY` environment variable, but it's
not set in production.

## Affected Areas

- `apps/api/src/payment/payment.service.ts` - Reads missing env var
- `apps/api/.env.example` - Needs new variable documented
- Deployment config - Needs production secret added

## Proposed Solution

1. Add fallback/validation in PaymentService
2. Update .env.example with PAYMENT_API_KEY
3. Add production environment variable
4. Add startup check to fail fast if key missing

## Related Files

- apps/api/src/payment/payment.service.ts
- apps/api/.env.example
- apps/api/src/main.ts
```

### Step 2: Break Down Fix

```
/ctx:breakdown investigations/012-checkout-500-error.md
```

**Created Tasks:**
- `013-add-payment-api-key-validation.md` (S) - Add startup validation
- `014-update-env-example-payment-key.md` (S) - Document required variable
- `015-configure-production-payment-key.md` (S) - Add to deployment

### Step 3: Execute Tasks

```
/ctx:task
→ Works on 013-add-payment-api-key-validation.md
→ Works on 014-update-env-example-payment-key.md
→ Works on 015-configure-production-payment-key.md
```

### Step 4: Verify

```
pnpm test
pnpm build
# Deploy and verify checkout works
```

Investigation moved to `epic-done/012-checkout-500-error.md` with status `completed`.

## Tips for Effective Bug Investigation

### Be Thorough in Initial Investigation

- Gather all error messages and stack traces
- Document exact reproduction steps
- Note when the issue started (helps identify cause)
- Check recent commits/deployments
- Test in multiple environments if applicable

### Root Cause vs. Symptoms

- Don't just fix symptoms - find the underlying cause
- Ask "why" multiple times to drill down
- Consider if similar issues exist elsewhere
- Document assumptions and verify them

### Scope the Investigation

- Start narrow (specific error) then widen if needed
- If investigation reveals multiple issues, create separate investigations
- Mark investigation as `blocked` if you need information from others
- Use investigation status to track progress

### Link Related Work

- Reference related tasks or epics in investigation
- Cross-reference if bug is part of larger problem
- Update investigation as you learn more during fixes

### Archive Properly

- Only move to `epic-done/` when ALL fix tasks complete
- Update final status with outcome
- Add "Resolution" section summarizing what was done
- Keep investigation for future reference

## Common Patterns

**Quick Fix Pattern:**
- Investigation reveals trivial fix (typo, missing import)
- Create single task with complexity S
- Fix immediately, skip breakdown step

**Complex Bug Pattern:**
- Investigation reveals architectural issue
- Create epic for proper solution
- Create quick fix task as temporary workaround
- Link investigation to epic for complete resolution

**Cannot Reproduce Pattern:**
- Mark investigation status as `blocked`
- Document what you tried
- Add "Needs Info" section with questions
- Return to investigation when more data available
