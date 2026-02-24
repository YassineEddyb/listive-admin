import { ArrowLeft, Clock, Edit, Image, Package, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/status-badge';
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
import { ROUTES } from '@/constants/routes';
import { getProductById } from '@/features/products/controllers/get-products';
import { getProductEditHistory } from '@/features/products/controllers/get-edit-history';
import { ProductActions } from '@/features/products/components/product-actions';
import { getSession } from '@/features/auth/controllers/get-session';
import { formatRelativeDate } from '@/utils/format-relative-date';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const [product, session, editHistory] = await Promise.all([getProductById(id), getSession(), getProductEditHistory(id)]);

  if (!product) {
    notFound();
  }

  return (
    <div className='space-y-6'>
      <div>
        <Link
          href={ROUTES.products}
          className='mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to products
        </Link>

        <div className='flex items-start justify-between'>
          <PageHeader
            title={product.title || product.name || 'Untitled Product'}
            description={`Generation: ${product.generation_status}`}
            icon={Package}
          />
          {session && (
            <ProductActions
              productId={product.id}
              productName={product.title || product.name || 'Untitled'}
              adminId={session.id}
              generationStatus={product.generation_status}
              failedImages={product.failed_images}
            />
          )}
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Main content */}
        <div className='space-y-6 lg:col-span-2'>
          {/* Reference Image */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Reference Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex gap-4'>
                <div className='h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted'>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.reference_image_thumbnail_url || product.reference_image_url}
                    alt='Reference'
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='space-y-2 text-sm'>
                  <div>
                    <span className='text-muted-foreground'>Source: </span>
                    <span className='capitalize'>{product.reference_image_source}</span>
                  </div>
                  <div>
                    <span className='text-muted-foreground'>Reference images: </span>
                    <span>{product.reference_count}</span>
                  </div>
                </div>
              </div>

              {/* Source images */}
              {product.source_images.length > 0 && (
                <div className='mt-4'>
                  <p className='mb-2 text-sm font-medium'>Source Images ({product.source_images.length})</p>
                  <div className='flex gap-2'>
                    {product.source_images.map((img) => (
                      <div key={img.id} className='h-20 w-20 overflow-hidden rounded-md bg-muted'>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.thumbnail_url || img.image_url}
                          alt={`Source ${img.image_index}`}
                          className='h-full w-full object-cover'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Images */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Image className='h-4 w-4' />
                Generated Images ({product.images.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {product.images.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No images generated yet.</p>
              ) : (
                <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
                  {product.images.map((img) => (
                    <div key={img.id} className='space-y-2'>
                      <div className='overflow-hidden rounded-lg bg-muted'>
                        {img.status === 'completed' ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img.public_url}
                            alt={`${img.style} - ${img.angle}`}
                            className='aspect-square w-full object-cover'
                            loading='lazy'
                          />
                        ) : (
                          <div className='flex aspect-square items-center justify-center'>
                            <StatusBadge status={img.status} />
                          </div>
                        )}
                      </div>
                      <div className='space-y-0.5 text-xs'>
                        <div className='flex items-center gap-1'>
                          <Badge variant='default' className='text-[10px]'>{img.style}</Badge>
                          <Badge variant='default' className='text-[10px]'>{img.angle}</Badge>
                        </div>
                        <p className='text-muted-foreground'>
                          {img.aspect_ratio} · {img.image_size}
                          {img.size_bytes > 0 && ` · ${(img.size_bytes / 1024).toFixed(0)}KB`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO & Text */}
          {(product.seo_title || product.description) && (
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Text & SEO</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3 text-sm'>
                {product.title && (
                  <div>
                    <p className='font-medium text-muted-foreground'>Title</p>
                    <p>{product.title}</p>
                  </div>
                )}
                {product.description && (
                  <div>
                    <p className='font-medium text-muted-foreground'>Description</p>
                    <p className='whitespace-pre-wrap'>{product.description}</p>
                  </div>
                )}
                {product.seo_title && (
                  <div>
                    <p className='font-medium text-muted-foreground'>SEO Title</p>
                    <p>{product.seo_title}</p>
                  </div>
                )}
                {product.seo_description && (
                  <div>
                    <p className='font-medium text-muted-foreground'>SEO Description</p>
                    <p>{product.seo_description}</p>
                  </div>
                )}
                {product.seo_keywords && product.seo_keywords.length > 0 && (
                  <div>
                    <p className='mb-1 font-medium text-muted-foreground'>SEO Keywords</p>
                    <div className='flex flex-wrap gap-1'>
                      {product.seo_keywords.map((kw, i) => (
                        <Badge key={i} variant='default' className='text-xs'>
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Edit History */}
          {editHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-base'>
                  <Edit className='h-4 w-4' />
                  Edit History ({editHistory.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Prompt</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editHistory.map((op) => (
                      <TableRow key={op.id}>
                        <TableCell className='max-w-[300px] truncate text-sm'>
                          {op.edit_prompt}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={op.status} />
                        </TableCell>
                        <TableCell className='text-sm text-muted-foreground'>
                          {formatRelativeDate(op.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Status</span>
                <StatusBadge status={product.generation_status} />
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>Images</span>
                <span className='text-sm font-medium tabular-nums'>
                  {product.completed_images}/{product.total_images}
                  {product.failed_images > 0 && (
                    <span className='ml-1 text-destructive'>({product.failed_images} failed)</span>
                  )}
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <User className='h-4 w-4 text-muted-foreground' />
                <Link
                  href={ROUTES.userDetail(product.user_id)}
                  className='text-brand-primary hover:underline'
                >
                  {product.user_email}
                </Link>
              </div>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Clock className='h-4 w-4' />
                <span>Created {formatRelativeDate(product.created_at)}</span>
              </div>
            </CardContent>
          </Card>

          {product.product_specs && (
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Product Specs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='whitespace-pre-wrap text-sm text-muted-foreground'>{product.product_specs}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
