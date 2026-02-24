import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
  created_by: string | null;
}

/**
 * Check if a user is an admin by querying the admin_users table.
 * Uses service_role client to bypass RLS.
 *
 * @param userId - The Supabase auth user ID
 * @returns The admin user record, or null if not an admin
 */
export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  // Using raw SQL via rpc is more reliable than .from() with 'as never'
  // since admin_users is not in the generated types yet
  const { data, error } = await supabaseAdminClient
    .from('admin_users')
    .select('id, user_id, email, created_at, created_by')
    .eq('user_id', userId)
    .single<AdminUser>();

  if (error) {
    console.error('[getAdminUser] Error:', error.message, '| userId:', userId);
    return null;
  }

  return data;
}
