'use client';

import { XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  cancelSubscription,
  revokeSubscription,
} from '@/features/subscriptions/actions/subscription-actions';

interface SubscriptionActionsProps {
  subscriptionId: string;
  userId: string;
  adminId: string;
  status: string;
  cancelAtPeriodEnd?: boolean;
}

export function SubscriptionActions({
  subscriptionId,
  userId,
  adminId,
  status,
  cancelAtPeriodEnd,
}: SubscriptionActionsProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  // Only show for active subscriptions
  const isActive = status === 'active' || status === 'trialing';
  if (!isActive && !cancelAtPeriodEnd) return null;

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelSubscription(subscriptionId, userId, adminId);
      if (result.success) {
        toast({ title: 'Subscription canceled', description: 'Will end at the current billing period.' });
        setOpen(false);
        router.refresh();
      } else {
        toast({ title: 'Failed to cancel', description: result.error, variant: 'destructive' });
      }
    });
  };

  const handleRevoke = () => {
    startTransition(async () => {
      const result = await revokeSubscription(subscriptionId, userId, adminId);
      if (result.success) {
        toast({ title: 'Subscription revoked', description: 'Subscription ended immediately.' });
        setOpen(false);
        router.refresh();
      } else {
        toast({ title: 'Failed to revoke', description: result.error, variant: 'destructive' });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          <XCircle className='mr-1.5 h-4 w-4' />
          {cancelAtPeriodEnd ? 'Revoke Now' : 'Cancel Subscription'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>
            Choose how to cancel this subscription for the user.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          {!cancelAtPeriodEnd && (
            <div className='rounded-lg border p-4 space-y-2'>
              <h4 className='font-medium text-sm'>Cancel at period end</h4>
              <p className='text-xs text-muted-foreground'>
                The subscription will remain active until the current billing period ends. The user keeps access until then.
              </p>
              <Button
                variant='outline'
                size='sm'
                disabled={isPending}
                onClick={handleCancel}
                className='w-full'
              >
                {isPending ? 'Canceling...' : 'Cancel at Period End'}
              </Button>
            </div>
          )}

          <div className='rounded-lg border border-destructive/30 p-4 space-y-2'>
            <h4 className='font-medium text-sm text-destructive'>Revoke immediately</h4>
            <p className='text-xs text-muted-foreground'>
              End the subscription right now. The user loses access immediately. This cannot be undone.
            </p>
            <Button
              variant='destructive'
              size='sm'
              disabled={isPending}
              onClick={handleRevoke}
              className='w-full'
            >
              {isPending ? 'Revoking...' : 'Revoke Immediately'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
