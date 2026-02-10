import { api } from "../../../services/api";

export async function fetchMealById({ mealId }) {
  // Makes the API request to fetch meal details by ID
  const response = await api.get(`api/v1/meals/${mealId}`);
  return response.data;
}
