# Database Schema

> The admin panel reads from and writes to the same Supabase PostgreSQL database as the main Listive app. Admin-specific objects are documented here. 5 admin migrations tracked in `supabase/migrations/`.

## Overview

The admin panel uses **service_role** to bypass RLS and access all platform data. It has its own dedicated tables for admin authorization, audit logging, and support operations.

**Types:** Auto-generated via Supabase CLI → `src/libs/supabase/types.ts` (1,569 lines). Admin-specific tables (`admin_users`, `admin_actions`, `support_tickets`, `feedback_submissions`, `ticket_replies`) are NOT in the generated types — controllers use `as any` casts with explanatory comments.

---

## Admin-Specific Tables

### Authorization

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `admin_users` | Maps auth users to admin roles | `id`, `user_id`, `email`, `created_at`, `created_by` |

- A row in this table = admin access
- `email` is denormalized from `auth.users` for easy lookup
- `created_by` tracks who granted access (audit trail)
- RLS: enabled, service_role-only policy

### Audit

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `admin_actions` | Audit log of all admin mutations | `id`, `admin_user_id`, `action_type`, `target_table`, `target_id`, `payload`, `created_at` |

- Every credit adjustment, ticket reply, status change recorded here
- `payload` is JSONB — stores before/after values or the applied delta
- RLS: enabled, service_role-only policy

### Support

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `support_tickets` | User support requests | `id`, `user_id`, `ticket_id`, `subject`, `category`, `description`, `status`, `priority`, `created_at`, `resolved_at` |
| `ticket_replies` | Admin replies to tickets | `id`, `ticket_id`, `admin_user_id`, `message`, `created_at` |
| `feedback_submissions` | User feedback | `id`, `user_id`, `feedback_id`, `type`, `title`, `description`, `status`, `rating`, `can_follow_up` |

- `ticket_id` format: `TK-123456789` (human-readable)
- `feedback_id` format: `FB-123456789`
- Categories: `technical`, `billing`, `feature`, `other`
- Ticket statuses: `open`, `in_progress`, `resolved`, `closed`
- Ticket priorities: `low`, `normal`, `high`, `urgent`
- Feedback types: `feature`, `bug`, `general`
- Feedback statuses: `submitted`, `under_review`, `planned`, `implemented`, `declined`

### Infrastructure

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `webhook_events` | Processed webhook deduplication | `id` (text, webhook-id), `event_type`, `processed_at`, `payload`, `created_at` |

- Prevents duplicate webhook processing
- RLS: enabled, no user policies (service_role-only + explicit deny-all)

---

## Admin-Specific Views

### `admin_users_view`

Unified view of all platform users for the admin users listing page:

| Column | Source |
|--------|--------|
| `user_id` | `users.id` |
| `email` | `auth.users.email` |
| `full_name` | `users.full_name` |
| `avatar_url` | `users.avatar_url` |
| `onboarding_completed` | `users.onboarding_completed` |
| `credit_balance` | `user_credits.credits` |
| `subscription_status` | `subscriptions.status` |
| `plan_name` | `products.name` (via subscriptions → prices → products) |
| `product_count` | Count of `user_products` |
| `created_at` | `auth.users.created_at` |

Requires SECURITY DEFINER to access `auth.users`. Query via service_role only.

---

## Admin-Specific Functions

| Function | Returns | Purpose |
|----------|---------|---------|
| `admin_dashboard_stats()` | JSON | All dashboard KPIs in a single call |
| `admin_signups_by_day(days_back)` | TABLE(day, signup_count) | Daily signups for trend chart |
| `admin_credits_consumed_by_day(days_back)` | TABLE(day, total_credits) | Daily credit usage for trend chart |

### `admin_dashboard_stats()` Return Shape

```json
{
  "total_users": 1234,
  "new_users_today": 5,
  "new_users_this_week": 23,
  "total_products": 5678,
  "products_today": 12,
  "total_images": 15000,
  "total_credits_consumed": 50000,
  "credits_consumed_today": 200,
  "total_revenue_cents": 250000,
  "active_subscriptions": 450,
  "subscriptions_by_plan": { "Starter": 200, "Growth": 150, "Pro": 100 },
  "open_tickets": 8,
  "pending_feedback": 15
}
```

All three functions use `SECURITY DEFINER` to access `auth.users` and `SET search_path = public`.

---

## Platform Tables (Read by Admin)

The admin panel reads from these existing Listive tables via service_role:

| Table | Admin Usage |
|-------|-------------|
| `users` | User profiles, onboarding status |
| `user_products` | Product listings |
| `product_images` | Generated images |
| `image_edit_history` | Image version history |
| `user_credits` | Credit balances |
| `credit_transactions` | Transaction history |
| `credit_purchases` | Purchase records |
| `customers` | Polar.sh customer mapping |
| `subscriptions` | Subscription status |
| `products` | Polar product catalog |
| `prices` | Pricing tiers |
| `user_templates` | Generation presets |
| `shopify_connections` | Shopify store connections |
| `etsy_connections` | Etsy shop connections |
| `shopify_listing_history` | Shopify listing records |
| `etsy_listing_history` | Etsy listing records |

---

## Row-Level Security (RLS)

Admin tables use a different RLS pattern than user tables:

```sql
-- Admin tables: service_role-only access
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access"
  ON admin_users FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
```

No anon or authenticated policies → users cannot query admin tables even if they know they exist.

`webhook_events` has an additional explicit deny-all policy:
```sql
CREATE POLICY deny_all_user_access ON webhook_events
  FOR ALL TO authenticated, anon USING (false);
```

---

## Migration Files

5 admin-specific migrations in `supabase/migrations/`:

| Migration | Creates |
|-----------|---------|
| `20260205180000_add_webhook_events_tracking` | `webhook_events` table + index |
| `20260216174506_add_support_feedback_tables` | `support_tickets` + `feedback_submissions` + RLS + indexes |
| `20260224120000_add_admin_panel_support` | `admin_users` + `admin_actions` + 3 functions + 1 view |
| `20260224130000_add_ticket_replies` | `ticket_replies` + RLS |
| `20260620000000_add_webhook_events_deny_policy` | Explicit deny-all RLS policy |

**Dependency:** Also requires `20260130162018_fix_rls_policies_production` from main Listive (grants service_role access to platform tables).

> See [`supabase/README.md`](../../supabase/README.md) for full migration documentation.

---

*See [Architecture Overview](overview.md) for the full system diagram. See [Folder Structure](folder-structure.md) for the source tree.*
