
'use client';

import type { ApiEndpoint, ApiHealthStatus } from '@/types';
import { ApiStatusCard } from './ApiStatusCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ApiEndpointListProps {
  endpoints: ApiEndpoint[];
  healthData: {
    statuses: ApiHealthStatus[];
    isLoading: boolean;
  };
  onViewDetails: (status: ApiHealthStatus) => void;
  onDeleteEndpoint: (id: string) => void;
  isDeletingEndpoint: boolean;
}

export function ApiEndpointList({
  endpoints,
  healthData,
  onViewDetails,
  onDeleteEndpoint,
  isDeletingEndpoint
}: ApiEndpointListProps) {

  if (healthData.isLoading && endpoints.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (endpoints.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">No API endpoints configured for this environment.</p>
        <p className="mt-2">Try adding a new endpoint using the button above.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {endpoints.map((endpoint) => {
        const status = healthData.statuses.find(s => s.endpointId === endpoint.id);
        return (
          <ApiStatusCard
            key={endpoint.id}
            endpoint={endpoint}
            healthStatus={status}
            isLoading={healthData.isLoading && !status} // Individual card is loading if global load and no status yet
            onViewDetails={onViewDetails}
            onDelete={onDeleteEndpoint}
            isDeleting={isDeletingEndpoint}
          />
        );
      })}
    </div>
  );
}

function CardSkeleton() {
  return (
    // Mimic ApiStatusCard padding and overall structure for better CLS
    <div className="border bg-card text-card-foreground shadow-sm rounded-lg flex flex-col">
      {/* CardHeader equivalent: p-2 pb-1 */}
      <div className="p-2 pb-1">
        <div className="flex justify-between items-start">
          <Skeleton className="h-4 w-3/4 mb-0.5" /> {/* CardTitle: text-sm */}
          <Skeleton className="h-4 w-1/4" />    {/* Badge: text-xs */}
        </div>
        <Skeleton className="h-3 w-full" />      {/* CardDescription: text-xs */}
      </div>
      {/* CardContent equivalent: p-2 pt-1 space-y-1 */}
      <div className="flex-grow space-y-1 text-xs p-2 pt-1">
        <div className="flex items-center">
          <Skeleton className="h-3.5 w-3.5 mr-1.5 rounded-full" /> {/* Icon */}
          <Skeleton className="h-3.5 w-1/2" /> {/* Status text */}
        </div>
        <div className="flex justify-start items-center space-x-3">
          <Skeleton className="h-3.5 w-1/4" /> {/* Code */}
          <Skeleton className="h-3.5 w-1/4" /> {/* Resp */}
        </div>
        {/* Optional Error line skeleton, add if errors are common and take space */}
        {/* <Skeleton className="h-3.5 w-3/4" /> */}
      </div>
      {/* CardFooter equivalent: p-2 pt-1.5 */}
      <div className="flex justify-between items-center p-2 pt-1.5">
        <Skeleton className="h-6 w-1/3 rounded-md" /> {/* Details Button */}
        <div className="flex items-center space-x-1">
          <Skeleton className="h-6 w-6 rounded-md" /> {/* Refresh Icon Button */}
          <Skeleton className="h-6 w-6 rounded-md" /> {/* Delete Icon Button */}
        </div>
      </div>
    </div>
  );
}
