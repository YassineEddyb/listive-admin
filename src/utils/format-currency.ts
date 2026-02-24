/**
 * Format a number of cents as a currency string.
 *
 * @example formatCurrency(1250000) // "$12,500.00"
 * @example formatCurrency(0) // "$0.00"
 */
export function formatCurrency(cents: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

/**
 * Format a large number with compact notation.
 *
 * @example formatCompactNumber(12500) // "12.5K"
 * @example formatCompactNumber(1500000) // "1.5M"
 */
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}
