import { ImageIcon } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { StatCard } from '@/components/stat-card';
import { ImageGallery } from '@/features/images/components/image-gallery';
import { getGalleryImages, getImageStats } from '@/features/images/controllers/get-images';

export default async function ImagesPage() {
  const [images, stats] = await Promise.all([getGalleryImages(), getImageStats()]);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Image Gallery'
        description={`${images.length} recent images`}
        icon={ImageIcon}
      />

      <div className='grid gap-4 sm:grid-cols-4'>
        <StatCard title='Total Images' value={stats.total.toLocaleString()} />
        <StatCard title='Completed' value={stats.completed.toLocaleString()} />
        <StatCard title='Pending' value={stats.pending.toLocaleString()} />
        <StatCard title='Failed' value={stats.failed.toLocaleString()} />
      </div>

      <ImageGallery images={images} />
    </div>
  );
}
