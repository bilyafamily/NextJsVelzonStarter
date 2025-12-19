import { apiClient } from "src/lib/api";
import { ResponseDto } from "src/types/common";
import { UpdateNameItemDto } from "src/types/incident";

export const getInstallationTypes = async () => {
  try {
    const response = await apiClient.get<ResponseDto>("/installationTypes");

    return response;
  } catch (error) {
    console.error("Error fetching installation-types:", error);
  }
};

export const getInstallationTypeById = async (id: string) => {
  const response = await apiClient.get<ResponseDto>(`/installationTypes/${id}`);
  return response;
};

export const createInstallationType = async (data: { name: string }) => {
  const response = await apiClient.post("/installationTypes", data);
  return response;
};

export const updateInstallationType = async (data: UpdateNameItemDto) => {
  const { id, ...payload } = data;
  const response = await apiClient.put<ResponseDto>(
    `/installationTypes/${id}`,
    payload
  );
  return response;
};

export const deleteInstallationType = async (id: string) => {
  await apiClient.delete(`/installationTypes/${id}`);
};
