# Modes Convention

CTX supports config-driven behavior modes that change how skills operate. Modes are set via `ctx-config.json` and checked by skills at preamble.

## Careful Mode

**Config:** `verification.carefulMode: true`

When active:
- **task**: All tasks treated as `Verification: full` regardless of field value. Suggests running test-runner + build-validator on every task completion.
- **breakdown**: Presents each task individually for confirmation instead of batch approval.
- **sync**: Full domain freshness check with detailed rule-by-rule review.

**When to use:** Working on production-critical code, unfamiliar codebases, or after a major incident.

## Freeze Mode

**Config:** `verification.freezeMode: true`

When active:
- **task**: Read-only mode. Shows task details and ACs but does NOT modify code. Useful for reviewing tasks before working.
- **sync**: Report-only mode. Shows what would change (status corrections, archives, domain checks) but does NOT execute changes.
- Other skills: Unaffected.

**When to use:** Reviewing project state, debugging, or when you want to preview changes before applying.

## Mode Interaction

- Careful and Freeze can both be active simultaneously — Freeze takes precedence (read-only overrides verification).
- Modes persist across skill invocations within a session — they're config values, not session state.
- To toggle: edit `ctx-config.json` directly, or ask Claude to update the config.

## Skill Implementation

Every skill that respects modes should check config at preamble:

```
Preamble:
1. Load config (see config-convention.md)
2. If freezeMode is true AND this skill has freeze behavior → enter read-only mode
3. If carefulMode is true AND this skill has careful behavior → apply careful overrides
4. Proceed with normal workflow
```
