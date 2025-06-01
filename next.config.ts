
import type {NextConfig} from 'next';
import PWAInit from '@ducanh2912/next-pwa';
import BundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withPWA = PWAInit({
  dest: 'public',
  register: true,
  // Important: PWA features are disabled in development mode by default.
  // To test PWA functionality (like installation) locally during development,
  // you can temporarily set `disable: false` or run a production build (`npm run build && npm run start`).
  // Forcing PWA to be enabled for environments like Firebase Studio:
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // You can add more PWA options here if needed, e.g., runtimeCaching
  workboxOptions: {
    skipWaiting: true,
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      { // Added for placeholder images
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default withBundleAnalyzer(withPWA(nextConfig));
