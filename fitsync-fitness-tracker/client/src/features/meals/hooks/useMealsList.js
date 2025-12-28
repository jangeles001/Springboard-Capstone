import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCreatedMeals } from "../services/fetchCreatedMeals";
import { fetchAllMeals } from "../services/fetchAllMeals";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";

export function useMealsList({ limit }) {
  const queryClient = useQueryClient();
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
          ? fetchCreatedMeals({ page: nextPage, limit, publicId })
          : fetchAllMeals({ page: nextPage, limit }),
    });
  }, [active, pages, limit, queryClient]);

  const query = useQuery({
    queryKey: [`meals`, active, pages[active], limit],
    queryFn: () =>
      active === "Personal"
        ? fetchCreatedMeals({ page: pages[active], limit, publicId })
        : fetchAllMeals({ page: pages[active], limit }),
    keepPreviousData: true,
  });

  const deleteMealMutation = useMutation({
    mutationFn: (mealId) =>
      api.delete(`api/v1/users/${publicId}/meals/${mealId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meals"],
      });
    },
  });

  const handleMealClick = (mealId) => {
    console.log(mealId);
    // redirect to workout page
  };

  const handleDeleteMeal = (mealId) => {
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

  const handlePrevioustPage = () => {
    setPages((state) => ({
      ...state,
      [active]: Math.max(1, state[active] - 1),
    }));
  };

  return {
    ...query,
    page: pages[active],
    active,
    handleMealClick,
    handleActiveChange,
    mealClick: handleMealClick,
    deleteMeal: handleDeleteMeal,
    isRemoving: deleteMealMutation.isLoading,
  };
}
