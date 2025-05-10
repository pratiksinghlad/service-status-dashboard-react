'use client';

import type { ApiEndpoint, ApiHealthStatus } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, Hourglass, Trash2, Info, RefreshCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { HEALTH_QUERY_KEY_PREFIX } from '@/hooks/useApiHealth';

interface ApiStatusCardProps {
  endpoint: ApiEndpoint;
  healthStatus: ApiHealthStatus | undefined; // Can be undefined if still loading/not found
  isLoading: boolean;
  onViewDetails: (status: ApiHealthStatus) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ApiStatusCard({
  endpoint,
  healthStatus,
  isLoading,
  onViewDetails,
  onDelete,
  isDeleting
}: ApiStatusCardProps) {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: [HEALTH_QUERY_KEY_PREFIX, endpoint.id] });
  };
  
  const status = healthStatus?.overallStatus || 'Pending';
  const lastChecked = healthStatus?.lastChecked ? formatDistanceToNow(new Date(healthStatus.lastChecked), { addSuffix: true }) : 'N/A';

  let StatusIconComponent;
  let statusColorClass;
  let badgeVariant: "default" | "destructive" | "secondary" | "outline" = "secondary";

  switch (status) {
    case 'Healthy':
      StatusIconComponent = CheckCircle2;
      statusColorClass = 'text-green-500';
      badgeVariant = 'default'; // Default often green-ish or primary
      break;
    case 'Unhealthy':
      StatusIconComponent = XCircle;
      statusColorClass = 'text-red-500';
      badgeVariant = 'destructive';
      break;
    case 'Error':
      StatusIconComponent = AlertTriangle;
      statusColorClass = 'text-red-600';
      badgeVariant = 'destructive';
      break;
    case 'Pending':
    default:
      StatusIconComponent = Hourglass;
      statusColorClass = 'text-yellow-500';
      badgeVariant = 'secondary';
      break;
  }
  
  const cardClass = `shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col ${isLoading ? 'opacity-70 animate-pulse' : ''}`;

  return (
    <Card className={cardClass}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg mb-1 truncate" title={endpoint.name}>{endpoint.name}</CardTitle>
          <Badge variant={badgeVariant} className="ml-2 shrink-0">{status}</Badge>
        </div>
        <CardDescription className="text-xs truncate" title={endpoint.url}>{endpoint.url}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 text-sm">
        <div className="flex items-center">
          <StatusIconComponent className={`h-5 w-5 mr-2 shrink-0 ${statusColorClass}`} />
          <span>Status: {status}</span>
        </div>
        {healthStatus?.statusCode && (
          <p>Code: {healthStatus.statusCode}</p>
        )}
        {healthStatus?.responseTimeMs !== undefined && (
          <p>Response: {healthStatus.responseTimeMs} ms</p>
        )}
        <p>Last Check: {isLoading ? 'Loading...' : lastChecked}</p>
        {healthStatus?.error && (
            <p className="text-red-500 text-xs truncate" title={healthStatus.error}>Error: {healthStatus.error}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => healthStatus && onViewDetails(healthStatus)}
          disabled={!healthStatus || isLoading || status === 'Pending'}
        >
          <Info className="mr-2 h-4 w-4" /> Details
        </Button>
        <div className="space-x-2">
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading} aria-label="Refresh Status">
             <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(endpoint.id)} disabled={isDeleting} aria-label="Delete Endpoint">
            <Trash2 className="h-4 w-4 text-destructive" />
             {isDeleting && <span className="sr-only">Deleting...</span>}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
