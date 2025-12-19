import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { creactIncidentReport } from "src/services/incident.service";

export const useCreateIncident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => creactIncidentReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      toast.success(`incident created successfully`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create facility type: ${error.message}`);
    },
  });
};
