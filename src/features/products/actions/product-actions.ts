'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

/**
 * Delete a product and all its associated images, source images, and listings.
 */
export async function deleteProduct(
  productId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get product info for audit log
    const { data: product } = await supabaseAdminClient
      .from('user_products')
      .select('id, user_id, name, title')
      .eq('id', productId)
      .single();

    if (!product) {
      return { success: false, error: 'Product not found.' };
    }

    // Delete associated records (cascade should handle most, but be explicit)
    await supabaseAdminClient.from('product_images').delete().eq('product_id', productId);
    await supabaseAdminClient.from('user_product_source_images').delete().eq('product_id', productId);
    await supabaseAdminClient.from('listing_history').delete().eq('product_id', productId);
    await supabaseAdminClient.from('etsy_listing_history').delete().eq('product_id', productId);

    // Delete the product itself
    const { error } = await supabaseAdminClient
      .from('user_products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('[deleteProduct] Error:', error.message);
      return { success: false, error: error.message };
    }

    // Audit log
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'product_deleted',
      target_type: 'product',
      target_id: productId,
      details: {
        user_id: (product as any).user_id,
        product_name: (product as any).title || (product as any).name,
      },
    });

    revalidatePath('/admin/products');
    return { success: true };
  } catch (err) {
    console.error('[deleteProduct] Error:', err);
    return { success: false, error: 'Failed to delete product' };
  }
}

/**
 * Re-queue a failed product generation by resetting its status to pending.
 */
export async function reQueueGeneration(
  productId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Reset failed images back to pending
    await supabaseAdminClient
      .from('product_images')
      .update({ status: 'pending', completed_at: null })
      .eq('product_id', productId)
      .eq('status', 'failed');

    // Reset the product generation status
    const { error } = await supabaseAdminClient
      .from('user_products')
      .update({
        generation_status: 'pending',
      })
      .eq('id', productId);

    if (error) {
      console.error('[reQueueGeneration] Error:', error.message);
      return { success: false, error: error.message };
    }

    // Audit log
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'generation_requeued',
      target_type: 'product',
      target_id: productId,
      details: {},
    });

    revalidatePath(`/admin/products/${productId}`);
    return { success: true };
  } catch (err) {
    console.error('[reQueueGeneration] Error:', err);
    return { success: false, error: 'Failed to re-queue generation' };
  }
}
