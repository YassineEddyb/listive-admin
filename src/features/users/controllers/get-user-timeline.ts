import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface TimelineEvent {
  id: string;
  type: 'product' | 'image_edit' | 'credit' | 'listing' | 'ticket' | 'feedback';
  title: string;
  detail: string;
  status?: string;
  created_at: string;
}

/**
 * Fetch a combined activity timeline for a user.
 * Merges products, edits, credits, listings, tickets, and feedback
 * into a single reverse-chronological list.
 */
export async function getUserTimeline(userId: string, limit = 50): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = [];

  // Products created
  const { data: products } = await supabaseAdminClient
    .from('user_products')
    .select('id, title, name, generation_status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  for (const p of (products || []) as any[]) {
    events.push({
      id: `product-${p.id}`,
      type: 'product',
      title: 'Created product',
      detail: p.title || p.name || 'Untitled',
      status: p.generation_status,
      created_at: p.created_at,
    });
  }

  // Image edit operations
  const { data: edits } = await supabaseAdminClient
    .from('image_edit_operations')
    .select('id, edit_prompt, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  for (const e of (edits || []) as any[]) {
    events.push({
      id: `edit-${e.id}`,
      type: 'image_edit',
      title: 'Image edit',
      detail: e.edit_prompt || 'Edit operation',
      status: e.status,
      created_at: e.created_at,
    });
  }

  // Credit transactions
  const { data: credits } = await supabaseAdminClient
    .from('credit_transactions')
    .select('id, type, amount, description, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  for (const c of (credits || []) as any[]) {
    events.push({
      id: `credit-${c.id}`,
      type: 'credit',
      title: `${c.type === 'debit' ? 'Used' : 'Received'} ${Math.abs(c.amount)} credits`,
      detail: c.description || c.type,
      created_at: c.created_at,
    });
  }

  // Shopify listings
  const { data: shopifyListings } = await supabaseAdminClient
    .from('listing_history')
    .select('id, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  for (const l of (shopifyListings || []) as any[]) {
    events.push({
      id: `listing-shopify-${l.id}`,
      type: 'listing',
      title: 'Shopify listing',
      detail: `Status: ${l.status}`,
      status: l.status,
      created_at: l.created_at,
    });
  }

  // Etsy listings
  const { data: etsyListings } = await supabaseAdminClient
    .from('etsy_listing_history')
    .select('id, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  for (const l of (etsyListings || []) as any[]) {
    events.push({
      id: `listing-etsy-${l.id}`,
      type: 'listing',
      title: 'Etsy listing',
      detail: `Status: ${l.status}`,
      status: l.status,
      created_at: l.created_at,
    });
  }

  // Support tickets
  const { data: tickets } = await supabaseAdminClient
    .from('support_tickets')
    .select('id, subject, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  for (const t of (tickets || []) as any[]) {
    events.push({
      id: `ticket-${t.id}`,
      type: 'ticket',
      title: 'Support ticket',
      detail: t.subject || 'No subject',
      status: t.status,
      created_at: t.created_at,
    });
  }

  // Feedback
  const { data: feedback } = await supabaseAdminClient
    .from('user_feedback')
    .select('id, title, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);

  for (const f of (feedback || []) as any[]) {
    events.push({
      id: `feedback-${f.id}`,
      type: 'feedback',
      title: 'Feedback submitted',
      detail: f.title || 'No title',
      status: f.status,
      created_at: f.created_at,
    });
  }

  // Sort by date descending and limit
  events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return events.slice(0, limit);
}
