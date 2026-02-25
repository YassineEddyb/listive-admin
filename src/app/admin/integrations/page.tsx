import {
  ArrowUpRight,
  BadgeDollarSign,
  CheckCircle2,
  Globe,
  Mail,
  MailWarning,
  Package,
  Plug,
  Receipt,
  ShieldAlert,
  TrendingUp,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatRelativeDate } from '@/utils/format-relative-date';
import {
  getPolarCustomers,
  getPolarMetrics,
  getPolarOrders,
} from '@/features/integrations/controllers/get-polar-data';
import {
  getResendDomains,
  getResendEmails,
  getResendMetrics,
} from '@/features/integrations/controllers/get-resend-data';

export default async function IntegrationsPage() {
  const [polarMetrics, polarOrders, polarCustomers, resendMetrics, resendEmails, resendDomains] =
    await Promise.all([
      getPolarMetrics(),
      getPolarOrders(50),
      getPolarCustomers(50),
      getResendMetrics(),
      getResendEmails(50),
      getResendDomains(),
    ]);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Integrations'
        description='Third-party service data and logs.'
        icon={Plug}
      />

      <Tabs defaultValue='polar' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='polar'>Polar.sh</TabsTrigger>
          <TabsTrigger value='resend'>Resend</TabsTrigger>
        </TabsList>

        {/* ─── POLAR TAB ─────────────────────────────────── */}
        <TabsContent value='polar' className='space-y-6'>
          {/* KPI Cards */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <MetricCard
              title='Total Revenue'
              value={`$${polarMetrics.total_revenue.toFixed(2)}`}
              icon={BadgeDollarSign}
            />
            <MetricCard
              title='Total Orders'
              value={polarMetrics.total_orders.toString()}
              icon={Receipt}
            />
            <MetricCard
              title='Customers'
              value={polarMetrics.total_customers.toString()}
              icon={Users}
            />
            <MetricCard
              title='Active Subscriptions'
              value={polarMetrics.active_subscriptions.toString()}
              icon={TrendingUp}
            />
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-sm'>
                <Receipt className='h-4 w-4' />
                Recent Orders ({polarOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {polarOrders.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No orders found. Check POLAR_ACCESS_TOKEN.</p>
              ) : (
                <div className='overflow-hidden rounded-lg border border-brand-border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {polarOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div>
                              <p className='text-sm font-medium'>{order.customer_email}</p>
                              {order.customer_name && (
                                <p className='text-xs text-muted-foreground'>{order.customer_name}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className='text-sm'>{order.product_name || '—'}</TableCell>
                          <TableCell className='text-sm font-medium tabular-nums'>
                            ${order.amount.toFixed(2)} {order.currency.toUpperCase()}
                          </TableCell>
                          <TableCell>
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                          <TableCell className='text-sm text-muted-foreground'>
                            {order.created_at ? formatRelativeDate(order.created_at) : '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customers */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-sm'>
                <UserCheck className='h-4 w-4' />
                Customers ({polarCustomers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {polarCustomers.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No customers found.</p>
              ) : (
                <div className='overflow-hidden rounded-lg border border-brand-border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {polarCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className='text-sm font-medium'>{customer.email}</TableCell>
                          <TableCell className='text-sm'>{customer.name || '—'}</TableCell>
                          <TableCell className='text-sm tabular-nums'>{customer.order_count}</TableCell>
                          <TableCell className='text-sm font-medium tabular-nums'>
                            ${customer.total_spent.toFixed(2)}
                          </TableCell>
                          <TableCell className='text-sm text-muted-foreground'>
                            {customer.created_at ? formatRelativeDate(customer.created_at) : '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── RESEND TAB ────────────────────────────────── */}
        <TabsContent value='resend' className='space-y-6'>
          {/* KPI Cards */}
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
            <MetricCard
              title='Total Sent'
              value={resendMetrics.total_sent.toString()}
              icon={Mail}
            />
            <MetricCard
              title='Delivered'
              value={resendMetrics.delivered.toString()}
              icon={CheckCircle2}
              variant='success'
            />
            <MetricCard
              title='Bounced'
              value={resendMetrics.bounced.toString()}
              icon={XCircle}
              variant={resendMetrics.bounced > 0 ? 'destructive' : 'default'}
            />
            <MetricCard
              title='Complained'
              value={resendMetrics.complained.toString()}
              icon={ShieldAlert}
              variant={resendMetrics.complained > 0 ? 'destructive' : 'default'}
            />
            <MetricCard
              title='Domains'
              value={resendMetrics.domains.toString()}
              icon={Globe}
            />
          </div>

          {/* Domains */}
          {resendDomains.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-sm'>
                  <Globe className='h-4 w-4' />
                  Domains ({resendDomains.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='overflow-hidden rounded-lg border border-brand-border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Domain</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resendDomains.map((domain) => (
                        <TableRow key={domain.id}>
                          <TableCell className='text-sm font-medium'>{domain.name}</TableCell>
                          <TableCell>
                            <DomainStatusBadge status={domain.status} />
                          </TableCell>
                          <TableCell className='text-sm text-muted-foreground'>{domain.region || '—'}</TableCell>
                          <TableCell className='text-sm text-muted-foreground'>
                            {domain.created_at ? formatRelativeDate(domain.created_at) : '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email Logs */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-sm'>
                <Mail className='h-4 w-4' />
                Email Logs ({resendEmails.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {resendEmails.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No emails found. Check RESEND_API_KEY.</p>
              ) : (
                <div className='overflow-hidden rounded-lg border border-brand-border'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>To</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resendEmails.map((email) => (
                        <TableRow key={email.id}>
                          <TableCell className='max-w-[200px] truncate text-sm font-medium'>
                            {email.to}
                          </TableCell>
                          <TableCell className='max-w-[250px] truncate text-sm'>
                            {email.subject || '—'}
                          </TableCell>
                          <TableCell className='max-w-[200px] truncate text-sm text-muted-foreground'>
                            {email.from}
                          </TableCell>
                          <TableCell>
                            <EmailStatusBadge status={email.status} />
                          </TableCell>
                          <TableCell className='text-sm text-muted-foreground'>
                            {email.created_at ? formatRelativeDate(email.created_at) : '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── Helper Components ──────────────────────────────── */

function MetricCard({
  title,
  value,
  icon: Icon,
  variant = 'default',
}: {
  title: string;
  value: string;
  icon: typeof Mail;
  variant?: 'default' | 'success' | 'destructive';
}) {
  const iconColor =
    variant === 'success'
      ? 'text-green-500'
      : variant === 'destructive'
        ? 'text-red-500'
        : 'text-brand-primary';

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold tabular-nums'>{value}</div>
      </CardContent>
    </Card>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const variant =
    status === 'completed' || status === 'paid'
      ? 'success'
      : status === 'refunded'
        ? 'destructive'
        : status === 'pending'
          ? 'warning'
          : 'default';
  return (
    <Badge variant={variant} className='capitalize'>
      {status}
    </Badge>
  );
}

function EmailStatusBadge({ status }: { status: string }) {
  const variant =
    status === 'delivered'
      ? 'success'
      : status === 'bounced' || status === 'complained'
        ? 'destructive'
        : status === 'sent' || status === 'queued'
          ? 'warning'
          : 'default';
  return (
    <Badge variant={variant} className='capitalize'>
      {status}
    </Badge>
  );
}

function DomainStatusBadge({ status }: { status: string }) {
  const variant =
    status === 'verified'
      ? 'success'
      : status === 'pending'
        ? 'warning'
        : status === 'failed' || status === 'temporary_failure'
          ? 'destructive'
          : 'default';
  return (
    <Badge variant={variant} className='capitalize'>
      {status.replace('_', ' ')}
    </Badge>
  );
}
