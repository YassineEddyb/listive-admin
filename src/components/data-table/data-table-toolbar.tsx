'use client';

import type { Table } from '@tanstack/react-table';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  filterOptions?: {
    key: string;
    label: string;
    options: { label: string; value: string }[];
  }[];
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
  searchPlaceholder = 'Search...',
  filterOptions,
}: DataTableToolbarProps<TData>) {
  return (
    <div className='flex flex-wrap items-center justify-between gap-3'>
      <div className='flex flex-1 items-center gap-3'>
        {searchKey && (
          <div className='relative max-w-sm flex-1'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
              onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
              className='pl-9'
            />
          </div>
        )}

        {filterOptions?.map((filter) => (
          <Select
            key={filter.key}
            value={(table.getColumn(filter.key)?.getFilterValue() as string) ?? '__all__'}
            onValueChange={(value) =>
              table.getColumn(filter.key)?.setFilterValue(value === '__all__' ? undefined : value)
            }
          >
            <SelectTrigger className='w-[160px]'>
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='__all__'>All {filter.label}</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>

      <span className='text-sm text-muted-foreground'>
        {table.getFilteredRowModel().rows.length} result{table.getFilteredRowModel().rows.length !== 1 ? 's' : ''}
      </span>
    </div>
  );
}
