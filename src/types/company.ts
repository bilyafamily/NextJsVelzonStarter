import { Sector } from "./common";

export interface CompanyType {
  id: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
  sectorId: string;
  sector: Sector;
  address: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompanyDto {
  id?: string;
  name: string;
  sectorId: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  isActive?: boolean;
}
