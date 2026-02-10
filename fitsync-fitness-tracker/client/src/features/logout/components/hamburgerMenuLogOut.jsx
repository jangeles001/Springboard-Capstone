import { useLogout } from "../hooks/useLogout";
import { useNavigate } from "@tanstack/react-router";

export default function LogoutButton({ className = "" }) {
  // Initializes the router for navigation after logout
  const navigate = useNavigate();

  // Sets up the logout handler using the custom useLogout hook, with a success callback to navigate to the home page
  const handleLogout = useLogout({
    onSuccess: () => navigate({ to: "/" }),
  });

  return (
    <div
    className="px-2 py-2 hover:bg-gray-200 cursor-pointer"
    onClick={handleLogout}
    >
        <button
          type="button"
          onClick={handleLogout}
          className={`hover:underline hover:cursor-pointer ${className}`}
        >
          Logout
        </button>
    </div>
  );
}