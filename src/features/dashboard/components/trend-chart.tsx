'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendChartProps {
  title: string;
  data: Array<{ day: string; value: number }>;
  color?: string;
  valueLabel?: string;
}

export function TrendChart({ title, data, color = '#306491', valueLabel = 'Count' }: TrendChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    day: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base font-semibold text-brand-dark'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className='flex h-[200px] items-center justify-center text-sm text-muted-foreground'>
            No data available yet
          </div>
        ) : (
          <ResponsiveContainer width='100%' height={200}>
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
              <XAxis dataKey='day' fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#6b7c8a' }} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#6b7c8a' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#374752',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                labelStyle={{ color: '#d1dce5' }}
              />
              <Line
                type='monotone'
                dataKey='value'
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: color }}
                name={valueLabel}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
