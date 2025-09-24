import { create } from "zustand";

const initialState = {
  mealName: "",
  ingredients: [],
  calories: 0,
};

const useMealsStore = create((set) => ({
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
    addToMealsList: (mealData) => {
      set((state) => ({
        mealsList: [...state.mealsList, mealData],
      }));
    },
    removeFromMealsList: (name) => {
      set((state) => ({
        mealsList: [
          state.mealsList.filter((meal) => {
            return meal.mealName != name;
          }),
        ],
      }));
    },
  },
}));

// State selectors
export const useMealsList = () => useMealsStore((state) => state.mealsList);
export const useMealFormData = () =>
  useMealsStore((state) => state.mealFormData);
export const useMealFormDataName = () =>
  useMealsStore((state) => state.mealFormData.mealName);
export const useMealFormDataIngredients = () =>
  useMealsStore((state) => state.mealFormData.ingredients);
export const useMealFormDataCalories = () =>
  useMealsStore((state) => state.mealFormData.calories);
export const useHasErrors = () => useMealsStore((state) => state.hasErrors);

// Actions selector
export const useMealsActions = () => useMealsStore((state) => state.actions);
