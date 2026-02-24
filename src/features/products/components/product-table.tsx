'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { ROUTES } from '@/constants/routes';
import type { ProductRow } from '@/features/products/controllers/get-products';
import { formatRelativeDate } from '@/utils/format-relative-date';

const columns: ColumnDef<ProductRow>[] = [
  {
    accessorKey: 'reference_image_thumbnail_url',
    header: '',
    cell: ({ row }) => {
      const url = row.original.reference_image_thumbnail_url || row.original.reference_image_url;
      return (
        <div className='h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted'>
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=''
              className='h-full w-full object-cover'
              loading='lazy'
            />
          ) : null}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Product' />,
    cell: ({ row }) => (
      <Link
        href={ROUTES.productDetail(row.original.id)}
        className='max-w-[240px] truncate font-medium text-brand-primary hover:underline'
      >
        {row.original.title || row.original.name || 'Untitled Product'}
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
    accessorKey: 'generation_status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('generation_status')} />,
    filterFn: (row, id, value) => {
      return value === undefined || row.getValue(id) === value;
    },
  },
  {
    accessorKey: 'completed_images',
    header: 'Images',
    cell: ({ row }) => {
      const completed = row.original.completed_images;
      const total = row.original.total_images;
      const failed = row.original.failed_images;
      return (
        <div className='text-sm'>
          <span className='font-medium tabular-nums'>{completed}/{total}</span>
          {failed > 0 && (
            <span className='ml-1 text-destructive'>({failed} failed)</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'reference_image_source',
    header: 'Source',
    cell: ({ row }) => (
      <span className='text-xs capitalize text-muted-foreground'>
        {row.getValue('reference_image_source')}
      </span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created' />,
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {formatRelativeDate(row.getValue('created_at'))}
      </span>
    ),
  },
];

const statusFilterOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Partial', value: 'partial' },
  { label: 'Failed', value: 'failed' },
];

interface ProductTableProps {
  data: ProductRow[];
}

export function ProductTable({ data }: ProductTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='user_email'
      searchPlaceholder='Search by user email...'
      filterOptions={[
        { key: 'generation_status', label: 'Status', options: statusFilterOptions },
      ]}
    />
  );
}
