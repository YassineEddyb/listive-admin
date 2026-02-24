'use client';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';
import type { GalleryImageRow } from '@/features/images/controllers/get-images';
import { formatRelativeDate } from '@/utils/format-relative-date';

interface ImageGalleryProps {
  images: GalleryImageRow[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className='flex min-h-[300px] items-center justify-center rounded-lg border border-dashed'>
        <p className='text-sm text-muted-foreground'>No images found</p>
      </div>
    );
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {images.map((img) => (
        <div key={img.id} className='group overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md'>
          <Link href={ROUTES.productDetail(img.product_id)}>
            <div className='aspect-square overflow-hidden bg-muted'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.public_url}
                alt={`${img.style} - ${img.angle}`}
                className='h-full w-full object-cover transition-transform group-hover:scale-105'
                loading='lazy'
              />
            </div>
          </Link>
          <div className='space-y-1.5 p-3'>
            <div className='flex items-center gap-1'>
              <Badge variant='default' className='text-[10px]'>{img.style}</Badge>
              <Badge variant='default' className='text-[10px]'>{img.angle}</Badge>
            </div>
            <p className='truncate text-xs text-muted-foreground'>
              {img.aspect_ratio} · {img.image_size}
              {img.size_bytes > 0 && ` · ${(img.size_bytes / 1024).toFixed(0)}KB`}
            </p>
            <div className='flex items-center justify-between text-xs'>
              <Link
                href={ROUTES.userDetail(img.user_id || '')}
                className='truncate text-brand-primary hover:underline'
              >
                {img.user_email}
              </Link>
              <span className='text-muted-foreground'>
                {formatRelativeDate(img.created_at)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
