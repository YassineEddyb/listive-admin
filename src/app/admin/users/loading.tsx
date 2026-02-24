import { Skeleton } from '@/components/ui/skeleton';

export default function UsersLoading() {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-1'>
        <Skeleton className='h-8 w-24' />
        <Skeleton className='h-4 w-52' />
      </div>

      {/* Search bar */}
      <div className='flex items-center justify-between gap-4'>
        <Skeleton className='h-10 w-72' />
        <Skeleton className='h-4 w-20' />
      </div>

      {/* Table */}
      <div className='overflow-hidden rounded-xl border border-brand-border bg-card'>
        {/* Header row */}
        <div className='flex gap-4 border-b border-brand-border p-4'>
          {[120, 80, 80, 60, 60, 60, 80].map((w, i) => (
            <Skeleton key={i} className='h-4' style={{ width: w }} />
          ))}
        </div>
        {/* Body rows */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className='flex gap-4 border-b border-brand-border/50 p-4'>
            {[120, 80, 80, 60, 60, 60, 80].map((w, j) => (
              <Skeleton key={j} className='h-4' style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
