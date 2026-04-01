# Design System Templates

Ready-to-use DesignTheme configurations for common project types.

---

## Minimal Dark (Developer/Portfolio)

```json
{
  "displayName": "Minimal Dark",
  "theme": {
    "colorMode": "DARK",
    "headlineFont": "MANROPE",
    "bodyFont": "INTER",
    "labelFont": "INTER",
    "roundness": "ROUND_EIGHT",
    "customColor": "#6366f1",
    "colorVariant": "VIBRANT",
    "overrideNeutralColor": "#0f1117"
  }
}
```

**Best for:** Developer portfolios, tech products, SaaS dashboards.

---

## Clean Light (SaaS/Business)

```json
{
  "displayName": "Clean Light",
  "theme": {
    "colorMode": "LIGHT",
    "headlineFont": "PLUS_JAKARTA_SANS",
    "bodyFont": "INTER",
    "labelFont": "INTER",
    "roundness": "ROUND_EIGHT",
    "customColor": "#2563eb",
    "colorVariant": "TONAL_SPOT"
  }
}
```

**Best for:** B2B SaaS, admin panels, business tools, documentation sites.

---

## Warm Editorial (Blog/Magazine)

```json
{
  "displayName": "Warm Editorial",
  "theme": {
    "colorMode": "LIGHT",
    "headlineFont": "LIBRE_CASLON_TEXT",
    "bodyFont": "SOURCE_SERIF_FOUR",
    "labelFont": "INTER",
    "roundness": "ROUND_FOUR",
    "customColor": "#b45309",
    "colorVariant": "FIDELITY"
  }
}
```

**Best for:** Blogs, editorial sites, content-heavy platforms, book/recipe apps.

---

## Bold Vibrant (Consumer App)

```json
{
  "displayName": "Bold Vibrant",
  "theme": {
    "colorMode": "LIGHT",
    "headlineFont": "MONTSERRAT",
    "bodyFont": "NUNITO_SANS",
    "roundness": "ROUND_FULL",
    "customColor": "#e11d48",
    "colorVariant": "EXPRESSIVE"
  }
}
```

**Best for:** Consumer apps, fitness/health, social platforms, e-commerce.

---

## Monochrome Minimal (Brutalist/Minimal)

```json
{
  "displayName": "Monochrome",
  "theme": {
    "colorMode": "LIGHT",
    "headlineFont": "SPACE_GROTESK",
    "bodyFont": "IBM_PLEX_SANS",
    "roundness": "ROUND_FOUR",
    "customColor": "#18181b",
    "colorVariant": "MONOCHROME"
  }
}
```

**Best for:** Minimal portfolios, art galleries, typography-focused designs.

---

## Finance Dark (Dashboard/Data)

```json
{
  "displayName": "Finance Dark",
  "theme": {
    "colorMode": "DARK",
    "headlineFont": "INTER",
    "bodyFont": "INTER",
    "labelFont": "INTER",
    "roundness": "ROUND_FOUR",
    "customColor": "#2b80cc",
    "colorVariant": "FIDELITY",
    "overrideNeutralColor": "#0f1117",
    "designMd": "# Finance Dashboard Design\n## Surface Philosophy\n- Define boundaries through background shifts, not borders\n- Stack tonal layers: surface → surface_container → surface_container_high\n## Typography\n- Use tight letter-spacing for large numbers\n- Label-sm for timestamps and metadata\n## Components\n- No divider lines between list items — use spacing\n- Primary CTAs: subtle gradient from primary to primary_container"
  }
}
```

**Best for:** Financial dashboards, trading platforms, analytics tools, data-heavy UIs.

---

## Using designMd for Advanced Control

The `designMd` field accepts markdown that deeply guides Stitch's design decisions. Use it when the enum options alone aren't enough.

### Template Structure

```markdown
# Design System: [Name]

## Creative North Star
One sentence describing the overall aesthetic vision.

## Colors & Surfaces
- Surface hierarchy rules (which tokens to use for nesting)
- Border philosophy (no-line rule, ghost borders, etc.)
- Gradient usage guidelines

## Typography
- Headline treatment (letter-spacing, weight)
- Body text rules
- Hierarchy pairing (title + label combinations)

## Components
- Button styles (primary, secondary, ghost)
- Card rules (borders, shadows, spacing)
- Input field treatment
- Custom component descriptions

## Do's and Don'ts
- Do: [positive rules]
- Don't: [anti-patterns to avoid]
```

### Tips for designMd
- Be specific about color tokens (reference `primary`, `surface_container`, etc.)
- Include hex values for key colors so the AI can reference them
- Describe component behaviors, not just appearance
- "No borders" rules are very effective — Stitch tends to over-border by default
- Include spacing philosophy (breathing room, section gaps)
