import { useWorkoutsListContext } from "../../hooks/useWorkoutsListContext"
import ThemedButton from "../../../../components/ThemedButton";

export function WorkoutsListRemoveButton({ workoutName }) {
  const { removeFromWorkoutsList } = useWorkoutsListContext();

  return (
    <>
      <ThemedButton
        text="Remove Workout"
        onClick={() => removeFromWorkoutsList(workoutName)}
      />
    </>
  );
}
