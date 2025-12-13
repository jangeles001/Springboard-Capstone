import { useContext } from "react";
import { WorkoutsListContext } from "../components/WorkoutsList/WorkoutsListContext";

export function useWorkoutsListContext() {
  const context = useContext(WorkoutsListContext);

  if (!context) {
    throw new Error(
      "useWorkoutsListContext must be used within a WorkoutsListComposer"
    );
  }

  return context;
}
