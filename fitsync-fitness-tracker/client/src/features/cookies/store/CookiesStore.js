import { create } from "zustand";
import Cookies from "js-cookie";

const isProd = import.meta.env.VITE_APP_ENV === "production";

// Zustand store for managing cookie consent state and actions
export const useCookiesStore = create(
  (set) => ({
    consent: Cookies.get("cookieConsent") || null, //"all", "essential", or decline
    setConsent: (choice) => {
      set({ consent: choice });

      // Set the cookie consent choice in a cookie that expires in 1 year, with appropriate security settings
      Cookies.set("cookieConsent", choice, {
        expires: 365,
        path: "/",
        sameSite: "Lax",
        secure: isProd,
      });
    },
  }),
  {
    name: "cookieConsent",
  }
);
