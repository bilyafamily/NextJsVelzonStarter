import { ResponseDto } from "src/types/common";
import { Company, CreateCompanyDto } from "@/types/company";
import { apiClient } from "src/lib/api";

// Company Service
export const companyService = {
  // Get all companies
  async getCompanies(): Promise<Company[]> {
    const response = await apiClient.get<ResponseDto<Company[]>>("/companies");
    return response.result;
  },

  // Get company by ID
  async getCompanyById(id: string): Promise<Company> {
    const response = await apiClient.get<ResponseDto<Company>>(
      `/companies/${id}`
    );
    return response.result;
  },

  // Create new company
  async createCompany(data: CreateCompanyDto): Promise<ResponseDto<Company>> {
    const response = await apiClient.post<ResponseDto<Company>>(
      "/companies",
      data
    );
    return response;
  },

  // Update company
  async updateCompany(
    id: string,
    data: Partial<CreateCompanyDto>
  ): Promise<ResponseDto<Company>> {
    const response = await apiClient.put<ResponseDto<Company>>(
      `/companies/${id}`,
      data
    );
    return response;
  },

  // Delete company
  async deleteCompany(id: string): Promise<ResponseDto<void>> {
    const response = await apiClient.delete<ResponseDto<void>>(
      `/companies/${id}`
    );
    return response;
  },

  // Search companies by criteria
  async searchCompanies(criteria: {
    name?: string;
    stateId?: string;
    companyId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    data: Company[];
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
        data: Company[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
      }>
    >(`/companies/search?${params.toString()}`);

    return response.result;
  },

  // Get companies by company
  async getCompaniesByCompany(companyId: string): Promise<Company[]> {
    const response = await apiClient.get<ResponseDto<Company[]>>(
      `/companies/${companyId}/companies`
    );
    return response.result;
  },

  // Get companies by state
  async getCompaniesByState(stateId: string): Promise<Company[]> {
    const response = await apiClient.get<ResponseDto<Company[]>>(
      `/states/${stateId}/companies`
    );
    return response.result;
  },
};

// Individual export functions for hooks compatibility
export const getCompanies = companyService.getCompanies;
export const getCompanyById = companyService.getCompanyById;
export const createCompany = companyService.createCompany;
export const updateCompany = companyService.updateCompany;
export const deleteCompany = companyService.deleteCompany;
export const searchCompanies = companyService.searchCompanies;
export const getCompaniesByCompany = companyService.getCompaniesByCompany;
export const getCompaniesByState = companyService.getCompaniesByState;
