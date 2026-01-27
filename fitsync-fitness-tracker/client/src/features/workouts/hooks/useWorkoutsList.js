import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCreatedWorkouts } from "../services/fetchCreatedWorkouts";
import { fetchAllWorkouts } from "../services/fetchAllWorkouts";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";

export function useWorkoutsList({ limit }) {
  const queryClient = useQueryClient();
  const publicId = usePublicId();

  const [pages, setPages] = useState({
    Personal: 1,
    All: 1,
  });
  const [active, setActive] = useState("Personal");

  useEffect(() => {
    const nextTab = active === "Personal" ? "All" : "Personal";
    const nextPage = pages[nextTab];

    queryClient.prefetchQuery({
      queryKey: ["workouts", nextTab, nextPage, limit],
      queryFn: () =>
        nextTab === "Personal"
          ? fetchCreatedWorkouts({ page: nextPage, limit, publicId })
          : fetchAllWorkouts({ page: nextPage, limit }),
    });
  }, [active, pages, limit, queryClient]);

  const query = useQuery({
    queryKey: ["workouts", active, pages[active], limit],
    queryFn: () =>
      active === "Personal"
        ? fetchCreatedWorkouts({ page: pages[active], limit, publicId })
        : fetchAllWorkouts({ page: pages[active], limit }),
    keepPreviousData: true,
  });

  const deleteWorkoutMutation = useMutation({
    mutationFn: (workoutId) =>
      api.delete(`api/v1/users/${publicId}/workouts/${workoutId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
    },
  });

  const handleWorkoutClick = (workoutId) => {
    console.log(workoutId);
    // redirect to workout page
  };

  const handleExerciseClick = (exerciseId) => {
    console.log(exerciseId);
    // redirect to exercise page
  };

  const handleDeleteWorkout = (workoutId) => {
    deleteWorkoutMutation.mutate(workoutId);
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
    handleWorkoutClick,
    handleExerciseClick,
    handleActiveChange,
    handlePreviousPage,
    handleNextPage,
    workoutClick: handleWorkoutClick,
    deleteWorkout: handleDeleteWorkout,
    isRemoving: deleteWorkoutMutation.isLoading,
  };
}
