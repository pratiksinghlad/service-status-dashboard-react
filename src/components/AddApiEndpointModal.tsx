'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Environment, ApiEndpoint } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle } from 'lucide-react';

const apiEndpointSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }).max(50),
  url: z.string().url({ message: "Invalid URL format." }),
  environment: z.enum(["Dev", "Stage", "Prod"], { message: "Please select an environment." }),
});

type ApiEndpointFormData = z.infer<typeof apiEndpointSchema>;

interface AddApiEndpointModalProps {
  currentEnvironment: Environment;
  environments: Environment[];
  onAddEndpoint: (data: Omit<ApiEndpoint, 'id'>) => Promise<void>;
  isAdding: boolean;
}

export function AddApiEndpointModal({ currentEnvironment, environments, onAddEndpoint, isAdding }: AddApiEndpointModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApiEndpointFormData>({
    resolver: zodResolver(apiEndpointSchema),
    defaultValues: {
      name: '',
      url: '',
      environment: currentEnvironment,
    },
  });
  
  // Update default environment when currentEnvironment prop changes and form is not dirty
  // This is useful if the modal is kept mounted and user changes global environment
  useEffect(() => {
     if (!form.formState.isDirty) {
      form.reset({ environment: currentEnvironment, name: '', url: '' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEnvironment, form.reset, form.formState.isDirty]);


  async function onSubmit(data: ApiEndpointFormData) {
    try {
      await onAddEndpoint(data);
      toast({
        title: "API Endpoint Added",
        description: `${data.name} has been successfully added.`,
      });
      setIsOpen(false);
      form.reset({ name: '', url: '', environment: currentEnvironment }); // Reset form after successful submission
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add API endpoint: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add API Endpoint
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New API Endpoint</DialogTitle>
          <DialogDescription>
            Enter the details for the API endpoint you want to monitor.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., User Service API" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://api.example.com/health" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="environment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Environment</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {environments.map(env => (
                        <SelectItem key={env} value={env}>{env}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? 'Adding...' : 'Add Endpoint'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
