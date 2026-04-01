# Logging Convention

Libref skills log execution data for tracking usage and failure analysis.

## Log Location

`${CLAUDE_PLUGIN_DATA}/libref-logs/`

If `${CLAUDE_PLUGIN_DATA}` is not set or logging is disabled, skip logging silently. Never error on logging failure.

## Log Files

### execution.jsonl

Append-only log, one JSON line per skill invocation. Written by ALL skills as their final step.

```json
{
  "ts": "2026-03-27T10:30:00Z",
  "skill": "libref:<skill-name>",
  "project": "my-app",
  "args": "",
  "outcome": "success",
  "failure_type": null,
  "failure_detail": null,
  "notes": null
}
```

**Fields:**
- `ts`: ISO-8601 timestamp
- `skill`: Skill name with `libref:` prefix
- `project`: Project directory name (basename of working directory)
- `args`: Arguments passed to the skill (if any)
- `outcome`: One of:
  - `"success"` — skill completed as expected
  - `"failure"` — skill could not complete
  - `"partial"` — skill completed but with caveats
  - `"corrected"` — user corrected the skill's output after completion
- `failure_type`: (only when outcome is failure/corrected) One of:
  - `"missing_reference"` — required reference file missing
  - `"version_mismatch"` — tool/lib version not supported
  - `"wrong_output"` — skill produced incorrect guidance
  - `"user_correction"` — user changed something after skill ran
  - `"not_applicable"` — skill triggered for wrong project/context
- `failure_detail`: Free-text description of what went wrong
- `notes`: Optional context

## How Skills Log

Add as the **last step** of every skill, after all other work is complete:

```
Final Step — Execution Log:
If logging is enabled (`${CLAUDE_PLUGIN_DATA}` exists):
  Append one JSONL line to `${CLAUDE_PLUGIN_DATA}/libref-logs/execution.jsonl`
  with the skill name, project, args, and outcome.
```

## Data Retention

Log files grow indefinitely. Users can manually truncate or archive old entries.
