import {
  useMealFormDataName,
  useMealFormDataIngredients,
  useMealFormDataCalories,
  useMealsActions,
} from "../features/meals/store/MealsFormStore";
import getCalories from "../utils/nutrition";

export function useMealsForm() {
  // Store State and action Selectors
  const mealName = useMealFormDataName();
  const ingredients = useMealFormDataIngredients();
  const totalCalories = useMealFormDataCalories();
  const { setField, addIngredient, getIngredientField, changeIngredientField } =
    useMealsActions();

  // Handles updating store form fields state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  // Handles adding selected ingredients from dropdown to selected list state
  const handleClick = (item) => {
    const cal = getCalories(item) ?? 0;
    addIngredient({
      id: item.fdcId,
      name: item.description,
      quantity: 0,
      calories: 0,
      caloriesPer100G: cal,
    });
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
    ingredients,
    totalCalories,
    getIngredientField,
    handleChange,
    handleClick,
    handleIngredientQuantityChange,
    handleSubmit,
  };
}
