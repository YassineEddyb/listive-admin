'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cancelStaleOperations, cleanupOldOperations } from '@/features/system/actions/system-actions';

interface SystemOperationsProps {
  adminId: string;
  staleCount: number;
}

export function SystemOperations({ adminId, staleCount }: SystemOperationsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCancelStale() {
    setLoading(true);
    setMessage(null);
    const result = await cancelStaleOperations(adminId);
    if (result.success) {
      setMessage(`Canceled ${result.count} stale operations.`);
      router.refresh();
    } else {
      setMessage(result.error || 'Failed');
    }
    setLoading(false);
  }

  async function handleCleanup() {
    setLoading(true);
    setMessage(null);
    const result = await cleanupOldOperations(adminId);
    if (result.success) {
      setMessage(`Cleaned up ${result.count} old operations.`);
      router.refresh();
    } else {
      setMessage(result.error || 'Failed');
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-base'>
          <AlertTriangle className='h-4 w-4 text-amber-500' />
          System Operations
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-wrap gap-3'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='outline' size='sm' disabled={loading || staleCount === 0}>
                <RefreshCw className='mr-2 h-4 w-4' />
                Cancel Stale Operations ({staleCount})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Stale Operations</AlertDialogTitle>
                <AlertDialogDescription>
                  Cancel all {staleCount} operations that have been stuck processing for more than 1 hour?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelStale}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='outline' size='sm' disabled={loading}>
                <Trash2 className='mr-2 h-4 w-4' />
                Cleanup Old Operations
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cleanup Old Operations</AlertDialogTitle>
                <AlertDialogDescription>
                  Delete all completed and canceled operations older than 30 days? This frees up database space
                  but the data cannot be recovered.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCleanup}>Confirm</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {message && (
          <p className='text-sm text-muted-foreground'>{message}</p>
        )}
      </CardContent>
    </Card>
  );
}
