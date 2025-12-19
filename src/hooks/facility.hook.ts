import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useBackendApiClient } from "./backendApiClient.hook";
import {
  CreateFacilityDto,
  Facility,
  GetFacilitiesParams,
} from "@/types/facility";
import {
  State,
  InstallationType,
  FacilityType,
  ResponseDto,
} from "src/types/common";
import { Company } from "src/types/company";

// Query keys
export const FACILITY_KEYS = {
  all: ["facilities"] as const,
  lists: () => [...FACILITY_KEYS.all, "list"] as const,
  details: () => [...FACILITY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...FACILITY_KEYS.details(), id] as const,
  states: ["states"] as const,
  lgas: (stateId: string) => ["lgas", stateId] as const,
  companies: ["companies"] as const,
  installationTypes: ["installationTypes"] as const,
  facilityTypes: ["facilityTypes"] as const,
};

// Queries
export const useGetFacilities = (params: GetFacilitiesParams = {}) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: FACILITY_KEYS.all,
    queryFn: async () => {
      const response = await get<ResponseDto<Facility[]>>("/facilities", {
        params,
      });
      return response.result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useGetStates = () => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: FACILITY_KEYS.states,
    queryFn: async () => {
      const response = await get<ResponseDto<State[]>>("/states");
      return response.result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
  });
};

export const useGetCompanies = () => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: FACILITY_KEYS.companies,
    queryFn: async () => {
      const response = await get<ResponseDto<Company[]>>("/companies");
      return response.result;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
  });
};

export const useGetInstallationTypes = () => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: FACILITY_KEYS.installationTypes,
    queryFn: async () => {
      const response =
        await get<ResponseDto<InstallationType[]>>("/installationTypes");
      return response.result;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
  });
};

export const useGetFacilityTypes = () => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: FACILITY_KEYS.facilityTypes,
    queryFn: async () => {
      const response = await get<ResponseDto<FacilityType[]>>("/facilityTypes");
      return response.result;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
  });
};

export const useGetFacilityById = (id: string) => {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: FACILITY_KEYS.detail(id),
    queryFn: async () => {
      const response = await get<ResponseDto<Facility>>(`/facilities/${id}`);
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Mutations
export const useCreateFacility = () => {
  const { post } = useBackendApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFacilityDto) => {
      const response = await post<ResponseDto<Facility>>("/facilities", data);
      return response;
    },
    onSuccess: response => {
      queryClient.invalidateQueries({ queryKey: FACILITY_KEYS.lists() });
      toast.success(response?.message || "Facility created successfully!");
    },
    onError: (error: any) => {
      console.error("Error creating facility:", error);
      toast.error(
        error?.response?.data?.message || "Failed to create facility"
      );
    },
  });
};

export const useUpdateFacility = () => {
  const queryClient = useQueryClient();
  const { put } = useBackendApiClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Facility>) => {
      const response = await put<ResponseDto<Facility>>(
        `/facilities/${id}`,
        data
      );
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: FACILITY_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: FACILITY_KEYS.detail(variables.id),
        });
      }
      toast.success(response?.message || "Facility updated successfully");
    },
    onError: (error: any) => {
      console.error("Error updating facility:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update facility"
      );
    },
  });
};

export const useDeleteFacility = () => {
  const queryClient = useQueryClient();
  const { deleteItem } = useBackendApiClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteItem<ResponseDto<void>>(`/facilities/${id}`);
      return response;
    },
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: FACILITY_KEYS.lists() });
      queryClient.removeQueries({ queryKey: FACILITY_KEYS.detail(id) });
      toast.success(response?.message || "Facility deleted successfully");
    },
    onError: (error: any) => {
      console.error("Error deleting facility:", error);
      toast.error(
        error?.response?.data?.message || "Failed to delete facility"
      );
    },
  });
};
