import { Package } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { ExportButton } from '@/components/export-button';
import { ProductTable } from '@/features/products/components/product-table';
import { getProducts } from '@/features/products/controllers/get-products';

export default async function ProductsPage() {
  const products = await getProducts();

  const completedCount = products.filter((p) => p.generation_status === 'completed').length;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <PageHeader
          title='Products'
          description={`${products.length} products · ${completedCount} completed`}
          icon={Package}
        />
        <ExportButton
          data={products as any}
          filename='products'
          columns={[
            { key: 'user_email', label: 'User' },
            { key: 'title', label: 'Title' },
            { key: 'name', label: 'Name' },
            { key: 'generation_status', label: 'Status' },
            { key: 'total_images', label: 'Total Images' },
            { key: 'completed_images', label: 'Completed' },
            { key: 'failed_images', label: 'Failed' },
            { key: 'created_at', label: 'Created' },
          ]}
        />
      </div>
      <ProductTable data={products} />
    </div>
  );
}
