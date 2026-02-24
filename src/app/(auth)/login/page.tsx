'use client';

import { useState, useTransition } from 'react';
import { LayoutDashboard } from 'lucide-react';

import { signInWithEmailPassword } from '@/features/auth/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleEmailLogin = () => {
    setError(null);
    startTransition(async () => {
      const result = await signInWithEmailPassword(email, password);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-brand-surface px-4'>
      <div className='w-full max-w-sm space-y-8'>
        {/* Header */}
        <div className='flex flex-col items-center gap-3'>
          <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-brand-dark'>
            <LayoutDashboard className='h-6 w-6 text-white' />
          </div>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-brand-dark'>Listive Admin</h1>
            <p className='mt-1 text-sm text-muted-foreground'>Sign in with your admin account</p>
          </div>
        </div>

        {/* Login Form */}
        <div className='rounded-2xl bg-white p-6 shadow-soft'>
          <div className='space-y-4'>
            {/* Email/Password */}
            <div className='space-y-3'>
              <div className='space-y-1.5'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='admin@listive.app'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEmailLogin();
                  }}
                />
              </div>
            </div>

            {error && (
              <p className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600'>{error}</p>
            )}

            <Button className='w-full' onClick={handleEmailLogin} disabled={isPending}>
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </div>

        <p className='text-center text-xs text-muted-foreground'>
          Only authorized admin accounts can access this panel.
        </p>
      </div>
    </div>
  );
}
