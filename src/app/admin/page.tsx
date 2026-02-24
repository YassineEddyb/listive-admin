import {
  CreditCard,
  DollarSign,
  Image,
  MessageSquare,
  Package,
  TicketCheck,
  TrendingUp,
  Users,
} from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/stat-card';
import {
  getCreditsByDay,
  getDashboardStats,
  getSignupsByDay,
} from '@/features/dashboard/controllers/get-dashboard-stats';
import { formatCompactNumber, formatCurrency } from '@/utils/format-currency';

import { TrendChart } from '@/features/dashboard/components/trend-chart';

export default async function DashboardPage() {
  const [stats, signups, credits] = await Promise.all([
    getDashboardStats(),
    getSignupsByDay(14),
    getCreditsByDay(14),
  ]);

  const signupChartData = signups.map((s) => ({ day: s.day, value: s.signup_count }));
  const creditsChartData = credits.map((c) => ({ day: c.day, value: c.total_credits }));

  return (
    <div className='space-y-8'>
      <PageHeader title='Dashboard' description='Overview of key platform metrics' />

      {/* KPI Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Total Users'
          value={stats?.total_users?.toLocaleString() ?? '—'}
          description={`${stats?.new_users_today ?? 0} today, ${stats?.new_users_this_week ?? 0} this week`}
          icon={Users}
          className='animate-widget-enter'
          style={{ '--stagger': 0 } as React.CSSProperties}
        />
        <StatCard
          title='Active Subscriptions'
          value={stats?.active_subscriptions?.toLocaleString() ?? '—'}
          icon={CreditCard}
          className='animate-widget-enter'
          style={{ '--stagger': 1 } as React.CSSProperties}
        />
        <StatCard
          title='Total Revenue'
          value={stats ? formatCurrency(stats.total_revenue_cents) : '—'}
          icon={DollarSign}
          className='animate-widget-enter'
          style={{ '--stagger': 2 } as React.CSSProperties}
        />
        <StatCard
          title='Credits Consumed'
          value={stats ? formatCompactNumber(stats.total_credits_consumed) : '—'}
          description={`${stats?.credits_consumed_today ?? 0} today`}
          icon={TrendingUp}
          className='animate-widget-enter'
          style={{ '--stagger': 3 } as React.CSSProperties}
        />
      </div>

      {/* Second Row */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Total Products'
          value={stats?.total_products?.toLocaleString() ?? '—'}
          description={`${stats?.products_today ?? 0} created today`}
          icon={Package}
        />
        <StatCard
          title='Generated Images'
          value={stats?.total_images?.toLocaleString() ?? '—'}
          icon={Image}
        />
        <StatCard
          title='Open Tickets'
          value={stats?.open_tickets?.toLocaleString() ?? '—'}
          icon={TicketCheck}
        />
        <StatCard
          title='Pending Feedback'
          value={stats?.pending_feedback?.toLocaleString() ?? '—'}
          icon={MessageSquare}
        />
      </div>

      {/* Subscription breakdown */}
      {stats?.subscriptions_by_plan && Object.keys(stats.subscriptions_by_plan).length > 0 && (
        <div className='rounded-xl bg-brand-light/50 p-4'>
          <h3 className='mb-3 text-sm font-semibold text-brand-dark'>Subscriptions by Plan</h3>
          <div className='flex flex-wrap gap-4'>
            {Object.entries(stats.subscriptions_by_plan).map(([plan, count]) => (
              <div key={plan} className='flex items-center gap-2'>
                <span className='text-sm font-medium text-brand-dark'>{plan}:</span>
                <span className='text-sm text-muted-foreground'>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend Charts */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <TrendChart title='Signups (Last 14 Days)' data={signupChartData} color='#306491' valueLabel='Signups' />
        <TrendChart title='Credits Consumed (Last 14 Days)' data={creditsChartData} color='#374752' valueLabel='Credits' />
      </div>
    </div>
  );
}
