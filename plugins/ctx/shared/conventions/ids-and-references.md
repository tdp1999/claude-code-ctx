# IDs and References

Every epic uses the same ID prefixes. A reader learns them once and reads any epic.
Every reference names its target, so the reader never scrolls to decode an ID.

## ID registry

These prefixes are fixed for every epic. Do not invent a new prefix inside one epic.
A new kind of item needs a new row here first.

| Prefix | Item | English word it stands for | Defined in | Format | Example |
|---|---|---|---|---|---|
| `E` | Epic section | **E**pic section | Template headings | `E0`–`E7` | `E5 Flows and screens` |
| `Q` | Question to the Owner | **Q**uestion | E0 | `Q-n` | `Q-41` |
| `F` | User flow | **F**low | E5 | `Fn`, `Fna` for a variant | `F6 Edit from lookup` |
| `S` | Screen or dialog | **S**creen | E5 | `Sn` | `S6 Lookup page` |
| `R` | Rule | **R**ule | E6 | `Rn` | `R5 Group by person` |
| `R` + `.m` | Example of a rule | **R**ule example | E6, under its rule | `Rn.m` | `R5.4` |
| `P` | Inherited pattern (behavior the feature reuses, not restates) | **P**attern | E6 | `Pn` | `P3 API errors` |
| `AC` | Acceptance criterion | **A**cceptance **C**riterion | E6 | `AC-n` | `AC-7` |
| `DT` | Decision table | **D**ecision **T**able | E6 Test design | `DT-n` | `DT-2 Fields on lookup` |
| `ST` | State transition table | **S**tate **T**ransition | E6 Test design | `ST-n` | `ST-1 Search and filter` |

IDs that live outside the epic always carry their source word:

| Written as | Item | Lives in |
|---|---|---|
| `SR-n` | Project convention | `.context/style-review.md` |
| `bảng tra J4` (`lookup table J4`) | Checklist lookup item | the checklist's lookup table |
| `task 012` | Task file | `.context/tasks/` |

Rules for IDs:

1. Numbers grow from 1 and never get reused. A removed item keeps its number retired.
2. Use a hyphen only for `Q`, `AC`, `DT`, `ST`, `SR`. The others have no hyphen.
3. A size word (`Size: L`) and a phase (`Phase 3`) are always written in full, never as `L3` or `P3`.

## Short names

Every `F`, `S`, `R`, `P`, `DT`, and `ST` item has a short name of 2 to 4 words.
The short name is part of its heading or its definition row.

- ✅ `#### R5 · Group by person`, then the full rule as a bold sentence below.
- ❌ `**R5 · Mặc định thấy mọi sản phẩm của mọi người, nhóm theo người; chip lọc theo một người**` (a sentence, not a name).

## Writing a reference

1. In prose, covers lines, and table cells, write the ID and its short name inside single quotes: `'S6 Lookup page'`, `'R5 Group by person'`. The quotes show where the name ends. Double quotes stay for UI copy.
1a. A heading has no quotes: `#### R5 · Group by person`.
2. In a Source, Covers, or Rule column, and inside a `[citation]`, the bare ID is allowed, because these only trace.
3. `Q-n` and `AC-n` may stay bare in any column. A question or criterion has no short name.
4. Never write a bare ID in a sentence the Owner must understand to decide something.

- ❌ `DT-2 · Bộ trường ở S6 (AC-7)`
- ✅ `*AC-7 · 'S6 Lookup page' · kind × empty field × has note*` under `#### DT-2 · Fields on lookup`

## Headings for navigation

Every section that defines IDs is a heading, so the outline and links can reach it.

1. Each `F`, `R`, `DT`, and `ST` item is its own heading (`####`) in the form `ID · Short name`.
2. `S`, `Q`, `P`, and `AC` items stay as table rows. Their table sits under its own heading.
3. Never use a bold line as a fake heading.
4. Every epic starts with a **Legend**: one row per prefix used, with a link to its defining section.

In Obsidian, link with a heading link: `[[#R5 · Group by person|R5 Group by person]]`.
Hover shows the target without scrolling; `Cmd+Alt+←` returns. Use links in the
Legend and in long-distance references; do not link every Source cell.
