import { useQueryClient } from "@tanstack/react-query";
import { useUserActions } from "../../../store/UserStore.js";
import { logout } from "../services/logoutService.js";

export function useLogout({ onSuccess }) {
  // Initializes the query client to invalidate user data after logout and the user actions to reset user state
  const queryClient = useQueryClient();

  // Gets the resetUser action from the user store to clear user data on logout
  const { resetUser } = useUserActions();

  const handleLogout = async () => {
    try {
      const logoutMessage = await logout();
      resetUser();
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // Fires success callback if provided. Made generic to allow custom behavior on logout in the future.
      if (onSuccess) onSuccess();
    } catch {
      return null;
    }
  };

  return handleLogout;
}
