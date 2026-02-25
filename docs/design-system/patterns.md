# UI & Code Patterns

> Recurring patterns used throughout the admin panel codebase.

## Component Patterns

### Controller → Server Component → Client Component

The most common pattern. Controllers fetch data, Server Components compose the page, Client Components handle interactivity.

```typescript
// controller (server-side)
export async function getUsers() {
  const supabase = createAdminClient();
  const { data } = await supabase.from('admin_users_view').select('*');
  return data ?? [];
}

// page.tsx (Server Component)
export default async function UsersPage() {
  const users = await getUsers();
  return (
    <>
      <PageHeader title="Users" icon={Users}>
        <ExportButton data={users} />
      </PageHeader>
      <UsersTable data={users} />
    </>
  );
}

// users-table.tsx (Client Component)
'use client';
export function UsersTable({ data }: { data: User[] }) {
  // TanStack Table, sorting, pagination
}
```

### Data Table Pattern

Most list pages follow the same data table pattern:

```tsx
const columns: ColumnDef<T>[] = [
  { accessorKey: 'field', header: ({ column }) => <DataTableColumnHeader column={column} title="Field" /> },
  // ...
];

<DataTable columns={columns} data={data} />
```

The `DataTable` component from `src/components/data-table/` handles sorting, pagination, and toolbar automatically.

### Detail Page with Back Button

Detail pages use `PageHeader` with `backHref`:

```tsx
<PageHeader
  title={product.name}
  icon={Package}
  backHref={ROUTES.products}
>
  <ProductActions product={product} />
</PageHeader>
```

---

## Data Patterns

### Server Actions with Audit Trail

All mutations follow this pattern:

```typescript
'use server';
export async function adjustCredits(userId: string, amount: number, reason: string) {
  const supabase = createAdminClient();

  // 1. Perform the mutation
  await supabase.from('user_credits').update({ credits: newBalance });

  // 2. Log to audit trail
  await supabase.from('admin_actions').insert({
    admin_user_id: adminUser.id,
    action_type: 'adjust_credits',
    target_table: 'user_credits',
    target_id: userId,
    payload: { amount, reason, before: oldBalance, after: newBalance },
  });

  // 3. Revalidate
  revalidatePath(ROUTES.credits);
  return { data: null, error: null };
}
```

### ActionResponse Type

Server Actions return `ActionResponse<T>`:

```typescript
type ActionResponse<T> = { data: T; error: any } | undefined;
```

### React Query (Manual Invalidation)

The admin panel uses React Query with `staleTime: Infinity` — data never auto-refetches. Cache is invalidated manually after mutations:

```typescript
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ['users'] });
```

### Service Role Access

All Supabase queries use the admin client (service_role):

```typescript
import { createAdminClient } from '@/libs/supabase/supabase-admin';

const supabase = createAdminClient();
// Bypasses RLS — full access to all data
```

---

## Layout Patterns

### Page Structure

Every admin page follows this structure:

```tsx
<>
  <PageHeader title="Page Title" icon={IconName}>
    {/* Optional action buttons */}
  </PageHeader>
  {/* Page content */}
</>
```

The `PageHeader` is sticky and uses `-mx-6 px-6` to break out of the content padding and span the full scroll container width.

### Scroll Container Architecture

```
<main> — overflow-hidden, rounded corners
  <div> — overflow-y-auto, custom-scrollbar (NO horizontal padding)
    <div className="px-6 pb-6"> — content padding wrapper
      <PageHeader /> — uses -mx-6 px-6 to break out
      {children}
    </div>
  </div>
</main>
```

This prevents the scrollbar from overlapping the sticky header.

### Glass Header Effect

```css
bg-white/60 backdrop-blur-xl border-b border-black/[0.06]
```

Creates a frosted glass look for the sticky page header.

### Loading States

Dashboard sections have `loading.tsx` files for skeleton loading:

```tsx
export default function Loading() {
  return (
    <>
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </>
  );
}
```

---

## Route Patterns

### Typed Route Map

All routes defined in `src/constants/routes.ts`:

```typescript
export const ROUTES = {
  dashboard: '/admin',
  users: '/admin/users',
  userDetail: (id: string) => `/admin/users/${id}`,
  // ...
} as const;
```

**Never use string literals for routes.** Always reference `ROUTES.*`.

### Auth Guard (Layout-Level)

The admin layout checks for session + admin status. No per-page auth checks needed.

---

## Styling Patterns

### Class Name Composition

```typescript
import { cn } from '@/utils/cn';

<div className={cn('base-classes', isActive && 'active-class', className)} />
```

### Status Badges

The `StatusBadge` component handles 25+ status variants:

```typescript
<StatusBadge status="active" />    // green
<StatusBadge status="canceled" />  // red
<StatusBadge status="trialing" />  // blue
```

### Conditional Rendering

For optional data (e.g., images):

```tsx
{url ? <img src={url} alt={name} /> : null}
```

Never render `<img>` with an empty `src` — it triggers console warnings.

---

*See [Components](components.md) for the full inventory. See [Tokens](tokens.md) for the color/typography system.*
