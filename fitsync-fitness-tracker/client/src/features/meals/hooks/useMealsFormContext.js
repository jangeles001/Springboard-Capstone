import { useContext } from "react";
import { MealsFormContext } from "../components/MealsForm/MealsFormContext";

export const useMealsFormContext = () => useContext(MealsFormContext);
