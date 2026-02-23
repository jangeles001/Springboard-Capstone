import { useQuery } from "@tanstack/react-query";
import { fetchAuthUser } from "../services/fetchAuthUser";

export function useAuthUser(enabled = false) {
  // Send status request to spin up server before log in page
  fetch("https://springboard-capstone-server.onrender.com/health").catch(
    (error) => console.error(error),
  );

  return useQuery({
    queryKey: ["authUser"],
    queryFn: fetchAuthUser,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false, // avoid automatic retries if token is invalid
    refetchOnWindowFocus: false, // prevents refetch on focus
  });
}
