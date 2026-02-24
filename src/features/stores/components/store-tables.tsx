'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';
import type { ShopifyConnectionRow, EtsyConnectionRow } from '@/features/stores/controllers/get-stores';
import { formatRelativeDate } from '@/utils/format-relative-date';

// ── Shopify Table ──────────────────────────────────────

const shopifyColumns: ColumnDef<ShopifyConnectionRow>[] = [
  {
    accessorKey: 'shop_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Shop' />,
    cell: ({ row }) => (
      <div>
        <p className='font-medium'>{row.original.shop_name || row.original.shop_domain}</p>
        <p className='text-xs text-muted-foreground'>{row.original.shop_domain}</p>
      </div>
    ),
  },
  {
    accessorKey: 'user_email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='User' />,
    cell: ({ row }) => (
      <Link
        href={ROUTES.userDetail(row.original.user_id)}
        className='text-sm text-brand-primary hover:underline'
      >
        {row.getValue('user_email')}
      </Link>
    ),
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.getValue('is_active') ? 'active' : 'canceled'}>
        {row.getValue('is_active') ? 'Active' : 'Inactive'}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      if (value === undefined) return true;
      return String(row.getValue(id)) === value;
    },
  },
  {
    accessorKey: 'listing_count',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Listings' />,
    cell: ({ row }) => (
      <span className='font-medium tabular-nums'>{row.getValue('listing_count')}</span>
    ),
  },
  {
    accessorKey: 'last_synced_at',
    header: 'Last Synced',
    cell: ({ row }) => {
      const val = row.getValue<string | null>('last_synced_at');
      return (
        <span className='text-sm text-muted-foreground'>
          {val ? formatRelativeDate(val) : 'Never'}
        </span>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Connected' />,
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {formatRelativeDate(row.getValue('created_at'))}
      </span>
    ),
  },
];

interface ShopifyTableProps {
  data: ShopifyConnectionRow[];
}

export function ShopifyTable({ data }: ShopifyTableProps) {
  return (
    <DataTable
      columns={shopifyColumns}
      data={data}
      searchKey='shop_name'
      searchPlaceholder='Search Shopify shops...'
    />
  );
}

// ── Etsy Table ─────────────────────────────────────────

const etsyColumns: ColumnDef<EtsyConnectionRow>[] = [
  {
    accessorKey: 'shop_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Shop' />,
    cell: ({ row }) => (
      <div>
        <p className='font-medium'>{row.original.shop_name || row.original.shop_id}</p>
        <p className='text-xs text-muted-foreground'>ID: {row.original.shop_id}</p>
      </div>
    ),
  },
  {
    accessorKey: 'user_email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='User' />,
    cell: ({ row }) => (
      <Link
        href={ROUTES.userDetail(row.original.user_id)}
        className='text-sm text-brand-primary hover:underline'
      >
        {row.getValue('user_email')}
      </Link>
    ),
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.getValue('is_active') ? 'active' : 'canceled'}>
        {row.getValue('is_active') ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    accessorKey: 'listing_count',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Listings' />,
    cell: ({ row }) => (
      <span className='font-medium tabular-nums'>{row.getValue('listing_count')}</span>
    ),
  },
  {
    accessorKey: 'expires_at',
    header: 'Token Expires',
    cell: ({ row }) => {
      const val = row.getValue<string | null>('expires_at');
      if (!val) return <span className='text-muted-foreground'>—</span>;
      const isExpired = new Date(val) < new Date();
      return (
        <span className={`text-sm ${isExpired ? 'text-destructive' : 'text-muted-foreground'}`}>
          {isExpired ? 'Expired' : formatRelativeDate(val)}
        </span>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Connected' />,
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {formatRelativeDate(row.getValue('created_at'))}
      </span>
    ),
  },
];

interface EtsyTableProps {
  data: EtsyConnectionRow[];
}

export function EtsyTable({ data }: EtsyTableProps) {
  return (
    <DataTable
      columns={etsyColumns}
      data={data}
      searchKey='shop_name'
      searchPlaceholder='Search Etsy shops...'
    />
  );
}
