# Folder Structure

> Annotated source tree for the Listive Admin codebase. Every significant directory and file is listed.

## Root

```
listive-admin/
├── .env.local.example        — Environment variable template (7 vars)
├── .eslintrc.json            — ESLint config (next/core-web-vitals + simple-import-sort)
├── BLUEPRINT.md              — Master index of entire codebase
├── components.json           — shadcn/ui CLI config (New York style, @/* alias)
├── netlify.toml              — Netlify build config (port 3005)
├── next.config.js            — Next.js config (CSP headers, optimized imports)
├── next-env.d.ts             — Next.js TypeScript declarations
├── package.json              — Dependencies & scripts
├── postcss.config.js         — PostCSS (Tailwind + Autoprefixer)
├── prettier.config.js        — Prettier config
├── tailwind.config.ts        — Tailwind (brand palette, custom shadows)
├── tsconfig.json             — TypeScript (strict, @/* paths)
├── docs/                     — Full documentation (this folder)
└── supabase/                 — Admin-specific migration reference
    ├── README.md             — Migration inventory & dependencies
    └── migrations/           — 5 SQL migration files
```

---

## `src/` — Application Source

### `src/app/` — Next.js App Router

```
src/app/
├── layout.tsx               — Root layout (Inter font, QueryProvider, Toaster)
├── page.tsx                 — / → redirect to /admin or /login
├── error.tsx                — Global error boundary
├── not-found.tsx            — Custom 404 page
│
├── (auth)/                  — Auth route group
│   └── login/
│       └── page.tsx         — Admin login page (Google OAuth)
│
├── auth/
│   └── callback/
│       └── route.ts         — OAuth callback (API route)
│
├── unauthorized/
│   └── page.tsx             — Access denied page
│
└── admin/                   — Protected admin area
    ├── layout.tsx           — Admin shell (double auth guard, sidebar + topnav)
    ├── page.tsx             — Dashboard home (KPIs, trend charts)
    ├── loading.tsx          — Dashboard skeleton
    │
    ├── analytics/           — Analytics charts
    │   ├── page.tsx
    │   └── loading.tsx
    │
    ├── users/               — User management
    │   ├── page.tsx         — User list (search, filters, export)
    │   ├── loading.tsx
    │   └── [id]/
    │       ├── page.tsx     — User detail (profile, timeline, actions)
    │       └── loading.tsx
    │
    ├── subscriptions/       — Subscription management
    │   ├── page.tsx
    │   └── loading.tsx
    │
    ├── credits/             — Credit management
    │   ├── page.tsx         — Balances, transactions, adjustments
    │   └── loading.tsx
    │
    ├── products/            — Product management
    │   ├── page.tsx         — Product list (search, export)
    │   ├── loading.tsx
    │   └── [id]/
    │       └── page.tsx     — Product detail (images, edit history)
    │
    ├── images/              — Image gallery
    │   ├── page.tsx
    │   └── loading.tsx
    │
    ├── stores/              — Connected stores
    │   ├── page.tsx
    │   └── loading.tsx
    │
    ├── listings/            — Marketplace listings
    │   └── page.tsx
    │
    ├── templates/           — User templates
    │   └── page.tsx
    │
    ├── support/             — Support tickets
    │   ├── page.tsx         — Ticket queue
    │   ├── loading.tsx
    │   └── [id]/
    │       └── page.tsx     — Ticket detail (status, priority, replies)
    │
    ├── feedback/            — Feedback management
    │   ├── page.tsx
    │   ├── loading.tsx
    │   └── [id]/
    │       └── page.tsx     — Feedback detail (review, status)
    │
    ├── webhooks/            — Webhook event log
    │   ├── page.tsx
    │   └── loading.tsx
    │
    ├── integrations/        — Third-party dashboards
    │   └── page.tsx         — Polar.sh & Resend tabs
    │
    ├── system/              — System health
    │   ├── page.tsx
    │   └── loading.tsx
    │
    ├── settings/            — Admin user management
    │   └── page.tsx
    │
    └── audit/               — Admin action audit log
        ├── page.tsx
        └── loading.tsx
```

### `src/features/` — Feature Modules (18 modules)

Each feature follows the **controllers → components → actions** pattern:

```
src/features/
├── analytics/               — Analytics charts
│   ├── controllers/         — get-analytics.ts
│   └── components/          — analytics-chart.tsx
│
├── audit/                   — Audit log
│   ├── controllers/         — get-audit-log.ts
│   └── components/          — audit-log-table.tsx
│
├── auth/                    — Authentication
│   ├── controllers/         — get-admin-user.ts, get-session.ts
│   ├── components/          — user-menu.tsx
│   └── actions/             — auth-actions.ts
│
├── credits/                 — Credit management
│   ├── controllers/         — get-transactions.ts
│   ├── components/          — credit-adjustment-form.tsx,
│   │                          credit-balances-table.tsx,
│   │                          transaction-table.tsx
│   └── actions/             — adjust-credits-action.ts
│
├── dashboard/               — Dashboard home
│   ├── controllers/         — get-dashboard-stats.ts
│   └── components/          — trend-chart.tsx
│
├── feedback/                — Feedback management
│   ├── controllers/         — get-feedback.ts
│   ├── components/          — feedback-table.tsx, feedback-status-control.tsx
│   └── actions/             — update-feedback-action.ts
│
├── images/                  — Image gallery
│   ├── controllers/         — get-images.ts
│   ├── components/          — image-gallery.tsx
│   └── actions/             — image-actions.ts
│
├── integrations/            — External API dashboards
│   └── controllers/         — get-polar-data.ts, get-resend-data.ts
│
├── listings/                — Marketplace listings
│   ├── controllers/         — get-listings.ts
│   └── components/          — listings-table.tsx
│
├── products/                — Product management
│   ├── controllers/         — get-products.ts, get-edit-history.ts
│   ├── components/          — product-table.tsx, product-actions.tsx
│   └── actions/             — product-actions.ts
│
├── search/                  — Global search
│   ├── components/          — global-search.tsx
│   └── actions/             — global-search.ts
│
├── settings/                — Admin user management
│   ├── controllers/         — get-admin-users.ts
│   ├── components/          — admin-users-manager.tsx
│   └── actions/             — manage-admin-users.ts
│
├── stores/                  — Store connections
│   ├── controllers/         — get-stores.ts
│   ├── components/          — store-tables.tsx
│   └── actions/             — store-actions.ts
│
├── subscriptions/           — Subscription management
│   ├── controllers/         — get-subscriptions.ts
│   ├── components/          — subscription-table.tsx, subscription-actions.tsx
│   └── actions/             — subscription-actions.ts
│
├── support/                 — Support tickets
│   ├── controllers/         — get-tickets.ts
│   ├── components/          — ticket-table.tsx, ticket-status-control.tsx,
│   │                          ticket-priority-control.tsx, ticket-reply-form.tsx
│   └── actions/             — update-ticket-action.ts, ticket-reply-action.ts
│
├── system/                  — System health
│   ├── controllers/         — get-system-health.ts
│   ├── components/          — system-operations.tsx
│   └── actions/             — system-actions.ts
│
├── templates/               — Template overview
│   ├── controllers/         — get-templates.ts
│   └── components/          — templates-table.tsx
│
├── users/                   — User management
│   ├── controllers/         — get-users.ts, get-user-detail.ts, get-user-timeline.ts
│   ├── components/          — users-table.tsx, user-actions.tsx,
│   │                          edit-profile-dialog.tsx, send-email-dialog.tsx,
│   │                          user-timeline.tsx
│   └── actions/             — user-actions.ts, update-profile-action.ts, send-email.ts
│
└── webhooks/                — Webhook log
    ├── controllers/         — get-webhooks.ts
    └── components/          — webhook-table.tsx
```

### `src/components/` — Shared Components

```
src/components/
├── export-button.tsx        — CSV export trigger button
├── stat-card.tsx            — Dashboard metric card (icon, value, trend)
├── status-badge.tsx         — Multi-status badge (25+ variants)
│
├── data-table/              — Generic data table system (4 files)
│   ├── index.ts             — Barrel export
│   ├── data-table.tsx       — Core table with sorting/pagination
│   ├── data-table-column-header.tsx  — Sortable column header
│   ├── data-table-pagination.tsx     — Pagination controls
│   └── data-table-toolbar.tsx        — Search/filter toolbar
│
├── layout/                  — Layout components (3 files)
│   ├── admin-sidebar.tsx    — 17-item sidebar with 5 sections
│   ├── admin-topnav.tsx     — Top bar with global search + user menu
│   └── page-header.tsx      — Sticky floating page header
│
└── ui/                      — shadcn/ui primitives (17 files)
    ├── alert-dialog.tsx
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── dropdown-menu.tsx
    ├── input.tsx
    ├── label.tsx
    ├── select.tsx
    ├── skeleton.tsx
    ├── table.tsx
    ├── tabs.tsx
    ├── textarea.tsx
    ├── toast.tsx
    ├── toaster.tsx
    ├── tooltip.tsx
    └── use-toast.ts
```

### `src/libs/` — Service Clients

```
src/libs/
├── supabase/
│   ├── config.ts                    — ADMIN_STORAGE_KEY, Supabase URL/keys
│   ├── supabase-admin.ts            — Service role client (bypasses RLS)
│   ├── supabase-server-client.ts    — SSR client with cookie auth
│   ├── supabase-middleware-client.ts — Middleware session refresh
│   └── types.ts                     — Auto-generated DB types (1,569 lines)
├── polar/
│   └── polar-client.ts             — Polar.sh SDK client (sandbox/production)
└── resend/
    └── resend-client.ts            — Resend email client + from addresses
```

### Other `src/` Directories

```
src/
├── constants/
│   └── routes.ts            — Typed route map (20 routes)
├── providers/
│   └── query-provider.tsx   — React Query (staleTime: Infinity)
├── styles/
│   └── globals.css          — Design tokens, scrollbar, animations (202 lines)
├── types/
│   └── action-response.ts   — ActionResponse<T> type
├── utils/
│   ├── cn.ts                — clsx + tailwind-merge
│   ├── export-csv.ts        — Generic CSV export utility
│   ├── format-currency.ts   — formatCurrency(cents), formatCompactNumber(num)
│   ├── format-relative-date.ts — "3 days ago" formatting
│   └── get-env-var.ts       — Required env var getter (throws if missing)
└── middleware.ts            — Session refresh on all routes
```

---

*See [Architecture Overview](overview.md) for how these files connect. See [Database](database.md) for the schema.*
