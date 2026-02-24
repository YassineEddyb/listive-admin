'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import type { ActionResponse } from '@/types/action-response';

interface ReplyToTicketInput {
  ticketId: string;
  message: string;
  adminUserId: string;
}

/**
 * Add an admin reply to a support ticket and log the action.
 */
export async function replyToTicket(
  input: ReplyToTicketInput
): Promise<ActionResponse<{ id: string }>> {
  const { ticketId, message, adminUserId } = input;

  try {
    if (!message.trim()) {
      return { data: null as any, error: 'Message cannot be empty' };
    }

    // Look up admin_users id from auth user id
    const { data: adminUser } = await supabaseAdminClient
      .from('admin_users')
      .select('id')
      .eq('user_id', adminUserId)
      .single();

    if (!adminUser) {
      return { data: null as any, error: 'Admin user not found' };
    }

    const { data, error } = await supabaseAdminClient
      .from('ticket_replies')
      .insert({
        ticket_id: ticketId,
        admin_user_id: adminUser.id,
        message: message.trim(),
      })
      .select('id')
      .single();

    if (error) throw error;

    // Update ticket status to in_progress if currently open
    await supabaseAdminClient
      .from('support_tickets')
      .update({ status: 'in_progress', updated_at: new Date().toISOString() })
      .eq('id', ticketId)
      .eq('status', 'open');

    // Log admin action
    await supabaseAdminClient.from('admin_actions').insert({
      admin_user_id: adminUserId,
      action_type: 'reply_to_ticket',
      target_table: 'support_tickets',
      target_id: ticketId,
      payload: { message: message.trim().substring(0, 200) },
    });

    return { data: { id: data.id }, error: null };
  } catch (err: any) {
    console.error('[replyToTicket] Error:', err.message);
    return { data: null as any, error: err.message };
  }
}

interface UpdateTicketPriorityInput {
  ticketId: string;
  priority: string;
  adminUserId: string;
}

/**
 * Update a support ticket's priority and log the admin action.
 */
export async function updateTicketPriority(
  input: UpdateTicketPriorityInput
): Promise<ActionResponse<{ priority: string }>> {
  const { ticketId, priority, adminUserId } = input;

  try {
    const { error } = await supabaseAdminClient
      .from('support_tickets')
      .update({
        priority,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticketId);

    if (error) throw error;

    // Log admin action
    await supabaseAdminClient.from('admin_actions').insert({
      admin_user_id: adminUserId,
      action_type: 'update_ticket_priority',
      target_table: 'support_tickets',
      target_id: ticketId,
      payload: { new_priority: priority },
    });

    return { data: { priority }, error: null };
  } catch (err: any) {
    console.error('[updateTicketPriority] Error:', err.message);
    return { data: null as any, error: err.message };
  }
}
