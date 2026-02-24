/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              `default-src 'self'`,
              `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''}`,
              `style-src 'self' 'unsafe-inline'`,
              `img-src 'self' blob: data: https://lh3.googleusercontent.com https://*.r2.dev https://cdn.shopify.com https://images.unsplash.com`,
              `font-src 'self' data:`,
              `connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com https://api.polar.sh`,
              `frame-ancestors 'none'`,
              `base-uri 'self'`,
              `form-action 'self'`,
              `upgrade-insecure-requests`,
            ]
              .join('; ')
              .replace(/\s+/g, ' ')
              .trim(),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
