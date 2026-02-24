/**
 * Supabase server client — uses anon key with cookie-based auth.
 * Used for admin authentication (login/session management).
 * Uses the same auth session pattern as the main Listive app.
 */

import { cookies } from 'next/headers';

import { ADMIN_STORAGE_KEY, getSupabaseConfig } from '@/libs/supabase/config';
import { Database } from '@/libs/supabase/types';
import { type CookieOptions, createServerClient } from '@supabase/ssr';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const config = getSupabaseConfig();

  return createServerClient<Database>(config.url, config.anonKey, {
    auth: {
      storageKey: ADMIN_STORAGE_KEY,
    },
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
}
