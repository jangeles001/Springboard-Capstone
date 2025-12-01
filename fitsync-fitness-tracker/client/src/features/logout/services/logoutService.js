import { api } from "../../../services/api";

export async function logout() {
  const response = await api.get("api/v1/auth/logout");
  return response.data.messege;
}
