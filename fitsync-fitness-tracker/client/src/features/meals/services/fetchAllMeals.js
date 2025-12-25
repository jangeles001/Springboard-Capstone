import { api } from "../../../services/api";

export async function fetchAllMeals({ page = 1, limit = 10 }) {
  const params = new URLSearchParams({
    page: String((page - 1) * 10),
    pageSize: String(limit),
  
  });

  const response  = await api.get(`api/v1/meals/?${params.toString()}`);
  console.log(response);
  return response.data;
}