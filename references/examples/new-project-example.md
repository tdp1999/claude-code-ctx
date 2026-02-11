# Complete Example: Building a Task Manager SaaS

This document walks through a complete real-world project from initial idea to first feature shipped, showing how the CTX plugin helps organize work across multiple sessions.

**Project**: TeamTask - A task management SaaS for remote teams
**Timeline**: 7 sessions over 2 weeks
**Tech Stack**: Next.js 14, TypeScript, Prisma, PostgreSQL, tRPC

---

## Project Overview

**Goal**: Build an MVP task manager with:
- User authentication
- Project/task CRUD
- Team collaboration
- Real-time updates
- Mobile-responsive UI

**Why CTX**: This is a multi-week project with many moving parts. CTX keeps us organized, prevents scope creep, and ensures nothing falls through the cracks.

---

## Session 1: Project Setup (45 minutes)

### Starting Point

Fresh repository, just initialized with Git. No code yet, just an idea.

```bash
$ pwd
/Users/alex/projects/teamtask

$ ls -la
.git/
README.md
```

### Step 1: Define Vision

```bash
$ /ctx:vision "TeamTask - task manager for remote teams"
```

**Conversation:**

```
Claude: I'll help you define the vision for TeamTask. Let me ask some questions:

1. What makes TeamTask different from existing tools like Asana, Trello, or Linear?

User: Focus on simplicity and speed. Remote teams need less friction, not more features.

Claude: Great angle. What's the core problem you're solving?

User: Context switching kills productivity. Too many tabs, too many tools.
      TeamTask should be fast, keyboard-driven, and integrate into existing workflows.

Claude: Who's your target user?

User: Small remote teams (5-20 people), mostly in tech. Product managers,
      engineers, designers working async across timezones.

Claude: For MVP, what's essential vs nice-to-have?

User: Essential: Auth, projects, tasks, comments, assignees, due dates.
      Nice-to-have: Integrations, time tracking, analytics, custom fields.

Claude: Timeline for MVP?

User: 6-8 weeks to launch beta with first 10 teams.
```

**Output Created:**

`.context/vision.md`:
```markdown
# Vision: TeamTask

## The Problem
Remote teams suffer from context-switching fatigue. Current task management
tools are feature-bloated, slow, and require too many clicks to get work done.

## The Solution
TeamTask is a lightning-fast, keyboard-first task manager built for async
remote collaboration. We prioritize speed and simplicity over features.

## Target Users
- Small remote teams (5-20 people)
- Tech companies: product, engineering, design
- Teams working across multiple timezones
- Users frustrated with "enterprise" tools

## Core Principles
1. Speed first - every action < 200ms
2. Keyboard-driven - mouse optional
3. Async-friendly - works across timezones
4. Simple by default - complexity is opt-in

## Success Metrics
- Beta: 10 teams using daily within 8 weeks
- Retention: 70%+ weekly active users
- Speed: Average task creation < 5 seconds

## MVP Scope

### In Scope
- User authentication (email/password)
- Projects and tasks
- Comments and mentions
- Assignees and due dates
- Real-time updates
- Mobile-responsive

### Out of Scope (Phase 2+)
- Third-party integrations
- Time tracking
- Custom fields and workflows
- Analytics dashboard
- API access
```

### Step 2: Define Architecture

```bash
$ /ctx:architecture
```

**Conversation:**

```
Claude: Let's define your technical architecture. What's your experience level
        with the tech stack?

User: Strong in TypeScript/React. Some experience with Next.js. New to tRPC
      but heard it's great for type safety.

Claude: Good choice. For a real-time task manager, I recommend:

        **Frontend**: Next.js 14 (App Router) with React Server Components
        **API**: tRPC for end-to-end type safety
        **Database**: PostgreSQL with Prisma ORM
        **Real-time**: Server-Sent Events or WebSockets via tRPC subscriptions
        **Auth**: NextAuth.js (supports social login expansion later)

        Does this align with your vision?

User: Perfect. Keep it simple for now.

Claude: Let me suggest module structure for task management:

        - `auth/` - Authentication & user management
        - `projects/` - Project CRUD and permissions
        - `tasks/` - Task CRUD, assignments, status
        - `comments/` - Comments, mentions, notifications
        - `realtime/` - WebSocket/SSE handling

        Sound good?

User: Yes, clean separation.

Claude: ⚠️ A few warnings for this architecture:

        1. **Real-time complexity**: Start with polling, add WebSockets later
        2. **Auth security**: Use HTTP-only cookies, not localStorage for tokens
        3. **Database indexes**: You'll need indexes on project_id, assignee_id, due_date
        4. **Optimistic updates**: Critical for "fast" feeling - update UI before server confirms

        Want me to document these?

User: Yes please.
```

**Output Created:**

`.context/patterns-architecture.md`:
```markdown
# Architecture Patterns

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **API**: tRPC for type-safe APIs
- **Database**: PostgreSQL 15 with Prisma ORM
- **Auth**: NextAuth.js with JWT sessions
- **Real-time**: Server-Sent Events (MVP), WebSockets (future)
- **Deployment**: Vercel (frontend), Railway (database)

## Module Structure

### auth/
User authentication, session management, authorization

**Responsibilities:**
- User registration and login
- Session token management (HTTP-only cookies)
- Password hashing (bcrypt)
- Protected route middleware

### projects/
Project management and team permissions

**Responsibilities:**
- CRUD operations for projects
- Team member management
- Permission checks (owner, admin, member)
- Project archiving

### tasks/
Task lifecycle and assignments

**Responsibilities:**
- CRUD operations for tasks
- Status transitions (todo → in_progress → done)
- Assignee management
- Due date tracking
- Task filtering and search

### comments/
Comments and mentions

**Responsibilities:**
- Comment CRUD
- @mentions parsing
- Notification triggers
- Comment threads

### realtime/
Real-time updates

**Responsibilities:**
- SSE connections (MVP)
- Change broadcasting
- Optimistic UI updates
- Connection state management

## Data Model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  projects  ProjectMember[]
  tasks     Task[]
  comments  Comment[]
}

model Project {
  id        String   @id @default(cuid())
  name      String
  members   ProjectMember[]
  tasks     Task[]
}

model ProjectMember {
  projectId String
  userId    String
  role      Role
  project   Project @relation(fields: [projectId])
  user      User @relation(fields: [userId])
  @@id([projectId, userId])
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      Status
  projectId   String
  assigneeId  String?
  dueDate     DateTime?
  project     Project @relation(fields: [projectId])
  assignee    User? @relation(fields: [assigneeId])
  comments    Comment[]

  @@index([projectId])
  @@index([assigneeId])
  @@index([dueDate])
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  taskId    String
  authorId  String
  task      Task @relation(fields: [taskId])
  author    User @relation(fields: [authorId])
}
```

## Critical Patterns

### Optimistic Updates
Update UI immediately, rollback on error:

```typescript
const updateTask = useMutation({
  mutationFn: (data) => trpc.tasks.update.mutate(data),
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['tasks'])

    // Snapshot previous value
    const previous = queryClient.getQueryData(['tasks'])

    // Optimistically update
    queryClient.setQueryData(['tasks'], (old) => ({
      ...old,
      ...newData
    }))

    return { previous }
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['tasks'], context.previous)
  }
})
```

### Auth Middleware
Protect tRPC routes:

```typescript
const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  })
})
```

### Permission Checks
Check project access:

```typescript
async function checkProjectAccess(userId: string, projectId: string) {
  const member = await db.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } }
  })
  if (!member) {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }
  return member.role
}
```

## Security Warnings

⚠️ **Session Storage**
- NEVER store JWT in localStorage (XSS vulnerability)
- Use HTTP-only cookies with SameSite=Lax
- Rotate session tokens on privilege escalation

⚠️ **Database Indexes**
- Tasks will be queried by projectId, assigneeId, dueDate
- Missing indexes = slow queries at scale
- Add indexes BEFORE seeding test data

⚠️ **Input Validation**
- Validate ALL user input with Zod schemas
- tRPC input validation is your first defense
- Never trust client-side validation alone

⚠️ **Real-time Subscriptions**
- Start with polling (simple, works everywhere)
- SSE for unidirectional updates
- WebSockets only when bidirectional needed
- Clean up connections on unmount!
```

### Step 3: Choose Tech Stack

```bash
$ /ctx:techstack
```

**Conversation:**

```
Claude: I see you've mentioned Next.js 14 and tRPC. Let me confirm the full stack:

        **Package Manager**: npm, yarn, or pnpm?

User: pnpm - faster and better disk usage.

Claude: **Testing**: What's your testing strategy?

User: Vitest for unit tests, Playwright for E2E. Focus on critical paths, not 100% coverage.

Claude: **Styling**: Tailwind CSS mentioned. Any component library?

User: Headless UI for accessibility, custom components on top.

Claude: **Linting/Formatting**: Standard setup?

User: ESLint + Prettier, Husky for pre-commit hooks.

Claude: **Deployment**: You mentioned Vercel + Railway?

User: Yes - Vercel for Next.js app, Railway for Postgres. Simple, fast deploys.
```

**Output Created:**

`.context/techstack.md` (full file created with all choices documented)

### Step 4: Initialize Context Structure

```bash
$ /ctx:init
```

**Output:**

```
✅ Created .context/ folder structure:
   - .context/plans/
   - .context/investigations/
   - .context/tasks/
   - .context/tasks-done/
   - .context/workflow.md
   - .context/progress.md
   - .context/decisions.md

📁 Repository now ready for task-driven development!

Next steps:
1. Plan your first feature: /ctx:epic "Feature name"
2. Or investigate existing code: /ctx:onboard
```

### Session 1 Summary

**Time**: 45 minutes
**Files Created**: 6 context files
**Status**: Project foundation established

**What I Learned**: Taking time upfront to define vision, architecture, and tech stack saves huge amounts of time later. The warnings about security and real-time complexity were eye-opening.

---

## Session 2: First Epic - User Authentication (30 minutes)

### Step 1: Create Epic

```bash
$ /ctx:epic "User authentication with email and password"
```

**Conversation:**

```
Claude: Let's plan authentication. A few questions:

        1. Email/password only for MVP, or social login too?

User: Email/password only. Google OAuth in phase 2.

Claude: 2. Password requirements?

User: Minimum 8 characters, at least one number. Keep it simple.

Claude: 3. Email verification required?

User: Yes - can't have fake accounts.

Claude: 4. Password reset flow?

User: Yes, email-based reset.

Claude: 5. Session duration?

User: 30 days, refresh token pattern.

Claude: Great! Here's what I'm thinking for scope:

        **In Scope (MVP)**:
        - User registration with email/password
        - Email verification (send verification link)
        - Login with session cookies
        - Password reset flow
        - Session management (30-day refresh)
        - Protected routes middleware

        **Out of Scope (Phase 2)**:
        - Social login (Google, GitHub)
        - Two-factor authentication
        - Magic link login
        - Remember me option

        Sound good?

User: Perfect scope.

Claude: ⚠️ Let me warn you about common auth mistakes:

        1. **Password Storage**: Use bcrypt with cost factor 10+, NEVER store plaintext
        2. **Session Tokens**: HTTP-only cookies prevent XSS attacks
        3. **Email Verification**: Rate-limit verification emails (max 3/hour per user)
        4. **Password Reset**: Tokens expire in 1 hour, one-time use only
        5. **Timing Attacks**: Don't reveal if email exists during login

        I'll document these in the epic risks section.

User: Thanks, especially the timing attack note - wouldn't have thought of that.

Claude: One more consideration: Will you use NextAuth.js or custom auth?

User: NextAuth.js - less code to maintain, and we can add OAuth later easily.

Claude: Perfect choice. Creates .context/plans/epic-user-authentication.md
```

**Output Created:**

`.context/plans/epic-user-authentication.md`:
```markdown
# Epic: User Authentication

## Summary
Implement secure email/password authentication using NextAuth.js with email
verification, password reset, and session management. Foundation for all
user features in TeamTask.

## Why
Users need secure accounts to access their projects and tasks. Authentication
is the foundation of the entire application - no other features work without it.

## Target Users
All TeamTask users (product managers, engineers, designers on remote teams)

## Scope

### In Scope
- User registration with email/password validation
- Email verification flow with verification links
- Login with secure session cookies
- Password reset via email tokens
- Session management (30-day refresh pattern)
- Protected route middleware for Next.js
- Basic profile management (name, email)

### Out of Scope
- Social login (Google, GitHub) - Phase 2
- Two-factor authentication - Phase 2
- Magic link login - Phase 2
- "Remember me" checkbox - Phase 2
- Account deletion - Phase 2

## High-Level Requirements

1. User can register with email, name, and password
2. Password must be 8+ characters with at least one number
3. Verification email sent on registration (cannot login until verified)
4. User can login with email/password (verified accounts only)
5. Failed login does not reveal if email exists (prevent enumeration)
6. User can request password reset via email
7. Reset tokens expire after 1 hour and are single-use
8. Sessions last 30 days with automatic refresh
9. User can logout (invalidate session)
10. Protected routes redirect to login if not authenticated

## Technical Considerations

### Architecture
- **Module**: auth/ (new module)
- **Integration**: All other modules depend on auth for user context
- **Database**: User table with password hash, email verified flag, verification tokens

### Dependencies
- NextAuth.js v4
- bcrypt for password hashing
- nodemailer for email sending (or email service like SendGrid)
- Prisma schema updates for User model

### Data Model

```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String
  password          String    // bcrypt hash
  emailVerified     DateTime?
  verificationToken String?   @unique
  resetToken        String?   @unique
  resetTokenExpiry  DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

### Email Templates
- Welcome email with verification link
- Password reset email with token link
- Password changed confirmation

## Risks & Warnings

⚠️ **Password Storage**
- NEVER store passwords in plaintext
- Use bcrypt with cost factor 10 minimum (12 recommended)
- Validate password on client AND server (client for UX, server for security)

⚠️ **Session Security**
- Use HTTP-only cookies (prevents XSS access)
- Set SameSite=Lax (prevents CSRF)
- Never store tokens in localStorage
- Rotate tokens on privilege changes

⚠️ **Email Verification**
- Rate-limit verification emails (max 3 per hour per user)
- Tokens should expire (24 hours recommended)
- Tokens should be cryptographically random (use crypto.randomBytes)

⚠️ **Password Reset**
- Reset tokens expire in 1 hour
- Tokens are single-use (invalidate after use)
- Rate-limit reset requests (max 3 per hour)
- Don't confirm if email exists ("If email exists, you'll receive a link")

⚠️ **Timing Attacks**
- Login should take same time whether email exists or not
- Use constant-time comparison for tokens
- Hash password even if user not found (prevents timing enumeration)

⚠️ **Email Deliverability**
- Use established email service (SendGrid, Postmark)
- Configure SPF, DKIM, DMARC records
- Test emails go to spam initially - warm up domain

## Alternatives Considered

### Custom Auth Implementation
- **Pros**: Full control, no external dependencies
- **Cons**: Security is hard, more code to maintain
- **Why not chosen**: NextAuth.js is battle-tested, we can customize as needed

### Clerk or Auth0
- **Pros**: Fully managed, includes UI components
- **Cons**: Expensive at scale, less control, vendor lock-in
- **Why not chosen**: Want to own auth for long-term flexibility

### Magic Link Only
- **Pros**: Simpler UX, no password management
- **Cons**: Users prefer passwords for frequent login, email dependency
- **Why not chosen**: Can add as alternative later, password is more familiar

## Success Criteria

- [ ] User can register, verify email, and login successfully
- [ ] Sessions persist for 30 days across browser restarts
- [ ] Password reset flow works end-to-end
- [ ] All auth routes pass security audit (OWASP top 10)
- [ ] Login time < 500ms (excluding network)
- [ ] Email delivery rate > 95%

## Estimated Complexity
**L (Large)**

**Reasoning**:
- Multiple user flows (register, verify, login, reset)
- Email integration and template creation
- Security considerations require careful implementation
- Testing all edge cases is time-consuming
- Estimated 15-20 hours across 6-8 tasks

## Status
ready

## Created
2026-02-11
```

### Session 2 Summary

**Time**: 30 minutes
**Files Created**: 1 epic file
**Status**: Ready to break down into tasks

**What I Learned**: The epic skill asked questions I hadn't thought through (like timing attacks and email rate limiting). Having these risks documented upfront means I won't forget them during implementation.

---

## Session 3: Task Breakdown (20 minutes)

```bash
$ /ctx:breakdown epic-user-authentication
```

**Output:**

```
Analyzing epic: User Authentication
Reading architecture patterns...
Identifying explicit and implicit tasks...

📋 Creating tasks:

✅ Task 001: Setup auth module structure and dependencies
✅ Task 002: Create User model and Prisma schema
✅ Task 003: Implement registration endpoint with validation
✅ Task 004: Implement email verification flow
✅ Task 005: Implement login endpoint with session handling
✅ Task 006: Implement password reset flow
✅ Task 007: Create protected route middleware
✅ Task 008: Write integration tests for auth flows

Created 8 tasks in .context/tasks/
Updated .context/progress.md

💡 Recommended start: Task 001 (foundation for all other tasks)

⚠️ Note: Task 004 (email) and Task 006 (reset) require email service configuration.
  Consider using development email service (Ethereal) for testing.
```

Let's look at one of the task files created:

`.context/tasks/003-implement-registration-endpoint.md`:
```markdown
# Task: Implement registration endpoint with validation

## Status: pending

## Goal
Create tRPC endpoint for user registration that validates input, hashes password, generates verification token, and sends verification email.

## Context
Part of User Authentication epic. Registration is the entry point for new users. Must prevent duplicate emails, enforce password requirements, and trigger email verification flow.

## Acceptance Criteria
- [ ] tRPC endpoint `auth.register` accepts email, name, password
- [ ] Input validated with Zod (email format, password 8+ chars with number, name 2+ chars)
- [ ] Check if email already exists (return clear error if so)
- [ ] Hash password with bcrypt (cost factor 12)
- [ ] Generate cryptographically random verification token
- [ ] Create User record with emailVerified = null
- [ ] Send verification email with token link
- [ ] Return success (don't send back sensitive data)
- [ ] Handle errors gracefully (DB errors, email errors)

## Technical Notes

**Password Hashing:**
```typescript
import bcrypt from 'bcrypt'
const hashedPassword = await bcrypt.hash(password, 12)
```

**Verification Token:**
```typescript
import crypto from 'crypto'
const token = crypto.randomBytes(32).toString('hex')
```

**Input Schema:**
```typescript
const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8).regex(/\d/, 'Password must contain a number')
})
```

**Security Notes:**
- NEVER return if email exists on error (timing attack prevention)
- Hash password even if email exists (constant-time response)
- Store verification token hashed in DB (in case of DB leak)
- Rate limit this endpoint (max 5 registrations per IP per hour)

Reference: `.context/patterns-architecture.md` auth module patterns

## Files to Touch
- `src/server/routers/auth.ts` (create tRPC router)
- `src/server/services/email.ts` (create email service)
- `src/lib/validation.ts` (shared schemas)
- `prisma/schema.prisma` (verify User model)

## Dependencies
- Task 001 (auth module setup)
- Task 002 (User model)

## Complexity: M

## Progress Log
```

**Check progress:**

```bash
$ /ctx:progress
```

**Output:**

```
📊 TeamTask Progress Report

## Summary
- Total tasks: 8
- Pending: 8
- In Progress: 0
- Completed: 0

## Epics
- epic-user-authentication: 8 tasks (0% complete)

## Pending Tasks (by complexity)

### Small (S)
- 001: Setup auth module structure and dependencies
- 007: Create protected route middleware

### Medium (M)
- 002: Create User model and Prisma schema
- 003: Implement registration endpoint with validation
- 004: Implement email verification flow
- 005: Implement login endpoint with session handling
- 006: Implement password reset flow

### Large (L)
- 008: Write integration tests for auth flows

## Blocked Tasks
None

💡 Recommended start: Task 001 (unblocks 002-007)
```

### Session 3 Summary

**Time**: 20 minutes
**Files Created**: 8 task files
**Status**: Ready to start implementation

**What I Learned**: The breakdown skill caught implicit tasks I missed (like the middleware and comprehensive testing). Each task has clear acceptance criteria - no guessing what "done" means.

---

## Session 4: Working on Tasks - Foundation (2 hours)

```bash
$ /ctx:task 001
```

**Output:**

```
📝 Loading Task 001: Setup auth module structure and dependencies

## Goal
Create auth module folder structure, install dependencies, and configure NextAuth.js base setup.

## Acceptance Criteria
- [ ] Create src/server/modules/auth/ directory structure
- [ ] Install NextAuth.js, bcrypt, nodemailer
- [ ] Create NextAuth config file with email provider
- [ ] Setup API route for NextAuth
- [ ] Create .env.example with auth environment variables
- [ ] Test NextAuth setup (can access /api/auth/signin)

Status updated to: in-progress
Progress log: Started 2026-02-11 14:30
```

**Work session (TDD approach):**

1. Created folder structure
2. Installed dependencies: `pnpm add next-auth bcrypt nodemailer zod`
3. Created `src/app/api/auth/[...nextauth]/route.ts`
4. Configured NextAuth with email provider
5. Added environment variables
6. Tested signin page loads

**Checked off all acceptance criteria, marked task as done:**

```markdown
## Status: done

## Progress Log
- [2026-02-11 14:30] Started task
- [2026-02-11 15:15] Created module structure
- [2026-02-11 15:45] Configured NextAuth, tested signin page
- [2026-02-11 16:00] All criteria met, task complete
```

```bash
$ /ctx:sync
```

**Output:**

```
🔄 Syncing progress...

Completed tasks found:
- 001-setup-auth-module.md

📦 Archiving completed tasks...
✅ Moved 001-setup-auth-module.md to .context/tasks-done/

📊 Updated progress.md:
- Completed: 1/8 tasks (12.5%)
- Epic user-authentication: 12.5% complete

Next recommended task: 002 (Create User model - now unblocked)
```

**Continue with Task 002:**

```bash
$ /ctx:task 002
```

Work session completed User model and Prisma migrations. Synced again.

### Session 4 Summary

**Time**: 2 hours
**Tasks Completed**: 2 (001, 002)
**Progress**: 25% of auth epic
**Status**: Foundation complete, ready for feature implementation

**What I Learned**: TDD approach with clear acceptance criteria made it obvious when I was done. No overthinking or scope creep.

---

## Session 5-6: Core Implementation (6 hours across 2 days)

Completed tasks 003-007 over two sessions:

**Session 5** (3 hours):
- Task 003: Registration endpoint - 1.5 hours
- Task 004: Email verification - 1.5 hours

**Session 6** (3 hours):
- Task 005: Login endpoint - 1.5 hours
- Task 006: Password reset - 1 hour
- Task 007: Protected middleware - 30 minutes

Each session followed same pattern:
1. `/ctx:task [number]`
2. TDD: Red → Green → Refactor
3. Check acceptance criteria
4. Mark done, `/ctx:sync`

**Key moments:**

**Task 004 (Email verification):**
Hit a snag with email deliverability. Remembered the warning in the epic about using an email service. Switched to SendGrid for dev environment. Would have wasted hours debugging if epic hadn't warned me.

**Task 006 (Password reset):**
Almost forgot to make tokens single-use. The acceptance criteria caught it: "Invalidate token after successful reset." Prevented a security bug.

---

## Session 7: Testing and Review (2.5 hours)

```bash
$ /ctx:task 008
```

**Task**: Write integration tests for all auth flows

**Test Coverage:**
- Registration happy path
- Registration with duplicate email
- Email verification flow
- Login with unverified email (should fail)
- Login with correct/incorrect password
- Password reset request
- Password reset with expired token
- Protected route access (authenticated vs not)

All tests passing. Task marked complete.

```bash
$ /ctx:sync
```

**Output:**

```
🔄 Syncing progress...

Completed tasks found:
- 008-write-integration-tests.md

📦 Archiving completed tasks...
✅ Moved 008-write-integration-tests.md to .context/tasks-done/

📊 Updated progress.md:
- Completed: 8/8 tasks (100%)
- Epic user-authentication: 100% complete ✅

🎉 Epic "User Authentication" is complete!

All tasks done:
✅ 001: Setup auth module structure and dependencies
✅ 002: Create User model and Prisma schema
✅ 003: Implement registration endpoint with validation
✅ 004: Implement email verification flow
✅ 005: Implement login endpoint with session handling
✅ 006: Implement password reset flow
✅ 007: Create protected route middleware
✅ 008: Write integration tests for auth flows

Updating epic status to: completed
```

**Manual testing:**
- Registered new user
- Verified email via link
- Logged in successfully
- Reset password
- Accessed protected route

Everything works! 🎉

### Session 7 Summary

**Time**: 2.5 hours
**Tasks Completed**: 1 (final testing task)
**Epic Status**: COMPLETE
**Total Time**: ~13 hours (close to estimate of 15-20 hours)

---

## Project Status After 7 Sessions

**Timeline**: 2 weeks, 7 sessions, ~13 hours
**Epic Completed**: User Authentication (MVP-ready)
**Code Quality**: All tests passing, security warnings addressed
**Documentation**: Full context preserved in .context/ folder

**Files in .context/:**

```
.context/
├── plans/
│   └── epic-user-authentication.md (status: completed)
├── tasks/
│   (empty - all archived)
├── tasks-done/
│   ├── 001-setup-auth-module.md
│   ├── 002-create-user-model.md
│   ├── 003-implement-registration-endpoint.md
│   ├── 004-implement-email-verification.md
│   ├── 005-implement-login-endpoint.md
│   ├── 006-implement-password-reset.md
│   ├── 007-create-protected-middleware.md
│   └── 008-write-integration-tests.md
├── progress.md (1/1 epics complete)
├── vision.md
├── patterns-architecture.md
├── techstack.md
└── decisions.md
```

---

## Lessons Learned

### What Worked Well

1. **Vision First**: Spending 45 minutes on vision/architecture saved days of rework
2. **Epic Warnings**: Security warnings in epic prevented multiple bugs
3. **Task Breakdown**: Clear acceptance criteria = no scope creep
4. **TDD Discipline**: Red-Green-Refactor kept code quality high
5. **Sync Habit**: Running `/ctx:sync` after each task kept progress visible

### What I'd Do Differently

1. **Email Setup Earlier**: Should have configured SendGrid in Task 001, not Task 004
2. **Smaller Tasks**: Task 003 (registration) was a bit large, could split into validation + implementation
3. **More Breaks**: Task 005-007 in one 3-hour session was draining

### CTX Plugin Value

**Before CTX**: Projects would start strong, then drift. Lose track of what's done, what's next. Forget important details from week 1.

**With CTX**: Every session starts with clear context. Progress is visible. Nothing falls through cracks. Warnings prevent mistakes before they happen.

**Biggest Win**: When I returned after a 3-day break, `/ctx:progress` showed exactly where I left off and what to do next. No ramp-up time.

---

## Next Steps

```bash
$ /ctx:epic "Project and task management"
```

Ready to build the core feature now that auth is complete. The foundation is solid, tests are passing, security is addressed. On to the next epic!

---

## Appendix: Command Reference Used

| Command | Used In Session | Purpose |
|---------|----------------|---------|
| `/ctx:vision` | 1 | Define project vision |
| `/ctx:architecture` | 1 | Define technical architecture |
| `/ctx:techstack` | 1 | Document tech stack choices |
| `/ctx:init` | 1 | Initialize .context/ structure |
| `/ctx:epic` | 2 | Plan authentication feature |
| `/ctx:breakdown` | 3 | Break epic into tasks |
| `/ctx:progress` | 3, 4, 5, 6, 7 | Check what's next |
| `/ctx:task [num]` | 4, 5, 6, 7 | Work on specific task |
| `/ctx:sync` | 4, 5, 6, 7 | Archive completed tasks |

**Total unique commands**: 8
**Total command invocations**: ~25 across 7 sessions
