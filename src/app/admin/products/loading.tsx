import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <Skeleton className='h-8 w-32' />
        <Skeleton className='h-4 w-52' />
      </div>
      <div className='rounded-md border'>
        <div className='border-b p-4'>
          <Skeleton className='h-8 w-64' />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='flex items-center gap-4 border-b p-4'>
            <Skeleton className='h-10 w-10 rounded-md' />
            <Skeleton className='h-4 w-36' />
            <Skeleton className='h-4 w-36' />
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-16' />
            <Skeleton className='h-4 w-24' />
          </div>
        ))}
      </div>
    </div>
  );
}
