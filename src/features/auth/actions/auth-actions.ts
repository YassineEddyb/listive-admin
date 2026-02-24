'use server';

import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/libs/supabase/supabase-server-client';

import type { ActionResponse } from '@/types/action-response';

/**
 * Sign in with email and password.
 */
export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<ActionResponse<{ userId: string }>> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { data: null as any, error: error.message };
  }

  redirect('/admin');
}

/**
 * Sign in with Google OAuth.
 */
export async function signInWithOAuth(): Promise<ActionResponse<{ url: string }>> {
  const supabase = await createSupabaseServerClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { data: null as any, error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { data: { url: data.url }, error: null };
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<ActionResponse<null>> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { data: null, error: error.message };
  }

  redirect('/login');
}
