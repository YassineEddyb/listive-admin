'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';
import type { TicketRow } from '@/features/support/controllers/get-tickets';
import { formatRelativeDate } from '@/utils/format-relative-date';

const priorityColors: Record<string, string> = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const columns: ColumnDef<TicketRow>[] = [
  {
    accessorKey: 'ticket_id',
    header: 'Ticket',
    cell: ({ row }) => (
      <Link
        href={ROUTES.ticketDetail(row.original.id)}
        className='font-mono text-sm font-medium text-brand-primary hover:underline'
      >
        {row.getValue('ticket_id')}
      </Link>
    ),
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Subject' />,
    cell: ({ row }) => (
      <div className='max-w-[300px] truncate font-medium'>
        {row.getValue('subject')}
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
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <Badge variant='default' className='capitalize'>
        {row.getValue('category')}
      </Badge>
    ),
    filterFn: (row, id, value) => {
      return value === undefined || row.getValue(id) === value;
    },
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
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = row.getValue<string>('priority');
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[priority] || ''}`}
        >
          {priority}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value === undefined || row.getValue(id) === value;
    },
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
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
];

const priorityFilterOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
];

const categoryFilterOptions = [
  { label: 'Technical', value: 'technical' },
  { label: 'Billing', value: 'billing' },
  { label: 'Feature', value: 'feature' },
  { label: 'Other', value: 'other' },
];

interface TicketTableProps {
  data: TicketRow[];
}

export function TicketTable({ data }: TicketTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='subject'
      searchPlaceholder='Search by subject...'
      filterOptions={[
        { key: 'status', label: 'Status', options: statusFilterOptions },
        { key: 'priority', label: 'Priority', options: priorityFilterOptions },
        { key: 'category', label: 'Category', options: categoryFilterOptions },
      ]}
    />
  );
}
