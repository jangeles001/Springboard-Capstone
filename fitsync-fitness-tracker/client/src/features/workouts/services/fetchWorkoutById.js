import { api } from "../../../services/api";

export async function fetchWorkoutById({ workoutId }) {
  const response = await api.get(`api/v1/workouts/${workoutId}`);
  return response?.data;
}
