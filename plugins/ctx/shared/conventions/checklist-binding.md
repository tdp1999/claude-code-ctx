# Checklist Binding

Lets `epic`, `breakdown`, `task` and `create-task` know which of the Owner's checklist
items the current phase asks for, and who does each one.

The checklist ships with this plugin in `checklist/`. The `checklist` skill
(`../../skills/checklist/SKILL.md`) holds the whole contract: the lane format, which
phases each skill reads, the pointers, the playbook, the profile protocol, and the
end-of-phase report.

## On or off

1. The binding is on by default.
2. If `.context/ctx-config.md` has the line `checklist: off`, the binding is off. Then
   every skill behaves as without the checklist, and says nothing about it.
3. The project profile lives at `.context/checklist-profile.md`. If it is missing, the
   `checklist` skill creates it at the first checklist ticket.

ctx never ticks an item and never edits the checklist files during a ticket.
