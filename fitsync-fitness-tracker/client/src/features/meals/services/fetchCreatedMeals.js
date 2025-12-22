import { api } from "../../../services/api";

export async function fetchCreatedMeals({ page = 1, limit = 5, publicId }) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String((page - 1) * 10),
  });

  const { data } = await api.get(
    `api/v1/users/${publicId}/meals/?${params.toString()}`
  );
  return data;
}