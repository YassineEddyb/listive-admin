'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Star } from 'lucide-react';
import Link from 'next/link';

import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';
import type { FeedbackRow } from '@/features/feedback/controllers/get-feedback';
import { formatRelativeDate } from '@/utils/format-relative-date';

const typeColors: Record<string, string> = {
  feature: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  bug: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  general: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
};

const columns: ColumnDef<FeedbackRow>[] = [
  {
    accessorKey: 'feedback_id',
    header: 'ID',
    cell: ({ row }) => (
      <span className='font-mono text-xs text-muted-foreground'>
        {row.getValue('feedback_id')}
      </span>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
    cell: ({ row }) => (
      <Link
        href={ROUTES.feedbackDetail(row.original.id)}
        className='max-w-[280px] truncate font-medium hover:text-brand-blue hover:underline'
      >
        {row.getValue('title')}
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
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue<string>('type');
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${typeColors[type] || ''}`}
        >
          {type}
        </span>
      );
    },
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
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => {
      const rating = row.getValue<number | null>('rating');
      if (!rating) return <span className='text-muted-foreground'>—</span>;
      return (
        <div className='flex items-center gap-0.5'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
            />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => (
      <Badge variant='default' className='capitalize'>
        {row.getValue('priority')}
      </Badge>
    ),
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
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Planned', value: 'planned' },
  { label: 'Implemented', value: 'implemented' },
  { label: 'Declined', value: 'declined' },
];

const typeFilterOptions = [
  { label: 'Feature Request', value: 'feature' },
  { label: 'Bug Report', value: 'bug' },
  { label: 'General', value: 'general' },
];

const priorityFilterOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

interface FeedbackTableProps {
  data: FeedbackRow[];
}

export function FeedbackTable({ data }: FeedbackTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='title'
      searchPlaceholder='Search feedback...'
      filterOptions={[
        { key: 'status', label: 'Status', options: statusFilterOptions },
        { key: 'type', label: 'Type', options: typeFilterOptions },
        { key: 'priority', label: 'Priority', options: priorityFilterOptions },
      ]}
    />
  );
}
