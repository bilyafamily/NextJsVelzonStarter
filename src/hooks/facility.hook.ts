import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getCompanies } from "@/services/companies.service";
import {
  createFacility,
  getStates,
  getFacilities,
  deleteFacility,
  getFacilityById,
  updateFacility,
} from "@/services/facility.service";
import {
  CreateFacilityDto,
  Facility,
  GetFacilitiesParams,
} from "@/types/facility";
import { ResponseDto } from "src/types/common";

// Query keys
export const facilityKeys = {
  all: ["facilities"] as const,
  lists: () => [...facilityKeys.all, "list"] as const,
  details: () => [...facilityKeys.all, "detail"] as const,
  detail: (id: string) => [...facilityKeys.details(), id] as const,
  states: ["states"] as const,
  lgas: (stateId: string) => ["lgas", stateId] as const,
  companies: ["companies"] as const,
  installationTypes: ["installationTypes"] as const,
  facilityTypes: ["facilityTypes"] as const,
};

export const useGetFacilities = (params: GetFacilitiesParams = {}) => {
  return useQuery({
    queryKey: ["facilities", params],
    queryFn: () => getFacilities(params),
  });
};

// Hook to get states
export function useGetStates() {
  return useQuery({
    queryKey: facilityKeys.states,
    queryFn: getStates,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
  });
}

// Hook to get companies
export function useGetCompanies() {
  return useQuery({
    queryKey: facilityKeys.companies,
    queryFn: getCompanies,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 1,
  });
}

// Hook to create a facility
export function useCreateFacility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFacility,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() });
      toast.success("Facility created successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create facility: ${error.message}`);
    },
  });
}

// Hook to delete a facilityType
export function useDeleteFacility() {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<void>, Error, string>({
    mutationFn: (id: string) => deleteFacility(id),
    onSuccess: (_, id) => {
      // Invalidate facilityTypes list
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() });

      // Remove the deleted facilityType from cache
      queryClient.removeQueries({ queryKey: facilityKeys.detail(id) });

      toast.success("Facility deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete facilityType: ${error.message}`);
    },
  });
}

export function useGetFacilityById(id: string) {
  return useQuery({
    queryKey: facilityKeys.detail(id),
    queryFn: () => getFacilityById(id),
    enabled: !!id,
  });
}
export function useUpdateFacility() {
  const queryClient = useQueryClient();

  return useMutation<ResponseDto<Facility>, Error, CreateFacilityDto>({
    mutationFn: (data: CreateFacilityDto) => updateFacility(data),
    onSuccess: (_, facility) => {
      // Invalidate facilityTypes list
      queryClient.invalidateQueries({ queryKey: facilityKeys.lists() });

      // Remove the deleted facilityType from cache
      queryClient.removeQueries({
        queryKey: facilityKeys.detail(facility.id as string),
      });

      toast.success("Facility updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete facilityType: ${error.message}`);
    },
  });
}
