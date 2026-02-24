import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface ListingRow {
  id: string;
  user_id: string;
  product_id: string;
  connection_id: string;
  platform: 'shopify' | 'etsy';
  external_id: string | null;
  external_url: string | null;
  status: string;
  error_message: string | null;
  listing_data: Record<string, unknown> | null;
  created_at: string;
  // Joined
  user_email?: string;
  product_title?: string;
  shop_name?: string;
}

/**
 * Fetch all marketplace listings (Shopify + Etsy combined).
 */
export async function getListings(limit = 200): Promise<ListingRow[]> {
  // Fetch Shopify listings
  const { data: shopifyListings } = await supabaseAdminClient
    .from('listing_history')
    .select('id, user_id, product_id, connection_id, shopify_product_id, shopify_product_url, status, error_message, listing_data, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  // Fetch Etsy listings
  const { data: etsyListings } = await supabaseAdminClient
    .from('etsy_listing_history')
    .select('id, user_id, product_id, connection_id, etsy_listing_id, etsy_listing_url, status, error_message, listing_data, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  // Combine and normalize
  const combined: ListingRow[] = [
    ...(shopifyListings || []).map((l: any) => ({
      id: l.id,
      user_id: l.user_id,
      product_id: l.product_id,
      connection_id: l.connection_id,
      platform: 'shopify' as const,
      external_id: l.shopify_product_id,
      external_url: l.shopify_product_url,
      status: l.status,
      error_message: l.error_message,
      listing_data: l.listing_data,
      created_at: l.created_at,
    })),
    ...(etsyListings || []).map((l: any) => ({
      id: l.id,
      user_id: l.user_id,
      product_id: l.product_id,
      connection_id: l.connection_id,
      platform: 'etsy' as const,
      external_id: l.etsy_listing_id,
      external_url: l.etsy_listing_url,
      status: l.status,
      error_message: l.error_message,
      listing_data: l.listing_data,
      created_at: l.created_at,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Fetch user emails
  const userIds = [...new Set(combined.map((l) => l.user_id))];
  if (userIds.length > 0) {
    const { data: users } = await supabaseAdminClient
      .from('admin_users_view')
      .select('user_id, email')
      .in('user_id', userIds);
    const emailMap = new Map((users || []).map((u: any) => [u.user_id, u.email]));
    combined.forEach((l) => {
      l.user_email = emailMap.get(l.user_id) || '—';
    });
  }

  // Fetch product titles
  const productIds = [...new Set(combined.map((l) => l.product_id).filter(Boolean))];
  if (productIds.length > 0) {
    const { data: products } = await supabaseAdminClient
      .from('user_products')
      .select('id, title, name')
      .in('id', productIds);
    const titleMap = new Map((products || []).map((p: any) => [p.id, p.title || p.name || 'Untitled']));
    combined.forEach((l) => {
      l.product_title = titleMap.get(l.product_id) || '—';
    });
  }

  return combined.slice(0, limit);
}

export interface ListingStats {
  totalShopify: number;
  totalEtsy: number;
  successShopify: number;
  successEtsy: number;
  failedTotal: number;
}

/**
 * Get listing stats for the listings page header.
 */
export async function getListingStats(): Promise<ListingStats> {
  const [
    { count: totalShopify },
    { count: totalEtsy },
    { count: successShopify },
    { count: successEtsy },
    { count: failedShopify },
    { count: failedEtsy },
  ] = await Promise.all([
    supabaseAdminClient.from('listing_history').select('*', { count: 'exact', head: true }),
    supabaseAdminClient.from('etsy_listing_history').select('*', { count: 'exact', head: true }),
    supabaseAdminClient.from('listing_history').select('*', { count: 'exact', head: true }).eq('status', 'success'),
    supabaseAdminClient.from('etsy_listing_history').select('*', { count: 'exact', head: true }).eq('status', 'success'),
    supabaseAdminClient.from('listing_history').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
    supabaseAdminClient.from('etsy_listing_history').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
  ]);

  return {
    totalShopify: totalShopify || 0,
    totalEtsy: totalEtsy || 0,
    successShopify: successShopify || 0,
    successEtsy: successEtsy || 0,
    failedTotal: (failedShopify || 0) + (failedEtsy || 0),
  };
}
