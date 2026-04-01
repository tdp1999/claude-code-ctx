# Error Handling Convention

Standard error handling behavior for all libref skills.

---

## Missing References

When a skill needs a reference file that doesn't exist:

1. **Tell the user** which reference is missing and why it's needed
2. **Suggest** creating it or point to where the information can be found
3. **DO NOT** proceed with assumptions — missing references lead to incorrect guidance

**Example:**
```
Cannot find reference: `references/generator-options.md`
This file contains the valid options for the generator command.

You can create it manually or I can scaffold it from the tool's documentation.
```

---

## Unsupported Version or Tool

When the skill detects a version mismatch or unsupported tool configuration:

1. **Report** the detected version vs expected version
2. **Warn** which parts of the guide may not apply
3. **Ask** if user wants to proceed anyway

**Example:**
```
Detected Prisma v6.x but this skill targets v5.x.
Some migration patterns may differ. Proceed with caution?
```

---

## Missing Project Context

When a skill needs project-specific context (e.g., monorepo structure, config files) that isn't available:

1. **List** what context is missing
2. **Suggest** how to provide it (point to relevant config files, docs)
3. **DO NOT** guess project conventions — ask first

---

## Skill Not Applicable

When a skill is triggered but the current project doesn't use the relevant library/framework:

1. **Inform** the user the skill doesn't apply here
2. **Explain** briefly what the skill is for
3. **Stop** — don't try to adapt the skill to a different context
