import { useLogout } from "../hooks/useLogout";
import { useNavigate } from "@tanstack/react-router";

export default function LogoutButton({ className = "" }) {
  // Initializes the router for navigation after logout
  const navigate = useNavigate();

  // Sets up the logout handler using the custom useLogout hook, with a success callback to navigate to the home page
  const handleLogout = useLogout({
    onSuccess: () => navigate({ to: "/auth/login" }),
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