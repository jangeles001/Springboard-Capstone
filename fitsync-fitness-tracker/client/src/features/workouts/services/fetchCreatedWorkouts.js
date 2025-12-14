import { api } from "../../../services/api";

export async function fetchCreatedWorkouts({ page = 1, limit = 5, publicId }) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String((page - 1) * 10),
  });

  const { data } = await api.get(
    `api/v1/users/${publicId}/workouts/?${params.toString()}`
  );
  return data;
}
