import type { LucideIcon } from 'lucide-react';

import { cn } from '@/utils/cn';

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, icon: Icon, children, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className='flex items-center gap-3'>
        {Icon && (
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10'>
            <Icon className='h-5 w-5 text-brand-primary' />
          </div>
        )}
        <div>
          <h1 className='text-2xl font-bold text-brand-dark'>{title}</h1>
          {description && <p className='mt-1 text-sm text-muted-foreground'>{description}</p>}
        </div>
      </div>
      {children && <div className='flex items-center gap-2'>{children}</div>}
    </div>
  );
}
