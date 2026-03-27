---
name: log-decision
description: Record an architecture or technical decision as an ADR in decisions.md. Triggers on "log decision", "record decision", "ADR", "we decided to", "why did we choose", "architecture decision". Use when a non-trivial technical choice is made that future developers should understand.
argument-hint: "[decision topic]"
allowed-tools: Read, Write, Edit, AskUserQuestion
---

# Log Decision

Record an architecture or technical decision.

## Input

`$ARGUMENTS` - Decision topic (e.g., "Use Redis for caching")

If empty, ask what decision to record.

## Steps

1. **Gather info:**
   Ask user (if not clear from context):
   - What was the context/problem?
   - What was decided?
   - Why this choice over alternatives?
   - Any consequences to note?

2. **Read decisions.md**

3. **Add entry:**

```markdown
### [Date] $ARGUMENTS

**Context:** [why needed]

**Decision:** [what was decided]

**Rationale:** [why this choice]

**Consequences:** [implications]

---
```

4. **Update related files (if needed):**
   - Add pattern to patterns-architecture.md
   - Note in relevant task files

## Output

```
Decision logged: [topic]

Related updates:
- [any files updated]
```

## Gotchas

- **decisions.md is append-only**: Never edit or remove existing entries. New decisions are appended at the end. If a decision is reversed, add a new entry referencing the old one.
- **Keep entries concise**: Each entry should be 3-5 lines (date, context, decision, rationale, consequences). This is a log, not an essay.
- **Don't duplicate as a gotcha what belongs in patterns-architecture.md**: If the decision changes architecture, update patterns-architecture.md. decisions.md records the WHY, patterns records the WHAT.
