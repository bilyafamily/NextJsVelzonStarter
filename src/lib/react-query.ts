import { QueryClient, type DefaultOptions } from "@tanstack/react-query";
import apiClient from "./axios";

// Default query options
const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: 1,
  },
};

// Create query client
export const queryClient = new QueryClient({ defaultOptions });

// Custom hook for authenticated queries using React Query with axios
export const createAuthenticatedAxiosInstance = () => {
  return apiClient;
};
