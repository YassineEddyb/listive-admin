'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

/**
 * Cancel all stale processing operations (stuck for > 1 hour).
 */
export async function cancelStaleOperations(
  adminId: string
): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Find stale edit operations
    const { data: stale } = await supabaseAdminClient
      .from('image_edit_operations')
      .select('id')
      .eq('status', 'processing')
      .lt('started_at', oneHourAgo);

    if (!stale || stale.length === 0) {
      return { success: true, count: 0 };
    }

    const staleIds = stale.map((op: any) => op.id);

    const { error } = await supabaseAdminClient
      .from('image_edit_operations')
      .update({ status: 'canceled' })
      .in('id', staleIds);

    if (error) {
      console.error('[cancelStaleOperations] Error:', error.message);
      return { success: false, error: error.message };
    }

    // Audit log
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'stale_operations_canceled',
      target_type: 'system',
      target_id: 'batch',
      details: { count: staleIds.length },
    });

    revalidatePath('/admin/system');
    return { success: true, count: staleIds.length };
  } catch (err) {
    console.error('[cancelStaleOperations] Error:', err);
    return { success: false, error: 'Failed to cancel stale operations' };
  }
}

/**
 * Retry a specific failed edit operation by resetting status to pending.
 */
export async function retryOperation(
  operationId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdminClient
      .from('image_edit_operations')
      .update({
        status: 'pending',
        started_at: null,
        error_message: null,
      })
      .eq('id', operationId);

    if (error) {
      console.error('[retryOperation] Error:', error.message);
      return { success: false, error: error.message };
    }

    // Audit log
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'operation_retried',
      target_type: 'edit_operation',
      target_id: operationId,
      details: {},
    });

    revalidatePath('/admin/system');
    return { success: true };
  } catch (err) {
    console.error('[retryOperation] Error:', err);
    return { success: false, error: 'Failed to retry operation' };
  }
}

/**
 * Cleanup old completed operations (older than 30 days).
 */
export async function cleanupOldOperations(
  adminId: string
): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: old } = await supabaseAdminClient
      .from('image_edit_operations')
      .select('id')
      .in('status', ['completed', 'canceled'])
      .lt('created_at', thirtyDaysAgo);

    if (!old || old.length === 0) {
      return { success: true, count: 0 };
    }

    const oldIds = old.map((op: any) => op.id);

    const { error } = await supabaseAdminClient
      .from('image_edit_operations')
      .delete()
      .in('id', oldIds);

    if (error) {
      console.error('[cleanupOldOperations] Error:', error.message);
      return { success: false, error: error.message };
    }

    // Audit log
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'old_operations_cleaned',
      target_type: 'system',
      target_id: 'batch',
      details: { count: oldIds.length },
    });

    revalidatePath('/admin/system');
    return { success: true, count: oldIds.length };
  } catch (err) {
    console.error('[cleanupOldOperations] Error:', err);
    return { success: false, error: 'Failed to cleanup old operations' };
  }
}
