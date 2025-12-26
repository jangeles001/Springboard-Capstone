import { api } from "../../../services/api";

export async function fetchCreatedMeals({ page = 1, limit = 10, publicId }) {
  const params = new URLSearchParams({
    page: String((page - 1) * 10),
    pageSize: String(limit),
  });

  const { data } = await api.get(
    `api/v1/users/${publicId}/meals/?${params.toString()}`
  );
  return data;
}
