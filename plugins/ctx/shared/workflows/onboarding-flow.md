# Existing Project Onboarding Workflow

Complete workflow for analyzing and documenting existing codebases using the CTX plugin.

## Overview

The onboarding workflow helps you quickly understand and document existing projects. It **automatically extracts** project vision, architecture, and tech stack, then sets up the `.context/` structure for ongoing work.

**Flow:** Analyze → Extract → Review → Initialize → Plan

## Workflow Steps

### 1. Analyze the Project

Start with `/ctx:onboard` to begin automated analysis:

```
/ctx:onboard
```

This automatically runs three extraction commands in sequence:
- `/ctx:vision --extract` - Analyzes README, package.json, docs
- `/ctx:architecture --extract` - Maps folder structure, dependencies, patterns
- `/ctx:techstack --extract` - Identifies frameworks, versions, tools

**What it analyzes:**
- README.md, CONTRIBUTING.md, docs/
- package.json, pom.xml, requirements.txt, go.mod
- Source code structure and imports
- Configuration files (.env.example, tsconfig.json, etc.)
- Existing tests and scripts

### 2. Review Extracted Information

Claude presents extracted information in three sections:

**Vision:**
- Project purpose and goals
- Target users
- Key features
- Development philosophy

**Architecture:**
- High-level system design
- Main components/modules
- Data flow patterns
- External dependencies

**Tech Stack:**
- Primary languages and frameworks
- Build tools and package managers
- Testing frameworks
- Infrastructure/deployment tools

**Your role:** Confirm accuracy or provide corrections:
- "That looks correct"
- "Actually, the auth system uses OAuth2, not JWT"
- "Add that we use PostgreSQL for primary database"

### 3. Initialize Context Structure

Once information is confirmed, use `/ctx:init`:

```
/ctx:init
```

This creates the `.context/` directory structure:

```
.context/
├── vision.md                  # Extracted and confirmed
├── patterns-architecture.md   # Extracted and confirmed
├── techstack.md              # Extracted and confirmed
├── getting-started.md        # Generated from package.json scripts
├── commands.md               # Generated from available commands
├── progress.md               # Empty, ready for tasks
├── tasks/                    # Empty, ready for work
├── tasks-done/               # Archive directory
├── epics/                    # Empty, for larger initiatives
└── investigations/           # Empty, for bug investigations
```

### 4. Plan First Improvements

With context in place, create your first epic:

```
/ctx:epic
```

Example first epics:
- **Improve test coverage** - Add missing unit/integration tests
- **Update dependencies** - Upgrade outdated packages
- **Add documentation** - Document undocumented APIs
- **Refactor legacy code** - Modernize old patterns
- **Fix known issues** - Address TODO comments or bug backlog

## Example: Onboarding a Legacy Angular Project

### Step 1: Run Onboarding

```
User: /ctx:onboard
Claude: I'll analyze this project and extract key information...

Analyzing codebase structure...
Found: Angular 12 project with 47 components
Found: NestJS backend in /server directory
Found: Shared monorepo with nx configuration

Extracting vision from README.md...
Extracting architecture from folder structure...
Extracting tech stack from package.json and configs...
```

### Step 2: Review Extracted Info

```
Claude: Here's what I found:

## Vision
Project is an internal employee dashboard for managing HR tasks:
- Employee directory with search/filter
- Time-off request system
- Performance review tracking
- Onboarding checklist for new hires

Target users: HR staff and employees
Philosophy: Mobile-first, accessible, secure

## Architecture
Frontend: Angular SPA with lazy-loaded feature modules
Backend: NestJS REST API
Database: PostgreSQL with TypeORM
Auth: JWT tokens with refresh mechanism

Main modules:
- employees/ - Employee CRUD and directory
- time-off/ - PTO request workflow
- reviews/ - Performance review cycles
- onboarding/ - New hire checklists

## Tech Stack
- Angular: 12.2.0 (needs update to v18+)
- NestJS: 9.0.0
- TypeORM: 0.3.10
- PostgreSQL: 14
- Build: Nx 14.5.0
- Testing: Jest, Cypress
- Deployment: Docker, AWS ECS

Does this look accurate?

User: Yes, but we actually migrated to Angular 15 last month,
      and we use Playwright instead of Cypress now.

Claude: Thanks! I'll update those details.
```

### Step 3: Initialize Structure

```
User: /ctx:init
Claude: Creating .context/ structure with confirmed information...

✅ Created .context/vision.md
✅ Created .context/patterns-architecture.md
✅ Created .context/techstack.md
✅ Created .context/getting-started.md
✅ Created .context/commands.md
✅ Created .context/progress.md
✅ Created task directories

Your project context is ready! Use /ctx:epic to plan your first initiative.
```

### Step 4: Plan Improvements

```
User: /ctx:epic
Claude: What would you like to work on?

User: We need to upgrade Angular to v18 and migrate to standalone components

Claude: Creating epic for Angular upgrade...

✅ Created .context/epics/001-upgrade-angular-18-standalone.md

Epic includes:
- Upgrade Angular 15 → 18
- Migrate to standalone components
- Update routing for standalone
- Remove NgModules
- Update testing setup
- Verify all features work

Estimated: 15 tasks, 2-3 weeks

Ready to break this down into tasks? Use /ctx:breakdown epics/001
```

## Tips for Accurate Extraction

### Before Running Onboard

**Update project documentation:**
- Ensure README is current
- Update package.json description
- Add comments to complex configurations
- Document any non-obvious architectural decisions

**Clean up codebase:**
- Remove dead code that might confuse analysis
- Update outdated comments
- Ensure build scripts work

### During Review

**Be specific with corrections:**
- ❌ "That's not quite right"
- ✅ "We use Redis for session storage, not in-memory"

**Add missing context:**
- Mention if parts of codebase are deprecated
- Note if certain patterns are being phased out
- Identify technical debt areas

**Confirm conventions:**
- Coding standards (ESLint rules, formatters)
- Branch/commit conventions
- Testing requirements
- Code review process

### After Initialization

**Verify generated files:**
- Read through each .context/ file
- Check that commands.md has correct scripts
- Ensure getting-started.md matches actual setup
- Update any auto-generated content that needs refinement

**Add missing patterns:**
- Create additional pattern docs if needed
- Document team-specific conventions
- Add architectural decision records (ADRs)

## Common Scenarios

### Monorepo Projects

Onboarding handles monorepos by:
- Identifying workspace structure (Nx, Turborepo, Lerna)
- Mapping dependencies between packages
- Extracting tech stack per package if varied
- Documenting build/deploy process per app

### Microservices

For microservice architectures:
- Run onboarding in each service repo separately, OR
- Run once at root for overview, document inter-service communication
- Note service boundaries and APIs in architecture
- Document deployment topology

### Missing Documentation

If project has minimal docs:
- Extraction focuses on code analysis
- Package.json and configs become primary source
- May ask more clarifying questions
- Review phase is more critical - add missing context

### Large Codebases

For very large projects:
- Analysis may take longer
- Focus on main directories first
- Can re-run extraction on specific subdirectories
- Break into multiple onboarding sessions if needed

## Post-Onboarding Checklist

After completing onboarding workflow:

- [ ] All .context/ files reviewed and accurate
- [ ] Team members can run getting-started.md successfully
- [ ] Commands.md covers all common development tasks
- [ ] Architecture patterns match actual codebase
- [ ] Tech stack versions are correct
- [ ] First epic created for initial improvements
- [ ] Context files committed to repository
- [ ] Team introduced to CTX workflow

## Maintenance

**Update context when:**
- Major dependencies upgraded
- Architecture changes (new services, refactors)
- Tech stack additions (new tools, frameworks)
- Process changes (new conventions, workflows)

**Quarterly review:**
- Check if vision.md still reflects project direction
- Verify architecture.md matches current structure
- Update techstack.md with version changes
- Archive completed epics and tasks

The onboarding workflow is complete when your team can:
1. Understand the project from .context/ files alone
2. Set up development environment using getting-started.md
3. Run common tasks using commands.md
4. Follow architecture patterns without asking
5. Start planning work with /ctx:epic
