import { useWorkoutsCreatorContext } from "../../hooks/useWorkoutsCreator"
import { FormField }  from "../../../../components/FormField"
import { FormInput } from "../../../../components/FormInput"

export function WorkoutsCreatorHeader() {
    const { nameError, workoutName, workoutDuration, handleFieldChange } = useWorkoutsCreatorContext();

    return (
      <div className="flex-col min-width-[300px]">
        <span className="flex flex-col items-center justify-center gap-3">
          <h2 className="mb-2 font-bold">Build Workout</h2>
          <FormField name={workoutName} label={`Workout Name`} formError={nameError}>
            <FormInput 
            name="workoutName"
            inputType="text"
            inputValue={workoutName}
            inputErrors={nameError}
            handleChange={handleFieldChange}
            placeholder="Enter workout name..."
            maxLength="25" 
            />
          </FormField>
          <FormField name={"workoutDuration"} label={`Workout Duration(min)`} formError={nameError}>
            <FormInput 
            name={"workoutDuration"}
            inputType="number"
            inputValue={workoutDuration}
            inputErrors={nameError}
            handleChange={handleFieldChange}
            placeholder="0"
            styling={'w-[80px] mx-auto text-center'}
            maxLength="5" 
            />
          </FormField>
        </span>
      </div>
    )
}