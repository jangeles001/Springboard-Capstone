import { useState } from 'react';
import { useMutation } from '@tanstack/react-query'
import {
  useMealFormDataName,
  useMealFormDataDescription,
  useMealFormDataIngredients,
  useMealFormDataMealMacros,
  useMealFormErrors,
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
  const formErrors = useMealFormErrors();
  const {
    setField,
    addIngredient,
    getIngredientField,
    updateMacros,
    changeIngredientField,
    removeIngredient,
    validateForm,
    resetForm,
    setFormErrors,
  } = useMealsActions();

  // Global User State
  const publicId =  usePublicId();

  // Notification State
  const { message, notify } = useNotification();

  // Local hook state
  const [hasErrors, setHasErrors] = useState(false);

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
    if (Object.keys(formErrors).includes(name)) delete formErrors[name];
  };

  // Handles adding selected ingredients from dropdown to selected list state
  const handleClick = (item) => {
    if (Object.keys(formErrors).includes("ingredients")) delete formErrors["ingredients"];

    const macros = getMacros(item) ?? {}; // Gets macros or returns empty object
    addIngredient({
      ingredientId: String(item.fdcId),
      ingredientName: item.description,
      quantity: "",
      macros: { protein: 0, fat: 0, carbs: 0, fiber: 0, netCarbs: 0, calories: 0 },
      calories: 0,
      caloriesPer100G: macros.calories,
      macrosPer100G: macros,
    });
  };

  const handleRemoveClick = (itemId) => {
    removeIngredient(String(itemId));
    updateMacros();
  };

  const handleIngredientQuantityChange = (e, id) => {
    if(e.target.value < 0) return; // Prevents negative quantities  
    if(e.target.value > 999) return; // Prevents quantities over 999g
    if(e.target.value === "") {
      changeIngredientField(id, "quantity", "");
      changeIngredientField(id, "macros", { protein: 0, fat: 0, carbs: 0, fiber: 0, netCarbs: 0, calories: 0 });
      updateMacros();
      return;
    }
    
    const quantity = Number(e.target.value);

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
    setHasErrors(false);
    console.log(ingredients);

    const mealData = {
      mealName,
      mealDescription,
      creatorPublicId: publicId,
      ingredients,
      mealMacros: mealMacros,
    }
    const { isValid } = validateForm();

    if(!isValid) {
      setHasErrors(true);
      return;
    } 

    mealMutation.mutate(
      mealData,
      {
        onSuccess: (message) => {
          resetForm();
          notify(message);
        },
        onError: (error) => {
          if (error.status === 400) {
            const details = error.response?.data?.details;
            console.log(error)
            if (details) {
              setFormErrors(details);
            }
          }
          setHasErrors(true);
        },
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
    formErrors,
    hasErrors,
    handleChange,
    handleClick,
    handleRemoveClick,
    handleIngredientQuantityChange,
    handleSubmit,
  };
}
