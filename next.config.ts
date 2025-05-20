
import type {NextConfig} from 'next';
import PWAInit from '@ducanh2912/next-pwa';

const withPWA = PWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Important: PWA features are disabled in development mode by default.
  // To test PWA functionality (like installation) locally during development,
  // you can temporarily set `disable: false` or run a production build (`npm run build && npm run start`).
  // Forcing PWA to be enabled for environments like Firebase Studio:
  disable: process.env.NODE_ENV === 'development' ? false : false, 
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // You can add more PWA options here if needed, e.g., runtimeCaching
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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

export default withPWA(nextConfig);
