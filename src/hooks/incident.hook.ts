import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useBackendApiClient } from "./backendApiClient.hook";
import { IncidentReport, IncidentReportList } from "src/types/incident";
import { QueryParams, ResponseDto } from "src/types/common";

export const INCIDENT_KEYS = {
  all: ["incidents"] as const,
  lists: () => [...INCIDENT_KEYS.all, "list"] as const,
  list: (filters: string) => [...INCIDENT_KEYS.lists(), { filters }] as const,
  details: () => [...INCIDENT_KEYS.all, "detail"] as const,
  detail: (id: string) => [...INCIDENT_KEYS.details(), id] as const,
};

export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  const { postFormData } = useBackendApiClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await postFormData<ResponseDto<IncidentReport>>(
        `/incidentReports`,
        formData
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INCIDENT_KEYS.all] });
      toast.success(`incident created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create facility type: ${error.message}`);
    },
  });
};

export const useGetIncidents = (params: QueryParams = {}) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: INCIDENT_KEYS.lists(),
    queryFn: async () => {
      const response = await get<ResponseDto<IncidentReportList[]>>(
        "/incidentReports",
        {
          params,
        }
      );
      return response.result;
    },
    staleTime: 5 * 60 * 1000, // 2 minutes for frequently updated data
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

export const useGetIncidentById = (id: string) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: INCIDENT_KEYS.detail(id),
    queryFn: async () => {
      const response = await get<ResponseDto<IncidentReport>>(
        `/incidentReports/${id}`
      );
      return response;
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Mutations
export const useDeleteIncident = () => {
  const queryClient = useQueryClient();
  const { deleteItem } = useBackendApiClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteItem<ResponseDto<void>>(
        `/incidentReports/${id}`
      );
      return response;
    },
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: INCIDENT_KEYS.lists() });
      queryClient.removeQueries({ queryKey: INCIDENT_KEYS.detail(id) });
      toast.success(response?.message || "Incident deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting incident:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete incident"
      );
    },
  });
};

export const useUpdateIncidentStatus = () => {
  const queryClient = useQueryClient();
  const { patch } = useBackendApiClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await patch<ResponseDto<IncidentReport>>(
        `/incidentReports/${id}/status`,
        { status }
      );
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: INCIDENT_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: INCIDENT_KEYS.detail(variables.id),
        });
      }
      toast.success(
        response?.message || "Incident status updated successfully"
      );
    },
    onError: (error: any) => {
      console.error("Error updating incident status:", error);
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });
};

export const useAssignIncidentToDesk = () => {
  const queryClient = useQueryClient();
  const { patch } = useBackendApiClient();

  return useMutation({
    mutationFn: async ({ id, desk }: { id: string; desk: string }) => {
      const response = await patch<ResponseDto<IncidentReport>>(
        `/incidentReports/${id}/assign`,
        { currentDesk: desk }
      );
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: INCIDENT_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: INCIDENT_KEYS.detail(variables.id),
        });
      }
      toast.success(response?.message || "Incident assigned successfully");
    },
    onError: (error: any) => {
      console.error("Error assigning incident:", error);
      toast.error(
        error?.response?.data?.message || "Failed to assign incident"
      );
    },
  });
};
