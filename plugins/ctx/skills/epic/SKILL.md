---
name: epic
description: Plan a size-L feature as an epic (problem, questions, design, rules and examples) where the Owner writes the logic and Claude structures it and asks. Triggers on "epic", "plan feature", "new feature", "feature idea", "I want to build", "let's plan". Use when user describes a feature to implement, even without saying "epic". For breaking into tasks, use /ctx:breakdown after.
argument-hint: "[feature idea or epic file path]"
allowed-tools: Read, Write, Edit, Glob, AskUserQuestion, Task
---

# Epic Generator

Generate or update epic files. Acts as a mini plan-mode: Claude structures the epic, foresees problems, and writes the mechanics; the Owner writes the problem, the choice, and the rules.

## Subagent Usage

See `../../shared/subagents.md` for available subagents.

This skill uses:
- **Explore** (built-in) - For understanding existing code context and related features

**When to use Explore:**
- When epic relates to existing features (e.g., "Extend authentication with 2FA")
- When need to understand how something currently works
- When foresee technical considerations require code analysis

## Error Handling

See `../../shared/conventions/error-handling.md` for general error handling rules.
See `../../shared/conventions/file-contracts.md` for required output sections.
See `../../shared/conventions/spec-quality.md` for the requirement-wording scan.
See `../../shared/conventions/ownership.md` for labels, Owner-first writing, and gates.
See `../../shared/conventions/checklist-binding.md` for the optional checklist slice.

Skill-specific errors:
- **Missing `vision.md`**: Warn user that epic will lack project context. Suggest running `/ctx:start` first, but allow proceeding if user confirms.
- **Missing `patterns-architecture.md`**: Warn that the design section (E5) will be generic. Suggest running `/ctx:start` first.
- **Checklist binding points to a missing folder or file**: Say which path is missing, then continue without the binding.
- **`.context/plans/` doesn't exist**: Suggest running `/ctx:start` (new project) or `/ctx:onboard` (existing project) first
- **Epic file already exists with same name**: Ask user — update existing or create with different name?

## Input

`$ARGUMENTS` can be:
- A feature idea: `/ctx:epic "User authentication"`
- A file path: `/ctx:epic .context/plans/epic-auth.md` (update existing)
- Empty: Ask user what feature to plan

## Step 1: Determine Mode

- **If file path provided:** Enter **Update Mode**
- **If feature idea or empty:** Enter **Create Mode**

---

## Create Mode

Use when creating a new epic from an idea.

The epic is the Owner's document. Claude structures it, finds the gaps, and writes the
mechanics; the Owner writes the logic. Read `../../shared/conventions/ownership.md`
before starting: it defines logic vs mechanics, the labels, and the gates used below.

### Process

1. **Understand the idea:**
   - Read `.context/vision.md`, `.context/patterns-architecture.md`, and
     `.context/domain.md` (if it exists)
   - If user provided idea in `$ARGUMENTS`, use it
   - If empty, ask: "What feature would you like to plan?"
   - **Checklist binding:** if `.context/ctx-config.md` has a `checklist:` line, follow
     `../../shared/conventions/checklist-binding.md` and read the slice for `epic`
     (once the size is known, step 2). Use it as the list of what each step below must
     cover and who does it. Without the line, skip this silently.

2. **Size the work (Owner decides):**
   - Name the risk signs you see (`ownership.md` → Size) and ask the Owner for the size
     and a one-line reason. Write it as the `Size:` line under the title.
   - **Size M or S** → this is not an epic. Say so and suggest `/ctx:create-task` (M) or
     just doing it (S). Continue only if the Owner insists.

3. **Problem, done, scope: the Owner writes (E1–E3):**

   Run the **input pass** of the spec-quality scan
   (`../../shared/conventions/spec-quality.md` → When it runs) over the Owner's own
   wording of the idea. Every smell becomes a question in this step's batch.

   Show the empty E1–E3 skeleton and ask the Owner to fill it, in one batch:
   - The problem in one sentence, the evidence, why now
   - Who has it, where they are, how they cope today
   - What done looks like, with today's number (baseline) and the target
   - In, out, and the situational edge cases (each one: in, out, or open)
   - Anything the input pass surfaced ("faster than what, measured how?")

   Write what the Owner says, labeled `[Owner]`. Then **review by asking**: every gap
   you see (a missing edge case, a measure with no baseline, an affected group nobody
   named) becomes a row in **E4 · Questions**, not a sentence in E1–E3.

4. **Design (E5): options from Claude, the choice from the Owner:**
   - Lay out 2–3 options with pros, cons, blast radius in and out of code, migration,
     and rabbit holes (including edge cases the option itself creates). This part is
     mechanics; write it yourself, using Explore when the code needs a sweep.
   - Warn about risks plainly ("webhooks will arrive twice", "this crosses the billing
     module").
   - Ask the Owner to choose and to give **one sentence of why in their own words**.
     No sentence, no recorded choice. Ask for the appetite too.

5. **Flows and screens (E5): before any rule:**
   - Draft each flow as numbered main steps, then the branches at each step (bad
     input, server error, session expired, no permission, cancel, concurrent edit).
     Label the draft `[Claude-proposed]`; the Owner confirms the steps.
   - Fit the flows to the ticket type: a new feature gets new flows; an upgrade or
     refactor gets the current flows that must not change; a bug fix gets the broken
     flow with the reproduction steps as one branch.
   - List every screen, dialog, error page, email, and notification with an ID and the
     states that apply. A ticket with no UI lists endpoints, events, or messages.
   - Write the data dictionary for new or changed fields. Ask the Owner for meanings
     and labels; never guess a meaning.
   - Add a permission matrix, state diagram, or call sequence only when the feature has
     several roles, an entity lifecycle, or several systems. Every denied cell of the
     matrix needs a rule and an example in E6.
   - Branches that need a decision become questions in E4.

6. **Rules and examples (E6): the Owner writes, Claude completes the mechanics:**
   - Ask for the rules flow by flow and screen by screen. Each rule names the flow or
     screen it belongs to.
   - Ask the Owner for the rules and, per rule, concrete examples with expected
     results, including what the user sees and does next.
   - Claude adds the mechanical examples (boundary values for ranges the Owner defined)
     with the expected value left as `?` unless a rule or answer already fixes it.
   - Every expected value cites `[Owner]`, a rule, or `[Q-n]`. Anything else is `?` plus
     a question in E4.
   - If the Owner asks Claude to draft rules, draft them and label each
     `[Claude-proposed]`.
   - Fill the **Covered by** column of E3 and the **Rules** column of the screen
     table. Check each denied cell of the permission matrix too. An empty cell becomes a
     new rule or a question in E4.

7. **Generate the epic file:**
   - Use `../../shared/templates/epic-template.md`. Filename `epic-<kebab-case-name>.md`
     in `.context/plans/`. Status `draft`.
   - Before saving, run the **draft pass** of the spec-quality scan over **E2** and the
     rules in **E6**. Draft each rule into an EARS pattern, then run both set-level
     checks: if the goal is a measurable improvement, E2 must state the **target
     number**, and at least one rule must cover a failure path. Findings are warnings —
     write the file regardless, and report them in step 9 using the block format from
     Part 4 of the convention, never as prose.

8. **Domain Impact Analysis:**

   After generating the epic, check if this epic introduces or changes business logic:
   - New entities not in `domain.md` Glossary?
   - New flows or variations to existing flows?
   - New business rules or changes to existing rules?
   - New edge cases?

   **If domain impact detected AND `domain.md` exists:**
   - Generate proposed domain changes using the Domain Impact Protocol format (see `/ctx:domain` skill):
     ```
     📘 Glossary — adding: ...
     📋 Flows — updating: ...
     📏 Rules — adding: ...
     ```
   - Present to user: "This epic affects domain logic. Here are the proposed domain changes:"
   - **Wait for user confirmation** — user may modify, approve, or reject
   - Only after approval → update `domain.md` and add changelog entry

   **If domain impact detected AND `domain.md` does NOT exist:**
   - Ask user: "This epic involves business logic (flows, rules, entities). Would you like me to create a domain model (`domain.md`) with the concepts from this epic?"
   - If yes → generate draft `domain.md` → show to user → confirm → write
   - If no → proceed without domain file

   **If no domain impact:**
   - Skip this step silently (do not add "Domain Impact: None" to the epic)

9. **Summarize to user:**
   - Key points of the epic and the main risks
   - Domain changes made (if any)
   - The spec check block from step 7 (one line if clean)
   - **Ownership gate** (`ownership.md` → Gates): list every `[Claude-proposed]` item,
     every `?` expected value, and every open blocking question. If the list is empty,
     ask the Owner whether to move the epic to `ready`. If not, the epic stays `draft`.
   - With the checklist binding on: the end-of-phase report from
     `checklist-binding.md` (Claude did / Owner's rows / skipped).
   - Suggested next step: answer the open questions, or `/ctx:breakdown` once `ready`.

---

## Update Mode

Use when updating an existing epic file.

### Process

1. **Read existing epic:**
   - Display current summary, scope, requirements

2. **Ask what's changing:**
   - "What would you like to update?"
   - "Has the scope changed?"
   - "New rules, answers, or risks discovered?"

3. **Update the file:**
   - Modify relevant sections. The ownership rules apply to edits too: logic changes
     come from the Owner, Claude's drafts are `[Claude-proposed]`, and gaps go to
     **E4 · Questions**.
   - When the Owner answers a question in E4, fill the answer and date, then replace
     the matching `?` values with the answer and cite `[Q-n]`.
   - Changing a rule in E6 after breakdown: list the tasks whose ACs cite that rule ID,
     so the Owner can decide whether to update them.
   - Add changelog entry at bottom:

```markdown
## Changelog

### [YYYY-MM-DD] [Change Description]
- Updated: [what changed]
- Reason: [why]
```

4. **Re-evaluate:**
   - Does the size still hold? Raise it if a new risk sign appeared; never lower it.
   - Any new risks or warnings?
   - Still aligned with vision and architecture?
   - Run the ownership gate again and report what still blocks `ready`.

**Older epics** (with `## High-Level Requirements` and no E-sections): update them in
their own format. Offer once to convert to the E1–E7 layout; convert only on a yes.

---

## Examples

### Create Mode Example

```
User: /ctx:epic "Technicians can split one job across two visits"

Claude reads vision.md, patterns-architecture.md, domain.md.
Claude: "I see money (the invoice is per job) and data migration (one job → many
visits). Which size, and why?"
User: "L, because invoices change."
→ Size: L · invoices change per visit

Claude shows the empty E1–E3 skeleton and asks one batch:
- The problem in one sentence, and the evidence?
- What done looks like, today's number, the target?
- Edge cases: a visit cancelled, a second technician, the job closed mid-visit:
  in, out, or open?
The Owner answers; Claude writes them labeled [Owner].
Claude's review adds Q-1 "Is the invoice sent after each visit or after the last
one?" to E4 instead of writing an answer.

Claude lays out two options with blast radius; the Owner picks B
"because dispatch already thinks in visits". Recorded with that sentence.

The Owner writes R1–R3 with examples. Claude adds boundary examples for "up to 5
visits" with expected = ? → Q-2.

Summary: the epic stays draft. Blocking: Q-1, Q-2, and two [Claude-proposed] edge
cases in E3.
```

### Update Mode Example

```
User: /ctx:epic .context/plans/epic-auth.md

Assistant reads existing epic.

User: "Add social login to scope"

Assistant updates epic:
- Moves "social login" from Out to In (the Owner's own decision, labeled [Owner])
- Adds Q-4 "Which providers?" to E4 instead of choosing them
- Adds new risk about OAuth callback security to E5
- Adds changelog entry

Suggests: "This adds significant complexity - consider keeping as separate epic?"
```

---

## Tips

- This is where the Owner **thinks through** the feature before coding. Challenge it by
  asking: a sharp question in E4 helps more than a well-written rule the Owner never
  wrote
- Foresee problems they might not see (security, scalability, edge cases), and turn
  each one into a question or a risk, not a decision
- Reference architecture from patterns-architecture.md - does feature fit the patterns?
- An epic should be breakdownable into 3-10 tasks
- If epic feels too big (>10 tasks), suggest splitting into multiple epics
- If epic feels too small (<3 tasks), suggest combining with related work
- Status "draft" = still discussing, "ready" = ready to break down into tasks

## Gotchas

- **Domain Impact Protocol requires user confirmation**: When detecting new entities/flows/rules, you MUST show proposed changes and wait for explicit approval before writing to domain.md. Never auto-update.
- **Epic naming collisions**: Check if `epic-<name>.md` already exists before creating. If it does, ask user: update existing or create with different name?
- **Missing .context/plans/ folder**: Cannot write epic without it. Suggest `/ctx:start` or `/ctx:onboard` if the folder structure doesn't exist.
- **Never write `[Owner]` on your own draft**: a blanket "looks good" converts nothing. List what is still `[Claude-proposed]` and ask about those items.
- **Gaps become questions, not answers**: when reviewing the Owner's logic, add a row to E4. Writing the answer into E6 yourself is how a feature ends up with no owner.
- **A choice without the Owner's reason is not recorded**: ask for the one sentence.
- **Never tick the checklist**: with the binding on, the checklist is read-only. Report which rows were Claude's and which are the Owner's; the Owner ticks.
- **XL epics should be split**: If you estimate >10 tasks, propose splitting into 2-3 smaller epics before the user commits to one large one.

