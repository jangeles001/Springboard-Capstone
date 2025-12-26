import { useWorkoutsListContext } from "../../hooks/useWorkoutsListContext"
import Exercise from "./exercise";
import Loading from "../../../../components/Loading";
import ThemedButton from "../../../../components/ThemedButton";

export function WorkoutsListBody() {
  
  // Store state
  const { data, isLoading, isError, error, workoutClick, deleteWorkout } = useWorkoutsListContext();

  if(isLoading) return <Loading  type="skeleton"/>
  if(isError) return <>{console.log(error)}</>

  return (
    <>
      {data?.data?.workouts?.length === 0 ? (
        <p className="text-gray-500 mx-auto mt-[50px]">No workouts created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ml-5 h-min min-w-md max-w-md md:max-w-2xl lg:max-w-6xl">
          {data?.data?.workouts?.map((workout) => (
            <div
              key={workout.uuid}
              className="flex flex-col bg-white rounded-2xl shadow-md p-6 border border-gray-200"
            >
              <h2 
              className="text-xl font-semibold text-gray-800 mb-4 hover:cursor-pointer"
              onClick={() => workoutClick(workout.uuid)}
              >
                {workout.workoutName}
              </h2>

              <div className="flex flex-col gap-3 mb-4">
                {workout.exercises.slice(0,3).map((exercise) => ( // TODO: Limit to only 3 exercises and add total exercises and creation date to card.
                  <div key={exercise.exerciseId}>
                    <Exercise exercise={exercise}/>
                  </div>
                ))}
                {workout.exercises.length > 3 && (
                  <p key={`workout${workout.uuid}`} className="text-sm text-gray-500">
                    + {workout.exercises.length - 3} more exercises
                  </p>
                )}
              </div>

              <ThemedButton text="Delete Workout" onClick={() => deleteWorkout(workout.uuid)} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}