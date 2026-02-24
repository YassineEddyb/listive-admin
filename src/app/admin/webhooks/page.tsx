import { Webhook } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { WebhookTable } from '@/features/webhooks/components/webhook-table';
import { getWebhookEvents } from '@/features/webhooks/controllers/get-webhooks';

export default async function WebhooksPage() {
  const events = await getWebhookEvents();

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Webhook Events'
        description={`${events.length} Polar webhook events`}
        icon={Webhook}
      />
      <WebhookTable data={events} />
    </div>
  );
}
