import { Facility } from "./facility";

export interface IncidentReportList {
  incidentReportId: string;
  facility: string;
  company: string;
  incidentType: string;
  installationType: string;
  facilityType: string;
  status: string;
  currentDesk: string;
  state: string;
  incidentDate: string;
  // Additional fields that might be useful
  reportedBy?: string;
  reportedDate?: string;
  severity?: string;
  injuries?: number;
  fatalities?: number;
  investigationStatus?: string;
}

export interface IncidentReport {
  id: string;
  currentDesk: string;
  status: string;
  incidentDetail: {
    id: string;
    facilityId: string;
    accidentNature: string;
    description: string;
    incidentTypeId: string;
    incidentReportId: string;
    isWorkRelated: string;
    incidentDate: string;
    facility: Facility;
    incidentType: IncidentType;
    createdAt: string;
    updatedAt: string | null;
  };
  incidentConsequence: {
    id: string;
    assetDamageDescription: string;
    incidentReportId: string;
    assetDamages: AssetDamage[];
  };
  involvedPersons: IncidentInvoledPerson[];
  witnesses: IncidentWitness[];
  incidentAttachments: IncidentAttachment[];
  assetDamages: AssetDamage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncident {
  incidentDetail: {
    facilityId: string;
    accidentNature: string;
    description: string;
    incidentTypeId: string;
    isWorkRelated: string;
    incidentDate: string;
  };
  incidentConsequence: {
    assetDamageDescription: string;
    assetDamages: AssetDamage[];
  };
  involvedPersons: CreatedInvoledPerson[];
  witnesses: CreateIncidentWitness[];
  incidentAttachments: File[];
}

export interface IncidentCreateResponse {
  incidentId: string;
}

export interface CreatedInvoledPerson {
  name: string;
  designation: string;
  employerName: string;
  hospitalName: string;
  hospitalized: string;
  injuryTypeId: string;
  dateOfDemise: string | null;
}

export interface CreateIncidentWitness {
  name: string;
  contactDetails: string;
}

export interface IncidentType {
  id: string;
  name: string;
}

export interface IncidentAttachment {
  id: string;
  fileUrl: string;
  incidentReportId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IncidentWitness {
  id: string;
  name: string;
  contactDetails: string;
  incidentReportId: string;
}

export interface IncidentInjuryType {
  id: string;
  name: string;
}

export interface IncidentInvoledPerson {
  id: string;
  name: string;
  designation: string;
  employerName: string;
  hospitalName: string;
  hospitalized: string;
  injuryTypeId: string;
  dateOfDemise: string | null;
  incidentReportId: string;
  injuryType: IncidentInjuryType;
}

export enum IncidentStatus {
  "Completed",
  "Under Investigation",
  "Submitted",
  "Closed",
}

export interface AssetDamage {
  id?: string;
  assetName: string;
  assetType: string;
  damageDescription: string;
}

export interface NameItemInterface {
  id: string;
  name: string;
}

export interface CreateNameItemDto {
  name: string;
}

export interface UpdateNameItemDto {
  id: string;
  name?: string;
}
