'use server';

import { polarClient } from '@/libs/polar/polar-client';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

/**
 * Cancel a subscription via the Polar API.
 * This sets the subscription to cancel at the end of the current billing period.
 */
export async function cancelSubscription(
  subscriptionId: string,
  userId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await polarClient.subscriptions.update({
      id: subscriptionId,
      subscriptionUpdate: { cancelAtPeriodEnd: true },
    });

    // Also update local DB
    await supabaseAdminClient
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('polar_subscription_id', subscriptionId);

    // Log admin action
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'subscription_canceled',
      target_type: 'subscription',
      target_id: subscriptionId,
      details: { user_id: userId },
    });

    return { success: true };
  } catch (err: any) {
    console.error('[cancelSubscription] Error:', err);
    return { success: false, error: err?.message || 'Failed to cancel subscription' };
  }
}

/**
 * Revoke a subscription immediately via the Polar API.
 * This ends the subscription right away without waiting for the period end.
 */
export async function revokeSubscription(
  subscriptionId: string,
  userId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await polarClient.subscriptions.update({
      id: subscriptionId,
      subscriptionUpdate: { revoke: true },
    });

    // Update local DB
    await supabaseAdminClient
      .from('subscriptions')
      .update({ status: 'canceled', cancel_at_period_end: false })
      .eq('polar_subscription_id', subscriptionId);

    // Log admin action
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'subscription_revoked',
      target_type: 'subscription',
      target_id: subscriptionId,
      details: { user_id: userId, immediate: true },
    });

    return { success: true };
  } catch (err: any) {
    console.error('[revokeSubscription] Error:', err);
    return { success: false, error: err?.message || 'Failed to revoke subscription' };
  }
}
