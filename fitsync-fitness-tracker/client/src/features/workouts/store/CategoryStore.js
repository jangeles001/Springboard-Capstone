import { create } from "zustand";

const useCategoryStore = create((set, get) => ({
  categories: [],
  status: "idle", // "idle" | "loading" | "error" | "success"
  error: null,

  actions: {
    // Fetches categories unless the categories array is populated
    // Can be forced to fetch categories by passing true boolean
    fetchCategories: async (force = false) => {
      const { categories } = get();
      if (!force && categories.length > 0) {
        return;
      }
      set({ status: "loading", error: null });
      try {
        const res = await fetch("https://wger.de/api/v2/exercisecategory/"); //update to backend endpoint when backend is created

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();

        set({ categories: data.results, status: "success" });
      } catch (error) {
        set({ error: error.message, status: "error" });
      }
    },
  },
}));

// State selectors
export const useCategories = () =>
  useCategoryStore((state) => state.categories);
export const useCategoriesStatus = () => useCategoryStore((state) => state.status);
export const useCategoriesError = () => useCategoryStore((state) => state.error);

// Actions selector
export const useCategoryActions = () =>
  useCategoryStore((state) => state.actions);
