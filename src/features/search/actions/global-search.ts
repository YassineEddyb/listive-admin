'use server';

import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export type SearchResultType = 'user' | 'product' | 'ticket' | 'subscription';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
}

/**
 * Global admin search — searches across users, products, support tickets and subscriptions.
 * Called as a server action from the search palette.
 */
export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim();
  const results: SearchResult[] = [];

  // Run all searches in parallel
  const [users, products, tickets, subscriptions] = await Promise.all([
    searchUsers(q),
    searchProducts(q),
    searchTickets(q),
    searchSubscriptions(q),
  ]);

  results.push(...users, ...products, ...tickets, ...subscriptions);

  return results.slice(0, 20); // Cap at 20 results
}

// ── Users ─────────────────────────────────────────────────────────────
async function searchUsers(q: string): Promise<SearchResult[]> {
  const { data, error } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email, full_name, subscription_status, credit_balance')
    .or(`email.ilike.%${q}%,full_name.ilike.%${q}%`)
    .limit(5);

  if (error || !data) return [];

  return (data as any[]).map((u) => ({
    id: u.user_id,
    type: 'user' as const,
    title: u.full_name || u.email,
    subtitle: `${u.email} · ${u.credit_balance ?? 0} credits · ${u.subscription_status || 'free'}`,
    href: `/admin/users/${u.user_id}`,
  }));
}

// ── Products ──────────────────────────────────────────────────────────
async function searchProducts(q: string): Promise<SearchResult[]> {
  const { data, error } = await supabaseAdminClient
    .from('user_products')
    .select('id, title, generation_status, created_at, user_id')
    .ilike('title', `%${q}%`)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error || !data) return [];

  return (data as any[]).map((p) => ({
    id: p.id,
    type: 'product' as const,
    title: p.title || 'Untitled Product',
    subtitle: `Status: ${p.generation_status || 'unknown'}`,
    href: `/admin/products/${p.id}`,
  }));
}

// ── Support Tickets ───────────────────────────────────────────────────
async function searchTickets(q: string): Promise<SearchResult[]> {
  const { data, error } = await supabaseAdminClient
    .from('support_tickets')
    .select('id, subject, status, created_at')
    .or(`subject.ilike.%${q}%,ticket_id.ilike.%${q}%`)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error || !data) return [];

  return (data as any[]).map((t) => ({
    id: t.id,
    type: 'ticket' as const,
    title: t.subject,
    subtitle: `Status: ${t.status}`,
    href: `/admin/support/${t.id}`,
  }));
}

// ── Subscriptions ─────────────────────────────────────────────────────
async function searchSubscriptions(q: string): Promise<SearchResult[]> {
  // Search by user email through admin_users_view + join
  const { data, error } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email, full_name, subscription_status, plan_name')
    .not('subscription_status', 'is', null)
    .or(`email.ilike.%${q}%,plan_name.ilike.%${q}%`)
    .limit(5);

  if (error || !data) return [];

  return (data as any[])
    .filter((u) => u.subscription_status)
    .map((u) => ({
      id: `sub-${u.user_id}`,
      type: 'subscription' as const,
      title: `${u.email} — ${u.plan_name || 'Plan'}`,
      subtitle: `Status: ${u.subscription_status}`,
      href: `/admin/users/${u.user_id}`,
    }));
}
