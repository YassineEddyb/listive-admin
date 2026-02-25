# Dashboard

> Dashboard home page — the admin panel's main landing page.

## Overview

The dashboard (`/admin`) displays key platform metrics and trend charts in a single view. All data is fetched via the `admin_dashboard_stats()` database function in a single query.

---

## KPI Cards

| Metric | Source | Display |
|--------|--------|---------|
| Total Users | `total_users` | Count |
| New Users Today | `new_users_today` | Count with trend |
| Active Subscriptions | `active_subscriptions` | Count |
| Total Revenue | `total_revenue_cents` | Formatted currency |
| Total Products | `total_products` | Count |
| Products Today | `products_today` | Count |
| Total Images | `total_images` | Count |
| Credits Consumed | `total_credits_consumed` | Formatted number |
| Credits Today | `credits_consumed_today` | Count |
| Open Tickets | `open_tickets` | Count |
| Pending Feedback | `pending_feedback` | Count |

Cards use the `StatCard` component with icon, value, label, and optional trend indicator.

---

## Trend Charts

| Chart | Function | Default Range |
|-------|----------|---------------|
| Signup Trend | `admin_signups_by_day(30)` | 30 days |
| Credit Usage Trend | `admin_credits_consumed_by_day(30)` | 30 days |

Charts rendered with Recharts via the `TrendChart` component.

---

## Implementation

| File | Role |
|------|------|
| `src/app/admin/page.tsx` | Server Component page |
| `src/features/dashboard/controllers/get-dashboard-stats.ts` | Data fetching (calls `admin_dashboard_stats()` RPC) |
| `src/features/dashboard/components/trend-chart.tsx` | Client Component chart |
| `src/components/stat-card.tsx` | Metric card component |

### Widget Animations

Dashboard cards use CSS `@keyframes widget-entrance` with staggered delays:
```css
.stagger-1 { animation-delay: 0.05s; }
.stagger-2 { animation-delay: 0.1s; }
/* ... up to .stagger-8 */
```

---

*See [Analytics](../features/system.md) for deeper charts beyond the dashboard.*
