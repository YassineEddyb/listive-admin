'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import type { AuditLogRow } from '@/features/audit/controllers/get-audit-log';
import { formatRelativeDate } from '@/utils/format-relative-date';

const actionLabels: Record<string, string> = {
  update_ticket_status: 'Update Ticket Status',
  update_feedback_status: 'Update Feedback Status',
  adjust_credits: 'Adjust Credits',
  update_user: 'Update User',
  ban_user: 'Ban User',
  unban_user: 'Unban User',
};

const targetTableLabels: Record<string, string> = {
  support_tickets: 'Support',
  feedback_submissions: 'Feedback',
  credit_transactions: 'Credits',
  users: 'Users',
  admin_users: 'Admins',
};

const columns: ColumnDef<AuditLogRow>[] = [
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Time' />,
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {new Date(row.getValue('created_at')).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'admin_email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Admin' />,
    cell: ({ row }) => (
      <span className='text-sm font-medium'>{row.getValue('admin_email')}</span>
    ),
  },
  {
    accessorKey: 'action_type',
    header: 'Action',
    cell: ({ row }) => {
      const action = row.getValue<string>('action_type');
      return (
        <Badge variant='default'>
          {actionLabels[action] || action}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value === undefined || row.getValue(id) === value;
    },
  },
  {
    accessorKey: 'target_table',
    header: 'Target',
    cell: ({ row }) => {
      const table = row.getValue<string>('target_table');
      return (
        <span className='text-sm text-muted-foreground'>
          {targetTableLabels[table] || table}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value === undefined || row.getValue(id) === value;
    },
  },
  {
    accessorKey: 'target_id',
    header: 'Target ID',
    cell: ({ row }) => (
      <span className='max-w-[140px] truncate font-mono text-xs text-muted-foreground'>
        {row.getValue('target_id')}
      </span>
    ),
  },
  {
    accessorKey: 'payload',
    header: 'Details',
    cell: ({ row }) => {
      const payload = row.getValue<Record<string, unknown> | null>('payload');
      if (!payload) return <span className='text-muted-foreground'>—</span>;
      return (
        <span className='max-w-[200px] truncate text-xs text-muted-foreground'>
          {JSON.stringify(payload)}
        </span>
      );
    },
  },
];

const actionFilterOptions = [
  { label: 'Adjust Credits', value: 'adjust_credits' },
  { label: 'Update Ticket', value: 'update_ticket_status' },
  { label: 'Update Feedback', value: 'update_feedback_status' },
  { label: 'Update User', value: 'update_user' },
];

const targetFilterOptions = [
  { label: 'Support', value: 'support_tickets' },
  { label: 'Feedback', value: 'feedback_submissions' },
  { label: 'Credits', value: 'credit_transactions' },
  { label: 'Users', value: 'users' },
];

interface AuditLogTableProps {
  data: AuditLogRow[];
}

export function AuditLogTable({ data }: AuditLogTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='admin_email'
      searchPlaceholder='Search by admin email...'
      filterOptions={[
        { key: 'action_type', label: 'Action', options: actionFilterOptions },
        { key: 'target_table', label: 'Target', options: targetFilterOptions },
      ]}
    />
  );
}
