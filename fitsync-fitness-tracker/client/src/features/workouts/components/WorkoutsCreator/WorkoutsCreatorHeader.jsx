import { useWorkoutsCreatorContext } from "../../hooks/useWorkoutsCreator"

export function WorkoutsCreatorHeader() {
    const { nameError, workoutName, handleWorkoutNameChange } = useWorkoutsCreatorContext();

    return (
      <div className="flex-col min-width-[300px]">
        <span className="flex flex-col items-center justify-center">
          <h2 className="mb-2 font-bold">Build Workout</h2>
          <label>Workout Name:</label>
          <input
          className={nameError ? `form-input-error`: 'form-input'}
          name='workoutName'
          id='workoutName'
          maxLength='25'
          value={workoutName}
          placeholder="Greatest Workout Ever..."
          onChange={handleWorkoutNameChange}
          ></input>
        </span>
      </div>
    )
}