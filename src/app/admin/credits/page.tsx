import { Coins } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditAdjustmentForm } from '@/features/credits/components/credit-adjustment-form';
import { TransactionTable } from '@/features/credits/components/transaction-table';
import { getCreditBalances, getTransactions } from '@/features/credits/controllers/get-transactions';
import { getSession } from '@/features/auth/controllers/get-session';
import { CreditBalancesTable } from '@/features/credits/components/credit-balances-table';

export default async function CreditsPage() {
  const [transactions, balances, session] = await Promise.all([
    getTransactions(),
    getCreditBalances(),
    getSession(),
  ]);

  const adminId = session?.id || 'unknown';

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Credits'
        description={`${transactions.length} recent transactions · ${balances.length} user balances`}
        icon={Coins}
      />

      <Tabs defaultValue='transactions'>
        <TabsList>
          <TabsTrigger value='transactions'>Transaction History</TabsTrigger>
          <TabsTrigger value='balances'>User Balances</TabsTrigger>
          <TabsTrigger value='adjust'>Adjust Credits</TabsTrigger>
        </TabsList>
        <TabsContent value='transactions' className='mt-4'>
          <TransactionTable data={transactions} />
        </TabsContent>
        <TabsContent value='balances' className='mt-4'>
          <CreditBalancesTable data={balances} adminId={adminId} />
        </TabsContent>
        <TabsContent value='adjust' className='mt-4'>
          <CreditAdjustmentSearch adminId={adminId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function CreditAdjustmentSearch({ adminId }: { adminId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Adjust User Credits</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='mb-4 text-sm text-muted-foreground'>
          Search for a user in the User Balances tab above, then click &quot;Adjust&quot; to add or deduct credits.
          You can also adjust credits from the User Detail page.
        </p>
      </CardContent>
    </Card>
  );
}
