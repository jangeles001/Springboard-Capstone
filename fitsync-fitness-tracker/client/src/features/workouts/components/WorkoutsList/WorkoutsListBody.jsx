import { useWorkoutsListContext } from "../../hooks/useWorkoutsListContext"
import Exercise from "./exercise";
import { WorkoutsListRemoveButton } from "./WorkoutsListRemoveButton";

export function WorkoutsListBody({ withRemoveButton = false}) {
  
  // Store state
  const { workoutsList } = useWorkoutsListContext();

  return (
    <>
      {workoutsList?.length === 0 ? (
        <p className="text-gray-200">No workouts created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {workoutsList?.map((workoutArray, workoutIndex) => (
            <div
              key={workoutIndex}
              className="flex flex-col bg-white rounded-2xl shadow-md p-6 border border-gray-200"
            >
              {console.log(workoutArray)}
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {workoutArray?.workoutName}
              </h2>

              <div className="flex flex-col gap-3 mb-4">
                {workoutArray?.workouts?.map((exercise) => (
                  <Exercise key={exercise.id} exercise={exercise}/>
                ))}
              </div>

              {withRemoveButton && <WorkoutsListRemoveButton workoutName={workoutArray?.name} />}
            </div>
          ))}
        </div>
      )}
    </>
  );
}