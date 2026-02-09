import { useContext } from "react";
import { WorkoutsListContext } from "../components/WorkoutsList/WorkoutsListContext";

export function useWorkoutsListContext() {
  const context = useContext(WorkoutsListContext);

  // Ensure the hook is used within the appropriate provider. *Had issues with this hook so that is why this is only on this component*
  // *Should probably add to other components, but seems redundant if they are already working (.-.)*
  if (!context) {
    throw new Error(
      "useWorkoutsListContext must be used within a WorkoutsListComposer"
    );
  }

  return context;
}
