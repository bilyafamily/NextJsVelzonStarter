import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Template,
  CreateTemplateDto,
  GetTemplatesParams,
  UpdateTemplateDto,
} from "@/types/template";
import { ResponseDto } from "@/types/common";
import { useBackendApiClient } from "./backendApiClient.hook";
import { toast } from "react-toastify";

const TEMPLATE_KEYS = {
  all: ["templates"] as const,
  lists: () => [...TEMPLATE_KEYS.all, "list"] as const,
  list: (params: GetTemplatesParams) =>
    [...TEMPLATE_KEYS.lists(), params] as const,
  details: () => [...TEMPLATE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...TEMPLATE_KEYS.details(), id] as const,
};

export const useGetTemplates = (params: GetTemplatesParams = {}) => {
  const { get } = useBackendApiClient();
  return useQuery({
    queryKey: TEMPLATE_KEYS.list(params),
    queryFn: async () => {
      const response = await get<ResponseDto<Template[]>>("/templates", {
        params,
      });
      return response.result;
    },
  });
};

export const useGetTemplate = (id: string) => {
  const { get } = useBackendApiClient();
  return useQuery({
    queryKey: TEMPLATE_KEYS.detail(id),
    queryFn: async () => {
      const response = await get<ResponseDto<Template>>(`/templates/${id}`);
      return response;
    },
    enabled: !!id,
  });
};

export const useCreateTemplate = () => {
  const { postFormData } = useBackendApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTemplateDto) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("isActive", data.isActive.toString());

      if (data.file) {
        formData.append("template", data.file);
      }

      const response = await postFormData<ResponseDto<Template>>(
        `/templates`,
        formData
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATE_KEYS.lists() });
      toast.success("Template created successfully");
    },
    onError: (error: any) => {
      console.log(error);
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  const { putFormData } = useBackendApiClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateTemplateDto) => {
      const formData = new FormData();

      if (data.name) formData.append("name", data.name);
      if (data.isActive !== undefined)
        formData.append("isActive", data.isActive.toString());

      if (data.file) {
        formData.append("template", data.file);
      }

      const response = await putFormData<ResponseDto<Template>>(
        `/templates/${id}`,
        formData
      );

      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEMPLATE_KEYS.lists() });
      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: TEMPLATE_KEYS.detail(variables.id),
        });
        toast.success("Template updated successfully");
      }
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  const { deleteItem } = useBackendApiClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteItem<ResponseDto<void>>(`/templates/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATE_KEYS.lists() });
      toast.success("Template deleted successfully");
    },
  });
};

export const useToggleTemplateStatus = () => {
  const queryClient = useQueryClient();
  const { patch } = useBackendApiClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await patch<ResponseDto<Template>>(
        `/templates/${id}/status`,
        {}
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEMPLATE_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: TEMPLATE_KEYS.detail(variables.id),
      });
      toast.success("Template updated successfully");
    },
  });
};
