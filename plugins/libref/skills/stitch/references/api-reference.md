# Stitch MCP API Reference

Complete reference for all Google Stitch MCP tools, parameters, and enums.

---

## Tools Overview

| Tool | Purpose | Long-running? |
|---|---|---|
| `create_project` | Create a new project container | No |
| `get_project` | Get project details + screen instances | No |
| `list_projects` | List all accessible projects | No |
| `list_screens` | List screens in a project | No |
| `get_screen` | Get screen details (HTML, screenshot) | No |
| `generate_screen_from_text` | Generate new screen from prompt | **Yes (1-3 min)** |
| `edit_screens` | Edit existing screens with prompt | **Yes (1-3 min)** |
| `generate_variants` | Create design variants of screens | **Yes** |
| `create_design_system` | Create a new design system | No |
| `update_design_system` | Update/persist a design system | No |
| `list_design_systems` | List design systems for a project | No |
| `apply_design_system` | Apply design system to screens | **Yes** |

---

## Project Tools

### create_project
```
Params:
  title: string (optional) — project title
Returns:
  Project object with name: "projects/{projectId}"
```

### get_project
```
Params:
  name: string (required) — "projects/{projectId}"
Returns:
  Project with: title, designTheme, screenInstances[], deviceType, visibility, timestamps
  screenInstances[]: { id, sourceScreen, width, height, x, y, hidden? }
```

### list_projects
```
Params:
  filter: string (optional) — "view=owned" (default) or "view=shared"
Returns:
  projects[]: array of Project objects
```

---

## Screen Tools

### list_screens
```
Params:
  projectId: string (required) — raw ID, no "projects/" prefix
Returns:
  screens[]: { name, title, deviceType, width, height, htmlCode.downloadUrl, screenshot.downloadUrl }
```

### get_screen
```
Params:
  name: string (required) — "projects/{projectId}/screens/{screenId}"
  projectId: string (required) — raw project ID
  screenId: string (required) — raw screen ID
Returns:
  Screen object with HTML download URL and screenshot URL
```

### generate_screen_from_text
```
Params:
  projectId: string (required) — raw ID
  prompt: string (required) — text description of desired UI
  deviceType: DeviceType (optional)
  modelId: ModelId (optional)
Returns:
  Screen object. May include output_components with suggestions.
Note: Takes 1-3 minutes. DO NOT RETRY on timeout.
```

### edit_screens
```
Params:
  projectId: string (required)
  selectedScreenIds: string[] (required) — screen IDs (not instance IDs)
  prompt: string (required) — what to change
  deviceType: DeviceType (optional)
  modelId: ModelId (optional)
Note: Takes 1-3 minutes. DO NOT RETRY on timeout.
```

### generate_variants
```
Params:
  projectId: string (required)
  selectedScreenIds: string[] (required)
  prompt: string (required)
  variantOptions: VariantOptions (required)
  deviceType: DeviceType (optional)
  modelId: ModelId (optional)
```

---

## Design System Tools

### create_design_system
```
Params:
  projectId: string (optional) — omit for global design system
  designSystem: DesignSystem (required)
    displayName: string (required)
    theme: DesignTheme (required) — see DesignTheme below
Returns:
  Design system with name: "assets/{assetId}"
IMPORTANT: Must call update_design_system immediately after.
```

### update_design_system
```
Params:
  name: string (required) — "assets/{assetId}"
  projectId: string (required)
  designSystem: DesignSystem (required) — same schema as create
```

### list_design_systems
```
Params:
  projectId: string (optional) — omit for global; provide for project-scoped
Returns:
  designSystems[]: { name, designSystem, version }
```

### apply_design_system
```
Params:
  projectId: string (required)
  assetId: string (required) — raw ID, no "assets/" prefix
  selectedScreenInstances: SelectedScreenInstance[] (required)
    Each: { id: instanceId, sourceScreen: "projects/{p}/screens/{s}" }
    Get these from get_project response, NOT from list_screens.
```

---

## Enums

### DeviceType
| Value | Description |
|---|---|
| `DEVICE_TYPE_UNSPECIFIED` | Default |
| `MOBILE` | Mobile device |
| `DESKTOP` | Desktop device |
| `TABLET` | Tablet device |
| `AGNOSTIC` | Not tied to specific device |

### ModelId
| Value | Description |
|---|---|
| `MODEL_ID_UNSPECIFIED` | Stitch picks (default) |
| `GEMINI_3_FLASH` | Fast generation |
| `GEMINI_3_1_PRO` | High quality |
| ~~`GEMINI_3_PRO`~~ | **Deprecated** — do not use |

### Font
Available fonts for `headlineFont`, `bodyFont`, `labelFont`:

**Sans-serif:** `INTER`, `DM_SANS`, `GEIST`, `IBM_PLEX_SANS`, `LEXEND`, `MANROPE`, `MONTSERRAT`, `NUNITO_SANS`, `PLUS_JAKARTA_SANS`, `PUBLIC_SANS`, `RUBIK`, `SORA`, `SOURCE_SANS_THREE`, `SPACE_GROTESK`, `SPLINE_SANS`, `WORK_SANS`, `BE_VIETNAM_PRO`, `EPILOGUE`, `HANKEN_GROTESK`, `ARIMO`, `METROPOLIS`

**Serif:** `NOTO_SERIF`, `NEWSREADER`, `DOMINE`, `LIBRE_CASLON_TEXT`, `EB_GARAMOND`, `LITERATA`, `SOURCE_SERIF_FOUR`

### ColorMode
| Value | Description |
|---|---|
| `LIGHT` | Light mode |
| `DARK` | Dark mode |

### ColorVariant
| Value | Description |
|---|---|
| `MONOCHROME` | Single-hue palette |
| `NEUTRAL` | Subdued, balanced |
| `TONAL_SPOT` | Material 3 default |
| `VIBRANT` | Bold, saturated |
| `EXPRESSIVE` | Artistic, high-contrast |
| `FIDELITY` | True to seed color |
| `CONTENT` | Derived from content |
| `RAINBOW` | Multi-hue spectrum |
| `FRUIT_SALAD` | Playful multi-hue |

### Roundness
| Value | Description |
|---|---|
| `ROUND_FOUR` | 4px corners |
| `ROUND_EIGHT` | 8px corners |
| `ROUND_TWELVE` | 12px corners |
| `ROUND_FULL` | Fully rounded (pill shape) |
| ~~`ROUND_TWO`~~ | Deprecated |

### VariantOptions
```
variantCount: 1-5 (default: 3)
creativeRange: REFINE | EXPLORE (default) | REIMAGINE
aspects[]: LAYOUT | COLOR_SCHEME | IMAGES | TEXT_FONT | TEXT_CONTENT
```

| Creative Range | Description |
|---|---|
| `REFINE` | Subtle refinements, close to original |
| `EXPLORE` | Balanced exploration (default) |
| `REIMAGINE` | Radical changes, fundamentally different |

---

## DesignTheme Object (Complete)

```json
{
  "colorMode": "DARK",              // required: LIGHT or DARK
  "headlineFont": "MANROPE",        // required: Font enum
  "bodyFont": "INTER",              // required: Font enum
  "roundness": "ROUND_EIGHT",       // required: Roundness enum
  "customColor": "#6366f1",         // required: hex seed color
  "labelFont": "INTER",             // optional: Font enum
  "colorVariant": "VIBRANT",        // optional: ColorVariant enum
  "overridePrimaryColor": "#...",   // optional: hex override
  "overrideSecondaryColor": "#...", // optional: hex override
  "overrideTertiaryColor": "#...",  // optional: hex override
  "overrideNeutralColor": "#...",   // optional: hex override
  "designMd": "# My Design System\n..." // optional: markdown design instructions
}
```

The `designMd` field is powerful — it accepts free-form markdown describing design philosophy, component rules, do's and don'ts, surface hierarchy, etc. Stitch uses this to guide generation quality. See `references/design-system-templates.md` for examples.
