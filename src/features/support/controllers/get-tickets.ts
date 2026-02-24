import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface TicketRow {
  id: string;
  user_id: string;
  ticket_id: string;
  subject: string;
  category: string;
  description: string;
  product_id: string | null;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  metadata: Record<string, unknown> | null;
  // Joined
  user_email?: string;
}

/**
 * Fetch all support tickets with user emails.
 */
export async function getTickets(limit = 200): Promise<TicketRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('support_tickets')
    .select(
      'id, user_id, ticket_id, subject, category, description, product_id, status, priority, created_at, updated_at, resolved_at, metadata'
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getTickets] Error:', error.message);
    return [];
  }

  // Fetch user emails
  const userIds = [...new Set((data || []).map((t: any) => t.user_id))];
  if (userIds.length === 0) return (data || []) as TicketRow[];

  const { data: users } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email')
    .in('user_id', userIds);

  const emailMap = new Map((users || []).map((u: any) => [u.user_id, u.email]));

  return (data || []).map((t: any) => ({
    ...t,
    user_email: emailMap.get(t.user_id) || '—',
  }));
}

/**
 * Fetch a single ticket by ID.
 */
export async function getTicketById(ticketId: string): Promise<TicketRow | null> {
  const { data, error } = await supabaseAdminClient
    .from('support_tickets')
    .select(
      'id, user_id, ticket_id, subject, category, description, product_id, status, priority, created_at, updated_at, resolved_at, metadata'
    )
    .eq('id', ticketId)
    .single();

  if (error) {
    console.error('[getTicketById] Error:', error.message);
    return null;
  }

  // Fetch user email
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

export interface TicketReplyRow {
  id: string;
  ticket_id: string;
  admin_user_id: string;
  message: string;
  created_at: string;
  admin_email?: string;
}

/**
 * Fetch all replies for a support ticket.
 */
export async function getTicketReplies(ticketId: string): Promise<TicketReplyRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('ticket_replies')
    .select('id, ticket_id, admin_user_id, message, created_at')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[getTicketReplies] Error:', error.message);
    return [];
  }

  // Fetch admin emails
  const adminIds = [...new Set((data || []).map((r: any) => r.admin_user_id))];
  if (adminIds.length === 0) return (data || []) as TicketReplyRow[];

  const { data: admins } = await supabaseAdminClient
    .from('admin_users')
    .select('id, email')
    .in('id', adminIds);

  const emailMap = new Map((admins || []).map((a: any) => [a.id, a.email]));

  return (data || []).map((r: any) => ({
    ...r,
    admin_email: emailMap.get(r.admin_user_id) || '—',
  }));
}
