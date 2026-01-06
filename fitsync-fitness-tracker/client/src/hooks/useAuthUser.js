import { useQuery } from "@tanstack/react-query";
import { fetchAuthUser } from "../services/fetchAuthUser";

export function useAuthUser(enabled = false) {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: fetchAuthUser,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false, // avoid automatic retries if token is invalid
    refetchOnWindowFocus: false, // prevents refetch on focus
  });
}
