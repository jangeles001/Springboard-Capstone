import { api } from "../../../services/api";

export async function fetchAllMeals({ page = 1, limit = 10 }) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String((page - 1) * 10),
  });

  const { data } = await api.get(`api/v1/meals/?${params.toString()}`);
  return data;
}