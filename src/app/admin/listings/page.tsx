import { List } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/stat-card';
import { ListingsTable } from '@/features/listings/components/listings-table';
import { getListings, getListingStats } from '@/features/listings/controllers/get-listings';

export default async function ListingsPage() {
  const [listings, stats] = await Promise.all([getListings(), getListingStats()]);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Marketplace Listings'
        description={`${listings.length} total listings across all platforms`}
        icon={List}
      />

      <div className='grid gap-4 sm:grid-cols-5'>
        <StatCard title='Shopify Total' value={stats.totalShopify.toString()} />
        <StatCard title='Shopify Success' value={stats.successShopify.toString()} />
        <StatCard title='Etsy Total' value={stats.totalEtsy.toString()} />
        <StatCard title='Etsy Success' value={stats.successEtsy.toString()} />
        <StatCard title='Failed' value={stats.failedTotal.toString()} />
      </div>

      <ListingsTable data={listings} />
    </div>
  );
}
