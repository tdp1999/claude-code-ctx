# New Project Workflow

Complete step-by-step guide for setting up a new project with the CTX plugin.

---

## Overview

This workflow takes you from initial idea to a fully structured project with tasks ready to work on.

**Time**: 15-30 minutes
**Output**: Complete `.context/` folder with vision, architecture, techstack, and initial tasks

---

## Option 1: Orchestrated Setup (Fastest)

Use the `/ctx:start` skill which automatically runs the full setup sequence.

```bash
/ctx:start
```

**What it does**:
1. Runs `/ctx:vision` - Captures project vision and scope
2. Runs `/ctx:architecture` - Defines architectural patterns
3. Runs `/ctx:techstack` - Selects technologies and tools
4. Runs `/ctx:context-init` - Creates `.context/` folder structure

**Pros**: Fastest, guided, comprehensive
**Cons**: Less control over individual steps

---

## Option 2: Step-by-Step Setup (More Control)

Execute each skill individually for full control.

### Step 1: Define Vision (5-10 min)

```bash
/ctx:vision "Brief project description"
```

**Questions you'll answer**:
- What are you building? (one sentence)
- Who is it for? (target users)
- What scale? (personal/team/startup/enterprise)
- Timeline? (prototype/MVP/full product)
- MVP scope vs Full vision?

**Output**: `.context/vision.md` with structured project vision

---

### Step 2: Define Architecture (5-10 min)

```bash
/ctx:architecture
```

**Questions you'll answer**:
- Backend architecture style? (hexagonal/clean/layered/microservices)
- Frontend architecture? (feature-modules/atomic-design/container-presenter)
- Domain approach? (DDD/CRUD/event-driven)
- API style? (REST/GraphQL/tRPC/gRPC)
- Module communication? (direct-import/event-bus/API-calls)

**Output**: `.context/patterns-architecture.md` with architectural decisions

---

### Step 3: Select Technology Stack (5-10 min)

```bash
/ctx:techstack
```

**Questions you'll answer**:
- Repository structure? (monorepo/single-repo)
- Package manager? (pnpm/npm/yarn/bun)
- Language? (TypeScript/JavaScript)
- Framework? (Next.js/Angular/React/Vue)
- Database? (PostgreSQL/MongoDB/MySQL)
- Testing? (Vitest/Jest/Playwright)
- CI/CD? (GitHub Actions/GitLab CI)

**Output**: `.context/.project-init.md` with complete tech stack

**Tip**: The skill provides smart defaults based on your vision and architecture.

---

### Step 4: Initialize Context Structure (1 min)

```bash
/ctx:context-init
```

**What it creates**:
```
.context/
├── plans/              # Epic files
├── investigations/     # Investigation files
├── tasks/              # Active task files
├── tasks-done/         # Archived completed tasks
├── workflow.md         # Workflow guide
├── progress.md         # Progress tracker
└── decisions.md        # Architecture Decision Records
```

**Output**: Complete `.context/` folder structure

---

## After Setup: Plan Your First Feature

### Step 5: Create an Epic (10 min)

```bash
/ctx:epic "First feature name"
```

**What it does**:
- Expands your feature idea
- Identifies requirements and scope
- Warns about potential risks
- Suggests implementation approach

**Output**: `.context/plans/epic-first-feature.md`

---

### Step 6: Break Down into Tasks (5 min)

```bash
/ctx:breakdown epic-first-feature
```

**What it does**:
- Analyzes epic requirements
- Creates 3-10 task files
- Numbers them sequentially (001, 002, 003...)
- Updates progress tracker

**Output**: Multiple task files in `.context/tasks/`

---

### Step 7: Review Tasks (2 min)

```bash
/ctx:progress
```

**What you see**:
- List of pending tasks with numbers
- Task complexity estimates
- Dependencies (if any)
- Suggested starting task

---

### Step 8: Start Working (ongoing)

```bash
/ctx:task 001
```

**What happens**:
- Loads task file
- Shows goal and acceptance criteria
- Sets status to "in-progress"
- You complete the task following TDD approach

**When done**:
```bash
/ctx:sync
```
Archives completed tasks and updates progress.

---

## Complete Example Session

```bash
# 1. Setup
/ctx:vision "E-commerce platform for artisans"
# Answer: Target users - artisans selling handmade goods
# Answer: Scale - startup
# Answer: Timeline - MVP in 2 months

/ctx:architecture
# Choose: Hexagonal backend, Feature-modules frontend, DDD approach

/ctx:techstack
# Choose: Nx monorepo, Angular 21, NestJS, PostgreSQL, pnpm

/ctx:context-init
# Creates .context/ structure

# 2. Plan first feature
/ctx:epic "Product catalog with search"
# Discusses requirements, scope, risks

/ctx:breakdown epic-product-catalog
# Creates tasks 001-008

# 3. Start working
/ctx:progress
# Review: 8 pending tasks

/ctx:task 001
# Work on: "Create Product entity and repository"
# Complete acceptance criteria...

/ctx:sync
# Archives task 001 to tasks-done/

# 4. Continue
/ctx:progress
# Review: 7 pending tasks

/ctx:task 002
# Next task...
```

---

## Tips & Best Practices

### Vision Phase
- ✅ Be specific about target users (not "everyone")
- ✅ Separate MVP from full vision clearly
- ✅ Choose realistic timeline based on scope
- ❌ Don't skip MVP definition - it keeps scope manageable

### Architecture Phase
- ✅ Choose patterns that match your scale
- ✅ Simpler is better for MVPs (not everything needs DDD)
- ✅ Align with your existing knowledge
- ❌ Don't over-engineer early - patterns can evolve

### Techstack Phase
- ✅ Use "default" for common choices to save time
- ✅ Align with architecture (e.g., NestJS for hexagonal backend)
- ✅ Consider team expertise
- ❌ Don't choose bleeding-edge for production MVPs

### Epic Phase
- ✅ Listen to risk warnings
- ✅ Consider suggested alternatives
- ✅ Keep scope tight for first epic
- ❌ Don't plan everything upfront - one epic at a time

### Breakdown Phase
- ✅ Review task complexity estimates
- ✅ Check dependencies between tasks
- ✅ Verify acceptance criteria are clear
- ❌ Don't start working until all tasks are created

### Working Phase
- ✅ Use `/ctx:progress` to consciously choose tasks
- ✅ Complete one task fully before moving to next
- ✅ Run `/ctx:sync` regularly to track progress
- ❌ Don't skip acceptance criteria - they define "done"

---

## Troubleshooting

### Issue: "Vision is too vague"
**Solution**: Re-run `/ctx:vision` with more specific description, or answer questions more precisely.

### Issue: "Too many tasks created"
**Solution**: Epic scope might be too large. Consider splitting into multiple smaller epics.

### Issue: "Don't know which architecture to choose"
**Solution**: For MVPs, start simple (layered backend, feature-modules frontend). You can evolve later.

### Issue: "Techstack questions overwhelming"
**Solution**: Say "default" for common choices. The skill provides smart defaults based on your vision.

---

## Next Steps

After completing this workflow:
1. ✅ Start working on tasks with `/ctx:task [number]`
2. ✅ Plan your next feature with `/ctx:epic`
3. ✅ Document decisions with `/ctx:log-decision`
4. ✅ Track progress with `/ctx:progress` and `/ctx:sync`

---

## Quick Reference

| Step | Command | Time | Output |
|------|---------|------|--------|
| Vision | `/ctx:vision "idea"` | 5-10 min | `.context/vision.md` |
| Architecture | `/ctx:architecture` | 5-10 min | `.context/patterns-architecture.md` |
| Techstack | `/ctx:techstack` | 5-10 min | `.context/.project-init.md` |
| Init | `/ctx:context-init` | 1 min | `.context/` folder |
| Epic | `/ctx:epic "feature"` | 10 min | `.context/plans/epic-*.md` |
| Breakdown | `/ctx:breakdown epic-*` | 5 min | `.context/tasks/*.md` |
| Progress | `/ctx:progress` | 1 min | View pending tasks |
| Work | `/ctx:task [num]` | Varies | Complete task |
| Sync | `/ctx:sync` | 1 min | Archive completed |

**Total Setup Time**: 15-30 minutes
**Then**: Start building!
