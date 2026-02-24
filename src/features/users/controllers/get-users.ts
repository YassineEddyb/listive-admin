'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface AdminUserRow {
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  credit_balance: number;
  subscription_status: string | null;
  plan_name: string | null;
  product_count: number;
  created_at: string;
}

/**
 * Fetches all platform users from the admin_users_view.
 * This view joins auth.users, users, user_credits, subscriptions, and products.
 * Must be called with service_role client.
 */
export async function getUsers(): Promise<AdminUserRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('admin_users_view')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getUsers] Error fetching users:', error.message);
    return [];
  }

  return (data as AdminUserRow[]) ?? [];
}

/**
 * Fetches a single user from the admin_users_view.
 */
export async function getUserById(userId: string): Promise<AdminUserRow | null> {
  const { data, error } = await supabaseAdminClient
    .from('admin_users_view')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('[getUserById] Error fetching user:', error.message);
    return null;
  }

  return data as AdminUserRow;
}
