import { LogOut } from 'lucide-react';

import { signOut } from '@/features/auth/actions/auth-actions';
import { GlobalSearch } from '@/features/search/components/global-search';

import { Button } from '../ui/button';

interface AdminTopnavProps {
  adminEmail?: string | null;
}

async function handleSignOut() {
  'use server';
  await signOut();
}

export function AdminTopnav({ adminEmail }: AdminTopnavProps) {
  return (
    <header className='flex h-14 items-center justify-between bg-transparent px-6'>
      <GlobalSearch />
      <div className='flex items-center gap-4'>
        {adminEmail && <span className='text-sm text-muted-foreground'>{adminEmail}</span>}
        <form action={handleSignOut}>
          <Button variant='ghost' size='sm' type='submit' className='gap-2 text-muted-foreground'>
            <LogOut size={16} />
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
