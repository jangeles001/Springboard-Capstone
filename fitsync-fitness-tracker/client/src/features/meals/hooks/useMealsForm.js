import { useMutation } from '@tanstack/react-query'
import {
  useMealFormDataName,
  useMealFormDataDescription,
  useMealFormDataIngredients,
  useMealFormDataMealMacros,
  useMealsActions,
} from "../store/MealsFormStore";
import { getMacros } from "../utils/nutrition";
import { api } from '../../../services/api';
import { useNotification } from '../../../hooks/useNotification';
import { usePublicId } from '../../../store/UserStore';

export function useMealsForm() {
  // Store State and Action Selectors
  const mealName = useMealFormDataName();
  const mealDescription = useMealFormDataDescription();
  const ingredients = useMealFormDataIngredients();
  const mealMacros = useMealFormDataMealMacros();
  const {
    setField,
    addIngredient,
    getIngredientField,
    updateMacros,
    changeIngredientField,
    removeIngredient,
    resetForm,
  } = useMealsActions();

  //Global User State
  const publicId =  usePublicId();

  // Hook State
  const { message, notify } = useNotification();

  const mealMutation = useMutation({
    mutationFn: (mealData) => {
      const response = api.post("api/v1/meals/create", mealData);
      return response?.data?.message;
    }
  });

  // Handles updating store form fields state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  // Handles adding selected ingredients from dropdown to selected list state
  const handleClick = (item) => {
    const macros = getMacros(item) ?? {}; // Gets macros or returns empty object
    addIngredient({
      ingredientId: item.fdcId,
      ingredientName: item.description,
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

  const handleIngredientQuantityChange = (e, id) => {
    const quantity = e.target.value;

    // Calculates macros for this ingredient
    const per100G = getIngredientField(id, "macrosPer100G") ?? {};
    const scaledMacros = Object.keys(per100G).reduce((acc, key) => {
      acc[key] = Math.round((per100G[key] * quantity) / 100);
      return acc;
    }, {});

    changeIngredientField(id, "quantity", quantity);
    changeIngredientField(id, "macros", scaledMacros);
    updateMacros();
  };

  // Handles form submition
  const handleSubmit = (e) => {
    e.preventDefault();
    const mealData = {
      mealName,
      mealDescription,
      creatorPublicId: publicId,
      ingredients,
      mealMacros: mealMacros,
    }
    mealMutation.mutate(
      mealData,
      {
          onSuccess: (message) => {
            resetForm();
            notify(message);
        },
        onError: () => {
          notify(message);
        }
      }
    )
  };

  return {
    mealName,
    mealDescription,
    ingredients,
    mealMacros,
    getIngredientField,
    message,
    handleChange,
    handleClick,
    handleRemoveClick,
    handleIngredientQuantityChange,
    handleSubmit,
  };
}
