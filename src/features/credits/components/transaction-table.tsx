'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import type { TransactionRow } from '@/features/credits/controllers/get-transactions';
import { formatRelativeDate } from '@/utils/format-relative-date';

const typeVariantMap: Record<string, 'success' | 'destructive' | 'info' | 'warning' | 'default'> = {
  purchase: 'success',
  usage: 'destructive',
  refund: 'warning',
  bonus: 'info',
  adjustment: 'default',
};

const columns: ColumnDef<TransactionRow>[] = [
  {
    accessorKey: 'user_email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='User' />,
    cell: ({ row }) => (
      <Link
        href={`/admin/users/${row.original.user_id}`}
        className='font-medium text-brand-primary hover:underline'
      >
        {row.original.user_email || row.original.user_id.slice(0, 8)}
      </Link>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue<string>('type');
      return <Badge variant={typeVariantMap[type] || 'default'}>{type}</Badge>;
    },
    filterFn: (row, id, value) => value === undefined || row.getValue(id) === value,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Amount' />,
    cell: ({ row }) => {
      const amount = row.getValue<number>('amount');
      return (
        <span className={`tabular-nums font-medium ${amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {amount > 0 ? '+' : ''}
          {amount}
        </span>
      );
    },
  },
  {
    accessorKey: 'balance_after',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Balance After' />,
    cell: ({ row }) => (
      <span className='tabular-nums'>{row.getValue<number>('balance_after').toLocaleString()}</span>
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
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>{formatRelativeDate(row.getValue('created_at'))}</span>
    ),
  },
];

const typeFilterOptions = [
  { label: 'Purchase', value: 'purchase' },
  { label: 'Usage', value: 'usage' },
  { label: 'Refund', value: 'refund' },
  { label: 'Bonus', value: 'bonus' },
  { label: 'Adjustment', value: 'adjustment' },
];

interface TransactionTableProps {
  data: TransactionRow[];
}

export function TransactionTable({ data }: TransactionTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='user_email'
      searchPlaceholder='Search by email...'
      filterOptions={[
        { key: 'type', label: 'Type', options: typeFilterOptions },
      ]}
    />
  );
}
