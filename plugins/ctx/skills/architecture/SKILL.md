---
name: architecture
description: Define or update architectural patterns, boundaries, and layers. Outputs to patterns.md. Reusable across BE, FE, DevOps, any language. Supports extract mode for existing projects.
argument-hint: "[optional: --add-module <name> | --add-domain <name> | --extract]"
allowed-tools: Read, Write, Edit, AskUserQuestion, Skill, Glob, Task
---

# Architecture

Define or update the project's architectural patterns, boundaries, and layers.

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

This skill uses:
- **Explore** (built-in) - For extract mode (analyzing folder structure, detecting patterns)

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.
See `../../shared/conventions/file-contracts.md` for required output sections.

Skill-specific errors:
- **Missing `vision.md` (create mode)**: Warn that architecture choices won't be informed by project context. Suggest `/ctx:vision` first, but allow proceeding.
- **`--add-module` or `--add-domain` but no `patterns-architecture.md`**: Cannot add to non-existent file. Suggest running `/ctx:architecture` (create mode) first.

## Input

`$ARGUMENTS` can be:
- Empty: Full wizard or update existing
- `--add-module <name>`: Add new module to existing architecture
- `--add-domain <name>`: Add new domain to existing architecture
- `--extract`: Extract architecture from existing project

## Step 1: Detect Mode

Check if `.context/patterns-architecture.md` exists:
- **If `--extract` flag:** Enter **Extract Mode** (for existing projects)
- **If exists:** Enter **Update Mode**
- **If not exists:** Enter **Create Mode**

---

## Create Mode

Use when no patterns-architecture.md exists (new project).

### Questions

Ask conversationally. Adjust based on project type (some may not need both BE and FE):

| ID | Question | Options |
|----|----------|---------|
| A-1 | Backend architecture style? | hexagonal, clean, layered, modular-monolith, microservices, none |
| A-2 | Frontend architecture? | feature-modules, atomic-design, container-presenter, flat, none |
| A-3 | Domain approach? | DDD, CRUD, event-driven, hybrid |
| A-4 | API style? | REST, GraphQL, tRPC, gRPC, mixed |
| A-5 | Module communication? | direct-import, event-bus, API-calls, message-queue |

### Additional Context

For each choice, explain:
- **Hexagonal:** Ports and adapters, domain at center, infrastructure pluggable
- **Clean:** Layers with dependency rule (inner layers don't know outer)
- **Layered:** Traditional N-tier (presentation, business, data)
- **Feature-modules:** Organize by feature, not by type (all auth code together)
- **Atomic-design:** Atoms → Molecules → Organisms → Templates → Pages
- **DDD:** Domain-driven, bounded contexts, aggregates, entities, value objects

### Output

Create `.context/patterns-architecture.md`:

```markdown
# Project Patterns

> This file contains both architectural decisions and code patterns.

## Architecture

### Backend
- **Style:** [hexagonal/clean/layered/microservices/etc]
- **Layers:** [list layers, e.g., domain, application, infrastructure, presentation]
- **Pattern:** [e.g., ports-and-adapters, dependency injection]
- **Domain Approach:** [DDD/CRUD/event-driven]

### Frontend
- **Style:** [feature-modules/atomic-design/etc]
- **Pattern:** [e.g., smart-dumb-components, container-presenter]
- **State Management:** [to be determined or specified]

### Boundaries
- **API Style:** [REST/GraphQL/tRPC/etc]
- **Module Communication:** [direct-import/event-bus/API-calls/etc]

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
```

After creating, summarize the architectural decisions made.

---

## Update Mode

Use when patterns-architecture.md already exists.

### Detect Update Type

1. **If `--add-module <name>`:**
   - Ask about the module's responsibility
   - Ask which layer/domain it belongs to
   - Ask about dependencies on other modules
   - Add to Modules section

2. **If `--add-domain <name>`:**
   - Ask about the domain's boundaries
   - Ask about entities and aggregates
   - Ask about related modules
   - Add to Domains section

3. **If no flags (general update):**
   - Read and display current architecture
   - Ask: What's changing?
   - Ask: **Why** are you making this change?
   - Identify impacts

### General Update Process

1. **Read and display current architecture:**
   - Show Backend, Frontend, Boundaries sections

2. **Ask update questions:**
   - What's changing in the architecture?
   - **Why** are you making this change? (critical for decision logging)
   - Which modules/domains are affected?
   - Which code needs refactoring?

3. **Identify impacts:**
   - Check `.context/vision.md` for alignment
   - Check `.context/plans/` for epics that may need updating
   - Check `.context/tasks/` for tasks that may be blocked
   - Check existing code structure

4. **Update patterns-architecture.md:**
   - Update the changed sections
   - Add a Changelog entry in Architecture section:

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

5. **Trigger `/ctx:log-decision`:**
   - Automatically call the log-decision skill
   - Pass the change details and user's rationale
   - This creates an ADR entry in decisions.md

6. **Suggest follow-up actions:**
   - List modules that need refactoring
   - List tasks that may be affected
   - Suggest creating new tasks for architectural changes

---

## Add Module Mode

When called with `--add-module <name>`:

### Questions

- What is this module's responsibility?
- Which layer does it belong to? (domain/application/infrastructure/presentation)
- Does it belong to a specific domain?
- What are its dependencies? (other modules it needs)
- What does it expose? (what other modules can use from it)

### Output

Add to Modules section in patterns-architecture.md:

```markdown
### Modules

#### <module-name>
- **Layer:** [domain/application/infrastructure/presentation]
- **Domain:** [if applicable]
- **Responsibility:** [what it does]
- **Dependencies:** [other modules]
- **Exports:** [public interface]
- **Added:** [YYYY-MM-DD]
```

---

## Add Domain Mode

When called with `--add-domain <name>`:

### Questions

- What are the boundaries of this domain?
- What are the key entities/aggregates?
- How does it relate to other domains?
- What events does it emit?
- What events does it consume?

### Output

Add to Domains section in patterns-architecture.md:

```markdown
### Domains

#### <domain-name>
- **Boundaries:** [what's in, what's out]
- **Key Entities:** [main domain objects]
- **Related Domains:** [dependencies]
- **Events Emitted:** [domain events it publishes]
- **Events Consumed:** [domain events it listens to]
- **Added:** [YYYY-MM-DD]
```

---

## Extract Mode

Use when onboarding an existing project (`--extract` flag or called from `/ctx:onboard`).

### Process

1. **Use Explore subagent to analyze code structure:**

**Prompt for Explore:**
```
Analyze this codebase and detect architectural patterns:

1. Folder structure analysis:
   - Look for: src/modules/, src/domain/, src/application/, src/infrastructure/
   - Look for: src/features/, components/atoms/, components/molecules/
   - Look for: apps/, libs/, packages/ (monorepo indicators)
   - Backend organization patterns
   - Frontend organization patterns

2. File naming patterns:
   - *.controller.ts, *.resolver.ts → API style
   - *.service.ts, *.repository.ts → layering
   - *.usecase.ts, *.port.ts, *.adapter.ts → clean/hexagonal
   - *.component.tsx, *.container.tsx → component patterns

3. Import analysis:
   - Check dependency directions
   - Identify layer violations
   - Detect module boundaries

4. Configuration files:
   - nx.json, turbo.json → monorepo type
   - Module structure configs

Report detected patterns with confidence level.
```

2. **Present findings to user:**

```markdown
Based on code analysis, detected architecture:

**Backend:**
- Style: [hexagonal / layered / modular / unclear] (confidence: high/medium/low)
- Evidence: [folder patterns found, file naming conventions]
- Layers detected: [list]

**Frontend:**
- Style: [feature-modules / atomic-design / flat / unclear] (confidence: high/medium/low)
- Evidence: [folder structure, component organization]

**Boundaries:**
- API style: [REST / GraphQL / mixed] (detected from *.controller.ts / *.resolver.ts)
- Module communication: [inferred from imports]

**Inconsistencies found:**
- [Note any mixed patterns or violations]

Is this correct? What should I adjust?
```

3. **Create patterns-architecture.md with confirmed data:**
   - Use user's corrections
   - Note detected vs. aspirational patterns
   - Add note: "Extracted from existing codebase on [date]"
   - Include "Inconsistencies" section if patterns are mixed

---

## Examples

### Create Mode Example

```
User: /ctx:architecture

Assistant asks about backend style, frontend style, domain approach, etc.

User chooses: Hexagonal backend, Feature-modules frontend, DDD approach

Creates .context/patterns-architecture.md with these decisions.
```

### Update Mode Example

```
User: /ctx:architecture

Assistant detects existing patterns-architecture.md, shows current architecture.

Assistant asks: What's changing? Why?

User: "Moving from monolith to microservices because we need to scale teams independently"

Assistant updates patterns-architecture.md, adds changelog, triggers /ctx:log-decision, identifies affected modules.
```

### Add Module Example

```
User: /ctx:architecture --add-module payments

Assistant asks: Responsibility? Layer? Dependencies?

User provides details.

Assistant adds payments module to Modules section in patterns-architecture.md.
```

### Add Domain Example

```
User: /ctx:architecture --add-domain billing

Assistant asks: Boundaries? Entities? Events?

User provides details.

Assistant adds billing domain to Domains section in patterns-architecture.md.
```

### Extract Mode Example

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

---

## Tips

- This skill is language-agnostic - works for any tech stack
- In create mode, explain architectural patterns when user is unsure
- In update mode, always ask "why" for decision logging
- Module and domain modes are additive - they append, not replace
- Architectural changes should trigger code refactoring tasks
- Keep patterns-architecture.md as the single source of truth for both architecture and code patterns
