# Available Subagents

When a skill needs to perform specialized work, use the Agent tool with the appropriate `subagent_type` instead of doing it manually. This is more efficient and reduces context usage.

Agents fall into two categories:
- **Built-in agents**: Always available in any Claude Code environment
- **Project-specific agents**: Only available if configured in the project's `.claude/agents/` directory. Skills should check for their existence before using them, and gracefully skip if not found.

---

## Built-in Agents

These agents are part of Claude Code and always available.

### Explore
**Use for:** Fast codebase exploration, finding files, understanding patterns, searching code
**When:**
- Analyzing existing code structure
- Finding implementations or patterns
- Understanding how something works
- Any open-ended search that may require multiple rounds

**Example prompts:**
- "Analyze the folder structure and detect architecture patterns"
- "Find how authentication is currently implemented"
- "Search for all API endpoints and their handlers"

**Prefer over:** Manual Glob/Grep/Read calls for exploration tasks

---

### Plan
**Use for:** Designing implementation approaches for complex tasks
**When:**
- Task requires architectural decisions
- Multiple valid approaches exist
- Need to consider trade-offs

**Example prompts:**
- "Design an approach for implementing user authentication with JWT"
- "Plan the refactoring of the payment module to hexagonal architecture"

---

### general-purpose
**Use for:** Research, complex multi-step tasks, web searches
**When:**
- Need to research external information
- Task doesn't fit other specialized agents

**Example prompts:**
- "Research best practices for rate limiting in Node.js"
- "Find documentation for this library's authentication flow"

---

### package-installer
**Use for:** Installing, updating, or adding dependencies with proper version compatibility
**When:**
- New package needs to be installed
- Version compatibility matters (Angular ecosystem, React peer deps, etc.)
- Package requires setup beyond installation (Tailwind, UI frameworks)
- Upgrading or migrating packages

**Example prompts:**
- "Install Tailwind CSS with proper configuration for this Angular project"
- "Add @tanstack/react-query compatible with our React version"

**Prefer over:** Manual pnpm/npm/yarn commands for package installation

---

## Project-Specific Agents

These agents are **NOT built-in**. They are only available if the project or user has configured them in `.claude/agents/`. Before using these agents, skills MUST verify they exist. If not found, skip and inform the user.

### test-runner
**Use for:** Running the test suite and reporting results
**When:**
- After completing a feature or bug fix
- Need to verify changes don't break existing functionality
- Reproducing a failing test

**Example prompts:**
- "Run tests and report results"
- "Run tests for the auth module"

**Requires:** Agent definition in `.claude/agents/` AND test framework configured in project
**If not available:** Skip test running. Inform user they can run tests manually or configure a test-runner agent.

---

### build-validator
**Use for:** TypeScript type checking and production build validation
**When:**
- After completing a feature
- Before marking a task as done
- Checking if changes cause type errors

**Example prompts:**
- "Validate types and build"
- "Check for TypeScript errors"

**Requires:** Agent definition in `.claude/agents/` AND TypeScript/build configuration in project
**If not available:** Skip build validation. Inform user they can validate manually or configure a build-validator agent.

---

## How to Use in Skills

Reference this file and list only the agents your skill actually uses:

```markdown
## Subagent Usage

See `../../shared/subagents.md` for available subagents.

This skill uses:
- **Explore** (built-in) - For [specific use case]
- **test-runner** (project-specific) - For [specific use case]
```

Then invoke via the Agent tool:

```
Use the Agent tool with subagent_type="Explore" to analyze the codebase structure.
```

### Handling Missing Project-Specific Agents

Before using a project-specific agent, check if it exists:

1. Look for the agent definition in `.claude/agents/`
2. If found: use it normally
3. If NOT found: skip the agent step and inform the user:
   ```
   Note: Skipping [agent-name] — no agent definition found in .claude/agents/.
   You can configure one to enable automatic [testing/validation/etc.].
   ```
