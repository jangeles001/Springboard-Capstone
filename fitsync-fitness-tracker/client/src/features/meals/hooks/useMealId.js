import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMealById } from "../../../features/meals/services/fetchMealById";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore"; 

export function useMealId(mealId) {
    const publicId = usePublicId();  
    const queryClient = useQueryClient(); 
    const query = useQuery({
        queryKey: ["meal", mealId, publicId],
        queryFn: () => fetchMealById({ mealId, publicId }),
    });
    const deleteMealMutation = useMutation({
      mutationFn: (mealId) =>
        api.delete(`api/v1/users/${publicId}/meals/${mealId}`),
    });

    const handleDelete = () => {
    deleteMealMutation.mutate({ mealId });
    queryClient.invalidateQueries({
      queryKey: ["meal"],
    });
    console.log(`Delete meal with ID: ${mealId}`);
  }

    return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    handleDelete,
  };
}