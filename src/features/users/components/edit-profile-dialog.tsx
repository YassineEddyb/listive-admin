'use client';

import { Pencil } from 'lucide-react';
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
import { updateUserProfile } from '@/features/users/actions/update-profile-action';

interface EditProfileDialogProps {
  userId: string;
  currentName: string;
  onboardingCompleted: boolean;
  adminId: string;
}

export function EditProfileDialog({
  userId,
  currentName,
  onboardingCompleted,
  adminId,
}: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [onboarded, setOnboarded] = useState(onboardingCompleted);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const result = await updateUserProfile({
        userId,
        fullName: name,
        onboardingCompleted: onboarded,
        adminUserId: adminId,
      });

      if (!result || result.error) {
        toast({ title: 'Error', description: result?.error ?? 'Failed to update profile', variant: 'destructive' });
      } else {
        toast({ title: 'Profile updated', description: 'User profile has been updated.' });
        setOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Pencil className='mr-1 h-4 w-4' />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>Update the user&apos;s profile information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='name'>Full Name</Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter full name'
            />
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='onboarded'
              checked={onboarded}
              onChange={(e) => setOnboarded(e.target.checked)}
              className='h-4 w-4 rounded border-gray-300'
            />
            <Label htmlFor='onboarded'>Onboarding Completed</Label>
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
