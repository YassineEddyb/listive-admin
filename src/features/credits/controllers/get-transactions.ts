import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface TransactionRow {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  description: string | null;
  reference_id: string | null;
  balance_after: number;
  created_at: string;
  metadata: Record<string, unknown> | null;
  // Joined
  user_email?: string;
}

/**
 * Fetch all credit transactions with user emails.
 */
export async function getTransactions(limit = 200): Promise<TransactionRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('credit_transactions')
    .select('id, user_id, amount, type, description, reference_id, balance_after, created_at, metadata')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getTransactions] Error:', error.message);
    return [];
  }

  // Fetch user emails
  const userIds = [...new Set((data || []).map((t: any) => t.user_id))];
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
 * Fetch credit transactions for a specific user.
 */
export async function getUserTransactions(userId: string, limit = 100): Promise<TransactionRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('credit_transactions')
    .select('id, user_id, amount, type, description, reference_id, balance_after, created_at, metadata')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getUserTransactions] Error:', error.message);
    return [];
  }

  return (data || []) as TransactionRow[];
}

export interface CreditBalanceSummary {
  user_id: string;
  email: string;
  credits: number;
}

/**
 * Fetch all user credit balances, sorted by balance descending.
 */
export async function getCreditBalances(): Promise<CreditBalanceSummary[]> {
  const { data, error } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email, credit_balance')
    .order('credit_balance', { ascending: false });

  if (error) {
    console.error('[getCreditBalances] Error:', error.message);
    return [];
  }

  return (data || []).map((u: any) => ({
    user_id: u.user_id,
    email: u.email,
    credits: u.credit_balance,
  }));
}
