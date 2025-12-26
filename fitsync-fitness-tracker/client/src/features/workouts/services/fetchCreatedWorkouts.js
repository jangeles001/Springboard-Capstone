import { api } from "../../../services/api";

export async function fetchCreatedWorkouts({ page = 1, limit = 10, publicId }) {
  const params = new URLSearchParams({
    offset: String((page - 1) * limit),
    pageSize: String(limit),
  });

  const { data } = await api.get(
    `api/v1/users/${publicId}/workouts/?${params.toString()}`
  );
  return data;
}
