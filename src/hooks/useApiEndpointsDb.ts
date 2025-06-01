'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ApiEndpoint, Environment } from '@/types';
import {
  addApiEndpoint as dbAddApiEndpoint,
  getApiEndpointsByEnvironment as dbGetApiEndpointsByEnvironment,
  getAllApiEndpoints as dbGetAllApiEndpoints,
  deleteApiEndpoint as dbDeleteApiEndpoint,
  initializePreconfiguredApis as dbInitializePreconfiguredApis,
} from '@/lib/db';

export const API_ENDPOINTS_QUERY_KEY = 'apiEndpoints';

export function useApiEndpointsDb(currentEnvironment: Environment) {
  const queryClient = useQueryClient();
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    async function initDb() {
      await dbInitializePreconfiguredApis();
      setIsDbInitialized(true);
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS_QUERY_KEY, currentEnvironment] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS_QUERY_KEY, 'all'] });
    }
    initDb();
  }, [queryClient, currentEnvironment]); // Added currentEnvironment to potentially re-verify if needed, though init is once

  const { data: endpoints = [], isLoading: isLoadingEndpoints } = useQuery<ApiEndpoint[]>({
    queryKey: [API_ENDPOINTS_QUERY_KEY, currentEnvironment],
    queryFn: () => dbGetApiEndpointsByEnvironment(currentEnvironment),
    enabled: isDbInitialized,
  });

  const { data: allEndpoints = [], isLoading: isLoadingAllEndpoints } = useQuery<ApiEndpoint[]>({
    queryKey: [API_ENDPOINTS_QUERY_KEY, 'all'],
    queryFn: dbGetAllApiEndpoints,
    enabled: isDbInitialized,
  });


  const addEndpointMutation = useMutation<ApiEndpoint, Error, Omit<ApiEndpoint, 'id'>>({
    mutationFn: dbAddApiEndpoint,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS_QUERY_KEY, data.environment] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS_QUERY_KEY, 'all'] });
    },
  });

  const deleteEndpointMutation = useMutation<void, Error, string>({
    mutationFn: dbDeleteApiEndpoint,
    onSuccess: (_, _deletedId) => {
      // To invalidate correctly, we need to know which environment it belonged to
      // Or just invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS_QUERY_KEY] });
    },
  });


  const addEndpoint = useCallback(
    async (endpointData: Omit<ApiEndpoint, 'id'>) => {
      return addEndpointMutation.mutateAsync(endpointData);
    },
    [addEndpointMutation]
  );

  const deleteEndpoint = useCallback(
    async (id: string) => {
      return deleteEndpointMutation.mutateAsync(id);
    },
    [deleteEndpointMutation]
  );

  return {
    endpoints,
    isLoadingEndpoints: isLoadingEndpoints || !isDbInitialized,
    allEndpoints,
    isLoadingAllEndpoints: isLoadingAllEndpoints || !isDbInitialized,
    addEndpoint,
    deleteEndpoint,
    isAddingEndpoint: addEndpointMutation.isPending,
    isDeletingEndpoint: deleteEndpointMutation.isPending,
  };
}
