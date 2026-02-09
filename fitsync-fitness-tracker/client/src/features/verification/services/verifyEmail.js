import { api } from "../../../services/api";

export function verifyEmail(token) {
  return api.patch(`api/v1/auth/verify/email/${token}`, { verified: true });
}
