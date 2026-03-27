# Architecture Skill Examples

## Create Mode

```
User: /ctx:architecture

Assistant asks about backend style, frontend style, domain approach, etc.

User chooses: Hexagonal backend, Feature-modules frontend, DDD approach

Creates .context/patterns-architecture.md with these decisions.
```

## Update Mode

```
User: /ctx:architecture

Assistant detects existing patterns-architecture.md, shows current architecture.

Assistant asks: What's changing? Why?

User: "Moving from monolith to microservices because we need to scale teams independently"

Assistant updates patterns-architecture.md, adds changelog, triggers /ctx:log-decision, identifies affected modules.
```

## Add Module

```
User: /ctx:architecture --add-module payments

Assistant asks: Responsibility? Layer? Dependencies?

User provides details.

Assistant adds payments module to Modules section in patterns-architecture.md.
```

## Add Domain

```
User: /ctx:architecture --add-domain billing

Assistant asks: Boundaries? Entities? Events?

User provides details.

Assistant adds billing domain to Domains section in patterns-architecture.md.
```

## Extract Mode

```
User: /ctx:architecture --extract

[Explore] Analyzes folder structure, file naming, imports
[Findings] Hexagonal backend (src/domain/, src/application/, src/infrastructure/)
[Findings] Feature-modules frontend (src/features/auth/, src/features/dashboard/)
[Findings] Mixed API styles (mostly REST, some GraphQL resolvers in legacy code)

[Presents] Detected patterns with confidence levels and inconsistencies

User confirms: "Yes, we're migrating from GraphQL to REST"

Creates .context/patterns-architecture.md with findings + migration note.
```
