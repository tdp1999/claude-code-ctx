# Contributing to TDP Plugins

Thank you for your interest in contributing! This guide will help you get started.

## How Can I Contribute?

### Reporting Bugs

- Use [GitHub Issues](https://github.com/tdp1999/claude-code-ctx/issues) to report bugs
- Check existing issues first to avoid duplicates
- Include steps to reproduce, expected behavior, and actual behavior

### Suggesting Features

- Open a [GitHub Issue](https://github.com/tdp1999/claude-code-ctx/issues) with the "enhancement" label
- Describe the use case and why it would be valuable
- Be specific about the expected behavior

### Submitting Changes

1. Fork the repository
2. Create a feature branch from `master` (`git checkout -b feature/my-feature`)
3. Make your changes
4. Commit with a descriptive message following [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(ctx): add new skill for X`
   - `fix(ctx): resolve issue with Y`
   - `docs(ctx): update skill documentation`
5. Push to your fork and open a Pull Request

## Project Structure

This is a **documentation-driven plugin** — there is no build system or test suite.

```
plugins/
  ctx/                    # Main CTX plugin
    .claude-plugin/       # Plugin manifest
    skills/               # Skill implementations (each skill = folder with SKILL.md)
    shared/               # Templates, conventions, workflows
    references/           # Examples and diagrams
  libref/                 # Library reference plugin
```

## Skill Development

Each skill lives in `plugins/ctx/skills/<skill-name>/` with at minimum a `SKILL.md` file. When creating or modifying skills:

- Follow existing skill patterns for consistency
- Check `shared/conventions/file-contracts.md` for inter-skill dependencies
- Update the plugin manifest if adding new skills
- Add examples in the skill's `references/` subfolder if applicable

## Style Guidelines

- Use clear, concise language in skill definitions
- Follow naming conventions in `shared/conventions/task-naming.md`
- Keep templates minimal — avoid over-prescribing structure

## Version Bumping

If your change warrants a version bump, update ALL of:
- `plugins/ctx/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `plugins/ctx/CHANGELOG.md`
- `plugins/ctx/README.md` (if applicable)

## Questions?

Feel free to open an issue or reach out at tdp99.business@gmail.com.
