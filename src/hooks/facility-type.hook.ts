import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CreateNameItemDto, UpdateNameItemDto } from "src/types/incident";
import { useBackendApiClient } from "./backendApiClient.hook";
import { FacilityType, QueryParams, ResponseDto } from "src/types/common";

export const FACILITY_TYPE_KEYS = {
  all: ["facilityTypes"] as const,
  lists: () => [...FACILITY_TYPE_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...FACILITY_TYPE_KEYS.lists(), { filters }] as const,
  details: () => [...FACILITY_TYPE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...FACILITY_TYPE_KEYS.details(), id] as const,
};

// Queries
export const useGetFacilityTypes = (params: QueryParams = {}) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: FACILITY_TYPE_KEYS.all,
    queryFn: async () => {
      const response = await get<ResponseDto<FacilityType[]>>(
        "/facilityTypes",
        {
          params,
        }
      );
      return response.result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

export const useGetFacilityTypeById = (id: string) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: FACILITY_TYPE_KEYS.detail(id),
    queryFn: async () => {
      const response = await get<ResponseDto<FacilityType>>(
        `/facilityTypes/${id}`
      );
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutations
export const useCreateFacilityType = () => {
  const { post } = useBackendApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNameItemDto) => {
      const response = await post<ResponseDto<FacilityType>>(
        "/facilityTypes",
        data
      );
      return response;
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: FACILITY_TYPE_KEYS.lists() });
      toast.success(response?.message || "Facility type created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating facility type:", error);
      toast.error(
        error?.response?.data?.message || "Failed to create facility type"
      );
    },
  });
};

export const useUpdateFacilityType = () => {
  const queryClient = useQueryClient();
  const { put } = useBackendApiClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateNameItemDto) => {
      const response = await put<ResponseDto<FacilityType>>(
        `/facilityTypes/${id}`,
        data
      );
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: FACILITY_TYPE_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: FACILITY_TYPE_KEYS.detail(variables.id),
        });
      }
      toast.success(
        response?.message ||
          `Facility type "${variables?.name}" updated successfully`
      );
    },
    onError: (error: any, variables) => {
      console.error("Error updating facility type:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update facility type"
      );
    },
  });
};

export const useDeleteFacilityType = () => {
  const queryClient = useQueryClient();
  const { deleteItem } = useBackendApiClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteItem<ResponseDto<void>>(
        `/facilityTypes/${id}`
      );
      return response;
    },
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: FACILITY_TYPE_KEYS.lists() });
      queryClient.removeQueries({ queryKey: FACILITY_TYPE_KEYS.detail(id) });
      toast.success(response?.message || "Facility type deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting facility type:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete facility type"
      );
    },
  });
};
