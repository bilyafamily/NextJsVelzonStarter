import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
} from "@/services/companies.service";
import { Company, CreateCompanyDto } from "src/types/company";
import { toast } from "react-toastify";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Fetch companies
export const useGetCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => getCompanies(),
  });
};

// Create company
export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (company: CreateCompanyDto) => createCompany(company),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success(`Company created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create facility type: ${error.message}`);
    },
  });
};

// Update company
export const useUpdateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (company: Partial<CreateCompanyDto>) =>
      updateCompany(company.id as string, company),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success(`Company updated successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create facility type: ${error.message}`);
    },
  });
};

// Delete company
export const useDeleteCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast.success(`Company deleted successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create facility type: ${error.message}`);
    },
  });
};
