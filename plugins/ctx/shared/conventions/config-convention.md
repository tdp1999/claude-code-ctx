# Config Convention

CTX supports layered configuration for customizing skill behavior per-user and per-project.

## Config Locations (Merge Order)

1. **Defaults** — hardcoded below; always apply
2. **User-level** — `${CLAUDE_PLUGIN_DATA}/ctx-config.json` (stable across projects)
3. **Project-level** — `.context/ctx-config.json` (overrides user-level)

Merge strategy: shallow merge per top-level key. Project values override user values which override defaults.

## Loading Protocol

Every skill SHOULD load config as a preamble step:

1. Read `${CLAUDE_PLUGIN_DATA}/ctx-config.json` (if exists)
2. Read `.context/ctx-config.json` (if exists)
3. Merge: project over user over defaults
4. If neither file exists → use defaults silently. Do NOT create config files automatically.

If a config key is missing from both files, use the default value. Never error on missing config.

## Default Values

```json
{
  "naming": {
    "taskPrefix": "NNN",
    "epicPrefix": "epic-",
    "investigationPrefix": "inv-",
    "ruleIdFormat": "AAA-NNN"
  },
  "complexity": {
    "autoSplitXL": true
  },
  "verification": {
    "onTaskComplete": "ask",
    "domainFreshnessCheck": true,
    "carefulMode": false,
    "freezeMode": false
  },
  "logging": {
    "enabled": true
  },
  "integrations": {
    "jiraSync": false,
    "slackProgress": false
  },
  "onboarding": {
    "tier": 3
  }
}
```

## Field Reference

### naming
- `taskPrefix`: Number format for task files. Default `"NNN"` = 3-digit zero-padded.
- `epicPrefix`: Prefix for epic filenames. Default `"epic-"`.
- `investigationPrefix`: Prefix for investigation filenames. Default `"inv-"`.
- `ruleIdFormat`: Domain rule ID format. Default `"AAA-NNN"` (3-letter entity + 3-digit number, e.g., ORD-001).

### complexity
- `autoSplitXL`: If true, breakdown skill suggests splitting XL tasks into sub-tasks or separate epics.

### verification
- `onTaskComplete`: What to do when task is marked done. Values: `"ask"` (prompt user), `"auto"` (run based on verification field), `"skip"` (never verify).
- `domainFreshnessCheck`: If true, sync skill checks domain.md staleness when archiving epics.
- `carefulMode`: If true, overrides all task verification levels to `full`. Use when working on critical code.
- `freezeMode`: If true, task skill becomes read-only and sync becomes report-only. Use when reviewing or debugging.

### logging
- `enabled`: If true, skills append execution logs to `${CLAUDE_PLUGIN_DATA}/ctx-logs/execution.jsonl`.

### integrations
- `jiraSync`: If true and Atlassian MCP tools available, sync skill offers Jira status sync.
- `slackProgress`: If true and Slack MCP available, progress/recap skills offer Slack posting.

### onboarding
- `tier`: Skill visibility tier (1, 2, or 3). Advisory only — affects "Next Steps" suggestions and "Did you know?" tips. See `onboarding-tiers.md`.

## Config Template

For `/ctx:context-init` to offer when creating `.context/`:

```json
{
  "verification": {
    "onTaskComplete": "ask",
    "carefulMode": false
  },
  "logging": {
    "enabled": true
  }
}
```

Minimal — only include fields the user is likely to customize. Omitted fields use defaults.
