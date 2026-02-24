import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface SubscriptionRow {
  id: string;
  user_id: string;
  status: string;
  price_id: string | null;
  quantity: number | null;
  cancel_at_period_end: boolean | null;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at: string | null;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  // Joined fields
  user_email?: string;
  plan_name?: string;
  unit_amount?: number;
}

/**
 * Fetch all subscriptions with user email and plan name.
 * Joins prices → products for plan info, and auth.users isn't directly joinable
 * so we join via the admin_users_view or do a separate lookup.
 */
export async function getSubscriptions(): Promise<SubscriptionRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('subscriptions')
    .select(`
      id,
      user_id,
      status,
      price_id,
      quantity,
      cancel_at_period_end,
      created,
      current_period_start,
      current_period_end,
      ended_at,
      canceled_at,
      trial_start,
      trial_end,
      prices (
        unit_amount,
        products (
          name
        )
      )
    `)
    .order('created', { ascending: false });

  if (error) {
    console.error('[getSubscriptions] Error:', error.message);
    return [];
  }

  // Fetch user emails from admin_users_view for all subscription user_ids
  const userIds = [...new Set((data || []).map((s: any) => s.user_id))];
  const { data: users } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email')
    .in('user_id', userIds);

  const emailMap = new Map((users || []).map((u: any) => [u.user_id, u.email]));

  return (data || []).map((s: any) => ({
    id: s.id,
    user_id: s.user_id,
    status: s.status,
    price_id: s.price_id,
    quantity: s.quantity,
    cancel_at_period_end: s.cancel_at_period_end,
    created: s.created,
    current_period_start: s.current_period_start,
    current_period_end: s.current_period_end,
    ended_at: s.ended_at,
    canceled_at: s.canceled_at,
    trial_start: s.trial_start,
    trial_end: s.trial_end,
    user_email: emailMap.get(s.user_id) || '—',
    plan_name: s.prices?.products?.name || '—',
    unit_amount: s.prices?.unit_amount || 0,
  }));
}

/**
 * Fetch a single subscription by ID.
 */
export async function getSubscriptionById(subscriptionId: string): Promise<SubscriptionRow | null> {
  const { data, error } = await supabaseAdminClient
    .from('subscriptions')
    .select(`
      id,
      user_id,
      status,
      price_id,
      quantity,
      cancel_at_period_end,
      created,
      current_period_start,
      current_period_end,
      ended_at,
      canceled_at,
      trial_start,
      trial_end,
      prices (
        unit_amount,
        products (
          name
        )
      )
    `)
    .eq('id', subscriptionId)
    .single();

  if (error || !data) {
    console.error('[getSubscriptionById] Error:', error?.message);
    return null;
  }

  const sub = data as any;

  // Get user email
  const { data: user } = await supabaseAdminClient
    .from('admin_users_view')
    .select('email')
    .eq('user_id', sub.user_id)
    .single();

  return {
    ...sub,
    user_email: user?.email || '—',
    plan_name: sub.prices?.products?.name || '—',
    unit_amount: sub.prices?.unit_amount || 0,
  };
}
