'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import type { ActionResponse } from '@/types/action-response';

interface AdjustCreditsInput {
  userId: string;
  amount: number; // positive to add, negative to deduct
  description: string;
  adminUserId: string;
}

/**
 * Adjust a user's credits via the existing add_user_credits or deduct_user_credits RPC.
 * Also logs the action in admin_actions for audit trail.
 */
export async function adjustCredits(input: AdjustCreditsInput): Promise<ActionResponse<{ newBalance: number }>> {
  const { userId, amount, description, adminUserId } = input;

  if (amount === 0) {
    return { data: null as any, error: 'Amount cannot be zero' };
  }

  try {
    let newBalance: number;

    if (amount > 0) {
      // Add credits
      const { data, error } = await supabaseAdminClient.rpc('add_user_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_type: 'adjustment',
        p_description: `[Admin] ${description}`,
      });

      if (error) throw error;
      newBalance = data as number;
    } else {
      // Deduct credits
      const { data, error } = await supabaseAdminClient.rpc('deduct_user_credits', {
        p_user_id: userId,
        p_amount: Math.abs(amount),
        p_description: `[Admin] ${description}`,
      });

      if (error) throw error;
      if (data === false) {
        return { data: null as any, error: 'Insufficient credits' };
      }

      // Get the new balance
      const { data: credits } = await supabaseAdminClient
        .from('user_credits')
        .select('credits')
        .eq('user_id', userId)
        .single();

      newBalance = (credits as any)?.credits ?? 0;
    }

    // Log the admin action
    await supabaseAdminClient.from('admin_actions').insert({
      admin_user_id: adminUserId,
      action_type: 'adjust_credits',
      target_table: 'user_credits',
      target_id: userId,
      payload: { amount, description, new_balance: newBalance },
    });

    return { data: { newBalance }, error: null };
  } catch (err: any) {
    console.error('[adjustCredits] Error:', err.message);
    return { data: null as any, error: err.message || 'Failed to adjust credits' };
  }
}
