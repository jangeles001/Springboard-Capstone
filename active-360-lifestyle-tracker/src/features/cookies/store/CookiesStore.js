import { create } from "zustand";
import Cookies from "js-cookie";

const isProd = import.meta.env.VITE_APP_ENV === "production";

export const useCookiesStore = create(
  (set) => ({
    consent: Cookies.get("cookieConsent") || null, //"all", "essential", or decline
    setConsent: (choice) => {
      set({ consent: choice });

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
