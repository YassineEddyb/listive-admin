# Known Issues

> Active bugs, limitations, and technical debt in Listive Admin.

---

## Active Issues

### 1. Admin Tables Not in Generated Types
**Severity:** Low  
**Impact:** Developer experience  
**Description:** Admin-specific tables (`admin_users`, `admin_actions`, `support_tickets`, `feedback_submissions`, `ticket_replies`) are not present in the auto-generated Supabase types file (`src/libs/supabase/types.ts`).  
**Workaround:** Use `as any` casts with comments explaining why.  
**Fix:** Re-run `supabase gen types` after admin migrations are applied.

### 2. No Dark Mode
**Severity:** Low  
**Impact:** Aesthetics  
**Description:** The admin panel only supports light mode. No `dark:` variants are applied.  
**Workaround:** None — light mode only.  
**Fix:** Add `darkMode: 'class'` to Tailwind config and apply `dark:` variants throughout.

### 3. No Automated Tests
**Severity:** Medium  
**Impact:** Reliability  
**Description:** No unit, integration, or E2E tests exist. TypeScript strict mode and manual QA are the only safety nets.  
**Workaround:** Run `bun tsc --noEmit` before every deploy.  
**Fix:** Add Playwright E2E tests for critical flows (auth, user management, credit adjustments).

### 4. image_edit_operations Table May Not Exist
**Severity:** Low  
**Impact:** Products page  
**Description:** The `image_edit_operations` table may not exist in all environments. The products controller returns an empty array if the query fails.  
**Workaround:** Graceful fallback already implemented.  
**Fix:** Ensure migration exists for this table or remove the query.

---

## Technical Debt

### 1. Hardcoded Admin Email Check
The auth system checks `admin_users` table for admin role. If this table is empty or missing, no one can log in. Initial admin must be seeded manually.

### 2. Manual Type Sync
Supabase types in this project are a snapshot from the main Listive project. When the main app's schema changes, types here need manual update.

### 3. No Rate Limiting
Admin API routes and Server Actions have no rate limiting. Since it's internal tooling this is acceptable, but should be addressed if exposed publicly.

### 4. No Error Boundary
No React Error Boundary is implemented. An unhandled error in a Client Component will crash the page. Server Components fail gracefully with Next.js's built-in error handling.

### 5. Polar.sh Sort Parameter
The Polar.sh SDK v0.44.0 changed its sorting API. The subscriptions page had to remove sorting to avoid 422 errors. Re-evaluate when Polar SDK stabilizes.

---

## Environment Gaps

| Feature | Dev | Production |
|---------|-----|------------|
| Supabase | ✅ Connected | ✅ Same instance |
| Polar.sh | ✅ API token | ⬜ Needs prod token |
| Resend | ✅ API key | ⬜ Needs prod key |
| Netlify | N/A | ⬜ Not yet deployed |
| Custom domain | N/A | ⬜ Not configured |

---

*See [Decisions](decisions.md) for architectural rationale. See [Git Workflow](../standards/git-workflow.md) for deployment process.*
