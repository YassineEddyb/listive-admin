import { ScrollText } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { AuditLogTable } from '@/features/audit/components/audit-log-table';
import { getAuditLog } from '@/features/audit/controllers/get-audit-log';

export default async function AuditLogPage() {
  const logs = await getAuditLog();

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Audit Log'
        description={`${logs.length} admin actions recorded`}
        icon={ScrollText}
      />
      <AuditLogTable data={logs} />
    </div>
  );
}
