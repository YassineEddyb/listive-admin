'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import type { ActionResponse } from '@/types/action-response';

interface UpdateTicketInput {
  ticketId: string;
  status: string;
  adminUserId: string;
}

/**
 * Update a support ticket's status and log the admin action.
 */
export async function updateTicketStatus(
  input: UpdateTicketInput
): Promise<ActionResponse<{ status: string }>> {
  const { ticketId, status, adminUserId } = input;

  try {
    const updatePayload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Set resolved_at when moving to resolved/closed
    if (status === 'resolved' || status === 'closed') {
      updatePayload.resolved_at = new Date().toISOString();
    }

    const { error } = await supabaseAdminClient
      .from('support_tickets')
      .update(updatePayload)
      .eq('id', ticketId);

    if (error) throw error;

    // Log admin action
    await supabaseAdminClient.from('admin_actions').insert({
      admin_user_id: adminUserId,
      action_type: 'update_ticket_status',
      target_table: 'support_tickets',
      target_id: ticketId,
      payload: { new_status: status },
    });

    return { data: { status }, error: null };
  } catch (err: any) {
    console.error('[updateTicketStatus] Error:', err.message);
    return { data: null as any, error: err.message };
  }
}
