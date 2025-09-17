import { create } from "zustand";

const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  actions: {
    // Fetches categories unless the categories array is populated
    // Can be forced to fetch categories by passing true boolean
    fetchCategories: async (force = false) => {
      set({ loading: true, error: null });
      const { categories } = get();
      if (!force && categories.length === 0) {
        try {
          const res = await fetch("https://wger.de/api/v2/exercisecategory/"); //update to backend endpoint when backend is created

          if (!res.ok) throw new Error("Failed to fetch categories");

          const data = await res.json();

          set({ categories: data.results, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      }
    },
  },
}));

// State selectors
export const useCatergories = () =>
  useCategoryStore((state) => state.categories);
export const useLoading = () => useCategoryStore((state) => state.loading);
export const useError = () => useCategoryStore((state) => state.error);

// Actions selector
export const useCategoryActions = () =>
  useCategoryStore((state) => state.actions);
