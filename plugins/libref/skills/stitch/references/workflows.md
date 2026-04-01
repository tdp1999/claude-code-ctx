# Stitch Workflows

Detailed step-by-step workflows for common Stitch MCP operations.

---

## Workflow 1: Full Project from Scratch

**Goal:** Create a multi-screen app design with consistent theme.

```
Step 1: Create project
  → create_project(title: "My SaaS Dashboard")
  → Extract projectId from name

Step 2: Generate screens one at a time
  → generate_screen_from_text(projectId, prompt: "Login page with email/password, social login buttons, and forgot password link", deviceType: "DESKTOP")
  → generate_screen_from_text(projectId, prompt: "Main dashboard with sidebar nav, KPI cards row, and activity feed", deviceType: "DESKTOP")
  → generate_screen_from_text(projectId, prompt: "Settings page with profile form, notification preferences, and danger zone", deviceType: "DESKTOP")
  Note: Wait for each to complete before starting next. Each takes 1-3 min.

Step 3: Create design system
  → create_design_system(projectId, designSystem: {
      displayName: "SaaS Dark Theme",
      theme: { colorMode: "DARK", headlineFont: "INTER", bodyFont: "INTER",
               roundness: "ROUND_EIGHT", customColor: "#6366f1", colorVariant: "VIBRANT" }
    })
  → Immediately: update_design_system(name: "assets/{assetId}", projectId, designSystem: same)

Step 4: Apply design system to all screens
  → get_project(name: "projects/{projectId}")
  → Extract screenInstances (id + sourceScreen for each)
  → apply_design_system(projectId, assetId, selectedScreenInstances: [
      { id: "instance1", sourceScreen: "projects/{p}/screens/{s1}" },
      { id: "instance2", sourceScreen: "projects/{p}/screens/{s2}" },
      ...
    ])

Step 5: Review and iterate
  → list_screens(projectId) to see all screens
  → edit_screens for refinements
```

---

## Workflow 2: Design Exploration with Variants

**Goal:** Explore different design directions for a key screen.

```
Step 1: Generate a base screen
  → generate_screen_from_text(projectId, prompt: "Hero section for developer portfolio with name, tagline, and project highlights")

Step 2: Generate variants with different focuses
  → generate_variants(projectId, selectedScreenIds: [baseScreenId],
      prompt: "Explore different visual styles",
      variantOptions: { variantCount: 3, creativeRange: "EXPLORE", aspects: ["LAYOUT", "COLOR_SCHEME"] })

Step 3: For a radical alternative
  → generate_variants(projectId, selectedScreenIds: [baseScreenId],
      prompt: "Completely reimagine the hero section layout",
      variantOptions: { variantCount: 2, creativeRange: "REIMAGINE", aspects: ["LAYOUT"] })

Step 4: Pick the best and refine
  → edit_screens(projectId, selectedScreenIds: [chosenScreenId], prompt: "Refine: increase headline size, add subtle gradient background")
```

---

## Workflow 3: Iterative Screen Refinement

**Goal:** Polish a screen through progressive edits.

```
Step 1: Start with structure
  → generate_screen_from_text(projectId, prompt: "E-commerce product page with image gallery, price, description, size selector, add to cart button, and reviews section", deviceType: "DESKTOP")

Step 2: Fix layout
  → edit_screens(projectId, [screenId], prompt: "Make the image gallery take 60% width on the left, product details 40% on the right. Keep all existing content.")

Step 3: Adjust styling
  → edit_screens(projectId, [screenId], prompt: "Change add-to-cart button to a large, prominent green button. Make price text larger and bold.")

Step 4: Add details
  → edit_screens(projectId, [screenId], prompt: "Add a breadcrumb navigation above the product title. Add 'Free shipping' badge next to price.")

Step 5: Polish
  → edit_screens(projectId, [screenId], prompt: "Add subtle hover states to buttons. Increase spacing between sections for better breathing room.")
```

---

## Workflow 4: Design System First

**Goal:** Establish visual identity before generating screens.

```
Step 1: Create project
  → create_project(title: "Brand Prototype")

Step 2: Create design system with detailed designMd
  → create_design_system(projectId, designSystem: {
      displayName: "Brand Identity",
      theme: {
        colorMode: "DARK",
        headlineFont: "MANROPE",
        bodyFont: "INTER",
        labelFont: "INTER",
        roundness: "ROUND_EIGHT",
        customColor: "#6366f1",
        colorVariant: "VIBRANT",
        overrideNeutralColor: "#0f1117",
        designMd: "# Brand Guidelines\n## Colors\n- Use primary violet for CTAs only\n- Surface hierarchy: stack tonal layers instead of borders\n## Typography\n- Headlines: Manrope, tight letter-spacing\n- Body: Inter for readability\n## Components\n- No solid borders — use background shifts\n- Buttons: gradient fill for primary, ghost for secondary"
      }
    })
  → update_design_system(name: "assets/{assetId}", projectId, designSystem: same)

Step 3: Generate screens — the design system influences generation
  → generate_screen_from_text(projectId, prompt: "...", deviceType: "DESKTOP")
  Note: Screens generated after a design system is set will be influenced by it.

Step 4: Apply design system explicitly if needed
  → get_project → extract instances → apply_design_system
```

---

## Workflow 5: Mobile + Desktop Responsive Pair

**Goal:** Design the same screen for both mobile and desktop.

```
Step 1: Generate desktop version first
  → generate_screen_from_text(projectId,
      prompt: "Dashboard with sidebar navigation, 4 KPI metric cards in a row, data table with pagination, and chart section",
      deviceType: "DESKTOP")

Step 2: Generate mobile counterpart
  → generate_screen_from_text(projectId,
      prompt: "Mobile version of a dashboard: bottom tab navigation, 2x2 grid of KPI cards, scrollable data list (no table), and compact chart. Keep the same content as the desktop version.",
      deviceType: "MOBILE")

Step 3: Apply same design system to both
  → get_project → apply_design_system with both screen instances
```

---

## ID Extraction Cheat Sheet

| Need | Get From | Extract |
|---|---|---|
| projectId | `project.name` = `"projects/123"` | `"123"` |
| screenId | `screen.name` = `"projects/123/screens/abc"` | `"abc"` |
| assetId | `designSystem.name` = `"assets/456"` | `"456"` |
| instanceId | `get_project().screenInstances[].id` | Use directly |
| sourceScreen | `get_project().screenInstances[].sourceScreen` | Use directly (full path) |
