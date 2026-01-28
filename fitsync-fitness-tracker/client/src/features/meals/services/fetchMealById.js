import { api } from "../../../services/api";

export async function fetchMealById({ mealId }) {
  const response =  await api.get(`api/v1/meals/${mealId}`);
  console.log(response.data);
  return response.data;
} ;