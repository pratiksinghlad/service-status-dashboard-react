
import { EnvironmentSelector } from '@/components/EnvironmentSelector';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AppHeaderProps {
  onRefreshAll: () => void;
  isRefreshing: boolean;
  globalLastCheckedTimestamp: string | null;
}

export function AppHeader({ onRefreshAll, isRefreshing, globalLastCheckedTimestamp }: AppHeaderProps) {
  return (
    <header className="bg-card text-card-foreground shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-primary">HealthCheck Central</h1>
            {globalLastCheckedTimestamp && (
                <span className="text-xs text-muted-foreground mt-1">
                    Data as of: {formatDistanceToNow(new Date(globalLastCheckedTimestamp), { addSuffix: true })}
                </span>
            )}
        </div>
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
