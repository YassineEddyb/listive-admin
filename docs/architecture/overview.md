# Architecture Overview

## System Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                              │
│                                                                       │
│  Next.js App Router ── React Server Components ── Client Components   │
│       │                        │                        │             │
│       │                  Server Actions             React Query       │
│       │                  (mutations)              (client cache)      │
│       │                        │                        │             │
│       │                        ▼                        ▼             │
│       │              ┌─────────────────┐     ┌──────────────────┐    │
│       │              │  Supabase Auth  │     │   TanStack Table │    │
│       │              │  (sb-admin-     │     │  (sorting, paging│    │
│       │              │   auth-token)   │     │   filtering)     │    │
│       │              └────────┬────────┘     └──────────────────┘    │
└───────┼───────────────────────┼──────────────────────────────────────┘
        │                       │
        ▼                       ▼
┌───────────────┐    ┌───────────────────────────────────────────────┐
│   Middleware   │    │              SERVER (Next.js SSR)              │
│ (session mgmt) │    │                                                │
│  Updates auth  │    │  Controllers ── Server Actions ── Libs         │
│  cookie on     │    │      │               │              │          │
│  every request │    │      ▼               ▼              ▼          │
└───────────────┘    │  ┌─────────┐  ┌────────────┐  ┌──────────┐   │
                      │  │ Polar.sh│  │Supabase DB │  │  Resend  │   │
                      │  │  (SDK)  │  │(PostgreSQL)│  │  (email) │   │
                      │  │  read   │  │ service    │  │  send +  │   │
                      │  │  only   │  │ role       │  │  metrics │   │
                      │  └─────────┘  └────────────┘  └──────────┘   │
                      └──────────────────────────────────────────────┘
```

---

## Request Flow

### Page Load (Server Component)
```
Browser → Middleware (updateSession) → Admin Layout Guard:
  1. Check session → redirect to /login if missing
  2. Check admin_users table → redirect to /unauthorized if not admin
  3. Server Component → Controller (Supabase query) → Render HTML
```

### Data Mutation (Server Action)
```
Client Component → Server Action:
  1. Perform Supabase write (service_role)
  2. Log to admin_actions audit table
  3. revalidatePath → UI update
```

### External API Read (Integrations)
```
Server Component → Controller:
  1. Call Polar.sh SDK or Resend SDK
  2. Transform response for UI
  3. Render in Server Component (no client JS needed)
```

---

## Key Architectural Patterns

### 1. Feature-Module Organization
Code is organized by feature in `src/features/`. Each module contains:
- `controllers/` — Server-side data fetching functions
- `components/` — Feature-specific UI components
- `actions/` — Server Actions for mutations

### 2. Server Components by Default
Pages and layouts are React Server Components. Client Components (`'use client'`) used only for interactivity (tables, forms, dropdowns). Data fetching happens server-side in controllers, reducing client JavaScript.

### 3. Controller Pattern
All data fetching is centralized in `controllers/*.ts` files. Pages call controllers, not Supabase directly:
```typescript
// controller (server-side)
export async function getUsers() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('admin_users_view').select('*');
  return data;
}

// page (server component)
export default async function UsersPage() {
  const users = await getUsers();
  return <UsersTable data={users} />;
}
```

### 4. Service Role for Everything
Unlike the main Listive app (which uses user sessions for data access), the admin panel uses `service_role` for all data queries. This bypasses Row Level Security, giving admins full visibility into all platform data.

### 5. Cookie Isolation
The admin panel uses storage key `sb-admin-auth-token` (configured in `src/libs/supabase/config.ts`). This prevents cookie conflicts when an admin is logged into both the main app and the admin panel on the same domain.

### 6. Double Authorization Guard
The admin layout applies two checks in sequence:
1. **Session check** — Is the user logged into Supabase? → redirect to `/login` if not
2. **Admin check** — Does the user have a row in `admin_users`? → redirect to `/unauthorized` if not

### 7. Audit Trail
Every mutation performed through the admin panel is logged to the `admin_actions` table with:
- `admin_user_id` — Which admin performed the action
- `action_type` — What was done (e.g., `adjust_credits`, `resolve_ticket`)
- `target_table` / `target_id` — Which record was affected
- `payload` — What changed (before/after values)

---

## Data Flow Boundaries

| Boundary | Direction | Mechanism |
|----------|-----------|-----------|
| Browser ↔ Server | Bidirectional | Server Components (read), Server Actions (write), React Query (client cache) |
| Server ↔ Supabase | Bidirectional | `@supabase/ssr` with service_role key |
| Server ↔ Polar.sh | Read-only | `@polar-sh/sdk` (orders, customers, subscriptions) |
| Server ↔ Resend | Read + Write | `resend` SDK (send email, read metrics) |

---

*See [Folder Structure](folder-structure.md) for the complete source tree. See [Database](database.md) for schema details.*
