import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fetchUserMeals } from "../services/fetchUserMeals";
import { fetchAllMeals } from "../services/fetchAllMeals";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";

export function useMealsList({ limit }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const publicId = usePublicId();

  const [pages, setPages] = useState({
    Personal: 1,
    All: 1,
  });
  const [active, setActive] = useState("Personal");
  const activePage = pages[active];

  useEffect(() => {
    const nextTab = active === "Personal" ? "All" : "Personal";
    const nextPage = pages[nextTab];

    queryClient.prefetchQuery({
      queryKey: ["meals", nextTab, nextPage, limit],
      queryFn: () =>
        nextTab === "Personal"
          ? fetchUserMeals({ page: nextPage, limit, publicId })
          : fetchAllMeals({ page: nextPage, limit }),
    });
  }, [active, pages, limit, queryClient]);

  const query = useQuery({
    queryKey: [`meals`, active, pages[active], limit],
    queryFn: () =>
      active === "Personal"
        ? fetchUserMeals({ page: pages[active], limit, publicId })
        : fetchAllMeals({ page: pages[active], limit }),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const deleteMealMutation = useMutation({
    mutationFn: (mealId) =>
      api.delete(`api/v1/meals/delete/${mealId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meals"],
      });
    },
  });

  const handleMealClick = (mealId) => {
    return navigate({
      to: "/dashboard/meals/$mealId",
      params: { mealId: mealId },
    });
  };

  const handleDelete = (mealId) => {
    deleteMealMutation.mutate(mealId);
  };

  const handleActiveChange = (buttonValue) => {
    setActive(buttonValue);
  };

  const handleNextPage = () => {
    setPages((state) => ({
      ...state,
      [active]: state[active] + 1,
    }));
  };

  const handlePreviousPage = () => {
    setPages((state) => ({
      ...state,
      [active]: Math.max(1, state[active] - 1),
    }));
  };

  return {
    ...query,
    page: pages[active],
    publicId,
    active,
    handleMealClick,
    handleActiveChange,
    onClick: handleMealClick,
    handleDelete,
    handleNextPage,
    handlePreviousPage,
    isRemoving: deleteMealMutation.isLoading,
  };
}
