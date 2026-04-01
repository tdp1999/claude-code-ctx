---
name: stitch
description: >
  Google Stitch MCP integration for AI-powered UI design generation. Auto-activates when user
  mentions Stitch, UI prototyping, screen generation, design systems, or wants to create/edit
  visual designs via MCP. Covers project management, screen generation from text, screen editing,
  design system CRUD, variant generation, and multi-screen workflows. Uses Gemini under the hood.
  Triggers: "stitch", "design screen", "generate UI", "create screen", "design system",
  "prototype", "mockup", "UI generation", "/stitch", "screen variant", "vibe design".
  Do NOT trigger for: general CSS/HTML coding, Figma workflows, non-MCP design tools, or manual UI implementation.
---

# Stitch — Google Stitch MCP Integration

Guide for using Google Stitch MCP tools to generate, edit, and manage UI designs programmatically through Claude Code. Stitch is a Google Labs experiment powered by Gemini that converts natural language into functional UI designs and frontend code.

## Activation

Auto-activate when:
- User mentions "Stitch", "stitch project", "stitch screen"
- User wants to generate UI from text descriptions
- User wants to create or apply design systems via MCP
- User wants to create screen variants or explore design alternatives
- Explicit `/stitch` invocation

Do NOT activate for:
- Manual HTML/CSS/component coding (use framework-specific skills)
- Figma, Sketch, or other non-Stitch design tools
- Implementing generated designs into production code (post-Stitch workflow)

## Core Concepts

### What Stitch Does
- **Text → UI**: Describe an app in plain language → get visual interface
- **Iterative Design**: Edit screens with follow-up prompts
- **Design Systems**: Create and apply consistent visual themes (colors, fonts, shapes)
- **Variants**: Generate multiple design alternatives for exploration
- **Export**: Screens produce downloadable HTML code and screenshots

### Resource Hierarchy
```
Project (container)
├── Screen[] (generated UI pages)
│   ├── htmlCode (downloadable HTML)
│   └── screenshot (downloadable PNG)
├── ScreenInstance[] (positioned screen refs on canvas)
└── DesignSystem[] (theme/tokens applied to screens)
```

### Key Distinctions
- **Screen** = the generated design (has HTML, screenshot, title)
- **ScreenInstance** = a positioned reference to a screen on the project canvas (has id, x, y, width, height)
- **`screen.name`** = full resource path: `projects/{projectId}/screens/{screenId}`
- **`screenInstance.id`** =/= `screenId`. Instance ID is for `apply_design_system`. Screen ID is for `edit_screens` and `generate_variants`.
- **DesignSystem `name`** = `assets/{assetId}` — extract assetId (without prefix) for apply/update operations

## Workflow: Quick Start

### 1. New Project + First Screen
```
1. create_project(title: "My App")
   → save projectId from response name: "projects/{projectId}"
2. generate_screen_from_text(projectId, prompt, deviceType: "DESKTOP")
   → wait 1-3 min. DO NOT RETRY on timeout.
3. get_project(name: "projects/{projectId}")
   → see all screenInstances with positions
```

### 2. Create & Apply Design System
```
1. create_design_system(projectId, designSystem: {...})
   → returns asset name: "assets/{assetId}"
2. IMMEDIATELY call update_design_system(name: "assets/{assetId}", projectId, designSystem)
   → required to persist and display
3. get_project → collect screenInstance IDs and sourceScreen paths
4. apply_design_system(projectId, assetId, selectedScreenInstances: [...])
```

### 3. Edit Existing Screens
```
1. list_screens(projectId) → extract screenIds from screen name paths
2. edit_screens(projectId, selectedScreenIds: [...], prompt: "Make header sticky, add search bar")
   → wait 1-3 min. DO NOT RETRY.
```

### 4. Generate Variants
```
generate_variants(projectId, selectedScreenIds: [...],
  prompt: "Explore different hero layouts",
  variantOptions: { variantCount: 3, creativeRange: "EXPLORE", aspects: ["LAYOUT"] })
```

Reference: `references/workflows.md` for detailed multi-step flows.

## The 3-Layer Prompt Framework

Stitch responds best to prompts structured with three layers:

1. **Anatomy** — Physical layout and structure
   - "Split-screen dashboard with sidebar navigation and main content area"
   - "Single-page landing with hero, features grid, testimonials, and footer"

2. **Vibe** — Emotional/aesthetic descriptors (adjectives drive styling)
   - "Minimalist and focused" → clean whitespace, muted palette
   - "Vibrant and encouraging" → bold colors, energetic typography
   - "Glassmorphism, premium dark" → frosted surfaces, deep backgrounds

3. **Content** — Domain-specific data context
   - "Real estate listings with price, location, bed/bath count"
   - "Marathon runner community with training plans and race finder"

**Example combining all three:**
```
"A minimalist and focused meditation app (vibe) with a card-based layout
and bottom navigation (anatomy) showing daily sessions, streak counter,
and guided meditation library (content)"
```

Reference: `references/prompt-guide.md` for detailed prompting strategies.

## Gotchas

### Critical: Timing & Retries
- `generate_screen_from_text` and `edit_screens` take 1-3 minutes. **Never retry on timeout** — generation may still succeed server-side.
- If timeout occurs, use `get_screen` or `list_screens` later to check.

### Critical: Screen ID vs Instance ID
- `edit_screens` and `generate_variants` use **screen IDs** (from `list_screens` or extracted from `screen.name`)
- `apply_design_system` uses **screen instance objects** with `id` (instance ID) and `sourceScreen` (full screen resource name) — get these from `get_project` response

### Critical: Design System Create → Update
- After `create_design_system`, you **MUST** call `update_design_system` immediately to persist and display it in the UI
- `list_design_systems` requires `projectId` — calling without it may error

### Critical: Long Prompts
- Prompts over ~5,000 characters may cause Stitch to omit components
- Start simple, then refine with incremental edit prompts

### Important: Model Selection
- Default: unset (Stitch picks)
- Available: `GEMINI_3_FLASH` (fast), `GEMINI_3_1_PRO` (quality)
- `GEMINI_3_PRO` is **deprecated** — do not use

### Important: One Major Change at a Time
- For `edit_screens`, make one or two changes per prompt
- Multiple simultaneous changes may cause Stitch to recreate the entire layout
- Describe what to change AND what to preserve

### Important: output_components
- `generate_screen_from_text` may return `output_components` with text or suggestions
- If suggestions are returned (e.g., "Yes, make them all"), present them to the user
- If user accepts a suggestion, call `generate_screen_from_text` again with suggestion as prompt

### Minor: Project IDs
- All tool params expect **raw IDs without prefix**: `4044680601076201931`, not `projects/4044680601076201931`
- Extract from resource `name` field by splitting on `/`

## Error Handling

Follow `shared/conventions/error-handling.md`. Additionally:

- **MCP connection failure**: Inform user Stitch MCP server may not be configured. Suggest checking MCP settings.
- **"Invalid argument" errors**: Usually means required field missing or ID includes prefix (e.g., `projects/`).
- **Timeout on generation**: Do NOT retry. Inform user and suggest checking back with `get_screen`/`list_screens`.
- **Empty/missing screens after generation**: The process may still be running. Wait and retry `list_screens`.

## Logging

Follow `shared/conventions/logging-convention.md` with skill name `libref:stitch`.
