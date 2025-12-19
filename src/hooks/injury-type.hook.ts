import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createInjuryType,
  deleteInjuryType,
  getInjuryTypes,
  updateInjuryType,
} from "src/services/injury-type.service";
import { CreateNameItemDto, UpdateNameItemDto } from "src/types/incident";

export const injuryTypeKeys = {
  all: ["injuryTypes"] as const,
  lists: () => [...injuryTypeKeys.all, "list"] as const,
  list: (filters: string) => [...injuryTypeKeys.lists(), { filters }] as const,
  details: () => [...injuryTypeKeys.all, "detail"] as const,
  detail: (id: string) => [...injuryTypeKeys.details(), id] as const,
};

export function useGetInjuryTypes() {
  return useQuery({
    queryKey: ["injuryTypes"],
    queryFn: getInjuryTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    select: data => data?.result,
  });
}

// Hook to create a new injuryType
export function useCreateInjuryType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNameItemDto) => createInjuryType(data),
    onSuccess: data => {
      // Invalidate and refetch injuryTypes list
      queryClient.invalidateQueries({ queryKey: injuryTypeKeys.lists() });

      toast.success(`Injury type created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create injury type: ${error.message}`);
    },
  });
}

// Hook to update a injuryType
export function useUpdateInjuryType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateNameItemDto) => updateInjuryType(data),
    onSuccess: (data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: injuryTypeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: injuryTypeKeys.detail(variables.id),
      });
      console.log("data", data);
      console.log("variables", variables);

      toast.success(`Injury type "${variables?.name}" updated successfully`);
    },
    onError: (error: Error, variables) => {
      toast.error(`Failed to update injuryType: ${error.message}`);
    },
  });
}

// Hook to delete a injuryType
export function useDeleteInjuryType() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteInjuryType(id),
    onSuccess: (_, id) => {
      // Invalidate injuryTypes list
      queryClient.invalidateQueries({ queryKey: injuryTypeKeys.lists() });

      // Remove the deleted injuryType from cache
      queryClient.removeQueries({ queryKey: injuryTypeKeys.detail(id) });

      toast.success("Injury type deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete injuryType: ${error.message}`);
    },
  });
}
