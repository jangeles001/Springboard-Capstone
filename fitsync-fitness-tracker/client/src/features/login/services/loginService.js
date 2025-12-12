import { api } from "../../../services/api.js";

export async function login(userCredentials) {
  const response = await api.post("api/v1/auth/login", userCredentials,
    {
      headers: { "Content-Type": "application/json" }
    }

  );
  const { username, publicId } = response.data.data;
  return { username, publicId };
}
