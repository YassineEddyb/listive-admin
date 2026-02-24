import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface TimeSeriesPoint {
  day: string;
  value: number;
}

/**
 * Revenue over time (from credit_purchases).
 */
export async function getRevenueByDay(daysBack = 30): Promise<TimeSeriesPoint[]> {
  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdminClient
    .from('credit_purchases')
    .select('amount_paid, purchased_at')
    .gte('purchased_at', startDate)
    .order('purchased_at', { ascending: true });

  if (error) {
    console.error('[getRevenueByDay] Error:', error.message);
    return [];
  }

  // Aggregate by day
  const dayMap = new Map<string, number>();
  (data || []).forEach((row: any) => {
    const day = new Date(row.purchased_at).toISOString().split('T')[0];
    dayMap.set(day, (dayMap.get(day) || 0) + (row.amount_paid || 0));
  });

  return fillDays(dayMap, daysBack);
}

/**
 * Product generation volume over time.
 */
export async function getGenerationsByDay(daysBack = 30): Promise<TimeSeriesPoint[]> {
  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdminClient
    .from('product_images')
    .select('created_at')
    .eq('status', 'completed')
    .gte('created_at', startDate);

  if (error) {
    console.error('[getGenerationsByDay] Error:', error.message);
    return [];
  }

  const dayMap = new Map<string, number>();
  (data || []).forEach((row: any) => {
    const day = new Date(row.created_at).toISOString().split('T')[0];
    dayMap.set(day, (dayMap.get(day) || 0) + 1);
  });

  return fillDays(dayMap, daysBack);
}

/**
 * Listings created over time (Shopify + Etsy combined).
 */
export async function getListingsByDay(daysBack = 30): Promise<TimeSeriesPoint[]> {
  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: shopify }, { data: etsy }] = await Promise.all([
    supabaseAdminClient
      .from('listing_history')
      .select('created_at')
      .eq('status', 'success')
      .gte('created_at', startDate),
    supabaseAdminClient
      .from('etsy_listing_history')
      .select('created_at')
      .eq('status', 'success')
      .gte('created_at', startDate),
  ]);

  const dayMap = new Map<string, number>();
  [...(shopify || []), ...(etsy || [])].forEach((row: any) => {
    const day = new Date(row.created_at).toISOString().split('T')[0];
    dayMap.set(day, (dayMap.get(day) || 0) + 1);
  });

  return fillDays(dayMap, daysBack);
}

/**
 * Products created over time.
 */
export async function getProductsByDay(daysBack = 30): Promise<TimeSeriesPoint[]> {
  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdminClient
    .from('user_products')
    .select('created_at')
    .gte('created_at', startDate);

  if (error) {
    console.error('[getProductsByDay] Error:', error.message);
    return [];
  }

  const dayMap = new Map<string, number>();
  (data || []).forEach((row: any) => {
    const day = new Date(row.created_at).toISOString().split('T')[0];
    dayMap.set(day, (dayMap.get(day) || 0) + 1);
  });

  return fillDays(dayMap, daysBack);
}

/**
 * Fill missing days with 0 values for smooth chart display.
 */
function fillDays(dayMap: Map<string, number>, daysBack: number): TimeSeriesPoint[] {
  const result: TimeSeriesPoint[] = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const day = d.toISOString().split('T')[0];
    result.push({ day, value: dayMap.get(day) || 0 });
  }
  return result;
}
