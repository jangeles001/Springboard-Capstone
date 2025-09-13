import { create } from "zustand";

export const LoadingStore = create((set) => ({
  isGlobalLoading: false,
  setIsGlobal: (state) => set({ isGlobalLoading: state }),
}));
