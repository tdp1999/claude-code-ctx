# Investigate Skill Examples

## Bug Investigation

```
User: /ctx:investigate "Checkout fails with 500 error"

[Explore] Traces checkout flow, finds error in payment service
[test-runner] Runs payment tests - 2 failing
[Findings] Missing null check when payment provider returns error

Creates: .context/investigations/inv-checkout-500-error.md
Recommends: Add null check and proper error handling
Complexity: S
```

## Performance Investigation

```
User: /ctx:investigate "Dashboard loads slowly"

[Explore] Analyzes dashboard component and data fetching
[Findings] N+1 query problem - fetching user for each item
[Findings] No pagination on large dataset

Creates: .context/investigations/inv-dashboard-performance.md
Recommends: Add eager loading and pagination
Complexity: M
```

## Refactor Investigation

```
User: /ctx:investigate "Refactor auth module to hexagonal"

[Explore] Maps current auth structure
[Findings] Auth logic mixed with HTTP layer
[Findings] Database calls directly in controllers
[Affected] 12 files need changes

Creates: .context/investigations/inv-auth-hexagonal-refactor.md
Recommends: Phased migration - ports first, then adapters
Complexity: L
```
