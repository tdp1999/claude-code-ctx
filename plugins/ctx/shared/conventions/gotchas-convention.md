# Gotchas Convention

Every skill MUST have a `## Gotchas` section. This section documents failure points Claude commonly encounters when executing the skill.

## Purpose

Gotchas are **not tips** — they are specific failure modes that have caused incorrect output, wasted tokens, or required user correction. Tips suggest best practices; gotchas prevent known mistakes.

## Format

```markdown
## Gotchas

- **Short label**: Concise description of the failure mode and what to do instead.
- **Another label**: Description.
```

## Placement

Place `## Gotchas` as the **last section** before the end of the skill file, after Tips (if present). Rationale: gotchas are loaded into context at the same time as the rest of the skill body, and placing them last ensures they are fresh in context when Claude begins executing.

## Content Guidelines

1. Each gotcha describes a **specific failure**, not a general best practice
2. Lead with WHAT goes wrong, follow with WHAT to do instead
3. Keep each entry to 1-2 sentences
4. Minimum 2 gotchas per skill, maximum 8 — if more, the skill may be too complex
5. Source gotchas from: error handling sections, user corrections, execution log failures

## Maintenance

Gotchas are living documents. They grow via the **Gotchas Auto-Maintenance Protocol** (see `gotchas-maintenance.md`):

1. Skills log failures to `${CLAUDE_PLUGIN_DATA}/ctx-logs/execution.jsonl`
2. `/ctx:sync` scans for repeated failures (>= 2 of same type per skill)
3. Sync proposes new gotcha → user confirms → appended to skill's Gotchas section
4. Manually review and prune gotchas that no longer apply after skill updates

## Anti-Patterns

- Do NOT duplicate error handling instructions as gotchas — gotchas are for failures the error handling didn't prevent
- Do NOT add gotchas about things Claude already knows (basic coding, git commands, etc.)
- Do NOT use gotchas as a substitute for fixing the skill's instructions — if a gotcha keeps recurring, fix the root cause
