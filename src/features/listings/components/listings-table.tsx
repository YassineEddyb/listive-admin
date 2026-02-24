'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';
import type { ListingRow } from '@/features/listings/controllers/get-listings';
import { formatRelativeDate } from '@/utils/format-relative-date';

const platformColors: Record<string, string> = {
  shopify: 'bg-green-100 text-green-700',
  etsy: 'bg-orange-100 text-orange-700',
};

const columns: ColumnDef<ListingRow>[] = [
  {
    accessorKey: 'platform',
    header: 'Platform',
    cell: ({ row }) => (
      <Badge className={`capitalize ${platformColors[row.getValue('platform') as string] || ''}`}>
        {row.getValue('platform')}
      </Badge>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'product_title',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Product' />,
    cell: ({ row }) => (
      <Link
        href={ROUTES.productDetail(row.original.product_id)}
        className='max-w-[200px] truncate font-medium hover:text-brand-blue hover:underline'
      >
        {row.original.product_title || '—'}
      </Link>
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'external_url',
    header: 'Link',
    cell: ({ row }) => {
      const url = row.getValue('external_url') as string | null;
      return url ? (
        <a href={url} target='_blank' rel='noopener noreferrer' className='text-brand-blue hover:underline'>
          <ExternalLink className='h-4 w-4' />
        </a>
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
    },
  },
  {
    accessorKey: 'error_message',
    header: 'Error',
    cell: ({ row }) => {
      const error = row.getValue('error_message') as string | null;
      return error ? (
        <span className='max-w-[200px] truncate text-xs text-destructive'>{error}</span>
      ) : null;
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Listed' />,
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {formatRelativeDate(row.getValue('created_at'))}
      </span>
    ),
  },
];

interface ListingsTableProps {
  data: ListingRow[];
}

export function ListingsTable({ data }: ListingsTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='user_email'
      searchPlaceholder='Search by user email...'
      filterOptions={[
        {
          key: 'status',
          label: 'Status',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Success', value: 'success' },
            { label: 'Failed', value: 'failed' },
          ],
        },
      ]}
    />
  );
}
