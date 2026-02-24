import { Store } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/stat-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShopifyTable, EtsyTable } from '@/features/stores/components/store-tables';
import {
  getShopifyConnections,
  getEtsyConnections,
  getStoreStats,
} from '@/features/stores/controllers/get-stores';

export default async function StoresPage() {
  const [shopify, etsy, stats] = await Promise.all([
    getShopifyConnections(),
    getEtsyConnections(),
    getStoreStats(),
  ]);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Stores & Integrations'
        description={`${stats.shopifyTotal + stats.etsyTotal} connections · ${stats.totalListings} listings`}
        icon={Store}
      />

      <div className='grid gap-4 sm:grid-cols-5'>
        <StatCard title='Shopify Stores' value={stats.shopifyTotal.toString()} />
        <StatCard title='Shopify Active' value={stats.shopifyActive.toString()} />
        <StatCard title='Etsy Stores' value={stats.etsyTotal.toString()} />
        <StatCard title='Etsy Active' value={stats.etsyActive.toString()} />
        <StatCard title='Total Listings' value={stats.totalListings.toString()} />
      </div>

      <Tabs defaultValue='shopify'>
        <TabsList>
          <TabsTrigger value='shopify'>Shopify ({shopify.length})</TabsTrigger>
          <TabsTrigger value='etsy'>Etsy ({etsy.length})</TabsTrigger>
        </TabsList>
        <TabsContent value='shopify' className='mt-4'>
          <ShopifyTable data={shopify} />
        </TabsContent>
        <TabsContent value='etsy' className='mt-4'>
          <EtsyTable data={etsy} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
