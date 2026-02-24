'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import type { ActionResponse } from '@/types/action-response';

interface UpdateFeedbackInput {
  feedbackId: string;
  status: string;
  adminUserId: string;
}

/**
 * Update a feedback submission's status and log the admin action.
 */
export async function updateFeedbackStatus(
  input: UpdateFeedbackInput
): Promise<ActionResponse<{ status: string }>> {
  const { feedbackId, status, adminUserId } = input;

  try {
    const updatePayload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Set reviewed_at when moving to a reviewed state
    if (['under_review', 'planned', 'implemented', 'declined'].includes(status)) {
      updatePayload.reviewed_at = new Date().toISOString();
    }

    const { error } = await supabaseAdminClient
      .from('feedback_submissions')
      .update(updatePayload)
      .eq('id', feedbackId);

    if (error) throw error;

    // Log admin action
    await supabaseAdminClient.from('admin_actions').insert({
      admin_user_id: adminUserId,
      action_type: 'update_feedback_status',
      target_table: 'feedback_submissions',
      target_id: feedbackId,
      payload: { new_status: status },
    });

    return { data: { status }, error: null };
  } catch (err: any) {
    console.error('[updateFeedbackStatus] Error:', err.message);
    return { data: null as any, error: err.message };
  }
}
