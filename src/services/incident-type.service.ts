import { apiClient } from "src/lib/api";
import { ResponseDto } from "src/types/common";
import { UpdateNameItemDto } from "src/types/incident";

export const getIncidentTypes = async () => {
  try {
    const response = await apiClient.get<ResponseDto>("/incidentTypes");

    return response;
  } catch (error) {
    console.error("Error fetching incident-types:", error);
  }
};

export const getIncidentTypeById = async (id: string) => {
  const response = await apiClient.get<ResponseDto>(`/incidentTypes/${id}`);
  return response;
};

export const createIncidentType = async (data: { name: string }) => {
  const response = await apiClient.post("/incidentTypes", data);
  return response;
};

export const updateIncidentType = async (data: UpdateNameItemDto) => {
  const { id, ...payload } = data;
  const response = await apiClient.put<ResponseDto>(
    `/incidentTypes/${id}`,
    payload
  );
  return response;
};

export const deleteIncidentType = async (id: string) => {
  await apiClient.delete(`/incidentTypes/${id}`);
};
