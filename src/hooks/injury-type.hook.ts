import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CreateNameItemDto, UpdateNameItemDto } from "src/types/incident";
import { useBackendApiClient } from "./backendApiClient.hook";
import { InjuryType, QueryParams, ResponseDto } from "src/types/common";

export const INJURY_TYPE_KEYS = {
  all: ["injuryTypes"] as const,
  lists: () => [...INJURY_TYPE_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...INJURY_TYPE_KEYS.lists(), { filters }] as const,
  details: () => [...INJURY_TYPE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...INJURY_TYPE_KEYS.details(), id] as const,
};

// Queries
export const useGetInjuryTypes = (params: QueryParams = {}) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: INJURY_TYPE_KEYS.all,
    queryFn: async () => {
      const response = await get<ResponseDto<InjuryType[]>>("/injuryTypes", {
        params,
      });
      return response.result;
    },
  });
};

export const useGetInjuryTypeById = (id: string) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: INJURY_TYPE_KEYS.detail(id),
    queryFn: async () => {
      const response = await get<ResponseDto<InjuryType>>(`/injuryTypes/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

// Mutations
export const useCreateInjuryType = () => {
  const { post } = useBackendApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNameItemDto) => {
      const response = await post<ResponseDto<InjuryType>>(
        "/injuryTypes",
        data
      );
      return response;
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: INJURY_TYPE_KEYS.lists() });
      toast.success(response?.message || "Injury type created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating injury type:", error);
      toast.error(
        error?.response?.data?.message || "Failed to create injury type"
      );
    },
  });
};

export const useUpdateInjuryType = () => {
  const queryClient = useQueryClient();
  const { put } = useBackendApiClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateNameItemDto) => {
      const response = await put<ResponseDto<InjuryType>>(
        `/injuryTypes/${id}`,
        data
      );
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: INJURY_TYPE_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: INJURY_TYPE_KEYS.detail(variables.id),
        });
      }
      toast.success(response?.message || "Injury type updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating injury type:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update injury type"
      );
    },
  });
};

export const useDeleteInjuryType = () => {
  const queryClient = useQueryClient();
  const { deleteItem } = useBackendApiClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteItem<ResponseDto<void>>(
        `/injuryTypes/${id}`
      );
      return response;
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: INJURY_TYPE_KEYS.lists() });
      toast.success(response?.message || "Injury type deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting injury type:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete injury type"
      );
    },
  });
};
