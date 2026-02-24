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
    <div className='flex h-screen overflow-hidden gap-4 p-4 bg-brand-surface'>
      {/* Sidebar — full height */}
      <div className='hidden w-64 shrink-0 lg:block'>
        <AdminSidebar />
      </div>

      {/* Right column: topnav + content */}
      <div className='flex flex-1 flex-col overflow-hidden gap-3'>
        <AdminTopnav adminEmail={adminUser.email} />

        {/* Page Content — overflow-hidden clips scrollbar inside rounded corners */}
        <main className='flex-1 overflow-hidden rounded-2xl bg-white/60 shadow-soft'>
          <div className='h-full overflow-y-auto px-6 pb-6 pt-0 custom-scrollbar [scrollbar-gutter:stable]'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
