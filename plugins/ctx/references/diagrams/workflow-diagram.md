# Context Workflow Skills - Complete Flow Diagram

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROJECT INITIALIZATION                        │
└─────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┴──────────────────┐
           │                                     │
    ┌──────▼──────┐                    ┌────────▼────────┐
    │ NEW PROJECT │                    │ EXISTING PROJECT │
    └──────┬──────┘                    └────────┬─────────┘
           │                                     │
    ┌──────▼──────┐                    ┌────────▼─────────┐
    │  /vision    │◄───────────────────┤ /onboard-project │
    │  (create)   │                    │  (orchestrator)  │
    └──────┬──────┘                    └────────┬─────────┘
           │                                     │
    ┌──────▼──────────┐                         │
    │ /architecture   │◄────────────────────────┤
    │    (create)     │                         │
    └──────┬──────────┘                         │
           │                                     │
    ┌──────▼──────┐                             │
    │ /techstack  │◄────────────────────────────┘
    │  (create)   │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │/init-context│
    │  (utility)  │
    └──────┬──────┘
           │
           └──────────────────┐
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      FEATURE PLANNING                            │
└──────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┴──────────────────┐
           │                                     │
    ┌──────▼──────┐                    ┌────────▼─────────┐
    │   /epic     │                    │  /investigate    │
    │ (feature)   │                    │ (bugs/refactor)  │
    └──────┬──────┘                    └────────┬─────────┘
           │                                     │
           │   Calls /log-decision               │
           │   Domain Impact Protocol            │
           ├──────────┬──────────────────────────┤
           │          │                          │
           │   ┌──────▼──────┐                   │
           │   │  /domain    │                   │
           │   │(biz logic)  │                   │
           │   └──────┬──────┘                   │
           │          │                          │
           └──────────┴──────────┬───────────────┘
                                 │
                      ┌──────────▼────────┐
                      │    /breakdown     │
                      │   (decomposer)    │
                      └──────────┬────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      TASK EXECUTION                              │
└──────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┴──────────────────┐
           │                                     │
    ┌──────▼──────────────┐           ┌─────────▼──────────┐
    │ /create-standalone- │           │   From /breakdown  │
    │      task           │           │    (epic/invest)   │
    │  (direct create)    │           └─────────┬──────────┘
    └──────┬──────────────┘                     │
           │                                     │
           └──────────────────┬──────────────────┘
                              │
                     ┌────────▼─────────┐
                     │ Tasks created in │
                     │ .context/tasks/  │
                     └────────┬─────────┘
                              │
                      ┌───────▼──────┐
                      │  /progress   │
                      │   (viewer)   │
                      │              │
                      │ User reviews │
                      │ pending task │
                      │    list      │
                      └───────┬──────┘
                              │
                    User chooses task
                              │
                      ┌───────▼──────┐
                      │  /task [num] │
                      │ (load task)  │
                      └───────┬──────┘
                              │
                      [Work on task]
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    PROGRESS TRACKING                             │
└──────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┴──────────────────┐
           │                                     │
    ┌──────▼──────┐                    ┌────────▼─────────┐
    │  /progress  │                    │     /sync        │
    │  (viewer)   │                    │   (reconciler)   │
    └─────────────┘                    └────────┬─────────┘
                                                 │
                                        Archives completed
                                        tasks to tasks-done/<epic>/
```

## Skill Roles & Relationships

### **Orchestrators** (Call other skills)
- **`/onboard-project`** → Calls `/vision --extract`, `/architecture --extract`, `/techstack --extract`
- **`/epic`** → Can call `/log-decision` when updated
- **`/architecture`** → Can call `/log-decision` when updated
- **`/vision`** → Can call `/log-decision` when updated

### **Decomposers** (Create multiple outputs)
- **`/breakdown`** → Takes epic/investigation → Creates multiple task files
- **`/epic`** → Takes idea → Creates epic file (later broken down)
- **`/investigate`** → Takes issue → Creates investigation file (later broken down)

### **Task Creators** (Write to `.context/tasks/`)
- **`/breakdown`** → Primary task creator (from epics/investigations)
- **`/create-standalone-task`** → Direct task creator (standalone)

### **Task Selection** (Manual, conscious choice)
- **`/progress`** → View all pending tasks with their numbers
- **`/task [num]`** → User explicitly chooses which task to work on
- **No auto-selection** → User is always conscious about task choice

### **Utilities** (Supporting roles)
- **`/init-context`** → Creates folder structure
- **`/sync`** → Reconciles progress.md with task files, archives completed tasks
- **`/progress`** → Views current state, lists pending tasks by number
- **`/log-decision`** → Records ADRs (called by other skills)

### **Domain Knowledge** (Business logic)
- **`/domain`** → Business flows, rules, edge cases (standalone or via Domain Impact Protocol)

### **Foundational** (Define project context)
- **`/vision`** → Project goals/scope
- **`/architecture`** → Patterns/boundaries
- **`/techstack`** → Tools/technologies

## Typical Workflows

### **New Feature Flow:**
```
/epic "User auth" → [domain impact check] → /breakdown epic-auth → /progress → /task 001 → [work] → /sync
```

### **Bug Fix Flow:**
```
/investigate "Login slow" → /breakdown inv-login-perf → /progress → /task 006 → [work] → /sync
```

### **Standalone Task Flow:**
```
/create-standalone-task "Fix dev server" → /progress → /task 065 → [work] → /sync
```

### **New Project Flow:**
```
/vision → /architecture → /techstack → /init-context → /domain (optional) → /epic → /breakdown → /progress → /task [num]
```

### **Existing Project Flow:**
```
/onboard-project → [auto-calls /vision --extract, /architecture --extract, /techstack --extract] → /init-context
```

## Key Data Flows

| Source | Creates | Used By |
|--------|---------|---------|
| `/vision` | `vision.md` | `/architecture`, `/techstack`, `/epic` |
| `/architecture` | `patterns-architecture.md` | `/epic`, `/breakdown`, `/task` |
| `/domain` | `domain.md`, `domain/*.md` | `/epic`, `/breakdown`, `/task`, `/investigate` |
| `/techstack` | `.project-init.md` | Reference for tooling |
| `/epic` | `plans/epic-*.md` | `/breakdown` |
| `/investigate` | `investigations/inv-*.md` | `/breakdown` |
| `/breakdown` | `tasks/NNN-*.md` | `/progress`, `/task` |
| `/create-standalone-task` | `tasks/NNN-*.md` | `/progress`, `/task` |
| All task creators | Update `progress.md` | `/progress`, `/sync` |
| `/sync` | Moves to `tasks-done/` | Archives completed work |

## Task Selection Philosophy

**Conscious Choice Over Automation:**
- No `/next` skill - user must explicitly choose tasks
- `/progress` lists all pending tasks with numbers
- User reviews list and consciously picks: `/task [number]`
- Promotes intentional work and better context switching
- User maintains awareness of project priorities

**Workflow:**
1. Run `/progress` to see all pending tasks
2. Review the list and choose based on:
   - Priority
   - Dependencies
   - Current context/focus
   - Blockers status
3. Run `/task [number]` to start chosen task
4. Complete work
5. Run `/sync` to archive completed tasks
6. Repeat from step 1

## Session Flow Examples

### **Focused Session:**
```bash
# 1. Review what's available
/progress

# 2. Choose a specific task consciously
/task 042

# 3. Work on it
[complete acceptance criteria]

# 4. Sync when done
/sync
```

### **New Work Session:**
```bash
# 1. Check progress
/progress

# 2. See no tasks ready, create new work
/epic "Payment integration"

# 3. Break it down
/breakdown epic-payment

# 4. Review what was created
/progress

# 5. Choose first task
/task 066
```

### **Bug Fix Session:**
```bash
# 1. Investigate issue
/investigate "Checkout 500 error"

# 2. Create tasks from investigation
/breakdown inv-checkout-500

# 3. See what needs to be done
/progress

# 4. Start with root cause fix
/task 067
```

## Benefits of Manual Task Selection

1. **Awareness** - Always know what you're working on
2. **Prioritization** - Choose based on current needs
3. **Context** - Pick tasks that fit your current mental context
4. **Flexibility** - Skip around based on blockers or dependencies
5. **Intentionality** - No automatic decisions, user stays in control
