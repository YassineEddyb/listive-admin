'use client';

import { Mail } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { sendEmailToUser } from '@/features/users/actions/send-email';

interface SendEmailDialogProps {
  userId: string;
  userEmail: string;
  adminId: string;
}

export function SendEmailDialog({ userId, userEmail, adminId }: SendEmailDialogProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast({ title: 'Subject required', variant: 'destructive' });
      return;
    }
    if (!message.trim()) {
      toast({ title: 'Message required', variant: 'destructive' });
      return;
    }

    startTransition(async () => {
      const result = await sendEmailToUser({
        userId,
        userEmail,
        subject: subject.trim(),
        message: message.trim(),
        adminId,
      });

      if (result.success) {
        toast({ title: 'Email sent', description: `Email sent to ${userEmail}` });
        setSubject('');
        setMessage('');
        setOpen(false);
      } else {
        toast({ title: 'Failed to send email', description: result.error, variant: 'destructive' });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Mail className='mr-1.5 h-4 w-4' />
          Send Email
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Send Email to User</DialogTitle>
          <DialogDescription>Send an email to {userEmail} from Listive Admin.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email-subject'>Subject</Label>
            <Input
              id='email-subject'
              placeholder='Email subject...'
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email-message'>Message</Label>
            <Textarea
              id='email-message'
              placeholder='Write your message...'
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
