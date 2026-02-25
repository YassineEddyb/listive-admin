# Authentication

> Admin panel authentication and authorization system.

## Auth Flow

```
1. User navigates to /admin/*
2. Middleware → updateSession() refreshes Supabase cookie
3. Admin layout loads:
   a. getSession() → no session → redirect to /login
   b. Query admin_users table → no row → redirect to /unauthorized
   c. Both pass → render admin content
```

---

## Login

- **Method:** Google OAuth via Supabase Auth
- **Page:** `/login` (route group `(auth)`)
- **Callback:** `/auth/callback` (exchanges OAuth code for session)
- **Post-login:** Redirect to `/admin`

---

## Cookie Isolation

| Setting | Value |
|---------|-------|
| Storage key | `sb-admin-auth-token` |
| Config file | `src/libs/supabase/config.ts` |
| Purpose | Prevents conflict with main app's `sb-auth-token` |

An admin can be logged into both the main Listive app and the admin panel simultaneously without session interference.

---

## Authorization

### Double Guard (Admin Layout)

```typescript
// src/app/admin/layout.tsx
const session = await getSession();
if (!session) redirect('/login');

const { data: admin } = await supabase
  .from('admin_users')
  .select('id')
  .eq('user_id', session.user.id)
  .single();

if (!admin) redirect('/unauthorized');
```

### Admin Users Table

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Primary key |
| `user_id` | UUID | References `auth.users(id)` |
| `email` | TEXT | Denormalized from auth.users |
| `created_by` | TEXT | Who granted access |
| `created_at` | TIMESTAMPTZ | When granted |

- **Granting access:** Insert a row into `admin_users` (via Settings page or direct DB)
- **Revoking access:** Delete the row from `admin_users`
- All changes logged to `admin_actions` audit table

---

## Middleware

**File:** `src/middleware.ts`

Calls `updateSession()` on every request to refresh the Supabase auth cookie. Matches all paths except static assets (`_next/static`, `_next/image`, `favicon.ico`).

---

## User Menu

**File:** `src/features/auth/components/user-menu.tsx`

Dropdown in the top navigation showing:
- Admin user email
- Sign out action

---

## Implementation Files

| File | Purpose |
|------|---------|
| `src/features/auth/controllers/get-session.ts` | Get current Supabase session |
| `src/features/auth/controllers/get-admin-user.ts` | Get admin user record |
| `src/features/auth/actions/auth-actions.ts` | Sign out server action |
| `src/features/auth/components/user-menu.tsx` | User menu dropdown |
| `src/libs/supabase/supabase-middleware-client.ts` | Middleware client with auth logic |
| `src/libs/supabase/config.ts` | Cookie config (ADMIN_STORAGE_KEY) |
