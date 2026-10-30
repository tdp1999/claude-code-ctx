---
name: checklist
description: >-
  The Owner's phase checklist (lanes S, M, L, a lookup table and Claude's playbook). Use it whenever an epic or task has a "Size: S|M|L" line, when another ctx skill (epic, breakdown, task, create-task) reaches a phase step, when the Owner mentions a checklist item by SN (for example "5.1c"), "lane", "checklist", "tra K", "📁 §6", when the Owner asks to set up the checklist for a project ("set up checklist", "checklist setup", "tạo profile"), or when a project has no `.context/checklist-profile.md` yet. Tells Claude which lane to open, how to read an item, when to read the playbook, and how to set up and use the project profile.
---

# Checklist

The Owner's checklist lives in this plugin, in `../../checklist/`:

| File | Content | Reader |
| --- | --- | --- |
| `manifest.json` | The list of lanes (slug, title, path), the lookup path and the format version | Claude, and the portfolio API |
| `lanes/size-s.md`, `size-m.md`, `size-l.md` | The items, one lane per size | Owner |
| `lookup.md` | The lookup table that items point to with `tra X` | Owner, and Claude when an item points to it |
| `playbook.md` | What Claude does at each SN, and the shared procedures | Claude only |
| `templates/profile.md` | The template of a project profile | Claude, when it creates a profile |

The project profile is not in this plugin. Each project keeps it at `.context/checklist-profile.md`.

Claude reads the checklist. Claude never ticks an item and never edits a file in `../../checklist/` during a ticket.

## Changing the checklist

These rules apply only when the Owner asks Claude to edit the checklist files.

1. SNs may be renumbered. A run stores a parsed copy, so old runs never read the files again.
2. In the same commit, keep every `Claude: ⚙ <SN>` line and its playbook entry matched. Run `node checklist/check.mjs` from the plugin folder to find a mismatch.
3. A new or removed lane is a change to `manifest.json`. A lane removed from the manifest is archived on the site. Its old runs stay.
4. If the item format changes, raise the format number. Update the portfolio parser first, then the files. The site rejects a format it does not know and keeps its current copy.

## Turning it off

The binding is on by default.
If `.context/ctx-config.md` has the line `checklist: off`, the binding is off. Then say nothing about the checklist.

## First-time setup

Run this setup once per project. Run it when the Owner asks to set up the checklist, or at the first checklist ticket when the project has no profile.

1. Check `.context/ctx-config.md`. If it has `checklist: off`, stop and say nothing.
2. Check that `.context/checklist-profile.md` exists. If it exists, the setup is done. Skip to the ticket.
3. Tell the Owner in one line that the project has no profile and that you create it now.
4. Copy `../../checklist/templates/profile.md` to `.context/checklist-profile.md`. Put the project name in the title.
5. Fill sections 6, 7, 8 and 10 from the code and the docs: dependencies, technical approach, environments and documents. Write only what you found. Mark each line with its source file.
6. Show those lines to the Owner. The Owner confirms, fixes or deletes each line.
7. Ask the Owner for sections 1, 2 and 9 only: the users, how they work today, and the people involved. Ask at most three questions in one message.
8. Leave sections 3, 4 and 5 empty. They grow ticket by ticket under the Profile protocol.
9. Tell the Owner three facts:
   1. The profile path is `.context/checklist-profile.md`, and the profile is committed with the project.
   2. On the portfolio site, the run's project name is the repo folder name, for example `portfolio`.
   3. The checklist lanes come from this plugin. The Owner edits them here, then presses "Update checklist" on `/checklist/templates`.
10. Do not commit. The Owner commits the profile with the next change.

If a profile exists elsewhere from an older setup, for example in a notes repo, copy its content into the new file instead of asking again. Keep the template's section numbers.

## Lane format

1. The first line of each lane and of `lookup.md` is `<!-- format: N -->`. The current format is 2.
2. A phase is a heading `## N. <Phase> | <Role>`.
3. Under the heading, `**Qua phase khi:**` is the gate line and `**Đầu ra:**` is the output line.
4. An item is a heading `### <SN> <Title>`. A child item is a heading `#### <SN> <Title>`.
5. An item heading without an `Ai làm:` line is a group. Its `####` items are its children. A group has no list and no `Claude:` line.
6. The line `Ai làm: <doer> · Ai kiểm: <checker>` names who does the item and who checks it.
7. The optional line `Claude: ⚙ <SN>` means the playbook has an entry for this item.
8. Then comes a one-sentence description, then the content as a list, then an optional `Ref:` line.
9. A line `---` near the end starts the footer. The footer applies to the whole lane.

## Reading a slice

1. Find the size. Read the `Size:` line under the title of the epic or task. If there is no size line, ask the Owner for the size. Do not guess it.
2. Open `manifest.json`. Find the lane whose slug is `size-<size>`, lowercase, and open its path.
3. Read only the phases that the current skill owns:
   1. `epic`: phases 1, 2, 3 and 4.
   2. `breakdown`: no phase. Skip the slice and the end-of-phase report.
   3. `task`: phases 5, 6 and 7. Phase 7 applies only when the task releases itself.
   4. `create-task`: the `epic` phases and the `breakdown` phases of lane M. A size M task holds both.
4. Follow pointers only when you are about to do that item. Never preload the lookup table, the playbook or the whole profile.

## Pointers

| Marker | Where it points |
| --- | --- |
| `tra X` | Section X of `lookup.md` |
| `📁 §N` | Section N of `.context/checklist-profile.md` |
| `⚙ review`, `⚙ review-round` | The procedure with that name in `playbook.md` → Procedures |
| `Claude: ⚙ <SN>` | The entry `<SN>` under the heading of the current lane in `playbook.md` |

## Doer values

1. A doer that starts with "Claude" means Claude drafts and the Owner decides.
2. "Owner trước; Claude kiểm tra" means the Owner writes first. Claude reviews after. Claude never drafts first.
3. "Owner" means only the Owner does the item. Claude prepares what the Owner needs and stops.
4. "Máy" means a tool runs: tests, lint, type check or build. Claude may run the tool.

## Playbook and procedures

1. For each item with a `Claude:` line, read the playbook entry right before the item. Do not do it from memory.
2. Do every step of a procedure. Do not swap a step for a cheaper one, for example one reviewer in place of two.
3. If a step cannot run (a tool is missing, a quota ran out), name it in the report as skipped, with the reason. The procedure says what to do instead.
4. A reviewer gets only the context packet that the procedure describes.

## What the skill does with the slice

1. The slice is context, not a script. The calling skill still runs its own steps.
2. Respect the doer. If the doer is the Owner, Claude does not do the item, even when Claude could.
3. Read the gate line back to the Owner as a question before the calling skill changes a status for this phase.
4. Report at the end of the phase in this shape:

```
Phase 3 · <name>
Gate: <gate line>
Claude did:   <SN> <title>, <SN> <title>
Owner's items: <SN> <title>       ← tick these yourself after doing them
Skipped:      <SN> <title> (why)
```

## Profile protocol

For each `📁 §N` item, read section N of the profile before you ask the Owner.

1. If the section answers the item and the request shows no change, state the answer as an assumption. Do not ask.
2. If the request shows something new, changed or unusual, quote the profile line. Ask only about the difference.
3. If the section is empty, ask only the G1 questions in `lookup.md` section G that apply to the request.

After the Owner answers, record the answer in one place:

1. Put a stable fact about the project in the profile.
2. Put a fact that is true for one feature only in the epic (E1), not in the profile.
3. If an answer corrects the profile, replace the wrong line.

## Profile upkeep

1. If a profile has many wrong lines, audit it. Walk each section, and the Owner marks each line keep, fix or delete.
2. Rewrite the whole profile only when the project itself changed: a new product, new users or a new stack.
3. Git history keeps the old version. Do not keep a copy.
