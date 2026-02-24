/**
 * Supabase middleware client — refreshes auth session on every request.
 * Adapted from Listive's middleware client with admin-specific route protection.
 */

import { type NextRequest, NextResponse } from 'next/server';

import { ADMIN_STORAGE_KEY, getSupabaseConfig } from '@/libs/supabase/config';
import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const config = getSupabaseConfig();

  const supabase = createServerClient(config.url, config.anonKey, {
    auth: {
      storageKey: ADMIN_STORAGE_KEY,
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        supabaseResponse = NextResponse.next({
          request,
        });

        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes — all /admin routes require authentication
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin');

  // Public routes
  const isPublicRoute =
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/unauthorized');

  // Redirect to login if accessing protected route without authentication
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If already logged in and visiting login page, redirect to admin dashboard
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
