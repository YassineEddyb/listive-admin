'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  polar_subscription_id: string | null;
  status: string;
  price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
}

export interface UserAuthDetails {
  banned_until: string | null;
  ban_reason: string | null;
  last_sign_in_at: string | null;
}

export interface UserProduct {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
}

/**
 * Fetches the credit transaction history for a given user.
 * Used on the user detail page to show credit activity.
 */
export async function getUserCreditTransactions(userId: string, limit = 50): Promise<CreditTransaction[]> {
  const { data, error } = await supabaseAdminClient
    .from('credit_transactions')
    .select('id, user_id, amount, type, description, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getUserCreditTransactions] Error:', error.message);
    return [];
  }

  return (data as CreditTransaction[]) ?? [];
}

/**
 * Fetches active and historical subscriptions for a user.
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const { data, error } = await supabaseAdminClient
    .from('subscriptions')
    .select('id, user_id, polar_subscription_id, status, price_id, current_period_start, current_period_end, cancel_at_period_end, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[getUserSubscription] Error:', error.message);
    return null;
  }

  return data as UserSubscription | null;
}

/**
 * Fetches auth-level details for a user (ban status, last sign in).
 */
export async function getUserAuthDetails(userId: string): Promise<UserAuthDetails | null> {
  try {
    const { data, error } = await supabaseAdminClient.auth.admin.getUserById(userId);
    if (error || !data?.user) return null;

    const user = data.user;
    return {
      banned_until: user.banned_until ? String(user.banned_until) : null,
      ban_reason: (user.user_metadata as any)?.ban_reason || null,
      last_sign_in_at: user.last_sign_in_at || null,
    };
  } catch {
    return null;
  }
}

/**
 * Fetches recent products created by a user.
 */
export async function getUserProducts(userId: string, limit = 20): Promise<UserProduct[]> {
  const { data, error } = await supabaseAdminClient
    .from('user_products')
    .select('id, user_id, title, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getUserProducts] Error:', error.message);
    return [];
  }

  return (data as UserProduct[]) ?? [];
}
