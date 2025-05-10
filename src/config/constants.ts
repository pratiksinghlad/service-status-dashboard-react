import type { Environment, ApiEndpoint } from '@/types';

export const ENVIRONMENTS: Environment[] = ["Dev", "Stage", "Prod"];

export const DB_NAME = "HealthCheckDB";
export const API_ENDPOINTS_STORE_NAME = "apiEndpoints";
export const DB_VERSION = 1;

export interface PreconfiguredApi {
  name: string;
  url: string;
  environment: Environment;
}

export const PRECONFIGURED_APIS: PreconfiguredApi[] = [
  { name: "Auth Service (Dev)", url: "https://mock.api/dev/auth/health/ready", environment: "Dev" },
  { name: "User Service (Dev)", url: "https://mock.api/dev/user/health/ready", environment: "Dev" },
  { name: "Payment Gateway (Stage)", url: "https://mock.api/stage/payment/health/ready", environment: "Stage" },
  { name: "Order Processor (Prod)", url: "https://mock.api/prod/order/health/ready", environment: "Prod" },
  { name: "Notification Hub (Prod)", url: "https://mock.api/prod/notification/health/ready", environment: "Prod" },
];

// Mock responses for preconfigured APIs
export const MOCK_API_RESPONSES: Record<string, { status: string; results: any[] }> = {
  "https://mock.api/dev/auth/health/ready": {
    status: "Healthy",
    results: [
      { source: "Database", status: "Healthy", description: "Connection successful." },
      { source: "Redis Cache", status: "Healthy", description: "Connection successful." },
    ],
  },
  "https://mock.api/dev/user/health/ready": {
    status: "Unhealthy",
    results: [
      { source: "PostgreSQL", status: "Unhealthy", description: "Failed to connect to database." },
      { source: "Elasticsearch", status: "Healthy", description: "Cluster status green." },
    ],
  },
  "https://mock.api/stage/payment/health/ready": {
    status: "Healthy",
    results: [
      { source: "Stripe API", status: "Healthy", description: "API responding normally." },
      { source: "Fraud Detection Model", status: "Healthy", description: "Model loaded and operational." },
    ],
  },
  "https://mock.api/prod/order/health/ready": {
    status: "Healthy",
    results: [
      { source: "Order DB", status: "Healthy", description: "Primary replica synced." },
      { source: "Inventory Service", status: "Healthy", description: "API responding." },
    ],
  },
  "https://mock.api/prod/notification/health/ready": {
    status: "Unhealthy",
    results: [
      { source: "Email Sender", status: "Healthy", description: "SMTP server connected." },
      { source: "SMS Gateway", status: "Unhealthy", description: "Provider API timeout." },
      { source: "Push Service", status: "Healthy", description: "Firebase connection active." },
    ],
  },
};
