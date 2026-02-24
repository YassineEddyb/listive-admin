import { Skeleton } from '@/components/ui/skeleton';

export default function SystemLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <Skeleton className='h-8 w-40' />
        <Skeleton className='h-4 w-64' />
      </div>
      <div className='grid gap-4 sm:grid-cols-5'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-24 rounded-xl' />
        ))}
      </div>
      <div className='grid gap-6 lg:grid-cols-2'>
        <Skeleton className='h-40 rounded-xl' />
        <Skeleton className='h-40 rounded-xl' />
      </div>
      <Skeleton className='h-48 rounded-xl' />
    </div>
  );
}
