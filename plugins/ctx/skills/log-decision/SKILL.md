---
name: log-decision
description: Record an architecture decision in decisions.md
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
