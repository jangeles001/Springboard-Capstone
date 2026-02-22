import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fetchMealById } from "../../../features/meals/services/fetchMealById";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";
import { toast } from "react-hot-toast";

export function useMealId(mealId) {
  // Global store state selector
  const publicId = usePublicId();

  // Initialize query client and navigation
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query hook fetches meal data for the given mealId and caches the result per mealId and publicId
  const query = useQuery({
    queryKey: ["meal", mealId, publicId],
    queryFn: () => fetchMealById({ mealId }),
  });

  // Mutate hook that sends delete request to the delete meals endpoint
  const deleteMealMutation = useMutation({
    mutationFn: (mealId) => api.delete(`api/v1/meals/delete/${mealId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        // Invalidate all queries containing this meal
        queryKey: ["meal", mealId, publicId],
      });
      queryClient.invalidateQueries({
        queryKey: ["meals"],
      });
      toast.success("Meal deleted successfully!");
    },
    onError: () => toast.error("Something went wrong! Please try again later."),
  });

  // Mutate hook that sends duplication request to the duplication endpoint
  const addMealMutation = useMutation({
    mutationFn: (mealId) => api.post(`api/v1/meals/duplicate/${mealId}`),
    onSuccess: () => {
      // Invalidates query cache so dashboard charts refreshes with updated data
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "nutrition"],
      });

      // Invalidates query cache to ensure any new workouts are displayed in the user collections
      queryClient.invalidateQueries({
        queryKey: ["meals", "Personal"],
      });
      toast.success("Meal logged successfully!");
    },
    onError: () => toast.error("Something went wrong! Please try again later!"),
  });

  // Function that handles navigation to the meals display page
  const handleReturn = () => {
    return navigate({ to: "/dashboard/meals" });
  };

  // Function calls add meal mutation to either add meal to the users personal collection and logs it or just logs
  //  it if it already exists in users collection
  const handleLog = () => {
    addMealMutation.mutate(mealId);
  };

  // Function calls delete meal mutation and removes any data associated with its key from the query client cache.
  const handleDelete = () => {
    deleteMealMutation.mutate(mealId);
    if (!deleteMealMutation.isError) handleReturn();
  };

  return {
    publicId,
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    handleReturn,
    handleLog,
    handleDelete,
  };
}
