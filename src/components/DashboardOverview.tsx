'use client';

import type { ApiHealthStatus, ApiEndpoint } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle2, XCircle, AlertCircle, Hourglass } from 'lucide-react';

interface DashboardOverviewProps {
  apiEndpoints: ApiEndpoint[]; // All endpoints in the current environment
  healthStatuses: ApiHealthStatus[];
  isLoading: boolean;
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className={cardClassName}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-6 w-1/2 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 w-1/4 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse mt-1"></div>
            </CardContent>
          </Card>
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
