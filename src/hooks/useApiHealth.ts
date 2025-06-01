
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
    const services: ApiServiceHealth[] = (data.results || []).map((service: Partial<ApiServiceHealth>) => ({
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
  } catch (error: unknown) {
    responseTimeMs = responseTimeMs || (Date.now() - startTime);
    let errorMessage = 'Network error or invalid response';
    
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError; // This is safe due to the isAxiosError check
      if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        statusCode = axiosError.response.status;
        try {
            // The structure of errorData is unknown, so using 'as any' here was a previous lint issue.
            // It's better to attempt to parse it or access properties safely.
            const errorData = axiosError.response.data;
            if (typeof errorData === 'string') {
              errorMessage = errorData;
            } else if (errorData && typeof errorData === 'object' && 'message' in errorData && typeof errorData.message === 'string') {
              errorMessage = errorData.message;
            } else {
              try {
                errorMessage = JSON.stringify(errorData) || `Request failed with status ${statusCode}`;
              } catch {
                 errorMessage = `Request failed with status ${statusCode} (and error data was not stringifiable)`;
              }
            }
        } catch (_e) { // Catch for JSON.stringify or other issues if errorData is complex
            errorMessage = `Request failed with status ${statusCode} (parsing error data failed)`;
        }
      } else if (axiosError.request) {
        // The request was made but no response was received
        errorMessage = 'No response received from server. Request timed out or network issue.';
         if (axiosError.code === 'ECONNABORTED') {
            errorMessage = 'Request timed out';
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = axiosError.message; // This is safe as AxiosError has a message
      }
    } else if (error instanceof Error) { // Check if it's a generic Error
        errorMessage = error.message;
    } else if (typeof error === 'string') { // Handle if the error is just a string
        errorMessage = error;
    }
    // Note: The check for error.name === 'AbortError' might be problematic if error is not an Error instance.
    // However, axios.isAxiosError already covers many timeout scenarios (e.g. ECONNABORTED).
    // If AbortError is from a non-Error object, it would need a more specific check.


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
