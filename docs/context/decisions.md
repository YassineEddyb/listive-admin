# Architectural Decisions

> Key decisions made during development of Listive Admin, with rationale.

---

## 1. Separate Repository

**Decision:** Admin panel lives in its own repo (`listive-admin`), not inside the main Listive monorepo.

**Why:**
- Independent deployment cycle — admin updates don't trigger main app rebuilds
- Cleaner separation of concerns — admin code never ships to end users
- Different port (3005 vs 3000) avoids dev conflicts
- Simpler CI/CD — admin has its own build pipeline

**Trade-off:** Shared types (Supabase) must be kept in sync manually.

---

## 2. Shared Supabase Instance

**Decision:** Admin panel connects to the same Supabase project as the main app.

**Why:**
- Direct access to user data, subscriptions, credits, images
- No API gateway or data sync needed
- Real-time data without replication lag
- Single source of truth

**Trade-off:** Migrations must be coordinated — admin tables are created via the main Listive project's migration system.

---

## 3. Service Role Access (No RLS)

**Decision:** Admin uses `SUPABASE_SERVICE_ROLE_KEY` which bypasses Row Level Security.

**Why:**
- Admin needs to read/write all users' data
- RLS policies are designed for end-user isolation
- Service role gives unrestricted access without policy exceptions
- Simpler queries — no need for `security definer` functions

**Trade-off:** Security depends entirely on the admin auth guard. If auth is bypassed, full DB access is exposed.

---

## 4. Cookie-Based Auth with Separate Key

**Decision:** Admin auth uses its own cookie key (`sb-admin-auth-token`) with AES-256-GCM encryption.

**Why:**
- Prevents session sharing between admin and main app
- Admin and main app can run on same domain without conflicts
- Encrypted cookie prevents token extraction from browser DevTools
- Server-side validation on every request via middleware

**Trade-off:** More complex than using Supabase's built-in `@supabase/ssr` cookie handling.

---

## 5. Double Auth Guard

**Decision:** Auth is checked in both middleware (`middleware.ts`) AND layout (`admin/layout.tsx`).

**Why:**
- Middleware handles route protection and redirects
- Layout provides the session to all child components
- Belt-and-suspenders approach — if middleware fails, layout catches it
- Layout also checks `admin_users` table for admin role verification

**Trade-off:** Slight duplication, but prevents any unauthorized access path.

---

## 6. Feature Module Architecture

**Decision:** Code organized by feature (`src/features/`) with controller→server→client pattern.

**Why:**
- Each feature is self-contained — easy to find related code
- Controller pattern keeps data fetching in one place
- Server Actions are co-located with their feature
- Mimics the main Listive project's architecture

**Alternative considered:** Pages-first organization (code next to routes). Rejected because features span multiple routes.

---

## 7. shadcn/ui (New York Style)

**Decision:** Use shadcn/ui component library with the New York variant.

**Why:**
- Copy-paste model — components live in `src/components/ui/`, fully customizable
- No external dependency version conflicts
- Tailwind-native — consistent with project styling
- High quality accessible components (built on Radix UI)

**Trade-off:** Manual updates — no `npm update` for component fixes.

---

## 8. TanStack Table for Data Tables

**Decision:** Use `@tanstack/react-table` (headless) with shadcn/ui wrappers.

**Why:**
- Column definitions are type-safe and declarative
- Sorting, filtering, pagination built-in
- Headless — full control over rendering
- Consistent table UX across all admin pages

**Trade-off:** Boilerplate for each table (column defs, toolbar, etc.).

---

## 9. No Tests (Intentional)

**Decision:** Admin panel has no automated tests.

**Why:**
- Internal tool with single-digit users (admins only)
- Rapid development pace — tests would slow iteration
- TypeScript strict mode catches most type errors
- Manual QA sufficient for admin workflows

**Trade-off:** Regressions caught manually. Acceptable for internal tooling.

---

## 10. Audit Trail via admin_actions

**Decision:** All mutations log to `admin_actions` table.

**Why:**
- Full accountability — who did what and when
- Regulatory compliance for financial operations (credit adjustments)
- Debugging aid — replay what happened before a bug
- Non-blocking — audit logging doesn't fail the action

**Implementation:** Server Actions call `logAdminAction()` after successful mutations.

---

## 11. Polar.sh + Resend as Read-Only Integrations

**Decision:** External API integrations (Polar.sh, Resend) are read-only dashboards.

**Why:**
- Reduces blast radius — admin can't accidentally modify billing or email config
- API tokens can be read-only scoped
- Mutations (refunds, resends) handled in respective dashboards
- Admin panel serves as unified monitoring view

**Trade-off:** Admins must switch to Polar/Resend dashboards for write operations.

---

*See [Known Issues](known-issues.md) for current limitations and tech debt.*
