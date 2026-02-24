'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';
import { revalidatePath } from 'next/cache';

/**
 * Add a new admin user by email.
 * The email must belong to an existing auth user.
 */
export async function addAdminUser(
  email: string,
  role: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Look up the user by email in auth.users via admin_users_view
    const { data: users } = await supabaseAdminClient
      .from('admin_users_view')
      .select('user_id, email')
      .eq('email', email.toLowerCase().trim())
      .limit(1);

    const user = users?.[0];
    if (!user) {
      return { success: false, error: 'No registered user found with that email address.' };
    }

    // Check if already an admin
    const { data: existing } = await supabaseAdminClient
      .from('admin_users')
      .select('id')
      .eq('user_id', user.user_id)
      .limit(1);

    if (existing && existing.length > 0) {
      return { success: false, error: 'This user is already an admin.' };
    }

    // Insert into admin_users
    const { error } = await supabaseAdminClient.from('admin_users').insert({
      user_id: user.user_id,
      email: user.email,
    });

    if (error) {
      console.error('[addAdminUser] Error:', error.message);
      return { success: false, error: error.message };
    }

    // Audit log
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'admin_user_added',
      target_type: 'admin_user',
      target_id: user.user_id,
      details: { email: user.email, role },
    });

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (err) {
    console.error('[addAdminUser] Error:', err);
    return { success: false, error: 'Failed to add admin user' };
  }
}

/**
 * Remove an admin user.
 */
export async function removeAdminUser(
  adminUserId: string,
  performingAdminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Don't let admins remove themselves
    const { data: target } = await supabaseAdminClient
      .from('admin_users')
      .select('id, user_id, email')
      .eq('id', adminUserId)
      .single();

    if (!target) {
      return { success: false, error: 'Admin user not found.' };
    }

    // Check if this is the performing admin
    const { data: selfCheck } = await supabaseAdminClient
      .from('admin_users')
      .select('id')
      .eq('id', adminUserId)
      .eq('user_id', performingAdminId)
      .limit(1);

    if (selfCheck && selfCheck.length > 0) {
      return { success: false, error: 'You cannot remove yourself from admin.' };
    }

    const { error } = await supabaseAdminClient
      .from('admin_users')
      .delete()
      .eq('id', adminUserId);

    if (error) {
      console.error('[removeAdminUser] Error:', error.message);
      return { success: false, error: error.message };
    }

    // Audit log
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: performingAdminId,
      action_type: 'admin_user_removed',
      target_type: 'admin_user',
      target_id: (target as any).user_id,
      details: { email: (target as any).email },
    });

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (err) {
    console.error('[removeAdminUser] Error:', err);
    return { success: false, error: 'Failed to remove admin user' };
  }
}
