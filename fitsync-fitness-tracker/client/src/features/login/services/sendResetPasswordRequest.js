import { api } from "../../../services/api";

export function sendResetPasswordRequest(token, password) {
  const response = api.patch(`api/v1/auth/reset-password/${token}`, {
    password,
  });

  return response?.data;
}
