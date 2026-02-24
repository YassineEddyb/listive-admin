'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ROUTES } from '@/constants/routes';
import type { AdminUserRow } from '@/features/users/controllers/get-users';
import { formatRelativeDate } from '@/utils/format-relative-date';

const columns: ColumnDef<AdminUserRow>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button variant='ghost' size='sm' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Email
        <ArrowUpDown className='ml-1 h-3.5 w-3.5' />
      </Button>
    ),
    cell: ({ row }) => (
      <Link
        href={ROUTES.userDetail(row.original.user_id)}
        className='font-medium text-brand-primary hover:underline'
      >
        {row.getValue('email')}
      </Link>
    ),
  },
  {
    accessorKey: 'full_name',
    header: 'Name',
    cell: ({ row }) => row.getValue('full_name') || <span className='text-muted-foreground'>—</span>,
  },
  {
    accessorKey: 'subscription_status',
    header: 'Subscription',
    cell: ({ row }) => {
      const status = row.getValue('subscription_status') as string | null;
      const plan = row.original.plan_name;
      if (!status) return <span className='text-muted-foreground text-xs'>None</span>;
      return (
        <div className='flex flex-col gap-0.5'>
          <Badge variant={status as 'active' | 'trialing' | 'canceled'}>{status}</Badge>
          {plan && <span className='text-xs text-muted-foreground'>{plan}</span>}
        </div>
      );
    },
  },
  {
    accessorKey: 'credit_balance',
    header: ({ column }) => (
      <Button variant='ghost' size='sm' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Credits
        <ArrowUpDown className='ml-1 h-3.5 w-3.5' />
      </Button>
    ),
    cell: ({ row }) => <span className='tabular-nums'>{row.getValue<number>('credit_balance').toLocaleString()}</span>,
  },
  {
    accessorKey: 'product_count',
    header: ({ column }) => (
      <Button variant='ghost' size='sm' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Products
        <ArrowUpDown className='ml-1 h-3.5 w-3.5' />
      </Button>
    ),
    cell: ({ row }) => <span className='tabular-nums'>{row.getValue<number>('product_count')}</span>,
  },
  {
    accessorKey: 'onboarding_completed',
    header: 'Onboarded',
    cell: ({ row }) => (
      <Badge variant={row.getValue('onboarding_completed') ? 'success' : 'outline'}>
        {row.getValue('onboarding_completed') ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <Button variant='ghost' size='sm' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Joined
        <ArrowUpDown className='ml-1 h-3.5 w-3.5' />
      </Button>
    ),
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>{formatRelativeDate(row.getValue('created_at'))}</span>
    ),
  },
];

interface UsersTableProps {
  data: AdminUserRow[];
}

export function UsersTable({ data }: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  return (
    <div className='space-y-4'>
      {/* Search & Count */}
      <div className='flex items-center justify-between gap-4'>
        <div className='relative max-w-sm flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search users...'
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className='pl-9'
          />
        </div>
        <span className='text-sm text-muted-foreground'>
          {table.getFilteredRowModel().rows.length} user{table.getFilteredRowModel().rows.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className='overflow-hidden rounded-xl border border-brand-border bg-card'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center text-muted-foreground'>
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className='flex items-center justify-between'>
        <span className='text-sm text-muted-foreground'>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className='mr-1 h-4 w-4' />
            Previous
          </Button>
          <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
            <ChevronRight className='ml-1 h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
