import { Skeleton } from '@/components/ui/skeleton';

export default function AuditLogLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <Skeleton className='h-8 w-36' />
        <Skeleton className='h-4 w-52' />
      </div>

      <div className='rounded-md border'>
        <div className='border-b p-4'>
          <div className='flex gap-3'>
            <Skeleton className='h-8 w-64' />
            <Skeleton className='h-8 w-28' />
            <Skeleton className='h-8 w-28' />
          </div>
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className='flex items-center gap-4 border-b p-4'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-4 w-36' />
            <Skeleton className='h-5 w-28' />
            <Skeleton className='h-4 w-20' />
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-40' />
          </div>
        ))}
      </div>
    </div>
  );
}
