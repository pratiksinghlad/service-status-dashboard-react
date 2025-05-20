
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HealthCheck Central',
  description: 'API Health Monitoring Dashboard',
  manifest: '/manifest.json', // Ensure this points to your manifest file
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="HealthCheck Central" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HealthCheck Central" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#1A202C" /> 
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#1A202C" />

        {/* It's good practice to provide an apple-touch-icon, 
            next-pwa might generate some icons but explicitly adding one is robust.
            You can replace https://placehold.co/180x180.png with your actual icon file in public/icons/
        */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" data-ai-hint="logo health" />
        {/* Example for specific sizes if needed:
        <link rel="apple-touch-icon" sizes="152x152" href="https://placehold.co/152x152.png" data-ai-hint="logo health" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://placehold.co/180x180.png" data-ai-hint="logo health" />
        <link rel="apple-touch-icon" sizes="167x167" href="https://placehold.co/167x167.png" data-ai-hint="logo health" />
        */}
        
        {/* Standard favicons, next-pwa might also handle these. 
            Replace with your actual favicons in public/icons/
        */}
        <link rel="icon" type="image/png" sizes="32x32" href="https://placehold.co/32x32.png" data-ai-hint="favicon health" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://placehold.co/16x16.png" data-ai-hint="favicon health" />
        <link rel="shortcut icon" href="/favicon.ico" data-ai-hint="favicon health" />

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
