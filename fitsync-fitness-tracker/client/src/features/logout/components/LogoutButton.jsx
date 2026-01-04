import { useLogout } from "../hooks/useLogout";
import { useRouter } from "@tanstack/react-router";

export default function LogoutButton({ className = "" }) {
  const router = useRouter();

  const handleLogout = useLogout({
    onSuccess: () => router.navigate({ to: "/" }),
  });

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`hover:underline hover:cursor-pointer ${className}`}
    >
      Logout
    </button>
  );
}