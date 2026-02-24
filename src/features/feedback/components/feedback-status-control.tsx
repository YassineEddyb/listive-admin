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
import { updateFeedbackStatus } from '@/features/feedback/actions/update-feedback-action';

const statusOptions = [
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Planned', value: 'planned' },
  { label: 'Implemented', value: 'implemented' },
  { label: 'Declined', value: 'declined' },
];

interface FeedbackStatusControlProps {
  feedbackId: string;
  currentStatus: string;
}

export function FeedbackStatusControl({ feedbackId, currentStatus }: FeedbackStatusControlProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      const result = await updateFeedbackStatus({
        feedbackId,
        status: newStatus,
        adminUserId: '',
      });

      if (!result || result.error) {
        toast({ title: 'Error', description: result?.error ?? 'Unknown error', variant: 'destructive' });
      } else {
        toast({ title: 'Status updated', description: `Feedback status changed to ${newStatus.replace('_', ' ')}` });
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
        {isPending && <p className='text-xs text-muted-foreground'>Updating…</p>}
      </CardContent>
    </Card>
  );
}
