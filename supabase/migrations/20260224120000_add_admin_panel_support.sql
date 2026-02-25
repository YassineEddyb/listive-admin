-- Migration: Add admin panel database support
-- Adds admin_users table, admin_actions audit log, dashboard stats function,
-- admin users view, and time-series analytics functions.
-- These are consumed exclusively by the listive-admin project via service_role client.

-- ============================================
-- Table 1: admin_users
-- Maps Supabase auth users to admin roles.
-- Only users with a row in this table can access the admin panel.
-- Inserts to this table are a privileged operation — each grants full platform visibility.
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL, -- Denormalized from auth.users for easy lookup without joins
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by TEXT, -- Who granted admin access (e.g. 'manual', 'super_admin:uuid', etc.)

  CONSTRAINT unique_admin_user UNIQUE(user_id)
);

-- ⚠️ VERIFY: RLS is ENABLED with no user-facing policies (same pattern as webhook_events).
-- This means anon/authenticated clients cannot read this table at all.
-- The admin panel uses service_role which bypasses RLS.
-- If you prefer RLS fully disabled (ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY),
-- be aware that anon/authenticated Supabase clients could then query this table.
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only service_role can access admin_users
CREATE POLICY "Service role has full access to admin_users"
  ON admin_users FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Documentation
COMMENT ON TABLE admin_users IS 'Maps Supabase auth users to admin roles. A row here grants full admin panel access. Treat inserts as a privileged operation.';
COMMENT ON COLUMN admin_users.email IS 'Denormalized from auth.users for quick lookups without joining the auth schema';
COMMENT ON COLUMN admin_users.created_by IS 'Audit trail: who granted admin access (e.g. manual, super_admin:<uuid>)';

-- ============================================
-- Table 2: admin_actions
-- Audit log for all write operations performed through the admin panel.
-- Every credit adjustment, ticket update, or feedback review is recorded here.
-- ============================================
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- e.g. adjust_credits, resolve_ticket, update_feedback, revoke_admin
  target_table TEXT, -- Which table was affected (e.g. user_credits, support_tickets)
  target_id TEXT, -- Which record was affected (UUID or other identifier, stored as text for flexibility)
  payload JSONB, -- What changed — before/after values, amounts, or the delta
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: same pattern — enabled with service_role-only access
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to admin_actions"
  ON admin_actions FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Indexes for querying audit history
CREATE INDEX idx_admin_actions_admin_user_id ON admin_actions(admin_user_id);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at DESC);
CREATE INDEX idx_admin_actions_action_type ON admin_actions(action_type);
CREATE INDEX idx_admin_actions_target ON admin_actions(target_table, target_id);

-- Documentation
COMMENT ON TABLE admin_actions IS 'Audit log for all write operations performed through the admin panel. Every mutation is recorded for accountability.';
COMMENT ON COLUMN admin_actions.action_type IS 'Type of admin action: adjust_credits, resolve_ticket, update_feedback, revoke_admin, etc.';
COMMENT ON COLUMN admin_actions.target_table IS 'The database table that was affected by this action';
COMMENT ON COLUMN admin_actions.target_id IS 'Primary key of the affected record (stored as text for flexibility across UUID and text PKs)';
COMMENT ON COLUMN admin_actions.payload IS 'JSON payload describing the change — typically contains before/after values or the applied delta';

-- ============================================
-- Function: admin_dashboard_stats()
-- Returns a single JSON object with all KPIs needed for the admin dashboard home page.
-- Designed for a single call per page load — avoids N+1 queries.
--
-- Return shape:
-- {
--   "total_users": integer,
--   "new_users_today": integer,
--   "new_users_this_week": integer,
--   "total_products": integer,
--   "products_today": integer,
--   "total_images": integer,
--   "total_credits_consumed": integer,
--   "credits_consumed_today": integer,
--   "total_revenue_cents": integer,
--   "active_subscriptions": integer,
--   "subscriptions_by_plan": { "Plan Name": count, ... },
--   "open_tickets": integer,
--   "pending_feedback": integer
-- }
-- ============================================
CREATE OR REPLACE FUNCTION admin_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    -- User metrics
    'total_users', (SELECT count(*) FROM users),
    'new_users_today', (
      SELECT count(*) FROM auth.users
      WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'UTC')
    ),
    'new_users_this_week', (
      SELECT count(*) FROM auth.users
      WHERE created_at >= date_trunc('week', now() AT TIME ZONE 'UTC')
    ),

    -- Product & image metrics
    'total_products', (SELECT count(*) FROM user_products),
    'products_today', (
      SELECT count(*) FROM user_products
      WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'UTC')
    ),
    'total_images', (
      SELECT count(*) FROM product_images WHERE status = 'completed'
    ),

    -- Credit metrics
    'total_credits_consumed', (
      SELECT COALESCE(sum(abs(amount)), 0)::bigint
      FROM credit_transactions WHERE type = 'usage'
    ),
    'credits_consumed_today', (
      SELECT COALESCE(sum(abs(amount)), 0)::bigint
      FROM credit_transactions
      WHERE type = 'usage'
        AND created_at >= date_trunc('day', now() AT TIME ZONE 'UTC')
    ),

    -- Revenue (sum of all completed credit purchases, in cents)
    'total_revenue_cents', (
      SELECT COALESCE(sum(amount_paid), 0)::bigint
      FROM credit_purchases WHERE status = 'completed'
    ),

    -- Subscription metrics
    'active_subscriptions', (
      SELECT count(*) FROM subscriptions
      WHERE status IN ('active', 'trialing')
    ),
    'subscriptions_by_plan', (
      SELECT COALESCE(json_object_agg(plan_name, plan_count), '{}'::json)
      FROM (
        SELECT p.name AS plan_name, count(*) AS plan_count
        FROM subscriptions s
        JOIN prices pr ON pr.id = s.price_id
        JOIN products p ON p.id = pr.product_id
        WHERE s.status IN ('active', 'trialing')
        GROUP BY p.name
      ) sub
    ),

    -- Support metrics
    'open_tickets', (
      SELECT count(*) FROM support_tickets
      WHERE status IN ('open', 'in_progress')
    ),
    'pending_feedback', (
      SELECT count(*) FROM feedback_submissions
      WHERE status = 'submitted'
    )
  ) INTO result;

  RETURN result;
END;
$$;

COMMENT ON FUNCTION admin_dashboard_stats() IS 'Returns a single JSON object with all admin dashboard KPIs. Called once per dashboard page load. Uses SECURITY DEFINER to access auth.users.';

-- ============================================
-- View: admin_users_view
-- Unified view of all platform users with their key metrics.
-- Backbone of the /admin/users listing page.
--
-- Columns returned:
--   user_id, email, full_name, avatar_url, onboarding_completed,
--   credit_balance, subscription_status, plan_name, product_count, created_at
--
-- Note: This view joins auth.users (for email and created_at) which requires
-- the view owner (postgres) to have access to the auth schema — which it does
-- in standard Supabase deployments. The admin panel queries this via service_role.
-- ============================================
CREATE OR REPLACE VIEW admin_users_view AS
SELECT
  u.id AS user_id,
  au.email,
  u.full_name,
  u.avatar_url,
  u.onboarding_completed,
  COALESCE(uc.credits, 0) AS credit_balance,
  s.status AS subscription_status,
  p.name AS plan_name,
  (SELECT count(*) FROM user_products up WHERE up.user_id = u.id) AS product_count,
  au.created_at
FROM users u
JOIN auth.users au ON au.id = u.id
LEFT JOIN user_credits uc ON uc.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id AND s.status IN ('active', 'trialing')
LEFT JOIN prices pr ON pr.id = s.price_id
LEFT JOIN products p ON p.id = pr.product_id;

COMMENT ON VIEW admin_users_view IS 'Unified view joining users, auth.users, credits, subscriptions, and product count. Used by the admin panel users listing page. Query via service_role only.';

-- ============================================
-- Function: admin_signups_by_day(days_back integer)
-- Returns a table of (day, signup_count) for the signup trend chart.
-- Defaults to last 30 days.
--
-- Usage: SELECT * FROM admin_signups_by_day(30);
-- ============================================
CREATE OR REPLACE FUNCTION admin_signups_by_day(days_back integer DEFAULT 30)
RETURNS TABLE(day date, signup_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT
      date_trunc('day', au.created_at)::date AS day,
      count(*) AS signup_count
    FROM auth.users au
    WHERE au.created_at >= (now() AT TIME ZONE 'UTC') - (days_back || ' days')::interval
    GROUP BY 1
    ORDER BY 1;
END;
$$;

COMMENT ON FUNCTION admin_signups_by_day(integer) IS 'Returns daily signup counts for the last N days (default 30). Used for the admin dashboard signup trend chart. Requires SECURITY DEFINER to access auth.users.';

-- ============================================
-- Function: admin_credits_consumed_by_day(days_back integer)
-- Returns a table of (day, total_credits) for the credit usage trend chart.
-- Pulls from credit_transactions where type = 'usage'.
-- Defaults to last 30 days.
--
-- Usage: SELECT * FROM admin_credits_consumed_by_day(30);
-- ============================================
CREATE OR REPLACE FUNCTION admin_credits_consumed_by_day(days_back integer DEFAULT 30)
RETURNS TABLE(day date, total_credits bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT
      date_trunc('day', ct.created_at)::date AS day,
      COALESCE(sum(abs(ct.amount)), 0)::bigint AS total_credits
    FROM credit_transactions ct
    WHERE ct.type = 'usage'
      AND ct.created_at >= (now() AT TIME ZONE 'UTC') - (days_back || ' days')::interval
    GROUP BY 1
    ORDER BY 1;
END;
$$;

COMMENT ON FUNCTION admin_credits_consumed_by_day(integer) IS 'Returns daily credit consumption totals for the last N days (default 30). Used for the admin dashboard credits trend chart.';
