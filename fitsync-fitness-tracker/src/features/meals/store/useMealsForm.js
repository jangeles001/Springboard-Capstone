import { create } from "zustand";

const initialState = {
  mealName: "",
  ingredients: [],
  calories: "",
};

const useMealsStore = create((set, get) => ({
  mealsList: [],
  mealsFormData: initialState,

  actions: {
    setField: (field, value) => {
      set((state) => ({
        mealsFormData: {
          ...state.mealsFormData,
          [field]: value,
        },
      }));
    },
  },
}));

// State selectors
export const useMealsList = () => useMealsStore((state) => state.mealsList);
export const useMealsFormData = () =>
  useMealsStore((state) => state.mealsFormData);

// Action selector
export const useMealsActions = () => useMealsStore((state) => state.actions);
