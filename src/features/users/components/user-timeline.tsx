'use client';

import {
  CreditCard,
  Edit,
  Image,
  MessageSquare,
  Package,
  Store,
  TicketCheck,
} from 'lucide-react';

import { StatusBadge } from '@/components/status-badge';
import type { TimelineEvent } from '@/features/users/controllers/get-user-timeline';
import { formatRelativeDate } from '@/utils/format-relative-date';

const typeIcons: Record<TimelineEvent['type'], typeof Package> = {
  product: Package,
  image_edit: Edit,
  credit: CreditCard,
  listing: Store,
  ticket: TicketCheck,
  feedback: MessageSquare,
};

const typeColors: Record<TimelineEvent['type'], string> = {
  product: 'bg-blue-50 text-blue-600',
  image_edit: 'bg-violet-50 text-violet-600',
  credit: 'bg-emerald-50 text-emerald-600',
  listing: 'bg-orange-50 text-orange-600',
  ticket: 'bg-rose-50 text-rose-600',
  feedback: 'bg-amber-50 text-amber-600',
};

interface UserTimelineProps {
  events: TimelineEvent[];
}

export function UserTimeline({ events }: UserTimelineProps) {
  if (events.length === 0) {
    return (
      <p className='text-sm text-muted-foreground'>No activity recorded for this user.</p>
    );
  }

  return (
    <div className='relative space-y-0'>
      {/* Timeline line */}
      <div className='absolute left-4 top-2 bottom-2 w-px bg-border' />

      {events.map((event) => {
        const Icon = typeIcons[event.type];
        const colorClass = typeColors[event.type];

        return (
          <div key={event.id} className='relative flex items-start gap-3 py-2 pl-0'>
            <div
              className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${colorClass}`}
            >
              <Icon className='h-3.5 w-3.5' />
            </div>
            <div className='min-w-0 flex-1 pt-0.5'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium'>{event.title}</span>
                {event.status && <StatusBadge status={event.status} />}
              </div>
              <p className='truncate text-sm text-muted-foreground'>{event.detail}</p>
              <p className='text-xs text-muted-foreground/70'>
                {formatRelativeDate(event.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
