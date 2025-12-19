import { apiClient } from "@/lib/api";
import { ResponseDto } from "@/types/common";
import { IncidentCreateResponse } from "@/types/incident";

export const incidentService = {
  async createIncidentReport(
    data: FormData
  ): Promise<ResponseDto<IncidentCreateResponse>> {
    const response = await apiClient.postFormData<
      ResponseDto<IncidentCreateResponse>
    >("/incident-reports", data);
    return response;
  },
};

export const creactIncidentReport = incidentService.createIncidentReport;
