import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface AuditLogRow {
  id: string;
  admin_user_id: string;
  action_type: string;
  target_table: string;
  target_id: string;
  payload: Record<string, unknown> | null;
  created_at: string;
  // Joined
  admin_email?: string;
}

/**
 * Fetch all admin actions (audit log) with admin user emails.
 */
export async function getAuditLog(limit = 200): Promise<AuditLogRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('admin_actions')
    .select('id, admin_user_id, action_type, target_table, target_id, payload, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getAuditLog] Error:', error.message);
    return [];
  }

  // Fetch admin emails
  const adminIds = [...new Set((data || []).map((a: any) => a.admin_user_id))];
  if (adminIds.length === 0) return (data || []) as AuditLogRow[];

  const { data: admins } = await supabaseAdminClient
    .from('admin_users')
    .select('user_id, email')
    .in('user_id', adminIds);

  const emailMap = new Map((admins || []).map((a: any) => [a.user_id, a.email]));

  return (data || []).map((a: any) => ({
    ...a,
    admin_email: emailMap.get(a.admin_user_id) || '—',
  }));
}
