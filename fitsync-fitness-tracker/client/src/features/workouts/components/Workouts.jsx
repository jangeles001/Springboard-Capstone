export default function WorkoutsList({ workouts, onRemoveWorkout }) {
  return (
    <div className="flex flex-col items-center w-full bg-gradient-to-r from-blue-500 to-indigo-600 py-10 px-5">
      <h1 className="text-4xl font-bold text-white mb-8">Your Workouts</h1>
      {workouts?.length === 0 ? (
        <p className="text-gray-200">No workouts created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {workouts?.map((workoutArray, workoutIndex) => (
            <div
              key={workoutIndex}
              className="flex flex-col bg-white rounded-2xl shadow-md p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {workoutArray?.name}
              </h2>

              <div className="flex flex-col gap-3 mb-4">
                {workoutArray?.workouts?.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex flex-col bg-gray-100 rounded-xl p-3 border border-gray-300"
                  >
                    <h3 className="text-md font-medium text-gray-800">
                      {exercise.translations?.[0]?.name || `Exercise# ${exercise.id}`}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {exercise.translations?.[0]?.description.replace(/<[^>]*>/g, "") || "No description provided"}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onRemoveWorkout(workoutArray?.name)}
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