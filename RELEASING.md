# Releasing

How to version, bump, tag, and release the plugins in this repository.

This repo is a **single marketplace (`tdp-plugins`) hosting multiple plugins**. Today
those are:

| Plugin   | Path             | Role                                            |
| -------- | ---------------- | ----------------------------------------------- |
| `ctx`    | `plugins/ctx`    | Flagship — task-driven development workflow      |
| `libref` | `plugins/libref` | Library/framework reference guides              |

Each plugin is versioned **independently**. The repo's release cadence is driven by
`ctx` (the flagship), and the git tag / GitHub release tracks the `ctx` version unless
a release is explicitly scoped to another plugin (see [Tagging](#tagging)).

There is no build, test, or lint step — this is a documentation-driven package. A
"release" is: bump the version numbers, write the changelog, commit, tag, push, and
(for notable releases) publish a GitHub release.

---

## 1. Semantic Versioning for a docs-driven plugin

We follow [SemVer](https://semver.org/) — `MAJOR.MINOR.PATCH` — but applied to skill
**behavior** rather than a compiled API. Decide the bump by the largest applicable change:

- **MAJOR** (`x.0.0`) — breaking changes to how the plugin works:
  - Removing or renaming a skill, or changing its `/ctx:` trigger name.
  - Breaking a [file contract](plugins/ctx/shared/conventions/file-contracts.md)
    (changing a file format other skills read/write incompatibly).
  - Restructuring `.context/` in a way that invalidates existing user projects.
- **MINOR** (`x.y.0`) — backward-compatible additions or behavior changes:
  - Adding a new skill.
  - Adding a new mandatory or optional step to an existing skill.
  - New templates, conventions, or workflows that don't break existing usage.
- **PATCH** (`x.y.z`) — backward-compatible fixes:
  - Wording/clarity fixes, typo fixes, path-resolution bug fixes, tightened
    instructions that don't add new behavior.

When unsure between two levels, pick the higher one.

---

## 2. Files to bump

When bumping a plugin's version, update **all** of the following. The lists differ per
plugin because the marketplace manifest holds an entry per plugin.

### Bumping `ctx`

- `plugins/ctx/.claude-plugin/plugin.json` → `version`
- `.claude-plugin/marketplace.json` → `plugins[].version` for the `ctx` entry
- `.claude-plugin/marketplace.json` → `metadata.version` *(mirrors the `ctx` version — see note below)*
- `plugins/ctx/CHANGELOG.md` → add a new version section
- `plugins/ctx/README.md` → the `Current version:` line (and any badge/header)

### Bumping `libref`

- `plugins/libref/.claude-plugin/plugin.json` → `version`
- `.claude-plugin/marketplace.json` → `plugins[].version` for the `libref` entry
- `plugins/libref/CHANGELOG.md` → add a new version section
- `plugins/libref/README.md` → version reference, if present

> **Note on `metadata.version`:** the marketplace's own `metadata.version` currently
> mirrors the `ctx` version (the flagship). Bump it alongside `ctx`. A `libref`-only
> release does **not** change `metadata.version`.

Sanity-check that nothing was missed:

```bash
grep -rn '"version"' .claude-plugin/marketplace.json plugins/*/.claude-plugin/plugin.json
```

---

## 3. CHANGELOG format

Each plugin keeps its own `CHANGELOG.md` in [Keep a Changelog](https://keepachangelog.com/)
format. Add a new section at the **top**, above the previous version:

```markdown
## [2.1.0] - 2026-06-30

### Added
- **Short bold lead-in** — what changed and why it matters to a user.

### Changed
- ...

### Fixed
- ...

### Removed
- ...

---
```

Rules:

- Use the real release date (`YYYY-MM-DD`).
- Only include the section headers (`Added`/`Changed`/`Fixed`/`Removed`) you actually use.
- Write entries from the **user's** perspective (what the skill now does), not the
  implementation diff.

---

## 4. Release checklist

```bash
# 0. Work on a branch (never commit releases directly to master if avoidable)
git checkout -b release/ctx-2.1.0

# 1. Bump every file in §2 for the plugin you're releasing
# 2. Add the CHANGELOG section (§3)
# 3. Review the diff
git diff

# 4. Commit (Conventional Commits; scope by plugin)
git add -A
git commit -m "chore(ctx): release v2.1.0"

# 5. Open a PR into master and merge (or fast-forward master if working solo)

# 6. Tag the merge commit on master (annotated) — see §5 for the tag scheme
git checkout master && git pull
git tag -a v2.1.0 -m "v2.1.0: <one-line summary of the release>"

# 7. Push the tag
git push origin v2.1.0

# 8. For notable releases, publish a GitHub release — see §6
```

---

## 5. Tagging

Tags are **annotated** (`git tag -a`), never lightweight.

**Tag naming:**

- **`ctx` releases** (the default): `v<version>` — e.g. `v2.1.0`.
  This is the historical convention; a bare `v…` tag always refers to the `ctx` plugin.
- **`libref` (or any non-flagship) releases:** prefix with the plugin name to avoid
  collisions — `libref-v<version>` — e.g. `libref-v0.2.0`.

**Tag message:** `v<version>: <one-line summary>`, e.g.

```
v2.1.0: /ctx:task briefs the user and reconciles approach before implementing
```

Gather the changes for the summary with:

```bash
git log --oneline <prev-tag>..HEAD
```

> **Known gap:** tags `v2.0.1`–`v2.0.6` were never created (the convention drifted).
> Don't backfill them — just keep the process consistent from here forward.

---

## 6. GitHub releases

Create a GitHub release for:

- **Major releases** (`x.0.0`), and
- any release where the user explicitly asks for one.

Minor/patch releases only need a tag, not a GitHub release (though you may publish one
if it carries user-facing notes worth surfacing).

```bash
# Generate notes by reviewing commits since the previous tag
git log --oneline <prev-tag>..HEAD

gh release create v2.1.0 \
  --title "v2.1.0" \
  --notes "$(cat <<'EOF'
### Added
- ...

### Changed
- ...

### Fixed
- ...
EOF
)"
```

Group notes under **Added / Changed / Fixed / Removed** (Keep a Changelog format),
summarizing all notable changes since the previous release.

---

## 7. Quick reference

| Step              | Command / file                                                        |
| ----------------- | --------------------------------------------------------------------- |
| Pick bump level   | §1 — major / minor / patch                                            |
| Bump versions     | §2 — `plugin.json`, `marketplace.json` (×2 for ctx), `README.md`      |
| Changelog         | §3 — new top section in the plugin's `CHANGELOG.md`                   |
| Commit            | `chore(<plugin>): release v<version>`                                 |
| Tag               | `git tag -a v<version> -m "v<version>: <summary>"` (`libref-v…` for libref) |
| Push tag          | `git push origin <tag>`                                               |
| GitHub release    | §6 — majors or on request, via `gh release create`                   |
