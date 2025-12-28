import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchReports } from "../services/fetchReports";

export function useDashboard() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["reports"],
    queryFn: () => fetchReports(),
  });

  return {
    ...query,
  };
}
