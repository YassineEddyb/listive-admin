import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface WebhookEventRow {
  id: string;
  event_type: string;
  processed_at: string;
  payload: Record<string, unknown> | null;
  created_at: string;
}

/**
 * Fetch webhook events for the admin log view.
 */
export async function getWebhookEvents(limit = 200): Promise<WebhookEventRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('webhook_events')
    .select('id, event_type, processed_at, payload, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getWebhookEvents] Error:', error.message);
    return [];
  }

  return (data || []) as WebhookEventRow[];
}
