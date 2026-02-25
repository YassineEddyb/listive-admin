# Supabase Migrations — Listive Admin

These are the database migrations **required by the admin panel**. They live in the main Listive project (`listive/supabase/migrations/`) and are copied here for reference so you know exactly which migrations must be applied to the production database for the admin panel to work.

> **Important:** Do NOT run these migrations from this project. They are already managed by the main Listive project's migration pipeline. This copy exists purely for documentation and tracking.

## Migration Inventory

| # | Migration | Tables / Objects Created | Purpose |
|---|-----------|-------------------------|---------|
| 1 | `20260205180000_add_webhook_events_tracking.sql` | `webhook_events` | Idempotent webhook event tracking (Polar.sh) |
| 2 | `20260216174506_add_support_feedback_tables.sql` | `support_tickets`, `feedback_submissions` | User support requests and feedback storage |
| 3 | `20260224120000_add_admin_panel_support.sql` | `admin_users`, `admin_actions`, `admin_users_view`, `admin_dashboard_stats()`, `admin_signups_by_day()`, `admin_credits_consumed_by_day()` | Core admin panel infrastructure |
| 4 | `20260224130000_add_ticket_replies.sql` | `ticket_replies` | Admin replies to support tickets |
| 5 | `20260620000000_add_webhook_events_deny_policy.sql` | RLS policy on `webhook_events` | Explicit deny-all for non-service-role access |

## Dependency

The admin panel also depends on the general service-role RLS policies added in:

- `20260130162018_fix_rls_policies_production.sql` — Grants `service_role` full access to `customers`, `credit_purchases`, `credit_transactions`, `user_credits`, `subscriptions`, `users`, `user_products`, `product_images`, `user_templates`, etc.

This migration is **not** admin-specific (it enables webhooks + server operations for the main app too), so it is not copied here but must be present in production.

## Admin-Specific Tables

| Table | Access | Description |
|-------|--------|-------------|
| `admin_users` | service_role only | Maps auth users to admin roles. A row = admin access. |
| `admin_actions` | service_role only | Audit log of all admin mutations. |
| `support_tickets` | RLS (user read/insert) + service_role | User support requests. |
| `feedback_submissions` | RLS (user read/insert) + service_role | User feedback. |
| `ticket_replies` | service_role + user read (own tickets) | Admin replies to tickets. |
| `webhook_events` | service_role only | Processed webhook deduplication. |

## Admin-Specific Functions & Views

| Object | Type | Description |
|--------|------|-------------|
| `admin_dashboard_stats()` | Function | Returns all dashboard KPIs in a single JSON call. |
| `admin_signups_by_day(days)` | Function | Daily signup counts for trend charts. |
| `admin_credits_consumed_by_day(days)` | Function | Daily credit consumption for trend charts. |
| `admin_users_view` | View | Unified user listing with credits, subscriptions, product count. |
