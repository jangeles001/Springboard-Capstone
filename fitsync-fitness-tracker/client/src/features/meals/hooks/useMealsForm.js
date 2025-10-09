import {
  useMealFormDataIngredients,
  useMealFormDataMacros,
  useMealFormDataName,
  useMealsActions,
} from "../store/MealsFormStore";
import { getMacros } from "../utils/nutrition";

export function useMealsForm() {
  // Store State and action Selectors
  const mealName = useMealFormDataName();
  const ingredients = useMealFormDataIngredients();
  const macros = useMealFormDataMacros();

  const {
    setField,
    addIngredient,
    getIngredientField,
    updateMacros,
    changeIngredientField,
    removeIngredient,
  } = useMealsActions();

  // Handles updating store form fields state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  // Handles adding selected ingredients from dropdown to selected list state
  const handleClick = (item) => {
    const macros = getMacros(item) ?? {}; // Gets macros or returns empty object
    addIngredient({
      id: item.fdcId,
      name: item.description,
      quantity: "",
      macros: { protein: 0, fat: 0, carbs: 0, fiber: 0, netCarbs: 0, calories: 0 },
      calories: 0,
      caloriesPer100G: macros.calories,
      macrosPer100G: macros,
    });
  };

  const handleRemoveClick = (itemId) => {
    removeIngredient(itemId);
    updateMacros();
  };

  const handleIngredientQuantityChange = (id, value) => {
    // Allow empty input after clearing
    if (value === "") {
      changeIngredientField(id, "quantity", ""); // keep as empty string
      changeIngredientField(id, "calories", 0);
      return;
    }

    const quantity = Number(value);
    if (isNaN(quantity) || quantity <= 0) return;

    // Calculates macros for this ingredient
    const per100G = getIngredientField(id, "macrosPer100G") ?? {};
    const scaledMacros = Object.keys(per100G).reduce((acc, key) => {
      acc[key] = Math.round((per100G[key] * quantity) / 100);
      return acc;
    }, {});

    changeIngredientField(id, "quantity", Number(value));
    changeIngredientField(id, "macros", scaledMacros);
    updateMacros();
  };

  // Handles form submition
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return {
    mealName,
    ingredients,
    macros,
    getIngredientField,
    handleChange,
    handleClick,
    handleRemoveClick,
    handleIngredientQuantityChange,
    handleSubmit,
  };
}
