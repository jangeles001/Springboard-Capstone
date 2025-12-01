import { useUserActions } from "../../../store/UserStore.js";
import { logout } from "../services/logoutService.js";

export function useLogout({ onSuccess }) {
  const { resetUser } = useUserActions();

  const handleLogout = async () => {
    try {
      const logoutMessage = await logout();
      resetUser();
      // Fires success callback if provided. Made generic to allow custom behavior on logout in the future.
      if (onSuccess) onSuccess();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return handleLogout;
}
