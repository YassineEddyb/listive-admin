# Git Workflow

> Branching strategy, commit conventions, and deployment process for Listive Admin.

## Repositories

| Repo | Branch | Purpose |
|------|--------|---------|
| `YassineEddyb/listive-admin` | `main` | Admin panel (standalone) |
| `YassineEddyb/Listive` | `new/admin` | Main app (admin-related migrations also live here) |

---

## Branching Strategy

```
main
├── feature/[name]       — New feature work
├── fix/[name]           — Bug fixes
├── docs/[name]          — Documentation updates
└── refactor/[name]      — Code improvements
```

### Rules
- `main` is the production branch
- Feature branches are created from `main`
- PRs merge back into `main`
- Delete branches after merge

---

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(users): add user detail timeline
fix(auth): resolve cookie isolation issue
docs(blueprint): add architecture docs
refactor(dashboard): extract stats controller
chore(deps): update next to 16.1.6
```

### Types

| Type | When |
|------|------|
| `feat` | New feature or functionality |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change that doesn't add features or fix bugs |
| `chore` | Build/tooling/dependency changes |
| `style` | Formatting, missing semicolons, etc. |
| `test` | Adding or updating tests |

### Scope
Use the feature module name: `users`, `auth`, `dashboard`, `credits`, `products`, `support`, etc.

---

## Build & Verification

### Commands

```bash
# Development
bun dev             # Start dev server (port 3005, Turbopack)

# Type checking
bun tsc --noEmit    # Full TypeScript check

# Build
bun run build       # Production build (25 routes)

# Lint
bun lint            # ESLint check
```

### Pre-Push Checklist
1. ✅ `bun tsc --noEmit` passes (zero errors)
2. ✅ `bun run build` succeeds (all 25 routes compile)
3. ✅ No console errors in browser
4. ✅ Auth flow works (login → admin check → dashboard)

---

## Deployment

### Platform: Netlify

**Config:** `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Environment Variables (Production)
Set in Netlify dashboard:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server-only) |
| `POLAR_ACCESS_TOKEN` | Polar.sh API token |
| `RESEND_API_KEY` | Resend email API key |
| `ADMIN_STORAGE_KEY` | Auth cookie key |
| `ADMIN_ENCRYPTION_KEY` | Auth cookie encryption |

### Deployment Flow
1. Push to `main`
2. Netlify auto-builds
3. `@netlify/plugin-nextjs` handles SSR
4. Site live at configured domain

---

## Database Migrations

Admin migrations live in two places:
- **`listive-admin/supabase/migrations/`** — Reference copies for tracking
- **`Listive/supabase/migrations/`** — Canonical source (applied to prod DB)

### Important
The admin panel shares Supabase with the main Listive app. All migrations are applied via the main Listive project's `supabase db push`.

---

*See [Coding Rules](coding-rules.md) for code standards. See [Database](../architecture/database.md) for schema details.*
