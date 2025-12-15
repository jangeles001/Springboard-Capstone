import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { useUserActions } from "../store/UserStore";

export function useAuthUser(enabled = true) {
  const queryClient = useQueryClient();
  const { setUsername, setPublicId, resetUser } = useUserActions();

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/api/v1/auth/me");
      return res.data.data;
    },
    enabled,
    retry: false, // avoid automatic retries if token is invalid
    refetchOnWindowFocus: false, // optional, prevents refetch on focus
  });

  // ✅ React Query v5 side-effect handling
  useEffect(() => {
    if (query.isSuccess) {
      setUsername(query.data.username);
      setPublicId(query.data.publicId);
    }

    if (query.isError) {
      resetUser();
    }
  }, [query.isSuccess, query.isError]);

  return query;
}
