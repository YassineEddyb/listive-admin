'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import type { ActionResponse } from '@/types/action-response';

interface UpdateUserProfileInput {
  userId: string;
  fullName?: string;
  onboardingCompleted?: boolean;
  adminUserId: string;
}

/**
 * Update a user's profile fields and log the admin action.
 */
export async function updateUserProfile(
  input: UpdateUserProfileInput
): Promise<ActionResponse<{ success: boolean }>> {
  const { userId, fullName, onboardingCompleted, adminUserId } = input;

  try {
    const updatePayload: Record<string, unknown> = {};

    if (fullName !== undefined) {
      updatePayload.full_name = fullName;
    }
    if (onboardingCompleted !== undefined) {
      updatePayload.onboarding_completed = onboardingCompleted;
    }

    if (Object.keys(updatePayload).length === 0) {
      return { data: null as any, error: 'No fields to update' };
    }

    const { error } = await supabaseAdminClient
      .from('users')
      .update(updatePayload)
      .eq('id', userId);

    if (error) throw error;

    // Log admin action
    await supabaseAdminClient.from('admin_actions').insert({
      admin_user_id: adminUserId,
      action_type: 'update_user_profile',
      target_table: 'users',
      target_id: userId,
      payload: updatePayload,
    });

    return { data: { success: true }, error: null };
  } catch (err: any) {
    console.error('[updateUserProfile] Error:', err.message);
    return { data: null as any, error: err.message };
  }
}
