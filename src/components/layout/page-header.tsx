import Link from 'next/link';
import { ArrowLeft, type LucideIcon } from 'lucide-react';

import { cn } from '@/utils/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  backHref?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  backHref,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'sticky top-0 z-10 -mx-6 px-6 py-3 mb-6',
        'bg-white/90 backdrop-blur-md',
        'shadow-[0_1px_0_0_rgba(0,0,0,0.06)]',
        className
      )}
    >
      <div className='flex items-center justify-between gap-4'>
        {/* Left: back arrow + icon + title */}
        <div className='flex items-center gap-2.5 min-w-0'>
          {backHref && (
            <>
              <Link
                href={backHref}
                className='flex-shrink-0 text-muted-foreground hover:text-brand-dark transition-colors'
              >
                <ArrowLeft className='h-4 w-4' />
              </Link>
              <div className='h-4 w-px flex-shrink-0 bg-gray-200' />
            </>
          )}
          {Icon && (
            <Icon className='h-4 w-4 flex-shrink-0 text-brand-primary' />
          )}
          <div className='min-w-0'>
            <h1 className='truncate text-lg font-semibold leading-tight text-brand-dark'>
              {title}
            </h1>
            {description && (
              <p className='mt-0.5 text-xs text-muted-foreground'>{description}</p>
            )}
          </div>
        </div>

        {/* Right: action slot */}
        {children && (
          <div className='flex flex-shrink-0 items-center gap-2'>{children}</div>
        )}
      </div>
    </div>
  );
}

