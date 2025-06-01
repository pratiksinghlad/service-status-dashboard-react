import { DBSchema, openDB, IDBPDatabase } from 'idb';
import type { ApiEndpoint, Environment } from '@/types';
import { DB_NAME, API_ENDPOINTS_STORE_NAME, DB_VERSION, PRECONFIGURED_APIS } from '@/config/constants';

interface HealthCheckDB extends DBSchema {
  [API_ENDPOINTS_STORE_NAME]: {
    key: string;
    value: ApiEndpoint;
    indexes: { environment: Environment };
  };
}

let dbPromise: Promise<IDBPDatabase<HealthCheckDB>> | null = null;

function getDb(): Promise<IDBPDatabase<HealthCheckDB>> {
  if (!dbPromise) {
    dbPromise = openDB<HealthCheckDB>(DB_NAME, DB_VERSION, {
      upgrade(db, _oldVersion, _newVersion, _transaction) {
        if (!db.objectStoreNames.contains(API_ENDPOINTS_STORE_NAME)) {
          const store = db.createObjectStore(API_ENDPOINTS_STORE_NAME, {
            keyPath: 'id',
            autoIncrement: false, // We'll generate IDs
          });
          store.createIndex('environment', 'environment');
        }
      },
    });
  }
  return dbPromise;
}


export async function initializePreconfiguredApis(): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(API_ENDPOINTS_STORE_NAME, 'readwrite');
  const store = tx.objectStore(API_ENDPOINTS_STORE_NAME);
  const allEndpoints = await store.getAll();

  for (const preconfApi of PRECONFIGURED_APIS) {
    const existing = allEndpoints.find(ep => ep.name === preconfApi.name && ep.environment === preconfApi.environment);
    if (!existing) {
      await store.add({
        ...preconfApi,
        id: crypto.randomUUID(),
      });
    }
  }
  await tx.done;
}

export async function addApiEndpoint(endpointData: Omit<ApiEndpoint, 'id'>): Promise<ApiEndpoint> {
  const db = await getDb();
  const newEndpoint: ApiEndpoint = {
    ...endpointData,
    id: crypto.randomUUID(),
  };
  await db.add(API_ENDPOINTS_STORE_NAME, newEndpoint);
  return newEndpoint;
}

export async function getApiEndpointsByEnvironment(environment: Environment): Promise<ApiEndpoint[]> {
  const db = await getDb();
  return db.getAllFromIndex(API_ENDPOINTS_STORE_NAME, 'environment', environment);
}

export async function getAllApiEndpoints(): Promise<ApiEndpoint[]> {
  const db = await getDb();
  return db.getAll(API_ENDPOINTS_STORE_NAME);
}

export async function deleteApiEndpoint(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(API_ENDPOINTS_STORE_NAME, id);
}
