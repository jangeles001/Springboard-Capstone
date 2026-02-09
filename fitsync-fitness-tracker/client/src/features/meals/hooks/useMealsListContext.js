import { useContext } from "react";
import { MealsListContext } from "../components/MealsList/MealsListContext";

// Custom hook to access the MealsListContext
export const useMealsListContext = () => useContext(MealsListContext);
