import { Activity, AlertTriangle, Clock, Server } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { StatusBadge } from '@/components/status-badge';
import { StatCard } from '@/components/stat-card';
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
import { getSystemHealth } from '@/features/system/controllers/get-system-health';
import { SystemOperations } from '@/features/system/components/system-operations';
import { getSession } from '@/features/auth/controllers/get-session';
import { formatRelativeDate } from '@/utils/format-relative-date';

export default async function SystemPage() {
  const [health, session] = await Promise.all([getSystemHealth(), getSession()]);

  const totalOps =
    health.editQueue.pending +
    health.editQueue.processing +
    health.editQueue.completed +
    health.editQueue.failed +
    health.editQueue.canceled;

  return (
    <div className='space-y-6'>
      <PageHeader
        title='System Health'
        description='Edit queue, rate limits, and operation status'
        icon={Server}
      />

      {/* Edit Queue Stats */}
      <div>
        <h3 className='mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide'>
          Edit Queue
        </h3>
        <div className='grid gap-4 sm:grid-cols-5'>
          <StatCard title='Pending' value={health.editQueue.pending.toString()} />
          <StatCard title='Processing' value={health.editQueue.processing.toString()} />
          <StatCard title='Completed' value={health.editQueue.completed.toString()} />
          <StatCard title='Failed' value={health.editQueue.failed.toString()} />
          <StatCard title='Total' value={totalOps.toString()} />
        </div>
      </div>

      {/* Rate Limits */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Activity className='h-4 w-4' />
              Rate Limits
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Total hits (all time)</span>
              <span className='font-medium tabular-nums'>{health.rateLimits.totalHits.toLocaleString()}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>Last 24 hours</span>
              <span className='font-medium tabular-nums'>{health.rateLimits.recentHits.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Clock className='h-4 w-4' />
              Top Endpoints (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {health.rateLimits.topEndpoints.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No rate limit events in the last 24 hours.</p>
            ) : (
              <div className='space-y-2'>
                {health.rateLimits.topEndpoints.map((ep) => (
                  <div key={ep.endpoint} className='flex items-center justify-between'>
                    <code className='max-w-[240px] truncate text-xs'>{ep.endpoint}</code>
                    <Badge variant='default'>{ep.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stale Operations */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-base'>
            <AlertTriangle className='h-4 w-4 text-amber-500' />
            Stale Operations
            {health.staleOperations.length > 0 && (
              <Badge variant='warning'>{health.staleOperations.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {health.staleOperations.length === 0 ? (
            <p className='text-sm text-muted-foreground'>
              No stale operations. All processing tasks are running normally.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {health.staleOperations.map((op) => (
                  <TableRow key={op.id}>
                    <TableCell className='text-sm'>{op.user_email}</TableCell>
                    <TableCell className='max-w-[240px] truncate text-sm'>{op.edit_prompt}</TableCell>
                    <TableCell><StatusBadge status={op.status} /></TableCell>
                    <TableCell className='text-sm text-muted-foreground'>
                      {op.started_at ? formatRelativeDate(op.started_at) : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* System Operations */}
      {session && (
        <SystemOperations
          adminId={session.id}
          staleCount={health.staleOperations.length}
        />
      )}
    </div>
  );
}
