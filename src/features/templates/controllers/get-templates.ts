import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

export interface TemplateRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  usage_count: number;
  icon: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  user_email?: string;
}

/**
 * Fetch all user templates with user emails.
 */
export async function getTemplates(limit = 200): Promise<TemplateRow[]> {
  const { data, error } = await supabaseAdminClient
    .from('user_templates')
    .select('id, user_id, name, description, is_default, usage_count, icon, created_at, updated_at')
    .order('usage_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[getTemplates] Error:', error.message);
    return [];
  }

  // Fetch user emails
  const userIds = [...new Set((data || []).map((t: any) => t.user_id))];
  if (userIds.length === 0) return (data || []) as TemplateRow[];

  const { data: users } = await supabaseAdminClient
    .from('admin_users_view')
    .select('user_id, email')
    .in('user_id', userIds);

  const emailMap = new Map((users || []).map((u: any) => [u.user_id, u.email]));

  return (data || []).map((t: any) => ({
    ...t,
    user_email: emailMap.get(t.user_id) || '—',
  }));
}

export interface TemplateStats {
  total: number;
  withDefaults: number;
  totalUsage: number;
}

/**
 * Get template stats.
 */
export async function getTemplateStats(): Promise<TemplateStats> {
  const [{ count: total }, { count: withDefaults }] = await Promise.all([
    supabaseAdminClient.from('user_templates').select('*', { count: 'exact', head: true }),
    supabaseAdminClient.from('user_templates').select('*', { count: 'exact', head: true }).eq('is_default', true),
  ]);

  // Get total usage
  const { data: usageData } = await supabaseAdminClient
    .from('user_templates')
    .select('usage_count');

  const totalUsage = (usageData || []).reduce((sum: number, t: any) => sum + (t.usage_count || 0), 0);

  return {
    total: total || 0,
    withDefaults: withDefaults || 0,
    totalUsage,
  };
}
