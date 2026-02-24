/**
 * Generic CSV export utility.
 * Converts an array of objects to a CSV string and triggers download.
 */

export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
): void {
  if (data.length === 0) return;

  // Determine column keys and labels
  const cols = columns || Object.keys(data[0]).map((key) => ({ key: key as keyof T, label: key }));

  // Build CSV header
  const header = cols.map((col) => escapeCell(col.label)).join(',');

  // Build CSV rows
  const rows = data.map((row) =>
    cols
      .map((col) => {
        const value = row[col.key];
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return escapeCell(JSON.stringify(value));
        return escapeCell(String(value));
      })
      .join(',')
  );

  const csv = [header, ...rows].join('\n');

  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Escape a cell value for CSV (handle commas, quotes, newlines).
 */
function escapeCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
