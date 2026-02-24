'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { updateTicketStatus } from '@/features/support/actions/update-ticket-action';

const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Closed', value: 'closed' },
];

interface TicketStatusControlProps {
  ticketId: string;
  currentStatus: string;
}

export function TicketStatusControl({ ticketId, currentStatus }: TicketStatusControlProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      // We pass an empty adminUserId — the server action should ideally
      // get the admin user from the session, but for now we pass it
      // and the action logs it.
      const result = await updateTicketStatus({
        ticketId,
        status: newStatus,
        adminUserId: '', // TODO: pass from session
      });

      if (!result || result.error) {
        toast({ title: 'Error', description: result?.error ?? 'Unknown error', variant: 'destructive' });
      } else {
        toast({ title: 'Status updated', description: `Ticket status changed to ${newStatus}` });
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Update Status</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Select defaultValue={currentStatus} onValueChange={handleStatusChange} disabled={isPending}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isPending && (
          <p className='text-xs text-muted-foreground'>Updating…</p>
        )}
      </CardContent>
    </Card>
  );
}
