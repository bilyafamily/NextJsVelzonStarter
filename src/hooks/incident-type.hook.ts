import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createIncidentType,
  deleteIncidentType,
  getIncidentTypes,
  updateIncidentType,
} from "src/services/incident-type.service";
import { CreateNameItemDto, UpdateNameItemDto } from "src/types/incident";

export const incidentTypeKeys = {
  all: ["incidentTypes"] as const,
  lists: () => [...incidentTypeKeys.all, "list"] as const,
  list: (filters: string) =>
    [...incidentTypeKeys.lists(), { filters }] as const,
  details: () => [...incidentTypeKeys.all, "detail"] as const,
  detail: (id: string) => [...incidentTypeKeys.details(), id] as const,
};

export function useGetIncidentTypes() {
  return useQuery({
    queryKey: ["incidentTypes"],
    queryFn: getIncidentTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    select: data => data?.result,
  });
}

// Hook to create a new incidentType
export function useCreateIncidentType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNameItemDto) => createIncidentType(data),
    onSuccess: data => {
      // Invalidate and refetch incidentTypes list
      queryClient.invalidateQueries({ queryKey: incidentTypeKeys.lists() });

      toast.success(`Incident type created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create incident type: ${error.message}`);
    },
  });
}

// Hook to update a incidentType
export function useUpdateIncidentType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateNameItemDto) => updateIncidentType(data),
    onSuccess: (data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: incidentTypeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: incidentTypeKeys.detail(variables.id),
      });
      console.log("data", data);
      console.log("variables", variables);

      toast.success(`Incident type "${variables?.name}" updated successfully`);
    },
    onError: (error: Error, variables) => {
      toast.error(`Failed to update incidentType: ${error.message}`);
    },
  });
}

// Hook to delete a incidentType
export function useDeleteIncidentType() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteIncidentType(id),
    onSuccess: (_, id) => {
      // Invalidate incidentTypes list
      queryClient.invalidateQueries({ queryKey: incidentTypeKeys.lists() });

      // Remove the deleted incidentType from cache
      queryClient.removeQueries({ queryKey: incidentTypeKeys.detail(id) });

      toast.success("Incident type deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete incidentType: ${error.message}`);
    },
  });
}
