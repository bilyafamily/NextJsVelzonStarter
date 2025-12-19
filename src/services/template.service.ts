import { Template } from "@/types/template";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { apiClient } from "src/lib/api";
import { ResponseDto } from "@/types/common";

export async function getTemplates() {
  try {
    const response = await apiClient.get<ResponseDto<Template[]>>(`/templates`);
    return response.result;
  } catch (error) {
    console.log(error);
  }
}

export async function addTemplate(
  payload: FormData
): Promise<ResponseDto<Template>> {
  try {
    const res = await apiClient.post<ResponseDto<Template>>(
      `/templates`,
      payload
    );
    return res;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message);
  }
}

export async function updateTemplate(payload: FormData) {
  try {
    const response = await apiClient.putFormData(`/templates`, payload);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteTemplate(templateId: string) {
  try {
    const res = await apiClient.delete<ResponseDto>(`/templates/${templateId}`);
    return res;
  } catch (error) {
    console.log(error);
  }
}
