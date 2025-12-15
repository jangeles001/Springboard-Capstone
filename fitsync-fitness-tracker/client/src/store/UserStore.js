import { create } from "zustand";

export const useUserStore = create((set) => ({
  username: null,
  publicId: null,
  actions: {
    setUsername: (state) => set({ username: state }),
    setPublicId: (state) => set({ publicId: state }),
    resetUser: () => set({ username: null, publicId: null }),
  },
}));

// State Selectors
export const useUsername = () => useUserStore((state) => state.username);
export const usePublicId = () => useUserStore((state) => state.publicId);

// Action selectors
export const useUserActions = () => useUserStore((state) => state.actions);
