import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useBackendApiClient } from "./backendApiClient.hook";
import { Company, CreateCompanyDto } from "src/types/company";
import { QueryParams, ResponseDto } from "src/types/common";

// Query keys
export const COMPANY_KEYS = {
  all: ["companies"] as const,
  lists: () => [...COMPANY_KEYS.all, "list"] as const,
  details: () => [...COMPANY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...COMPANY_KEYS.details(), id] as const,
};

// Queries
export const useGetCompanies = (params: QueryParams = {}) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: COMPANY_KEYS.lists(),
    queryFn: async () => {
      const response = await get<ResponseDto<Company[]>>("/companies", {
        params,
      });
      return response.result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
};

export const useGetCompanyById = (id: string) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: COMPANY_KEYS.detail(id),
    queryFn: async () => {
      const response = await get<ResponseDto<Company>>(`/companies/${id}`);
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutations
export const useCreateCompany = () => {
  const { post } = useBackendApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCompanyDto) => {
      const response = await post<ResponseDto<Company>>("/companies", data);
      return response;
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.lists() });
      toast.success(response?.message || "Company created successfully");
    },
    onError: (error: any) => {
      console.error("Error creating company:", error);
      toast.error(error?.response?.data?.message || "Failed to create company");
    },
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  const { put } = useBackendApiClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: CreateCompanyDto & { id: string }) => {
      const response = await put<ResponseDto<Company>>(
        `/companies/${id}`,
        data
      );
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: COMPANY_KEYS.detail(variables.id),
        });
      }
      toast.success(
        response?.message || `Company "${variables?.name}" updated successfully`
      );
    },
    onError: (error: any, variables) => {
      console.error("Error updating company:", error);
      toast.error(error?.response?.data?.message || "Failed to update company");
    },
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const { deleteItem } = useBackendApiClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteItem<ResponseDto<void>>(`/companies/${id}`);
      return response;
    },
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: COMPANY_KEYS.lists() });
      queryClient.removeQueries({ queryKey: COMPANY_KEYS.detail(id) });
      toast.success(response?.message || "Company deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting company:", error);
      toast.error(error?.response?.data?.message || "Failed to delete company");
    },
  });
};
