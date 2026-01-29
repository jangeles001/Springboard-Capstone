import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fetchWorkoutById } from "../../../features/workouts/services/fetchWorkoutById";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";

export function useWorkoutId(workoutId) {
  const publicId = usePublicId();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ["workout", workoutId, publicId],
    queryFn: () => fetchWorkoutById({ workoutId, publicId }),
  });
  const deleteWorkoutMutation = useMutation({
    mutationFn: (workoutId) =>
      api.delete(`api/v1/users/${publicId}/workouts/${workoutId}`),
  });

  const addMealMutation = useMutation({
    mutationFn: (mealId) =>
      api.post(`api/v1/users/${publicId}/workouts/add`, { mealId }),
  });

  const handleReturn = () => {
    return navigate({ to: "/dashboard/workouts" });
  };

  const handleAddToPersonal = () => {
    addMealMutation.mutate({ mealId });
  };

  const handleDelete = () => {
    deleteWorkoutMutation.mutate({ workoutId });
    queryClient.invalidateQueries({
      queryKey: ["workout"],
    });
    console.log(`Delete workout with ID: ${workoutId}`);
  };

  return {
    publicId,
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    handleDelete,
    handleReturn,
    handleAddToPersonal,
  };
}
