'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

/**
 * Ban a user — sets banned_until to a far future date via Supabase Admin API.
 * This immediately invalidates all sessions and prevents new logins.
 */
export async function banUser(
  userId: string,
  adminId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdminClient.auth.admin.updateUserById(userId, {
      ban_duration: '876000h', // ~100 years
      user_metadata: { banned: true, ban_reason: reason },
    });

    if (error) {
      console.error('[banUser] Error:', error.message);
      return { success: false, error: error.message };
    }

    // Log admin action
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'user_banned',
      target_type: 'user',
      target_id: userId,
      details: { reason },
    });

    return { success: true };
  } catch (err) {
    console.error('[banUser] Error:', err);
    return { success: false, error: 'Failed to ban user' };
  }
}

/**
 * Unban a user — removes ban and updates metadata.
 */
export async function unbanUser(
  userId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdminClient.auth.admin.updateUserById(userId, {
      ban_duration: 'none',
      user_metadata: { banned: false, ban_reason: null },
    });

    if (error) {
      console.error('[unbanUser] Error:', error.message);
      return { success: false, error: error.message };
    }

    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'user_unbanned',
      target_type: 'user',
      target_id: userId,
      details: {},
    });

    return { success: true };
  } catch (err) {
    console.error('[unbanUser] Error:', err);
    return { success: false, error: 'Failed to unban user' };
  }
}

/**
 * Send a password reset email to the user.
 * Uses Supabase's built-in password reset flow.
 */
export async function forcePasswordReset(
  userId: string,
  userEmail: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Generate a password reset link
    const { error } = await supabaseAdminClient.auth.admin.generateLink({
      type: 'recovery',
      email: userEmail,
      options: {
        redirectTo: `${siteUrl}/auth/callback?type=recovery`,
      },
    });

    if (error) {
      console.error('[forcePasswordReset] Error:', error.message);
      return { success: false, error: error.message };
    }

    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'password_reset_sent',
      target_type: 'user',
      target_id: userId,
      details: { email: userEmail },
    });

    return { success: true };
  } catch (err) {
    console.error('[forcePasswordReset] Error:', err);
    return { success: false, error: 'Failed to send password reset' };
  }
}

/**
 * Delete a user entirely — removes from auth.users (and cascades).
 * Use with extreme caution.
 */
export async function deleteUser(
  userId: string,
  adminId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdminClient.auth.admin.deleteUser(userId);

    if (error) {
      console.error('[deleteUser] Error:', error.message);
      return { success: false, error: error.message };
    }

    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'user_deleted',
      target_type: 'user',
      target_id: userId,
      details: { reason },
    });

    return { success: true };
  } catch (err) {
    console.error('[deleteUser] Error:', err);
    return { success: false, error: 'Failed to delete user' };
  }
}
