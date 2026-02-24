import { ArrowLeft, Clock, CreditCard, Package, ShieldAlert, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ROUTES } from '@/constants/routes';
import { getSession } from '@/features/auth/controllers/get-session';
import { CreditAdjustmentForm } from '@/features/credits/components/credit-adjustment-form';
import { SubscriptionActions } from '@/features/subscriptions/components/subscription-actions';
import { getUserAuthDetails, getUserCreditTransactions, getUserProducts, getUserSubscription } from '@/features/users/controllers/get-user-detail';
import { getUserById } from '@/features/users/controllers/get-users';
import { getUserTimeline } from '@/features/users/controllers/get-user-timeline';
import { SendEmailDialog } from '@/features/users/components/send-email-dialog';
import { EditProfileDialog } from '@/features/users/components/edit-profile-dialog';
import { UserTimeline } from '@/features/users/components/user-timeline';
import { BanUserButton, DeleteUserButton, PasswordResetButton } from '@/features/users/components/user-actions';
import { formatRelativeDate } from '@/utils/format-relative-date';

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;

  const [user, subscription, transactions, products, authDetails, session, timeline] = await Promise.all([
    getUserById(id),
    getUserSubscription(id),
    getUserCreditTransactions(id),
    getUserProducts(id),
    getUserAuthDetails(id),
    getSession(),
    getUserTimeline(id),
  ]);

  if (!user) {
    notFound();
  }

  const adminId = session?.id || 'unknown';
  const isBanned = authDetails?.banned_until
    ? new Date(authDetails.banned_until) > new Date()
    : false;

  return (
    <div className='space-y-6'>
      {/* Back link */}
      <div>
        <Button variant='ghost' size='sm' asChild>
          <Link href={ROUTES.users}>
            <ArrowLeft className='mr-1 h-4 w-4' />
            Back to Users
          </Link>
        </Button>
      </div>

      <div className='flex items-start justify-between'>
        <PageHeader title={user.full_name || user.email} description={user.email} icon={UserCircle} />
        <div className='flex items-center gap-2'>
          <EditProfileDialog
            userId={user.user_id}
            currentName={user.full_name || ''}
            onboardingCompleted={user.onboarding_completed}
            adminId={adminId}
          />
          <SendEmailDialog
            userId={user.user_id}
            userEmail={user.email}
            adminId={adminId}
          />
          <PasswordResetButton
            userId={user.user_id}
            userEmail={user.email}
            adminId={adminId}
          />
          <BanUserButton
            userId={user.user_id}
            adminId={adminId}
            isBanned={isBanned}
          />
        </div>
      </div>

      {/* Ban Warning */}
      {isBanned && (
        <div className='flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4'>
          <ShieldAlert className='h-5 w-5 text-destructive' />
          <div>
            <p className='text-sm font-medium text-destructive'>This user is banned</p>
            {authDetails?.ban_reason && (
              <p className='text-xs text-muted-foreground'>Reason: {authDetails.ban_reason}</p>
            )}
          </div>
        </div>
      )}

      {/* User Overview */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>User Info</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <InfoRow label='User ID' value={user.user_id} mono />
            <InfoRow label='Email' value={user.email} />
            <InfoRow label='Name' value={user.full_name || '—'} />
            <InfoRow
              label='Onboarding'
              value={user.onboarding_completed ? 'Completed' : 'Incomplete'}
            />
            <InfoRow label='Joined' value={formatRelativeDate(user.created_at)} />
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-sm'>
              <CreditCard className='h-4 w-4' />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            {subscription ? (
              <>
                <InfoRow
                  label='Status'
                  value={<StatusBadge status={subscription.status} />}
                />
                <InfoRow label='Plan' value={user.plan_name || '—'} />
                {subscription.current_period_end && (
                  <InfoRow
                    label='Period End'
                    value={formatRelativeDate(subscription.current_period_end)}
                  />
                )}
                {subscription.cancel_at_period_end && (
                  <Badge variant='warning' className='mt-2'>
                    Cancels at period end
                  </Badge>
                )}
                {subscription.polar_subscription_id && (
                  <div className='pt-2'>
                    <SubscriptionActions
                      subscriptionId={subscription.polar_subscription_id}
                      userId={user.user_id}
                      adminId={adminId}
                      status={subscription.status}
                      cancelAtPeriodEnd={subscription.cancel_at_period_end}
                    />
                  </div>
                )}
              </>
            ) : (
              <p className='text-sm text-muted-foreground'>No subscription</p>
            )}
          </CardContent>
        </Card>

        {/* Credits Card */}
        <Card>
          <CardHeader>
            <CardTitle className='text-sm'>Credits</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='text-3xl font-bold text-brand-dark'>{user.credit_balance.toLocaleString()}</div>
              <p className='text-xs text-muted-foreground'>Current balance</p>
            </div>
            <div className='border-t pt-4'>
              <CreditAdjustmentForm
                userId={user.user_id}
                userEmail={user.email}
                currentBalance={user.credit_balance}
                adminUserId={adminId}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-sm'>
            <Package className='h-4 w-4' />
            Products ({user.product_count})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className='overflow-hidden rounded-lg border border-brand-border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className='font-medium'>{product.title || 'Untitled'}</TableCell>
                      <TableCell className='text-muted-foreground'>
                        {formatRelativeDate(product.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>No products yet</p>
          )}
        </CardContent>
      </Card>

      {/* Credit Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className='text-sm'>Recent Credit Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className='overflow-hidden rounded-lg border border-brand-border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <Badge variant={tx.type === 'usage' ? 'destructive' : 'success'}>{tx.type}</Badge>
                      </TableCell>
                      <TableCell className='tabular-nums font-medium'>
                        {tx.amount > 0 ? '+' : ''}
                        {tx.amount}
                      </TableCell>
                      <TableCell className='text-muted-foreground'>{tx.description || '—'}</TableCell>
                      <TableCell className='text-muted-foreground'>
                        {formatRelativeDate(tx.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>No credit transactions</p>
          )}
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-sm'>
            <Clock className='h-4 w-4' />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserTimeline events={timeline} />
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className='border-destructive/30'>
        <CardHeader>
          <CardTitle className='text-sm text-destructive'>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            Permanently delete this user and all associated data. This action cannot be undone.
          </p>
          <DeleteUserButton userId={user.user_id} adminId={adminId} />
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <span className={`text-sm font-medium text-brand-dark ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}
