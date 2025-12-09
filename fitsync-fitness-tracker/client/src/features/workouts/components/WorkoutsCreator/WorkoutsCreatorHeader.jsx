import { useWorkoutsCreatorContext } from "../../hooks/useWorkoutsCreator"

export function WorkoutsCreatorHeader() {
    const { workoutName, handleChange } = useWorkoutsCreatorContext();

    return (
      <div className="flex-col min-width-[300px]">
        <span className="flex flex-col items-center justify-center">
          <h2 className="mb-2 font-bold">Build Workout</h2>
          <label>Workout Name:</label>
          <input
          className='border-1 rounded-xl'
          name='workoutName'
          id='workoutName'
          maxLength='25'
          value={workoutName}
          onChange={handleChange}
          ></input>
        </span>
        <div className="grid grid-cols-6 md:grid-cols-6">
          <span className="flex pl-10 col-span-4">
            <h3 className="bold">Exercise</h3>
          </span>
          <h3 className="flex bold">Sets</h3>
          <h3 className="flex bold">Reps</h3>
        </div>
      </div>
    )
}