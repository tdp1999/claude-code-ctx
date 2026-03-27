# Logging Convention

CTX skills log execution data for self-learning, velocity tracking, and failure analysis.

## Log Location

`${CLAUDE_PLUGIN_DATA}/ctx-logs/`

If `${CLAUDE_PLUGIN_DATA}` is not set or logging is disabled in config (`logging.enabled: false`), skip logging silently. Never error on logging failure.

## Log Files

### execution.jsonl

Append-only log, one JSON line per skill invocation. Written by ALL skills as their final step.

```json
{
  "ts": "2026-03-27T10:30:00Z",
  "skill": "ctx:task",
  "project": "my-app",
  "args": "003",
  "outcome": "success",
  "failure_type": null,
  "failure_detail": null,
  "correction": null,
  "notes": null
}
```

**Fields:**
- `ts`: ISO-8601 timestamp
- `skill`: Skill name with `ctx:` prefix
- `project`: Project directory name (basename of working directory)
- `args`: Arguments passed to the skill (if any)
- `outcome`: One of:
  - `"success"` — skill completed as expected
  - `"failure"` — skill could not complete (missing files, invalid state, etc.)
  - `"partial"` — skill completed but with caveats (e.g., some steps skipped)
  - `"corrected"` — user corrected the skill's output after completion
- `failure_type`: (only when outcome is failure/corrected) One of:
  - `"missing_context"` — required file or section missing
  - `"malformed_input"` — user input couldn't be processed
  - `"wrong_output"` — skill produced incorrect result
  - `"user_correction"` — user changed something after skill ran
  - `"wrong_skill"` — this skill was triggered but shouldn't have been
- `failure_detail`: Free-text description of what went wrong
- `correction`: What the user changed (for corrected outcomes)
- `notes`: Optional context
- `gotcha_proposed`: Boolean, added by sync when a gotcha has been proposed for this failure (for dedup)

### sync-history.jsonl

Written by `/ctx:sync` only, after each sync operation.

```json
{
  "ts": "2026-03-27T10:30:00Z",
  "project": "my-app",
  "tasks_done": 3,
  "tasks_pending": 5,
  "tasks_blocked": 1,
  "epics_completed": ["epic-auth"]
}
```

### recaps.log

Written by `/ctx:recap` only. Plain text, separated by `---` markers. Each entry includes the recap output and timestamp for week-over-week comparison.

## How Skills Log

Add as the **last step** of every skill, after all other work is complete:

```
Final Step — Execution Log:
If logging is enabled (config `logging.enabled` is true and `${CLAUDE_PLUGIN_DATA}` exists):
  Append one JSONL line to `${CLAUDE_PLUGIN_DATA}/ctx-logs/execution.jsonl`
  with the skill name, project, args, and outcome.

If the user corrected the output during this session:
  Set outcome to "corrected" and include failure_detail and correction fields.
```

## Failure Logging

When a user corrects your output or indicates the skill produced wrong results:
1. Note the correction internally
2. At the final logging step, set `outcome: "corrected"` with appropriate `failure_type` and `failure_detail`
3. The `/ctx:sync` gotchas auto-maintenance protocol reads these entries to propose new gotchas

## Data Retention

Log files grow indefinitely. Users can manually truncate or archive old entries. CTX does not auto-prune.
