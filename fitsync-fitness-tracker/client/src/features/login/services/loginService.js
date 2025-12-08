import { api } from "../../../services/api.js";

export async function login(userCredentials) {
  const response = await api.post("api/v1/auth/login", userCredentials);
  const { username, publicId } = response.data.data;
  return { username, publicId };
}
