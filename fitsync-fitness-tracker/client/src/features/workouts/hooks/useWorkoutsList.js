import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserWorkouts } from "../services/fetchUserWorkouts";
import { fetchAllWorkouts } from "../services/fetchAllWorkouts";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";
import { useNavigate } from "@tanstack/react-router";

export function useWorkoutsList({ limit }) {
  // Global store state selector
  const publicId = usePublicId();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Hook local page state object
  const [pages, setPages] = useState({
    Personal: 1,
    All: 1,
  });
  // State for current active page
  const [active, setActive] = useState("Personal");

  // Prefetch query hook fetches personal or all workouts depending on the active value and caches the result per active value, page, and limit
  useEffect(() => {
    const nextTab = active === "Personal" ? "All" : "Personal";
    const nextPage = pages[nextTab];

    queryClient.prefetchQuery({
      queryKey: ["workouts", nextTab, nextPage, limit],
      queryFn: () =>
        nextTab === "Personal"
          ? fetchUserWorkouts({ page: nextPage, limit })
          : fetchAllWorkouts({ page: nextPage, limit }),
    });
  }, [active, pages, limit, queryClient]);

  // Query hook fetches workouts stored for the given user and caches the result per page and limit
  const query = useQuery({
    queryKey: ["workouts", active, pages[active], limit],
    queryFn: () =>
      active === "Personal"
        ? fetchUserWorkouts({ page: pages[active], limit })
        : fetchAllWorkouts({ page: pages[active], limit }),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnMount: "always",
  });

  // Mutate hook that sends delete request to the delete workout endpoint
  const deleteWorkoutMutation = useMutation({
    mutationFn: (workoutId) =>
      api.delete(`api/v1/workouts/delete/${workoutId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
    },
  });

  // Function navigates client to appropriate workout page when a workout name is clicked
  const handleWorkoutClick = (workoutId) => {
    return navigate({
      to: "/dashboard/workouts/$workoutId",
      params: { workoutId: workoutId },
    });
  };

  // Function calls the delete workout mutation and provides the corresponding workout id to delete
  const handleDelete = (workoutId) => {
    deleteWorkoutMutation.mutate(workoutId);
  };

  // Function that sets active page between personal and all workouts
  const handleActiveChange = (buttonValue) => {
    setActive(buttonValue);
  };

  // Increments active page
  const handleNextPage = () => {
    setPages((state) => ({
      ...state,
      [active]: state[active] + 1,
    }));
  };

  // Decrements active page
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
    handleWorkoutClick,
    handleActiveChange,
    handlePreviousPage,
    handleNextPage,
    onClick: handleWorkoutClick,
    handleDelete,
    isRemoving: deleteWorkoutMutation.isLoading,
  };
}
