'use client';

import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { replyToTicket } from '@/features/support/actions/ticket-reply-action';

interface TicketReplyFormProps {
  ticketId: string;
  adminUserId: string;
}

export function TicketReplyForm({ ticketId, adminUserId }: TicketReplyFormProps) {
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    startTransition(async () => {
      const result = await replyToTicket({
        ticketId,
        message: message.trim(),
        adminUserId,
      });

      if (!result || result.error) {
        toast({ title: 'Error', description: result?.error ?? 'Failed to send reply', variant: 'destructive' });
      } else {
        toast({ title: 'Reply sent', description: 'Your reply has been added to the ticket.' });
        setMessage('');
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3'>
      <Textarea
        placeholder='Write your reply...'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        className='resize-none'
        required
      />
      <div className='flex justify-end'>
        <Button type='submit' size='sm' disabled={isPending || !message.trim()}>
          <Send className='mr-1 h-4 w-4' />
          {isPending ? 'Sending...' : 'Send Reply'}
        </Button>
      </div>
    </form>
  );
}
