import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center'>
      <h1 className='text-6xl font-bold text-brand-dark'>404</h1>
      <h2 className='text-2xl font-semibold text-brand-dark'>Page not found</h2>
      <p className='max-w-md text-muted-foreground'>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href='/admin'
        className='mt-4 rounded-lg bg-brand-dark px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark/90'
      >
        Back to dashboard
      </Link>
    </div>
  );
}
