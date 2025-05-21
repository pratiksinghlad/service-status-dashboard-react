'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useClientTranslation } from '@/i18n';

const LanguageSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [i18nInstance, setI18nInstance] = useState<any>(null);
  const [t, setT] = useState<any>(() => (key: string) => key);
  const router = useRouter();
  const pathname = usePathname();

  // Available languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
  ];

  useEffect(() => {
    const initI18n = async () => {
      const { i18n, t } = await useClientTranslation(
        localStorage.getItem('i18nextLng') || 'en',
        'common'
      );
      setI18nInstance(i18n);
      setT(() => t);
    };
    initI18n();
    setMounted(true);
  }, []);

  const handleLanguageChange = async (newLocale: string) => {
    if (!i18nInstance) return;
    
    await i18nInstance.changeLanguage(newLocale);
    localStorage.setItem('i18nextLng', newLocale);
    
    // Refresh the page to update all translations
    router.refresh();
  };

  if (!mounted) {
    return null;
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
            disabled={i18nInstance?.language === lang.code}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
