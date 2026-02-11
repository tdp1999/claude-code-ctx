# Smart Defaults Logic

Apply these defaults based on answers from Stage 1 (Vision & Scope).

## By Project Type + Timeline

### Prototype / Personal Use (weekend - 2 weeks)

| Category | Default |
|----------|---------|
| Repository | single-repo |
| Package Manager | npm |
| Language | typescript-loose |
| Linting | eslint-prettier |
| Testing | none-yet |
| Git Workflow | simple-main-only |
| Commits | free-form |
| Hooks | none |
| Containerization | none |

### MVP / Startup (2 weeks - 3 months)

| Category | Default |
|----------|---------|
| Repository | single-repo |
| Package Manager | pnpm |
| Language | typescript-strict |
| Linting | eslint-prettier |
| Testing | vitest |
| Git Workflow | github-flow |
| Commits | conventional-commits |
| Hooks | husky-lint-staged |
| Containerization | docker |

### Enterprise / Production

| Category | Default |
|----------|---------|
| Repository | monorepo-turborepo |
| Package Manager | pnpm |
| Language | typescript-strict |
| Linting | eslint-prettier |
| Testing | vitest + playwright |
| Git Workflow | trunk-based |
| Commits | conventional-commits |
| Hooks | husky-lint-staged |
| Containerization | docker-compose |

---

## By Core Objective

### Landing Page / Marketing Site

| Category | Default |
|----------|---------|
| Framework | astro or nextjs-app-router |
| Styling | tailwind-css |
| Components | shadcn-ui |
| Animation | framer-motion |
| State | none |
| SEO | critical-seo |
| Hosting | vercel |

### SaaS App / Fullstack

| Category | Default |
|----------|---------|
| Approach | nextjs-api-routes or t3-stack |
| Framework | nextjs-app-router |
| Styling | tailwind-css |
| Components | shadcn-ui |
| State | zustand |
| Forms | react-hook-form |
| Database | postgresql |
| ORM | prisma or drizzle |
| Auth | clerk or lucia |
| Hosting | vercel + railway |

### API Backend

| Category | Default |
|----------|---------|
| Runtime | nodejs |
| Framework | fastify or hono |
| API Style | rest |
| Database | postgresql |
| ORM | drizzle |
| Auth | custom-jwt |
| Hosting | railway |

### CLI Tool

| Category | Default |
|----------|---------|
| Build Tool | tsup |
| CLI Framework | commander |
| Distribution | npm-public |
| Module Format | esm-only |

### Library Package

| Category | Default |
|----------|---------|
| Build Tool | tsup |
| Distribution | npm-public |
| Module Format | dual-package |
| Testing | vitest |

### Mobile App

| Category | Default |
|----------|---------|
| Framework | expo |
| Navigation | expo-router |
| Platforms | ios-android |
| State | zustand |

---

## Directory Structure Logic

Source directory structure is determined by **Repository Structure (PS-1)** first, then framework:

### Priority 1: Repository Structure

| Repo Structure | Directory Convention |
|----------------|---------------------|
| monorepo-nx | `apps/[app-name]/`, `libs/[lib-name]/` - Nx workspace structure |
| monorepo-turborepo | `apps/[app-name]/`, `packages/[package-name]/` - Turborepo structure |
| monorepo-pnpm-workspaces | `apps/[app-name]/`, `packages/[package-name]/` - Workspaces structure |
| single-repo | Determined by framework (see below) |

### Priority 2: Framework (for single-repo only)

| Framework | Directory Structure | Note |
|-----------|-------------------|------|
| nextjs-app-router | `app/`, `components/`, `lib/` | App Router convention |
| nextjs-pages | `pages/`, `components/`, `lib/` | Pages Router convention |
| react-vite | `src/` | Standard Vite structure |
| angular | `src/app/` | Angular CLI convention |
| vue-nuxt | `pages/`, `components/`, `composables/` | Nuxt convention |
| vue-vite | `src/` | Standard Vite structure |
| svelte-kit | `src/routes/`, `src/lib/` | SvelteKit convention |
| astro | `src/pages/`, `src/components/` | Astro convention |
| remix | `app/` | Remix convention |

**Important:**
- Nx has strong opinions about structure - always use `apps/` and `libs/` for Nx workspaces
- For monorepos, each app inside follows its framework conventions within its directory
- Don't ask separate source directory question - repo structure + framework determines it

---

## Trade-off Explanations

Use these when user is unsure:

| Choice | Recommendation | Reasoning |
|--------|----------------|-----------|
| prisma vs drizzle | drizzle for performance, prisma for DX | Prisma has better migrations/studio, Drizzle is faster and type-safer |
| vitest vs jest | vitest | Faster, better ESM support, Vite ecosystem |
| pnpm vs npm | pnpm | Faster installs, disk efficient, better monorepo support |
| tailwind vs css-modules | tailwind | Faster development, smaller bundle with purging |
| zustand vs redux | zustand | Simpler API, less boilerplate, good enough for most apps |
| fastify vs express | fastify | Faster, better TypeScript support, modern |
| conventional-commits vs free-form | conventional | Enables automated changelogs, clear history |
