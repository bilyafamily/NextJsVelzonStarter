export interface ResponseDto<T = any> {
  statusCode: number;
  result: T;
  isSuccess: boolean;
  message: string;
}

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

export interface Name {
  id: string;
  name: string;
}

export interface CreateName {
  name: string;
}

export interface Sector {
  id: string;
  name: string;
}

export interface FacilityType {
  id: string;
  name: string;
}

export interface InstallationType {
  id: string;
  name: string;
}

export interface InjuryType {
  id: string;
  name: string;
}
export interface IncidentType {
  id: string;
  name: string;
}

export interface InstallationType {
  id: string;
  name: string;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
