/**
 * Supabase configuration for the admin panel.
 * Uses the same Supabase project as Listive — same URL and keys.
 */

import { getEnvVar } from '@/utils/get-env-var';

interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

/**
 * Custom storage key for the admin panel's auth cookies.
 * This ensures admin auth sessions are stored in a separate cookie from Listive,
 * preventing conflicts when both apps run on the same domain (localhost).
 * Default Supabase cookie: sb-<ref>-auth-token
 * Admin cookie:            sb-<ref>-admin-auth-token
 */
export const ADMIN_STORAGE_KEY = 'sb-admin-auth-token';

/**
 * Get Supabase credentials.
 * The admin panel always uses the same env vars — no prod/dev split needed
 * because the admin panel is only deployed to one environment.
 *
 * @param includeServiceRole - Only set to true in server-side code
 */
export function getSupabaseConfig(includeServiceRole: boolean = false): SupabaseConfig {
  return {
    url: getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    ...(includeServiceRole && {
      serviceRoleKey: getEnvVar(process.env.SUPABASE_SERVICE_ROLE_KEY, 'SUPABASE_SERVICE_ROLE_KEY'),
    }),
  };
}
