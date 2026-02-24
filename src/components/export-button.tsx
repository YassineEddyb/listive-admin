'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToCsv } from '@/utils/export-csv';

interface ExportButtonProps<T extends Record<string, unknown>> {
  data: T[];
  filename: string;
  columns?: { key: keyof T; label: string }[];
  label?: string;
}

export function ExportButton<T extends Record<string, unknown>>({
  data,
  filename,
  columns,
  label = 'Export CSV',
}: ExportButtonProps<T>) {
  return (
    <Button
      variant='outline'
      size='sm'
      onClick={() => exportToCsv(data, filename, columns)}
      disabled={data.length === 0}
    >
      <Download className='mr-2 h-4 w-4' />
      {label}
    </Button>
  );
}
