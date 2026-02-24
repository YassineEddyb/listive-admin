import { PropsWithChildren } from 'react';
import { redirect } from 'next/navigation';

import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminTopnav } from '@/components/layout/admin-topnav';
import { getAdminUser } from '@/features/auth/controllers/get-admin-user';
import { getSession } from '@/features/auth/controllers/get-session';

export default async function AdminLayout({ children }: PropsWithChildren) {
  const session = await getSession();

  // Auth guard: redirect to login if not authenticated
  if (!session) {
    redirect('/login');
  }

  // Admin guard: check if user has admin access
  const adminUser = await getAdminUser(session.id);

  if (!adminUser) {
    console.error(
      '[AdminLayout] User is authenticated but NOT in admin_users table.',
      '\n  auth user id:', session.id,
      '\n  auth email:', session.email,
      '\n  Ensure admin_users.user_id matches auth.users.id (not users.id).'
    );
    redirect('/unauthorized');
  }

  return (
    <div className='flex h-screen flex-col overflow-hidden bg-brand-surface'>
      {/* Top Navigation */}
      <AdminTopnav adminEmail={adminUser.email} />

      {/* Main Content Area */}
      <div className='flex flex-1 gap-4 overflow-hidden px-4 pb-4'>
        {/* Sidebar */}
        <div className='hidden w-64 shrink-0 lg:block'>
          <AdminSidebar />
        </div>

        {/* Page Content */}
        <main className='flex-1 overflow-y-auto rounded-2xl bg-white p-6 shadow-soft custom-scrollbar'>
          {children}
        </main>
      </div>
    </div>
  );
}
