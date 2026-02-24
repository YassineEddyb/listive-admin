import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface EditOperationRow {
  id: string;
  user_id: string;
  product_image_id: string | null;
  edit_prompt: string;
  status: string;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

/**
 * Fetch edit operations for a specific product.
 * Joins via product_images to get edits related to this product's images.
 */
export async function getProductEditHistory(productId: string): Promise<EditOperationRow[]> {
  // Get all image IDs for this product
  const { data: images } = await supabaseAdminClient
    .from('product_images')
    .select('id')
    .eq('product_id', productId);

  if (!images || images.length === 0) return [];

  const imageIds = (images as any[]).map((i) => i.id);

  const { data, error } = await supabaseAdminClient
    .from('image_edit_operations')
    .select('id, user_id, product_image_id, edit_prompt, status, error_message, started_at, completed_at, created_at')
    .in('product_image_id', imageIds)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[getProductEditHistory] Error:', error.message);
    return [];
  }

  return (data || []) as EditOperationRow[];
}

/**
 * Fetch all edit operations for a specific user.
 */
export async function getUserEditHistory(userId: string, limit = 50): Promise<EditOperationRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('image_edit_operations')
    .select('id, user_id, product_image_id, edit_prompt, status, error_message, started_at, completed_at, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getUserEditHistory] Error:', error.message);
    return [];
  }

  return (data || []) as EditOperationRow[];
}
