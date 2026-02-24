'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Star } from 'lucide-react';
import Link from 'next/link';

import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';
import type { TemplateRow } from '@/features/templates/controllers/get-templates';
import { formatRelativeDate } from '@/utils/format-relative-date';

const columns: ColumnDef<TemplateRow>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        {row.original.icon && <span className='text-lg'>{row.original.icon}</span>}
        <span className='max-w-[200px] truncate font-medium'>{row.getValue('name')}</span>
        {row.original.is_default && (
          <Star className='h-3.5 w-3.5 fill-amber-400 text-amber-400' />
        )}
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
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => (
      <span className='max-w-[200px] truncate text-sm text-muted-foreground'>
        {row.getValue('description') || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'usage_count',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Uses' />,
    cell: ({ row }) => (
      <Badge variant='default' className='tabular-nums'>
        {(row.getValue('usage_count') as number).toLocaleString()}
      </Badge>
    ),
  },
  {
    accessorKey: 'is_default',
    header: 'Default',
    cell: ({ row }) => (
      row.getValue('is_default') ? (
        <Badge variant='success'>Yes</Badge>
      ) : (
        <span className='text-muted-foreground'>—</span>
      )
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

interface TemplatesTableProps {
  data: TemplateRow[];
}

export function TemplatesTable({ data }: TemplatesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='user_email'
      searchPlaceholder='Search by user email...'
    />
  );
}
