'use client'; // Added 'use client'

import { EnvironmentSelector } from '@/components/EnvironmentSelector';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation } from 'next-i18next'; // Added import

interface AppHeaderProps {
  onRefreshAll: () => void;
  isRefreshing: boolean;
  globalLastCheckedTimestamp: string | null;
}

export function AppHeader({ onRefreshAll, isRefreshing, globalLastCheckedTimestamp }: AppHeaderProps) {
  const { t } = useTranslation('common'); // Initialized useTranslation

  return (
    <header className="bg-card text-card-foreground shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-primary">{t('appTitle')}</h1> {/* Translated */}
            {/* Add a min-height to prevent layout shift when timestamp appears/disappears */}
            <div className="min-h-[16px] mt-1"> {/* Adjust min-height based on typical text height */}
              {globalLastCheckedTimestamp && (
                  <span className="text-xs text-muted-foreground">
                      {t('lastCheckedLabel')} {formatDistanceToNow(new Date(globalLastCheckedTimestamp), { addSuffix: true })}
                  </span> // Translated (Note: Original had a colon, the key does not. Adding space for clarity)
              )}
            </div>
        </div>
        <div className="flex items-center space-x-4">
          <EnvironmentSelector />
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Button 
            onClick={onRefreshAll} 
            disabled={isRefreshing} 
            size="icon" 
            variant="outline" 
            aria-label={t('refreshButtonLabel')} // Translated aria-label
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </header>
  );
}
