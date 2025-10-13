import { useContext } from "react";
import { WorkoutsListContext } from "../components/WorkoutsList/WorkoutsListContext";

export const useWorkoutsListContext = () => useContext(WorkoutsListContext);
