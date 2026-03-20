# Domain: [Project Name]

## Glossary

| Term | Definition | Type |
|------|-----------|------|
<!-- Type: Aggregate, Entity, Value Object, Domain Event -->
<!-- Capitalize all domain terms consistently -->

## Flows

### [Flow Name]
- **Trigger:** [what business event starts this]
- **Actors:** [use exact Glossary terms]
- **Happy path:**
  1. [Step — maps to a Domain Event or Command]
  2. [Step]
  3. [Step]
- **Variations:**
  - [Name]: [how it differs from happy path]
- **Error paths:**
  - [Condition]: [what happens]
- **End states:** [possible outcomes]

## Rules

### [Entity/Aggregate Name]
- [ABC-001]: [Rule in plain text — verifiable yes/no]
- [ABC-002]: [Rule in plain text]

## Invariants
- [Cross-entity constraint that must always hold]

## Edge Cases
- **[Scenario]:** [Expected behavior]

## Changelog
- [YYYY-MM-DD] Created — initial domain model
