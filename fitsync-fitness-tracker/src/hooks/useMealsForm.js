import { useState, useEffect, useCallback } from "react";
import {
  useMealFormDataName,
  useMealFormDataIngredients,
  useMealFormDataCalories,
  useMealFormData,
  useMealsActions,
} from "../features/meals/store/MealsFormStore";
import fetchIngredients from "../services/fetchIngredients";

export function useMealsForm() {
  const mealName = useMealFormDataName();
  const ingredients = useMealFormDataIngredients();
  const calories = useMealFormDataCalories();
  const mealFormData = useMealFormData();
  const { setField } = useMealsActions();

  // Sets hook state based on response from API
  const loadData = useCallback(async (url) => {
    // setStatus("loading");
    // setError(null);
    try {
      const { results } = await fetchIngredients(url);
      console.log(results);
      //   setStatus("success");
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    loadData(
      "https://api.nal.usda.gov/fdc/v1/foods/list?dataType=Branded,Foundation,Survey&pageSize=50"
    );
  });
  return {
    mealName,
    ingredients,
    calories,
    handleChange,
    handleSubmit,
  };
}
