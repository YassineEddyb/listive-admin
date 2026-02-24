import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface ShopifyConnectionRow {
  id: string;
  user_id: string;
  shop_domain: string;
  shop_name: string | null;
  shop_email: string | null;
  is_active: boolean;
  last_synced_at: string | null;
  created_at: string;
  scopes: string;
  // Joined
  user_email?: string;
  listing_count?: number;
}

export interface EtsyConnectionRow {
  id: string;
  user_id: string;
  shop_id: string;
  shop_name: string | null;
  is_active: boolean;
  last_synced_at: string | null;
  expires_at: string | null;
  created_at: string;
  // Joined
  user_email?: string;
  listing_count?: number;
}

/**
 * Fetch all Shopify connections with user emails and listing counts.
 */
export async function getShopifyConnections(): Promise<ShopifyConnectionRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('shopify_connections')
    .select('id, user_id, shop_domain, shop_name, shop_email, is_active, last_synced_at, created_at, scopes')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getShopifyConnections] Error:', error.message);
    return [];
  }

  // Fetch user emails
  const userIds = [...new Set((data || []).map((c: any) => c.user_id))];
  const { data: users } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email')
    .in('user_id', userIds);
  const emailMap = new Map((users || []).map((u: any) => [u.user_id, u.email]));

  // Fetch listing counts per connection
  const connectionIds = (data || []).map((c: any) => c.id);
  const { data: listings } = await supabaseAdminClient
    .from('listing_history')
    .select('connection_id')
    .in('connection_id', connectionIds);

  const listingCountMap = new Map<string, number>();
  (listings || []).forEach((l: any) => {
    listingCountMap.set(l.connection_id, (listingCountMap.get(l.connection_id) || 0) + 1);
  });

  return (data || []).map((c: any) => ({
    ...c,
    user_email: emailMap.get(c.user_id) || '—',
    listing_count: listingCountMap.get(c.id) || 0,
  }));
}

/**
 * Fetch all Etsy connections with user emails and listing counts.
 */
export async function getEtsyConnections(): Promise<EtsyConnectionRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('etsy_connections')
    .select('id, user_id, shop_id, shop_name, is_active, last_synced_at, expires_at, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getEtsyConnections] Error:', error.message);
    return [];
  }

  // Fetch user emails
  const userIds = [...new Set((data || []).map((c: any) => c.user_id))];
  const { data: users } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email')
    .in('user_id', userIds);
  const emailMap = new Map((users || []).map((u: any) => [u.user_id, u.email]));

  // Fetch listing counts per connection
  const connectionIds = (data || []).map((c: any) => c.id);
  const { data: listings } = await supabaseAdminClient
    .from('etsy_listing_history')
    .select('connection_id')
    .in('connection_id', connectionIds);

  const listingCountMap = new Map<string, number>();
  (listings || []).forEach((l: any) => {
    listingCountMap.set(l.connection_id, (listingCountMap.get(l.connection_id) || 0) + 1);
  });

  return (data || []).map((c: any) => ({
    ...c,
    user_email: emailMap.get(c.user_id) || '—',
    listing_count: listingCountMap.get(c.id) || 0,
  }));
}

export interface StoreStats {
  shopifyTotal: number;
  shopifyActive: number;
  etsyTotal: number;
  etsyActive: number;
  totalListings: number;
}

/**
 * Get aggregate store statistics.
 */
export async function getStoreStats(): Promise<StoreStats> {
  const [
    { count: shopifyTotal },
    { count: shopifyActive },
    { count: etsyTotal },
    { count: etsyActive },
    { count: shopifyListings },
    { count: etsyListings },
  ] = await Promise.all([
    supabaseAdminClient.from('shopify_connections').select('*', { count: 'exact', head: true }),
    supabaseAdminClient.from('shopify_connections').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabaseAdminClient.from('etsy_connections').select('*', { count: 'exact', head: true }),
    supabaseAdminClient.from('etsy_connections').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabaseAdminClient.from('listing_history').select('*', { count: 'exact', head: true }),
    supabaseAdminClient.from('etsy_listing_history').select('*', { count: 'exact', head: true }),
  ]);

  return {
    shopifyTotal: shopifyTotal || 0,
    shopifyActive: shopifyActive || 0,
    etsyTotal: etsyTotal || 0,
    etsyActive: etsyActive || 0,
    totalListings: (shopifyListings || 0) + (etsyListings || 0),
  };
}
