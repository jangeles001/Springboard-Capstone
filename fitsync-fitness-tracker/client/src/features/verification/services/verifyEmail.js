import { api } from "../../../services/api";

export function verifyEmail(token) {
  console.log("Verifying email with token:", token); // Debug log to check the token value
  return api.patch(`api/v1/auth/verify/email/${token}`, { verified: true });
}
