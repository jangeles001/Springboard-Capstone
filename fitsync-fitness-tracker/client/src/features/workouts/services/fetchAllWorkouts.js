import { api } from "../../../services/api";

export async function fetchAllWorkouts({ page = 1, limit = 10 }) {
  const params = new URLSearchParams({
    offset: String((page - 1) * limit),
    pageSize: String(limit),
  });

  const { data } = await api.get(`api/v1/workouts/?${params.toString()}`);
  return data;
}
