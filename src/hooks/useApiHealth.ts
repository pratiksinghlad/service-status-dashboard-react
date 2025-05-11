'use client';

import { useQuery, useQueries, type UseQueryResult } from '@tanstack/react-query';
import type { ApiEndpoint, ApiHealthStatus, ApiServiceHealth } from '@/types';
import { MOCK_API_RESPONSES } from '@/config/constants';

const fetchApiHealth = async (endpoint: ApiEndpoint): Promise<ApiHealthStatus> => {
  const startTime = Date.now();
  let responseTimeMs: number | undefined;
  let statusCode: number | undefined;

  try {
    // Check for mock response first
    if (MOCK_API_RESPONSES[endpoint.url]) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 200)); // Simulate network delay
      const mockData = MOCK_API_RESPONSES[endpoint.url];
      responseTimeMs = Date.now() - startTime;
      statusCode = mockData.status === "Healthy" ? 200 : 503; // Simulate status code
      
      return {
        endpointId: endpoint.id,
        overallStatus: mockData.status as "Healthy" | "Unhealthy",
        responseTimeMs,
        statusCode,
        lastChecked: new Date().toISOString(),
        services: mockData.results.map((r: any) => ({
          source: r.source,
          status: r.status as "Healthy" | "Unhealthy",
          description: r.description,
        })),
      };
    }

    // If not mocked, try to fetch (will likely fail for "https://mock.api" but demonstrates real fetch path)
    const response = await fetch(endpoint.url, { method: 'GET', signal: AbortSignal.timeout(5000) }); // 5s timeout
    responseTimeMs = Date.now() - startTime;
    statusCode = response.status;

    if (!response.ok) {
      let errorText = `Request failed with status ${statusCode}`;
      try {
        const errorData = await response.json();
        errorText = errorData.message || JSON.stringify(errorData);
      } catch (e) { /* ignore json parse error for error response */ }

      return {
        endpointId: endpoint.id,
        overallStatus: 'Error',
        responseTimeMs,
        statusCode,
        lastChecked: new Date().toISOString(),
        services: [],
        error: errorText,
      };
    }

    const data = await response.json();

    // Assuming data matches the specified /health/ready structure
    const services: ApiServiceHealth[] = (data.results || []).map((service: any) => ({
      source: service.source,
      status: service.status as "Healthy" | "Unhealthy",
      description: service.description,
      metrics: service.metrics, // if any
    }));

    return {
      endpointId: endpoint.id,
      overallStatus: data.status as "Healthy" | "Unhealthy",
      responseTimeMs,
      statusCode,
      lastChecked: new Date().toISOString(),
      services,
    };
  } catch (error: any) {
    responseTimeMs = responseTimeMs || (Date.now() - startTime);
    let errorMessage = 'Network error or invalid response';
    if (error.name === 'AbortError') {
        errorMessage = 'Request timed out';
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }

    return {
      endpointId: endpoint.id,
      overallStatus: 'Error',
      responseTimeMs,
      lastChecked: new Date().toISOString(),
      services: [],
      error: errorMessage,
      statusCode, // Will be undefined if fetch itself failed before getting a response
    };
  }
};

export const HEALTH_QUERY_KEY_PREFIX = 'apiHealth';

export function useApiHealth(endpoint: ApiEndpoint | null) {
  return useQuery<ApiHealthStatus, Error>({
    queryKey: [HEALTH_QUERY_KEY_PREFIX, endpoint?.id],
    queryFn: () => {
      if (!endpoint) { // Should not happen if enabled is set correctly
        return Promise.resolve({
            endpointId: '',
            overallStatus: 'Pending',
            lastChecked: new Date().toISOString(),
            services: []
        } as ApiHealthStatus);
      }
      return fetchApiHealth(endpoint);
    },
    enabled: !!endpoint, // Only run query if endpoint is provided
    refetchInterval: 60000, // Refetch every 60 seconds
  });
}

// Hook for fetching health of multiple APIs
export function useMultipleApiHealth(endpoints: ApiEndpoint[]) {
    const queries = endpoints.map(endpoint => {
        return {
            queryKey: [HEALTH_QUERY_KEY_PREFIX, endpoint.id],
            queryFn: () => fetchApiHealth(endpoint),
            enabled: !!endpoint,
            refetchInterval: 60000, // Refetch every 60 seconds
        };
    });
    
    const queryResults = useQueries({ queries }) as UseQueryResult<ApiHealthStatus, Error>[];
    
    const healthStatuses = queryResults.map(q => q.data).filter(Boolean) as ApiHealthStatus[];
    const isLoading = queryResults.some(q => q.isLoading);
    const isRefreshing = queryResults.some(q => q.isFetching);
    
    const refetchAll = () => {
        queryResults.forEach(q => q.refetch());
    };

    return { healthStatuses, isLoading, isRefreshing, refetchAll };
}
