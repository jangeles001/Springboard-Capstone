import { useState } from "react";
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
  const calories = useMealFormDataCalories();
  const { setField } = useMealsActions();

  // Local hook state
  const [ingredientsSelection, setIngredientsSelection] = useState([]);
  const [calculatedCal, setCalculatedCal] = useState(0);

  // Handles updating store form fields state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  // Handles adding selected ingredients from dropdown to selected list state
  const handleClick = (item) => {
    const cal = getCalories(item) ?? 0;
    setIngredientsSelection((prevState) => [...prevState, item]);
    setCalculatedCal((prevState) => Math.round(prevState + cal));
  };

  // Handles form submition
  const handleSubmit = (e) => {
    e.preventDefault();
    setField(ingredients, ingredientsSelection);
    setField(calories, calculatedCal);
  };

  return {
    mealName,
    ingredientsSelection,
    calculatedCal,
    handleChange,
    handleClick,
    handleSubmit,
  };
}
