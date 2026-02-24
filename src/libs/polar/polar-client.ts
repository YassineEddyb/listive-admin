import { Polar } from '@polar-sh/sdk';

if (!process.env.POLAR_ACCESS_TOKEN) {
  console.warn('[Polar] POLAR_ACCESS_TOKEN not set — subscription management will be disabled');
}

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || '',
  server: (process.env.POLAR_SERVER as 'sandbox' | 'production') || 'sandbox',
});
