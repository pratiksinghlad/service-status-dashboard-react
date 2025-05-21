import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';
import { Providers } from '@/components/Providers';
import { languages, fallbackLng } from '@/i18n-config';

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
  manifest: '/manifest.json',
};

async function getLocale() {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language');
  
  if (!acceptLanguage) return fallbackLng;
  
  const preferredLocale = acceptLanguage
    .split(',')
    .map((lang: string) => lang.split(';')[0].trim())
    .find((lang: string) => languages.includes(lang));
  
  return preferredLocale || fallbackLng;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
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
        <meta name="theme-color" content="#1A202C" /> {/* Ensure this matches manifest.json theme_color */}

        {/* Link to manifest.json */}
        <link rel="manifest" href="/manifest.json" />

        {/* Apple touch icon (PWA) */}
        {/* You should create an actual icon file at public/icons/apple-touch-icon.png */}
        <link rel="apple-touch-icon" href="https://placehold.co/180x180.png?text=AppleIcon" data-ai-hint="logo health" />
        
        {/* Standard favicons */}
        {/* You should create actual icon files e.g. public/icons/favicon-32x32.png */}
        <link rel="icon" type="image/png" sizes="32x32" href="https://placehold.co/32x32.png?text=Fav32" data-ai-hint="favicon health" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://placehold.co/16x16.png?text=Fav16" data-ai-hint="favicon health" />
        {/* You should create an actual favicon.ico at public/favicon.ico */}
        <link rel="shortcut icon" href="https://placehold.co/48x48.png?text=FavICO" data-ai-hint="favicon health" />

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
