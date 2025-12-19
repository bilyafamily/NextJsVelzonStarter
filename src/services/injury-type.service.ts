import { apiClient } from "src/lib/api";
import { ResponseDto } from "src/types/common";
import { UpdateNameItemDto } from "src/types/incident";

export const getInjuryTypes = async () => {
  try {
    const response = await apiClient.get<ResponseDto>("/injury-types");

    return response;
  } catch (error) {
    console.error("Error fetching injury-types:", error);
  }
};

export const getInjuryTypeById = async (id: string) => {
  const response = await apiClient.get<ResponseDto>(`/injury-types/${id}`);
  return response;
};

export const createInjuryType = async (data: { name: string }) => {
  const response = await apiClient.post("/injury-types", data);
  return response;
};

export const updateInjuryType = async (data: UpdateNameItemDto) => {
  const { id, ...payload } = data;
  const response = await apiClient.put<ResponseDto>(
    `/injury-types/${id}`,
    payload
  );
  return response;
};

export const deleteInjuryType = async (id: string) => {
  await apiClient.delete(`/injury-types/${id}`);
};
