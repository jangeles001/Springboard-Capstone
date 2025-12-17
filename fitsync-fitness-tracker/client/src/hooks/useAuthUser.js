import { useEffect, useEffectEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useUserActions } from "../store/UserStore";

export function useAuthUser(enabled = true) {
  const queryFunction = useEffectEvent((query) => {
    if (query.isSuccess) {
      setUsername(query.data.username);
      setPublicId(query.data.publicId);
    }

    if (query.isError) {
      resetUser();
    }
  },)
  const { setUsername, setPublicId, resetUser } = useUserActions();

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/api/v1/auth/me");
      return res.data.data;
    },
    enabled,
    retry: false, // avoid automatic retries if token is invalid
    refetchOnWindowFocus: false, // prevents refetch on focus
  });

  useEffect(() => {
    queryFunction(query);
  }, [query, queryFunction]);

  return query;
}
