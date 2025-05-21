'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { AppHeader } from '@/components/AppHeader';
import { DashboardOverview } from '@/components/DashboardOverview';
import { ApiEndpointList } from '@/components/ApiEndpointList';
import { useEnvironment } from '@/hooks/useEnvironment';
import { useApiEndpointsDb } from '@/hooks/useApiEndpointsDb';
import { useMultipleApiHealth, HEALTH_QUERY_KEY_PREFIX } from '@/hooks/useApiHealth';
import type { ApiHealthStatus, ApiEndpoint as ApiEndpointType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button'; 
import { PlusCircle } from 'lucide-react'; 
import { useTranslation } from 'next-i18next'; // Added import

// Lazy loaded components
const AddApiEndpointModal = dynamic(() => import('@/components/AddApiEndpointModal').then(mod => mod.AddApiEndpointModal), {
  ssr: false,
  // Note: The loading prop here is a function that returns JSX.
  // To translate "Loading...", we'd ideally call useTranslation within this function.
  // However, hooks can only be called inside the body of a function component.
  // A simple approach is to pass `t` or handle it inside AddApiEndpointModal if it were more complex.
  // For now, leaving "Loading..." as is, as it's a transient state, or it could be made generic like "Please wait..."
  // A more advanced solution would involve a small wrapper component for the loading state that uses `t`.
  loading: () => <Button disabled><PlusCircle className="mr-2 h-4 w-4" /> Loading...</Button>
});

const ApiDetailModal = dynamic(() => import('@/components/ApiDetailModal').then(mod => mod.ApiDetailModal), {
  ssr: false,
});


export default function HealthCheckDashboardPage() {
  const { t } = useTranslation('common'); // Initialized useTranslation
  const { currentEnvironment, isInitialized: envInitialized, environments } = useEnvironment();
  const { 
    endpoints, 
    isLoadingEndpoints, 
    allEndpoints, 
    addEndpoint, 
    deleteEndpoint,
    isAddingEndpoint,
    isDeletingEndpoint
  } = useApiEndpointsDb(currentEnvironment);
  
  const { healthStatuses, isLoading: isLoadingHealth, isRefreshing, refetchAll } = useMultipleApiHealth(endpoints);

  const [selectedApiHealth, setSelectedApiHealth] = useState<ApiHealthStatus | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [globalLastCheckedTimestamp, setGlobalLastCheckedTimestamp] = useState<string | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (healthStatuses.length > 0 && !isLoadingHealth) {
      const validStatuses = healthStatuses.filter(status => status.lastChecked && !isNaN(new Date(status.lastChecked).getTime()));
      if (validStatuses.length > 0) {
        const latestTimestamp = validStatuses.reduce((latest, current) => {
          const currentDate = new Date(current.lastChecked);
          const latestDate = new Date(latest.lastChecked);
          return currentDate > latestDate ? current : latest;
        }).lastChecked;
        setGlobalLastCheckedTimestamp(latestTimestamp);
      } else {
         setGlobalLastCheckedTimestamp(null);
      }
    } else if (healthStatuses.length === 0 && !isLoadingHealth) { 
      setGlobalLastCheckedTimestamp(null);
    }
  }, [healthStatuses, isLoadingHealth]);

  const handleViewDetails = useCallback((status: ApiHealthStatus) => {
    setSelectedApiHealth(status);
    setIsDetailModalOpen(true);
  }, []);
  
  const handleAddEndpoint = useCallback(async (data: Omit<ApiEndpointType, 'id'>) => {
    await addEndpoint(data);
  }, [addEndpoint]);

  const handleDeleteEndpoint = useCallback(async (id: string) => {
    try {
      const endpointToDelete = endpoints.find(ep => ep.id === id) || allEndpoints.find(ep => ep.id === id);
      await deleteEndpoint(id);
      queryClient.removeQueries({ queryKey: [HEALTH_QUERY_KEY_PREFIX, id] });
      toast({
        title: "API Endpoint Deleted", // Potential for translation
        description: `${endpointToDelete?.name || 'Endpoint'} has been successfully deleted.`, // Potential for translation
      });
    } catch (error) {
       toast({
        title: "Error Deleting Endpoint", // Potential for translation
        description: error instanceof Error ? error.message : "Could not delete the endpoint.", // Potential for translation
        variant: "destructive",
      });
    }
  }, [endpoints, allEndpoints, deleteEndpoint, queryClient, toast]);

  const isLoadingInitialData = (!envInitialized || isLoadingEndpoints);

  const handleGlobalRefresh = useCallback(() => {
    refetchAll();
  }, [refetchAll]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader 
        onRefreshAll={handleGlobalRefresh} 
        isRefreshing={isRefreshing}
        globalLastCheckedTimestamp={globalLastCheckedTimestamp} 
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          {/* Translated Dashboard Title */}
          <h2 className="text-3xl font-semibold text-foreground">{t('dashboardTitle')} ({currentEnvironment})</h2>
          {envInitialized && (
            <AddApiEndpointModal
              currentEnvironment={currentEnvironment}
              environments={environments}
              onAddEndpoint={handleAddEndpoint}
              isAdding={isAddingEndpoint}
              // The button text "Add API Endpoint" is inside AddApiEndpointModal component.
              // It would need to be modified there, or accept a translated prop.
            />
          )}
        </div>

        <DashboardOverview 
          apiEndpoints={endpoints} 
          healthStatuses={healthStatuses} 
          isLoading={isLoadingInitialData || isLoadingHealth}
        />
        
        <ApiEndpointList
          endpoints={endpoints}
          healthData={{ statuses: healthStatuses, isLoading: isLoadingInitialData || isLoadingHealth }}
          onViewDetails={handleViewDetails}
          onDeleteEndpoint={handleDeleteEndpoint}
          isDeletingEndpoint={isDeletingEndpoint}
        />
      </main>

      {selectedApiHealth && isDetailModalOpen && ( 
        <ApiDetailModal
          isOpen={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
          healthStatus={selectedApiHealth}
          apiName={endpoints.find(ep => ep.id === selectedApiHealth.endpointId)?.name}
        />
      )}
    </div>
  );
}
