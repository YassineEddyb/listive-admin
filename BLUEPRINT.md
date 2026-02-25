# BLUEPRINT.md — Listive Admin Panel

> **Start here.** This is the complete map of the Listive Admin codebase. Every major concept is summarized inline with links to full documentation.

**Full docs:** [docs/README.md](docs/README.md)

---

## What Is Listive Admin?

Internal admin panel for the Listive platform. Monitor users, manage subscriptions and credits, review support tickets and feedback, inspect products and images, track webhooks, view analytics, and manage third-party integrations (Polar.sh, Resend). Built with Next.js 16, React 19, Supabase (service role), and shadcn/ui.

**Relationship:** This is a standalone Next.js app that reads from the same Supabase database as the main Listive app. It uses `service_role` to bypass RLS and has its own auth cookie (`sb-admin-auth-token`) to avoid conflicts.

---

## Project

### [Vision](docs/project/vision.md)

Full operational visibility into Listive. Every user action, credit flow, subscription event, and support request is surfaced. Admin can act (adjust credits, reply to tickets, manage subscriptions, toggle product visibility) without touching the database directly.

### [Tech Stack](docs/project/tech-stack.md)

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16.1.6 (App Router, Turbopack) |
| **React** | 19.2.4 |
| **Language** | TypeScript 5.7.3 (strict mode) |
| **Styling** | Tailwind CSS 3.4.17 + shadcn/ui (New York style) |
| **Database** | Supabase (service role — bypasses RLS) |
| **Payments API** | Polar.sh SDK v0.44.0 |
| **Email API** | Resend SDK v6.9.2 |
| **Data Tables** | TanStack React Table v8 |
| **Charts** | Recharts |
| **Validation** | Zod |
| **State** | React Query (manual invalidation, infinite stale time) |
| **Deployment** | Netlify (`@netlify/plugin-nextjs`) |
| **Dev Port** | 3005 |

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL        — Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   — Supabase anon key (auth only)
SUPABASE_SERVICE_ROLE_KEY       — Service role key (bypasses RLS)
NEXT_PUBLIC_SITE_URL            — Admin panel URL (default: http://localhost:3005)
RESEND_API_KEY                  — Resend API key for email ops
POLAR_ACCESS_TOKEN              — Polar.sh API token
POLAR_SERVER                    — sandbox | production
```

---

## Architecture

### [Overview](docs/architecture/overview.md)

Server Components call **controllers** (server-side Supabase/API queries) → render **components** (client-side UI). Mutations use **Server Actions** in `actions/` directories. All data access goes through the Supabase `service_role` client, which bypasses Row Level Security.

**Auth flow:** Supabase OAuth → middleware session refresh → admin layout double-guard (session check + `admin_users` table lookup). Only users with a row in `admin_users` can access `/admin/*`.

**Cookie isolation:** Custom storage key `sb-admin-auth-token` prevents cookie conflicts with the main Listive app running on the same domain.

### [Folder Structure](docs/architecture/folder-structure.md)

```text
src/
├── app/                — Pages & API routes (App Router)
│   ├── (auth)/login/   — Login page (route group)
│   ├── auth/callback/  — OAuth callback (API route)
│   ├── unauthorized/   — Unauthorized access page
│   └── admin/          — All admin pages (22 routes)
├── features/           — 18 feature modules
│   ├── analytics/      — Charts & trend data
│   ├── audit/          — Admin action audit log
│   ├── auth/           — Session, admin user, user menu
│   ├── credits/        — Credit balances, transactions, adjustments
│   ├── dashboard/      — Dashboard stats & trend charts
│   ├── feedback/       — User feedback management
│   ├── images/         — Image gallery & actions
│   ├── integrations/   — Polar.sh & Resend API dashboards
│   ├── listings/       — Marketplace listings overview
│   ├── products/       — Product management & edit history
│   ├── search/         — Global search across all entities
│   ├── settings/       — Admin user management
│   ├── stores/         — Shopify & Etsy store connections
│   ├── subscriptions/  — Subscription management
│   ├── support/        — Support tickets & replies
│   ├── system/         — System health & operations
│   ├── templates/      — User template overview
│   ├── users/          — User management, profiles, email, timeline
│   └── webhooks/       — Webhook event log
├── components/         — Shared UI
│   ├── data-table/     — Generic data table (4 files: table, header, pagination, toolbar)
│   ├── layout/         — Sidebar, topnav, page header
│   └── ui/             — 17 shadcn/ui primitives
├── libs/               — Service clients
│   ├── supabase/       — 5 files: admin, server, middleware, config, types
│   ├── polar/          — Polar.sh SDK client
│   └── resend/         — Resend SDK client
├── constants/          — routes.ts (20 route definitions)
├── providers/          — React Query provider
├── styles/             — globals.css (202 lines: tokens, scrollbar, animations)
├── types/              — ActionResponse<T>
├── utils/              — cn, export-csv, format-currency, format-relative-date, get-env-var
└── middleware.ts       — Session refresh (all routes except static assets)
```

### [Database](docs/architecture/database.md)

The admin panel reads from and writes to the same Supabase database as the main Listive app. It relies on these **admin-specific** tables, views, and functions:

| Object | Type | Purpose |
|--------|------|---------|
| `admin_users` | Table | Maps auth users to admin roles (row = access) |
| `admin_actions` | Table | Audit log of all admin mutations |
| `support_tickets` | Table | User support requests |
| `feedback_submissions` | Table | User feedback |
| `ticket_replies` | Table | Admin replies to tickets |
| `webhook_events` | Table | Processed webhook deduplication |
| `admin_users_view` | View | Unified user listing (credits, subs, products) |
| `admin_dashboard_stats()` | Function | All dashboard KPIs in one call |
| `admin_signups_by_day(n)` | Function | Daily signup trend data |
| `admin_credits_consumed_by_day(n)` | Function | Daily credit consumption trend |

**5 admin migrations** are tracked in [`supabase/migrations/`](supabase/README.md). They originate from the main Listive project and are copied here for reference.

The admin panel also reads from existing Listive tables: `users`, `user_products`, `product_images`, `user_credits`, `credit_transactions`, `credit_purchases`, `subscriptions`, `products`, `prices`, `user_templates`, `shopify_connections`, `etsy_connections`, and more.

### Routes (25 compiled)

| Route | Description |
|-------|-------------|
| `/` | Redirect → `/admin` or `/login` |
| `/login` | Admin login (Google OAuth) |
| `/unauthorized` | Access denied page |
| `/auth/callback` | OAuth callback (API route) |
| `/admin` | Dashboard — KPIs, trend charts |
| `/admin/analytics` | Analytics — detailed charts |
| `/admin/users` | User list with search, filters, export |
| `/admin/users/[id]` | User detail — profile, timeline, actions |
| `/admin/subscriptions` | Subscription management |
| `/admin/credits` | Credit balances, transactions, manual adjustments |
| `/admin/products` | Product list with search, export |
| `/admin/products/[id]` | Product detail — images, edit history |
| `/admin/images` | Image gallery across all users |
| `/admin/stores` | Shopify & Etsy store connections |
| `/admin/listings` | Marketplace listings |
| `/admin/templates` | User templates overview |
| `/admin/support` | Support ticket queue |
| `/admin/support/[id]` | Ticket detail — status, priority, replies |
| `/admin/feedback` | Feedback submissions |
| `/admin/feedback/[id]` | Feedback detail — review, status |
| `/admin/webhooks` | Webhook event log |
| `/admin/integrations` | Polar.sh & Resend API dashboards |
| `/admin/system` | System health, DB stats, operations |
| `/admin/settings` | Admin user management (add/revoke) |
| `/admin/audit` | Admin action audit log |

---

## Features

### [Dashboard](docs/features/dashboard.md)

KPI stat cards (total users, revenue, active subs, open tickets, pending feedback, products today, credits consumed). Signup and credit usage trend charts via `admin_dashboard_stats()`, `admin_signups_by_day()`, `admin_credits_consumed_by_day()`. Widget entrance animations with staggered delays.

### [Authentication](docs/features/auth.md)

Google OAuth via Supabase Auth. Middleware refreshes session on every request. Admin layout applies double guard: (1) valid session → redirect to `/login` if missing, (2) `admin_users` table lookup → redirect to `/unauthorized` if not an admin. Cookie stored under `sb-admin-auth-token` key. User menu dropdown with sign out.

### [User Management](docs/features/users.md)

Paginated user table with search, status filters, and CSV export. User detail page: profile info, subscription, credit balance, product count, store connections. Actions: edit profile dialog, send email (via Resend), impersonate (planned). User timeline shows chronological activity. Export button for bulk data extraction.

### [Subscriptions](docs/features/subscriptions.md)

Table of all platform subscriptions with plan name, status, billing period, amounts. Actions: cancel subscription. Status badges for active, trialing, canceled, past_due, etc.

### [Credits](docs/features/credits.md)

Three-tab view: credit balances, transaction history, credit purchases. Manual credit adjustment form (add/deduct with reason). All adjustments logged to `admin_actions` audit trail.

### [Products](docs/features/products.md)

Product table with thumbnail, title, user, image count, creation date. Product detail page: full product info, image gallery, edit history (from `image_edit_operations` table if available). Actions: toggle visibility, delete.

### Images

Gallery view of all generated images across users. Filterable. Image metadata (style, angle, aspect ratio, status).

### Stores

Shopify and Etsy store connection overview. Connection status, store details, token status.

### Listings

Overview of all marketplace listings published from the platform.

### Templates

Table of all user-created generation templates (style, angle, aspect ratio presets).

### [Support Tickets](docs/features/support.md)

Ticket queue with status (open, in_progress, resolved, closed), priority (low, normal, high, urgent), and category filters. Ticket detail page: description, status control, priority control, reply form. Admin replies stored in `ticket_replies` table and linked to admin user.

### [Feedback](docs/features/feedback.md)

Feedback table with type (feature, bug, general), status (submitted, under_review, planned, implemented, declined). Feedback detail page with status control for review workflow.

### Webhooks

Event log of all processed Polar.sh webhooks. Shows event type, processing timestamp, payload preview.

### [Integrations](docs/features/integrations.md)

Tabbed interface for third-party service dashboards:

- **Polar.sh** — Orders, customers, subscriptions, revenue metrics. Data fetched directly from Polar API via SDK.
- **Resend** — Recent emails, domain status, delivery metrics. Data fetched from Resend API via SDK.

### [System & Analytics](docs/features/system.md)

Database statistics, analytics charts, admin settings, audit log, webhook events, global search — all covered in the system doc. Includes: system health, detailed analytics, admin user management, action audit trail, webhook log, and command-palette search.

---

## Design System

### [Components](docs/design-system/components.md)

**17 shadcn/ui primitives** (New York style, Radix-based): AlertDialog, Badge, Button, Card, Dialog, DropdownMenu, Input, Label, Select, Skeleton, Table, Tabs, Textarea, Toast, Toaster, Tooltip, useToast.

**Shared components:**
- `StatCard` — Dashboard metric card with icon, value, trend indicator
- `StatusBadge` — Multi-status badge (25+ status variants)
- `ExportButton` — CSV export trigger
- `DataTable` — Generic sortable, paginated table (column header, pagination, toolbar)
- `PageHeader` — Sticky floating header with back button, icon, title, action slot
- `AdminSidebar` — 17-item sidebar with 5 sections
- `AdminTopnav` — Top bar with global search & user menu

**Feature components** colocated in `src/features/*/components/`.

### [Design Tokens](docs/design-system/tokens.md)

Brand palette: `brand-dark` #374752 · `brand-gray` #c3cdd5 · `brand-blue` #306491 · `brand-light` #edf3f7 · `brand-border` #e1e7ec · `brand-surface` #f5f5f5 · `brand-cta` #306491.

Shadows: `soft`, `soft-lg`, `soft-xl`, `inner-soft`.

Font: Inter (CSS variable).

Forced light mode (`.dark` vars duplicate `:root`).

### [Patterns](docs/design-system/patterns.md)

- **Glass header:** `bg-white/60 backdrop-blur-xl border-b border-black/[0.06]` — floating sticky header
- **Scroll isolation:** Scroll container has no horizontal padding; content wrapped in inner `px-6 pb-6` div; header uses `-mx-6 px-6` to break out
- **Widget animations:** CSS `@keyframes widget-entrance` with stagger delays (`.stagger-1` through `.stagger-8`)
- **Hover lift:** `transform: translateY(-2px)` + shadow on hover
- **Custom scrollbar:** Thin webkit/Firefox scrollbar (4px width, brand-gray track)
- **Gradient text:** Brand-colored gradient text utility

---

## Standards

### [Coding Rules](docs/standards/coding-rules.md)

TypeScript strict · `@/*` path aliases · Server Components by default · Feature-module organization (`controllers/`, `components/`, `actions/`) · kebab-case files · PascalCase components · `simple-import-sort` · Prettier (single quotes).

### Security

- **CSP headers** on all routes (connect-src: Supabase, Resend, Polar)
- **X-Frame-Options: DENY** — no iframe embedding
- **HSTS** — strict transport security
- **Cookie isolation** — `sb-admin-auth-token` prevents session conflicts
- **Double auth guard** — session + admin_users table check
- **Service role isolation** — admin client bypasses RLS, but only admins can reach the admin layout
- **RLS on admin tables** — `admin_users` and `admin_actions` have explicit service_role-only policies

### [Git Workflow](docs/standards/git-workflow.md)

`main` (production), `feature/*`, `fix/*`, `docs/*`, `refactor/*`. Conventional commits. Pre-push: `tsc --noEmit` + `bun run build`. Deploy: Netlify (`@netlify/plugin-nextjs`). Supabase migrations managed via main Listive project.

### [Performance](docs/standards/performance.md)

Server Components for data fetching · `optimizePackageImports` (lucide-react, @supabase/supabase-js) · Turbopack dev · React Query caching (infinite stale, manual invalidation) · Single-call dashboard stats function (avoids N+1).

---

## Context

### [Known Issues](docs/context/known-issues.md)

**Medium:** no automated tests. **Low:** admin tables not in generated types, no dark mode, `image_edit_operations` table may not exist. **Debt:** no rate limiting, no error boundary, manual type sync, hardcoded admin email check.

### [Decisions](docs/context/decisions.md)

Separate repo · shared Supabase instance · service role (no RLS) · cookie isolation (`sb-admin-auth-token`) · double auth guard · feature-module architecture · shadcn/ui (New York) · TanStack Table · no tests (intentional) · audit trail · read-only integrations.

---

## Database Migrations

5 admin-specific migrations tracked in [`supabase/migrations/`](supabase/README.md):

| Migration | Creates |
|-----------|---------|
| `20260205180000_add_webhook_events_tracking` | `webhook_events` table |
| `20260216174506_add_support_feedback_tables` | `support_tickets`, `feedback_submissions` |
| `20260224120000_add_admin_panel_support` | `admin_users`, `admin_actions`, 3 functions, 1 view |
| `20260224130000_add_ticket_replies` | `ticket_replies` table |
| `20260620000000_add_webhook_events_deny_policy` | Explicit deny-all RLS policy |

**Dependency:** Also requires `20260130162018_fix_rls_policies_production` from the main Listive project (grants service_role access to platform tables).

> These migrations are managed by the main Listive project. Copies are kept here for documentation — see [`supabase/README.md`](supabase/README.md) for details.

---

## Quick Reference

### Dev Commands

```bash
npm run dev              # Start dev server (Turbopack, port 3005)
npm run build            # Production build
npm run build:production # Lint + type-check + build
npm run type-check       # tsc --noEmit
npm run lint             # ESLint
npm run lint:fix         # ESLint with auto-fix
```

### Key Paths

```
src/app/admin/               → Admin pages (22 routes)
src/features/                → 18 feature modules
src/components/ui/           → 17 shadcn/ui primitives
src/components/data-table/   → Generic data table system
src/components/layout/       → Sidebar, topnav, page header
src/libs/supabase/           → Supabase clients (admin, server, middleware)
src/libs/polar/              → Polar.sh SDK client
src/libs/resend/             → Resend SDK client
src/constants/routes.ts      → Route map (20 routes)
src/styles/globals.css       → Design tokens & animations (202 lines)
supabase/migrations/         → Admin-specific DB migrations (5 files)
```

### Codebase Stats

```
Files:          156 files in 109 directories
TypeScript LOC: ~13,797 lines
Routes:         25 compiled (22 admin + login + unauthorized + callback)
Feature modules: 18
UI primitives:  17 shadcn/ui components
Nav items:      17 sidebar links in 5 sections
```

---

*Last updated: 2025-07*
