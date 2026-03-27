# Domain File Template

Use this template when creating `domain.md` in Create Mode.

```markdown
# Domain: [Project Name]

## Glossary

| Term | Definition | Type |
|------|-----------|------|
| [Entity] | [Plain text definition] | [Aggregate / Entity / Value Object / Domain Event] |

## Flows

### [Flow Name]
- **Trigger:** [what business event starts this]
- **Actors:** [use exact Glossary terms]
- **Happy path:**
  1. [Step — each maps to a Domain Event or Command]
  2. [Step]
  3. [Step]
- **Variations:**
  - [Name]: [how it differs from happy path]
- **Error paths:**
  - [Condition]: [what happens]
- **End states:** [possible outcomes]

## Rules

### [Entity/Aggregate Name]
- [ABC-001]: [Rule in plain text]
- [ABC-002]: [Rule in plain text]

## Invariants
- [Cross-entity constraint that must always hold]

## Edge Cases
- **[Scenario]:** [Expected behavior]

## Changelog
- [YYYY-MM-DD] Created — initial domain model
```

## Template Guidance

- **Glossary Type column:** Use DDD types — Aggregate (root entity that owns a cluster), Entity (has identity), Value Object (defined by attributes, no identity), Domain Event (something that happened)
- **Rule IDs:** 3-letter entity code + dash + 3-digit number. E.g., `ORD-001`, `PAY-002`, `CPN-003`. These IDs are referenced by epics, tasks, and acceptance criteria for traceability.
- **Flow steps:** Each step should pass the "change UI test" — if you swap web for mobile, the step still makes sense. Bad: "Customer clicks checkout button". Good: "Customer initiates Checkout from Cart".

## Module File Template

Use when creating per-module files in `domain/` folder (Split/Module mode).

```markdown
# [Module Name] Domain

## Dependencies
- **Reads from:** [modules this one queries or depends on]
- **Triggers:** [modules this one sends events/commands to]

## Flows

### [Flow Name]
- **Trigger:** [business event]
- **Actors:** [entities involved]
- **Happy path:**
  1. [Step]
- **Variations:**
  - [Name]: [difference]
- **Error paths:**
  - [Condition]: [behavior]
- **End states:** [outcomes]

## Rules

### [Entity Name]
- [MOD-001]: [Rule]

## Edge Cases
- **[Scenario]:** [Behavior]

## Changelog
- [YYYY-MM-DD] Created
```
