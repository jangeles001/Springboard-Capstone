import { create } from "zustand";

const initialFormData = {
  mealName: "",
  ingredients: [], // obnject ex. {id: USDA Id, name: ingredientName, quantity: ingredientQuantity}
  calories: 0,
};

const useMealsStore = create((set, get) => ({
  mealsList: [],
  mealFormData: initialFormData,
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
    removeFromMealsList: (mealName) => {
      set((state) => ({
        mealsList: [
          state.mealsList.filter((meal) => {
            return meal.mealName != mealName;
          }),
        ],
      }));
    },
    addIngredient: (ingredient) => {
      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          ingredients: [...state.mealFormData.ingredients, {...ingredient, quantity: 100}],
        } 
      }))
    },
    getIngredientQuantity: (ingredientId) => {
      const ingredient = get().mealFormData.ingredients.find((ingredient) => 
        ingredient.id === ingredientId
      );
      return ingredient ? ingredient.quantity : undefined;
    },
    changeIngredientQuantity: (ingredientId, newQuantity) => {
      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          ingredients: state.mealFormData.ingredients.map((ingredient) =>
            ingredient.id === ingredientId ? {...ingredient, quantity: newQuantity }
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
