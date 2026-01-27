import { useWorkoutsBuilderContext } from "../../hooks/useWorkoutsBuilder"
import { FormField }  from "../../../../components/FormField"
import { FormInput } from "../../../../components/FormInput"

export function WorkoutsBuilderHeader() {
  const { nameError, workoutName, workoutDuration, handleFieldChange } = useWorkoutsBuilderContext();

  return (
    <div className="border-b pb-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Workout Details
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          name="workoutName"
          label="Workout Name"
          formError={nameError}
        >
          <FormInput
          name="workoutName"
          inputType="text"
          inputValue={workoutName}
          inputErrors={nameError}
          handleChange={handleFieldChange}
          placeholder="Push Day, Leg Day..."
          maxLength="25"
          />
        </FormField>
        <FormField
          name="workoutDuration"
          label="Duration (min)"
          formError={nameError}
        >
          <FormInput
            name="workoutDuration"
            inputType="number"
            inputValue={workoutDuration}
            inputErrors={nameError}
            handleChange={handleFieldChange}
            placeholder="0"
          />
        </FormField>
      </div>
    </div>
  );
}