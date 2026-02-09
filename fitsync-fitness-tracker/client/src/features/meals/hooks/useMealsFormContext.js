import { useContext } from "react";
import { MealsFormContext } from "../components/MealsForm/MealsFormContext";

// Custom hook to access the MealsFormContext
export const useMealsFormContext = () => useContext(MealsFormContext);
