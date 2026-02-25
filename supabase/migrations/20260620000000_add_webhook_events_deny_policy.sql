-- Explicit deny-all policy for webhook_events table
-- RLS is enabled with no user-facing policies, which means only service_role can access.
-- This explicit policy documents the intention and guards against accidental policy grants.
-- See: SEC-06 in AUDIT_REPORT.md

-- Create an explicit deny-all policy as documentation (belt-and-suspenders)
DO $$
BEGIN
  -- Only create policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'webhook_events' AND policyname = 'deny_all_user_access'
  ) THEN
    CREATE POLICY deny_all_user_access ON webhook_events
      FOR ALL
      TO authenticated, anon
      USING (false);
  END IF;
END $$;
