'use client';

import { useState } from 'react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { CreditAdjustmentForm } from '@/features/credits/components/credit-adjustment-form';

interface CreditBalance {
  user_id: string;
  email: string;
  credits: number;
}

interface CreditBalancesTableProps {
  data: CreditBalance[];
  adminId: string;
}

export function CreditBalancesTable({ data, adminId }: CreditBalancesTableProps) {
  const [search, setSearch] = useState('');
  const [adjustingUser, setAdjustingUser] = useState<CreditBalance | null>(null);

  const filtered = data.filter((u) => u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className='space-y-4'>
      <Input
        placeholder='Search by email...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='max-w-sm'
      />

      {adjustingUser && (
        <Card className='border-brand-blue/30 bg-brand-blue/5'>
          <CardContent className='pt-6'>
            <CreditAdjustmentForm
              userId={adjustingUser.user_id}
              userEmail={adjustingUser.email}
              currentBalance={adjustingUser.credits}
              adminUserId={adminId}
              onSuccess={() => setAdjustingUser(null)}
            />
            <Button variant='ghost' size='sm' className='mt-2' onClick={() => setAdjustingUser(null)}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      <div className='rounded-lg border'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b bg-muted/50'>
              <th className='px-4 py-3 text-left font-medium'>Email</th>
              <th className='px-4 py-3 text-right font-medium'>Balance</th>
              <th className='px-4 py-3 text-right font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map((u) => (
              <tr key={u.user_id} className='border-b last:border-0'>
                <td className='px-4 py-3'>
                  <Link href={ROUTES.userDetail(u.user_id)} className='text-brand-blue hover:underline'>
                    {u.email}
                  </Link>
                </td>
                <td className='px-4 py-3 text-right'>
                  <Badge variant={u.credits > 0 ? 'success' : 'destructive'} className='tabular-nums'>
                    {u.credits.toLocaleString()}
                  </Badge>
                </td>
                <td className='px-4 py-3 text-right'>
                  <Button variant='outline' size='sm' onClick={() => setAdjustingUser(u)}>
                    Adjust
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className='px-4 py-8 text-center text-muted-foreground'>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > 50 && (
        <p className='text-xs text-muted-foreground'>Showing first 50 of {filtered.length} results</p>
      )}
    </div>
  );
}
