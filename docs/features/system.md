# System, Analytics, Settings & Audit

> System health monitoring, analytics, admin settings, and audit log.

## System Health (`/admin/system`)

- Database statistics: table sizes, row counts
- System operations (planned: cache clear, reindex, maintenance mode)
- Runtime information

### Implementation
| File | Purpose |
|------|---------|
| `src/features/system/controllers/get-system-health.ts` | DB stats queries |
| `src/features/system/components/system-operations.tsx` | Operations UI |
| `src/features/system/actions/system-actions.ts` | System action handlers |

---

## Analytics (`/admin/analytics`)

Detailed charts beyond the dashboard overview:
- Signup trends over time
- Credit consumption patterns
- Revenue over time

### Implementation
| File | Purpose |
|------|---------|
| `src/features/analytics/controllers/get-analytics.ts` | Trend data queries |
| `src/features/analytics/components/analytics-chart.tsx` | Recharts-based charts |

---

## Settings (`/admin/settings`)

Admin user management:
- View all current admin users
- **Add admin** — enter email, look up `auth.users`, insert into `admin_users`
- **Revoke admin** — remove row from `admin_users`
- All changes logged to audit trail

### Implementation
| File | Purpose |
|------|---------|
| `src/features/settings/controllers/get-admin-users.ts` | Fetch admin user list |
| `src/features/settings/components/admin-users-manager.tsx` | Admin management UI |
| `src/features/settings/actions/manage-admin-users.ts` | Add/revoke admin actions |

---

## Audit Log (`/admin/audit`)

Chronological log of all admin actions from the `admin_actions` table:
- Who performed the action (admin email)
- What was done (action type)
- Which record was affected (target table/id)
- Full payload diff (before/after)
- Timestamp

Filterable by action type and admin user.

### Implementation
| File | Purpose |
|------|---------|
| `src/features/audit/controllers/get-audit-log.ts` | Fetch audit entries |
| `src/features/audit/components/audit-log-table.tsx` | Audit log table |

---

## Webhooks (`/admin/webhooks`)

Event log of all processed Polar.sh webhook events:
- Event ID, event type
- Processing timestamp
- Payload preview (expandable)

### Implementation
| File | Purpose |
|------|---------|
| `src/features/webhooks/controllers/get-webhooks.ts` | Fetch webhook events |
| `src/features/webhooks/components/webhook-table.tsx` | Webhook event table |

---

## Other Pages

### Stores (`/admin/stores`)
Shopify and Etsy store connections overview. Connection status, store details.

### Listings (`/admin/listings`)
All marketplace listings published from the platform.

### Templates (`/admin/templates`)
User-created generation templates (style, angle, aspect ratio presets).

---

## Global Search

Command-palette style search across users, products, tickets, feedback. Accessible from the top navigation bar.

### Implementation
| File | Purpose |
|------|---------|
| `src/features/search/components/global-search.tsx` | Search UI |
| `src/features/search/actions/global-search.ts` | Multi-table search action |
