import { useWorkoutsListContext } from "../../hooks/useWorkoutsListContext"
import { WorkoutsListRemoveButton } from "./WorkoutsListRemoveButton";
import Exercise from "./exercise";
import Loading from "../../../../components/Loading";

export function WorkoutsListBody({ withRemoveButton = false}) {
  
  // Store state
  const { data, isLoading, isError, error } = useWorkoutsListContext();
  console.log(data);

  if(isLoading) return <Loading  type="skeleton"/>
  if(isError) return <>({console.log(error)});</>

  return (
    <>
      {data?.data?.length === 0 ? (
        <p className="text-gray-200">No workouts created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {data?.data?.map((workout) => (
            <div
              key={workout.uuid}
              className="flex flex-col bg-white rounded-2xl shadow-md p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {workout.workoutName}
              </h2>

              <div className="flex flex-col gap-3 mb-4">
                {workout.exercises.map((exercise) => ( // TODO: Limit to only 3 exercises and add total exercises and creation date to card.
                  <Exercise key={exercise.exerciseId} exercise={exercise}/>
                ))}
              </div>

              {withRemoveButton && <WorkoutsListRemoveButton workoutUUID={workout.uuid} />}
            </div>
          ))}
        </div>
      )}
    </>
  );
}