import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { CreateNameItemDto, UpdateNameItemDto } from "src/types/incident";
import { useBackendApiClient } from "./backendApiClient.hook";
import { IncidentType, QueryParams, ResponseDto } from "src/types/common";

export const INCIDENT_TYPE_KEYS = {
  all: ["incidentTypes"] as const,
  lists: () => [...INCIDENT_TYPE_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...INCIDENT_TYPE_KEYS.lists(), { filters }] as const,
  details: () => [...INCIDENT_TYPE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...INCIDENT_TYPE_KEYS.details(), id] as const,
};

// Queries
export const useGetIncidentTypes = (params: QueryParams = {}) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: INCIDENT_TYPE_KEYS.all,
    queryFn: async () => {
      const response = await get<ResponseDto<IncidentType[]>>(
        "/incidentTypes",
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

export const useGetIncidentTypeById = (id: string) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: INCIDENT_TYPE_KEYS.detail(id),
    queryFn: async () => {
      const response = await get<ResponseDto<IncidentType>>(
        `/incidentTypes/${id}`
      );
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutations
export const useCreateIncidentType = () => {
  const { post } = useBackendApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNameItemDto) => {
      const response = await post<ResponseDto<IncidentType>>(
        "/incidentTypes",
        data
      );
      return response;
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: INCIDENT_TYPE_KEYS.lists() });
      toast.success(response?.message || "Incident type created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating incident type:", error);
      toast.error(
        error?.response?.data?.message || "Failed to create incident type"
      );
    },
  });
};

export const useUpdateIncidentType = () => {
  const queryClient = useQueryClient();
  const { put } = useBackendApiClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateNameItemDto) => {
      const response = await put<ResponseDto<IncidentType>>(
        `/incidentTypes/${id}`,
        data
      );
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: INCIDENT_TYPE_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: INCIDENT_TYPE_KEYS.detail(variables.id),
        });
      }
      toast.success(
        response?.message ||
          `Incident type "${variables?.name}" updated successfully`
      );
    },
    onError: (error: any, variables) => {
      console.error("Error updating incident type:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update incident type"
      );
    },
  });
};

export const useDeleteIncidentType = () => {
  const queryClient = useQueryClient();
  const { deleteItem } = useBackendApiClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteItem<ResponseDto<void>>(
        `/incidentTypes/${id}`
      );
      return response;
    },
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: INCIDENT_TYPE_KEYS.lists() });
      queryClient.removeQueries({ queryKey: INCIDENT_TYPE_KEYS.detail(id) });
      toast.success(response?.message || "Incident type deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting incident type:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete incident type"
      );
    },
  });
};
