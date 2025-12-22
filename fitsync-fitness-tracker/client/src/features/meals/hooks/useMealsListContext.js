import { useContext } from "react";
import { MealsListContext } from "../components/MealsList/MealsListContext";

export const useMealsListContext = () => useContext(MealsListContext);
