'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

import { DataTable, DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { WebhookEventRow } from '@/features/webhooks/controllers/get-webhooks';

const columns: ColumnDef<WebhookEventRow>[] = [
  {
    accessorKey: 'id',
    header: 'Webhook ID',
    cell: ({ row }) => (
      <span className='max-w-[180px] truncate font-mono text-xs'>
        {row.getValue('id')}
      </span>
    ),
  },
  {
    accessorKey: 'event_type',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Event Type' />,
    cell: ({ row }) => (
      <Badge variant='default'>{row.getValue('event_type')}</Badge>
    ),
    filterFn: (row, id, value) => {
      return value === undefined || row.getValue(id) === value;
    },
  },
  {
    accessorKey: 'processed_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Processed' />,
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {new Date(row.getValue('processed_at')).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Received' />,
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {new Date(row.getValue('created_at')).toLocaleString()}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <PayloadButton payload={row.original.payload} />
    ),
  },
];

function PayloadButton({ payload }: { payload: Record<string, unknown> | null }) {
  const [open, setOpen] = useState(false);

  if (!payload) return <span className='text-muted-foreground'>—</span>;

  return (
    <>
      <Button variant='ghost' size='sm' onClick={() => setOpen(true)}>
        View
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-h-[80vh] max-w-2xl overflow-auto'>
          <DialogHeader>
            <DialogTitle>Webhook Payload</DialogTitle>
            <DialogDescription>Raw JSON payload from Polar</DialogDescription>
          </DialogHeader>
          <pre className='overflow-auto rounded-lg bg-muted p-4 text-xs'>
            {JSON.stringify(payload, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>
    </>
  );
}

const eventTypeOptions = [
  { label: 'checkout.created', value: 'checkout.created' },
  { label: 'checkout.updated', value: 'checkout.updated' },
  { label: 'subscription.created', value: 'subscription.created' },
  { label: 'subscription.updated', value: 'subscription.updated' },
  { label: 'subscription.revoked', value: 'subscription.revoked' },
  { label: 'order.created', value: 'order.created' },
];

interface WebhookTableProps {
  data: WebhookEventRow[];
}

export function WebhookTable({ data }: WebhookTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='event_type'
      searchPlaceholder='Search event types...'
      filterOptions={[
        { key: 'event_type', label: 'Event', options: eventTypeOptions },
      ]}
    />
  );
}
