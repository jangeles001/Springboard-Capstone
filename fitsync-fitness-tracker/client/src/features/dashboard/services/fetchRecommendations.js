import { api } from "../../../services/api";

export function fetchRecommendations() {
  const response = api.get(`/users/recommendations/workouts`);

  return response.data;
}
