import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createSector,
  deleteSector,
  getSectors,
  updateSector,
} from "src/services/sector.service";
import { CreateSectorDto, UpdateSectorDto } from "src/types/sector";

export const sectorKeys = {
  all: ["sectors"] as const,
  lists: () => [...sectorKeys.all, "list"] as const,
  list: (filters: string) => [...sectorKeys.lists(), { filters }] as const,
  details: () => [...sectorKeys.all, "detail"] as const,
  detail: (id: string) => [...sectorKeys.details(), id] as const,
};

export function useGetSectors() {
  return useQuery({
    queryKey: ["sectors"],
    queryFn: getSectors,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    select: data => data?.result,
  });
}

// Hook to create a new sector
export function useCreateSector() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSectorDto) => createSector(data),
    onSuccess: data => {
      // Invalidate and refetch sectors list
      queryClient.invalidateQueries({ queryKey: sectorKeys.lists() });

      toast.success(`Sector "${data}" created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create sector: ${error.message}`);
    },
  });
}

// Hook to update a sector
export function useUpdateSector() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSectorDto) => updateSector(data),
    onSuccess: (data, variables: any) => {
      console.log("Variables:", variables);
      // Invalidate both list and specific sector detail
      queryClient.invalidateQueries({ queryKey: sectorKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: sectorKeys.detail(variables.id),
      });

      toast.success(`Sector "${data}" updated successfully`);
    },
    onError: (error: Error, variables) => {
      toast.error(`Failed to update sector: ${error.message}`);
    },
  });
}

// Hook to delete a sector
export function useDeleteSector() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => deleteSector(id),
    onSuccess: (_, id) => {
      // Invalidate sectors list
      queryClient.invalidateQueries({ queryKey: sectorKeys.lists() });

      // Remove the deleted sector from cache
      queryClient.removeQueries({ queryKey: sectorKeys.detail(id) });

      toast.success("Sector deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete sector: ${error.message}`);
    },
  });
}

// Hook to delete multiple sectors
export function useDeleteMultipleSectors() {
  const queryClient = useQueryClient();
  const deleteSectorMutation = useDeleteSector();

  return useMutation<void, Error, string[]>({
    mutationFn: async (ids: string[]) => {
      // Delete each sector sequentially
      for (const id of ids) {
        await deleteSectorMutation.mutateAsync(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sectorKeys.lists() });
      toast.success("Selected sectors deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete sectors: ${error.message}`);
    },
  });
}
