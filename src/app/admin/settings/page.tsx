import { Settings } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { getSession } from '@/features/auth/controllers/get-session';
import { getAdminUsers } from '@/features/settings/controllers/get-admin-users';
import { AdminUsersManager } from '@/features/settings/components/admin-users-manager';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Settings | Admin' };

export default async function SettingsPage() {
  const [session, adminUsers] = await Promise.all([getSession(), getAdminUsers()]);

  if (!session) {
    redirect('/login');
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Admin Settings'
        description='Manage admin users and system configuration.'
        icon={Settings}
      />

      <AdminUsersManager adminUsers={adminUsers} currentAdminId={session.id} />
    </div>
  );
}
