export type Environment = "Dev" | "Stage" | "Prod";

export interface ApiEndpoint {
  id: string;
  name: string;
  url: string;
  environment: Environment;
}

export interface ApiServiceHealth {
  source: string;
  status: "Healthy" | "Unhealthy" | "Pending";
  description?: string;
  metrics?: Record<string, unknown>; // For service-specific metrics
}

export interface ApiHealthStatus {
  endpointId: string;
  overallStatus: "Healthy" | "Unhealthy" | "Pending" | "Error";
  responseTimeMs?: number;
  statusCode?: number;
  lastChecked: string; // ISO string date
  services: ApiServiceHealth[];
  error?: string; // For general fetch/parsing errors
}
