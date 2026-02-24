import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface DashboardStats {
  total_users: number;
  new_users_today: number;
  new_users_this_week: number;
  total_products: number;
  products_today: number;
  total_images: number;
  total_credits_consumed: number;
  credits_consumed_today: number;
  total_revenue_cents: number;
  active_subscriptions: number;
  subscriptions_by_plan: Record<string, number>;
  open_tickets: number;
  pending_feedback: number;
}

/**
 * Fetch all dashboard KPIs from the admin_dashboard_stats() function.
 * This is a single function call that returns all stats at once.
 */
export async function getDashboardStats(): Promise<DashboardStats | null> {
  const { data, error } = await supabaseAdminClient.rpc('admin_dashboard_stats');

  if (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return null;
  }

  return data as DashboardStats;
}

export interface SignupsByDay {
  day: string;
  signup_count: number;
}

/**
 * Fetch daily signup counts for the trend chart.
 */
export async function getSignupsByDay(daysBack: number = 30): Promise<SignupsByDay[]> {
  const { data, error } = await supabaseAdminClient.rpc('admin_signups_by_day', {
    days_back: daysBack,
  });

  if (error) {
    console.error('Failed to fetch signups by day:', error);
    return [];
  }

  return (data as SignupsByDay[]) || [];
}

export interface CreditsByDay {
  day: string;
  total_credits: number;
}

/**
 * Fetch daily credit consumption for the trend chart.
 */
export async function getCreditsByDay(daysBack: number = 30): Promise<CreditsByDay[]> {
  const { data, error } = await supabaseAdminClient.rpc('admin_credits_consumed_by_day', {
    days_back: daysBack,
  });

  if (error) {
    console.error('Failed to fetch credits by day:', error);
    return [];
  }

  return (data as CreditsByDay[]) || [];
}
