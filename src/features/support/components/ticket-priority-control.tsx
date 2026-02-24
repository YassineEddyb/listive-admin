'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { updateTicketPriority } from '@/features/support/actions/ticket-reply-action';

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
];

interface TicketPriorityControlProps {
  ticketId: string;
  currentPriority: string;
}

export function TicketPriorityControl({ ticketId, currentPriority }: TicketPriorityControlProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handlePriorityChange(newPriority: string) {
    if (newPriority === currentPriority) return;

    startTransition(async () => {
      const result = await updateTicketPriority({
        ticketId,
        priority: newPriority,
        adminUserId: '',
      });

      if (!result || result.error) {
        toast({ title: 'Error', description: result?.error ?? 'Unknown error', variant: 'destructive' });
      } else {
        toast({ title: 'Priority updated', description: `Ticket priority changed to ${newPriority}` });
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Update Priority</CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <Select defaultValue={currentPriority} onValueChange={handlePriorityChange} disabled={isPending}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isPending && <p className='text-xs text-muted-foreground'>Updating…</p>}
      </CardContent>
    </Card>
  );
}
