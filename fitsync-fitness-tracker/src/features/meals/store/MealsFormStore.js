import { create } from "zustand";

const initialFormData = {
  mealName: "",
  ingredients: [], // obnject ex. {id: USDA Id, name: ingredientName, quantity: ingredientQuantity, calories: Kcal, caloriesPer100G: Kcalper100g}
  calories: 0,
};

const useMealsStore = create((set, get) => ({
  mealsList: [],
  mealFormData: initialFormData,
  hasErrors: null,

  actions: {
    setMealsList: () => {
      set((state) => ({
        mealsList: [...state.mealsList, state.mealFormData],
      }));
    },
    setField: (field, value) => {
      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          [field]: value,
        },
      }));
    },
    getIngredientField: (itemId, field) => {
      const ingredients = get().mealFormData.ingredients;
      const ingredient = ingredients.find((item) => item.id === itemId);
      return ingredient ? ingredient[field] : undefined;
    },
    getTotalCalories: () => {
      const ingredients = get().mealFormData.ingredients;
      return ingredients.reduce(
        (sum, ingredient) => sum + ingredient.calories,
        0
      );
    },
    addToMealsList: (mealData) => {
      set((state) => ({
        mealsList: [...state.mealsList, mealData],
      }));
    },
    removeFromMealsList: (mealName) => {
      set((state) => ({
        mealsList: state.mealsList.filter((meal) => meal.mealName != mealName),
      }));
    },
    addIngredient: (ingredient) => {
      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          ingredients: [...state.mealFormData.ingredients, { ...ingredient }],
        },
      }));
    },
    changeIngredientField: (ingredientId, field, value) => {
      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          ingredients: state.mealFormData.ingredients.map((ingredient) =>
            ingredient.id === ingredientId
              ? { ...ingredient, [field]: value }
              : ingredient
          ),
        },
      }));
    },
    removeIngredient: (id) =>
      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          ingredients: state.mealFormData.ingredients.filter(
            (ingredient) => ingredient.id !== id
          ),
        },
      })),
    resetForm: () => {
      set(() => ({
        mealFormData: initialFormData,
        hasErrors: null,
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
  useMealsStore((state) =>
    state.mealFormData.ingredients.reduce(
      (sum, ingredient) => sum + (ingredient.calories || 0),
      0
    )
  );
export const useHasErrors = () => useMealsStore((state) => state.hasErrors);

// Actions selector
export const useMealsActions = () => useMealsStore((state) => state.actions);
