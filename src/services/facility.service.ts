import { apiClient } from "@/lib/api";
import { ResponseDto } from "src/types/common";
import {
  Facility,
  State,
  Lga,
  CreateFacilityDto,
  GetFacilitiesParams,
} from "src/types/facility";

// State and LGA Types
export interface StateWithLgas extends State {
  lgas: Lga[];
}

// Facility Service
export const facilityService = {
  // Get all facilities
  async getFacilities(params?: GetFacilitiesParams): Promise<Facility[]> {
    const response = await apiClient.get<ResponseDto<Facility[]>>(
      "/facilities"
      // {
      //   params: {
      //     page: params ? params.page : 1,
      //     limit: params ? params.limit : 100,
      //     ...params,
      //   },
      // }
    );
    return response.result;
  },

  // Get facility by ID
  async getFacilityById(id: string): Promise<Facility> {
    const response = await apiClient.get<ResponseDto<Facility>>(
      `/facilities/${id}`
    );
    return response.result;
  },

  // Create new facility
  async createFacility(
    data: CreateFacilityDto
  ): Promise<ResponseDto<Facility>> {
    const response = await apiClient.post<ResponseDto<Facility>>(
      "/facilities",
      data
    );
    return response;
  },

  // Update facility
  async updateFacility(
    data: CreateFacilityDto
  ): Promise<ResponseDto<Facility>> {
    const { id, ...payload } = data;
    const response = await apiClient.put<ResponseDto<Facility>>(
      `/facilities/${id}`,
      payload
    );
    console.log(response);
    return response;
  },

  // Delete facility
  async deleteFacility(id: string): Promise<ResponseDto<void>> {
    const response = await apiClient.delete<ResponseDto<void>>(
      `/facilities/${id}`
    );
    return response;
  },

  // Get all states
  async getStates(): Promise<State[]> {
    const response = await apiClient.get<ResponseDto<State[]>>("/states");
    return response.result;
  },

  // Search facilities by criteria
  async searchFacilities(criteria: {
    name?: string;
    stateId?: string;
    companyId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    data: Facility[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    if (criteria.name) params.append("name", criteria.name);
    if (criteria.stateId) params.append("stateId", criteria.stateId);
    if (criteria.companyId) params.append("companyId", criteria.companyId);
    if (criteria.page) params.append("page", criteria.page.toString());
    if (criteria.pageSize)
      params.append("pageSize", criteria.pageSize.toString());

    const response = await apiClient.get<
      ResponseDto<{
        data: Facility[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      }>
    >(`/facilities/search?${params.toString()}`);

    return response.result;
  },

  // Get facilities by company
  async getFacilitiesByCompany(companyId: string): Promise<Facility[]> {
    const response = await apiClient.get<ResponseDto<Facility[]>>(
      `/companies/${companyId}/facilities`
    );
    return response.result;
  },

  // Get facilities by state
  async getFacilitiesByState(stateId: string): Promise<Facility[]> {
    const response = await apiClient.get<ResponseDto<Facility[]>>(
      `/states/${stateId}/facilities`
    );
    return response.result;
  },
};

// Individual export functions for hooks compatibility
export const getFacilities = facilityService.getFacilities;
export const getFacilityById = facilityService.getFacilityById;
export const createFacility = facilityService.createFacility;
export const updateFacility = facilityService.updateFacility;
export const deleteFacility = facilityService.deleteFacility;
export const getStates = facilityService.getStates;
export const searchFacilities = facilityService.searchFacilities;
export const getFacilitiesByCompany = facilityService.getFacilitiesByCompany;
export const getFacilitiesByState = facilityService.getFacilitiesByState;
