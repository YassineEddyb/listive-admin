import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center'>
      <div className='rounded-full bg-red-100 p-4'>
        <svg className='h-8 w-8 text-red-600' fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' />
        </svg>
      </div>
      <div>
        <h1 className='text-3xl font-bold text-brand-dark'>Access Denied</h1>
        <p className='mt-2 max-w-md text-muted-foreground'>
          You don&apos;t have admin access. Contact a super admin to get added to the admin panel.
        </p>
      </div>
      <Link
        href='/login'
        className='rounded-lg bg-brand-dark px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark/90'
      >
        Back to login
      </Link>
    </div>
  );
}
