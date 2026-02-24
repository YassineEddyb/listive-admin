import { BarChart3, Layers, Star, TrendingUp } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTemplates, getTemplateStats } from '@/features/templates/controllers/get-templates';
import { TemplatesTable } from '@/features/templates/components/templates-table';

export const metadata = { title: 'Templates | Admin' };

export default async function TemplatesPage() {
  const [templates, stats] = await Promise.all([getTemplates(), getTemplateStats()]);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Templates'
        description='User-created templates and their usage stats.'
        icon={Layers}
      />

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Templates</CardTitle>
            <Layers className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.total.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Default Templates</CardTitle>
            <Star className='h-4 w-4 text-amber-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.withDefaults.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Usages</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalUsage.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Avg Uses / Template</CardTitle>
            <BarChart3 className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats.total > 0 ? (stats.totalUsage / stats.total).toFixed(1) : '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      <TemplatesTable data={templates} />
    </div>
  );
}
