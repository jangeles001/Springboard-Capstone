import { create } from "zustand";

const initialState = {
  mealName: "",
  ingredients: [],
  calories: "",
};

const useMealsStore = create((set, get) => ({
  mealsList: [],
  mealFormData: initialState,
  hasErrors: null,

  actions: {
    setField: (field, value) => {
      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          [field]: value,
        },
      }));
    },
  },
}));

// State selectors
export const useMealsList = () => useMealsStore((state) => state.mealsList);
export const useMealFormData = () =>
  useMealsStore((state) => state.mealFormData);
export const useMealFormDataName = () => useMealsStore((state) => state.mealFormData.mealName);
export const useMealFormDataIngredients = () => useMealsStore((state) => state.mealFormData.ingredients);
export const useMealFormDataCalories = () => useMealsStore((state) => state.mealFormData.calories);
export const useHasErrors = () => useMealsStore((state) => state.hasErrors);

// Action selector
export const useMealsActions = () => useMealsStore((state) => state.actions);
