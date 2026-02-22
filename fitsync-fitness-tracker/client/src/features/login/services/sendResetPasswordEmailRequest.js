import { api } from "../../../services/api";

export function sendResetPasswordEmailRequest(email) {
  const response = api.post(`api/v1/auth/reset-password/`, { email });

  return response?.data;
}
