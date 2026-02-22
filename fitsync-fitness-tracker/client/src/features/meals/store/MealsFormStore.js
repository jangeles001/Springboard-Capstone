import { create } from "zustand";
import { removeKey } from "../../../utils/stateHelpers";

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
  mealMacros: {
    protein: 0,
    fat: 0,
    carbs: 0,
    fiber: 0,
    netCarbs: 0,
    calories: 0,
  },
};

const validators = {
  mealName: [(value) => (!value ? "Meal name is required!" : "")],
  mealDescription: [(value) => (!value ? "Meal description is required!" : "")],
  ingredients: [
    (value) =>
      value.length <= 0 ? "You must select at least one ingredient!" : "",
    (value) => {
      const invalid = value.some((ingredient) => !ingredient.quantity);
      return invalid ? "One or more ingredients has invalid values" : "";
    },
  ],
};

const useMealsStore = create((set, get) => ({
  mealFormData: initialFormData,
  formErrors: {},
  actions: {
    setField: (field, value) => {
      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          [field]: value,
        },
      }));

      const { formErrors, actions } = get();
      if (field in formErrors) {
        actions.setFormErrors((prev) => removeKey(prev, field));
      }
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
        { protein: 0, fat: 0, carbs: 0, fiber: 0, netCarbs: 0, calories: 0 },
      );

      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          mealMacros: macros,
        },
      }));
    },
    // Sets formErrors state via updater function or direct value
    setFormErrors: (updater) =>
      set((state) => ({
        formErrors:
          typeof updater === "function" ? updater(state.formErrors) : updater,
      })),
    getIngredientField: (itemId, field) => {
      const ingredients = get().mealFormData.ingredients;
      const ingredient = ingredients.find(
        (item) => item.ingredientId === itemId,
      );
      return ingredient ? ingredient[field] : undefined;
    },
    addIngredient: (ingredient) => {
      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          ingredients: [...state.mealFormData.ingredients, { ...ingredient }],
        },
      }));

      const { formErrors, actions } = get();
      if (formErrors?.ingredients) {
        actions.setFormErrors((prev) => removeKey(prev, "ingredients"));
      }
    },
    changeIngredientField: (ingredientId, field, value) => {
      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          ingredients: state.mealFormData.ingredients.map((ingredient) =>
            ingredient.ingredientId === ingredientId
              ? { ...ingredient, [field]: value }
              : ingredient,
          ),
        },
      }));
      const { formErrors, actions } = get();
      if (formErrors?.ingredients) {
        actions.setFormErrors((prev) => removeKey(prev, "ingredients"));
      }
    },
    removeIngredient: (id) => {
      set((state) => ({
        mealFormData: {
          ...state.mealFormData,
          ingredients: state.mealFormData.ingredients.filter(
            (ingredient) => ingredient.ingredientId !== id,
          ),
        },
      }));

      const { formErrors, actions } = get();
      if (formErrors?.ingredients) {
        actions.setFormErrors((prev) => removeKey(prev, "ingredients"));
      }
    },
    resetForm: () => {
      set(() => ({
        mealFormData: initialFormData,
        formErrors: {},
      }));
    },
    validateForm: () => {
      const { mealFormData } = get();
      const formErrors = {};

      for (const [field, rules] of Object.entries(validators)) {
        for (const validate of rules) {
          const error = validate(mealFormData[field]);
          if (error) {
            formErrors[field] = [...(formErrors[field] || []), error];
          }
        }
      }

      const isValid = Object.keys(formErrors)?.length === 0;

      set({ formErrors, isValid });

      return { isValid };
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
      0,
    ),
  );
export const useMealFormDataMealMacros = () =>
  useMealsStore((state) => state.mealFormData.mealMacros);
export const useMealFormErrors = () =>
  useMealsStore((state) => state.formErrors);

// Actions selector
export const useMealsActions = () => useMealsStore((state) => state.actions);
