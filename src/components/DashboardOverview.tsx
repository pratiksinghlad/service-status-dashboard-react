
'use client';

import type { ApiHealthStatus, ApiEndpoint } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle2, XCircle, Hourglass } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardOverviewProps {
  apiEndpoints: ApiEndpoint[]; // All endpoints in the current environment
  healthStatuses: ApiHealthStatus[];
  isLoading: boolean;
}

function OverviewCardSkeleton() {
  const cardClassName = "shadow-lg"; // Removed hover styles for skeleton
  return (
    <Card className={cardClassName}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-5 w-1/2" /> {/* CardTitle: text-sm font-medium */}
        <Skeleton className="h-6 w-6 rounded-sm" /> {/* Icon */}
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-1/4 mb-1" /> {/* text-2xl font-bold */}
        <Skeleton className="h-3 w-3/4" /> {/* text-xs text-muted-foreground */}
      </CardContent>
    </Card>
  );
}

export function DashboardOverview({ apiEndpoints, healthStatuses, isLoading }: DashboardOverviewProps) {
  const totalApis = apiEndpoints.length;
  
  let healthyCount = 0;
  let unhealthyCount = 0;
  let pendingCount = 0;

  if (!isLoading) {
    healthStatuses.forEach(status => {
      if (status.overallStatus === "Healthy") healthyCount++;
      else if (status.overallStatus === "Unhealthy" || status.overallStatus === "Error") unhealthyCount++;
      else if (status.overallStatus === "Pending") pendingCount++;
    });
  }
  
  const cardClassName = "shadow-lg hover:shadow-xl transition-shadow duration-300";
  const iconClassName = "h-6 w-6 text-muted-foreground";

  if (isLoading && totalApis === 0) { // Show skeletons only if truly loading initial data
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <OverviewCardSkeleton key={i} />
        ))}
      </div>
    );
  }


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className={cardClassName}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total APIs</CardTitle>
          <Users className={iconClassName} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalApis}</div>
          <p className="text-xs text-muted-foreground">Monitored in current environment</p>
        </CardContent>
      </Card>
      <Card className={cardClassName}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Healthy</CardTitle>
          <CheckCircle2 className={`${iconClassName} text-green-500`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{healthyCount}</div>
          <p className="text-xs text-muted-foreground">APIs currently operational</p>
        </CardContent>
      </Card>
      <Card className={cardClassName}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unhealthy/Error</CardTitle>
          <XCircle className={`${iconClassName} text-red-500`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unhealthyCount}</div>
          <p className="text-xs text-muted-foreground">APIs with issues</p>
        </CardContent>
      </Card>
      <Card className={cardClassName}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Hourglass className={`${iconClassName} text-yellow-500`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
          <p className="text-xs text-muted-foreground">APIs awaiting status</p>
        </CardContent>
      </Card>
    </div>
  );
}

