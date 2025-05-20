
'use client';

import React from 'react'; // Import React for React.memo
import type { ApiEndpoint, ApiHealthStatus } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, Hourglass, Trash2, Info, RefreshCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { HEALTH_QUERY_KEY_PREFIX } from '@/hooks/useApiHealth';
import { formatDistanceToNow } from 'date-fns';


interface ApiStatusCardProps {
  endpoint: ApiEndpoint;
  healthStatus: ApiHealthStatus | undefined; // Can be undefined if still loading/not found
  isLoading: boolean;
  onViewDetails: (status: ApiHealthStatus) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const ApiStatusCard = React.memo(function ApiStatusCard({
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

  let StatusIconComponent;
  let statusColorClass;
  let badgeVariant: "default" | "destructive" | "secondary" | "outline" = "secondary";

  switch (status) {
    case 'Healthy':
      StatusIconComponent = CheckCircle2;
      statusColorClass = 'text-green-500';
      badgeVariant = 'default';
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
  
  const cardClass = `shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col ${isLoading ? 'opacity-70 animate-pulse' : ''}`;

  return (
    <Card className={cardClass}>
      <CardHeader className="p-2 pb-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm mb-0 truncate font-semibold" title={endpoint.name}>{endpoint.name}</CardTitle>
          <Badge variant={badgeVariant} className="ml-2 shrink-0 text-xs px-1.5 py-0.5">{status}</Badge>
        </div>
        <CardDescription className="text-xs truncate" title={endpoint.url}>{endpoint.url}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-1 text-xs p-2 pt-1">
        <div className="flex items-center">
          <StatusIconComponent className={`h-3.5 w-3.5 mr-1.5 shrink-0 ${statusColorClass}`} />
          <span className="text-xs">Status: {isLoading ? 'Loading...' : status}</span>
        </div>
        
        <div className="flex justify-start items-center space-x-3">
          {healthStatus?.statusCode !== undefined && (
            <p className="text-xs">Code: {healthStatus.statusCode}</p>
          )}
          {healthStatus?.responseTimeMs !== undefined && (
            <p className="text-xs">Resp: {(healthStatus.responseTimeMs / 1000).toFixed(1)}s</p>
          )}
        </div>

        {healthStatus?.error && (
            <p className="text-red-500 text-xs truncate" title={healthStatus.error}>Error: {healthStatus.error}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-2 pt-1.5">
        <div className="flex items-center">
           <Button
            variant="outline"
            size="sm" 
            className="h-6 px-1.5 text-xs"
            onClick={() => healthStatus && onViewDetails(healthStatus)}
            disabled={!healthStatus || isLoading || status === 'Pending'}
            aria-label={`View details for ${endpoint.name}`}
          >
            <Info className="mr-1 h-2.5 w-2.5" /> Details
          </Button>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading} aria-label={`Refresh status for ${endpoint.name}`} className="h-6 w-6">
             <RefreshCcw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(endpoint.id)} disabled={isDeleting} aria-label={`Delete endpoint ${endpoint.name}`} className="h-6 w-6">
            <Trash2 className="h-3 w-3 text-destructive" />
             {isDeleting && <span className="sr-only">Deleting...</span>}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
});
