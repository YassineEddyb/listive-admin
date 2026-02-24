import { Skeleton } from '@/components/ui/skeleton';

export default function UserDetailLoading() {
  return (
    <div className='space-y-6'>
      {/* Back button */}
      <Skeleton className='h-8 w-32' />

      {/* Header */}
      <div className='space-y-1'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-64' />
      </div>

      {/* 3 cards */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        {[...Array(3)].map((_, i) => (
          <div key={i} className='rounded-xl border border-brand-border bg-card p-6'>
            <Skeleton className='mb-4 h-4 w-24' />
            <div className='space-y-3'>
              {[...Array(4)].map((_, j) => (
                <div key={j} className='flex justify-between'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-4 w-32' />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Products table */}
      <div className='rounded-xl border border-brand-border bg-card p-6'>
        <Skeleton className='mb-4 h-5 w-32' />
        <div className='space-y-3'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='flex justify-between'>
              <Skeleton className='h-4 w-48' />
              <Skeleton className='h-4 w-24' />
            </div>
          ))}
        </div>
      </div>

      {/* Transactions table */}
      <div className='rounded-xl border border-brand-border bg-card p-6'>
        <Skeleton className='mb-4 h-5 w-48' />
        <div className='space-y-3'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='flex gap-4'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-12' />
              <Skeleton className='h-4 w-40' />
              <Skeleton className='h-4 w-24' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
