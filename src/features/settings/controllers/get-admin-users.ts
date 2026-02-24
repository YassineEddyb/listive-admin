'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface AdminUserRow {
  id: string;
  user_id: string;
  email: string;
  role: string;
  created_at: string;
}

/**
 * Fetch all admin users.
 */
export async function getAdminUsers(): Promise<AdminUserRow[]> {
  // Try with role column first, fall back without it
  const { data, error } = await supabaseAdminClient
    .from('admin_users')
    .select('id, user_id, email, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[getAdminUsers] Error:', error.message);
    return [];
  }

  return ((data || []) as any[]).map((u) => ({
    ...u,
    role: u.role || 'admin',
  }));
}
