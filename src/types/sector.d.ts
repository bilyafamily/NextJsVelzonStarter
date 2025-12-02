export interface SectorInterface {
  id: string;
  name: string;
}

export interface CreateSectorDto {
  name: string;
}

export interface UpdateSectorDto {
  id: string;
  name?: string;
}
