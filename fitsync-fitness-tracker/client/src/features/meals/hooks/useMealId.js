import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fetchMealById } from "../../../features/meals/services/fetchMealById";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";
import { toast } from "react-hot-toast";

export function useMealId(mealId) {
  // Global store state selector
  const publicId = usePublicId();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Query hook fetches workout data for the given mealId and caches the result per mealtId and publicId
  const query = useQuery({
    queryKey: ["meal", mealId, publicId],
    queryFn: () => fetchMealById({ mealId }),
  });

  // Mutate hook that sends delete request to the delete meals endpoint
  const deleteMealMutation = useMutation({
    mutationFn: (mealId) => api.delete(`api/v1/meals/delete/${mealId}`),
  });

  // Mutate hook that sends duplication request to the duplication endpoint
  const addMealMutation = useMutation({
    mutationFn: (mealId) => api.post(`api/v1/meals/duplicate/${mealId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["meal"],
      });
      toast.success("Meal logged successfully!");
    }
  });

  // Function that handles navigation to the meals display page
  const handleReturn = () => {
    return navigate({ to: "/dashboard/meals" });
  };

  // Function calls add meal mutation to either add meal to the users personal collection and logs it or just logs it if it already exists in users collection
  const handleLog = () => {
    addMealMutation.mutate(mealId);
  };

  // Function calls delete meal mutation and removes any data associated with its key from the query client cache.
  const handleDelete = () => {
    deleteMealMutation.mutate(mealId);
    queryClient.invalidateQueries({
      queryKey: ["meal"],
    });
    handleReturn();
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
