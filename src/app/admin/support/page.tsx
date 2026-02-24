import { TicketCheck } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { TicketTable } from '@/features/support/components/ticket-table';
import { getTickets } from '@/features/support/controllers/get-tickets';

export default async function SupportPage() {
  const tickets = await getTickets();

  const openCount = tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length;

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Support Tickets'
        description={`${tickets.length} tickets · ${openCount} open`}
        icon={TicketCheck}
      />
      <TicketTable data={tickets} />
    </div>
  );
}
