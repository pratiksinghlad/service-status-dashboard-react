import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { languages, fallbackLng } from '@/i18n-config';
 
export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  
  // Get the preferred locale from the cookie
  const preferredLocale = request.cookies.get('i18nextLng')?.value;
  
  // Get locale from accept-language header
  const acceptLanguage = request.headers.get('accept-language');
  const headerLocale = acceptLanguage
    ?.split(',')
    .map(lang => lang.split(';')[0].trim())
    .find(lang => languages.includes(lang));
  
  // Use the locale from cookie, header, or fallback
  const locale = preferredLocale || headerLocale || fallbackLng;
 
  // Redirect if locale is not in path
  if (
    !languages.some(loc => pathname.startsWith(`/${loc}/`)) &&
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/api/') &&
    !pathname.includes('.')
  ) {
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
 
  const response = NextResponse.next();
 
  // Set the lang cookie if it's not already set
  if (!preferredLocale) {
    response.cookies.set('i18nextLng', locale);
  }
 
  return response;
}
 
export const config = {
  matcher: [
    // Skip all internal paths (_next, api)
    '/((?!_next|api|.*\\.).*)',
  ],
};
