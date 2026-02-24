'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

/**
 * Disconnect a Shopify store connection.
 */
export async function disconnectShopifyStore(
  connectionId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: conn } = await supabaseAdminClient
      .from('shopify_connections')
      .select('id, user_id, shop_domain')
      .eq('id', connectionId)
      .single();

    if (!conn) {
      return { success: false, error: 'Connection not found.' };
    }

    const { error } = await supabaseAdminClient
      .from('shopify_connections')
      .delete()
      .eq('id', connectionId);

    if (error) {
      console.error('[disconnectShopifyStore] Error:', error.message);
      return { success: false, error: error.message };
    }

    // Audit log
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'shopify_disconnected',
      target_type: 'store',
      target_id: connectionId,
      details: {
        user_id: (conn as any).user_id,
        shop_domain: (conn as any).shop_domain,
      },
    });

    revalidatePath('/admin/stores');
    return { success: true };
  } catch (err) {
    console.error('[disconnectShopifyStore] Error:', err);
    return { success: false, error: 'Failed to disconnect store' };
  }
}

/**
 * Disconnect an Etsy store connection.
 */
export async function disconnectEtsyStore(
  connectionId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: conn } = await supabaseAdminClient
      .from('etsy_connections')
      .select('id, user_id, shop_name')
      .eq('id', connectionId)
      .single();

    if (!conn) {
      return { success: false, error: 'Connection not found.' };
    }

    const { error } = await supabaseAdminClient
      .from('etsy_connections')
      .delete()
      .eq('id', connectionId);

    if (error) {
      console.error('[disconnectEtsyStore] Error:', error.message);
      return { success: false, error: error.message };
    }

    // Audit log
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'etsy_disconnected',
      target_type: 'store',
      target_id: connectionId,
      details: {
        user_id: (conn as any).user_id,
        shop_name: (conn as any).shop_name,
      },
    });

    revalidatePath('/admin/stores');
    return { success: true };
  } catch (err) {
    console.error('[disconnectEtsyStore] Error:', err);
    return { success: false, error: 'Failed to disconnect store' };
  }
}
