import { useState } from 'react'
import { 
    useMealFormDataName, 
    useMealFormDataIngredients,
    useMealFormDataCalories, 
    useMealFormData,
    useMealsActions, 
    } from '../features/meals/store/MealsFormStore'

export function useMealsForm() {

    const  mealName = useMealFormDataName()
    const ingredients = useMealFormDataIngredients(); 
    const calories = useMealFormDataCalories(); 
     const mealFormData = useMealFormData();
    const { setField } = useMealsActions();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setField(name, value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

    }

    return {
        mealName,
        ingredients,
        calories,
        handleChange,
        handleSubmit,
    }
}