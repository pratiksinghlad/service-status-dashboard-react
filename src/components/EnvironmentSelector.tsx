'use client';

import type { Environment } from '@/types';
import { useEnvironment } from '@/hooks/useEnvironment';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function EnvironmentSelector() {
  const { currentEnvironment, setEnvironment, isInitialized, environments } = useEnvironment();

  if (!isInitialized) {
    return (
      <div className="flex items-center space-x-2">
        <Label htmlFor="env-selector">Environment:</Label>
        <div className="w-[120px] h-10 bg-gray-300 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="env-selector" className="text-sm font-medium">Environment:</Label>
      <Select
        value={currentEnvironment}
        onValueChange={(value: Environment) => setEnvironment(value)}
      >
        <SelectTrigger id="env-selector" className="w-[120px] h-10">
          <SelectValue placeholder="Select Env" />
        </SelectTrigger>
        <SelectContent>
          {environments.map((env) => (
            <SelectItem key={env} value={env}>
              {env}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
