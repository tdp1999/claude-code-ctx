---
name: recap
description: Generate a weekly recap of project progress — tasks completed, velocity trend, highlights, and upcoming work. Triggers on "recap", "weekly summary", "what did I do this week", "progress report", "weekly review". Use for reflecting on work done and planning ahead.
allowed-tools: Read, Glob, Bash
---

# Weekly Recap

Generate a summary of project progress over a configurable time period (default: last 7 days).

## Input

`$ARGUMENTS` can be:
- Empty: default to last 7 days
- Time period: "2 weeks", "this month"
- `--compare`: Compare with previous recap

## Steps

1. **Gather data from multiple sources:**

   **From .context/ (always available):**
   - Scan `.context/tasks-done/` for recently archived tasks (check file modified dates)
   - Scan `.context/plans-done/` for recently archived epics/investigations
   - Read `.context/progress.md` for current state
   - Read `.context/decisions.md` for recent decisions

   **From git (always available):**
   - `git log --since="7 days ago" --oneline` for commit activity
   - Count commits, files changed, lines added/removed

   **From logs (if logging enabled):**
   - Read `${CLAUDE_PLUGIN_DATA}/ctx-logs/sync-history.jsonl` for velocity data
   - Read `${CLAUDE_PLUGIN_DATA}/ctx-logs/execution.jsonl` for skill usage patterns

2. **Generate recap:**

```
## Weekly Recap — [date range]

### Completed
- [task] (from: [epic]) — [complexity]
- [task] (standalone) — [complexity]
Total: N tasks completed

### Epics Progress
- [epic-name]: N/M tasks done (X% complete)
- [epic-name]: completed and archived

### Decisions Made
- [date] [decision summary]

### Git Activity
- N commits, M files changed
- Top contributors: [if relevant]

### Velocity
- This week: N tasks
- Previous week: N tasks
- Trend: [improving / stable / declining]
(Only shown if sync-history.jsonl has >= 2 weeks of data)

### Upcoming
- N tasks pending
- N tasks blocked (reasons: ...)
- Next recommended: task NNN — [title]

### Domain Coverage
- [status from progress skill's domain check]
```

3. **Store recap (if logging enabled):**
   - Append output to `${CLAUDE_PLUGIN_DATA}/ctx-logs/recaps.log`
   - Separate entries with `---` and timestamp
   - This enables `--compare` mode in future runs

4. **Compare mode** (when `--compare` passed):
   - Read previous recap from `recaps.log`
   - Highlight differences: velocity change, new completions, resolved blockers
   - Show week-over-week trend

## Fallback Behavior

- If logging not enabled → skip velocity/trend sections, use only .context/ and git data
- If no tasks completed → show "No tasks completed this period" and focus on in-progress and upcoming
- If no git activity → skip git section
- If no previous recap for comparison → skip compare, note "First recap — comparison available next time"

## Gotchas

- **Read-only skill**: Like progress, this skill only reads data and generates a report. It does NOT modify any files except appending to recaps.log.
- **Velocity requires history**: Meaningful velocity trends need >= 2 sync-history entries. Don't show trend with insufficient data.
- **Git log date range**: Use `--since` flag, not counting commits. Time zones may cause edge cases — accept minor inaccuracies.
