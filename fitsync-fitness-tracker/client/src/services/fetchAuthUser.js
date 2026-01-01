// services/fetchAuthUser.js
import { api } from "./api";

export async function fetchAuthUser() {
  const response = await api.get("/api/v1/auth/me");
  return response?.data?.data;
}
