import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fetchUserMeals } from "../services/fetchUserMeals";
import { fetchAllMeals } from "../services/fetchAllMeals";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";

export function useMealsList({ limit }) {
  // Initialize query client and navigation
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Gets the user's public ID from the store
  const publicId = usePublicId();

  //Local state to manage pagination for both "Personal" and "All" meals lists
  const [pages, setPages] = useState({
    Personal: 1,
    All: 1,
  });

  // Local state to track which meals list is currently active
  const [active, setActive] = useState("Personal");
  
  // Determines the active page based on the current active tab
  const activePage = pages[active];

  // Prefetches the inactive page of meals when the active tab changes
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

  // Fetches meals based on the active tab and page number
  const query = useQuery({
    queryKey: [`meals`, active, pages[active], limit],
    queryFn: () =>
      active === "Personal"
        ? fetchUserMeals({ page: pages[active], limit, publicId })
        : fetchAllMeals({ page: pages[active], limit }),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime:  2 * 60 * 1000, // 2 minutes
    refetchOnMount: "always", // Always refetch when the component mounts to ensure data is up-to-date
  });

  // Mutation hook that handles meal deletion
  const deleteMealMutation = useMutation({
    mutationFn: (mealId) =>
      api.delete(`api/v1/meals/delete/${mealId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meals"],
      });
    },
  });


  // Function to handle meal item click, navigates to the meal details page
  const handleMealClick = (mealId) => {
    console.log("Navigating to meal details for meal ID:", mealId); 
    return navigate({
      to: "/dashboard/meals/$mealId",
      params: { mealId: mealId },
    });
  };

  // Function to handle meal deletion, triggers the delete mutation
  const handleDelete = (mealId) => {
    deleteMealMutation.mutate(mealId);
  };

  // Function to handle tab change, updates the active tab state
  const handleActiveChange = (buttonValue) => {
    setActive(buttonValue);
  };

  // Functions to handle pagination, updates the page number for the active tab
  const handleNextPage = () => {
    setPages((state) => ({
      ...state,
      [active]: state[active] + 1,
    }));
  };

  // Function to handle previous page click, ensures the page number does not go below 1
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
