import { useAuthUser } from "../../../hooks/useAuthUser";

export function AuthBootstrap() {
  useAuthUser();
  return null;
}