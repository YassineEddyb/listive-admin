import { Clock, MessageCircle, Shield, Tag, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { getSession } from '@/features/auth/controllers/get-session';
import { TicketPriorityControl } from '@/features/support/components/ticket-priority-control';
import { TicketReplyForm } from '@/features/support/components/ticket-reply-form';
import { TicketStatusControl } from '@/features/support/components/ticket-status-control';
import { getTicketById, getTicketReplies } from '@/features/support/controllers/get-tickets';
import { formatRelativeDate } from '@/utils/format-relative-date';

interface TicketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { id } = await params;
  const [ticket, replies, session] = await Promise.all([
    getTicketById(id),
    getTicketReplies(id),
    getSession(),
  ]);

  if (!ticket) {
    notFound();
  }

  const adminId = session?.id || 'unknown';

  return (
    <div className='space-y-6'>
      <PageHeader
        title={ticket.subject}
        description={`Ticket ${ticket.ticket_id}`}
        backHref={ROUTES.support}
      />

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Main content */}
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground'>
                {ticket.description}
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <MessageCircle className='h-4 w-4' />
                Replies ({replies.length})
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {replies.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No replies yet.</p>
              ) : (
                <div className='space-y-4'>
                  {replies.map((reply) => (
                    <div key={reply.id} className='rounded-lg border bg-muted/30 p-4'>
                      <div className='mb-2 flex items-center gap-2'>
                        <Shield className='h-3.5 w-3.5 text-brand-blue' />
                        <span className='text-sm font-medium'>{reply.admin_email}</span>
                        <span className='text-xs text-muted-foreground'>
                          {formatRelativeDate(reply.created_at)}
                        </span>
                      </div>
                      <p className='whitespace-pre-wrap text-sm'>{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className='border-t pt-4'>
                <p className='mb-3 text-sm font-medium'>Write a reply</p>
                <TicketReplyForm ticketId={ticket.id} adminUserId={adminId} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Status</span>
                <StatusBadge status={ticket.status} />
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Priority</span>
                <Badge variant='default' className='capitalize'>
                  {ticket.priority}
                </Badge>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Category</span>
                <Badge variant='default' className='capitalize'>
                  {ticket.category}
                </Badge>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <User className='h-4 w-4 text-muted-foreground' />
                <Link
                  href={ROUTES.userDetail(ticket.user_id)}
                  className='text-brand-primary hover:underline'
                >
                  {ticket.user_email}
                </Link>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Clock className='h-4 w-4' />
                <span>Created {formatRelativeDate(ticket.created_at)}</span>
              </div>
              {ticket.resolved_at && (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Tag className='h-4 w-4' />
                  <span>Resolved {formatRelativeDate(ticket.resolved_at)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <TicketStatusControl ticketId={ticket.id} currentStatus={ticket.status} />
          <TicketPriorityControl ticketId={ticket.id} currentPriority={ticket.priority} />
        </div>
      </div>
    </div>
  );
}
