import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserWorkouts } from "../services/fetchUserWorkouts";
import { fetchAllWorkouts } from "../services/fetchAllWorkouts";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";
import { useNavigate } from "@tanstack/react-router";

export function useWorkoutsList({ limit }) {
  const queryClient = useQueryClient();
  const publicId = usePublicId();
  const navigate = useNavigate();

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
          ? fetchUserWorkouts({ page: nextPage, limit })
          : fetchAllWorkouts({ page: nextPage, limit }),
    });
  }, [active, pages, limit, queryClient]);

  const query = useQuery({
    queryKey: ["workouts", active, pages[active], limit],
    queryFn: () =>
      active === "Personal"
        ? fetchUserWorkouts({ page: pages[active], limit })
        : fetchAllWorkouts({ page: pages[active], limit }),
    keepPreviousData: true,
  });

  const deleteWorkoutMutation = useMutation({
    mutationFn: (workoutId) =>
      api.delete(`api/v1/workouts/delete/${workoutId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
    },
  });

  const handleWorkoutClick = (workoutId) => {
    return navigate({
      to: "/dashboard/workouts/$workoutId",
      params: { workoutId: workoutId },
    });
  };

  const handleExerciseClick = (exerciseId) => {
    console.log(exerciseId);
    // redirect to exercise page
  };

  const handleDelete = (workoutId) => {
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
    onClick: handleWorkoutClick,
    handleDelete,
    isRemoving: deleteWorkoutMutation.isLoading,
  };
}
