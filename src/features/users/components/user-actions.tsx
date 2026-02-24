'use client';

import { Ban, KeyRound, ShieldOff, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { banUser, deleteUser, forcePasswordReset, unbanUser } from '@/features/users/actions/user-actions';

// ─── Ban User ────────────────────────────────────────────────────────
interface BanUserButtonProps {
  userId: string;
  adminId: string;
  isBanned?: boolean;
}

export function BanUserButton({ userId, adminId, isBanned }: BanUserButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  if (isBanned) {
    return (
      <Button
        variant='outline'
        size='sm'
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const result = await unbanUser(userId, adminId);
            if (result.success) {
              toast({ title: 'User unbanned' });
              router.refresh();
            } else {
              toast({ title: 'Failed to unban user', description: result.error, variant: 'destructive' });
            }
          });
        }}
      >
        <ShieldOff className='mr-1.5 h-4 w-4' />
        {isPending ? 'Unbanning...' : 'Unban User'}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          <Ban className='mr-1.5 h-4 w-4' />
          Ban User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            This will immediately invalidate all sessions and prevent the user from logging in.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='ban-reason'>Reason</Label>
            <Input
              id='ban-reason'
              placeholder='Reason for banning...'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              disabled={isPending || !reason.trim()}
              onClick={() => {
                startTransition(async () => {
                  const result = await banUser(userId, adminId, reason.trim());
                  if (result.success) {
                    toast({ title: 'User banned', description: 'All sessions have been invalidated.' });
                    setOpen(false);
                    router.refresh();
                  } else {
                    toast({ title: 'Failed to ban user', description: result.error, variant: 'destructive' });
                  }
                });
              }}
            >
              {isPending ? 'Banning...' : 'Confirm Ban'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Password Reset ──────────────────────────────────────────────────
interface PasswordResetButtonProps {
  userId: string;
  userEmail: string;
  adminId: string;
}

export function PasswordResetButton({ userId, userEmail, adminId }: PasswordResetButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <Button
      variant='outline'
      size='sm'
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const result = await forcePasswordReset(userId, userEmail, adminId);
          if (result.success) {
            toast({ title: 'Password reset sent', description: `Recovery email sent to ${userEmail}` });
          } else {
            toast({ title: 'Failed to send reset', description: result.error, variant: 'destructive' });
          }
        });
      }}
    >
      <KeyRound className='mr-1.5 h-4 w-4' />
      {isPending ? 'Sending...' : 'Reset Password'}
    </Button>
  );
}

// ─── Delete User ─────────────────────────────────────────────────────
interface DeleteUserButtonProps {
  userId: string;
  adminId: string;
}

export function DeleteUserButton({ userId, adminId }: DeleteUserButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const canDelete = confirmText === 'DELETE' && reason.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className='text-destructive hover:text-destructive'>
          <Trash2 className='mr-1.5 h-4 w-4' />
          Delete User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-destructive'>Delete User Permanently</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the user account and all
            associated data. Type <strong>DELETE</strong> to confirm.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='delete-reason'>Reason</Label>
            <Input
              id='delete-reason'
              placeholder='Reason for deletion...'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='delete-confirm'>Type DELETE to confirm</Label>
            <Input
              id='delete-confirm'
              placeholder='DELETE'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isPending}
              className='font-mono'
            />
          </div>
          <div className='flex justify-end gap-2'>
            <Button variant='outline' onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              disabled={isPending || !canDelete}
              onClick={() => {
                startTransition(async () => {
                  const result = await deleteUser(userId, adminId, reason.trim());
                  if (result.success) {
                    toast({ title: 'User deleted' });
                    setOpen(false);
                    router.push('/admin/users');
                  } else {
                    toast({ title: 'Failed to delete user', description: result.error, variant: 'destructive' });
                  }
                });
              }}
            >
              {isPending ? 'Deleting...' : 'Delete Permanently'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
