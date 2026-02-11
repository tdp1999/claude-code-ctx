# Example: User Authentication Epic - Planning to Completion

This document provides a deep dive into a single epic from initial idea through breakdown, implementation, and completion. Follow along to see how the CTX plugin guides you through the entire lifecycle with practical warnings and intelligent suggestions.

**Epic**: User Authentication with JWT
**Context**: E-commerce platform adding user accounts
**Timeline**: 1 week, 5 sessions

---

## Initial Idea

**User Request**: "We need user login so people can save their shopping cart and checkout."

**Developer Thought Process**: Simple enough - email/password auth, JWT tokens, protected routes. Should be straightforward.

Let's see how CTX helps expand and improve this idea.

---

## Epic Planning Session (20 minutes)

### Command

```bash
$ /ctx:epic "User authentication with JWT for e-commerce"
```

### The Conversation

```
Claude: I'll help you plan user authentication. Let me understand the requirements:

        1. Is this for customers only, or do you need admin/staff accounts too?

User: Good point! Customers for now. Admin auth can be separate later.

Claude: 2. What authentication methods? Email/password, social login, or both?

User: Email/password for MVP. Maybe Google login in phase 2.

Claude: 3. Do customers need to verify their email before purchasing?

User: Hmm... hadn't thought about that. What do you recommend?

Claude: For e-commerce, I'd recommend optional verification initially:
        - Allow unverified users to checkout (don't lose sales)
        - Encourage verification for account security
        - Require verification for high-value orders ($500+)

        Sound reasonable?

User: Perfect. Start lenient, tighten for high-value orders.

Claude: 4. Password reset via email?

User: Yes, definitely.

Claude: 5. "Remember me" functionality?

User: Yes - shopping sessions should persist.

Claude: 6. JWT storage - localStorage or cookies?

User: Uh... localStorage? That's what I've seen in tutorials.

Claude: ⚠️ Actually, I'd strongly recommend HTTP-only cookies instead:

        **localStorage issues:**
        - Vulnerable to XSS attacks (any script can read it)
        - No automatic CSRF protection
        - Can't set HttpOnly flag
        - Shared across all tabs (logout doesn't work everywhere)

        **HTTP-only cookies:**
        - Can't be accessed by JavaScript (XSS protection)
        - SameSite flag prevents CSRF
        - Automatic sending with requests
        - Can be scoped to specific paths

        Want me to plan for HTTP-only cookies?

User: Yes, definitely. Glad you caught that!

Claude: 7. Session duration?

User: 7 days with remember me, 24 hours without?

Claude: Good choice. Let me also ask about scope:

        **Definitely in scope:**
        - Registration with email/password
        - Login with JWT in HTTP-only cookie
        - Password reset flow
        - Email verification (optional but encouraged)
        - "Remember me" for extended sessions
        - Protected routes for account pages

        **Probably out of scope for MVP:**
        - Social login (Google, Facebook)
        - Two-factor authentication
        - Magic link login
        - Account deletion flow
        - Password strength meter
        - Login history/device tracking

        Agree with this scope?

User: Yes, that's a good MVP scope.

Claude: Perfect! Now let me warn you about common pitfalls in auth implementation...

        ⚠️ **Security Warnings:**

        1. **Password Storage**
           - NEVER store plaintext passwords
           - Use bcrypt with cost factor 10+ (12 recommended)
           - Don't use MD5 or SHA-1 (broken algorithms)

        2. **JWT Security**
           - Sign tokens with strong secret (min 256 bits)
           - Set short expiration (15 min access, 7 day refresh)
           - Validate signature on every request
           - Don't store sensitive data in JWT payload (it's base64, not encrypted)

        3. **Email Enumeration**
           - Don't reveal if email exists during login
           - Same error message for wrong email vs wrong password
           - Timing attacks - hash password even if user doesn't exist

        4. **Password Reset**
           - Reset tokens expire (1 hour recommended)
           - Tokens are single-use (invalidate after use)
           - Rate limit requests (max 3 per hour per email)

        5. **Rate Limiting**
           - Login attempts: 5 per IP per 15 minutes
           - Registration: 3 per IP per hour
           - Password reset: 3 per email per hour

        6. **CORS Configuration**
           - Don't use `*` wildcard in production
           - Specify exact frontend origin
           - Include credentials: true for cookies

        These will all be documented in the epic. Sound good?

User: Wow, that's a lot I hadn't considered. Yes, document all of this!

Claude: One more architectural question: Will you use access + refresh tokens?

User: What's the difference?

Claude: **Access Token**: Short-lived (15 min), sent with every request
        **Refresh Token**: Long-lived (7 days), only used to get new access token

        Benefits:
        - If access token stolen, only valid 15 minutes
        - Can revoke refresh tokens (user logout on all devices)
        - Smaller attack window

        Costs:
        - More complex implementation
        - Need refresh endpoint
        - Client needs token refresh logic

        For e-commerce, I'd recommend it. Worth the complexity for customer trust.

User: Makes sense. Let's do it.

Claude: Excellent! Creating epic file...
```

### Epic File Created

`.context/plans/epic-user-authentication.md`:

```markdown
# Epic: User Authentication with JWT

## Summary
Implement secure JWT-based authentication for customer accounts with email/password
login, optional email verification, password reset, and "remember me" functionality.
Uses access + refresh token pattern with HTTP-only cookies.

## Why
Customers need accounts to save their shopping cart, track orders, and checkout
securely. Authentication is foundational for all personalized features.

## Target Users
E-commerce customers who want to save their cart and checkout without re-entering
information every time.

## Scope

### In Scope
- Customer registration with email/password
- Email verification (optional initially, required for orders >$500)
- Login with JWT access + refresh tokens in HTTP-only cookies
- Password reset flow via email
- "Remember me" for extended sessions (7 days vs 24 hours)
- Protected routes for account pages (orders, profile, saved items)
- Logout (invalidate refresh token)
- Basic rate limiting on auth endpoints

### Out of Scope
- Social login (Google, Facebook) - Phase 2
- Two-factor authentication - Phase 2
- Magic link login - Phase 2
- Admin/staff authentication (separate system)
- Account deletion flow - Phase 2
- Password strength meter - Phase 2
- Login history and device tracking - Phase 2

## High-Level Requirements

1. Customer can register with email, name, and password
2. Password must be 10+ characters (encourage strong passwords)
3. Verification email sent on registration
4. Customer can login with email/password (verified or not)
5. High-value orders (>$500) require verified email
6. Login returns access token (15 min) and refresh token (24 hours or 7 days)
7. Tokens stored in HTTP-only cookies with SameSite=Lax
8. Customer can use refresh token to get new access token
9. Customer can request password reset via email
10. Reset tokens expire after 1 hour and are single-use
11. Customer can logout (invalidate refresh token)
12. All auth endpoints have rate limiting

## Technical Considerations

### Architecture
- **Module**: auth/ (new module)
- **Integration**: Integrates with cart, orders, profile modules
- **Middleware**: JWT verification middleware for protected routes

### Dependencies
- jsonwebtoken for JWT creation/verification
- bcrypt for password hashing
- nodemailer or email service (SendGrid, Postmark)
- Redis for token blacklist (logout functionality)
- Express rate-limiter or similar

### Data Model

```typescript
// User model
interface User {
  id: string
  email: string           // unique, lowercase
  name: string
  passwordHash: string
  emailVerified: boolean
  verificationToken?: string
  resetToken?: string
  resetTokenExpiry?: Date
  createdAt: Date
  updatedAt: Date
}

// Refresh token (stored in Redis or DB)
interface RefreshToken {
  userId: string
  token: string           // hashed
  expiresAt: Date
  isRevoked: boolean
}
```

### JWT Payload

```typescript
// Access token payload
{
  userId: string
  email: string
  type: 'access'
  exp: number            // 15 minutes
}

// Refresh token payload
{
  userId: string
  type: 'refresh'
  exp: number            // 24 hours or 7 days
}
```

### API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/verify-email
POST   /api/auth/request-reset
POST   /api/auth/reset-password
GET    /api/auth/me (protected)
```

## Risks & Warnings

⚠️ **Password Storage**
- Use bcrypt with cost factor 12 minimum
- NEVER store plaintext passwords
- Don't use MD5, SHA-1, or plain SHA-256 (too fast, brute-forceable)

**Mitigation**: Use bcrypt library, document in code that cost factor should increase over time as hardware improves.

---

⚠️ **JWT Storage - XSS Prevention**
- NEVER store JWT in localStorage (vulnerable to XSS)
- Use HTTP-only cookies (JavaScript cannot access)
- Set Secure flag (HTTPS only in production)
- Set SameSite=Lax (prevent CSRF)

**Mitigation**: Configure cookie options correctly in JWT middleware.

```javascript
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 15 * 60 * 1000 // 15 minutes
})
```

---

⚠️ **Email Enumeration**
- Don't reveal if email exists during login
- Return same error for "wrong email" vs "wrong password"
- Prevent timing attacks (hash password even if user not found)

**Mitigation**: Use constant-time responses, generic error messages.

```javascript
// BAD
if (!user) return { error: 'Email not found' }
if (!validPassword) return { error: 'Invalid password' }

// GOOD
if (!user || !validPassword) return { error: 'Invalid credentials' }
```

---

⚠️ **JWT Secret Security**
- Generate cryptographically random secret (min 256 bits)
- Never commit secret to version control
- Rotate secret periodically (invalidates all tokens)
- Use different secrets for access vs refresh tokens

**Mitigation**: Use environment variables, document secret generation in README.

```bash
# Generate secure secret
openssl rand -base64 64
```

---

⚠️ **Password Reset Vulnerabilities**
- Reset tokens must expire (1 hour recommended)
- Tokens must be single-use (invalidate after password change)
- Rate limit reset requests (prevent email bombing)
- Don't confirm if email exists in response

**Mitigation**: Store token expiry in DB, check and invalidate on use, implement rate limiting.

---

⚠️ **Rate Limiting**
Without rate limiting, attackers can:
- Brute force passwords
- Enumerate emails
- DDoS auth endpoints
- Spam verification emails

**Mitigation**: Implement rate limiting per IP and per email:
- Login: 5 attempts per IP per 15 minutes
- Registration: 3 per IP per hour
- Password reset: 3 per email per hour
- Email verification: 3 per email per hour

---

⚠️ **Token Refresh Race Conditions**
- Concurrent requests with expiring access token can cause issues
- Client might try to refresh multiple times simultaneously
- Need idempotency on refresh endpoint

**Mitigation**: Add short grace period (30 seconds) where old access token still works after refresh.

---

⚠️ **Logout Implementation**
- Just deleting cookie client-side isn't secure (tokens still valid)
- Need to invalidate refresh tokens server-side
- Use token blacklist or database flag

**Mitigation**: Store refresh tokens in Redis or DB with revoked flag. Check on refresh.

---

⚠️ **Email Deliverability**
- Verification and reset emails might go to spam
- Need proper SPF, DKIM, DMARC configuration
- Use reputable email service (SendGrid, Postmark)

**Mitigation**: Use established email service, configure DNS records, test thoroughly.

## Alternatives Considered

### Option 1: Session-Based Auth (Cookies only, no JWT)
- **Pros**: Simpler, easily revocable, smaller cookie size
- **Cons**: Requires database lookup on every request, harder to scale horizontally
- **Why not chosen**: JWT scales better, works well for API + SPA architecture

### Option 2: JWT in localStorage
- **Pros**: Easy to implement, works for CORS requests
- **Cons**: Vulnerable to XSS, no HttpOnly protection, harder to implement logout
- **Why not chosen**: Security risk too high for e-commerce with payment data

### Option 3: Access Token Only (No Refresh Token)
- **Pros**: Simpler implementation, fewer endpoints
- **Cons**: Long-lived tokens increase security risk, can't implement "logout all devices"
- **Why not chosen**: Security and UX tradeoffs not worth the simplicity

### Option 4: OAuth Only (No Email/Password)
- **Pros**: Delegated security, easier for users
- **Cons**: Requires external service, some users prefer email/password
- **Why not chosen**: Want to own auth for MVP, can add OAuth later

## Success Criteria

- [ ] Customer can register and receive verification email
- [ ] Customer can login and receive access + refresh tokens
- [ ] Protected routes reject requests without valid access token
- [ ] Customer can refresh access token before expiration
- [ ] Customer can reset password via email link
- [ ] Customer can logout (tokens invalidated)
- [ ] All endpoints have appropriate rate limiting
- [ ] Auth flow works on mobile and desktop browsers
- [ ] Passes OWASP security checklist for authentication
- [ ] Average login response time < 300ms

## Estimated Complexity
**L (Large)**

**Reasoning**:
- Multiple user flows (register, login, refresh, reset, verify)
- Dual token system (access + refresh)
- Security considerations require careful implementation
- Rate limiting and token blacklist infrastructure
- Email integration and templating
- Comprehensive testing of security edge cases
- Estimated 18-24 hours across 8-10 tasks

## Status
ready

## Created
2026-02-11
```

### Planning Session Summary

**Time**: 20 minutes of conversation
**Output**: Comprehensive epic file with security warnings
**Key Value**: Caught localStorage security issue before coding started

**What I Learned**: I was about to use localStorage for JWT (like the tutorials do). Claude's warning about XSS vulnerabilities saved me from a major security bug. The detailed security warnings in the epic are gold - I'll reference them during implementation.

---

## Epic Breakdown Session (15 minutes)

### Command

```bash
$ /ctx:breakdown epic-user-authentication
```

### The Skill's Analysis

```
📖 Reading epic: .context/plans/epic-user-authentication.md

🔍 Analyzing requirements...

Identified flows:
✓ Registration flow
✓ Email verification flow
✓ Login flow
✓ Token refresh flow
✓ Password reset request flow
✓ Password reset completion flow
✓ Logout flow
✓ Protected route authorization

🧩 Identifying tasks...

Explicit tasks (from requirements):
- User registration endpoint
- Email verification endpoint
- Login endpoint with dual tokens
- Token refresh endpoint
- Password reset request endpoint
- Password reset completion endpoint
- Logout endpoint
- JWT middleware for protected routes

Implicit tasks (necessary but not stated):
- Initial auth module setup and dependencies
- Database migrations for User model and tokens
- Email service setup and templates
- Rate limiting middleware
- Integration tests for all flows
- Security audit checklist

Checking task sizing...
- Some tasks might be too large, splitting...
- Token refresh has complex race condition handling - separate task
- Email service setup should be separate from verification endpoint

📝 Creating task files...
```

### Tasks Created

```
✅ Created 001-setup-auth-module.md (S)
✅ Created 002-setup-email-service.md (S)
✅ Created 003-create-user-model-migration.md (M)
✅ Created 004-implement-registration-endpoint.md (M)
✅ Created 005-implement-email-verification.md (M)
✅ Created 006-implement-login-endpoint.md (L)
✅ Created 007-implement-token-refresh.md (M)
✅ Created 008-implement-password-reset-request.md (M)
✅ Created 009-implement-password-reset-completion.md (M)
✅ Created 010-implement-logout.md (S)
✅ Created 011-create-jwt-middleware.md (M)
✅ Created 012-implement-rate-limiting.md (M)
✅ Created 013-write-auth-integration-tests.md (L)
✅ Created 014-security-audit-checklist.md (S)

📊 Summary:
- Total tasks: 14
- Small (S): 4 tasks (~4 hours)
- Medium (M): 8 tasks (~16 hours)
- Large (L): 2 tasks (~8 hours)
- Total estimated time: 28 hours

⚠️ Note: This exceeds the epic estimate of 18-24 hours.
   Consider if scope can be reduced or estimate should be updated.

💡 Recommended start: Task 001 (foundation for all other tasks)

📂 Files created in .context/tasks/
📊 Updated .context/progress.md
```

Let's examine a few task files in detail:

### Task 006: Implement Login Endpoint (Large)

`.context/tasks/006-implement-login-endpoint.md`:

```markdown
# Task: Implement login endpoint with dual token system

## Status: pending

## Goal
Create login endpoint that validates credentials, generates access + refresh tokens,
stores refresh token in Redis, and returns both tokens in HTTP-only cookies.

## Context
Part of User Authentication epic. Login is the primary entry point for returning
customers. Must implement dual-token system for security (short access token,
longer refresh token). This is a complex task due to token generation, storage,
and cookie configuration.

## Acceptance Criteria
- [ ] POST /api/auth/login accepts email and password
- [ ] Input validated (email format, password present)
- [ ] Look up user by email (case-insensitive)
- [ ] Compare password with bcrypt hash
- [ ] Return generic error if email not found OR password wrong (prevent enumeration)
- [ ] Hash password even if user not found (prevent timing attacks)
- [ ] Generate JWT access token (15 min expiration) with userId, email, type='access'
- [ ] Generate JWT refresh token (24h or 7d based on "remember me")
- [ ] Store refresh token in Redis with userId and expiry
- [ ] Set access token in HTTP-only cookie with secure, sameSite, 15min maxAge
- [ ] Set refresh token in HTTP-only cookie with secure, sameSite, 24h/7d maxAge
- [ ] Return success response with user info (no sensitive data)
- [ ] Rate limit: Max 5 attempts per IP per 15 minutes
- [ ] Log failed login attempts for security monitoring

## Technical Notes

**Password Comparison:**
```typescript
// Always hash password, even if user not found (timing attack prevention)
const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })
const passwordHash = user?.passwordHash || '$2b$12$dummy.hash.for.timing'
const isValid = await bcrypt.compare(password, passwordHash)

if (!user || !isValid) {
  return { error: 'Invalid credentials' } // Generic error
}
```

**JWT Generation:**
```typescript
import jwt from 'jsonwebtoken'

const accessToken = jwt.sign(
  { userId: user.id, email: user.email, type: 'access' },
  process.env.JWT_ACCESS_SECRET,
  { expiresIn: '15m' }
)

const refreshToken = jwt.sign(
  { userId: user.id, type: 'refresh' },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: rememberMe ? '7d' : '24h' }
)
```

**Cookie Configuration:**
```typescript
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
}

res.cookie('accessToken', accessToken, {
  ...cookieOptions,
  maxAge: 15 * 60 * 1000 // 15 minutes
})

res.cookie('refreshToken', refreshToken, {
  ...cookieOptions,
  maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
})
```

**Redis Storage:**
```typescript
// Store refresh token hash in Redis
const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
await redis.setex(
  `refresh:${tokenHash}`,
  rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60,
  JSON.stringify({ userId: user.id, createdAt: Date.now() })
)
```

**Security Reminders:**
- NEVER log passwords or tokens
- Generic error messages prevent email enumeration
- Timing-safe password comparison prevents timing attacks
- Rate limiting prevents brute force
- Redis expiry auto-cleans old tokens

Reference:
- `.context/patterns-architecture.md` auth module
- Epic warnings on JWT storage and enumeration

## Files to Touch
- `src/api/auth/login.ts` (create endpoint)
- `src/lib/jwt.ts` (JWT utility functions)
- `src/lib/redis.ts` (Redis client)
- `src/middleware/rateLimit.ts` (rate limiting)
- `.env.example` (add JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, REDIS_URL)

## Dependencies
- Task 001 (auth module setup)
- Task 003 (User model exists)

## Complexity: L

Reasoning: Multiple moving parts (JWT, Redis, cookies, timing attacks), critical
security requirements, integration of several services, ~3-4 hours estimated.

## Progress Log
```

### Task 007: Implement Token Refresh

`.context/tasks/007-implement-token-refresh.md`:

```markdown
# Task: Implement token refresh endpoint with race condition handling

## Status: pending

## Goal
Create endpoint to exchange valid refresh token for new access token, handling
concurrent refresh requests gracefully with grace period pattern.

## Context
Part of User Authentication epic. Access tokens expire after 15 minutes. Before
expiration, client exchanges refresh token for new access token. Must handle
edge case where client makes multiple refresh requests near expiration (race condition).

## Acceptance Criteria
- [ ] POST /api/auth/refresh accepts refresh token from cookie
- [ ] Verify refresh token signature with JWT_REFRESH_SECRET
- [ ] Check token type is 'refresh' (not 'access')
- [ ] Look up token in Redis to ensure not revoked
- [ ] Return 401 if token expired, invalid, or revoked
- [ ] Generate new access token (15 min expiration)
- [ ] Optionally rotate refresh token (generate new refresh token)
- [ ] Store new refresh token in Redis, remove old one
- [ ] Set new access token cookie
- [ ] Implement 30-second grace period (old access token still valid during transition)
- [ ] Handle concurrent refresh requests (idempotency)
- [ ] Rate limit: Max 10 refreshes per user per minute (prevent abuse)

## Technical Notes

**Token Verification:**
```typescript
let payload
try {
  payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
} catch (err) {
  return { error: 'Invalid or expired token' }
}

if (payload.type !== 'refresh') {
  return { error: 'Invalid token type' }
}
```

**Redis Lookup:**
```typescript
const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
const stored = await redis.get(`refresh:${tokenHash}`)

if (!stored) {
  return { error: 'Token has been revoked' }
}
```

**Refresh Token Rotation (recommended for security):**
```typescript
// Generate new refresh token
const newRefreshToken = jwt.sign(
  { userId: payload.userId, type: 'refresh' },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: payload.rememberMe ? '7d' : '24h' }
)

// Store new, remove old
const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex')
await redis.setex(`refresh:${newTokenHash}`, /* ttl */, /* data */)
await redis.del(`refresh:${tokenHash}`)
```

**Grace Period Pattern (prevents race conditions):**
```typescript
// When setting new access token, store both old and new for 30 seconds
// JWT middleware checks both during grace period

await redis.setex(
  `access-grace:${user.id}`,
  30, // 30 seconds
  JSON.stringify({
    oldToken: oldAccessTokenSignature,
    newToken: newAccessTokenSignature,
    expiresAt: Date.now() + 30000
  })
)
```

**Race Condition Handling:**
```typescript
// Use Redis SETNX (set if not exists) for idempotency
const refreshKey = `refreshing:${payload.userId}`
const isFirstRequest = await redis.setnx(refreshKey, '1')
await redis.expire(refreshKey, 5) // 5 second lock

if (!isFirstRequest) {
  // Another request is already refreshing, wait and return success
  await sleep(100)
  return { success: true, message: 'Token refresh in progress' }
}

// Proceed with refresh...
```

**Security Notes:**
- Refresh token rotation limits damage if token is stolen
- Grace period prevents legitimate concurrent requests from failing
- Rate limiting prevents refresh token abuse
- Revoking old refresh token ensures single active session per token

Epic warnings reference:
- Token refresh race conditions section
- JWT security best practices

## Files to Touch
- `src/api/auth/refresh.ts` (create endpoint)
- `src/lib/jwt.ts` (add grace period utils)
- `src/middleware/auth.ts` (update to check grace period)
- `src/lib/redis.ts` (add SETNX helper)

## Dependencies
- Task 006 (login endpoint creates refresh tokens)
- Task 011 (JWT middleware needs grace period support)

## Complexity: M

Reasoning: Complex logic for race conditions and grace period, but smaller scope
than login endpoint. Estimated 2-3 hours.

## Progress Log
```

### Task 014: Security Audit Checklist

`.context/tasks/014-security-audit-checklist.md`:

```markdown
# Task: Security audit checklist for authentication

## Status: pending

## Goal
Verify all security warnings from epic have been addressed and auth implementation
follows OWASP best practices.

## Context
Final task in User Authentication epic. Ensures nothing was missed during
implementation. Acts as gate before marking epic complete.

## Acceptance Criteria

### Password Security
- [ ] Passwords hashed with bcrypt cost factor 12+
- [ ] No plaintext passwords logged or stored
- [ ] Password validation enforced server-side (10+ characters)

### JWT Security
- [ ] JWT secrets are 256+ bits, stored in environment variables
- [ ] Access tokens expire in 15 minutes
- [ ] Refresh tokens expire in 24h or 7d (based on remember me)
- [ ] Tokens signed with strong algorithm (HS256 minimum, RS256 preferred)
- [ ] No sensitive data in JWT payload (user ID and email only)

### Token Storage
- [ ] Access tokens stored in HTTP-only cookies
- [ ] Refresh tokens stored in HTTP-only cookies
- [ ] Cookies have Secure flag (HTTPS only in production)
- [ ] Cookies have SameSite=Lax or Strict
- [ ] No tokens in localStorage or sessionStorage

### Email Enumeration Prevention
- [ ] Login returns generic error for wrong email/password
- [ ] Password hashed even if user not found (timing attack prevention)
- [ ] Registration doesn't reveal if email exists
- [ ] Password reset doesn't confirm email existence

### Rate Limiting
- [ ] Login: Max 5 attempts per IP per 15 minutes
- [ ] Registration: Max 3 per IP per hour
- [ ] Password reset: Max 3 per email per hour
- [ ] Email verification: Max 3 per email per hour
- [ ] Token refresh: Max 10 per user per minute

### Password Reset Security
- [ ] Reset tokens expire after 1 hour
- [ ] Reset tokens are single-use (invalidated after password change)
- [ ] Reset tokens are cryptographically random
- [ ] Reset request doesn't reveal email existence

### Token Refresh
- [ ] Refresh tokens can be revoked (stored in Redis/DB)
- [ ] Grace period implemented for concurrent refresh requests
- [ ] Refresh token rotation enabled (new token on refresh)
- [ ] Old refresh token invalidated on rotation

### Logout
- [ ] Logout invalidates refresh token server-side
- [ ] Logout clears both access and refresh token cookies
- [ ] "Logout all devices" capability exists (revoke all user's refresh tokens)

### Email Security
- [ ] Verification emails sent with unique token
- [ ] Email service configured with SPF, DKIM, DMARC
- [ ] Email rate limiting prevents spam

### General Security
- [ ] All auth endpoints use HTTPS in production
- [ ] CORS configured with specific origin (not wildcard)
- [ ] CORS credentials enabled for cookies
- [ ] Input validation on all endpoints (email, password, token format)
- [ ] Error messages don't leak sensitive information
- [ ] No sensitive data logged (passwords, tokens, full emails)

### Testing
- [ ] Integration tests for all auth flows
- [ ] Security tests for enumeration attacks
- [ ] Security tests for timing attacks
- [ ] Security tests for token tampering
- [ ] Security tests for expired tokens
- [ ] Security tests for rate limiting
- [ ] Test with OWASP ZAP or similar security scanner

## Technical Notes

**Testing Tools:**
- OWASP ZAP for automated security scanning
- Burp Suite for manual testing
- `npm audit` for dependency vulnerabilities
- Lighthouse security audit

**Common Missed Items:**
- Forgetting Secure flag on cookies in production
- Not rate limiting registration endpoint
- Logging full email addresses (PII)
- Missing token expiry checks
- Weak JWT secrets (< 256 bits)

**Reference Epic Sections:**
- All "Risks & Warnings" items must be checked
- Review security alternatives that were considered

## Files to Touch
- `.context/plans/epic-user-authentication.md` (update with audit results)
- `SECURITY.md` (create if doesn't exist)
- README.md (document security features)

## Dependencies
- All other auth tasks (001-013) must be completed

## Complexity: S

Reasoning: Checklist verification, no implementation. But critical for security.
Estimated 1-2 hours.

## Progress Log
```

### Breakdown Session Summary

**Time**: 15 minutes
**Tasks Created**: 14 tasks
**Total Estimate**: 28 hours (vs epic estimate of 18-24)

**Key Insights:**
- The skill caught implicit tasks I missed (email service setup, security audit)
- Task 007 (token refresh) was split out due to race condition complexity
- The security audit checklist ensures epic warnings get addressed

**Decision**: Update epic estimate to 28 hours based on breakdown.

---

## Working Through Tasks (TDD Approach)

### Session 1: Foundation (3 hours)

**Tasks 001-003**: Setup, email, database

```bash
$ /ctx:task 001
```

Red → Green → Refactor approach:

1. Created test file `tests/auth/setup.test.ts`
2. Test: "auth module folder exists" (RED - fails)
3. Created `src/api/auth/` folder structure (GREEN - passes)
4. Refactor: Added index.ts exports

Completed 001, 002, 003. Synced progress.

### Session 2: Registration & Verification (4 hours)

```bash
$ /ctx:task 004
```

**Task 004: Registration Endpoint**

TDD Flow:

**Test 1: Valid registration creates user**
```typescript
// RED - test fails (endpoint doesn't exist)
it('should create user with valid input', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'test@example.com',
      name: 'Test User',
      password: 'SecurePass123'
    })

  expect(res.status).toBe(201)
  expect(res.body).toHaveProperty('success', true)
})
```

Implemented endpoint, test passes (GREEN).

**Test 2: Duplicate email returns error**
```typescript
// RED - no duplicate check
it('should reject duplicate email', async () => {
  await createUser({ email: 'test@example.com' })

  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: 'test@example.com', name: 'Test', password: 'Pass123' })

  expect(res.status).toBe(400)
  expect(res.body.error).toBe('Email already registered')
})
```

Added duplicate check (GREEN).

**Test 3: Password is hashed**
```typescript
// RED - storing plaintext
it('should hash password before storing', async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ email: 'test@example.com', name: 'Test', password: 'MyPassword123' })

  const user = await db.user.findUnique({ where: { email: 'test@example.com' } })
  expect(user.password).not.toBe('MyPassword123')
  expect(user.password).toMatch(/^\$2b\$12\$/) // bcrypt hash
})
```

Added bcrypt hashing (GREEN).

Refactored: Extracted validation logic to shared schema.

**Acceptance Criteria Check:**
- [x] Endpoint accepts email, name, password
- [x] Input validated with Zod
- [x] Duplicate email check
- [x] Password hashed with bcrypt
- [x] Verification token generated
- [x] User created in database
- [x] Verification email sent
- [x] Success response returned

Task 004 complete! Moved to 005.

**Task 005: Email Verification**

Similar TDD process. Hit one interesting issue:

**Bug Found During Testing:**

Verification tokens weren't being invalidated after use. Could reuse token to verify multiple accounts.

```typescript
// Added test that caught the bug
it('should not allow token reuse', async () => {
  const token = 'test-token-123'
  await createUnverifiedUser({ verificationToken: token })

  // First verification succeeds
  await request(app).post('/api/auth/verify-email').send({ token })

  // Second verification should fail
  const res = await request(app).post('/api/auth/verify-email').send({ token })
  expect(res.status).toBe(400)
})
```

Fixed by setting `verificationToken = null` after successful verification.

This is exactly why TDD works - I wouldn't have thought to test token reuse without writing tests first.

### Session 3: Login & Refresh (5 hours)

**Task 006: Login Endpoint** (the big one)

This task took longer than estimated (4 hours vs 3-4). The dual-token system with Redis and timing attack prevention was complex.

**Key moment:** Almost forgot to hash password when user not found. The acceptance criteria reminder caught it:

- [ ] Hash password even if user not found (prevent timing attacks)

Without that reminder, I would have shipped a timing vulnerability.

**Tests written:**
- Valid login returns tokens in cookies
- Invalid password returns generic error
- Non-existent email returns generic error (same as invalid password)
- Timing is consistent (mock to ensure constant time)
- Refresh token stored in Redis
- Remember me extends refresh token expiry

All tests passing. Task complete.

**Task 007: Token Refresh**

Grace period pattern was tricky. Took 2.5 hours (estimate was 2-3).

Created race condition test:

```typescript
it('should handle concurrent refresh requests', async () => {
  const refreshToken = await generateRefreshToken(userId)

  // Make 5 simultaneous refresh requests
  const requests = Array(5).fill(null).map(() =>
    request(app)
      .post('/api/auth/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`)
  )

  const results = await Promise.all(requests)

  // All should succeed (no conflicts)
  results.forEach(res => {
    expect(res.status).toBe(200)
  })

  // Only one new refresh token should be created
  const tokens = await redis.keys('refresh:*')
  expect(tokens).toHaveLength(1)
})
```

Test failed initially - race condition caused conflicts. Implemented Redis SETNX lock pattern from task notes. Test passed.

This task's detailed technical notes saved me hours of research.

### Sessions 4-5: Password Reset, Logout, Security (8 hours)

Tasks 008-014 completed over two more sessions.

**Highlight: Task 014 (Security Audit)**

Went through entire checklist. Found 3 issues:

1. **Missing Secure flag in production**: Fixed cookie config
2. **Rate limiting on registration too generous**: Reduced from 5 to 3 per hour
3. **Password reset emails logging user email**: Removed from logs

All warnings from epic addressed. All acceptance criteria met. All tests passing.

Epic complete! 🎉

---

## Completion and Lessons Learned

### Final Stats

**Total Time**: ~24 hours (vs revised estimate of 28)
**Tasks Completed**: 14/14
**Tests Written**: 87 tests
**Bugs Caught by Tests**: 6
**Security Issues Prevented**: 8+

### Epic File Update

Updated epic status to `completed` and added completion summary:

```markdown
## Completion Summary

Completed: 2026-02-11

All 14 tasks completed. Authentication system implemented with:
- Registration with email verification
- Login with dual-token system (access + refresh)
- Password reset flow
- Logout with token revocation
- JWT middleware for protected routes
- Comprehensive rate limiting
- 87 integration tests (all passing)
- Security audit completed

Key security features:
✅ Passwords hashed with bcrypt cost factor 12
✅ JWT in HTTP-only cookies with Secure and SameSite flags
✅ Timing attack prevention in login
✅ Email enumeration prevention
✅ Rate limiting on all endpoints
✅ Token rotation on refresh
✅ Grace period for concurrent refresh requests
✅ Single-use password reset tokens

No security warnings from epic remain unaddressed.
```

### What Went Well

1. **Epic Planning Caught Major Issues**
   - localStorage security risk prevented before writing code
   - Timing attack prevention documented upfront
   - Rate limiting requirements clear from start

2. **Task Breakdown Was Excellent**
   - Every acceptance criterion was specific and testable
   - Technical notes prevented research paralysis
   - Complexity estimates were accurate (within 20%)

3. **TDD Workflow Prevented Bugs**
   - Token reuse bug caught by test
   - Race condition test drove grace period implementation
   - Security tests ensured epic warnings addressed

4. **Clear Dependencies**
   - Always knew what to work on next
   - No rework due to wrong order
   - Foundation tasks unblocked feature tasks

### What Could Be Improved

1. **Task 006 Underestimated**
   - Login endpoint took 4 hours vs 3-4 estimate
   - Dual-token system + Redis + timing attacks was complex
   - Could split into "basic login" + "add refresh token"

2. **Email Setup Blocked Progress**
   - Should have done Task 002 (email) before Task 004 (registration)
   - Even though not a dependency, registration couldn't be fully tested
   - Next time: set up all infrastructure tasks first

3. **Testing Could Be Earlier**
   - Task 013 (integration tests) was near the end
   - Would be better to write tests alongside implementation
   - CTX plugin could suggest "test alongside" vs "test at end"

### Key Takeaways

**Epic Warnings Are Gold**: The security warnings saved me from multiple vulnerabilities. Taking 20 minutes to plan saved days of rework and potential security incidents.

**TDD Works**: Writing tests first exposed bugs I never would have found manually. The race condition test for token refresh was especially valuable.

**Task Granularity Matters**: Task 006 (login) could have been split into 2-3 smaller tasks. Task 010 (logout) was perfectly sized at Small.

**Acceptance Criteria Prevent Scope Creep**: Every task had clear "done" criteria. No gold-plating, no "let me add one more thing."

**Progress Visibility Helps**: Running `/ctx:progress` every session showed momentum. Seeing "8/14 tasks complete" motivated me to finish.

---

## Comparison: With vs Without CTX

### Without CTX (Past Experience)

**Time**: 40+ hours
**Issues**:
- Forgot rate limiting until production
- Used localStorage (had to refactor for security)
- No token refresh (long-lived tokens, security risk)
- Missing edge cases (email reuse, token reuse, timing attacks)
- Unclear when "done" - kept adding features
- Lost track of what was left to do

**Result**: Shipped with security vulnerabilities, refactored twice, took 40+ hours.

### With CTX (This Project)

**Time**: 24 hours
**Benefits**:
- All security considerations upfront (no refactoring)
- Every requirement had test coverage
- Clear acceptance criteria (knew when done)
- Always knew what to work on next
- Comprehensive documentation for future changes

**Result**: Shipped securely on first try, under initial estimate.

---

## Recommendation for Future Auth Epics

1. **Always run epic skill first** - Even for "simple" auth, security warnings are critical
2. **Don't skip breakdown** - Implicit tasks (email setup, security audit) are easy to miss
3. **Split large tasks** - Keep tasks under 4 hours for better estimates
4. **TDD from start** - Security bugs caught by tests are cheaper than security audits
5. **Reference epic during implementation** - Warnings are easy to forget a week later

---

## Files Preserved

All context files preserved in `.context/`:

```
.context/
├── plans/
│   └── epic-user-authentication.md (completed)
├── tasks-done/
│   ├── 001-setup-auth-module.md
│   ├── 002-setup-email-service.md
│   ├── ... (all 14 tasks)
│   └── 014-security-audit-checklist.md
└── progress.md (epic marked 100% complete)
```

Future developers can read the epic file to understand all decisions, risks, and warnings. Task files show implementation details and test coverage.

This is living documentation that stays with the codebase.
