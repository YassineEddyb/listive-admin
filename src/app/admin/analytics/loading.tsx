import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsLoading() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-1'>
        <Skeleton className='h-8 w-32' />
        <Skeleton className='h-4 w-64' />
      </div>

      {/* Charts grid */}
      <div className='grid gap-6 md:grid-cols-2'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='rounded-lg border bg-card p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-4 w-20' />
            </div>
            <Skeleton className='h-[200px] w-full' />
          </div>
        ))}
      </div>
    </div>
  );
}
