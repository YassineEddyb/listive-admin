/**
 * Supabase admin client — uses service_role key to bypass RLS.
 * This is the PRIMARY client for the admin panel.
 * Only use in Server Components and Server Actions — never expose to the browser.
 */

import { getSupabaseConfig } from '@/libs/supabase/config';
import { createClient } from '@supabase/supabase-js';

const config = getSupabaseConfig(true);

if (!config.serviceRoleKey) {
  throw new Error('Service role key not available for admin client');
}

// Not typed with Database since admin tables (admin_users, admin_actions, admin_users_view)
// are not yet in the generated types. This is fine — service_role bypasses RLS and
// we manually type all return values in controllers.
export const supabaseAdminClient = createClient(config.url, config.serviceRoleKey);
