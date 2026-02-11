# Task Naming Conventions

Standard conventions for naming task files in the CTX plugin.

## File Naming Format

```
NNN-verb-subject-context.md
```

**Components:**
- **NNN** - Three-digit sequential number (001, 002, 003...)
- **verb** - Action word (fix, add, update, investigate, refactor, remove)
- **subject** - What you're acting on (component, feature, bug)
- **context** - Additional specificity if needed

## Numbering Rules

### Sequential Numbering

- Start at 001, increment for each new task
- Never skip numbers
- Never reuse numbers
- Continue sequence even after archiving tasks

**Example sequence:**
```
001-setup-project-structure.md
002-add-auth-module.md
003-fix-login-validation.md
004-update-user-model.md      ← Next task
```

After archiving 001-003 to `tasks-done/`:
```
tasks/
  004-update-user-model.md
  005-add-password-reset.md    ← Still continues sequence

tasks-done/
  001-setup-project-structure.md
  002-add-auth-module.md
  003-fix-login-validation.md
```

### Finding Next Number

Check last task in both directories:
```bash
# Last active task
ls .context/tasks/ | tail -1
# 042-fix-header-styles.md

# Last archived task
ls .context/tasks-done/ | tail -1
# 041-add-footer-component.md

# Next task number: 043
```

## Name Length Guidelines

**Keep names concise (3-5 words):**

✅ **Good:**
- `042-fix-login-validation.md`
- `043-add-user-dashboard.md`
- `044-update-api-docs.md`
- `045-refactor-auth-service.md`

❌ **Too Long:**
- `042-fix-the-bug-with-login-validation-error.md`
- `043-add-new-user-dashboard-with-charts.md`

**Guideline:** If the name needs more than 5 words, either:
- Make it more concise, OR
- The task might be too large (consider splitting)

## Verb Conventions

### Standard Verbs

| Verb | Use Case | Example |
|------|----------|---------|
| `add` | New feature/component | `015-add-search-filter.md` |
| `fix` | Bug fixes | `016-fix-null-pointer-error.md` |
| `update` | Modify existing feature | `017-update-user-profile-ui.md` |
| `refactor` | Code improvement | `018-refactor-payment-service.md` |
| `remove` | Delete feature/code | `019-remove-deprecated-api.md` |
| `investigate` | Research/analysis | `020-investigate-slow-queries.md` |
| `migrate` | Move/upgrade | `021-migrate-postgres-15.md` |
| `implement` | Build from spec | `022-implement-oauth-flow.md` |
| `configure` | Setup/config | `023-configure-ci-pipeline.md` |
| `document` | Add documentation | `024-document-api-endpoints.md` |

### Choosing the Right Verb

**Add vs. Update:**
- `add` - Wholly new feature that doesn't exist
- `update` - Enhancement to existing feature

```
✅ add-user-settings-page.md      (settings page doesn't exist yet)
✅ update-user-settings-layout.md (settings page exists, changing it)
```

**Fix vs. Refactor:**
- `fix` - Resolving incorrect behavior (bug)
- `refactor` - Improving code without changing behavior

```
✅ fix-checkout-calculation.md    (calculation is wrong)
✅ refactor-checkout-service.md   (code works but needs improvement)
```

**Investigate vs. Fix:**
- `investigate` - Don't know root cause yet
- `fix` - Know the problem and solution

```
✅ investigate-memory-leak.md     (exploring the issue)
✅ fix-subscription-memory-leak.md (know the cause, implementing fix)
```

## Subject Guidelines

### Be Specific

❌ **Too vague:**
- `042-fix-bug.md`
- `043-update-component.md`
- `044-add-feature.md`

✅ **Specific:**
- `042-fix-login-timeout.md`
- `043-update-header-component.md`
- `044-add-export-csv-feature.md`

### Use Domain Language

Use terms from your codebase:

```
✅ add-product-repository.md      (if you use repository pattern)
✅ update-order-aggregate.md      (if you use DDD)
✅ fix-cart-reducer.md            (if you use Redux/NgRx)
```

### Avoid Redundancy

❌ **Redundant:**
- `fix-bug-in-login.md` (fix implies bug)
- `add-new-feature-search.md` (add implies new)
- `update-existing-header.md` (update implies existing)

✅ **Concise:**
- `fix-login-timeout.md`
- `add-search-feature.md`
- `update-header-layout.md`

## Context Addition

Add context when subject alone is ambiguous:

```
✅ add-button-component.md        (if only one button component)
✅ add-button-landing-page.md     (if buttons exist, specifying location)

✅ fix-validation.md              (if obvious which validation)
✅ fix-validation-user-form.md    (if multiple validation areas)
```

## Special Cases

### Epic Tasks

Tasks created from epic breakdown may include epic reference:

```
Epic: 001-user-authentication.md

Generated tasks:
  010-add-login-endpoint.md
  011-add-jwt-service.md
  012-add-auth-guard.md
  013-add-login-ui.md
```

**Don't include epic number in task name:**
- ❌ `010-epic-001-add-login-endpoint.md`
- ✅ `010-add-login-endpoint.md`

(Epic link is in task metadata, not filename)

### Investigation Tasks

Tasks from investigations follow same rules:

```
Investigation: 005-checkout-500-error.md

Generated tasks:
  020-add-payment-validation.md
  021-update-env-example.md
  022-configure-prod-secrets.md
```

### Sub-tasks

If you manually split a task:

```
Original: 030-migrate-angular-18.md (too large)

Split into:
  030-migrate-angular-18-deps.md
  031-migrate-angular-18-standalone.md
  032-migrate-angular-18-tests.md
```

**Alternative:** Use epic instead for large initiatives.

## Examples by Domain

### Frontend Tasks

```
025-add-user-profile-component.md
026-fix-header-responsive-layout.md
027-update-theme-colors.md
028-refactor-form-validation.md
029-remove-deprecated-modal.md
```

### Backend Tasks

```
030-add-payment-endpoint.md
031-fix-race-condition-orders.md
032-update-user-schema.md
033-refactor-auth-middleware.md
034-remove-legacy-api-v1.md
```

### Infrastructure Tasks

```
035-configure-docker-compose.md
036-add-redis-cache.md
037-fix-ci-pipeline-timeout.md
038-update-nginx-config.md
039-migrate-postgres-15.md
```

### Testing Tasks

```
040-add-unit-tests-auth.md
041-fix-flaky-checkout-test.md
042-update-e2e-test-suite.md
043-add-integration-tests-api.md
```

## Checklist

Before creating a task file, verify:

- [ ] Number is next in sequence (check tasks/ and tasks-done/)
- [ ] Name is 3-5 words (excluding number)
- [ ] Verb is appropriate for the work type
- [ ] Subject is specific to your codebase
- [ ] Context added if subject is ambiguous
- [ ] Name uses lowercase with hyphens
- [ ] Name ends with .md extension

## Anti-Patterns

❌ **Avoid these patterns:**

```
042-task.md                           (no description)
bug-fix.md                            (missing number)
43-fix-login.md                       (only 2 digits)
042_fix_login.md                      (underscores instead of hyphens)
042-Fix-Login.md                      (mixed case)
042-fixing-login-bug.md               (present participle verb)
042-fixed-login-bug.md                (past tense verb)
042-login-bug-fix.md                  (noun instead of verb-first)
042-fix-the-login-bug.md              (unnecessary article "the")
042-fix-login-bug-from-yesterday.md   (temporal context doesn't belong)
```

✅ **Correct format:**
```
042-fix-login-validation.md
```
