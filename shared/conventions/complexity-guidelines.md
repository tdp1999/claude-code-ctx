# Task Complexity Guidelines

Standard guidelines for estimating and assigning task complexity in the CTX plugin.

## Complexity Levels

| Size | Lines Changed | Files | Time | Clarity | When to Use |
|------|--------------|-------|------|---------|-------------|
| **S** | < 50 | 1 | < 1 hour | Clear path | Simple fixes, config changes, small additions |
| **M** | 50-200 | 2-3 | 1-3 hours | Straightforward | Feature additions, refactors, bug fixes |
| **L** | 200-500 | 3-8 | 3-8 hours | Some unknowns | Multi-component features, migrations |
| **XL** | 500+ | Many | > 8 hours | Research needed | Consider epic or breakdown |

## Size S (Small)

**Characteristics:**
- Single file change
- Less than 50 lines modified
- Clear implementation path
- No dependencies on other tasks
- Can be completed in under 1 hour
- No research required

**Examples:**

```markdown
✅ 042-fix-typo-welcome-message.md
- Change "Welcom" to "Welcome" in header component
- Lines: ~5
- Files: 1 (header.component.html)

✅ 043-add-env-variable-docs.md
- Document new API_URL variable in .env.example
- Lines: ~10
- Files: 1 (.env.example)

✅ 044-update-button-color.md
- Change primary button color from blue to green
- Lines: ~15
- Files: 1 (variables.scss)

✅ 045-remove-console-logs.md
- Remove debug console.log statements
- Lines: ~20
- Files: 1 (auth.service.ts)
```

**When to use S:**
- Configuration changes
- Documentation updates
- Simple bug fixes (typos, off-by-one errors)
- Removing dead code
- Adding comments
- Updating constants

## Size M (Medium)

**Characteristics:**
- Changes span 2-3 files
- 50-200 lines modified
- Straightforward implementation
- May have 1-2 task dependencies
- Can be completed in 1-3 hours
- Minimal research needed

**Examples:**

```markdown
✅ 046-add-logout-button.md
- Add logout button to header
- Wire up to auth service
- Update route guard
- Lines: ~80
- Files: 2 (header.component.ts, header.component.html)

✅ 047-fix-validation-user-form.md
- Add email format validation
- Add password strength check
- Update error messages
- Lines: ~120
- Files: 2 (user-form.component.ts, validation.util.ts)

✅ 048-refactor-date-formatting.md
- Extract date logic to utility
- Replace inline formatting
- Add unit tests
- Lines: ~150
- Files: 3 (date.util.ts, order.component.ts, profile.component.ts)

✅ 049-add-loading-spinner.md
- Create spinner component
- Add to button component
- Update existing buttons
- Lines: ~100
- Files: 3 (spinner.component.ts, button.component.ts, button.component.html)
```

**When to use M:**
- New components (simple)
- Service methods
- Form additions
- Straightforward refactors
- Bug fixes requiring logic changes
- Adding tests for existing code

## Size L (Large)

**Characteristics:**
- Changes span 3-8 files
- 200-500 lines modified
- Multiple related components
- May have several dependencies
- Can be completed in 3-8 hours
- Some unknowns or edge cases

**Examples:**

```markdown
✅ 050-add-user-settings-page.md
- Create settings page component
- Add settings form with validation
- Create settings service
- Add route and navigation
- Wire up to API
- Add unit tests
- Lines: ~350
- Files: 6 (component, service, routing, 3 test files)

✅ 051-migrate-jest-vitest.md
- Update package.json dependencies
- Create vitest.config.ts
- Update all test imports
- Fix incompatible assertions
- Update CI pipeline
- Lines: ~400
- Files: 8 (config, package.json, 6 test files)

✅ 052-implement-pagination-users.md
- Add pagination to user list component
- Update user service with page params
- Update backend endpoint
- Add page controls component
- Handle edge cases
- Add tests
- Lines: ~450
- Files: 7 (FE component, FE service, BE controller, BE service, tests)
```

**When to use L:**
- Full feature implementation (cross-layer)
- Significant refactors
- Multi-step migrations
- Complex bug fixes
- Integration between systems
- Performance optimizations

## Size XL (Extra Large)

**Characteristics:**
- Changes span many files (8+)
- 500+ lines modified
- Significant scope
- Many dependencies
- Requires more than 8 hours
- Substantial unknowns or research

**Warning:** XL tasks are often better as epics or should be broken down.

**Examples:**

```markdown
⚠️ 053-upgrade-angular-18.md
- Update all Angular packages
- Migrate to standalone components
- Remove NgModules
- Update routing
- Fix breaking changes
- Update tests
- Lines: ~2000+
- Files: 50+
→ BETTER AS EPIC: Break into multiple M/L tasks

⚠️ 054-implement-real-time-chat.md
- Add WebSocket server
- Create chat UI components
- Implement message storage
- Add presence system
- Handle reconnection
- Add E2E tests
- Lines: ~1500+
- Files: 20+
→ BETTER AS EPIC: Break into socket setup, UI, storage, etc.

✅ 055-refactor-monolith-microservices.md
→ DEFINITELY AN EPIC: This is multi-week initiative
```

**When to use XL:**
- Very rarely
- Only if task truly cannot be broken down
- Document why it's XL in task description
- Consider if it should be an epic instead

**Better approach:** Create an epic and break into smaller tasks.

## Estimation Tips

### Consider All Aspects

**Not just code writing:**
- Research/investigation time
- Test writing time
- Documentation updates
- Code review iterations
- Debugging time
- Edge case handling

**Example:**

```markdown
"Add login validation" might seem S, but:
- Research validation rules: 15 min
- Implement validation: 30 min
- Write unit tests: 20 min
- Test edge cases: 15 min
- Update docs: 10 min
→ Total: ~90 min = M, not S
```

### File Count Rule of Thumb

- 1 file = likely S
- 2-3 files = likely M
- 4-8 files = likely L
- 8+ files = likely XL (consider epic)

**Exception:** Many trivial changes across files:
```markdown
✅ update-copyright-year.md
- Update year in 15 files
→ Still S (simple find/replace)
```

### Dependency Complexity

**No dependencies:**
- Independent task
- Can work immediately
- Usually simpler

**Has dependencies:**
- Must wait for other tasks
- May need integration work
- Usually more complex

```markdown
042-add-user-repository.md (M)
  ↓ blocks
043-add-user-service.md (M)
  ↓ blocks
044-add-user-controller.md (M)
  ↓ blocks
045-add-user-ui.md (L)
```

### Unknown Factor

**Clear path:** Stick with estimate

**Some unknowns:** Add one size level
- S with unknowns → M
- M with unknowns → L

**Many unknowns:** Create investigation first
```markdown
❌ 046-fix-weird-memory-issue.md (???)
✅ 046-investigate-memory-issue.md (S/M)
   → Then create fix tasks based on findings
```

## When to Split Tasks

### Signs Task Should Be Split

- Estimate is XL
- Task description has many "and" clauses
- Task spans multiple architectural layers
- Task touches unrelated features
- Can't estimate complexity confidently
- Task will take multiple days

### Splitting Strategies

**By Layer:**
```markdown
❌ 050-add-user-crud.md (XL)

✅ Split:
  050-add-user-backend-api.md (L)
  051-add-user-frontend-ui.md (L)
```

**By Feature:**
```markdown
❌ 052-improve-search.md (XL)

✅ Split:
  052-add-search-filters.md (M)
  053-add-search-sorting.md (M)
  054-add-search-pagination.md (M)
```

**By Phase:**
```markdown
❌ 055-migrate-database.md (XL)

✅ Split:
  055-setup-new-db-schema.md (L)
  056-migrate-user-data.md (M)
  057-migrate-order-data.md (M)
  058-cutover-to-new-db.md (M)
```

### When NOT to Split

**Keep together if:**
- Splitting creates artificial boundaries
- Sub-tasks aren't independently valuable
- Overhead of coordination > benefit of splitting

```markdown
✅ 060-add-logout-endpoint.md (M)
  - Add endpoint
  - Add tests
  - Update docs
→ Keep together (all part of same feature)

❌ Don't split into:
  060-add-logout-endpoint.md (S)
  061-test-logout-endpoint.md (S)
  062-document-logout-endpoint.md (S)
→ Too granular, more overhead
```

## Complexity by Task Type

### Bug Fixes

- **S:** Typo, config error, simple logic fix
- **M:** Validation logic, error handling, refactor needed
- **L:** Complex race condition, multi-layer bug, requires investigation
- **XL:** Architectural flaw (make it an epic)

### Feature Additions

- **S:** Simple UI element, config option
- **M:** New component, service method, form field
- **L:** Complete page, cross-layer feature
- **XL:** Major feature (make it an epic)

### Refactoring

- **S:** Rename variable, extract function
- **M:** Extract class, reorganize module
- **L:** Restructure package, pattern migration
- **XL:** Architecture change (make it an epic)

### Testing

- **S:** Add missing test for one function
- **M:** Add test suite for one component
- **L:** Add integration tests for feature
- **XL:** Setup new testing framework (make it an epic)

## Checklist

When estimating complexity:

- [ ] Counted files to be changed
- [ ] Estimated lines of code
- [ ] Considered test writing time
- [ ] Factored in research/unknowns
- [ ] Checked for dependencies
- [ ] Verified task is independently valuable
- [ ] Confirmed estimate feels realistic
- [ ] If XL, considered epic or breakdown

## Common Mistakes

❌ **Under-estimating:**
- Forgetting test time
- Not accounting for edge cases
- Ignoring documentation
- Assuming everything will work first try

❌ **Over-estimating:**
- Counting boilerplate as complexity
- Including time for unrelated tasks
- Padding estimates excessively

❌ **Wrong granularity:**
- Tasks too small (overhead > value)
- Tasks too large (should be epic)

✅ **Right-sizing:**
- Task is independently completable
- Estimate reflects actual work
- Complexity matches team capability
- Size enables good planning
