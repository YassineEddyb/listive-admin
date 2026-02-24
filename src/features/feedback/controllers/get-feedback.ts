import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface FeedbackRow {
  id: string;
  user_id: string;
  feedback_id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  category: string[];
  severity: string | null;
  rating: number | null;
  can_follow_up: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  metadata: Record<string, unknown> | null;
  // Joined
  user_email?: string;
}

/**
 * Fetch all feedback submissions with user emails.
 */
export async function getFeedback(limit = 200): Promise<FeedbackRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('feedback_submissions')
    .select(
      'id, user_id, feedback_id, type, title, description, priority, category, severity, rating, can_follow_up, status, created_at, updated_at, reviewed_at, metadata'
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getFeedback] Error:', error.message);
    return [];
  }

  // Fetch user emails
  const userIds = [...new Set((data || []).map((f: any) => f.user_id))];
  if (userIds.length === 0) return (data || []) as FeedbackRow[];

  const { data: users } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email')
    .in('user_id', userIds);

  const emailMap = new Map((users || []).map((u: any) => [u.user_id, u.email]));

  return (data || []).map((f: any) => ({
    ...f,
    user_email: emailMap.get(f.user_id) || '—',
  }));
}

/**
 * Fetch a single feedback submission by ID.
 */
export async function getFeedbackById(feedbackId: string): Promise<FeedbackRow | null> {
  const { data, error } = await supabaseAdminClient
    .from('feedback_submissions')
    .select(
      'id, user_id, feedback_id, type, title, description, priority, category, severity, rating, can_follow_up, status, created_at, updated_at, reviewed_at, metadata'
    )
    .eq('id', feedbackId)
    .single();

  if (error) {
    console.error('[getFeedbackById] Error:', error.message);
    return null;
  }

  const { data: users } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email')
    .eq('user_id', (data as any).user_id)
    .limit(1);

  return {
    ...(data as any),
    user_email: users?.[0]?.email || '—',
  };
}
