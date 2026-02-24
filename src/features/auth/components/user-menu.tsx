'use client';

import { LogOut, User } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { signOut } from '@/features/auth/actions/auth-actions';

interface UserMenuProps {
  email: string;
}

function getInitials(email: string): string {
  const name = email.split('@')[0];
  if (name.includes('.')) {
    const parts = name.split('.');
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function UserMenu({ email }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-9 items-center gap-2.5 rounded-xl px-2.5 hover:bg-brand-light'
        >
          {/* Avatar */}
          <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-brand-dark'>
            <span className='text-[11px] font-semibold text-white leading-none'>
              {getInitials(email)}
            </span>
          </div>
          {/* Email — hide on small screens */}
          <span className='hidden text-sm font-medium text-brand-dark sm:block max-w-[160px] truncate'>
            {email}
          </span>
          <svg
            className='h-3.5 w-3.5 text-brand-gray'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
          </svg>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='flex items-center gap-2 py-2'>
          <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-dark'>
            <span className='text-[11px] font-semibold text-white leading-none'>
              {getInitials(email)}
            </span>
          </div>
          <div className='min-w-0'>
            <p className='text-xs font-medium text-foreground truncate'>{email}</p>
            <p className='text-[10px] text-muted-foreground'>Admin</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className='gap-2 text-destructive focus:text-destructive cursor-pointer'
          onSelect={async () => {
            await signOut();
          }}
        >
          <LogOut className='h-4 w-4' />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
