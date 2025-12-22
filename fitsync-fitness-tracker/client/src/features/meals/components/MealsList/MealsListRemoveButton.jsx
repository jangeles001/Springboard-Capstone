import ThemedButton from "../../../../components/ThemedButton";

export function MealsListRemoveButton({ mealUUID, removeFunction }) {

  return (
    <>
      <ThemedButton
        text="Remove Workout"
        onClick={() => removeFunction(mealUUID)}
      />
    </>
  );
}
