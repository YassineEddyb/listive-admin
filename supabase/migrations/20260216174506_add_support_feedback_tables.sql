-- Migration: Add support tickets and feedback submissions tables
-- This adds database persistence for user support requests and feedback

/**
 * SUPPORT TICKETS TABLE
 * Stores user support requests submitted through the contact form
 */
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_id TEXT NOT NULL UNIQUE, -- Human-readable ticket ID (e.g., TK-123456789)
  subject TEXT NOT NULL,
  category TEXT NOT NULL, -- technical, billing, feature, other
  description TEXT NOT NULL,
  product_id UUID REFERENCES user_products(id) ON DELETE SET NULL, -- Optional product reference
  status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT support_tickets_category_check CHECK (category IN ('technical', 'billing', 'feature', 'other')),
  CONSTRAINT support_tickets_status_check CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  CONSTRAINT support_tickets_priority_check CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- Enable RLS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own support tickets" 
  ON support_tickets FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own support tickets" 
  ON support_tickets FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all support tickets" 
  ON support_tickets FOR ALL 
  USING (auth.role() = 'service_role');

-- Indexes for faster lookups
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_ticket_id ON support_tickets(ticket_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at DESC);

/**
 * FEEDBACK SUBMISSIONS TABLE
 * Stores user feedback submitted through the feedback form
 */
CREATE TABLE IF NOT EXISTS feedback_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_id TEXT NOT NULL UNIQUE, -- Human-readable feedback ID (e.g., FB-123456789)
  type TEXT NOT NULL, -- feature, bug, general
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT, -- low, medium, high (for feature requests)
  category TEXT[], -- Array of categories (e.g., ['ui', 'performance'])
  severity TEXT, -- minor, moderate, critical (for bugs)
  rating INTEGER, -- 1-5 rating (for general feedback)
  can_follow_up BOOLEAN DEFAULT false, -- Whether user is open to follow-up
  status TEXT NOT NULL DEFAULT 'submitted', -- submitted, under_review, planned, implemented, declined
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT feedback_submissions_type_check CHECK (type IN ('feature', 'bug', 'general')),
  CONSTRAINT feedback_submissions_priority_check CHECK (priority IN ('low', 'medium', 'high')),
  CONSTRAINT feedback_submissions_severity_check CHECK (severity IN ('minor', 'moderate', 'critical')),
  CONSTRAINT feedback_submissions_rating_check CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  CONSTRAINT feedback_submissions_status_check CHECK (status IN ('submitted', 'under_review', 'planned', 'implemented', 'declined'))
);

-- Enable RLS
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own feedback submissions" 
  ON feedback_submissions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback" 
  ON feedback_submissions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all feedback" 
  ON feedback_submissions FOR ALL 
  USING (auth.role() = 'service_role');

-- Indexes for faster lookups
CREATE INDEX idx_feedback_submissions_user_id ON feedback_submissions(user_id);
CREATE INDEX idx_feedback_submissions_feedback_id ON feedback_submissions(feedback_id);
CREATE INDEX idx_feedback_submissions_type ON feedback_submissions(type);
CREATE INDEX idx_feedback_submissions_status ON feedback_submissions(status);
CREATE INDEX idx_feedback_submissions_created_at ON feedback_submissions(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE support_tickets IS 'Stores user support requests submitted through the contact form';
COMMENT ON TABLE feedback_submissions IS 'Stores user feedback submitted through the feedback form';
COMMENT ON COLUMN support_tickets.ticket_id IS 'Human-readable ticket ID (e.g., TK-123456789)';
COMMENT ON COLUMN feedback_submissions.feedback_id IS 'Human-readable feedback ID (e.g., FB-123456789)';
COMMENT ON COLUMN feedback_submissions.can_follow_up IS 'Whether user is open to follow-up communication';
