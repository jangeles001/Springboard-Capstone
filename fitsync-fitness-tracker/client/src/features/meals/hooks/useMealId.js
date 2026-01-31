import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fetchMealById } from "../../../features/meals/services/fetchMealById";
import { api } from "../../../services/api";
import { usePublicId } from "../../../store/UserStore";

export function useMealId(mealId) {
  const publicId = usePublicId();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const query = useQuery({
    queryKey: ["meal", mealId, publicId],
    queryFn: () => fetchMealById({ mealId, publicId }),
  });
  const deleteMealMutation = useMutation({
    mutationFn: (mealId) =>
      api.delete(`api/v1/users/${publicId}/meals/${mealId}`),
  });

  const addMealMutation = useMutation({
    mutationFn: (mealId) =>
      api.post(`api/v1/users/${publicId}/meals/duplicate`, { mealId }),
  });

  const handleReturn = () => {
    return navigate({ to: "/dashboard/meals" });
  };

  const handleAddToPersonal = () => {
    addMealMutation.mutate({ mealId });
  };

  const handleDelete = () => {
    deleteMealMutation.mutate({ mealId });
    queryClient.invalidateQueries({
      queryKey: ["meal"],
    });
    console.log(`Delete meal with ID: ${mealId}`);
  };

  return {
    publicId,
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    handleReturn,
    handleAddToPersonal,
    handleDelete,
  };
}
