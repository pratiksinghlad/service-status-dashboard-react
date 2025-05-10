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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="border bg-card text-card-foreground shadow-sm rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/5" />
      </div>
      <Skeleton className="h-4 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-5 w-2/3" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-9 w-1/3" />
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
}
