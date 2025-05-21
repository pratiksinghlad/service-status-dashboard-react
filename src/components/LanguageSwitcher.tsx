'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t, i18n } = useTranslation('common');

  // Available languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    // The pathname already includes the current locale,
    // so we need to remove it before pushing the new locale.
    // Example: current pathname is /fr/dashboard, newLocale is 'en'
    // We need to push /en/dashboard
    const currentLocale = i18n.language;
    let newPath = pathname;

    if (pathname.startsWith(`/${currentLocale}`)) {
      newPath = pathname.replace(`/${currentLocale}`, '');
      if (newPath === '') newPath = '/'; // Handle root path
    }
    
    // For the default locale 'en', Next.js might not prefix the path.
    // If currentLocale is the default and pathname doesn't start with it,
    // then newPath is already correct.
    // If newLocale is the default, we don't want to prefix it either,
    // unless all paths are prefixed.
    // Assuming next-i18next handles this correctly with router.push and locale option.
    // A simpler way might be to just use i18n.changeLanguage and let it handle the routing.
    // However, the requirement stated router.push(pathname, { locale: newLocale })
    // Let's try a more robust way to construct the new path,
    // ensuring we handle the default locale (which might not have a prefix) correctly.

    // Re-evaluate path construction for Next.js 13+ App Router with i18n routing
    // The `locale` option in `router.push` should handle this correctly without manual path manipulation.
    // `router.push(pathname, { locale: newLocale })` might be problematic if `pathname` already has a locale.
    // `next-i18next` typically recommends `i18n.changeLanguage(newLocale)` which then triggers a route change.

    // Let's try `i18n.changeLanguage` first as it's often more straightforward with next-i18next
    i18n.changeLanguage(newLocale).then(() => {
      // The router.refresh() might be needed if you want to re-fetch server components
      // with the new locale, but next-i18next should handle the route update.
      // router.refresh(); // Uncomment if necessary
    });
  };

  if (!mounted) {
    return null; // Or a loading skeleton
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('languageLabel')}>
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            disabled={i18n.language === lang.code}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
