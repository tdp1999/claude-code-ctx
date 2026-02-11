# Question Framework

## Stage 1: Vision & Scope (Always Asked)

| ID | Question | Options |
|----|----------|---------|
| VS-1 | **Core Objective** - What type of project is this? | personal-tool, landing-page, marketing-site, saas-app, e-commerce, api-backend, cli-tool, library-package, mobile-app, fullstack-app, other |
| VS-2 | **Target Users** - Who will use this? | (free text) |
| VS-3 | **Expected Scale** - What's the anticipated usage? | personal-use, small-team (<10), startup (10-100), enterprise (100+), public-facing-high-traffic |
| VS-4 | **Timeline** - What are your time constraints? | prototype-weekend, mvp-2-weeks, mvp-1-month, full-product-3-months, no-deadline |
| VS-5 | **MVP vs Full Vision** - Describe minimum viable features, then complete vision | (free text) |

---

## Stage 2: Project Structure (Always Asked)

| ID | Question | Options |
|----|----------|---------|
| PS-1 | **Repository Structure** - How will you organize the codebase? | single-repo, monorepo-turborepo, monorepo-nx, monorepo-pnpm-workspaces |
| PS-2 | **Package Manager** - Which package manager? | npm, pnpm, yarn, bun |
| PS-3 | **Language** - JavaScript or TypeScript? | typescript-strict, typescript-loose, javascript-with-jsdoc, javascript-plain |
| PS-4 | **Node.js Version** - Which Node version to target? | lts-current (22.x), lts-previous (20.x), latest, specific-version |
| PS-5 | **Framework** (if frontend/fullstack) - Which frontend framework? | nextjs-app-router, nextjs-pages, react-vite, vue-nuxt, vue-vite, svelte-kit, astro, remix, angular, solid-start, vanilla-html, not-applicable |

---

## Stage 3: Developer Experience (Always Asked)

| ID | Question | Options |
|----|----------|---------|
| DX-1 | **Linting & Formatting** - Code quality tools? | eslint-prettier, biome, oxlint-prettier, eslint-only, none |
| DX-2 | **Testing Framework** - How will you test? | vitest, jest, playwright, cypress, none-yet |
| DX-3 | **Git Workflow** - Branching strategy? | trunk-based, gitflow, github-flow, simple-main-only |
| DX-4 | **Commit Convention** - Commit message format? | conventional-commits, gitmoji, semantic, free-form |
| DX-5 | **Pre-commit Hooks** - Enforce standards before push? | husky-lint-staged, lefthook, simple-pre-commit, none |
| DX-6 | **Documentation** - How will you document code? | jsdoc-inline, readme-driven, docs-folder-mdx, storybook, none |

---

## Stage 4: Environment Configuration (Always Asked)

| ID | Question | Options |
|----|----------|---------|
| ENV-1 | **Environment Variables** - How will you manage secrets? | dotenv, dotenv-vault, infisical, platform-native |
| ENV-2 | **Config File Format** - Preferred config format? | json, yaml, toml, js-config |
| ENV-3 | **IDE Standardization** - Enforce editor settings? | vscode-settings, editorconfig-only, no-enforcement |

---

## Stage 5: Dynamic Stack Questions

### Frontend (landing-page, marketing-site, e-commerce-frontend)

| ID | Question | Options |
|----|----------|---------|
| FE-1 | **Styling** | tailwind-css, styled-components, css-modules, scss, emotion, vanilla-css, unocss |
| FE-2 | **Component Library** | shadcn-ui, radix-ui, headless-ui, chakra-ui, mantine, ant-design, material-ui, custom-only |
| FE-3 | **Animation** | framer-motion, gsap, motion-one, css-only, none |
| FE-4 | **State Management** | react-context, zustand, jotai, redux-toolkit, tanstack-query-only, none |
| FE-5 | **Form Handling** | react-hook-form, formik, tanstack-form, native-only |
| FE-6 | **SEO Requirements** | critical-seo, basic-meta, not-important |
| FE-7 | **Internationalization** | next-intl, i18next, no-i18n |
| FE-8 | **Analytics** | vercel-analytics, google-analytics, plausible, posthog, none |

### Backend (api-backend)

| ID | Question | Options |
|----|----------|---------|
| BE-1 | **Runtime** | nodejs, bun, deno |
| BE-2 | **Framework** | express, fastify, hono, nestjs, koa, elysia, vanilla-http |
| BE-3 | **API Style** | rest, graphql, trpc, grpc, mixed |
| BE-4 | **Database** | postgresql, mysql, sqlite, mongodb, planetscale, supabase-postgres, turso-sqlite, none |
| BE-5 | **ORM/Query Builder** | prisma, drizzle, typeorm, knex, kysely, raw-sql |
| BE-6 | **Authentication** | auth0, clerk, supabase-auth, lucia, passport, custom-jwt, none |
| BE-7 | **Caching** | redis, upstash, in-memory, none |
| BE-8 | **Background Jobs** | bullmq, inngest, trigger-dev, none |
| BE-9 | **Real-time Features** | websocket, sse, pusher, ably, none |

### Fullstack (saas-app, fullstack-app, e-commerce)

Ask both Frontend and Backend questions, plus:

| ID | Question | Options |
|----|----------|---------|
| FS-1 | **Fullstack Approach** | nextjs-api-routes, separate-fe-be, t3-stack, blitz, redwood, wasp |
| FS-2 | **API Communication** | trpc, rest-fetch, graphql-client, tanstack-query |
| FS-3 | **File Uploads** | uploadthing, s3-direct, cloudinary, vercel-blob, none |
| FS-4 | **Email Service** | resend, sendgrid, postmark, ses, none |
| FS-5 | **Payment Processing** | stripe, lemonsqueezy, paddle, none |

### CLI/Library (cli-tool, library-package)

| ID | Question | Options |
|----|----------|---------|
| LIB-1 | **Build Tool** | tsup, unbuild, esbuild, rollup, vite-library-mode |
| LIB-2 | **CLI Framework** (if CLI) | commander, yargs, citty, clipanion, oclif |
| LIB-3 | **Package Distribution** | npm-public, npm-private, jsr, github-packages |
| LIB-4 | **Module Format** | esm-only, dual-package, cjs-only |

### Mobile (mobile-app)

| ID | Question | Options |
|----|----------|---------|
| MOB-1 | **Framework** | react-native, expo, flutter, capacitor, tauri-mobile |
| MOB-2 | **Navigation** (if RN/Expo) | react-navigation, expo-router |
| MOB-3 | **Target Platforms** | ios-android, ios-only, android-only |

---

## Stage 6: Deployment (Conditional)

| ID | Question | Condition | Options |
|----|----------|-----------|---------|
| DEP-1 | **Frontend Hosting** | If frontend exists | vercel, netlify, cloudflare-pages, aws-amplify, self-hosted |
| DEP-2 | **Backend Hosting** | If backend exists | railway, render, fly-io, aws-ecs, digital-ocean, self-hosted-vps |
| DEP-3 | **Database Hosting** | If database selected | neon, supabase, planetscale, railway-postgres, aws-rds, self-hosted |
| DEP-4 | **CI/CD Platform** | Always | github-actions, gitlab-ci, circleci, none-yet |
| DEP-5 | **Containerization** | If backend/self-hosted | docker, docker-compose, kubernetes, none |
