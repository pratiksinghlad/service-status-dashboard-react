'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Environment } from '@/types';
import { ENVIRONMENTS } from '@/config/constants';

const LOCAL_STORAGE_KEY = 'healthcheck-environment';

export function useEnvironment() {
  const [currentEnvironment, setCurrentEnvironment] = useState<Environment>(ENVIRONMENTS[0]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedEnvironment = localStorage.getItem(LOCAL_STORAGE_KEY) as Environment | null;
    if (storedEnvironment && ENVIRONMENTS.includes(storedEnvironment)) {
      setCurrentEnvironment(storedEnvironment);
    }
    setIsInitialized(true);
  }, []);

  const setEnvironment = useCallback((env: Environment) => {
    if (ENVIRONMENTS.includes(env)) {
      setCurrentEnvironment(env);
      localStorage.setItem(LOCAL_STORAGE_KEY, env);
    }
  }, []);

  return { currentEnvironment, setEnvironment, isInitialized, environments: ENVIRONMENTS };
}
