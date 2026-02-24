'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';
import type { SubscriptionRow } from '@/features/subscriptions/controllers/get-subscriptions';
import { formatCurrency } from '@/utils/format-currency';
import { formatRelativeDate } from '@/utils/format-relative-date';

const columns: ColumnDef<SubscriptionRow>[] = [
  {
    accessorKey: 'user_email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='User' />,
    cell: ({ row }) => (
      <Link
        href={ROUTES.userDetail(row.original.user_id)}
        className='font-medium text-brand-primary hover:underline'
      >
        {row.getValue('user_email')}
      </Link>
    ),
  },
  {
    accessorKey: 'plan_name',
    header: 'Plan',
    cell: ({ row }) => (
      <span className='font-medium'>{row.getValue('plan_name')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    filterFn: (row, id, value) => {
      return value === undefined || row.getValue(id) === value;
    },
  },
  {
    accessorKey: 'unit_amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Price' />,
    cell: ({ row }) => {
      const amount = row.getValue<number>('unit_amount');
      return <span className='tabular-nums'>{amount ? formatCurrency(amount) : '—'}</span>;
    },
  },
  {
    accessorKey: 'cancel_at_period_end',
    header: 'Cancels',
    cell: ({ row }) =>
      row.getValue('cancel_at_period_end') ? (
        <Badge variant='warning'>At period end</Badge>
      ) : (
        <span className='text-muted-foreground'>—</span>
      ),
  },
  {
    accessorKey: 'current_period_end',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Period End' />,
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {formatRelativeDate(row.getValue('current_period_end'))}
      </span>
    ),
  },
  {
    accessorKey: 'created',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created' />,
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>{formatRelativeDate(row.getValue('created'))}</span>
    ),
  },
];

const statusFilterOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Trialing', value: 'trialing' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Past Due', value: 'past_due' },
  { label: 'Paused', value: 'paused' },
  { label: 'Revoked', value: 'revoked' },
  { label: 'Unpaid', value: 'unpaid' },
];

interface SubscriptionTableProps {
  data: SubscriptionRow[];
}

export function SubscriptionTable({ data }: SubscriptionTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='user_email'
      searchPlaceholder='Search by email...'
      filterOptions={[
        { key: 'status', label: 'Status', options: statusFilterOptions },
      ]}
    />
  );
}
