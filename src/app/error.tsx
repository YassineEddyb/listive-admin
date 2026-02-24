'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center'>
      <h1 className='text-4xl font-bold text-brand-dark'>Something went wrong</h1>
      <p className='max-w-md text-muted-foreground'>An unexpected error occurred.</p>
      <button
        onClick={reset}
        className='mt-4 rounded-lg bg-brand-dark px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark/90'
      >
        Try again
      </button>
    </div>
  );
}
