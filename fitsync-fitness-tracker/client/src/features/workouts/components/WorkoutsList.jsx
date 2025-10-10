import { useWorkoutsList, useWorkoutActions } from "../store/WorkoutStore";
import Workout from "./Workout";

export default function WorkoutsList() {
  
  // Store state
  const workoutsList = useWorkoutsList();

  // Store actions
  const { removeFromWorkoutsList }  = useWorkoutActions();

  return (
    <div className="flex flex-col items-center w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-10 px-5">
      <h1 className="text-4xl font-bold text-white mb-8">Your Workouts</h1>
      {workoutsList?.length === 0 ? (
        <p className="text-gray-200">No workouts created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {workoutsList?.map((workoutArray, workoutIndex) => (
            <div
              key={workoutIndex}
              className="flex flex-col bg-white rounded-2xl shadow-md p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {workoutArray?.name}
              </h2>

              <div className="flex flex-col gap-3 mb-4">
                {workoutArray?.workouts?.map((exercise) => (
                  <Workout key={exercise.id} exercise={exercise}/>
                ))}
              </div>

              <button
                onClick={() => removeFromWorkoutsList(workoutArray?.name)}
                className="mt-auto self-start px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm rounded-lg shadow hover:opacity-90 transition"
              >
                Remove Workout
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}