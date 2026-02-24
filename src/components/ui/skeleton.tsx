import { cn } from '@/utils/cn';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md', className)}
      style={{ backgroundColor: 'rgba(55, 71, 82, .2)' }}
      {...props}
    />
  );
}

export { Skeleton };
