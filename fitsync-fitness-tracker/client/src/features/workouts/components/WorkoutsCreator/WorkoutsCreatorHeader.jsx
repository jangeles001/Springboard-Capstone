import { useWorkoutsCreatorContext } from "../../hooks/useWorkoutsCreator"

export function WorkoutsCreatorHeader() {
    const { workoutName, handleWorkoutNameChange } = useWorkoutsCreatorContext();

    return (
      <div className="flex-col min-width-[300px]">
        <span className="flex flex-col items-center justify-center">
          <h2 className="mb-2 font-bold">Build Workout</h2>
          <label>Workout Name:</label>
          <input
          className='border-1 rounded-md p-2'
          name='workoutName'
          id='workoutName'
          maxLength='25'
          value={workoutName}
          placeholder="Greatest Workout Ever..."
          onChange={handleWorkoutNameChange}
          ></input>
        </span>
        <div className="grid grid-cols-8 mt-5 pr-8 min-w-auto">
          <span className="flex pl-10 col-span-1">
            <h3 className="flex font-bold">Exercise</h3>
          </span>
          <h3 className="flex col-start-3 col-span-2 justify-center pl-5 font-bold">Reps</h3>
          <h3 className="flex col-span-1 pl-5 font-bold "> Measure Type</h3>
          <h3 className="flex pl-5 col-start-7 font-bold "> Weight/&#13;Duration</h3>
        </div>
      </div>
    )
}