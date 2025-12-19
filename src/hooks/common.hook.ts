import { useQuery } from "@tanstack/react-query";
import { useBackendApiClient } from "./backendApiClient.hook";
import { Facility } from "@/types/facility";
import { ResponseDto, State } from "src/types/common";

export function useGetStates() {
  const { get } = useBackendApiClient();

  return useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const response = await get<ResponseDto<State[]>>("/states");
      return response.result;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 1,
  });
}
