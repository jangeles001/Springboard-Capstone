import { useEffect, useEffectEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { useUserActions } from "../store/UserStore";

export function useAuthUser(enabled = true) {
  const { setUsername, setPublicId, resetUser } = useUserActions();

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/api/v1/auth/me");
      return res?.data?.data;
    },
    enabled,
    retry: false, // avoid automatic retries if token is invalid
    refetchOnWindowFocus: false, // prevents refetch on focus
  });

  useEffect(() => {
    if (!query.isSuccess) return;

    if (query.data) {
      setUsername(query.data.username);
      setPublicId(query.data.publicId);
    } else {
      resetUser();
    }
  }, [query.isSuccess, query.data]);

  return query;
}
