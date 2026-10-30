# Playbook

Claude reads this file. The Owner does not.

A lane item with a `Claude: ⚙ <SN>` line has an entry here.
Find the entry under the heading of the current lane, then the SN.
Read the entry right before you do the item. Do not do the item from memory.
The lane item still holds the goal, the output and the exit conditions. This file only adds how Claude does it.

## Procedures

Lane entries point to these procedures by name.

### review

Use this procedure for an item that says `⚙ review: <question>`. The text after the colon is the question for the reviewers.

1. Run two reviewers independently: a fresh Claude subagent and Codex.
2. Give both reviewers the same context packet: the ticket goal, the output under review (spec, diff, tests), the related rules and edge cases, and the question of the item.
3. Do not put your own opinion or conclusion in the packet. Do not hint where to look.
4. Do not show one reviewer's findings to the other.
5. In the main thread, merge the results and drop duplicates.
6. Check each finding against the code and the spec. Mark it correct, wrong or unsure.
7. Do not turn a finding into a decision. The Owner keeps, drops or defers each finding.
8. If Codex is out of quota or fails, run the Claude subagent only. Write "Codex missing" in the report. Do not replace Codex with a second Claude.

Codex call (read-only, no file edits): `node <codex plugin>/scripts/codex-companion.mjs task --fresh "<context packet>"`.

### review-round

Use this procedure for an item that says `⚙ review-round`. Run the `review-round` skill after you generate a batch of code or tests. Run it before the Owner looks at the batch and before a commit.

1. Pack one bundle file: the goal, the spec examples, the diff, the related repo rules and the test run output.
2. Run two reviewers in parallel. A Claude subagent checks traceability to the examples, the repo rules and the reasons tests went red. Codex looks for a wrong implementation that still passes the tests.
3. Reviewers do not run tests.
4. Check each finding. Write correct or wrong, with the reason.
5. Fix the correct findings, then run the tests again.
6. Ask the Owner only the product-level decisions: a change to what the user sees, or to an approved spec. Put them in part 1 of the verdicts file.
7. Write every file the Owner must read in `.context/tmp/` of the repo.
8. Put a coverage card at the top of each verdicts file. List each angle reviewed, the finding count per angle, and each angle not reviewed.
9. Use the angles of the round:
   1. R1 runs after the tests are written. It asks one question: do the tests express the phase 4 examples correctly?
   2. R2 runs after the code is written, before the commit. It reviews three angles: correctness against the AC, changes outside the task scope, and the repo rules.
   3. If the slice touches permissions, personal data or redirects, R2 adds a security angle.
   4. If the spec has a performance requirement, R2 adds a performance angle.
10. After R2, a change that alters logic goes through the review step of `/cap`. Do not start a new review-round for it.

### commit-branch

Use this procedure for the commit of a slice and for the fixes after the Owner's review.

1. Write the code in a separate worktree, on the branch of the slice. Example: `feat/<epic>-s1`. For size M, the whole task is one slice. Example: `feat/<task>`.
2. Never commit to master.
3. Run R2 of the review-round procedure. Fix the correct findings.
4. If the review produced a product-level decision, ask the Owner before the commit.
5. Run `/cap --skip-review`. The review-round was deeper than the review step of `/cap`.
6. Split the commits by layer: shared, API, console, landing, e2e. Each commit holds the code of its layer and the tests of that code, so each commit is green on its own.
7. The Owner approves the commit list and the messages. Then `/cap` commits and pushes the branch.
8. While the Owner reviews each commit, say which files need a careful read and which only need a skim. Do not write a review map file.
9. If the Owner asks for fixes, make the fixes and collect them. Run `/cap --fixup` once at the end of each review pass.
10. `/cap --fixup` squashes each fix into the original commit of its layer. Keep the original message.
11. If a fix does not change logic, run `/cap --fixup --skip-review`. If a fix changes logic, keep the review step of `/cap`. A CI fix follows the same rule.
12. After an autosquash, push with `--force-with-lease`. Use it only on the slice branch, never on master.
13. Merge the branch into master only after phase 6 is done.

### regression-scan

1. Use grep and `git log` to find each place that uses the function, component or endpoint that changed.
2. Give the Owner the list, most-used first.
3. Do not open the places for the Owner. The Owner tries at least one by hand.

## Lane S

### 6.2c

Run the regression-scan procedure.

## Lane M

### 1.2

1. Wait until the Owner has written the analysis. Do not draft it first.
2. Check the analysis against `lookup.md` section F part 1 and section G2.
3. Mark only the questions that have no answer. Usually 3 or 4 light up. Do not ask all of them.
4. After the Owner confirms, write the result into the Problem and Questions sections of the task.

### 2.1

1. Before you draft, research outside the repo: patterns and similar products.
2. Search the code for a precedent.
3. Write the sources in the draft.
4. Run the review procedure with the question of the item.

### 5.1a

1. Work in a fresh session.
2. Follow `lookup.md` section H.
3. Take each expected value from the phase 4 examples. Do not read it from the existing code.
4. Put the AC ID in each test.
5. Run R1 of the review-round procedure.

### 5.1b

1. Work in a fresh session, separate from the 5.1a session.
2. Read only the spec (the task) and the tests. Do not edit a test.
3. If a test looks wrong, stop and tell the Owner.
4. Run R2 of the review-round procedure, before the commit.
5. Commit through the commit-branch procedure.

### 6.2a

Follow steps 10 and 11 of the commit-branch procedure. If no change alters logic, skip the item and say so.

### 6.2b

Follow steps 8 to 12 of the commit-branch procedure.

### 6.3c

Run the regression-scan procedure. Start from the blast radius of phase 2.

## Lane L

### 1.2

1. Wait until the Owner has written the analysis. Do not draft it first.
2. Check the analysis against `lookup.md` section F part 1 and section G2.
3. Mark only the questions that have no answer. Usually 3 or 4 light up. Do not ask all of them.
4. After the Owner confirms, write the result into E1 to E3 and E0 of the epic.

### 2.1a

1. Before you draft, research outside the repo: patterns and similar products.
2. Search the code for a precedent.
3. Write the sources in the draft.
4. Run the review procedure with the question of the item.

### 5.1a

1. Before each slice, read the related code.
2. Propose the files to change and the test cases for each AC.
3. Write the approved proposal into the Approach section of the task (T3).
4. If a rule that the epic lacks shows up, write it as a question in E0 of the epic. Do not write it into the task.

### 5.1b

1. Work in a fresh session.
2. Follow `lookup.md` section H.
3. Take each expected value from the phase 4 examples. Do not read it from the existing code.
4. Put the AC ID in each test.
5. Run R1 of the review-round procedure.

### 5.1c

1. Work in a fresh session, separate from the 5.1b session.
2. Read only the spec (epic and task) and the tests. Do not edit a test.
3. If a test looks wrong, stop and tell the Owner.
4. Run R2 of the review-round procedure, before the commit. Read profile section 5 for the risk flags.
5. Commit through the commit-branch procedure.

### 6.3a

Follow steps 10 and 11 of the commit-branch procedure. If no change alters logic, skip the item and say so.

### 6.3b

Follow steps 8 to 12 of the commit-branch procedure.

### 6.5c

Run the regression-scan procedure. Start from the blast radius of phase 2.
