// Base Facility Interface
export interface Facility {
  id: string;
  name: string;
  address: string;
  longitude: number;
  latitude: number;
  omlNumber?: string;
  field?: string;
  installationTypeId: string;
  facilityTypeId: string;
  companyId: string;
  stateId: string;
  lgaId: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Optional relations (for detailed views)
  installationType?: InstallationType;
  facilityType?: FacilityType;
  company?: Company;
  state?: State;
  lga?: Lga;
}

export interface PaginatedFacilities {
  data: Facility[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetFacilitiesParams {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: string;
  stateId?: string;
  lgaId?: string;
  installationTypeId?: string;
  facilityTypeId?: string;
  isActive?: string;
}

// DTOs for Create/Update
export interface CreateFacilityDto {
  id?: string;
  name: string;
  address: string;
  longitude: number | null;
  latitude: number | null;
  omlNumber?: string;
  field?: string;
  installationTypeId: string;
  facilityTypeId: string;
  companyId: string;
  stateId: string;
  lgaId: string;
}

export interface UpdateFacilityDto extends Partial<CreateFacilityDto> {
  id: string;
  isActive?: boolean;
}

// Related Entities
export interface State {
  id: string;
  name: string;
  lgas: Lga[];
}

export interface Lga {
  id: string;
  name: string;
  stateId: string;
  state?: State;
}

export interface Company {
  id: string;
  name: string;
  address?: string;
  sector?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface InstallationType {
  id: string;
  name: string;
  updatedAt?: string;
}

export interface FacilityType {
  id: string;
  name: string;
  updatedAt?: string;
}

export interface FacilityFilters {
  name?: string;
  stateId?: string;
  companyId?: string;
  installationTypeId?: string;
  facilityTypeId?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Map-related types
export interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  company: string;
}
