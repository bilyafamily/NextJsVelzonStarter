import { apiClient } from "@/lib/api";
import { ResponseDto } from "@/types/common";
import { UpdateNameItemDto } from "@/types/incident";

export const getFacilityTypes = async () => {
  try {
    const response = await apiClient.get<ResponseDto>("/facility-types");
    return response;
  } catch (error) {
    console.error("Error fetching facility types:", error);
  }
};

export const getFacilityTypeById = async (id: string) => {
  const response = await apiClient.get<ResponseDto>(`/facility-types/${id}`);
  return response;
};

export const createFacilityType = async (data: { name: string }) => {
  const response = await apiClient.post("/facility-types", data);
  return response;
};

export const updateFacilityType = async (data: UpdateNameItemDto) => {
  const { id, ...payload } = data;
  const response = await apiClient.put<ResponseDto>(
    `/facility-types/${id}`,
    payload
  );
  return response;
};

export const deleteFacilityType = async (id: string) => {
  await apiClient.delete(`/facility-types/${id}`);
};
