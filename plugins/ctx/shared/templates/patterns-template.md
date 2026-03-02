# Patterns Template

This template is used for creating the architecture and code patterns file at `.context/patterns-architecture.md`. This file contains both architectural decisions and code patterns.

---

# Project Patterns

> This file contains both architectural decisions and code patterns.

## Architecture

### Backend
- **Style:** [hexagonal/clean/layered/microservices/modular-monolith/none]
- **Layers:** [list layers, e.g., domain, application, infrastructure, presentation]
- **Pattern:** [e.g., ports-and-adapters, dependency injection]
- **Domain Approach:** [DDD/CRUD/event-driven/hybrid]

### Frontend
- **Style:** [feature-modules/atomic-design/container-presenter/flat/none]
- **Pattern:** [e.g., smart-dumb-components, container-presenter]
- **State Management:** [to be determined or specified]

### Boundaries
- **API Style:** [REST/GraphQL/tRPC/gRPC/mixed]
- **Module Communication:** [direct-import/event-bus/API-calls/message-queue]

### Modules
<!-- Modules will be added as project develops -->

### Domains
<!-- Domains will be defined after features are planned -->

## Code Patterns
<!-- Add as project evolves -->

## Naming Conventions
<!-- Add as project evolves -->

## File Organization
<!-- Derived from architecture above -->

---

## Usage Notes

**Architecture Style Definitions:**

**Backend Styles:**
- `hexagonal` - Ports and adapters, domain at center, infrastructure pluggable
- `clean` - Layers with dependency rule (inner layers don't know outer)
- `layered` - Traditional N-tier (presentation, business, data)
- `modular-monolith` - Monolith organized into independent modules
- `microservices` - Distributed services with clear boundaries

**Frontend Styles:**
- `feature-modules` - Organize by feature, not by type (all auth code together)
- `atomic-design` - Atoms → Molecules → Organisms → Templates → Pages
- `container-presenter` - Smart containers, dumb presenters
- `flat` - Minimal organization structure

**Domain Approaches:**
- `DDD` - Domain-driven design with bounded contexts, aggregates, entities
- `CRUD` - Simple create/read/update/delete operations
- `event-driven` - Event sourcing and CQRS patterns
- `hybrid` - Mix of approaches based on module needs

**Adding Modules:**
```markdown
#### <module-name>
- **Layer:** [domain/application/infrastructure/presentation]
- **Domain:** [if applicable]
- **Responsibility:** [what it does]
- **Dependencies:** [other modules]
- **Exports:** [public interface]
- **Added:** [YYYY-MM-DD]
```

**Adding Domains:**
```markdown
#### <domain-name>
- **Boundaries:** [what's in, what's out]
- **Key Entities:** [main domain objects]
- **Related Domains:** [dependencies]
- **Events Emitted:** [domain events it publishes]
- **Events Consumed:** [domain events it listens to]
- **Added:** [YYYY-MM-DD]
```

**When updating architecture:**
Add a changelog entry:

```markdown
### Architecture Changelog

#### [YYYY-MM-DD] Change Title
- Changed: [what changed]
- From: [old approach]
- To: [new approach]
- Reason: [why - from user's answer]
- Impact: [affected modules/domains/code]
- Decision: See decisions.md [YYYY-MM-DD]
```

**Extraction Note:**
When extracted from existing project, add:
```markdown
---
*Extracted from existing codebase on [YYYY-MM-DD]*

**Inconsistencies found:**
- [Note any mixed patterns or violations]
```
