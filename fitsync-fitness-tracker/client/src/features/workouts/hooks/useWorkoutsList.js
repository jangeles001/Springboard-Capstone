import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchCreatedWorkouts } from "../services/fetchCreatedWorkouts";
import { api } from "../../../services/api";

export function useWorkoutsList({ limit }) {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["createdWorkouts", { page, limit }],
    queryFn: () => fetchCreatedWorkouts({ page, limit }),
    keepPreviousData: true,
  });

  const removeWorkoutMutation = useMutation({
    mutationFn: (workoutId) => api.delete(`api/v1/workouts/${workoutId}`),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["createdWorkouts"],
      });
    },
  });

  const handleWorkoutClick = (workoutId) => {
    console.log(workoutId);
    // redirect to workout page
  };

  const handleExerciseClick = (exerciseId) => {};

  const handleDeleteWorkout = (workoutId) => {
    removeWorkoutMutation.mutate(workoutId);
  };

  const handleNextPage = () => {
    setPage((state) => state + 1);
  };

  const handlePrevioustPage = () => {
    setPage((state) => Math.max(1, state - 1));
  };

  return {
    ...query,
    page,
    handleWorkoutClick,
    handleExerciseClick,
    deleteWorkout: handleDeleteWorkout,
    isRemoving: removeWorkoutMutation.isLoading,
  };
}
