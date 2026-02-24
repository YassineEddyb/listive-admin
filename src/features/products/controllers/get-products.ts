import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface ProductRow {
  id: string;
  user_id: string;
  name: string | null;
  title: string | null;
  reference_image_url: string;
  reference_image_thumbnail_url: string | null;
  generation_status: string;
  total_images: number;
  completed_images: number;
  failed_images: number;
  reference_count: number;
  reference_image_source: string;
  created_at: string;
  updated_at: string;
  // Joined
  user_email?: string;
  image_count?: number;
}

/**
 * Fetch all user products with user emails and image counts.
 */
export async function getProducts(limit = 200): Promise<ProductRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('user_products')
    .select(
      'id, user_id, name, title, reference_image_url, reference_image_thumbnail_url, generation_status, total_images, completed_images, failed_images, reference_count, reference_image_source, created_at, updated_at'
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getProducts] Error:', error.message);
    return [];
  }

  // Fetch user emails
  const userIds = [...new Set((data || []).map((p: any) => p.user_id))];
  if (userIds.length === 0) return (data || []) as ProductRow[];

  const { data: users } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email')
    .in('user_id', userIds);

  const emailMap = new Map((users || []).map((u: any) => [u.user_id, u.email]));

  return (data || []).map((p: any) => ({
    ...p,
    user_email: emailMap.get(p.user_id) || '—',
  }));
}

export interface ProductDetail extends ProductRow {
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  product_facts: Record<string, unknown> | null;
  product_specs: string | null;
  images: ProductImageRow[];
  source_images: SourceImageRow[];
}

export interface ProductImageRow {
  id: string;
  angle: string;
  style: string;
  image_size: string;
  aspect_ratio: string;
  public_url: string;
  status: string;
  size_bytes: number;
  created_at: string;
  completed_at: string | null;
}

export interface SourceImageRow {
  id: string;
  image_url: string;
  thumbnail_url: string | null;
  image_index: number;
  view_angle: string;
}

/**
 * Fetch a single product with all details, images, and source images.
 */
export async function getProductById(productId: string): Promise<ProductDetail | null> {
  const { data, error } = await supabaseAdminClient
    .from('user_products')
    .select(
      'id, user_id, name, title, description, reference_image_url, reference_image_thumbnail_url, generation_status, total_images, completed_images, failed_images, reference_count, reference_image_source, seo_title, seo_description, seo_keywords, product_facts, product_specs, created_at, updated_at'
    )
    .eq('id', productId)
    .single();

  if (error) {
    console.error('[getProductById] Error:', error.message);
    return null;
  }

  // Fetch user email
  const { data: users } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email')
    .eq('user_id', (data as any).user_id)
    .limit(1);

  // Fetch product images
  const { data: images } = await supabaseAdminClient
    .from('product_images')
    .select('id, angle, style, image_size, aspect_ratio, public_url, status, size_bytes, created_at, completed_at')
    .eq('product_id', productId)
    .order('created_at', { ascending: true });

  // Fetch source images
  const { data: sourceImages } = await supabaseAdminClient
    .from('user_product_source_images')
    .select('id, image_url, thumbnail_url, image_index, view_angle')
    .eq('product_id', productId)
    .order('image_index', { ascending: true });

  return {
    ...(data as any),
    user_email: users?.[0]?.email || '—',
    images: (images || []) as ProductImageRow[],
    source_images: (sourceImages || []) as SourceImageRow[],
  };
}
