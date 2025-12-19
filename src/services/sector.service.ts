import { apiClient } from "src/lib/api";
import { ResponseDto } from "src/types/common";
import { Sector, UpdateSectorDto } from "src/types/sector";

export const getSectors = async () => {
  try {
    const response = await apiClient.get<ResponseDto<Sector[]>>("/sectors");

    return response.result;
  } catch (error) {
    console.error("Error fetching sectors:", error);
  }
};

export const getSectorById = async (id: string) => {
  const response = await apiClient.get<ResponseDto>(`/sectors/${id}`);
  return response;
};

export const createSector = async (data: { name: string }) => {
  const response = await apiClient.post("/sectors", data);
  return response;
};

export const updateSector = async (data: UpdateSectorDto) => {
  const { id, ...payload } = data;
  const response = await apiClient.put<ResponseDto>(`/sectors/${id}`, payload);
  return response;
};

export const deleteSector = async (id: string) => {
  await apiClient.delete(`/sectors/${id}`);
};
