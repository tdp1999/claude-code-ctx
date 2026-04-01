---
name: epic
description: Plan a feature as an epic with requirements, risks, and scope. Triggers on "epic", "plan feature", "new feature", "feature idea", "I want to build", "let's plan". Use when user describes a feature to implement, even without saying "epic". For breaking into tasks, use /ctx:breakdown after.
argument-hint: "[feature idea or epic file path]"
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion, Task
---

# Epic Generator

Generate or update epic-style feature files with high-level requirements. Acts as a mini plan-mode to expand ideas and foresee problems.

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

This skill uses:
- **Explore** (built-in) - For understanding existing code context and related features

**When to use Explore:**
- When epic relates to existing features (e.g., "Extend authentication with 2FA")
- When need to understand how something currently works
- When foresee technical considerations require code analysis

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.
See `../../shared/conventions/file-contracts.md` for required output sections.

Skill-specific errors:
- **Missing `vision.md`**: Warn user that epic will lack project context. Suggest running `/ctx:vision` first, but allow proceeding if user confirms.
- **Missing `patterns-architecture.md`**: Warn that Technical Considerations section will be generic. Suggest running `/ctx:architecture` first.
- **`.context/plans/` doesn't exist**: Suggest running `/ctx:context-init` first
- **Epic file already exists with same name**: Ask user — update existing or create with different name?

## Input

`$ARGUMENTS` can be:
- A feature idea: `/ctx:epic "User authentication"`
- A file path: `/ctx:epic .context/plans/epic-auth.md` (update existing)
- Empty: Ask user what feature to plan

## Step 1: Determine Mode

- **If file path provided:** Enter **Update Mode**
- **If feature idea or empty:** Enter **Create Mode**

---

## Create Mode

Use when creating a new epic from an idea.

### Process

1. **Understand the idea:**
   - Read `.context/vision.md` for project context
   - Read `.context/patterns-architecture.md` for architecture constraints
   - Read `.context/domain.md` for existing business logic, flows, and rules (if exists)
   - If user provided idea in `$ARGUMENTS`, use it
   - If empty, ask: "What feature would you like to plan?"

2. **Expand the idea (mini plan-mode):**

   Ask clarifying questions:
   - What problem does this solve?
   - Who benefits from this feature?
   - What's in scope? What's out of scope?
   - Any specific requirements or constraints?

3. **Improve and foresee:**

   **Suggest improvements:**
   - "Have you considered [alternative approach]?"
   - "This could also support [related use case]"
   - "A simpler MVP version might be [suggestion]"

   **Warn about risks:**
   - "This might conflict with [existing feature/architecture]"
   - "Common pitfall: [error-prone area]"
   - "Be careful with [security/performance/scalability concern]"
   - "This will require [dependency/prerequisite]"

4. **Identify technical considerations:**
   - Based on patterns-architecture.md architecture
   - Integration points with existing features
   - Required infrastructure or services
   - Testing strategy

5. **Generate epic file:**
   - Create descriptive filename: `epic-<kebab-case-name>.md`
   - Save to `.context/plans/`

### Epic File Template

```markdown
# Epic: [Feature Name]

## Summary
[One paragraph describing the feature]

## Why
[Problem this solves, value it provides]

## Target Users
[Who will use this feature]

## Scope

### In Scope
- [Specific feature/capability 1]
- [Specific feature/capability 2]
- [Specific feature/capability 3]

### Out of Scope
- [What's NOT included - save for future]
- [Excluded to keep MVP focused]

## High-Level Requirements

1. [Requirement 1 - specific, testable]
2. [Requirement 2]
3. [Requirement 3]
4. [etc.]

## Technical Considerations

### Architecture
- [How this fits into existing architecture from patterns-architecture.md]
- [Modules/domains involved]
- [Integration points]

### Dependencies
- [Other features this depends on]
- [External services needed]
- [Infrastructure requirements]

### Data Model
- [Key entities/tables needed]
- [Relationships]

## Risks & Warnings

⚠️ **[Risk Category]**
- [Specific risk or error-prone area]
- [Mitigation or recommendation]

⚠️ **[Another Risk]**
- [Description]
- [How to avoid]

## Alternatives Considered

### [Alternative Approach 1]
- **Pros:** [benefits]
- **Cons:** [drawbacks]
- **Why not chosen:** [reasoning]

## Success Criteria

- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
- [ ] [Measurable outcome 3]

## Estimated Complexity
[S / M / L / XL]

**Reasoning:** [Why this complexity estimate]

## Status
draft | ready | broken-down | in-progress | completed

## Created
[YYYY-MM-DD]
```

6. **Domain Impact Analysis:**

   After generating the epic, check if this epic introduces or changes business logic:
   - New entities not in `domain.md` Glossary?
   - New flows or variations to existing flows?
   - New business rules or changes to existing rules?
   - New edge cases?

   **If domain impact detected AND `domain.md` exists:**
   - Generate proposed domain changes using the Domain Impact Protocol format (see `/ctx:domain` skill):
     ```
     📘 Glossary — adding: ...
     📋 Flows — updating: ...
     📏 Rules — adding: ...
     ```
   - Present to user: "This epic affects domain logic. Here are the proposed domain changes:"
   - **Wait for user confirmation** — user may modify, approve, or reject
   - Only after approval → update `domain.md` and add changelog entry

   **If domain impact detected AND `domain.md` does NOT exist:**
   - Ask user: "This epic involves business logic (flows, rules, entities). Would you like me to create a domain model (`domain.md`) with the concepts from this epic?"
   - If yes → generate draft `domain.md` → show to user → confirm → write
   - If no → proceed without domain file

   **If no domain impact:**
   - Skip this step silently (do not add "Domain Impact: None" to the epic)

7. **Summarize to user:**
   - Key points of the epic
   - Main risks identified
   - Domain changes made (if any)
   - Suggested next steps (break down into tasks, address dependencies, etc.)

---

## Update Mode

Use when updating an existing epic file.

### Process

1. **Read existing epic:**
   - Display current summary, scope, requirements

2. **Ask what's changing:**
   - "What would you like to update?"
   - "Has the scope changed?"
   - "New requirements or risks discovered?"

3. **Update the file:**
   - Modify relevant sections
   - Add changelog entry at bottom:

```markdown
## Changelog

### [YYYY-MM-DD] [Change Description]
- Updated: [what changed]
- Reason: [why]
```

4. **Re-evaluate:**
   - Does complexity estimate still hold?
   - Any new risks or warnings?
   - Still aligned with vision and architecture?

---

## Examples

### Create Mode Example

```
User: /ctx:epic "Payment processing"

Assistant reads vision.md and patterns-architecture.md for context.

Assistant asks:
- What payment methods? (credit card, PayPal, etc.)
- One-time or recurring payments?
- What's in scope for MVP?

Assistant suggests:
- "Consider using Stripe for PCI compliance"
- "Webhook handling can be error-prone - plan for retries"
- "You might want to separate one-time payments (MVP) from subscriptions (later)"

Assistant warns:
- ⚠️ Payment webhooks need idempotency - duplicates will happen
- ⚠️ Requires HTTPS and secure token storage
- ⚠️ Refunds and disputes add complexity - out of scope for MVP?

Creates .context/plans/epic-payment-processing.md
```

### Update Mode Example

```
User: /ctx:epic .context/plans/epic-auth.md

Assistant reads existing epic.

User: "Add social login to scope"

Assistant updates epic:
- Moves "social login" from Out of Scope to In Scope
- Increases complexity estimate from M to L
- Adds new risk about OAuth callback security
- Adds changelog entry

Suggests: "This adds significant complexity - consider keeping as separate epic?"
```

---

## Tips

- This is where you help users **think through** features before coding
- Don't just record their idea - actively improve and challenge it
- Foresee problems they might not see (security, scalability, edge cases)
- Reference architecture from patterns-architecture.md - does feature fit the patterns?
- An epic should be breakdownable into 3-10 tasks
- If epic feels too big (>10 tasks), suggest splitting into multiple epics
- If epic feels too small (<3 tasks), suggest combining with related work
- Status "draft" = still discussing, "ready" = ready to break down into tasks

## Gotchas

- **Domain Impact Protocol requires user confirmation**: When detecting new entities/flows/rules, you MUST show proposed changes and wait for explicit approval before writing to domain.md. Never auto-update.
- **Epic naming collisions**: Check if `epic-<name>.md` already exists before creating. If it does, ask user: update existing or create with different name?
- **Missing .context/plans/ folder**: Cannot write epic without it. Suggest `/ctx:context-init` if the folder structure doesn't exist.
- **XL epics should be split**: If you estimate >10 tasks, propose splitting into 2-3 smaller epics before the user commits to one large one.

---

## Final Step — Execution Log

If `${CLAUDE_PLUGIN_DATA}` is set and config `logging.enabled` is true:
- Append one JSONL line to `${CLAUDE_PLUGIN_DATA}/ctx-logs/execution.jsonl`
- Fields: `ts` (ISO-8601), `skill` ("ctx:<name>"), `project` (cwd basename), `args`, `outcome` ("success"|"failure"|"partial"|"corrected"), `failure_type`, `failure_detail`
- See `shared/conventions/logging-convention.md` for schema
