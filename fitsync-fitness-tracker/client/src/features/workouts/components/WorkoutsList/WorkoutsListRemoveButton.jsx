import ThemedButton from "../../../../components/ThemedButton";

export function WorkoutsListRemoveButton({ workoutUUID, removeFunction }) {

  return (
    <>
      <ThemedButton
        text="Remove Workout"
        onClick={() => removeFunction(workoutUUID)}
      />
    </>
  );
}
