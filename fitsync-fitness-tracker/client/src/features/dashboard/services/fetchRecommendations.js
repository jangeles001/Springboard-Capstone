import { api } from "../../../services/api";

export async function fetchRecommendations() {
  const response = await api.get(`api/v1/users/recommendations/workouts`);

  return response?.data;
}
