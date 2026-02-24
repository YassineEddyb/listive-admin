import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface EditOperationRow {
  id: string;
  product_image_id: string;
  user_id: string;
  edit_prompt: string;
  status: string;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  // Joined
  user_email?: string;
}

export interface SystemHealthStats {
  editQueue: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    canceled: number;
  };
  rateLimits: {
    totalHits: number;
    recentHits: number; // Last 24h
    topEndpoints: Array<{ endpoint: string; count: number }>;
  };
  staleOperations: EditOperationRow[];
}

/**
 * Fetch system health data: edit queue stats, rate limits, stale operations.
 */
export async function getSystemHealth(): Promise<SystemHealthStats> {
  // Edit operation counts by status
  const [
    { count: pending },
    { count: processing },
    { count: completed },
    { count: failed },
    { count: canceled },
  ] = await Promise.all([
    supabaseAdminClient.from('edit_operations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabaseAdminClient.from('edit_operations').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
    supabaseAdminClient.from('edit_operations').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    supabaseAdminClient.from('edit_operations').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
    supabaseAdminClient.from('edit_operations').select('*', { count: 'exact', head: true }).eq('status', 'canceled'),
  ]);

  // Rate limit stats
  const { count: totalHits } = await supabaseAdminClient
    .from('api_rate_limits')
    .select('*', { count: 'exact', head: true });

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: recentHits } = await supabaseAdminClient
    .from('api_rate_limits')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', twentyFourHoursAgo);

  // Top endpoints (get recent rate limit entries and aggregate client-side)
  const { data: recentLimits } = await supabaseAdminClient
    .from('api_rate_limits')
    .select('endpoint')
    .gte('created_at', twentyFourHoursAgo)
    .limit(1000);

  const endpointCounts = new Map<string, number>();
  (recentLimits || []).forEach((r: any) => {
    endpointCounts.set(r.endpoint, (endpointCounts.get(r.endpoint) || 0) + 1);
  });
  const topEndpoints = [...endpointCounts.entries()]
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Stale operations (processing for more than 10 minutes)
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: staleOps } = await supabaseAdminClient
    .from('edit_operations')
    .select('id, product_image_id, user_id, edit_prompt, status, error_message, started_at, completed_at, created_at')
    .eq('status', 'processing')
    .lt('started_at', tenMinutesAgo)
    .order('started_at', { ascending: true })
    .limit(50);

  // Fetch user emails for stale operations
  const staleUserIds = [...new Set((staleOps || []).map((o: any) => o.user_id))];
  let staleEmailMap = new Map<string, string>();
  if (staleUserIds.length > 0) {
    const { data: users } = await supabaseAdminClient
      .from('admin_users_view')
      .select('user_id, email')
      .in('user_id', staleUserIds);
    staleEmailMap = new Map((users || []).map((u: any) => [u.user_id, u.email]));
  }

  return {
    editQueue: {
      pending: pending || 0,
      processing: processing || 0,
      completed: completed || 0,
      failed: failed || 0,
      canceled: canceled || 0,
    },
    rateLimits: {
      totalHits: totalHits || 0,
      recentHits: recentHits || 0,
      topEndpoints,
    },
    staleOperations: (staleOps || []).map((o: any) => ({
      ...o,
      user_email: staleEmailMap.get(o.user_id) || '—',
    })),
  };
}
