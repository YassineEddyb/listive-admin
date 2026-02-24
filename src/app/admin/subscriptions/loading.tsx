import { Skeleton } from '@/components/ui/skeleton';

export default function SubscriptionsLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <Skeleton className='h-8 w-40' />
        <Skeleton className='h-4 w-52' />
      </div>
      <div className='flex items-center justify-between gap-4'>
        <Skeleton className='h-10 w-72' />
        <Skeleton className='h-10 w-40' />
      </div>
      <div className='overflow-hidden rounded-xl border border-brand-border bg-card'>
        <div className='flex gap-4 border-b border-brand-border p-4'>
          {[120, 80, 70, 60, 70, 80, 80].map((w, i) => (
            <Skeleton key={i} className='h-4' style={{ width: w }} />
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='flex gap-4 border-b border-brand-border/50 p-4'>
            {[120, 80, 70, 60, 70, 80, 80].map((w, j) => (
              <Skeleton key={j} className='h-4' style={{ width: w }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
