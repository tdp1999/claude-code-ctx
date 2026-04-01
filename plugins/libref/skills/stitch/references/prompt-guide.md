# Stitch Prompt Guide

Best practices for writing effective prompts that produce high-quality Stitch designs.

Source: [Official Stitch Prompt Guide](https://discuss.ai.google.dev/t/stitch-prompt-guide/83844)

---

## The 3-Layer Framework

Structure every prompt with three layers for best results:

### Layer 1: Anatomy (Physical Structure)
Describe the layout and structural elements.

```
"Split-screen dashboard with collapsible sidebar, top header bar, and main content area"
"Single-page landing with hero section, 3-column features grid, testimonials carousel, and CTA footer"
"Mobile app with bottom tab navigation, search header, and scrollable card list"
```

### Layer 2: Vibe (Aesthetic Adjectives)
Use emotional/stylistic descriptors. These drive colors, fonts, spacing, and imagery.

| Vibe Words | Resulting Style |
|---|---|
| minimalist, focused, clean | Whitespace-heavy, muted palette, sans-serif |
| vibrant, encouraging, bold | Saturated colors, energetic typography |
| premium, dark, glassmorphism | Deep backgrounds, frosted surfaces, subtle gradients |
| playful, warm, friendly | Rounded corners, warm palette, illustrated icons |
| editorial, sophisticated | High-contrast typography, magazine-like spacing |
| brutalist, raw, industrial | Monospace fonts, harsh borders, no roundness |

### Layer 3: Content (Domain Context)
Specify the actual data and domain the UI serves.

```
"Real estate listings with price, location, photos, and bed/bath count"
"Fitness tracker showing daily steps, calories, heart rate, and weekly goals"
"SaaS admin panel with user management table, role filters, and bulk actions"
```

### Combined Example
```
"A sophisticated, editorial dark-themed (vibe) portfolio website with asymmetric hero layout,
project showcase grid, and floating navigation (anatomy) for a senior frontend developer
showing 6 featured projects with tech stack tags and live demo links (content)"
```

---

## Prompt Strategies

### Starting a New Project

**Broad start (brainstorming):**
```
"An app for marathon runners"
```
Good for: Initial exploration, getting Stitch to propose structure.

**Detailed start (precise control):**
```
"An app for marathon runners to engage with community, find training partners,
get personalized training advice, and discover upcoming races nearby"
```
Good for: When you know exactly what you want.

### Refining Screens (edit_screens)

**Rule: One or two changes per prompt.**

Good:
```
"On the homepage, add a search bar to the header"
"Change the primary CTA button to larger size using dark blue"
"Make the sidebar collapsible with icon-only mode at 48px width"
```

Bad (too many changes at once):
```
"Add search bar, change all buttons to blue, make sidebar collapsible,
add footer links, change font to Inter, and add a notification bell"
```
This may cause Stitch to regenerate the entire layout.

### Controlling Visual Style

**Colors:**
```
Specific: "Change primary color to forest green (#2d5016)"
Mood-based: "Update to a warm, inviting color palette"
```

**Typography:**
```
"Use a playful sans-serif font for body text"
"Change headings to serif font for an editorial feel"
```

**Borders & Shapes:**
```
"Make all buttons have fully rounded corners"
"Give cards a subtle shadow instead of borders"
```

### Modifying Images

Be specific about WHICH image to change:
```
General: "Change background of all product images to light taupe"
Specific: "On the Team page, update Dr. Carter's image background to match the new theme"
```

When changing themes, coordinate images:
```
"Update theme to warm orange. Ensure all images and icons match the new color scheme"
```

### Changing Language
```
"Switch all product copy and button text to Spanish"
"Translate navigation labels and CTA buttons to Vietnamese"
```

---

## Pro Tips

1. **Start simple, refine incrementally** — A solid base structure is easier to polish than fixing a complex initial prompt
2. **Use UI/UX keywords** — "navigation bar", "call-to-action", "card layout", "hero section", "breadcrumb" help Stitch understand component types
3. **Reference elements specifically** — "the primary button on the sign-up form" not "a button"
4. **Keep prompts under ~5,000 characters** — Longer prompts may cause Stitch to drop components
5. **Describe what to KEEP** — When editing, mention elements that should stay unchanged
6. **Step-by-step for complex screens:**
   - First: Create base structure/layout
   - Then: Add component layers (filters, icons, titles)
   - Finally: Styling adjustments after layout solidifies

---

## Anti-Patterns

| Anti-Pattern | Why It Fails | Instead |
|---|---|---|
| Mega-prompt with 10+ changes | Stitch may recreate layout | One or two changes per edit |
| Vague: "Make it look better" | No direction for the AI | Specify: "Increase whitespace between sections, use darker background" |
| No device context | Layout may not fit target | Always specify DESKTOP/MOBILE/TABLET |
| Referencing "the button" | Ambiguous if multiple exist | "The primary CTA button in the hero section" |
| Mixing structural + style changes | May conflict | Separate: layout first, style second |
