# Component Inventory

> All UI components in the Listive Admin codebase, organized by category.

## shadcn/ui Primitives (17 files)

**Directory:** `src/components/ui/`
**Style:** New York
**Base:** Radix UI primitives
**Config:** `components.json` (path alias `@/*`, Tailwind CSS variables)

| Component | File | Radix Primitive |
|-----------|------|----------------|
| AlertDialog | `alert-dialog.tsx` | `@radix-ui/react-alert-dialog` |
| Badge | `badge.tsx` | — (CVA) |
| Button | `button.tsx` | `@radix-ui/react-slot` (asChild) |
| Card | `card.tsx` | — (custom) |
| Dialog | `dialog.tsx` | `@radix-ui/react-dialog` |
| DropdownMenu | `dropdown-menu.tsx` | `@radix-ui/react-dropdown-menu` |
| Input | `input.tsx` | — (custom) |
| Label | `label.tsx` | `@radix-ui/react-label` |
| Select | `select.tsx` | `@radix-ui/react-select` |
| Skeleton | `skeleton.tsx` | — (custom) |
| Table | `table.tsx` | — (custom) |
| Tabs | `tabs.tsx` | `@radix-ui/react-tabs` |
| Textarea | `textarea.tsx` | — (custom) |
| Toast | `toast.tsx` | `@radix-ui/react-toast` |
| Toaster | `toaster.tsx` | — (toast container) |
| Tooltip | `tooltip.tsx` | `@radix-ui/react-tooltip` |
| useToast | `use-toast.ts` | — (hook) |

### Variant Management
Components use `class-variance-authority` (CVA) for variant props:
```typescript
const buttonVariants = cva('inline-flex items-center...', {
  variants: {
    variant: { default: '...', destructive: '...', outline: '...' },
    size: { default: '...', sm: '...', lg: '...', icon: '...' },
  },
});
```

---

## Data Table System (4 files)

**Directory:** `src/components/data-table/`

The backbone of most admin pages. A generic, reusable table system built on TanStack React Table:

| File | Purpose |
|------|---------|
| `data-table.tsx` | Core table with sorting, pagination integration |
| `data-table-column-header.tsx` | Clickable column headers with sort indicators |
| `data-table-pagination.tsx` | Page navigation, row count, page size selector |
| `data-table-toolbar.tsx` | Search input, filter dropdowns, action buttons |

Usage pattern:
```typescript
const columns: ColumnDef<User>[] = [
  { accessorKey: 'email', header: ({ column }) => <DataTableColumnHeader column={column} title="Email" /> },
  // ...
];

<DataTable columns={columns} data={users} />
```

---

## Layout Components (3 files)

**Directory:** `src/components/layout/`

| Component | File | Purpose |
|-----------|------|---------|
| AdminSidebar | `admin-sidebar.tsx` | 17-item sidebar with 5 nav sections |
| AdminTopnav | `admin-topnav.tsx` | Top bar with global search + user menu |
| PageHeader | `page-header.tsx` | Sticky floating header with back button, icon, title, action slot |

### Sidebar Sections (17 items)

| Section | Items |
|---------|-------|
| Overview | Dashboard, Analytics |
| Users & Billing | Users, Subscriptions, Credits |
| Content | Products, Images, Stores, Listings, Templates |
| System | Webhooks, Integrations, System Health, Settings |
| Activity | Support, Feedback, Audit Log |

### PageHeader Props

| Prop | Type | Purpose |
|------|------|---------|
| `title` | string | Page title |
| `description` | string? | Optional subtitle |
| `icon` | LucideIcon? | Icon next to title |
| `backHref` | string? | Back arrow link (detail pages) |
| `children` | ReactNode? | Action buttons slot |
| `className` | string? | Additional classes |

---

## Shared Components (3 files)

| Component | File | Purpose |
|-----------|------|---------|
| StatCard | `stat-card.tsx` | Dashboard metric card with icon, value, trend indicator |
| StatusBadge | `status-badge.tsx` | Multi-status badge (25+ status variants across subscriptions, tickets, feedback, etc.) |
| ExportButton | `export-button.tsx` | CSV export trigger wrapping `exportToCsv` utility |

---

## Feature Components

Components colocated with features in `src/features/*/components/`:

| Feature | Components |
|---------|-----------|
| Users | users-table, user-actions, edit-profile-dialog, send-email-dialog, user-timeline |
| Credits | credit-balances-table, transaction-table, credit-adjustment-form |
| Support | ticket-table, ticket-status-control, ticket-priority-control, ticket-reply-form |
| Feedback | feedback-table, feedback-status-control |
| Products | product-table, product-actions |
| Subscriptions | subscription-table, subscription-actions |
| Images | image-gallery |
| Dashboard | trend-chart |
| Analytics | analytics-chart |
| Audit | audit-log-table |
| Webhooks | webhook-table |
| Stores | store-tables |
| Listings | listings-table |
| Templates | templates-table |
| System | system-operations |
| Auth | user-menu |
| Search | global-search |
| Settings | admin-users-manager |

---

*See [Tokens](tokens.md) for the design token system. See [Patterns](patterns.md) for recurring patterns.*
