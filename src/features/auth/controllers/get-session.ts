import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

/**
 * Get the current authenticated user's session.
 * Returns null if not logged in.
 */
export async function getSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
