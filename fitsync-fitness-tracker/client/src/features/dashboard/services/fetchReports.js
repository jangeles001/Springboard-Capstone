import { api } from "../../../services/api";

export async function fetchReports() {
  const response = await api.get(`api/v1/users/reports`);
  return response?.data;
}
