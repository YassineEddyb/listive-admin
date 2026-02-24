import { ArrowLeft, Calendar, Clock, MessageSquare, Star, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { FeedbackStatusControl } from '@/features/feedback/components/feedback-status-control';
import { getFeedbackById } from '@/features/feedback/controllers/get-feedback';
import { formatRelativeDate } from '@/utils/format-relative-date';

interface FeedbackDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function FeedbackDetailPage({ params }: FeedbackDetailPageProps) {
  const { id } = await params;
  const feedback = await getFeedbackById(id);

  if (!feedback) {
    notFound();
  }

  return (
    <div className='space-y-6'>
      <div>
        <Link
          href={ROUTES.feedback}
          className='mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to feedback
        </Link>

        <PageHeader
          title={feedback.title}
          description={`Feedback ${feedback.feedback_id}`}
          icon={MessageSquare}
        />
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Main content */}
        <div className='lg:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground'>
                {feedback.description}
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          {feedback.category && feedback.category.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-2'>
                  {feedback.category.map((cat, i) => (
                    <Badge key={i} variant='default'>{cat}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
                <StatusBadge status={feedback.status} />
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Type</span>
                <Badge variant='default' className='capitalize'>{feedback.type}</Badge>
              </div>
              {feedback.priority && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Priority</span>
                  <Badge variant='default' className='capitalize'>{feedback.priority}</Badge>
                </div>
              )}
              {feedback.severity && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Severity</span>
                  <Badge
                    variant={feedback.severity === 'critical' ? 'destructive' : 'default'}
                    className='capitalize'
                  >
                    {feedback.severity}
                  </Badge>
                </div>
              )}
              {feedback.rating && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-muted-foreground'>Rating</span>
                  <div className='flex items-center gap-1'>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < feedback.rating! ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Follow-up</span>
                <span className='text-sm'>{feedback.can_follow_up ? 'Yes' : 'No'}</span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <User className='h-4 w-4 text-muted-foreground' />
                <Link
                  href={ROUTES.userDetail(feedback.user_id)}
                  className='text-brand-blue hover:underline'
                >
                  {feedback.user_email}
                </Link>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Clock className='h-4 w-4' />
                <span>Created {formatRelativeDate(feedback.created_at)}</span>
              </div>
              {feedback.reviewed_at && (
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Calendar className='h-4 w-4' />
                  <span>Reviewed {formatRelativeDate(feedback.reviewed_at)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <FeedbackStatusControl feedbackId={feedback.id} currentStatus={feedback.status} />
        </div>
      </div>
    </div>
  );
}
