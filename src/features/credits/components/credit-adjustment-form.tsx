'use client';

import { Minus, Plus } from 'lucide-react';
import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { adjustCredits } from '@/features/credits/actions/adjust-credits-action';

interface CreditAdjustmentFormProps {
  userId: string;
  userEmail: string;
  currentBalance: number;
  adminUserId: string;
  onSuccess?: () => void;
}

export function CreditAdjustmentForm({
  userId,
  userEmail,
  currentBalance,
  adminUserId,
  onSuccess,
}: CreditAdjustmentFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState<'add' | 'deduct'>('add');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({ title: 'Invalid amount', description: 'Please enter a positive number.', variant: 'destructive' });
      return;
    }

    if (!description.trim()) {
      toast({ title: 'Description required', description: 'Please provide a reason for the adjustment.', variant: 'destructive' });
      return;
    }

    startTransition(async () => {
      const result = await adjustCredits({
        userId,
        amount: mode === 'add' ? numAmount : -numAmount,
        description: description.trim(),
        adminUserId,
      });

      if (!result || result.error) {
        toast({ title: 'Error', description: result?.error ?? 'Unknown error', variant: 'destructive' });
      } else {
        toast({
          title: 'Credits adjusted',
          description: `${mode === 'add' ? 'Added' : 'Deducted'} ${numAmount} credits. New balance: ${result.data?.newBalance}`,
        });
        setAmount('');
        setDescription('');
        onSuccess?.();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='flex items-center gap-2 text-sm'>
        <span className='text-muted-foreground'>User:</span>
        <span className='font-medium'>{userEmail}</span>
        <span className='text-muted-foreground'>•</span>
        <span className='text-muted-foreground'>Balance:</span>
        <span className='font-bold tabular-nums'>{currentBalance.toLocaleString()}</span>
      </div>

      {/* Mode toggle */}
      <div className='flex gap-2'>
        <Button
          type='button'
          variant={mode === 'add' ? 'default' : 'outline'}
          size='sm'
          onClick={() => setMode('add')}
        >
          <Plus className='mr-1 h-4 w-4' />
          Add
        </Button>
        <Button
          type='button'
          variant={mode === 'deduct' ? 'destructive' : 'outline'}
          size='sm'
          onClick={() => setMode('deduct')}
        >
          <Minus className='mr-1 h-4 w-4' />
          Deduct
        </Button>
      </div>

      <div className='grid gap-3 sm:grid-cols-2'>
        <div>
          <Label htmlFor='amount'>Amount</Label>
          <Input
            id='amount'
            type='number'
            min='1'
            placeholder='e.g. 100'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor='description'>Reason</Label>
          <Input
            id='description'
            placeholder='e.g. Compensation for bug'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      </div>

      <Button type='submit' disabled={isPending} variant={mode === 'deduct' ? 'destructive' : 'default'}>
        {isPending ? 'Processing...' : `${mode === 'add' ? 'Add' : 'Deduct'} Credits`}
      </Button>
    </form>
  );
}
