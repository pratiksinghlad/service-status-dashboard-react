
import type { Environment } from '@/types';

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
