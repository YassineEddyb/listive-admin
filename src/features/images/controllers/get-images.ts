import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface GalleryImageRow {
  id: string;
  product_id: string;
  angle: string;
  style: string;
  image_size: string;
  aspect_ratio: string;
  public_url: string;
  status: string;
  size_bytes: number;
  created_at: string;
  completed_at: string | null;
  // Joined
  product_name?: string;
  user_id?: string;
  user_email?: string;
}

/**
 * Fetch generated images across all users for the gallery view.
 */
export async function getGalleryImages(limit = 200): Promise<GalleryImageRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('product_images')
    .select('id, product_id, angle, style, image_size, aspect_ratio, public_url, status, size_bytes, created_at, completed_at')
    .eq('status', 'completed')
    .is('archived_at', null)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getGalleryImages] Error:', error.message);
    return [];
  }

  // Fetch product info for these images
  const productIds = [...new Set((data || []).map((i: any) => i.product_id))];
  if (productIds.length === 0) return [];

  const { data: products } = await supabaseAdminClient
    .from('user_products')
    .select('id, user_id, name, title')
    .in('id', productIds);

  const productMap = new Map(
    (products || []).map((p: any) => [p.id, { user_id: p.user_id, name: p.title || p.name || 'Untitled' }])
  );

  // Fetch user emails
  const userIds = [...new Set((products || []).map((p: any) => p.user_id))];
  const { data: users } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email')
    .in('user_id', userIds);

  const emailMap = new Map((users || []).map((u: any) => [u.user_id, u.email]));

  return (data || []).map((img: any) => {
    const product = productMap.get(img.product_id);
    return {
      ...img,
      product_name: product?.name || '—',
      user_id: product?.user_id || '',
      user_email: product?.user_id ? emailMap.get(product.user_id) || '—' : '—',
    };
  });
}

export interface ImageStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  totalSizeBytes: number;
}

/**
 * Get aggregate image statistics.
 */
export async function getImageStats(): Promise<ImageStats> {
  const { count: total } = await supabaseAdminClient
    .from('product_images')
    .select('*', { count: 'exact', head: true });

  const { count: completed } = await supabaseAdminClient
    .from('product_images')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  const { count: pending } = await supabaseAdminClient
    .from('product_images')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'generating']);

  const { count: failed } = await supabaseAdminClient
    .from('product_images')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'failed');

  return {
    total: total || 0,
    completed: completed || 0,
    pending: pending || 0,
    failed: failed || 0,
    totalSizeBytes: 0, // Would need a SQL aggregate
  };
}
