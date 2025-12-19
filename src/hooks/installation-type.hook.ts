import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createInstallationType,
  deleteInstallationType,
  getInstallationTypes,
  updateInstallationType,
} from "src/services/installation-type.service";
import { CreateNameItemDto, UpdateNameItemDto } from "src/types/incident";

export const installationTypeKeys = {
  all: ["installationTypes"] as const,
  lists: () => [...installationTypeKeys.all, "list"] as const,
  list: (filters: string) =>
    [...installationTypeKeys.lists(), { filters }] as const,
  details: () => [...installationTypeKeys.all, "detail"] as const,
  detail: (id: string) => [...installationTypeKeys.details(), id] as const,
};

export function useGetInstallationTypes() {
  return useQuery({
    queryKey: ["installationTypes"],
    queryFn: getInstallationTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    select: data => data?.result,
  });
}

// Hook to create a new installationType
export function useCreateInstallationType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNameItemDto) => createInstallationType(data),
    onSuccess: data => {
      // Invalidate and refetch installationTypes list
      queryClient.invalidateQueries({ queryKey: installationTypeKeys.lists() });

      toast.success(`Installation type created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create installation type: ${error.message}`);
    },
  });
}

// Hook to update a installationType
export function useUpdateInstallationType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateNameItemDto) => updateInstallationType(data),
    onSuccess: (data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: installationTypeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: installationTypeKeys.detail(variables.id),
      });
      console.log("data", data);
      console.log("variables", variables);

      toast.success(
        `Installation type "${variables?.name}" updated successfully`
      );
    },
    onError: (error: Error, variables) => {
      toast.error(`Failed to update installationType: ${error.message}`);
    },
  });
}

// Hook to delete a installationType
export function useDeleteInstallationType() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteInstallationType(id),
    onSuccess: (_, id) => {
      // Invalidate installationTypes list
      queryClient.invalidateQueries({ queryKey: installationTypeKeys.lists() });

      // Remove the deleted installationType from cache
      queryClient.removeQueries({ queryKey: installationTypeKeys.detail(id) });

      toast.success("Installation type deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete installationType: ${error.message}`);
    },
  });
}
