import { api } from "../../../services/api";

export async function fetchNutritionReports(range = "all") {
  const response = await api.get(
    `api/v1/users/reports/nutrition?range=${range}`
  );
  return response?.data;
}
