import { type LucideIcon } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

export function StatCard({ title, value, description, icon: Icon, trend, className, style }: StatCardProps) {
  return (
    <Card className={cn('hover-lift', className)} style={style}>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='space-y-2'>
            <p className='text-sm font-medium text-muted-foreground'>{title}</p>
            <p className='text-3xl font-bold text-brand-dark'>{value}</p>
            {description && <p className='text-xs text-muted-foreground'>{description}</p>}
            {trend && (
              <p className={cn('text-xs font-medium', trend.value >= 0 ? 'text-green-600' : 'text-red-600')}>
                {trend.value >= 0 ? '+' : ''}
                {trend.value} {trend.label}
              </p>
            )}
          </div>
          {Icon && (
            <div className='rounded-xl bg-brand-light p-3'>
              <Icon className='h-5 w-5 text-brand-dark' />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
