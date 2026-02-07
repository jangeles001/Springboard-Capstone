import { api } from "../../../services/api";

export function fetchRecommendations() {
  const response = api.get(`api/v1/users/recommendations/workouts`);

  return response.data;
}
