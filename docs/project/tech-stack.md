# Technology Stack

## Runtime & Framework

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.6 | App Router, React Server Components, Server Actions |
| **React** | 19.2.4 | UI library |
| **TypeScript** | 5.7.3 | Strict mode, `@/*` path aliases, bundler resolution |
| **Node.js** | ≥18 | Runtime (required by Next.js 16) |
| **Turbopack** | Built-in | Dev server (`next dev --turbopack --port 3005`) |

---

## Backend Services

| Service | Purpose | Package |
|---------|---------|---------|
| **Supabase** | Auth + PostgreSQL database | `@supabase/ssr` ^0.5.2, `@supabase/supabase-js` ^2.49.4 |
| **Polar.sh** | Subscription & payment data (read-only) | `@polar-sh/sdk` ^0.44.0 |
| **Resend** | Email sending + delivery metrics | `resend` ^6.9.2 |

### Supabase Client Hierarchy

| Client | File | Context | Auth |
|--------|------|---------|------|
| Admin | `supabase-admin.ts` | Controllers, actions | Service role (bypasses RLS) |
| Server | `supabase-server-client.ts` | Server Components | User session (cookie) |
| Middleware | `supabase-middleware-client.ts` | Middleware | Session refresh |

**Cookie isolation key:** `sb-admin-auth-token` (prevents conflicts with main app's `sb-auth-token`).

---

## UI Layer

| Technology | Version | Purpose |
|-----------|---------|---------|
| **shadcn/ui** | New York style | 17 copy-paste UI components |
| **Radix UI** | Various | Accessible primitives (dialog, dropdown, tabs, etc.) |
| **Tailwind CSS** | 3.4.17 | Utility-first styling with custom brand palette |
| **tailwindcss-animate** | 1.0.7 | Animation utilities |
| **class-variance-authority** | 0.7.1 | Component variant management |
| **clsx** + **tailwind-merge** | 2.1.1 / 3.0.2 | Class name composition (`cn()` utility) |
| **Lucide React** | 0.474.0 | Icon library |

---

## Data & State Management

| Technology | Purpose |
|-----------|---------|
| **React Query** (`@tanstack/react-query` ^5.72) | Client-side state caching (infinite stale, manual invalidation) |
| **TanStack React Table** (`@tanstack/react-table` ^8.21) | Data table engine (sorting, pagination, filtering) |
| **Recharts** (^2.15) | Dashboard charts and analytics |
| **Server Actions** | Mutations (credit adjustments, ticket replies, admin management) |
| **Zod** (^3.24) | Runtime schema validation |

---

## Build & Dev Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 10.0.1 | Linting (`next/core-web-vitals` + `simple-import-sort`) |
| **Prettier** | 2.8.8 | Formatting (single quotes, Tailwind plugin) |
| **PostCSS** | 8.5 | CSS processing (Tailwind + Autoprefixer) |

---

## Deployment

| Target | Purpose | Config File |
|--------|---------|-------------|
| **Netlify** | Primary deployment (SSR functions) | `netlify.toml` |

Build command: `next build`
Production build: `npm run lint && npm run type-check && next build`

---

## Environment Variables (7 total)

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (auth only) | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (bypasses RLS) | Yes |
| `NEXT_PUBLIC_SITE_URL` | Admin panel URL | Yes (default: `http://localhost:3005`) |
| `RESEND_API_KEY` | Resend API key for email ops | Yes |
| `POLAR_ACCESS_TOKEN` | Polar.sh API token | Yes |
| `POLAR_SERVER` | `sandbox` or `production` | Yes |

---

*See [Architecture Overview](../architecture/overview.md) for how these technologies connect.*
