import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CreateNameItemDto, UpdateNameItemDto } from "src/types/incident";
import { useBackendApiClient } from "./backendApiClient.hook";
import { InstallationType, QueryParams, ResponseDto } from "src/types/common";

export const INSTALLATION_TYPE_KEYS = {
  all: ["installationTypes"] as const,
  lists: () => [...INSTALLATION_TYPE_KEYS.all, "list"] as const,
  list: (filters: string) =>
    [...INSTALLATION_TYPE_KEYS.lists(), { filters }] as const,
  details: () => [...INSTALLATION_TYPE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...INSTALLATION_TYPE_KEYS.details(), id] as const,
};

// Queries
export const useGetInstallationTypes = (params: QueryParams = {}) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: INSTALLATION_TYPE_KEYS.all,
    queryFn: async () => {
      const response = await get<ResponseDto<InstallationType[]>>(
        "/installationTypes",
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

export const useGetInstallationTypeById = (id: string) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: INSTALLATION_TYPE_KEYS.detail(id),
    queryFn: async () => {
      const response = await get<ResponseDto<InstallationType>>(
        `/installationTypes/${id}`
      );
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutations
export const useCreateInstallationType = () => {
  const { post } = useBackendApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNameItemDto) => {
      const response = await post<ResponseDto<InstallationType>>(
        "/installationTypes",
        data
      );
      return response;
    },
    onSuccess: response => {
      queryClient.invalidateQueries({
        queryKey: INSTALLATION_TYPE_KEYS.lists(),
      });
      toast.success(
        response?.message || "Installation type created successfully"
      );
    },
    onError: (error: any) => {
      console.error("Error creating installation type:", error);
      toast.error(
        error?.response?.data?.message || "Failed to create installation type"
      );
    },
  });
};

export const useUpdateInstallationType = () => {
  const queryClient = useQueryClient();
  const { put } = useBackendApiClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateNameItemDto) => {
      const response = await put<ResponseDto<InstallationType>>(
        `/installationTypes/${id}`,
        data
      );
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: INSTALLATION_TYPE_KEYS.lists(),
      });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: INSTALLATION_TYPE_KEYS.detail(variables.id),
        });
      }
      toast.success(
        response?.message ||
          `Installation type "${variables?.name}" updated successfully`
      );
    },
    onError: (error: any, variables) => {
      console.error("Error updating installation type:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update installation type"
      );
    },
  });
};

export const useDeleteInstallationType = () => {
  const queryClient = useQueryClient();
  const { deleteItem } = useBackendApiClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteItem<ResponseDto<void>>(
        `/installationTypes/${id}`
      );
      return response;
    },
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({
        queryKey: INSTALLATION_TYPE_KEYS.lists(),
      });
      queryClient.removeQueries({
        queryKey: INSTALLATION_TYPE_KEYS.detail(id),
      });
      toast.success(
        response?.message || "Installation type deleted successfully"
      );
    },
    onError: (error: any) => {
      console.error("Error deleting installation type:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete installation type"
      );
    },
  });
};
