-- Track processed webhook events to prevent duplicate processing
-- This provides idempotency at the event level
CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY, -- webhook-id header from Polar
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload JSONB, -- Optional: store payload for debugging
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for cleanup of old events
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at);

-- RLS: Only service role can access this table
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- No policies = only service role can access (which is what we want for webhooks)
