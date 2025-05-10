import { EnvironmentSelector } from '@/components/EnvironmentSelector';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AppHeaderProps {
  onRefreshAll: () => void;
  isRefreshing: boolean;
}

export function AppHeader({ onRefreshAll, isRefreshing }: AppHeaderProps) {
  return (
    <header className="bg-card text-card-foreground shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">HealthCheck Central</h1>
        <div className="flex items-center space-x-4">
          <EnvironmentSelector />
          <Button onClick={onRefreshAll} disabled={isRefreshing} size="icon" variant="outline" aria-label="Refresh All API Statuses">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </header>
  );
}
