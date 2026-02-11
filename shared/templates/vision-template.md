# Vision Template

This template is used for creating or updating the project vision file at `.context/vision.md`. The vision captures project goals, scope, and target users.

---

# Vision

## Summary
[One sentence describing what you're building]

## Target Users
[Who is it for - not technical audience]

## Scale
[personal / small-team / startup / enterprise / public-facing]

## Timeline
[prototype / MVP / full product]

## MVP Scope
- Feature 1
- Feature 2
- Feature 3

## Full Vision
- All MVP features
- Plus: Additional feature 1
- Plus: Additional feature 2

---

## Usage Notes

**Scale Options:**
- `personal-use` - For your own use
- `small-team` - Internal team tool (< 20 users)
- `startup` - Growing product (20-1000 users)
- `enterprise` - Large organization (1000+ users)
- `public-facing` - Public product/service

**Timeline Options:**
- `prototype` - Weekend project to validate idea
- `MVP (2 weeks)` - Quick minimum viable product
- `MVP (1 month)` - More complete MVP
- `full product (3+ months)` - Complete feature set
- `no deadline` - Ongoing development

**MVP vs Full Vision:**
- **MVP Scope** - The minimum features needed to launch and validate
- **Full Vision** - The complete feature set when fully built out

**When updating:**
Add a changelog entry:

```markdown
## Changelog

### [YYYY-MM-DD] Change Title
- Changed: [what changed]
- From: [old value]
- To: [new value]
- Reason: [why - from user's answer]
- Impact: [affected epics/tasks/patterns]
- Decision: See decisions.md [YYYY-MM-DD]
```

**Extraction Note:**
When extracted from existing project, add:
```markdown
---
*Extracted from existing project on [YYYY-MM-DD]*
```
