'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TimeSeriesPoint } from '@/features/analytics/controllers/get-analytics';

type ValueFormat = 'number' | 'currency';

interface AnalyticsChartProps {
  title: string;
  data: TimeSeriesPoint[];
  color?: string;
  valueLabel?: string;
  format?: ValueFormat;
}

function formatValue(value: number, format: ValueFormat = 'number'): string {
  if (format === 'currency') return `$${(value / 100).toFixed(2)}`;
  return value.toLocaleString();
}

export function AnalyticsChart({
  title,
  data,
  color = '#306491',
  valueLabel = 'Count',
  format = 'number',
}: AnalyticsChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    day: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between pb-2'>
        <CardTitle className='text-base font-semibold text-brand-dark'>{title}</CardTitle>
        <span className='text-sm font-medium text-muted-foreground'>
          Total: {formatValue(total, format)}
        </span>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className='flex h-[200px] items-center justify-center text-sm text-muted-foreground'>
            No data available yet
          </div>
        ) : (
          <ResponsiveContainer width='100%' height={200}>
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id={`gradient-${title}`} x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={color} stopOpacity={0.3} />
                  <stop offset='95%' stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
              <XAxis
                dataKey='day'
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#6b7c8a' }}
                interval='preserveStartEnd'
              />
              <YAxis
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#6b7c8a' }}
                tickFormatter={(v) => formatValue(v, format)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#374752',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#d1dce5' }}
                formatter={(value: number) => [formatValue(value, format), valueLabel]}
              />
              <Area
                type='monotone'
                dataKey='value'
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${title})`}
                name={valueLabel}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
