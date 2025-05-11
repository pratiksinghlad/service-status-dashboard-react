
'use client';

import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import type { ApiEndpoint, ApiHealthStatus, ApiServiceHealth } from '@/types';
import axios, { AxiosError } from 'axios';

const fetchApiHealth = async (endpoint: ApiEndpoint): Promise<ApiHealthStatus> => {
  const startTime = Date.now();
  let responseTimeMs: number | undefined;
  let statusCode: number | undefined;

  try {
    const response = await axios.get(endpoint.url, { timeout: 5000 }); // 5s timeout
    responseTimeMs = Date.now() - startTime;
    statusCode = response.status;
    const data = response.data;

    // Assuming data matches the specified /health/ready structure
    const services: ApiServiceHealth[] = (data.results || []).map((service: any) => ({
      source: service.source,
      status: service.status as "Healthy" | "Unhealthy" | "Pending",
      description: service.description,
      metrics: service.metrics, // if any
    }));

    return {
      endpointId: endpoint.id,
      overallStatus: data.status as "Healthy" | "Unhealthy" | "Pending",
      responseTimeMs,
      statusCode,
      lastChecked: new Date().toISOString(),
      services,
    };
  } catch (error: any) {
    responseTimeMs = responseTimeMs || (Date.now() - startTime);
    let errorMessage = 'Network error or invalid response';
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        statusCode = axiosError.response.status;
        try {
            const errorData = axiosError.response.data as any;
            errorMessage = errorData?.message || JSON.stringify(errorData) || `Request failed with status ${statusCode}`;
        } catch (e) {
            errorMessage = `Request failed with status ${statusCode}`;
        }
      } else if (axiosError.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from server. Request timed out or network issue.';
         if (axiosError.code === 'ECONNABORTED') {
            errorMessage = 'Request timed out';
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = axiosError.message;
      }
    } else if (error.name === 'AbortError') { // For fetch's AbortSignal, though axios uses its own timeout
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
      statusCode, 
    };
  }
};

export const HEALTH_QUERY_KEY_PREFIX = 'apiHealth';

// Hook for fetching health of multiple APIs
export function useMultipleApiHealth(endpoints: ApiEndpoint[]) {
    const queryResults = useQueries({ 
        queries: endpoints.map(endpoint => {
            return {
                queryKey: [HEALTH_QUERY_KEY_PREFIX, endpoint.id],
                queryFn: () => fetchApiHealth(endpoint),
                enabled: !!endpoint,
                refetchInterval: 60000, // Refetch every 60 seconds
            };
        })
    }) as UseQueryResult<ApiHealthStatus, Error>[];
    
    const healthStatuses = queryResults.map(q => q.data).filter(Boolean) as ApiHealthStatus[];
    const isLoading = queryResults.some(q => q.isLoading && q.fetchStatus !== 'idle');
    const isRefreshing = queryResults.some(q => q.isFetching);
    
    const refetchAll = () => {
        queryResults.forEach(q => q.refetch());
    };

    return { healthStatuses, isLoading, isRefreshing, refetchAll };
}
