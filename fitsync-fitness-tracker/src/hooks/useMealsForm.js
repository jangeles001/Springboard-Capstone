import {
  useMealsStore,
  useMealFormDataName,
  useMealsActions,
} from "../features/meals/store/MealsFormStore";
import { shallow } from 'zustand/shallow'
import { getCalories, getMacros } from "../utils/nutrition";
export function useMealsForm() {
  // Store State and action Selectors
  const mealName = useMealFormDataName();
  const { macros, totalCalories } = useMealsStore(
    state => {
      const ingredients = state.mealFormData.ingredients;
      const totalCalories = ingredients.reduce((sum, i) => sum + (i.calories || 0), 0);
      const macros = ingredients.reduce((acc, ingredient) => {
        const ingredientMacro = ingredient.macros || {};
        acc.Protein += ingredientMacro.Protein || 0;
        acc.Fat += ingredientMacro.Fat || 0;
        acc.Carbs += ingredientMacro.Carbs || 0;
        acc.Fiber += ingredientMacro.Fiber || 0;
        acc.NetCarbs += ingredientMacro.NetCarbs || 0;
        return acc;
    }, { Protein: 0, Fat: 0, Carbs: 0, Fiber: 0, NetCarbs: 0 });
    return { macros, totalCalories };
   },
    shallow
  );

  const {
    setField,
    addIngredient,
    getIngredientField,
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
    console.log(item);
    const cal = getCalories(item) ?? 0;
    const macros = getMacros(item) ?? 0;
    addIngredient({
      id: item.fdcId,
      name: item.description,
      quantity: 0,
      macros,
      calories: 0,
      caloriesPer100G: cal,
    });
  };

  const handleRemoveClick = (itemId) => {
    removeIngredient(itemId);
  };

  const handleIngredientQuantityChange = (id, value) => {
    // Allow empty input after clearing
    if (value === "") {
      changeIngredientField(id, "quantity", ""); // keep as empty string
      changeIngredientField(id, "calories", 0);
      return;
    }

    const quantity = Number(value);
    if (isNaN(quantity) || quantity < 0) return;

    const per100 = getIngredientField(id, "caloriesPer100G") ?? 0;
    // calculate calories for this ingredient
    const newCalories = Math.round((per100 * value) / 100);

    changeIngredientField(id, "quantity", Number(value));
    changeIngredientField(id, "calories", newCalories);
  };

  // Handles form submition
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  
  return {
    mealName,
    ingredients: mealFormData.ingredients,
    macros,
    totalCalories,
    getIngredientField,
    handleChange,
    handleClick,
    handleRemoveClick,
    handleIngredientQuantityChange,
    handleSubmit,
  };
}
