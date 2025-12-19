export interface Template {
  id: string;
  name: string;
  fileType: string;
  fileUrl: string;
  uploadedBy: string;
  file?: any;
  isActive: boolean;
  createdDate: string;
}

export interface CreateTemplateDto {
  name: string;
  fileType: string;
  file?: File | null;
  isActive: boolean;
}

export interface GetTemplatesParams {
  page?: number;
  limit?: number;
  search?: string;
  fileType?: string;
  uploadedBy?: string;
  isActive?: boolean;
}

export interface UpdateTemplateDto {
  id: string;
  name?: string;
  fileType?: string;
  file?: File | null;
  isActive?: boolean;
}
