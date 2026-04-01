---
name: domain
description: Capture and maintain business logic, domain knowledge, flows, rules, and edge cases in plain text. Use when the project has business rules, user flows, domain concepts, or invariants that code alone cannot convey. Triggers on "domain", "business logic", "business rules", "flows", "domain model", or when discussing how a system behaves from a business perspective.
argument-hint: "[optional: --module <name> | --split]"
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion
---

# Domain

Capture and maintain business logic as plain text using DDD (Domain-Driven Design) naming. This file describes **what the system does from a business perspective** — not how it's built technically.

## Core Principles

1. **Plain text only.** No code, no API endpoints, no database schemas, no framework references. If a developer and a product manager can't both read it, it's too technical.

2. **DDD entity naming.** Every domain concept (Order, Customer, Cart, Payment) is capitalized. These are the Ubiquitous Language — the same terms everyone uses, from business to code.

3. **Business Process Level.** Not UI-level ("user clicks button"), not too abstract ("user pays"). Each flow step should map to a Domain Event or Command. The test: **if you change the UI framework or tech stack, does the description still hold?** If yes, it's the right level.

4. **User confirmation is non-negotiable.** Never write to `domain.md` or `domain/*.md` without explicit user approval. Always show proposed changes first, wait for confirmation, then write.

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

This skill uses:
- **Explore** (built-in) — For extract mode: scanning codebase for validation logic, state machines, business constants

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.
See `../../shared/conventions/file-contracts.md` for required output sections.

Skill-specific errors:
- **Missing `vision.md`**: Warn that domain model will lack project context. Suggest `/ctx:vision` first, but allow proceeding.
- **Missing `patterns-architecture.md`**: Warn that domain won't be linked to architecture. Suggest `/ctx:architecture` first.
- **`.context/` doesn't exist**: Suggest running `/ctx:context-init` first.
- **`domain.md` already exists (create mode)**: Ask — update existing or start fresh?

## Input

`$ARGUMENTS` can be:
- Empty: Create new or update existing `domain.md`
- `--module <name>`: Add or update a specific module file in `domain/`
- `--split`: Migrate single `domain.md` into `domain/` folder with per-module files

## Step 1: Detect Mode

Check if `.context/domain.md` exists:
- **If `--split` flag:** Enter **Split Mode**
- **If `--module <name>` flag:** Enter **Module Mode**
- **If exists:** Enter **Update Mode**
- **If not exists:** Enter **Create Mode**

---

## Create Mode

Use when no `domain.md` exists.

### Process

1. **Gather context:**
   - Read `.context/vision.md` for project scope and target users
   - Read `.context/patterns-architecture.md` — especially `## Domains` section if it exists
   - If neither exists, ask user to describe the project

2. **Interview — discover the domain:**

   Ask conversationally (adjust based on project complexity):
   - What are the main things (entities) in your system? (e.g., Users, Orders, Products)
   - What are the most important flows? (e.g., checkout, registration, refund)
   - Are there business rules that must always be true? (e.g., "an order must have at least one item")
   - Any known edge cases or tricky scenarios?

   For each flow mentioned, dig deeper:
   - What triggers it?
   - What's the happy path?
   - What can go wrong?
   - What are the possible end states?

3. **Draft the domain model:**

   Generate `domain.md` following the template below. Show the complete draft to the user.

4. **Require confirmation:**

   Present the draft clearly:
   ```
   Here's the domain model I've drafted:

   [show full domain.md content]

   Does this look correct? Any changes needed?
   ```

   - If user requests changes → apply them → show updated draft → confirm again
   - Only after explicit approval ("OK", "looks good", "yes", "confirm") → write the file

5. **Write `domain.md`** to `.context/domain.md`

### Domain File Template

For the full template and guidance, read `references/domain-template.md`.

Key points:
- Glossary uses DDD types (Aggregate, Entity, Value Object, Domain Event)
- Rule IDs: 3-letter entity code + 3-digit number (e.g., ORD-001)
- Flow steps must pass the "change UI test" — see `references/detail-level-guide.md`

---

## Update Mode

Use when `domain.md` already exists.

### Process

1. **Read existing `domain.md`** (and `domain/*.md` if split structure exists)

2. **Understand what's changing:**
   - User may specify directly: "add a Coupon entity" or "update the checkout flow"
   - Or describe a business change: "we now allow guest checkout"
   - Or be called from another skill with a proposed change (see Domain Impact Protocol below)

3. **Generate proposed changes:**

   Show the user exactly what will change:
   ```
   Proposed domain changes:

   📘 Glossary — adding:
   | Coupon | A discount code applied to an Order before Payment | Entity |

   📋 Flows — updating Checkout:
   - Adding variation: "Coupon applied: Customer enters Coupon before Payment..."

   📏 Rules — adding:
   - CPN-001: A Coupon can only be used once per Customer
   - CPN-002: Only one Coupon per Order

   Confirm these changes?
   ```

4. **Require confirmation** — same gate as Create Mode

5. **Update file** and add changelog entry:
   ```markdown
   ## Changelog
   - [YYYY-MM-DD] Added Coupon entity, rules CPN-001..002, updated Checkout flow
   ```

---

## Module Mode

Use with `--module <name>` for large projects that have been split.

### Process

1. **If `domain/` folder exists:** Read `domain/<name>.md` if it exists, or create new
2. **If `domain/` folder doesn't exist:** Suggest using `--split` first, or create the folder structure now

3. **Module file template:** See `references/domain-template.md` (Module File Template section).

4. **After creating/updating module file:** Update `domain.md` index if needed (add reference to the new module)

---

## Split Mode

Use with `--split` to migrate a growing `domain.md` into per-module files.

### Process

1. **Read current `domain.md`**
2. **Identify modules** — group Flows and Rules by their natural domain boundary
3. **Propose the split:**

   ```
   I suggest splitting domain.md into:

   domain.md (keeps: Glossary, cross-module Invariants, module index)
   domain/order.md (flows: Place Order, Cancel Order; rules: ORD-*)
   domain/payment.md (flows: Collect Payment, Refund; rules: PAY-*)
   domain/shipping.md (flows: Create Shipment; rules: SHP-*)

   Confirm this split?
   ```

4. **Require confirmation**
5. **Execute split:**
   - Create `domain/` folder
   - Create per-module files with their flows, rules, edge cases
   - Rewrite `domain.md` to keep only: Glossary, cross-module Invariants, and an index:

   ```markdown
   # Domain: [Project Name]

   ## Glossary
   [kept here — shared across all modules]

   ## Modules
   - [Order](domain/order.md) — Order lifecycle, cart-to-order conversion
   - [Payment](domain/payment.md) — Payment collection, refunds
   - [Shipping](domain/shipping.md) — Shipment creation, tracking

   ## Invariants
   [cross-module constraints kept here]

   ## Changelog
   - [YYYY-MM-DD] Split into per-module files
   ```

---

## Domain Impact Protocol

This protocol is used by OTHER skills (`/ctx:epic`, `/ctx:breakdown`, `/ctx:task`) when they detect business logic changes. They don't write to domain files directly — they call this protocol.

### How it works

1. The calling skill detects domain impact (new entities, changed rules, new flows)
2. The calling skill generates a **proposed change draft** in this format:

   ```
   📘 Glossary — [adding/updating/removing]:
   | Term | Definition | Type |

   📋 Flows — [adding/updating]:
   - [description of flow change]

   📏 Rules — [adding/updating/removing]:
   - [RULE-ID]: [rule text]

   ⚠ Invariants — [adding/updating]:
   - [invariant text]
   ```

3. The calling skill presents this to the user with: **"This epic/task affects domain logic. Here are the proposed domain changes:"**
4. User must confirm, modify, or reject
5. Only after confirmation → update domain files

### When skills should trigger this protocol

| Skill | Trigger condition |
|-------|------------------|
| `/ctx:epic` | Epic introduces new entities, flows, or rules not in domain.md |
| `/ctx:breakdown` | Decomposing reveals edge cases or rules not captured in domain.md |
| `/ctx:task` | During implementation, discovers business logic differs from domain.md |

---

## Code vs Domain Conflict Resolution

When an AI agent discovers that code behavior contradicts a domain rule:

### Default: Domain is intent, code is reality

`domain.md` captures what the system **should** do. Code captures what it **actually** does. When they conflict, that's valuable information — it means either there's a bug or the domain doc is stale.

### Resolution protocol

1. **STOP** — do not silently pick one over the other
2. **Report the conflict clearly:**
   ```
   Domain rule ORD-001 states: "An Order must contain at least one Line Item"
   But OrderService.create() allows empty orders (no validation found).

   This is either:
   (a) A bug in code — needs fix to match domain rule
   (b) A stale domain rule — domain.md needs update

   Which is correct?
   ```
3. **Wait for user decision**
4. **After decision:**
   - If code is wrong → fix code, reference rule ID in task/commit
   - If domain is stale → update domain.md via confirmation protocol, add changelog

### Exception: Task explicitly references a rule ID

If the current task says "Implement ORD-001" — then the domain rule is authoritative. Implement according to the rule without asking, because the task was already approved by the user.

---

## Detail Level Guide

For full detail level guidance with examples, read `references/detail-level-guide.md`.

Key test: **"If you change the UI framework or tech stack, does the description still hold?"** If yes, it's the right level.

---

## Examples

For complete examples of Create, Update, and Split modes, read `references/examples.md`.

---

## Tips

- This skill captures **what the business needs**, not how the code implements it
- Entities in Glossary should match class/model names in code for traceability
- Rule IDs (ORD-001) create hard links between domain docs and tasks — use them
- When called from other skills (epic, breakdown, task), always show the proposed changes and wait for confirmation
- A project doesn't need domain.md if it has no business logic (e.g., portfolio, CLI tool, library)
- Start with a single `domain.md` — only split when it exceeds ~300 lines or has 4+ distinct modules
- Keep the Changelog section updated — it helps detect staleness

## Gotchas

- **User confirmation is NON-NEGOTIABLE**: Never write to domain.md without explicit user approval. This applies to all modes and all callers (epic, breakdown, task via Domain Impact Protocol).
- **Business-level descriptions, not code-level**: Flow steps should survive a UI framework change. Write "User submits order" not "User clicks Submit button which dispatches ORDER_SUBMIT action".
- **Code vs domain conflict = STOP**: If code behavior contradicts a domain rule, stop immediately. Report the conflict and wait for user decision — do not silently pick one.
- **Split mode is irreversible**: Once domain.md is split into per-module files, merging back requires manual effort. Confirm with user before splitting.

---

## Final Step — Execution Log

If `${CLAUDE_PLUGIN_DATA}` is set and config `logging.enabled` is true:
- Append one JSONL line to `${CLAUDE_PLUGIN_DATA}/ctx-logs/execution.jsonl`
- Fields: `ts` (ISO-8601), `skill` ("ctx:<name>"), `project` (cwd basename), `args`, `outcome` ("success"|"failure"|"partial"|"corrected"), `failure_type`, `failure_detail`
- See `shared/conventions/logging-convention.md` for schema
