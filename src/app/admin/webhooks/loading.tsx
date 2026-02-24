import { Skeleton } from '@/components/ui/skeleton';

export default function WebhooksLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <Skeleton className='h-8 w-44' />
        <Skeleton className='h-4 w-48' />
      </div>
      <div className='rounded-md border'>
        <div className='border-b p-4'>
          <Skeleton className='h-8 w-64' />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='flex items-center gap-4 border-b p-4'>
            <Skeleton className='h-4 w-40' />
            <Skeleton className='h-5 w-32' />
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-8 w-16' />
          </div>
        ))}
      </div>
    </div>
  );
}
