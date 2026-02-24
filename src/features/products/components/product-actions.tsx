'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import { deleteProduct, reQueueGeneration } from '@/features/products/actions/product-actions';

interface ProductActionsProps {
  productId: string;
  productName: string;
  adminId: string;
  generationStatus: string;
  failedImages: number;
}

export function ProductActions({
  productId,
  productName,
  adminId,
  generationStatus,
  failedImages,
}: ProductActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const showRequeue =
    generationStatus === 'failed' || generationStatus === 'partial' || failedImages > 0;

  async function handleRequeue() {
    setLoading(true);
    const result = await reQueueGeneration(productId, adminId);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Failed to re-queue');
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    const result = await deleteProduct(productId, adminId);
    if (result.success) {
      router.push('/admin/products');
    } else {
      alert(result.error || 'Failed to delete');
      setLoading(false);
    }
  }

  return (
    <div className='flex items-center gap-2'>
      {showRequeue && (
        <Button variant='outline' size='sm' onClick={handleRequeue} disabled={loading}>
          <RefreshCw className='mr-2 h-4 w-4' />
          Re-queue Generation
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant='destructive' size='sm' disabled={loading}>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Product
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete <strong>{productName}</strong> and all its images? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className='bg-destructive hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
