import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className='space-y-8'>
      {/* Header skeleton */}
      <div className='space-y-1'>
        <Skeleton className='h-8 w-40' />
        <Skeleton className='h-4 w-64' />
      </div>

      {/* KPI cards row 1 */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='rounded-xl border border-brand-border bg-card p-6'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-8 w-8 rounded-lg' />
            </div>
            <Skeleton className='mt-3 h-8 w-20' />
            <Skeleton className='mt-2 h-3 w-32' />
          </div>
        ))}
      </div>

      {/* KPI cards row 2 */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='rounded-xl border border-brand-border bg-card p-6'>
            <div className='flex items-center justify-between'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-8 w-8 rounded-lg' />
            </div>
            <Skeleton className='mt-3 h-8 w-20' />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {[...Array(2)].map((_, i) => (
          <div key={i} className='rounded-xl border border-brand-border bg-card p-6'>
            <Skeleton className='mb-4 h-5 w-40' />
            <Skeleton className='h-[250px] w-full rounded-lg' />
          </div>
        ))}
      </div>
    </div>
  );
}
