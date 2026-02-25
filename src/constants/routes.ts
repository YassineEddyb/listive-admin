/**
 * Centralised admin route map.
 * Import from here instead of using hardcoded strings.
 *
 * Usage:
 *   import { ROUTES } from '@/constants/routes';
 *   <Link href={ROUTES.dashboard}>…</Link>
 */

export const ROUTES = {
  // ── Auth ────────────────────────────────────
  login: '/login',
  unauthorized: '/unauthorized',

  // ── Dashboard ───────────────────────────────
  dashboard: '/admin',

  // ── Users ───────────────────────────────────
  users: '/admin/users',
  userDetail: (id: string) => `/admin/users/${id}` as const,

  // ── Subscriptions ───────────────────────────
  subscriptions: '/admin/subscriptions',

  // ── Credits ─────────────────────────────────
  credits: '/admin/credits',

  // ── Support ─────────────────────────────────
  support: '/admin/support',
  ticketDetail: (id: string) => `/admin/support/${id}` as const,

  // ── Feedback ────────────────────────────────
  feedback: '/admin/feedback',
  feedbackDetail: (id: string) => `/admin/feedback/${id}` as const,

  // ── Audit Log ───────────────────────────────
  auditLog: '/admin/audit',

  // ── Phase 3 (future) ────────────────────────
  products: '/admin/products',
  productDetail: (id: string) => `/admin/products/${id}` as const,
  images: '/admin/images',
  stores: '/admin/stores',
  listings: '/admin/listings',
  templates: '/admin/templates',
  webhooks: '/admin/webhooks',
  system: '/admin/system',
  analytics: '/admin/analytics',
  integrations: '/admin/integrations',
  settings: '/admin/settings',
} as const;
