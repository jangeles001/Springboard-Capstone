import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCookiesStore = create(
    persist(
        (set) => ({
            consent: null, //"all", "essential", or decline
            setConsent: (choice) => set({ consent: choice }),
            }),
        {
            name: "cookieConsent",
        }
    )
);