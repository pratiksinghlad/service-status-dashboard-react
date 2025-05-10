'use client';

import type { ApiHealthStatus, ApiServiceHealth } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, AlertTriangle, Hourglass } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ApiDetailModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  healthStatus: ApiHealthStatus | null;
  apiName?: string;
}

const StatusIcon = ({ status }: { status: ApiServiceHealth['status'] }) => {
  switch (status) {
    case 'Healthy':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'Unhealthy':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'Pending':
       return <Hourglass className="h-5 w-5 text-yellow-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-gray-500" />;
  }
};

export function ApiDetailModal({ isOpen, onOpenChange, healthStatus, apiName }: ApiDetailModalProps) {
  if (!healthStatus) return null;

  const overallStatusVariant = 
    healthStatus.overallStatus === 'Healthy' ? 'default' :
    healthStatus.overallStatus === 'Unhealthy' ? 'destructive' :
    healthStatus.overallStatus === 'Error' ? 'destructive' :
    'secondary';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {apiName || `API ID: ${healthStatus.endpointId}`} - Details
          </DialogTitle>
          <DialogDescription>
            Detailed health status and service breakdown. Last checked: {formatDistanceToNow(new Date(healthStatus.lastChecked), { addSuffix: true })}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-sm">
          <div><strong>Overall Status:</strong> <Badge variant={overallStatusVariant}>{healthStatus.overallStatus}</Badge></div>
          {healthStatus.statusCode && <div><strong>Status Code:</strong> {healthStatus.statusCode}</div>}
          {healthStatus.responseTimeMs !== undefined && <div><strong>Response Time:</strong> {healthStatus.responseTimeMs} ms</div>}
          {healthStatus.error && <div className="col-span-full"><strong>Error:</strong> <span className="text-red-600">{healthStatus.error}</span></div>}
        </div>

        {healthStatus.services && healthStatus.services.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-2 mb-2">Service Health</h3>
            <ScrollArea className="flex-grow rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Service/Source</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {healthStatus.services.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell><StatusIcon status={service.status} /></TableCell>
                      <TableCell className="font-medium">{service.source}</TableCell>
                      <TableCell>{service.description || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        )}
        {(!healthStatus.services || healthStatus.services.length === 0) && !healthStatus.error && (
          <p className="text-muted-foreground">No detailed service breakdown available.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
