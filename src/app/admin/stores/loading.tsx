import { Skeleton } from '@/components/ui/skeleton';

export default function StoresLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <Skeleton className='h-8 w-52' />
        <Skeleton className='h-4 w-56' />
      </div>
      <div className='grid gap-4 sm:grid-cols-5'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-24 rounded-xl' />
        ))}
      </div>
      <Skeleton className='h-10 w-52' />
      <div className='rounded-md border'>
        <div className='border-b p-4'>
          <Skeleton className='h-8 w-64' />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='flex items-center gap-4 border-b p-4'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-36' />
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-4 w-12' />
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-24' />
          </div>
        ))}
      </div>
    </div>
  );
}
