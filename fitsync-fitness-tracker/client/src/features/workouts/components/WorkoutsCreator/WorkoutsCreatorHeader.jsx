import { useWorkoutsCreatorContext } from "../../hooks/useWorkoutsCreator"

export function WorkoutsCreatorHeader() {
    const { workoutName, handleChange } = useWorkoutsCreatorContext();

    return (
        <>
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
        </>
    )
}