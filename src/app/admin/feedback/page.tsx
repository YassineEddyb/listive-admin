import { MessageSquare } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { FeedbackTable } from '@/features/feedback/components/feedback-table';
import { getFeedback } from '@/features/feedback/controllers/get-feedback';

export default async function FeedbackPage() {
  const feedback = await getFeedback();

  const pendingCount = feedback.filter(
    (f) => f.status === 'submitted' || f.status === 'under_review'
  ).length;

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Feedback'
        description={`${feedback.length} submissions · ${pendingCount} pending review`}
        icon={MessageSquare}
      />
      <FeedbackTable data={feedback} />
    </div>
  );
}
