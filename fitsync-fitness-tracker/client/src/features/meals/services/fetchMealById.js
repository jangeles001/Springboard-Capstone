import { api } from "../../../services/api";

export async function fetchMealById({ mealId }) {
  const response = await api.get(`api/v1/meals/${mealId}`);
  return response.data;
}
