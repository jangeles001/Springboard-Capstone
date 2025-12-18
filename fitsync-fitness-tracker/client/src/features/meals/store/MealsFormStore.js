import { create } from "zustand";

/*
ingredient object ex. {
id: USDA Id, 
name: ingredientName, 
quantity: ingredientQuantity, 
macros: macros object
calories: Kcal, 
caloriesPer100G: Kcalper100g
}
*/

const initialFormData = {
  mealName: "",
  mealDescription: "",
  ingredients: [],
  mealMacros: { protein: 0, fat: 0, carbs: 0, fiber: 0, netCarbs: 0, calories: 0 },
};

const useMealsStore = create((set, get) => ({
  mealFormData: initialFormData,
  hasErrors: {},
  actions: {
    setField: (field, value) => {
      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          [field]: value,
        },
      }));
    },
    updateMacros: () => {
      const ingredients = get().mealFormData.ingredients;
      const macros = ingredients.reduce(
        (acc, ingredient) => {
          const ingredientMacro = ingredient.macros || {};
          Object.keys(ingredientMacro).forEach((key) => {
            acc[key] += ingredientMacro[key] || 0;
          });
          return acc;
        },
        { protein: 0, fat: 0, carbs: 0, fiber: 0, netCarbs: 0, calories: 0 }
      );

      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          mealMacros: macros,
        },
      }));
    },
    getIngredientField: (itemId, field) => {
      const ingredients = get().mealFormData.ingredients;
      const ingredient = ingredients.find((item) => item.ingredientId === itemId);
      return ingredient ? ingredient[field] : undefined;
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
            ingredient.ingredientId === ingredientId
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
            (ingredient) => ingredient.ingredientId !== id
          ),
        },
      })),
    resetForm: () => {
      set(() => ({
        mealFormData: initialFormData,
        hasErrors: {},
      }));
    },
  },
}));

// State selectors
export const useMealFormData = () =>
  useMealsStore((state) => state.mealFormData);
export const useMealFormDataName = () =>
  useMealsStore((state) => state.mealFormData.mealName);
export const useMealFormDataDescription = () =>
  useMealsStore((state) => state.mealFormData.mealDescription);
export const useMealFormDataIngredients = () =>
  useMealsStore((state) => state.mealFormData.ingredients);
export const useMealFormDataCalories = () =>
  useMealsStore((state) =>
    state.mealFormData.ingredients.reduce(
      (sum, ingredient) => sum + (ingredient.macros.calories || 0),
      0
    )
  );
export const useMealFormDataMealMacros = () =>
  useMealsStore((state) => state.mealFormData.mealMacros);
export const useHasErrors = () => useMealsStore((state) => state.hasErrors);

// Actions selector
export const useMealsActions = () => useMealsStore((state) => state.actions);
