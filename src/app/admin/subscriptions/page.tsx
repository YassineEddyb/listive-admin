import { CreditCard } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { ExportButton } from '@/components/export-button';
import { getSubscriptions } from '@/features/subscriptions/controllers/get-subscriptions';
import { SubscriptionTable } from '@/features/subscriptions/components/subscription-table';

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <PageHeader
          title='Subscriptions'
          description={`${subscriptions.length} total subscriptions`}
          icon={CreditCard}
        />
        <ExportButton
          data={subscriptions as any}
          filename='subscriptions'
          columns={[
            { key: 'user_email', label: 'Email' },
            { key: 'product_name', label: 'Plan' },
            { key: 'status', label: 'Status' },
            { key: 'amount', label: 'Amount' },
            { key: 'currency', label: 'Currency' },
            { key: 'current_period_end', label: 'Period End' },
            { key: 'created_at', label: 'Created' },
          ]}
        />
      </div>
      <SubscriptionTable data={subscriptions} />
    </div>
  );
}
