---
name: techstack
description: Select or update concrete tools and technologies for a project. Reads vision.md and patterns.md for smart defaults. Exports to .project-init.md. Can add new tools mid-project. Supports extract mode for existing projects.
argument-hint: '[optional: --add <tool> | --extract]'
---

# Techstack Selection

Select concrete tools and technologies for your project. Provides smart defaults based on vision and architecture.

## Subagent Usage

See `../../_shared/subagents.md` for available subagents.

This skill uses:

- **Explore** - For extract mode (scanning config files, dependencies)
- **package-installer** - When user wants to add new packages

## Reference Files

- `references/questions.md` - Complete question framework for all stages
- `references/smart-defaults.md` - Smart default logic based on project type
- `assets/output-template.md` - Template for the output file

## Input

`$ARGUMENTS` can be:

- Empty: Full wizard or review existing
- `--add <tool>`: Add new tool to existing techstack (e.g., `--add redis`)
- `--extract`: Extract techstack from existing project

## Step 1: Read Context

Before starting, read these files if they exist:

- `.context/vision.md` - For project type, scale, timeline
- `.context/patterns-architecture.md` - For architecture style (hexagonal, microservices, etc.)

Use these to provide smart defaults (see `references/smart-defaults.md`).

## Step 2: Detect Mode

Check if `.project-init.md` exists:

- **If `--extract` flag:** Enter **Extract Mode** (for existing projects)
- **If exists:** Enter **Update/Review Mode**
- **If not exists:** Enter **Create Mode**

---

## Process Overview (Create Mode)

| Stage | Section              | Questions                  |
| ----- | -------------------- | -------------------------- |
| 1     | Project Structure    | 5 questions                |
| 2     | Developer Experience | 6 questions                |
| 3     | Environment Config   | 3 questions                |
| 4     | Stack-Specific       | Dynamic based on vision    |
| 5     | Deployment           | Conditional based on stack |

## Create Mode Instructions

### Before Starting

1. **Read context files:**
    - If `.context/vision.md` exists, read it for: project type, scale, timeline
    - If `.context/patterns-architecture.md` exists, read it for: backend/frontend architecture style

2. **Ask about pre-filled decisions:**

```
Do you have any technical decisions already made?
(e.g., "I want to use Nx with Angular" or "Must use PostgreSQL")

If yes, list them now. If no, we'll explore options together.
```

**Process pre-filled answers:**

1. Parse user's decided technologies
2. Map them to relevant question IDs (e.g., "Angular" → PS-5, "Nx" → PS-1)
3. Mark these questions as pre-answered
4. Skip these questions in later stages

### Starting the Wizard

Introduce the wizard (note: Vision & Scope is now handled by `/ctx:vision`):

```
I'll guide you through selecting tools and technologies:
1. Project Structure (monorepo, package manager, language, framework)
2. Developer Experience (linting, testing, git workflow)
3. Environment Configuration
4. Stack-Specific Choices (based on your architecture)
5. Deployment

You can say "default" to accept suggestions, "skip" to move on, or "back" to revisit.
```

### Stage Execution

For each stage:

1. Read the questions from `references/questions.md`
2. **Filter out pre-answered questions** from the user's initial tech decisions
3. Present remaining questions in the section at once
4. Apply smart defaults from `references/smart-defaults.md` based on earlier answers
5. After answers, summarize what was captured (including pre-answered items)
6. Move to next stage

**Note on PS-5 (Framework):** Only ask if project has frontend/fullstack component. Directory structure is determined by PS-1 (repo structure) first, then framework - see smart-defaults.md for hierarchy.

### Dynamic Branching (Stage 5)

Based on Core Objective from Stage 1, ask the relevant stack questions:

- **Frontend** (landing-page, marketing-site): Frontend questions
- **Backend** (api-backend): Backend questions
- **Fullstack** (saas-app, fullstack-app, e-commerce): Both + integration questions
- **CLI/Library** (cli-tool, library-package): Library questions
- **Mobile** (mobile-app): Mobile questions

### Interaction Commands

| Command   | Action                                        |
| --------- | --------------------------------------------- |
| `default` | Accept suggested defaults for current section |
| `skip`    | Move to next section without answering        |
| `back`    | Return to previous section                    |

### Generating Output

After all stages:

1. Display complete summary as formatted tables
2. Ask: "Does this look correct? Any changes?"
3. If confirmed, create `.project-init.md` using template from `assets/output-template.md`
4. Fill in all [PLACEHOLDERS] with actual answers

### Smart Defaults Logic

Reference `references/smart-defaults.md` for default recommendations based on:

- Project type (prototype vs production)
- Scale (personal vs enterprise)
- Timeline (weekend vs months)

### Pre-filled Answer Mapping

Map common technology mentions to question IDs:

**Frameworks:**

- "Next.js" / "Nextjs" → PS-5 (nextjs-app-router or nextjs-pages)
- "React" / "Vite" → PS-5 (react-vite)
- "Vue" / "Nuxt" → PS-5 (vue-nuxt or vue-vite)
- "Angular" → PS-5 (angular)
- "Svelte" / "SvelteKit" → PS-5 (svelte-kit)

**Repo Structure:**

- "Nx" / "NX" → PS-1 (monorepo-nx)
- "Turborepo" → PS-1 (monorepo-turborepo)
- "monorepo" / "mono-repo" → PS-1 (suggest based on context)

**Databases:**

- "PostgreSQL" / "Postgres" → BE-4 (postgresql)
- "MySQL" → BE-4 (mysql)
- "MongoDB" / "Mongo" → BE-4 (mongodb)
- "Supabase" → BE-4 (supabase-postgres) + BE-6 (supabase-auth)

**Package Managers:**

- "pnpm" → PS-2 (pnpm)
- "yarn" → PS-2 (yarn)
- "bun" → PS-2 (bun)

### Tips

- Present questions conversationally, not as a rigid form
- Explain trade-offs when options aren't obvious
- Provide recommendations with brief reasoning when user is unsure
- Briefly confirm what was captured before moving to next section
- When user provides pre-filled answers, acknowledge them and skip those questions

---

## Extract Mode

Use when onboarding an existing project (`--extract` flag or called from `/ctx:onboard`).

### Process

1. **Use Explore subagent to scan configuration files:**

**Prompt for Explore:**

```
Extract technology stack from this project:

1. package.json (if exists):
   - dependencies → frameworks, libraries
   - devDependencies → dev tools, testing
   - scripts → build/test/dev commands
   - engines → Node version

2. Lock files:
   - package-lock.json → npm
   - pnpm-lock.yaml → pnpm
   - yarn.lock → yarn
   - bun.lockb → bun

3. Monorepo configs:
   - nx.json → NX monorepo
   - turbo.json → Turborepo
   - pnpm-workspace.yaml → pnpm workspaces
   - lerna.json → Lerna

4. TypeScript/Language:
   - tsconfig.json → TypeScript config
   - jsconfig.json → JavaScript
   - Check strictness settings

5. Linting/Formatting:
   - .eslintrc.* → ESLint
   - .prettierrc.* → Prettier
   - biome.json → Biome

6. Testing:
   - jest.config.* → Jest
   - vitest.config.* → Vitest
   - playwright.config.* → Playwright
   - cypress.json → Cypress

7. CI/CD:
   - .github/workflows/ → GitHub Actions
   - .gitlab-ci.yml → GitLab CI
   - .circleci/ → CircleCI

8. Containerization:
   - docker-compose.yml → Docker Compose
   - Dockerfile → Docker
   - .dockerignore

9. Database/ORM:
   - Dependencies: prisma, typeorm, mongoose, drizzle-orm
   - Config files: prisma/, ormconfig.json

Return structured findings with versions.
```

2. **Present findings to user:**

```markdown
Detected technology stack:

**Repository:**

- Structure: [monorepo-nx / single-repo / etc.]
- Package Manager: [pnpm / npm / yarn / bun]
- Language: [typescript-strict / typescript-loose / javascript]

**Frontend:** (if detected)

- Framework: [Angular 17 / React 18 / Next.js 14 / etc.]
- Styling: [Tailwind CSS / CSS Modules / etc.]
- State: [NgRx / Zustand / Redux / etc.]

**Backend:** (if detected)

- Runtime: [Node.js 20 / Bun / Deno]
- Framework: [NestJS 10 / Express / Fastify / etc.]
- Database: [PostgreSQL via Prisma / MongoDB via Mongoose / etc.]

**Testing:**

- Unit: [Vitest / Jest]
- E2E: [Playwright / Cypress]

**CI/CD:**

- [GitHub Actions / GitLab CI / etc.]

**Containerization:**

- [Docker Compose / Docker / none]

Is this correct? Anything missing or incorrect?
```

3. **Create .project-init.md with confirmed data:**
    - Use existing `assets/output-template.md` format
    - Fill in detected values
    - Mark extracted items
    - Add note: "Extracted from existing project on [date]"

4. **Suggest package installation if needed:**
    - If user mentions missing tools, offer to use `package-installer` subagent

---

## Update/Review Mode

When `.project-init.md` exists:

### If `--add <tool>` flag provided

User wants to add a new tool (e.g., Redis, a new database, etc.):

1. **Understand the tool:**
    - What category? (database, caching, messaging, etc.)
    - Why adding it?
    - How does it fit with existing stack?

2. **Check compatibility:**
    - Read existing `.project-init.md`
    - Verify no conflicts with current tools
    - Check if it aligns with architecture in `patterns-architecture.md`

3. **Update `.project-init.md`:**
    - Add tool to appropriate section
    - Note when it was added
    - Add integration notes if needed

4. **Suggest next steps:**
    - Installation commands
    - Configuration needed
    - Files to create/update

### If no flags (review mode)

User wants to review or make general updates:

1. **Display current stack:**
    - Show all tools and versions from `.project-init.md`

2. **Ask:**
    - "What would you like to update?"
    - "Need to add, remove, or upgrade anything?"

3. **Process changes:**
    - For upgrades: Check compatibility, update version
    - For removals: Warn about dependencies, remove if confirmed
    - For additions: Same as `--add` flow

---

## Tips

- Always read vision.md and patterns-architecture.md first for context
- Use smart-defaults.md to provide relevant suggestions
- In update mode, be conservative - don't suggest changes unless asked
- When adding tools mid-project, consider existing architecture
- This skill focuses on "what tools" - architecture skill handles "how they're organized"
