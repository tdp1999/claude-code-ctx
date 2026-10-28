# Checklist Binding

Optional. Lets a project point ctx at the Owner's own phase checklist, so `epic`,
`breakdown`, and `task` know which steps the current phase asks for and who does each
one. Without the binding, every skill behaves exactly as it does without this file.

ctx never owns, edits, or ticks the checklist. It reads a slice of it.

---

## Turning it on

The project adds one line to `.context/ctx-config.md`:

```
checklist: ~/path/to/checklist-folder
```

Optionally a second line names the project's profile inside that folder:

```
checklist-profile: projects/<project>.md
```

No file, or no `checklist:` line → the binding is off. Say nothing about it.

---

## The checklist folder

The folder belongs to the Owner and is the same for every project. ctx relies on two
things in it:

1. **Size files** named `checklist-size-<s|m|l>.md`. Each phase is a heading
   `## N. <Phase name> | <Role>`, followed by a gate line, an optional output line, and
   a table whose columns include a done mark, the step, who does it, and who checks it.
2. **A map file** `ctx-map.md` that tells ctx how to read the folder:

```markdown
# ctx map

## Phases
- epic: 1, 2, 3, 4 (rows about rules and examples)
- breakdown: none (the checklist has no row for slicing; skip the end-of-phase report)
- task: 5, 6, 7 (only when the task releases itself)

## Columns
- doer: <header of the "who does it" column>
- checker: <header of the "who checks it" column>
- claude: <every doer value that means Claude or a machine>

## Pointers
- <marker pattern> → <file and section it points to>
```

No `ctx-map.md` → treat the binding as off and tell the Owner once that the folder has
no map.

---

## Reading a slice

1. **Find the size.** Read the `Size:` line under the epic's or task's title (see
   `ownership.md` → Size). No size line → ask the Owner for the size before reading
   anything; do not guess it.
2. **Open one file.** `checklist-size-<size>.md`, lowercase.
3. **Cut the phases this skill owns** (from the map). Read only those `## N.` sections.
   A parenthesis in the map narrows a phase to some of its rows.
   `none` means the skill has no rows: skip the slice and the end-of-phase report.
4. **Follow pointers lazily.** A pointer marker in a row (a lookup table section, a
   profile section) is opened only when Claude is about to do that row. Never preload
   the lookup table or the whole profile.

### Procedures

A procedure pointer (for example `⚙ review`) names a section the map points to. Claude
follows it with these rules:

1. Open the procedure section every time, right before the row. Do not run it from
   memory.
2. Do every step of the procedure. Do not swap a step for a cheaper one, for example
   one reviewer in place of two.
3. A step that cannot run (a tool is missing, a quota ran out) is named in the report
   as skipped, with the reason. The procedure says what to do instead.
4. A reviewer gets only the context packet the procedure describes. Do not give a hint
   about where to look, and do not show one reviewer's findings to another.

The slice is context, not a script. The skill still runs its own steps; the slice tells
it which of the Owner's steps fall inside them, who does each one, and what the gate
line requires.

---

## What the skill does with it

- **Never tick a row.** The done mark is the Owner's. ctx does not edit any file in the
  checklist folder.
- **Respect the doer column.** A row whose doer is the Owner is not done by Claude, even
  when Claude could. Claude prepares what the Owner needs for it and stops.
- **Gate line = exit question.** Before the skill changes a status for this phase, it
  reads the gate line back to the Owner as a question, together with the gates in
  `ownership.md`.
- **Report at the end of the phase** in this shape:

```
Phase 3 · <name>
Gate: <gate line>
Claude did:   <row>, <row>
Owner's rows: <row>, <row>       ← tick these yourself after doing them
Skipped:      <row> (why)
```

Rows are named by a few words of their text, never by a number nobody can see.
