# Performance

> Optimization strategies and performance rules for Listive Admin.

## Server Components First

**Default:** Every page and layout is a React Server Component unless it needs interactivity.

### Why
- Zero client-side JavaScript for static content
- Data fetching happens at the edge/server
- Smaller bundle sizes
- No hydration overhead

### Pattern
```
page.tsx          → Server Component (fetches data, renders layout)
  └── client.tsx  → Client Component (tables, forms, dropdowns)
```

Only these things require `'use client'`:
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- React hooks (`useState`, `useEffect`, `useCallback`)
- Browser-only APIs (`window`, `document`, `localStorage`)
- Interactive shadcn/ui components (dialogs, dropdowns, selects)

---

## Bundle Optimization

### Next.js Config

```javascript
// next.config.js
experimental: {
  optimizePackageImports: [
    '@radix-ui/react-icons',
    'lucide-react',
    'recharts',
  ],
}
```

This enables tree-shaking for icon and chart libraries, reducing bundle size.

### Turbopack (Development)
Dev server uses Turbopack (`next dev --turbopack`) for:
- ~10x faster HMR than webpack
- Instant module resolution
- Better memory efficiency

---

## Data Fetching

### Dashboard Stats — Single Call
The dashboard fetches all KPIs in a single Supabase query:
```typescript
// One DB call returns: totalUsers, activeUsers, totalRevenue, activeSubscriptions, pendingTickets, totalCredits
const stats = await getDashboardStats();
```

### Controller Pattern
Each page has a controller that fetches all required data server-side:
```typescript
// src/features/users/controllers/get-users.ts
export async function getUsers(params) {
  // Single server-side call — no client-side fetching
}
```

### React Query (Client-Side)
Used only for data that needs:
- Real-time refresh (`refetchInterval`)
- Manual invalidation after mutations
- Optimistic updates

```typescript
const { data, refetch } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetchUsers(),
  refetchInterval: 30000, // 30s polling for live data
});
```

---

## Caching Strategy

| Data Type | Strategy | TTL |
|-----------|----------|-----|
| Page data | Server Component (no cache) | Fresh on every request |
| Dashboard stats | Server Component | Fresh on every load |
| Polar.sh data | React Query | 30s refetch interval |
| Resend metrics | React Query | Manual refetch |
| Static UI | Client bundle | Until next deploy |

### No Aggressive Caching
Admin panels need fresh data. We intentionally avoid:
- `revalidate` intervals on pages
- `unstable_cache` for admin data
- Stale-while-revalidate for critical stats

---

## Rendering Performance

### Table Virtualization
Large data tables use pagination (not infinite scroll) to limit DOM nodes:
- Default page size: 10 rows
- Server-side pagination via URL params (`?page=1&per_page=10`)

### Animation Budget
- CSS transitions preferred over JS animations
- `transition-all duration-200` for hover states
- `animate-fade-in` / `animate-slide-in` for mount animations only
- No layout-triggering animations (avoid animating `width`, `height`, `top`)

### Image Handling
- Conditional rendering: `{url ? <img /> : null}` (no empty `src`)
- Supabase storage URLs used directly (no Next.js Image optimization needed for admin)
- Thumbnail variants used in tables, full-size in detail views

---

## Monitoring & Debugging

### Build Metrics
```bash
bun run build
# Watch for:
# - Route count (should be 25)
# - Bundle size warnings
# - Static vs Dynamic classification
```

### TypeScript as Guard
```bash
bun tsc --noEmit
# Must pass with 0 errors before deploy
```

### Lighthouse (Future)
No Lighthouse or Core Web Vitals monitoring currently set up for the admin panel. This is acceptable since it's an internal tool, not a public-facing site.

---

*See [Coding Rules](coding-rules.md) for code standards. See [Architecture Overview](../architecture/overview.md) for system design.*
