-- Migration: Add ticket replies table for admin support replies
-- Allows admins to reply to support tickets from the admin panel.

CREATE TABLE IF NOT EXISTS ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;

-- Only service_role can access (admin panel uses service_role client)
CREATE POLICY "Service role has full access to ticket_replies"
  ON ticket_replies FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can view replies on their own tickets
CREATE POLICY "Users can view replies on their tickets"
  ON ticket_replies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM support_tickets st
      WHERE st.id = ticket_replies.ticket_id
      AND st.user_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_ticket_replies_ticket_id ON ticket_replies(ticket_id);
CREATE INDEX idx_ticket_replies_admin_user_id ON ticket_replies(admin_user_id);
CREATE INDEX idx_ticket_replies_created_at ON ticket_replies(created_at);

COMMENT ON TABLE ticket_replies IS 'Admin replies to user support tickets. Each reply is associated with both the ticket and the admin who wrote it.';
