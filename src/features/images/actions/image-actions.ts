'use server';

import { revalidatePath } from 'next/cache';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

/**
 * Delete a single product image.
 */
export async function deleteImage(
  imageId: string,
  productId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdminClient
      .from('product_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      console.error('[deleteImage] Error:', error.message);
      return { success: false, error: error.message };
    }

    // Update product image counts
    const { data: remaining } = await supabaseAdminClient
      .from('product_images')
      .select('id, status')
      .eq('product_id', productId);

    const total = remaining?.length || 0;
    const completed = remaining?.filter((i: any) => i.status === 'completed').length || 0;
    const failed = remaining?.filter((i: any) => i.status === 'failed').length || 0;

    await supabaseAdminClient
      .from('user_products')
      .update({ total_images: total, completed_images: completed, failed_images: failed })
      .eq('id', productId);

    // Audit log
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'image_deleted',
      target_type: 'image',
      target_id: imageId,
      details: { product_id: productId },
    });

    revalidatePath(`/admin/products/${productId}`);
    return { success: true };
  } catch (err) {
    console.error('[deleteImage] Error:', err);
    return { success: false, error: 'Failed to delete image' };
  }
}

/**
 * Bulk delete all failed images for a product.
 */
export async function deleteFailedImages(
  productId: string,
  adminId: string
): Promise<{ success: boolean; error?: string; deleted?: number }> {
  try {
    const { data: failedImages } = await supabaseAdminClient
      .from('product_images')
      .select('id')
      .eq('product_id', productId)
      .eq('status', 'failed');

    if (!failedImages || failedImages.length === 0) {
      return { success: true, deleted: 0 };
    }

    const { error } = await supabaseAdminClient
      .from('product_images')
      .delete()
      .eq('product_id', productId)
      .eq('status', 'failed');

    if (error) {
      console.error('[deleteFailedImages] Error:', error.message);
      return { success: false, error: error.message };
    }

    // Recalculate total
    const { data: remaining } = await supabaseAdminClient
      .from('product_images')
      .select('id')
      .eq('product_id', productId);

    await supabaseAdminClient
      .from('user_products')
      .update({ total_images: remaining?.length || 0, failed_images: 0 })
      .eq('id', productId);

    // Audit log
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'failed_images_deleted',
      target_type: 'product',
      target_id: productId,
      details: { count: failedImages.length },
    });

    revalidatePath(`/admin/products/${productId}`);
    return { success: true, deleted: failedImages.length };
  } catch (err) {
    console.error('[deleteFailedImages] Error:', err);
    return { success: false, error: 'Failed to delete failed images' };
  }
}
