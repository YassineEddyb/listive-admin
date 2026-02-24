import { Skeleton } from '@/components/ui/skeleton';

export default function ImagesLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <Skeleton className='h-8 w-40' />
        <Skeleton className='h-4 w-40' />
      </div>
      <div className='grid gap-4 sm:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-24 rounded-xl' />
        ))}
      </div>
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='overflow-hidden rounded-xl border'>
            <Skeleton className='aspect-square w-full' />
            <div className='space-y-2 p-3'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-3 w-32' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
