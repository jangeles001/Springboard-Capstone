import { create } from "zustand";

export const CategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async (force = false) => {
    set({ loading: true, error: null });
    const { categories } = get();
    if (!force && categories.length === 0) {
      try {
        const res = await fetch("https://wger.de/api/v2/exercisecategory/");

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        set({ categories: data.results, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    }
  },
}));
