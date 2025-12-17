import { api } from "../../../services/api.js";

export async function register(userData) {
  const response = await api.post("api/v1/auth/register", userData);
  return response;
}
