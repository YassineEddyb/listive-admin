import { Users } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { ExportButton } from '@/components/export-button';
import { getUsers } from '@/features/users/controllers/get-users';
import { UsersTable } from '@/features/users/components/users-table';

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <PageHeader title='Users' description='All registered platform users' icon={Users} />
        <ExportButton
          data={users as any}
          filename='users'
          columns={[
            { key: 'email', label: 'Email' },
            { key: 'full_name', label: 'Name' },
            { key: 'subscription_status', label: 'Subscription' },
            { key: 'credit_balance', label: 'Credits' },
            { key: 'product_count', label: 'Products' },
            { key: 'created_at', label: 'Joined' },
          ]}
        />
      </div>
      <UsersTable data={users} />
    </div>
  );
}
