import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createFacilityType,
  deleteFacilityType,
  getFacilityTypes,
  updateFacilityType,
} from "src/services/facility-type.service";
import { CreateNameItemDto, UpdateNameItemDto } from "src/types/incident";

export const facilityTypeKeys = {
  all: ["facilityTypes"] as const,
  lists: () => [...facilityTypeKeys.all, "list"] as const,
  list: (filters: string) =>
    [...facilityTypeKeys.lists(), { filters }] as const,
  details: () => [...facilityTypeKeys.all, "detail"] as const,
  detail: (id: string) => [...facilityTypeKeys.details(), id] as const,
};

export function useGetFacilityTypes() {
  return useQuery({
    queryKey: ["facilityTypes"],
    queryFn: getFacilityTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    select: data => data?.result,
  });
}

// Hook to create a new facilityType
export function useCreateFacilityType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNameItemDto) => createFacilityType(data),
    onSuccess: data => {
      // Invalidate and refetch facilityTypes list
      queryClient.invalidateQueries({ queryKey: facilityTypeKeys.lists() });

      toast.success(`Facility type created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create facility type: ${error.message}`);
    },
  });
}

// Hook to update a facilityType
export function useUpdateFacilityType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateNameItemDto) => updateFacilityType(data),
    onSuccess: (data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: facilityTypeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: facilityTypeKeys.detail(variables.id),
      });
      console.log("data", data);
      console.log("variables", variables);

      toast.success(`Facility type "${variables?.name}" updated successfully`);
    },
    onError: (error: Error, variables) => {
      toast.error(`Failed to update facility Type: ${error.message}`);
    },
  });
}

// Hook to delete a facilityType
export function useDeleteFacilityType() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteFacilityType(id),
    onSuccess: (_, id) => {
      // Invalidate facilityTypes list
      queryClient.invalidateQueries({ queryKey: facilityTypeKeys.lists() });

      // Remove the deleted facilityType from cache
      queryClient.removeQueries({ queryKey: facilityTypeKeys.detail(id) });

      toast.success("Facility type deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete facilityType: ${error.message}`);
    },
  });
}
