import { BarChart3 } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { AnalyticsChart } from '@/features/analytics/components/analytics-chart';
import {
  getGenerationsByDay,
  getListingsByDay,
  getProductsByDay,
  getRevenueByDay,
} from '@/features/analytics/controllers/get-analytics';
import {
  getCreditsByDay,
  getSignupsByDay,
} from '@/features/dashboard/controllers/get-dashboard-stats';

export const metadata = { title: 'Analytics — Listive Admin' };

const DAYS_BACK = 30;

export default async function AnalyticsPage() {
  const [signups, credits, revenue, generations, listings, products] = await Promise.all([
    getSignupsByDay(DAYS_BACK),
    getCreditsByDay(DAYS_BACK),
    getRevenueByDay(DAYS_BACK),
    getGenerationsByDay(DAYS_BACK),
    getListingsByDay(DAYS_BACK),
    getProductsByDay(DAYS_BACK),
  ]);

  // Map dashboard controller shapes to TimeSeriesPoint
  const signupData = signups.map((s) => ({ day: s.day, value: s.signup_count }));
  const creditData = credits.map((c) => ({ day: c.day, value: c.total_credits }));

  return (
    <div className='space-y-6'>
      <PageHeader title='Analytics' description='Trends and metrics over the last 30 days'>
        <BarChart3 className='h-6 w-6 text-brand' />
      </PageHeader>

      <div className='grid gap-6 md:grid-cols-2'>
        <AnalyticsChart
          title='User Signups'
          data={signupData}
          color='#306491'
          valueLabel='Signups'
        />

        <AnalyticsChart
          title='Credit Usage'
          data={creditData}
          color='#e97215'
          valueLabel='Credits'
        />

        <AnalyticsChart
          title='Revenue'
          data={revenue}
          color='#22c55e'
          valueLabel='Revenue'
          format='currency'
        />

        <AnalyticsChart
          title='Image Generations'
          data={generations}
          color='#8b5cf6'
          valueLabel='Images'
        />

        <AnalyticsChart
          title='Marketplace Listings'
          data={listings}
          color='#06b6d4'
          valueLabel='Listings'
        />

        <AnalyticsChart
          title='Products Created'
          data={products}
          color='#f43f5e'
          valueLabel='Products'
        />
      </div>
    </div>
  );
}
