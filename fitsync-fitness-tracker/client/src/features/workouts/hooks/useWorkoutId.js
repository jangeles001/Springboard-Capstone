import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fetchWorkoutById } from "../../../features/workouts/services/fetchWorkoutById";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";
import { toast } from "react-hot-toast";

export function useWorkoutId(workoutId) {
  // Global store state selector
  const publicId = usePublicId();

  // Initialize query client and navigation
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query hook fetches workout data for the given workoutId and caches the result per workoutId and publicId
  const query = useQuery({
    queryKey: ["workout", workoutId, publicId],
    queryFn: () => fetchWorkoutById({ workoutId }),
  });

  // Mutate hook that sends delete request to the delete workout endpoint
  const deleteWorkoutMutation = useMutation({
    mutationFn: (workoutId) =>
      api.delete(`api/v1/workouts/delete/${workoutId}`),
    onSuccess: () => {
      // Invalidate all queries containing this workout
      queryClient.invalidateQueries({
        queryKey: ["workouts", workoutId, publicId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workouts"],
      });
      toast.success("Workout deleted successfully!");
    },
    onError: () => toast.error("Something went wrong! Please try again later."),
  });

  // Mutate hook that sends duplication request to the duplication endpoint
  const addWorkoutMutation = useMutation({
    mutationFn: (workoutId) =>
      api.post(`api/v1/workouts/duplicate/${workoutId}`),
    onSuccess: () => {
      // Invalidates query cache so dashboard charts refreshes with updated data
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "workouts"],
      });

      // Invalidates query cache to ensure any new workouts are displayed in the user collections
      queryClient.invalidateQueries({
        queryKey: ["workouts", "Personal"],
      });
      toast.success("Workout logged successfully!");
    },
    onError: () => toast.error("Something went wrong! Please try again later!"),
  });

  // Function that handles navigation to the workouts display page
  const handleReturn = () => {
    return navigate({ to: "/dashboard/workouts" });
  };

  // Function calls the add workout mutation to add the workout to personal and log it if already in personal.
  const handleLog = () => {
    addWorkoutMutation.mutate(workoutId);
  };

  // Function calls delete workout mutation and removes any data associated with its key from the query client cache.
  const handleDelete = () => {
    deleteWorkoutMutation.mutate(workoutId);
    if (!deleteWorkoutMutation.isError) handleReturn();
  };

  return {
    publicId,
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    logIsPending: addWorkoutMutation.isPending,
    deleteIsPending: deleteWorkoutMutation.isPending,
    handleDelete,
    handleReturn,
    handleLog,
  };
}
